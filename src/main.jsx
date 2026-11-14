import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// SF Pro Display/Text is used wherever the visitor's system has it (Apple devices).
// Inter is bundled as the closest open fallback for everyone else.
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import App from './App';
import './styles.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production pages are prerendered (scripts/prerender.mjs), so attach to that HTML.
// In `npm run dev` the root is empty and we render from scratch.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
