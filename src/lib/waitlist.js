// Talks to the waitlist API (server/core.js), or runs in demo mode.
//
// VITE_WAITLIST_ENDPOINT
//   /api/waitlist           → the API in this project (Vercel, Netlify, or `npm run dev`)
//   https://formspree.io/…  → a form service; confirm/unsubscribe links are then not used
//   (unset)                 → demo mode: nothing leaves the browser
//
// The signup request is a JSON POST:
//   { email, source, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
//     company_website (hidden honeypot), turnstileToken }

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT || '';
// confirm / unsubscribe live next to the waitlist route when it's our own API
const API_BASE = /\/waitlist\/?$/.test(ENDPOINT) ? ENDPOINT.replace(/\/waitlist\/?$/, '') : '';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isDemoMode = !ENDPOINT;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORE = 'proofy-utm';

// Remember UTM tags from the landing URL for this visit, even after the URL is cleaned up.
export function captureUtm() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl = Object.fromEntries(UTM_KEYS.filter(k => params.get(k)).map(k => [k, params.get(k).slice(0, 100)]));
  try {
    if (Object.keys(fromUrl).length) sessionStorage.setItem(UTM_STORE, JSON.stringify(fromUrl));
    return JSON.parse(sessionStorage.getItem(UTM_STORE) || '{}');
  } catch {
    return fromUrl;
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function postJson(url, body) {
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('We couldn’t reach the server. Check your connection and try again.');
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON reply (some form services) */
  }
  if (!response.ok) {
    if (response.status === 429) throw new Error('Too many attempts. Try again in a few minutes.');
    throw new Error(data?.error || 'Something went wrong on our side. Try again in a minute.');
  }
  return data || { ok: true };
}

// Returns { confirm: boolean }: true when a confirmation email was sent (double opt-in).
export async function joinWaitlist({ email, source, honeypot, turnstileToken }) {
  const clean = String(email || '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(clean)) {
    throw new Error('Enter a full email address, like you@company.com.');
  }

  if (isDemoMode) {
    await wait(900);
    return { confirm: false, demo: true };
  }

  const data = await postJson(ENDPOINT, {
    email: clean,
    source,
    referrer: document.referrer || null,
    ...captureUtm(),
    company_website: honeypot || '',
    turnstileToken: turnstileToken || undefined
  });
  return { confirm: Boolean(data.confirm) };
}

// Email-link actions. Each resolves to a status string from the server.
export async function confirmSignup(token) {
  if (isDemoMode || !API_BASE) {
    await wait(500);
    return 'confirmed';
  }
  const data = await postJson(`${API_BASE}/confirm`, { token });
  return data.status || 'invalid';
}

export async function unsubscribe(token) {
  if (isDemoMode || !API_BASE) {
    await wait(500);
    return 'unsubscribed';
  }
  const data = await postJson(`${API_BASE}/unsubscribe`, { token });
  return data.status || 'invalid';
}
