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

## Pages and SEO

| Address | What it is |
| --- | --- |
| `/` | Homepage: first screen (unchanged design) plus How it works, Why, Features, Guides, FAQ and a final waitlist panel |
| `/shopify-social-proof`, `/facebook-comments-shopify`, `/instagram-comments-shopify`, `/facebook-ads-social-proof` | Landing pages, all from one template (`src/pages/LandingPage.jsx`) with copy in `src/content/landing.js` |
| `/privacy` | Static privacy page (`public/privacy.html`) |
| `/blog`, `/blog/<slug>` | Only built once a post is published (see below) |

- **Routing:** `src/routes.js` lists every page with its title, description and FAQs. `npm run build`
  prerenders each page to `<path>.html` (Vercel's `cleanUrls` and Netlify serve it without `.html`),
  writes `404.html` (served with a real 404 status) and generates `sitemap.xml` from the same list.
  Each page downloads only its own code; links between pages are ordinary links.
- **Head tags and structured data** come from `src/seo.js`: title, description, canonical, robots,
  Open Graph, Twitter card and JSON-LD (Organization, WebSite, WebPage, SoftwareApplication on the
  homepage, BreadcrumbList on inner pages, FAQPage wherever FAQs are shown). Nothing invented: no
  ratings, prices or counts.
- **Preferred address:** `https://www.proofy.site`, set in `src/site.js` and `public/robots.txt`.
  `vercel.json` redirects `proofy.site` to it (except `/api/*`, so email links keep working).
  On Netlify, make `www.proofy.site` the primary domain in Domain management instead.
  Keep `SITE_URL` (server env) on the same address.
- **Homepage H1:** the big tagline ("Your ad comments, now your best reviews.") is still the visual
  headline; the line under it is the page's `<h1>` ("…into Shopify social proof."). Both are in
  `src/content.js`.
- **Blog:** posts live in `src/content/blog.js`. Seven drafts with briefs and outlines are there;
  write a post's `sections`, set `status: 'published'` and a `date`, and rebuild. The post gets its
  own page, BlogPosting structured data, a place on `/blog`, a footer link and a sitemap entry.
- **`public/`** holds the favicon set, `og-image.jpg` (the share picture; `og-image.png` is kept for
  links shared before), `robots.txt` and `privacy.html`.
- **Background animation** runs only on devices with a mouse and pauses when the tab is hidden; phones,
  tablets and "reduce motion" get a still gradient (`src/components/Backgrounds.jsx`).

## Edit the copy

Homepage copy, the homepage sections and FAQs, captions and the success modal are in `src/content.js`.
Landing pages are in `src/content/landing.js`, blog posts in `src/content/blog.js`. In those files,
`[text](/path)` makes a link and `**text**` makes bold text.


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
public/                    favicon, share image, robots.txt, privacy.html (sitemap.xml is generated)
scripts/prerender.mjs      writes the page HTML into the build
src/
  entry-server.jsx         build-time render used by the prerender step
  main.jsx                 picks the page for the address and attaches to the prerendered HTML
  App.jsx                  shell shared by every page: waitlist state + success modal
  routes.js                list of pages (titles, descriptions, sitemap)
  seo.js                   head tags + JSON-LD
  site.js                  preferred address
  content.js               homepage copy
  content/landing.js       landing-page copy
  content/blog.js          blog posts (drafts until published)
  pages/                   Home, LandingPage, Blog, NotFound
  styles.css               design tokens + layout
  lib/waitlist.js          form submission
  components/
    Backgrounds.jsx        page backdrop + frame scene
    WaitlistForm.jsx       email form + joined state
    SuccessModal.jsx       "added to our waitlist" dialog
    CommentTransitions.jsx comment → review slider under the form
    BrandIcon.jsx          Meta / Facebook / Instagram / Shopify glyphs
    Badge.jsx              "proofy · coming soon" badge with the shine
    SiteChrome.jsx         inner-page header, breadcrumbs, final waitlist panel, footer
    Rich.jsx               copy renderer, numbered steps, FAQ
    reactbits/
```

`SINGLE=1 npm run build` produces a single self-contained HTML file in `dist-single/`.
