import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@colletdev/react';
import { DocsCodeBlock } from '../components/DocsCodeBlock';
import { DocsInlineCommand } from '../components/DocsInlineCommand';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  COLLET_VERSION,
  landingComponentCategories as componentCategories,
  totalComponentCount,
} from '../docs/registry';

/* Inline SVG paths — no external sprite sheet needed */
const icons: Record<string, React.ReactNode> = {
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  'shield-check': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  palette: <><circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12" r="1.5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z" /></>,
  box: <><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
  layers: <><path d="m12.8 2.3 8.4 4.6a.8.8 0 0 1 0 1.4l-8.4 4.6a1.6 1.6 0 0 1-1.6 0L2.8 8.3a.8.8 0 0 1 0-1.4l8.4-4.6a1.6 1.6 0 0 1 1.6 0z" /><path d="m2 12 10 5.5L22 12" /><path d="m2 17 10 5.5L22 17" /></>,
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></>,
};

const featureCards = [
  {
    key: 'zap',
    title: 'Smaller UI PRs',
    description: 'Keep ARIA, focus management, theming, and interaction behavior inside the component system instead of rebuilding them in product code.',
    accent: 'oklch(0.75 0.18 145)',
  },
  {
    key: 'shield-check',
    title: 'Lower Context Load',
    description: 'Humans and agents read intent instead of wrapper layers, utility churn, and hand-rolled interaction glue.',
    accent: 'oklch(0.70 0.15 250)',
  },
  {
    key: 'palette',
    title: 'Accessible by Default',
    description: 'WCAG 2.2 AA compliance enforced at compile time. Inaccessible components are a compiler error.',
    accent: 'oklch(0.72 0.19 330)',
  },
  {
    key: 'box',
    title: 'One API Across Frameworks',
    description: 'The same underlying components and design tokens work in React, Vue, Svelte, Angular, and plain HTML.',
    accent: 'oklch(0.75 0.16 55)',
  },
  {
    key: 'layers',
    title: 'Theming Without Churn',
    description: 'Override CSS custom properties on :root and style internals with ::part() instead of forking component markup.',
    accent: 'oklch(0.68 0.16 200)',
  },
  {
    key: 'terminal',
    title: 'Runtime Architecture That Gets Out of the Way',
    description: 'Zero hydration, Shadow DOM, and deferred WASM keep the runtime compact so product code stays declarative.',
    accent: 'oklch(0.65 0.20 25)',
  },
] as const;

const INSTALL_CMD = 'npm install @colletdev/core @colletdev/react';

export function LandingPage() {
  const navigate = useNavigate();
  usePageMeta(
    'Collet Docs',
    `Documentation for Collet: smaller UI diffs, lower AI context load, and ${totalComponentCount} accessible components across frameworks.`,
  );

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-card">
        <div className="landing-hero-inner">
          <Badge label={`v${COLLET_VERSION} — Docs Site`} variant="filled" intent="neutral" size="sm" shape="pill" />

          <h1 className="landing-title">
            Ship less UI code.
          </h1>

          <p className="landing-subtitle">
            Collet turns the UI layer into a compact, typed platform: {totalComponentCount} accessible
            components, smaller feature PRs, lower AI context load, and one API across React, Vue,
            Svelte, and Angular.
          </p>

          <div className="landing-cta">
            <Button
              label="Get Started"
              variant="filled"
              intent="primary"
              size="lg"
              iconTrailing="arrow-right"
              onClick={() => navigate('/docs/introduction')}
            />
            <Button
              label="Browse Components"
              variant="outline"
              intent="neutral"
              size="lg"
              onClick={() => navigate('/docs/components')}
            />
          </div>

          {/* Quick install — click to copy */}
          <DocsInlineCommand command={INSTALL_CMD} ariaLabel="Copy install command" />
        </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Why teams adopt Collet</h2>
          <p className="landing-section-desc">
            It reduces UI entropy in the codebase. The runtime matters because it keeps feature code short,
            stable, and reviewable.
          </p>

          <div className="landing-features">
            {featureCards.map((feature) => (
              <Card key={feature.title} variant="outlined" shape="rounded" size="md">
                <div className="landing-feature-card">
                  <div
                    className="landing-feature-icon"
                    aria-hidden="true"
                    style={{ background: `color-mix(in oklch, ${feature.accent} 12%, transparent)`, color: feature.accent }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {icons[feature.key]}
                    </svg>
                  </div>
                  <h3 className="landing-feature-title">{feature.title}</h3>
                  <p className="landing-feature-desc">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI development ── */}
      <section className="landing-section landing-section--ai">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Low-context development</h2>
          <p className="landing-section-desc">
            Collet is designed so humans and agents spend less attention on UI plumbing
            and more on the product.
          </p>

          <div className="landing-features">
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <div className="landing-feature-card">
                <h3 className="landing-feature-title">Smaller diffs, clearer intent</h3>
                <p className="landing-feature-desc">
                  One line of Collet replaces dozens of styled divs, ARIA attributes,
                  focus traps, and dark mode logic. You describe <em>what</em> you
                  want — the compiler handles <em>how</em>.
                </p>
                <DocsCodeBlock
                  code={'<Button label="Save" variant="filled" intent="primary" />'}
                  language="tsx"
                />
              </div>
            </Card>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <div className="landing-feature-card">
                <h3 className="landing-feature-title">Stable API context</h3>
                <p className="landing-feature-desc">
                  Install <code>@colletdev/docs</code> and
                  run <code>npx @colletdev/docs init</code>. Your AI agent gets full
                  API knowledge for all {totalComponentCount} components — no token-burning doc lookups,
                  no hallucinated props.
                </p>
              </div>
            </Card>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <div className="landing-feature-card">
                <h3 className="landing-feature-title">Review surface stays narrow</h3>
                <p className="landing-feature-desc">
                  Accessibility, responsive layout, theming, motion, and form integration stay in
                  the design system. Reviewers and agents can focus on business logic instead of
                  re-auditing UI mechanics in every PR.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Component categories ── */}
      <section className="landing-section landing-section--muted">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Components</h2>
          <p className="landing-section-desc">
            Every category. Every interaction pattern. Keyboard accessible, screen reader tested.
          </p>

          <div className="landing-categories">
            {componentCategories.map((cat) => (
              <Button
                key={cat.label}
                label={`${cat.label}\n${cat.count} components`}
                variant="outline"
                intent="neutral"
                size="xl"
                className="landing-category-button"
                onClick={() => navigate(cat.href)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick start steps ── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Get running in 3 steps</h2>

          <div className="landing-steps">
            <div className="landing-step">
              <span className="landing-step-number">01</span>
              <h3 className="landing-step-title">Install</h3>
              <DocsCodeBlock code="npm install @colletdev/core @colletdev/react" language="bash" />
            </div>

            <div className="landing-step">
              <span className="landing-step-number">02</span>
              <h3 className="landing-step-title">Initialize</h3>
              <DocsCodeBlock
                code={`import { init } from '@colletdev/core';
await init({ lazy: true });`}
                language="tsx"
              />
            </div>

            <div className="landing-step">
              <span className="landing-step-number">03</span>
              <h3 className="landing-step-title">Use</h3>
              <DocsCodeBlock
                code={`import { Button } from '@colletdev/react';

<Button label="Hello" variant="filled" />`}
                language="tsx"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Learning curve ── */}
      <section className="landing-section landing-section--muted">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Productive in hours, not days</h2>
          <p className="landing-section-desc">
            Collet uses the web platform you already know — Custom Elements, CSS
            custom properties, slots — wrapped in familiar framework patterns.
            The type system teaches you as you go.
          </p>

          <div className="landing-steps">
            <div className="landing-step">
              <span className="landing-step-number">~10 min</span>
              <h3 className="landing-step-title">Install, init, render</h3>
              <p className="landing-feature-desc">
                Two packages, one lazy <code>await init()</code> call, and your first component
                renders with typed autocompletion guiding every prop.
              </p>
            </div>

            <div className="landing-step">
              <span className="landing-step-number">~30 min</span>
              <h3 className="landing-step-title">Learn the vocabulary</h3>
              <p className="landing-feature-desc">
                Four words: <strong>variant</strong>, <strong>intent</strong>,{' '}
                <strong>shape</strong>, <strong>size</strong>. Union types
                mean you never have to memorize valid values.
              </p>
            </div>

            <div className="landing-step">
              <span className="landing-step-number">~1 hr</span>
              <h3 className="landing-step-title">Shadow DOM mental model</h3>
              <p className="landing-feature-desc">
                The one new concept: styles don't leak in or out. Reach for design
                tokens or <code>::part()</code> selectors. A 30-minute shift, not a
                paradigm change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="landing-section landing-section--center">
        <div className="landing-section-inner">
          <h2 className="landing-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Ready to build?
          </h2>
          <p className="landing-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
            Read the docs, explore components, ship something.
          </p>
          <div className="landing-cta">
            <Button
              label="Read the Docs"
              variant="filled"
              intent="primary"
              size="lg"
              iconTrailing="arrow-right"
              onClick={() => navigate('/docs/introduction')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
