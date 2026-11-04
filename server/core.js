// Waitlist API, written against the Web-standard Request/Response so the same code runs on
// Vercel, Netlify and the Vite dev server (see api/, netlify/functions/ and vite.config.js).
//
// Routes:
//   POST /api/waitlist     { email, source, referrer, utm_*, company_website, turnstileToken }
//   POST /api/confirm      { token }                       → { ok, status: confirmed|already|invalid }
//   GET  /api/confirm?token=…                              → redirects to the site, which confirms
//   POST /api/unsubscribe  { token }  or one-click (RFC 8058, token in the query string)
//   GET  /api/unsubscribe?token=…                          → redirects to the site, which asks first

import { createHash, randomBytes } from 'node:crypto';
import { readConfig, missingConfig } from './config.js';
import { rpc, insertSignup, findByEmail, updateById } from './supabase.js';
import { confirmEmail, welcomeEmail, sendEmail } from './email.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 4096;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,100}$/;

const sha256 = value => createHash('sha256').update(value).digest('hex');
const newToken = () => randomBytes(32).toString('base64url');
const clip = (value, max) => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null);
const mask = email => email.replace(/^(.).*?(@.*)$/, '$1***$2');

function clientIp(request, ctx) {
  if (ctx?.ip) return ctx.ip;
  const h = request.headers;
  const forwarded = h.get('x-forwarded-for');
  return (
    (forwarded && forwarded.split(',')[0].trim()) ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    h.get('x-nf-client-connection-ip') ||
    ''
  );
}

// The site itself (SITE_URL) and anything in ALLOWED_ORIGINS may call the API from the browser.
function corsHeaders(request, cfg) {
  const origin = request.headers.get('origin');
  const clean = origin ? origin.replace(/\/+$/, '') : '';
  if (!clean || !(cfg.allowedOrigins.includes(clean) || clean === cfg.siteUrl)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(request, cfg, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders(request, cfg) }
  });
}

// Requests from another site are refused unless that origin is listed in ALLOWED_ORIGINS.
function originAllowed(request, cfg) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // same-origin form posts, curl, mail providers
  const clean = origin.replace(/\/+$/, '');
  if (cfg.allowedOrigins.includes(clean)) return true;
  if (cfg.siteUrl && clean === cfg.siteUrl) return true;
  try {
    return new URL(request.url).origin === clean;
  } catch {
    return false;
  }
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return { tooLarge: true };
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try {
      return { data: JSON.parse(text || '{}') };
    } catch {
      return { data: null };
    }
  }
  return { data: Object.fromEntries(new URLSearchParams(text)) };
}

async function verifyTurnstile(cfg, token, ip) {
  if (!cfg.turnstileSecret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret: cfg.turnstileSecret, response: token });
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[waitlist] Turnstile check failed', err);
    return false;
  }
}

function links(cfg, token) {
  return {
    confirmUrl: `${cfg.siteUrl}/api/confirm?token=${token}`,
    unsubscribeUrl: `${cfg.siteUrl}/api/unsubscribe?token=${token}`
  };
}

async function emailSignup(cfg, email, token) {
  const { confirmUrl, unsubscribeUrl } = links(cfg, token);
  const message = cfg.doubleOptIn ? confirmEmail(cfg, { confirmUrl, unsubscribeUrl }) : welcomeEmail(cfg, { unsubscribeUrl });
  return sendEmail(cfg, { to: email, ...message, unsubscribeUrl, idempotencyKey: `waitlist-${sha256(token).slice(0, 32)}` });
}

const SERVER_ERROR = 'Something went wrong on our side. Try again in a minute.';

/* ───────────────────────── POST /api/waitlist ───────────────────────── */
export async function handleWaitlist(request, env, ctx = {}) {
  const cfg = readConfig(env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, cfg) });
  if (request.method !== 'POST') return json(request, cfg, 405, { ok: false, error: 'Method not allowed.' });
  if (!originAllowed(request, cfg)) return json(request, cfg, 403, { ok: false, error: 'Not allowed from this site.' });

  const missing = missingConfig(cfg);
  if (missing.length) {
    console.error(`[waitlist] Missing environment variables: ${missing.join(', ')}`);
    return json(request, cfg, 500, { ok: false, error: SERVER_ERROR });
  }

  const { data, tooLarge } = await readBody(request);
  if (tooLarge) return json(request, cfg, 413, { ok: false, error: 'Request too large.' });
  if (!data || typeof data !== 'object') return json(request, cfg, 400, { ok: false, error: 'Invalid request.' });

  // Hidden field only bots fill in: pretend it worked.
  if (clip(data.company_website, 200)) return json(request, cfg, 200, { ok: true, confirm: cfg.doubleOptIn });

  const email = String(data.email || '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(request, cfg, 400, { ok: false, error: 'Enter a full email address, like you@company.com.' });
  }

  const ip = clientIp(request, ctx);
  if (!(await verifyTurnstile(cfg, data.turnstileToken, ip))) {
    return json(request, cfg, 400, { ok: false, error: 'We couldn’t verify you’re human. Refresh the page and try again.' });
  }

  try {
    const ipHash = ip ? sha256(`${cfg.ipSalt || cfg.supabaseUrl}:${ip}`) : null;
    if (ipHash) {
      const allowed = await rpc(cfg, 'waitlist_rate_limit', {
        p_key: ipHash,
        p_limit: cfg.rateLimit,
        p_window_seconds: cfg.rateWindowSeconds
      });
      if (allowed === false) {
        return json(request, cfg, 429, { ok: false, error: 'Too many attempts. Try again in a few minutes.' });
      }
    }

    const token = newToken();
    const now = new Date().toISOString();
    const inserted = await insertSignup(cfg, {
      email,
      source: clip(data.source, 40),
      referrer: clip(data.referrer, 500),
      utm_source: clip(data.utm_source, 100),
      utm_medium: clip(data.utm_medium, 100),
      utm_campaign: clip(data.utm_campaign, 100),
      utm_content: clip(data.utm_content, 100),
      utm_term: clip(data.utm_term, 100),
      ip_hash: ipHash,
      token_hash: sha256(token),
      confirmed_at: cfg.doubleOptIn ? null : now,
      last_email_at: now
    });

    if (inserted) {
      try {
        await emailSignup(cfg, email, token);
      } catch (err) {
        // Keep the signup; they can submit again to get a new link once the cooldown passes.
        console.error(`[waitlist] Email to ${mask(email)} failed`, err);
        await updateById(cfg, inserted.id, { last_email_at: null }).catch(() => {});
      }
    } else if (cfg.doubleOptIn) {
      // Already signed up. If they never confirmed, send a fresh link (at most once per cooldown).
      const existing = await findByEmail(cfg, email);
      const last = existing?.last_email_at ? Date.parse(existing.last_email_at) : 0;
      const cooledDown = Date.now() - last > cfg.resendCooldownSeconds * 1000;
      if (existing && !existing.confirmed_at && !existing.unsubscribed_at && cooledDown) {
        const fresh = newToken();
        await updateById(cfg, existing.id, { token_hash: sha256(fresh), last_email_at: new Date().toISOString() });
        await emailSignup(cfg, email, fresh).catch(err => console.error(`[waitlist] Resend to ${mask(email)} failed`, err));
      }
    }

    // Same answer whether or not the email was already on the list, so nobody can probe who signed up.
    return json(request, cfg, 200, { ok: true, confirm: cfg.doubleOptIn });
  } catch (err) {
    console.error('[waitlist] Signup failed', err);
    return json(request, cfg, 500, { ok: false, error: SERVER_ERROR });
  }
}

/* ───────────────────────── /api/confirm ───────────────────────── */
export async function handleConfirm(request, env) {
  const cfg = readConfig(env);
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, cfg) });

  // Email link: send them to the site, which confirms with a POST. (Link scanners that only
  // fetch the URL don't run JavaScript, so they can't confirm on someone's behalf.)
  if (request.method === 'GET') {
    const token = url.searchParams.get('token') || '';
    return Response.redirect(`${cfg.siteUrl || url.origin}/?confirm=${encodeURIComponent(token)}`, 303);
  }
  if (request.method !== 'POST') return json(request, cfg, 405, { ok: false, error: 'Method not allowed.' });
  if (!originAllowed(request, cfg)) return json(request, cfg, 403, { ok: false, error: 'Not allowed from this site.' });

  const { data } = await readBody(request);
  const token = String(data?.token || '');
  if (!TOKEN_PATTERN.test(token)) return json(request, cfg, 200, { ok: true, status: 'invalid' });
  try {
    const status = await rpc(cfg, 'waitlist_confirm', { p_token_hash: sha256(token) });
    return json(request, cfg, 200, { ok: true, status });
  } catch (err) {
    console.error('[waitlist] Confirm failed', err);
    return json(request, cfg, 500, { ok: false, error: SERVER_ERROR });
  }
}

/* ───────────────────────── /api/unsubscribe ───────────────────────── */
export async function handleUnsubscribe(request, env) {
  const cfg = readConfig(env);
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, cfg) });

  // Footer link: show a page that asks before unsubscribing (scanners can't unsubscribe people).
  if (request.method === 'GET') {
    const token = url.searchParams.get('token') || '';
    return Response.redirect(`${cfg.siteUrl || url.origin}/?unsubscribe=${encodeURIComponent(token)}`, 303);
  }
  if (request.method !== 'POST') return json(request, cfg, 405, { ok: false, error: 'Method not allowed.' });

  // One-click unsubscribe from Gmail/Yahoo posts "List-Unsubscribe=One-Click" with the token in the URL.
  const { data } = await readBody(request);
  const token = String(url.searchParams.get('token') || data?.token || '');
  if (!data?.['List-Unsubscribe'] && !originAllowed(request, cfg)) {
    return json(request, cfg, 403, { ok: false, error: 'Not allowed from this site.' });
  }
  if (!TOKEN_PATTERN.test(token)) return json(request, cfg, 200, { ok: true, status: 'invalid' });
  try {
    const status = await rpc(cfg, 'waitlist_unsubscribe', { p_token_hash: sha256(token) });
    return json(request, cfg, 200, { ok: true, status });
  } catch (err) {
    console.error('[waitlist] Unsubscribe failed', err);
    return json(request, cfg, 500, { ok: false, error: SERVER_ERROR });
  }
}

/* ───────────────────────── Router (used by the Vite dev server) ───────────────────────── */
export function route(request, env, ctx) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/waitlist') return handleWaitlist(request, env, ctx);
  if (pathname === '/api/confirm') return handleConfirm(request, env, ctx);
  if (pathname === '/api/unsubscribe') return handleUnsubscribe(request, env, ctx);
  return null;
}
