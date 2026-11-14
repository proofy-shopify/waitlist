// Used only at build time (scripts/prerender.mjs) to write the page's HTML into index.html,
// so crawlers and link previews see the content without running JavaScript.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
