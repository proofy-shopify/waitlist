-- Proofy waitlist schema.
-- Run once in Supabase: Dashboard → SQL Editor → paste this file → Run
-- (or `supabase db push` if you use the Supabase CLI).
--
-- Everything here is only reachable with the server-side secret / service_role key.
-- Row Level Security is on with no policies, and the functions can't be called with the
-- public (anon/publishable) key, so nothing is exposed to the browser.

-- ───────────────────────── Signups ─────────────────────────
create table if not exists public.waitlist (
  id                 bigint generated always as identity primary key,
  email              text not null unique,
  source             text,                 -- which form on the page ('hero', …)
  referrer           text,                 -- document.referrer when they signed up
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  utm_term           text,
  ip_hash            text,                 -- salted SHA-256 of the IP, never the raw IP
  token_hash         text not null unique, -- SHA-256 of the token in the email links
  created_at         timestamptz not null default now(),
  confirmed_at       timestamptz,          -- set when they click the confirmation link
  unsubscribed_at    timestamptz,          -- set when they unsubscribe
  last_email_at      timestamptz,          -- last time we emailed them (limits resends)
  constraint waitlist_email_lowercase check (email = lower(email)),
  constraint waitlist_email_shape check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and length(email) <= 254)
);

alter table public.waitlist add column if not exists last_email_at timestamptz;

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

-- ───────────────────────── Rate limiting ─────────────────────────
-- One row per hashed IP: a fixed window counter.
create table if not exists public.waitlist_rate_limits (
  key           text primary key,
  window_start  timestamptz not null default now(),
  hits          integer not null default 0
);

alter table public.waitlist_rate_limits enable row level security;

-- Counts one attempt for p_key and returns true while it's within p_limit per p_window_seconds.
create or replace function public.waitlist_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  current_hits integer;
begin
  insert into waitlist_rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update
    set hits = case
                 when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
                 else r.hits + 1
               end,
        window_start = case
                 when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
                 else r.window_start
               end
  returning hits into current_hits;

  -- Opportunistic cleanup so the table stays small.
  if random() < 0.02 then
    delete from waitlist_rate_limits where window_start < now() - interval '1 day';
  end if;

  return current_hits <= p_limit;
end;
$$;

-- ───────────────────────── Email link actions ─────────────────────────
-- Both take the SHA-256 hash of the token from the email link (the raw token is never stored).

-- Returns 'confirmed', 'already' or 'invalid'.
create or replace function public.waitlist_confirm(p_token_hash text)
returns text
language plpgsql
set search_path = public
as $$
declare
  row_confirmed timestamptz;
begin
  select confirmed_at into row_confirmed from waitlist where token_hash = p_token_hash;
  if not found then
    return 'invalid';
  end if;
  if row_confirmed is not null then
    -- Clicking confirm again after unsubscribing re-subscribes them.
    update waitlist set unsubscribed_at = null where token_hash = p_token_hash;
    return 'already';
  end if;
  update waitlist set confirmed_at = now(), unsubscribed_at = null where token_hash = p_token_hash;
  return 'confirmed';
end;
$$;

-- Returns 'unsubscribed', 'already' or 'invalid'.
create or replace function public.waitlist_unsubscribe(p_token_hash text)
returns text
language plpgsql
set search_path = public
as $$
declare
  row_unsub timestamptz;
begin
  select unsubscribed_at into row_unsub from waitlist where token_hash = p_token_hash;
  if not found then
    return 'invalid';
  end if;
  if row_unsub is not null then
    return 'already';
  end if;
  update waitlist set unsubscribed_at = now() where token_hash = p_token_hash;
  return 'unsubscribed';
end;
$$;

-- Only the server (service_role / secret key) may call these.
revoke all on function public.waitlist_rate_limit(text, integer, integer) from public;
revoke all on function public.waitlist_confirm(text) from public;
revoke all on function public.waitlist_unsubscribe(text) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.waitlist_rate_limit(text, integer, integer) from anon, authenticated';
    execute 'revoke all on function public.waitlist_confirm(text) from anon, authenticated';
    execute 'revoke all on function public.waitlist_unsubscribe(text) from anon, authenticated';
    execute 'revoke all on table public.waitlist from anon, authenticated';
    execute 'revoke all on table public.waitlist_rate_limits from anon, authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.waitlist_rate_limit(text, integer, integer) to service_role';
    execute 'grant execute on function public.waitlist_confirm(text) to service_role';
    execute 'grant execute on function public.waitlist_unsubscribe(text) to service_role';
    execute 'grant select, insert, update, delete on table public.waitlist to service_role';
    execute 'grant select, insert, update, delete on table public.waitlist_rate_limits to service_role';
  end if;
end;
$$;

-- ───────────────────────── Handy view for you ─────────────────────────
-- Active, confirmed signups in the order they joined (use this when sending invites).
create or replace view public.waitlist_active as
  select id, email, source, utm_source, utm_campaign, created_at, confirmed_at
  from public.waitlist
  where confirmed_at is not null and unsubscribed_at is null
  order by created_at;

revoke all on public.waitlist_active from public;
