// Runs after `vite build`: renders the app to HTML and writes it into the built index.html.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const outDir = process.env.SINGLE ? 'dist-single' : 'dist';
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);
const file = resolve(outDir, 'index.html');
const html = readFileSync(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('index.html is missing the <!--app-html--> placeholder');
const appHtml = render();
writeFileSync(file, html.replace('<!--app-html-->', () => appHtml));
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`Prerendered ${outDir}/index.html (${appHtml.length.toLocaleString()} characters of page HTML)`);
