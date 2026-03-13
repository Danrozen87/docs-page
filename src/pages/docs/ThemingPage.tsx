import { Button, Alert } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';

export function ThemingPage() {
  usePageMeta(
    'Theming',
    'Override Collet design tokens, configure dark mode, use ::part() selectors, and understand how theming flows through Shadow DOM.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Theming</h1>
      <p className="docs-page-lead">
        Customize Collet through CSS custom properties, dark-mode tokens, and
        <code> ::part()</code> hooks. No build step, no config files.
      </p>

      <section className="docs-prose">
        <DocsHeading id="how-theming-works">How theming works</DocsHeading>
        <p>
          Collet components render inside Shadow DOM. They inherit CSS custom properties
          from <code>:root</code> automatically. Override any token in your stylesheet —
          the cascade handles the rest. No <code>!important</code> needed.
        </p>

        <DocsHeading id="override-tokens">Override tokens</DocsHeading>
        <DocsCodeBlock code={`/* index.css */
:root {
  --color-primary: oklch(0.55 0.22 265);
  --color-primary-hover: oklch(0.50 0.22 265);
  --color-bg: oklch(0.97 0.01 85);
  --radius-md: 12px;
  --font-sans: 'Inter', system-ui, sans-serif;
}`} language="css" filename="index.css" />

        <DocsHeading id="dark-mode">Dark mode</DocsHeading>
        <p>
          Toggle dark mode with a single attribute. Every <code>--color-*</code> token has
          dark values that activate automatically:
        </p>
        <DocsCodeBlock
          code={`// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Toggle light mode
document.documentElement.setAttribute('data-theme', 'light');`}
          language="tsx"
          filename="theme.ts"
        />
        <p>
          All components adapt automatically. No per-component dark mode props are needed.
        </p>

        <DocsHeading id="react-integration">React integration</DocsHeading>
        <p>A small hook is usually enough:</p>
        <DocsCodeBlock code={`import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggle };
}`} language="tsx" filename="useTheme.ts" />

        <DocsHeading id="system-preference">System preference</DocsHeading>
        <p>
          Use <code>prefers-color-scheme</code> when you want the initial theme to follow
          the operating system:
        </p>
        <DocsCodeBlock
          code={`const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');`}
          language="tsx"
          filename="theme-system.ts"
        />

        <DocsHeading id="persisting-preference">Persisting preference</DocsHeading>
        <DocsCodeBlock code={`localStorage.setItem('collet-theme', theme);

const saved = localStorage.getItem('collet-theme') as Theme | null;
const initial = saved ?? (prefersDark ? 'dark' : 'light');`} language="tsx" filename="theme-storage.ts" />

        <Alert
          title="Dark mode is part of theming"
          description="Treat dark mode as a token switch, not as a separate styling system. The same theme contract applies in both modes."
          intent="info"
          variant="subtle"
        />

        <DocsHeading id="styling-with-part">Styling with ::part()</DocsHeading>
        <p>Target named internal elements of any component:</p>
        <DocsCodeBlock code={`cx-card::part(base)   { border: 2px solid hotpink; }
cx-card::part(header) { background: var(--color-surface-raised); }
cx-card::part(body)   { padding: 2rem; }`} language="css" filename="parts.css" />

        <DocsHeading id="common-tokens">Common tokens</DocsHeading>
        <table className="docs-table">
          <thead>
            <tr><th>Token</th><th>Controls</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--color-primary</code></td><td>Brand color, filled buttons, active states</td></tr>
            <tr><td><code>--color-bg</code></td><td>Page background</td></tr>
            <tr><td><code>--color-surface</code></td><td>Card backgrounds (outlined)</td></tr>
            <tr><td><code>--color-surface-raised</code></td><td>Elevated card backgrounds</td></tr>
            <tr><td><code>--color-text</code></td><td>Primary text</td></tr>
            <tr><td><code>--color-text-secondary</code></td><td>Helper text, descriptions</td></tr>
            <tr><td><code>--color-border</code></td><td>Input borders, card outlines</td></tr>
            <tr><td><code>--color-secondary</code></td><td>Filled input backgrounds (not <code>--color-surface</code>)</td></tr>
            <tr><td><code>--radius-sm</code> to <code>--radius-full</code></td><td>Border radius scale</td></tr>
            <tr><td><code>--font-sans</code></td><td>Body font family</td></tr>
            <tr><td><code>--font-display</code></td><td>Display headings font</td></tr>
            <tr><td><code>--font-mono</code></td><td>Code blocks font</td></tr>
            <tr><td><code>--duration-fast</code> / <code>--duration-normal</code> / <code>--duration-smooth</code></td><td>Animation timing</td></tr>
          </tbody>
        </table>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/migrating-from-shadcn-ui">
          <Button label="Migration" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/components">
          <Button label="Components" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
