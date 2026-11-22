import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Self-hosted fonts keep the editorial type reliable in offline previews and
// avoid a third-party request on every visit.
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
