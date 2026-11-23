// One place for the site's address and shared SEO values.
// The preferred address is https://www.proofy.site (no trailing slash on inner pages).
// To switch to the bare domain, change SITE_URL here, in public/robots.txt and vercel.json.
export const SITE_URL = 'https://www.proofy.site';
export const SITE_NAME = 'Proofy';
export const OG_IMAGE = { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 };
export const LOGO_URL = `${SITE_URL}/icon-512.png`;

export const abs = path => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
