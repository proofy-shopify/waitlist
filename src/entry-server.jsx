// Used only at build time (scripts/prerender.mjs) to write every page's HTML and head tags,
// so crawlers and link previews see the content without running JavaScript.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import { BlogIndex, BlogPost } from './pages/Blog';
import { routes, notFoundRoute } from './routes';
import { buildHead } from './seo';

const pages = { home: Home, landing: LandingPage, blogIndex: BlogIndex, blogPost: BlogPost, notFound: NotFound };

export { routes, notFoundRoute };
export { SITE_URL } from './site';

export function render(route) {
  const Page = pages[route.page];
  const html = renderToString(
    <StrictMode>
      <App>
        <Page path={route.path} slug={route.slug} />
      </App>
    </StrictMode>
  );
  return { html, head: buildHead(route) };
}
