import { Card, Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';
import { totalComponentCount } from '../../docs/registry';

export function IntroductionPage() {
  usePageMeta(
    'Introduction',
    `Overview of Collet: a low-context UI platform with ${totalComponentCount} accessible components, thin framework wrappers, and deferred WASM.`,
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Introduction</h1>
      <p className="docs-page-lead">
        Collet is a UI platform for teams that want less UI code in product files.
        {` ${totalComponentCount}`} accessible, production-grade components ship as Custom Elements
        with thin framework wrappers for React, Vue, Svelte, and Angular.
      </p>

      <section className="docs-prose">
        <DocsHeading id="why-collet-exists">Why Collet exists</DocsHeading>
        <p>
          UI codebases tend to sprawl. A team starts with a few buttons and inputs,
          then accumulates wrapper components, custom variants, accessibility patches,
          focus logic, dark mode fixes, and one-off layout helpers. Feature PRs get
          bigger because product work keeps dragging UI infrastructure along with it.
        </p>
        <p>
          Collet is built to compress that surface area. Instead of copying component
          implementations into your app, you use a stable typed API that keeps behavior,
          theming primitives, and accessibility inside the component system. The point
          is not just better rendering. The point is smaller diffs, faster review, and
          less UI entropy in the codebase.
        </p>

        <DocsHeading id="low-context-development">Low-context development</DocsHeading>
        <p>
          Collet is designed for humans and AI agents working under limited attention
          and limited context. A single line like{' '}
          <code>{'<Button label="Save" variant="filled" intent="primary" />'}</code>{' '}
          replaces dozens of lines of styled divs, manual ARIA attributes, focus
          management, and dark mode logic. You describe <em>what</em> you want — the
          system handles <em>how</em>.
        </p>
        <p>
          This means less code to read, write, and reason about. Typed props guide
          autocompletion, shared conventions keep review predictable, and{' '}
          <code>@colletdev/docs</code> gives your agent full API knowledge for all
          {` ${totalComponentCount}`} components without burning tokens on documentation lookups.
        </p>
        <p>
          The result is narrower PR context. Reviewers spend less time re-checking UI
          mechanics. Agents spend more of their context window on business logic instead
          of reconstructing interface infrastructure from local conventions.
        </p>

        <DocsHeading id="how-it-works">How it works</DocsHeading>
        <p>
          Components render as Custom Elements with Shadow DOM. The initial
          import costs ~8 KB (brotli). WASM and styles load when you call{' '}
          <code>init()</code>, and per-component behavior loads on demand.
          No framework runtime ships to the client beyond your wrapper layer.
        </p>
        <p>
          Accessibility is enforced at compile time. The Rust type system makes
          inaccessible components a compiler error — not a lint warning, not a
          best practice suggestion, a hard error.
        </p>

        <DocsHeading id="three-layer-architecture">Three-layer architecture</DocsHeading>
        <p>
          The WASM binary is not a render-blocking dependency. Collet separates
          rendering from computation across three layers:
        </p>
        <ol>
          <li>
            <strong>Declarative Shadow DOM</strong> — components are visible and
            styled with zero JavaScript. The browser paints them instantly from
            pre-rendered HTML. No WASM needed.
          </li>
          <li>
            <strong>Behavior modules</strong> — per-component JS handles DOM
            orchestration (focus management, ARIA updates, class toggling). These
            include JS fallbacks, so basic interactivity works before WASM loads.
          </li>
          <li>
            <strong>WASM handlers</strong> — pure business logic only (filtering,
            sorting, state transitions). Loaded lazily. Never touches the DOM.
          </li>
        </ol>
        <p>
          With <code>{'init({ lazy: true })'}</code>, WASM loads after first paint.
          With server rendering, components are visible before any JS runs at all.
          The WASM binary is a cached computational layer that loads behind
          already-visible components — not a gate that blocks them.
        </p>

        <DocsHeading id="productive-in-hours-not-days">Productive in hours, not days</DocsHeading>
        <p>
          Collet doesn't invent new concepts. It uses the web platform — Custom
          Elements, Shadow DOM, CSS custom properties, slots — and wraps it in
          familiar framework patterns. The type system does the teaching: you
          type <code>variant=</code> and autocompletion shows
          you <code>'filled' | 'outline' | 'ghost'</code>.
        </p>
        <p>
          Four words cover the shared vocabulary: <strong>variant</strong>,{' '}
          <strong>intent</strong>, <strong>shape</strong>, <strong>size</strong>.
          Events follow your framework's conventions (<code>onClick</code> in React,{' '}
          <code>@cx-click</code> in Vue, callback props in Svelte 5). Theming
          is CSS custom properties on <code>:root</code>.
        </p>
        <p>
          The one genuinely new concept is Shadow DOM encapsulation — styles
          don't leak in or out. Reach for design tokens
          or <code>::part()</code> selectors instead of regular CSS. That's a
          30-minute mental shift, not a paradigm change.
        </p>

        <DocsHeading id="key-features">Key features</DocsHeading>
        <ul>
          <li><strong>Zero hydration</strong> — HTML arrives ready, WASM loads on demand</li>
          <li><strong>WCAG 2.2 AA</strong> — enforced by the compiler, not by convention</li>
          <li><strong>Shadow DOM</strong> — styles never leak, works in any framework</li>
          <li><strong>Token-driven theming</strong> — override CSS custom properties on :root</li>
          <li><strong>Dark mode</strong> — built in, one attribute toggle</li>
          <li><strong>{totalComponentCount} components</strong> — forms, navigation, overlays, feedback, layout</li>
          <li><strong>AI-ready docs</strong> — <code>@colletdev/docs</code> gives your AI agent full API context</li>
        </ul>

        <DocsHeading id="next-steps">Next steps</DocsHeading>
        <div className="docs-card-grid">
          <Link to="/docs/installation" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Installation</h3>
              <p className="docs-card-desc">Install @colletdev/core and @colletdev/react in your project.</p>
            </Card>
          </Link>
          <Link to="/docs/usage" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Usage</h3>
              <p className="docs-card-desc">Initialize Collet and render your first component.</p>
            </Card>
          </Link>
          <Link to="/docs/conventions" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Conventions</h3>
              <p className="docs-card-desc">Learn the shared vocabulary: variant, intent, shape, size.</p>
            </Card>
          </Link>
          <Link to="/docs/components" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Components</h3>
              <p className="docs-card-desc">Browse all {totalComponentCount} components with live examples.</p>
            </Card>
          </Link>
        </div>
      </section>

      <div className="docs-page-nav">
        <div />
        <Link to="/docs/installation">
          <Button label="Installation" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
