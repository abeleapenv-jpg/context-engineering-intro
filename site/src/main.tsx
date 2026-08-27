/* QUIETFIELD ENTRY POINT
 * Fonts: Archivo (display, the logo's geometric caps language) and
 * Fraunces (body, editorial warmth) - spec §3.6.1 #10.
 */
import '@fontsource-variable/archivo';
import '@fontsource-variable/fraunces';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/scene.css';
import './styles/entry.css';
import './styles/pages.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
