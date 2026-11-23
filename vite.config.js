import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Runs the real /api/* handlers inside `npm run dev`, using variables from .env / .env.local.
function waitlistApi(mode) {
  return {
    name: 'proofy-waitlist-api',
    configureServer(server) {
      const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        try {
          const { route } = await server.ssrLoadModule('/server/core.js');
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : body
          });
          const response = await route(request, env, { ip: req.socket.remoteAddress });
          if (!response) return next();
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          next(err);
        }
      });
    }
  };
}

// Serves the privacy page at /privacy in `npm run dev` and `npm run preview`, like the live hosts do.
function cleanUrls() {
  const rewrite = (req, _res, next) => {
    if (req.url === '/privacy' || req.url?.startsWith('/privacy?')) req.url = req.url.replace('/privacy', '/privacy.html');
    next();
  };
  return {
    name: 'proofy-clean-urls',
    configureServer: server => void server.middlewares.use(rewrite),
    configurePreviewServer: server => void server.middlewares.use(rewrite)
  };
}

// `npm run build` -> normal multi-file build in dist/ (deploy this).
// `SINGLE=1 npm run build` -> one self-contained HTML file in dist-single/ (handy for previews).
export default defineConfig(({ mode }) => ({
  plugins: [react(), waitlistApi(mode), cleanUrls(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  build: {
    outDir: process.env.SINGLE ? 'dist-single' : 'dist',
    // One stylesheet for every page, loaded up front: page code is split per route, and per-route
    // CSS arriving late would make the prerendered layout jump.
    cssCodeSplit: false,
    // Lets the prerender step preload each page's own code chunks.
    manifest: true
  }
}));
