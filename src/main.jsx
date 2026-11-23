import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// SF Pro Display/Text is used wherever the visitor's system has it (Apple devices).
// Inter is bundled as the closest open fallback for everyone else.
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import App from './App';
import { findRoute } from './routes';
import './styles.css';

// Each page's code is loaded on its own, so the landing pages don't download the homepage's
// animation libraries.
const loaders = {
  home: () => import('./pages/Home.jsx').then(m => m.default),
  landing: () => import('./pages/LandingPage.jsx').then(m => m.default),
  blogIndex: () => import('./pages/Blog.jsx').then(m => m.BlogIndex),
  blogPost: () => import('./pages/Blog.jsx').then(m => m.BlogPost),
  notFound: () => import('./pages/NotFound.jsx').then(m => m.default)
};

const root = document.getElementById('root');
// The build marks the 404 page so it hydrates as "not found" whatever address it was served at.
const route = root.dataset.page === 'notFound' ? findRoute('/404') : findRoute(window.location.pathname);

loaders[route.page]().then(Page => {
  const app = (
    <StrictMode>
      <App>
        <Page path={route.path} slug={route.slug} />
      </App>
    </StrictMode>
  );
  // Production pages are prerendered (scripts/prerender.mjs), so attach to that HTML.
  // In `npm run dev` the root is empty and we render from scratch.
  if (root.firstElementChild) hydrateRoot(root, app);
  else {
    document.title = route.title;
    createRoot(root).render(app);
  }
});
