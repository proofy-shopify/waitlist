// Server-side settings, read from environment variables.
// None of these may start with VITE_ — anything prefixed VITE_ is bundled into the browser code.

const bool = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  return !['0', 'false', 'no', 'off'].includes(String(value).trim().toLowerCase());
};

const int = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function readConfig(env = {}) {
  const siteUrl = (env.SITE_URL || '').replace(/\/+$/, '');
  return {
    supabaseUrl: (env.SUPABASE_URL || '').replace(/\/+$/, ''),
    // New-style "sb_secret_..." key, or the legacy service_role key.
    supabaseKey: env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '',
    resendKey: env.RESEND_API_KEY || '',
    mailFrom: env.MAIL_FROM || '',
    mailReplyTo: env.MAIL_REPLY_TO || '',
    siteUrl,
    ipSalt: env.IP_HASH_SALT || '',
    doubleOptIn: bool(env.DOUBLE_OPT_IN, true),
    turnstileSecret: env.TURNSTILE_SECRET_KEY || '',
    allowedOrigins: (env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(s => s.trim().replace(/\/+$/, ''))
      .filter(Boolean),
    rateLimit: int(env.RATE_LIMIT_MAX, 5),
    rateWindowSeconds: int(env.RATE_LIMIT_WINDOW_SECONDS, 600),
    resendCooldownSeconds: int(env.RESEND_COOLDOWN_SECONDS, 600)
  };
}

export function missingConfig(cfg) {
  const missing = [];
  if (!cfg.supabaseUrl) missing.push('SUPABASE_URL');
  if (!cfg.supabaseKey) missing.push('SUPABASE_SECRET_KEY');
  if (!cfg.siteUrl) missing.push('SITE_URL');
  return missing;
}
