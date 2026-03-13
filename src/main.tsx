import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { init } from '@colletdev/core';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);

// Render first so Collet can auto-detect only the components used by the
// initial route, instead of falling back to registering the entire library.
flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

await init({ lazy: true });
