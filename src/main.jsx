import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// SF Pro Display/Text is used wherever the visitor's system has it (Apple devices).
// Inter is bundled as the closest open fallback for everyone else.
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
