// Minimal Supabase REST (PostgREST) client using fetch, so it runs on any serverless platform.

const TIMEOUT_MS = 8000;

function headers(cfg, extra = {}) {
  const h = { apikey: cfg.supabaseKey, 'Content-Type': 'application/json', ...extra };
  // New "sb_secret_…" keys go in the apikey header only.
  // Legacy service_role keys are JWTs and also need the Authorization header.
  if (!cfg.supabaseKey.startsWith('sb_')) h.Authorization = `Bearer ${cfg.supabaseKey}`;
  return h;
}

async function call(cfg, path, init) {
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  const text = await res.text();
  if (!res.ok) {
    // PGRST202 = function not found, PGRST205 = table not found: the database setup hasn't been run here.
    const hint = /PGRST20[25]/.test(text)
      ? ' → The waitlist tables/functions are missing in this Supabase project. Run supabase/migrations/20261104120000_waitlist.sql in the SQL Editor of the project that SUPABASE_URL points to.'
      : '';
    const err = new Error(`Supabase ${init.method || 'GET'} ${path.split('?')[0]} failed: ${res.status} ${text.slice(0, 300)}${hint}`);
    err.status = res.status;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

export function rpc(cfg, fn, args) {
  return call(cfg, `rpc/${fn}`, { method: 'POST', headers: headers(cfg), body: JSON.stringify(args) });
}

// Inserts a signup unless the email already exists. Returns the new row, or null for a duplicate.
export async function insertSignup(cfg, row) {
  const rows = await call(cfg, 'waitlist?on_conflict=email', {
    method: 'POST',
    headers: headers(cfg, { Prefer: 'return=representation,resolution=ignore-duplicates' }),
    body: JSON.stringify(row)
  });
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export async function findByEmail(cfg, email) {
  const rows = await call(
    cfg,
    `waitlist?select=id,confirmed_at,unsubscribed_at,last_email_at&email=eq.${encodeURIComponent(email)}&limit=1`,
    { method: 'GET', headers: headers(cfg) }
  );
  return rows?.[0] || null;
}

export function updateById(cfg, id, patch) {
  return call(cfg, `waitlist?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: headers(cfg, { Prefer: 'return=minimal' }),
    body: JSON.stringify(patch)
  });
}
