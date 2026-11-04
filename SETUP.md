# Waitlist backend setup

About 20 minutes end to end. You need accounts on **Supabase**, **Resend**, and **Vercel or Netlify**
(all have free tiers that cover a waitlist), plus access to your domain's DNS.

## How it works

```
Visitor ──POST /api/waitlist──▶ function ──▶ Supabase (stores signup)
                                   └──────▶ Resend (sends "Confirm your spot")
Email link ──▶ /api/confirm ──▶ page ──POST──▶ function ──▶ Supabase (confirmed_at)
Email footer / Gmail button ──▶ /api/unsubscribe ──▶ function ──▶ Supabase (unsubscribed_at)
```

What the function does on each signup:

1. Checks the email again on the server and lowercases it.
2. Drops bots that fill the hidden field, and (optional) checks Cloudflare Turnstile.
3. Rate-limits by IP: 5 tries per 10 minutes. IPs are stored only as salted hashes.
4. Saves the signup, ignoring duplicates, and returns the same answer either way, so nobody can test
   which emails are on your list.
5. Emails a confirmation link (double opt-in). If someone signs up again before confirming, they get a
   fresh link, at most once every 10 minutes.

Links in emails never act on their own: they open the page, which asks the server. That way email
security scanners that "click" every link can't confirm or unsubscribe people. Gmail and Yahoo's own
**Unsubscribe** button works in one click (the `List-Unsubscribe` headers).

## 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com). A region close to your visitors is best.
2. **SQL Editor → New query**, paste all of `supabase/migrations/20261104_waitlist.sql`, click **Run**.
   It's safe to run again later.
3. **Project Settings → API Keys**: copy the **secret** key (`sb_secret_…`) into `SUPABASE_SECRET_KEY`.
   Older projects can use the legacy `service_role` key in `SUPABASE_SERVICE_ROLE_KEY` instead.
4. **Project Settings → Data API**: copy the project URL into `SUPABASE_URL`.

The tables have Row Level Security on with no policies, and the functions can't be called with the
public key, so only your server can read or write them.

Your list lives in **Table Editor → waitlist**. The `waitlist_active` view lists confirmed, still-subscribed
people in signup order, which is what you'll export when sending invites.

## 2. Resend (email) and your domain's DNS

Send from a subdomain such as `mail.proofy.app`, so waitlist mail can't hurt your main domain's reputation.

1. At [resend.com](https://resend.com): **Domains → Add domain** → `mail.proofy.app`.
2. Add the DNS records Resend shows you at your domain registrar. They cover:
   - **SPF**: a TXT record that lists Resend as allowed to send for the subdomain.
   - **DKIM**: a TXT record with Resend's signing key.
   - **MX** for bounce handling (on a `send.` sub-subdomain, so it doesn't touch your normal email).
3. Add a **DMARC** record if you don't have one yet (it isn't required to verify the domain). Start in monitoring mode:
   - Name: `_dmarc.mail.proofy.app` (or `_dmarc.proofy.app` to cover the whole domain)
   - Type: `TXT`
   - Value: `v=DMARC1; p=none; rua=mailto:you@proofy.app`
   After a couple of weeks of clean reports, tighten `p=none` to `p=quarantine`.
4. Wait for Resend to show the domain as **Verified**, then **API Keys → Create** (sending access only)
   and put it in `RESEND_API_KEY`.
5. Set `MAIL_FROM`, e.g. `Proofy <hello@mail.proofy.app>`. Optionally `MAIL_REPLY_TO` to a real inbox.

Gmail and Yahoo require SPF, DKIM, DMARC and one-click unsubscribe from bulk senders (5,000+ emails a day).
This setup covers all four, so you're ready well before you reach that volume.

## 3. Deploy

### Vercel
1. Push the project to GitHub and **Import** it in Vercel. It detects Vite; keep the defaults.
2. **Settings → Environment Variables**: add everything from `.env.example`.
   `VITE_WAITLIST_ENDPOINT` = `/api/waitlist`, `SITE_URL` = your live URL, no trailing slash.
3. Redeploy. The functions in `api/` go live at `/api/waitlist`, `/api/confirm`, `/api/unsubscribe`.

### Netlify
1. Import the repo. `netlify.toml` already sets the build command and output folder.
2. **Site configuration → Environment variables**: add everything from `.env.example`.
3. Redeploy. The functions in `netlify/functions/` serve the same `/api/*` paths.

Variables starting with `VITE_` are baked into the page at build time, so redeploy after changing them.

## 4. Optional: Cloudflare Turnstile (bot check)

Turn it on only if spam gets past the honeypot and rate limit.

1. Cloudflare dashboard → **Turnstile → Add widget**, add your domain, choose **Managed** mode.
2. Put the **site key** in `VITE_TURNSTILE_SITE_KEY` and the **secret key** in `TURNSTILE_SECRET_KEY`.
3. Redeploy. It stays invisible unless Cloudflare needs the visitor to tick a box.

## 5. Try it

1. Open the live site and sign up with your own email. You should see "Check your inbox".
2. Click **Confirm my spot** in the email: the page should say "You're confirmed".
3. Check Supabase: your row has `confirmed_at` set and your UTM tags if the URL had any
   (try `?utm_source=instagram&utm_campaign=launch`).
4. Click **Unsubscribe** in the email footer, confirm, and check `unsubscribed_at`.

## Run it locally

```bash
cp .env.example .env.local   # fill in your Supabase + Resend values
npm install
npm run dev                  # the page and the /api functions on http://localhost:5173
npm test                     # 17 API tests against a real Postgres (PGlite), no accounts needed
```

Without `RESEND_API_KEY`, emails aren't sent. The full email, including the confirm link, is printed in
the terminal instead, so you can test the whole flow locally.

## Settings

| Variable | Default | What it does |
| --- | --- | --- |
| `DOUBLE_OPT_IN` | `true` | `false` = confirm immediately and send a "You're on the list" email instead |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_SECONDS` | `5` / `600` | Signups allowed per IP per window |
| `RESEND_COOLDOWN_SECONDS` | `600` | Minimum gap before re-sending a confirmation link |
| `ALLOWED_ORIGINS` | none | Other sites allowed to call the API (same domain always works) |

Email copy is in `server/email.js`; pop-up screen copy is `screens` in `src/content.js`.

## No-code alternative

To collect emails without any of the above, set `VITE_WAITLIST_ENDPOINT` to a Formspree form URL
(`https://formspree.io/f/…`). The form works unchanged; Formspree stores the emails and you skip the
database, confirmation emails and unsubscribe links. You can switch to the API later without touching the page.

## Privacy checklist

- Add a privacy policy and put its URL in `privacyUrl` in `src/content.js`. A link appears under the form.
- Every email has an unsubscribe link, and unsubscribing is honored immediately.
- To delete someone on request: Supabase → Table Editor → waitlist → delete their row.
