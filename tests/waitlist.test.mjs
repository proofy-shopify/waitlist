// End-to-end tests for the waitlist API.
// Supabase is emulated by running the real migration in PGlite (Postgres compiled to WebAssembly)
// behind a fake fetch that speaks the few PostgREST calls server/supabase.js makes.
// Resend and Turnstile calls are intercepted and recorded. Run with: npm test

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { handleWaitlist, handleConfirm, handleUnsubscribe } from '../server/core.js';

const MIGRATION = readFileSync(new URL('../supabase/migrations/20261104120000_waitlist.sql', import.meta.url), 'utf8');
const SUPABASE = 'https://test.supabase.co';
const SITE = 'https://proofy.test';
const sha256 = v => createHash('sha256').update(v).digest('hex');

let db;
let emails;
let supabaseCalls;
let supabaseDown;
let resendFails;

const baseEnv = {
  SUPABASE_URL: SUPABASE,
  SUPABASE_SECRET_KEY: 'sb_secret_test',
  RESEND_API_KEY: 're_test',
  MAIL_FROM: 'Proofy <hello@proofy.test>',
  SITE_URL: SITE,
  IP_HASH_SALT: 'salt'
};

const RPC_ARGS = {
  waitlist_rate_limit: ['p_key', 'p_limit', 'p_window_seconds'],
  waitlist_confirm: ['p_token_hash'],
  waitlist_unsubscribe: ['p_token_hash']
};

async function fakeSupabase(url, init) {
  supabaseCalls.push({ url: url.toString(), headers: init.headers });
  if (supabaseDown) return new Response('{"message":"down"}', { status: 503 });
  const u = new URL(url);
  const path = u.pathname.replace('/rest/v1/', '');
  const body = init.body ? JSON.parse(init.body) : null;
  const ok = data => new Response(data === undefined ? '' : JSON.stringify(data), { status: 200 });

  if (path.startsWith('rpc/')) {
    const fn = path.slice(4);
    const names = RPC_ARGS[fn];
    const { rows } = await db.query(`select ${fn}(${names.map((_, i) => `$${i + 1}`).join(',')}) as r`, names.map(n => body[n]));
    return ok(rows[0].r);
  }
  if (path === 'waitlist' && init.method === 'POST') {
    assert.equal(u.searchParams.get('on_conflict'), 'email');
    assert.match(init.headers.Prefer, /resolution=ignore-duplicates/);
    const cols = Object.keys(body);
    const { rows } = await db.query(
      `insert into waitlist (${cols.join(',')}) values (${cols.map((_, i) => `$${i + 1}`).join(',')})
       on conflict (email) do nothing returning *`,
      cols.map(c => body[c])
    );
    return ok(rows);
  }
  if (path === 'waitlist' && init.method === 'GET') {
    const email = u.searchParams.get('email').replace(/^eq\./, '');
    const { rows } = await db.query(`select id, confirmed_at, unsubscribed_at, last_email_at from waitlist where email = $1`, [email]);
    return ok(rows.map(r => ({ ...r, id: Number(r.id) })));
  }
  if (path === 'waitlist' && init.method === 'PATCH') {
    const id = u.searchParams.get('id').replace(/^eq\./, '');
    const cols = Object.keys(body);
    await db.query(`update waitlist set ${cols.map((c, i) => `${c} = $${i + 1}`).join(',')} where id = $${cols.length + 1}`, [
      ...cols.map(c => body[c]),
      id
    ]);
    return ok();
  }
  throw new Error(`Unexpected Supabase call ${init.method} ${url}`);
}

globalThis.fetch = async (url, init = {}) => {
  const s = url.toString();
  if (s.startsWith(SUPABASE)) return fakeSupabase(url, init);
  if (s === 'https://api.resend.com/emails') {
    if (resendFails) return new Response('{"message":"nope"}', { status: 500 });
    emails.push({ ...JSON.parse(init.body), requestHeaders: init.headers });
    return new Response('{"id":"email_1"}', { status: 200 });
  }
  if (s.startsWith('https://challenges.cloudflare.com/turnstile')) {
    const token = new URLSearchParams(init.body.toString()).get('response');
    return new Response(JSON.stringify({ success: token === 'good-token' }), { status: 200 });
  }
  throw new Error(`Unexpected fetch ${s}`);
};

beforeEach(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;`);
  await db.exec(MIGRATION);
  emails = [];
  supabaseCalls = [];
  supabaseDown = false;
  resendFails = false;
});

const signup = (payload, { env = baseEnv, ip = '203.0.113.7', headers = {} } = {}) =>
  handleWaitlist(
    new Request(`${SITE}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers },
      body: JSON.stringify(payload)
    }),
    env,
    { ip }
  );

const rows = async () => (await db.query('select * from waitlist order by id')).rows;
const tokenFrom = email => new URL(email.html.match(/href="([^"]*\/api\/confirm\?token=[^"]*)"/)[1].replace(/&amp;/g, '&')).searchParams.get('token');

test('new signup is stored, normalized and gets a confirmation email', async () => {
  const res = await signup({ email: '  Owner@MyStore.COM ', source: 'hero', utm_source: 'meta', utm_campaign: 'launch' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, confirm: true });

  const [row] = await rows();
  assert.equal(row.email, 'owner@mystore.com');
  assert.equal(row.source, 'hero');
  assert.equal(row.utm_source, 'meta');
  assert.equal(row.utm_campaign, 'launch');
  assert.equal(row.confirmed_at, null);
  assert.ok(row.ip_hash && !row.ip_hash.includes('203.0.113.7'), 'stores a hash, not the IP');

  assert.equal(emails.length, 1);
  const mail = emails[0];
  assert.deepEqual(mail.to, ['owner@mystore.com']);
  assert.match(mail.subject, /Confirm your spot/);
  assert.match(mail.html, /Confirm my spot/);
  assert.match(mail.requestHeaders['Idempotency-Key'], /^waitlist-/);
  assert.equal(mail.requestHeaders.Authorization, 'Bearer re_test');
  assert.match(mail.text, /api\/confirm\?token=/);
  const token = tokenFrom(mail);
  assert.equal(sha256(token), row.token_hash, 'only the token hash is stored');
  assert.equal(mail.headers['List-Unsubscribe'], `<${SITE}/api/unsubscribe?token=${token}>`);
  assert.equal(mail.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  assert.match(mail.html, /Unsubscribe<\/a>/);
});

test('new secret keys go in the apikey header only; legacy keys also use Authorization', async () => {
  await signup({ email: 'a@shop.com' });
  assert.ok(supabaseCalls.every(c => c.headers.apikey === 'sb_secret_test' && !c.headers.Authorization));

  supabaseCalls = [];
  const legacyEnv = { ...baseEnv, SUPABASE_SECRET_KEY: '', SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOi.legacy' };
  await signup({ email: 'b@shop.com' }, { env: legacyEnv });
  assert.ok(supabaseCalls.every(c => c.headers.Authorization === 'Bearer eyJhbGciOi.legacy'));
});

test('signing up twice gives the same answer and no extra email during the cooldown', async () => {
  await signup({ email: 'dup@shop.com' });
  const res = await signup({ email: 'DUP@shop.com' });
  assert.deepEqual(await res.json(), { ok: true, confirm: true });
  assert.equal((await rows()).length, 1);
  assert.equal(emails.length, 1);
});

test('an unconfirmed duplicate after the cooldown gets a fresh link; the old link stops working', async () => {
  await signup({ email: 'lost@shop.com' });
  const oldToken = tokenFrom(emails[0]);
  await db.query(`update waitlist set last_email_at = now() - interval '11 minutes'`);
  await signup({ email: 'lost@shop.com' });
  assert.equal(emails.length, 2);
  const newToken = tokenFrom(emails[1]);
  assert.notEqual(newToken, oldToken);
  const [row] = await rows();
  assert.equal(row.token_hash, sha256(newToken));
});

test('confirmed people are never re-emailed on a duplicate signup', async () => {
  await signup({ email: 'done@shop.com' });
  await db.query(`update waitlist set confirmed_at = now(), last_email_at = now() - interval '1 day'`);
  await signup({ email: 'done@shop.com' });
  assert.equal(emails.length, 1);
});

const post = (handler, path, body, headers = {}) =>
  handler(
    new Request(`${SITE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers },
      body: JSON.stringify(body)
    }),
    baseEnv
  );

test('confirm link: GET redirects to the site, POST confirms once', async () => {
  await signup({ email: 'c@shop.com' });
  const token = tokenFrom(emails[0]);

  const redirect = await handleConfirm(new Request(`${SITE}/api/confirm?token=${token}`), baseEnv);
  assert.equal(redirect.status, 303);
  assert.equal(redirect.headers.get('location'), `${SITE}/?confirm=${token}`);
  assert.equal((await rows())[0].confirmed_at, null, 'GET alone does not confirm');

  assert.deepEqual(await (await post(handleConfirm, '/api/confirm', { token })).json(), { ok: true, status: 'confirmed' });
  assert.ok((await rows())[0].confirmed_at);
  assert.deepEqual(await (await post(handleConfirm, '/api/confirm', { token })).json(), { ok: true, status: 'already' });
  assert.deepEqual(await (await post(handleConfirm, '/api/confirm', { token: 'x'.repeat(43) })).json(), { ok: true, status: 'invalid' });
  assert.deepEqual(await (await post(handleConfirm, '/api/confirm', { token: 'bad token!' })).json(), { ok: true, status: 'invalid' });
});

test('unsubscribe: GET asks first, POST unsubscribes, one-click from mail providers works', async () => {
  await signup({ email: 'u@shop.com' });
  const token = tokenFrom(emails[0]);

  const redirect = await handleUnsubscribe(new Request(`${SITE}/api/unsubscribe?token=${token}`), baseEnv);
  assert.equal(redirect.headers.get('location'), `${SITE}/?unsubscribe=${token}`);
  assert.equal((await rows())[0].unsubscribed_at, null, 'GET alone does not unsubscribe');

  // RFC 8058 one-click: form body, token in the URL, no Origin header
  const oneClick = await handleUnsubscribe(
    new Request(`${SITE}/api/unsubscribe?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click'
    }),
    baseEnv
  );
  assert.deepEqual(await oneClick.json(), { ok: true, status: 'unsubscribed' });
  assert.ok((await rows())[0].unsubscribed_at);
  assert.deepEqual(await (await post(handleUnsubscribe, '/api/unsubscribe', { token })).json(), { ok: true, status: 'already' });
});

test('honeypot submissions look successful but store nothing', async () => {
  const res = await signup({ email: 'bot@spam.com', company_website: 'http://spam' });
  assert.deepEqual(await res.json(), { ok: true, confirm: true });
  assert.equal((await rows()).length, 0);
  assert.equal(emails.length, 0);
});

test('invalid emails are rejected with a helpful message', async () => {
  for (const email of ['', 'nope', 'a@b', 'a b@c.com', `${'x'.repeat(250)}@shop.com`]) {
    const res = await signup({ email });
    assert.equal(res.status, 400, email);
    assert.match((await res.json()).error, /full email address/);
  }
  assert.equal((await rows()).length, 0);
});

test('rate limit: the 6th attempt from one IP within 10 minutes gets 429', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await signup({ email: `r${i}@shop.com` })).status, 200);
  const blocked = await signup({ email: 'r6@shop.com' });
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error, /Too many attempts/);
  assert.equal((await signup({ email: 'other@shop.com' }, { ip: '198.51.100.9' })).status, 200, 'other IPs unaffected');
});

test('Turnstile is enforced only when TURNSTILE_SECRET_KEY is set', async () => {
  const env = { ...baseEnv, TURNSTILE_SECRET_KEY: 'ts_secret' };
  assert.equal((await signup({ email: 't1@shop.com' }, { env })).status, 400);
  assert.equal((await signup({ email: 't2@shop.com', turnstileToken: 'bad' }, { env })).status, 400);
  assert.equal((await signup({ email: 't3@shop.com', turnstileToken: 'good-token' }, { env })).status, 200);
  assert.equal((await rows()).length, 1);
});

test('requests from other websites are refused unless allowed', async () => {
  const evil = await signup({ email: 'x@shop.com' }, { headers: { Origin: 'https://evil.example' } });
  assert.equal(evil.status, 403);
  const env = { ...baseEnv, ALLOWED_ORIGINS: 'https://www.proofy.test' };
  const allowed = await signup({ email: 'y@shop.com' }, { env, headers: { Origin: 'https://www.proofy.test' } });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://www.proofy.test');
});

test('without double opt-in: confirmed immediately and a welcome email instead', async () => {
  const env = { ...baseEnv, DOUBLE_OPT_IN: 'false' };
  const res = await signup({ email: 'w@shop.com' }, { env });
  assert.deepEqual(await res.json(), { ok: true, confirm: false });
  assert.ok((await rows())[0].confirmed_at);
  assert.match(emails[0].subject, /You’re on the Proofy waitlist/);
  assert.doesNotMatch(emails[0].html, /api\/confirm/);
  assert.match(emails[0].html, /api\/unsubscribe\?token=/);
});

test('if the email provider fails, the signup is kept and they can get a link by trying again', async () => {
  resendFails = true;
  const res = await signup({ email: 'retry@shop.com' });
  assert.equal(res.status, 200);
  assert.equal((await rows())[0].last_email_at, null, 'cooldown cleared');
  resendFails = false;
  await signup({ email: 'retry@shop.com' });
  assert.equal(emails.length, 1, 'second try sends the link right away');
});

test('database outage returns a friendly 500 and leaks no details', async () => {
  supabaseDown = true;
  const res = await signup({ email: 'down@shop.com' });
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.match(body.error, /Something went wrong on our side/);
  assert.doesNotMatch(JSON.stringify(body), /supabase|503/i);
});

test('misconfigured server: 500 and nothing attempted', async () => {
  const res = await signup({ email: 'cfg@shop.com' }, { env: { SITE_URL: SITE } });
  assert.equal(res.status, 500);
  assert.equal(supabaseCalls.length, 0);
});

test('wrong method and oversized bodies are rejected', async () => {
  assert.equal((await handleWaitlist(new Request(`${SITE}/api/waitlist`), baseEnv)).status, 405);
  const big = await signup({ email: 'big@shop.com', referrer: 'x'.repeat(5000) });
  assert.equal(big.status, 413);
});

/* ───────── Cross-domain calls ───────── */

test('the site may call the API from another domain (CORS preflight and response)', async () => {
  const pre = await handleWaitlist(
    new Request('https://api.example.com/api/waitlist', {
      method: 'OPTIONS',
      headers: { Origin: SITE, 'Access-Control-Request-Method': 'POST' }
    }),
    baseEnv
  );
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('access-control-allow-origin'), SITE);
  const res = await handleWaitlist(
    new Request('https://api.example.com/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE },
      body: JSON.stringify({ email: 'cors@shop.com' })
    }),
    baseEnv,
    { ip: '192.0.2.1' }
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), SITE);
});
