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

// `npm run build` -> normal multi-file build in dist/ (deploy this).
// `SINGLE=1 npm run build` -> one self-contained HTML file in dist-single/ (handy for previews).
export default defineConfig(({ mode }) => ({
  plugins: [react(), waitlistApi(mode), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  build: { outDir: process.env.SINGLE ? 'dist-single' : 'dist' }
}));
