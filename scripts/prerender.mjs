// Runs after `vite build`: renders every page to HTML with its own head tags, then writes
// 404.html and sitemap.xml. Page files are written as <path>.html (e.g. shopify-social-proof.html),
// which Vercel (cleanUrls) and Netlify serve at /shopify-social-proof.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const outDir = process.env.SINGLE ? 'dist-single' : 'dist';
const { render, routes, notFoundRoute, SITE_URL } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);

const template = readFileSync(resolve(outDir, 'index.html'), 'utf8');
for (const mark of ['<!--app-html-->', '<!--app-head-->']) {
  if (!template.includes(mark)) throw new Error(`index.html is missing the ${mark} placeholder`);
}

// Each page's code chunks (and the chunks they import), preloaded so the browser fetches them in
// parallel with the main script instead of one after another.
const PAGE_SOURCES = {
  home: 'src/pages/Home.jsx',
  landing: 'src/pages/LandingPage.jsx',
  blogIndex: 'src/pages/Blog.jsx',
  blogPost: 'src/pages/Blog.jsx',
  notFound: 'src/pages/NotFound.jsx'
};
let manifest = {};
try {
  manifest = JSON.parse(readFileSync(resolve(outDir, '.vite/manifest.json'), 'utf8'));
} catch {
  // single-file build: everything is inlined already
}
function preloads(page) {
  const seen = new Set();
  const walk = key => {
    const chunk = manifest[key];
    if (!chunk || seen.has(chunk.file)) return;
    if (!chunk.isEntry) seen.add(chunk.file);
    (chunk.imports || []).forEach(walk);
  };
  walk(PAGE_SOURCES[page]);
  return [...seen].map(f => `<link rel="modulepreload" crossorigin href="/${f}" />`).join('\n    ');
}

const fileFor = path => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

function write(route, file, rootAttrs = '') {
  const { html, head } = render(route);
  const page = template
    .replace('<!--app-head-->', () => `${head}\n    ${preloads(route.page)}`)
    .replace('<div id="root">', () => `<div id="root"${rootAttrs}>`)
    .replace('<!--app-html-->', () => html);
  const target = resolve(outDir, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page);
  console.log(`  ${file.padEnd(36)} ${(page.length / 1024).toFixed(0).padStart(4)} KB  ${route.title}`);
}

console.log(`Prerendering into ${outDir}/`);
for (const route of routes) write(route, fileFor(route.path));
// A single-file preview build has no server to serve 404s or read a sitemap.
if (!process.env.SINGLE) {
  write(notFoundRoute, '404.html', ' data-page="notFound"');

  const urls = routes
    .map(r => {
      const loc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
      return `  <url>\n    <loc>${loc}</loc>${r.updated ? `\n    <lastmod>${r.updated}</lastmod>` : ''}\n  </url>`;
    })
    .concat(`  <url>\n    <loc>${SITE_URL}/privacy</loc>\n    <lastmod>2026-11-21</lastmod>\n  </url>`);
  writeFileSync(
    resolve(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  );
  console.log(`  sitemap.xml with ${urls.length} URLs`);
}
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
rmSync(resolve(outDir, '.vite'), { recursive: true, force: true });
