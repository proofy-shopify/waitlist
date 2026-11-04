# Proofy waitlist

A one-screen Vite + React waitlist page for Proofy, the Shopify app that turns positive comments on your
Meta (Facebook and Instagram) ads into reviews on your store. Built with components from
[React Bits](https://reactbits.dev).

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build in dist/
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages or any static host. For a no-setup preview, drag the
`dist` folder onto https://app.netlify.com/drop.

## Waitlist backend

The project includes a complete backend: Supabase for storage, Resend for email, and serverless
functions that run on Vercel (`api/`) or Netlify (`netlify/functions/`). It has double opt-in,
one-click unsubscribe, IP rate limiting, an optional Cloudflare Turnstile bot check and UTM tracking.
All the logic is in `server/`; the database schema is `supabase/migrations/`.

**Setup steps are in [SETUP.md](SETUP.md).** Without `VITE_WAITLIST_ENDPOINT` the page runs in demo
mode and nothing leaves the browser.

```bash
npm test   # 18 API tests against a real Postgres (PGlite), no accounts needed
```

## Edit the copy

Everything is in `src/content.js`: badge, headline (dark + grey halves), subtitle, button label, the
"how it works" line, captions under the frame, and the success modal.


## Comment → review slider

Under the email field, `src/components/CommentTransitions.jsx` runs a horizontal LogoLoop of pairs: a
realistic Instagram or Facebook ad comment tagged "Picked", an arrow, and the store review Proofy makes from
it. It's decorative only (hidden from screen readers), pauses on hover, and visitors can drag or swipe it
sideways or scroll it with a mouse wheel or trackpad (the auto-slide resumes afterwards). Wheel support (with a smooth
ease-out after you stop scrolling) is a small `wheel` prop added to React Bits' LogoLoop; tune how long it
glides with `WHEEL_TAU` at the top of `LogoLoop.jsx`. Edit the pairs in `transitions` in
`src/content.js`; `platform` picks the Instagram or Facebook look. All people and stores are made up.

## Font

The page asks for **SF Pro Display / SF Pro Text** first via the system font stack (`-apple-system`), so
visitors on Apple devices see SF Pro. Apple's license doesn't allow SF Pro to be served as a web font to
other platforms, so **Inter** (the closest open match) is bundled as the fallback for Windows, Android and
Linux. Change the stack in `--f-display` / `--f-text` at the top of `src/styles.css`.

## Backgrounds

The page behind the frame is a plain CSS sky-blue gradient (`.page-backdrop`).

| Where | React Bits component |
| --- | --- |
| Inside the frame | Grainient (icy blue gradient with grain) |

## Other React Bits components

| Component | Where |
| --- | --- |
| BlurText | Headline entrance (with an added `as` prop so it renders inside the `<h1>`) |
| LogoLoop | Comment → review slider |

The "proofy · coming soon" badge's metallic shine is plain CSS (`.badge__shine` in `src/styles.css`).

All live in `src/components/reactbits/`, copied from the React Bits source (MIT + Commons Clause).

## Structure

```
api/                       Vercel functions (thin wrappers)
netlify/functions/         Netlify functions (thin wrappers)
server/                    waitlist API: core.js, supabase.js, email.js, config.js
supabase/migrations/       database schema
tests/                     API tests
src/
  App.jsx                  page
  content.js               all copy
  styles.css               design tokens + layout
  lib/waitlist.js          form submission
  components/
    Backgrounds.jsx        page backdrop + frame scene
    WaitlistForm.jsx       email form + joined state
    SuccessModal.jsx       "added to our waitlist" dialog
    CommentTransitions.jsx comment → review slider under the form
    BrandIcon.jsx          Meta / Facebook / Instagram / Shopify glyphs
    reactbits/
```

`SINGLE=1 npm run build` produces a single self-contained HTML file in `dist-single/`.
