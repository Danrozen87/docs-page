import { Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';

export function UsagePage() {
  usePageMeta(
    'Usage',
    'Initialize Collet, import components, enable lazy loading, and understand the bundle/runtime behavior.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Usage</h1>
      <p className="docs-page-lead">
        Initialize once, then import and use any component. The recommended setup
        is non-blocking: let Collet load WASM in the background after first paint.
      </p>

      <section className="docs-prose">
        <DocsHeading id="initialize">1. Initialize</DocsHeading>
        <p>
          Render the app first, then call <code>init()</code> once. The recommended default is
          <code> lazy: true </code>, which lets Collet inspect the mounted DOM, auto-detect the
          initial route&apos;s components, and keep WASM off the blocking path.
        </p>
        <DocsCodeBlock code={`// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { init } from '@colletdev/core';
import App from './App';

const root = createRoot(document.getElementById('root')!);

flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

await init({ lazy: true });`} language="tsx" filename="main.tsx" />
        <p>
          In this docs app the Vite plugin also stays on <code>preload: false</code>, so
          <code> wasm_api_bg.wasm </code> is not forced into the critical request path.
        </p>

        <DocsHeading id="import-components">2. Import components</DocsHeading>
        <DocsCodeBlock
          code={`import { Button, Card, TextInput } from '@colletdev/react';`}
          language="tsx"
          filename="App.tsx"
        />

        <DocsHeading id="use-components">3. Use them</DocsHeading>
        <DocsCodeBlock code={`function App() {
  return (
    <Card variant="elevated" shape="soft">
      <h2>Welcome</h2>
      <p>This just works.</p>
      <Button label="Click me" variant="filled" intent="primary" />
    </Card>
  );
}`} language="tsx" filename="App.tsx" />

        <DocsHeading id="verify-it-works">Verify it works</DocsHeading>
        <p>
          Run <code>npm run dev</code> and open the browser. With the recommended lazy setup you
          should see startup stay non-blocking while Collet initializes in the background:
        </p>
        <DocsCodeBlock
          code={`[cx] Custom Elements auto-detected from mounted DOM.
[cx] WASM loading in background...`}
          language="text"
          filename="console.log"
        />

        <DocsHeading id="selective-registration">Selective registration (production)</DocsHeading>
        <p>
          If your route surface is predictable, pass an explicit component list.
          Only the listed components&apos; behavior chunks are registered up front:
        </p>
        <DocsCodeBlock
          code={`await init({
  lazy: true,
  components: ['button', 'card', 'text-input'],
});`}
          language="tsx"
          filename="main.tsx"
        />
        <p>
          Render-first is still useful here. The app paints immediately, while the explicit list
          removes guesswork from which components Collet should prepare.
        </p>

        <DocsHeading id="lazy-loading">Lazy loading</DocsHeading>
        <p>
          <code>lazy: true</code> is usually the best default. React can mount, the page can paint,
          and Collet can load WASM in the background instead of making startup a hard gate:
        </p>
        <DocsCodeBlock code={`// Non-blocking default
await init({ lazy: true });

// Even leaner when you know the route surface
await init({
  lazy: true,
  components: ['button', 'card', 'text-input'],
});`} language="tsx" filename="main.tsx" />
        <p>
          Use eager <code>await init()</code> only when you specifically need WASM-dependent
          behavior fully ready before the app renders.
        </p>

        <DocsHeading id="bundle-impact">Bundle impact</DocsHeading>
        <p>
          Runtime cost comes in layers. The exact numbers depend on your app, but the loading shape is
          stable: a small wrapper layer first, then Collet&apos;s CSS/WASM runtime, then tiny per-component
          behavior chunks as needed.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Asset</th><th>Brotli</th><th>When loaded</th></tr>
          </thead>
          <tbody>
            <tr><td>App entry + React shell</td><td>depends on your app</td><td>Initial page load</td></tr>
            <tr><td>Collet runtime glue</td><td>a small shared chunk</td><td><code>init()</code></td></tr>
            <tr><td>WASM binary</td><td>one cached shared asset</td><td><code>init()</code> when needed</td></tr>
            <tr><td>Per-component behavior</td><td>sub-kB to low-kB chunks</td><td>Component registration</td></tr>
          </tbody>
        </table>
        <p>
          The important tradeoff is slope, not a single headline number. One shared runtime asset can be
          cached across pages, while component behavior stays code-split instead of duplicating local UI
          logic throughout the app. In this repo we also keep <code>preload: false</code> so that shared
          asset is not pulled into the critical path by default.
        </p>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/installation">
          <Button label="Installation" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/seam">
          <Button label="SEAM Demo" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
