import { Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';

export function ConventionsPage() {
  usePageMeta(
    'Conventions',
    'Shared vocabulary, theming rules, review heuristics, and authoring conventions for readable Collet code.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Conventions</h1>
      <p className="docs-page-lead">
        How to write Collet code that stays readable across teams, frameworks,
        and time. These conventions reduce line count, make pull requests
        trivially reviewable, and give every developer — regardless of
        framework — the same vocabulary.
      </p>

      <section className="docs-prose">
        <DocsHeading id="one-vocabulary-for-everything">One vocabulary for everything</DocsHeading>
        <p>
          Every Collet component shares four visual dimensions. Learn them once,
          use them on every component, in every framework.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Dimension</th><th>Common options</th><th>What it controls</th></tr>
          </thead>
          <tbody>
            <tr><td><code>variant</code></td><td><code>filled</code> · <code>outline</code> · <code>ghost</code> (varies per component)</td><td>Visual weight — how prominent is this element?</td></tr>
            <tr><td><code>intent</code></td><td><code>neutral</code> · <code>primary</code> · <code>info</code> · <code>success</code> · <code>warning</code> · <code>danger</code></td><td>Semantic meaning — what does this communicate?</td></tr>
            <tr><td><code>shape</code></td><td><code>sharp</code> · <code>rounded</code> · <code>pill</code> (varies per component)</td><td>Border radius — what's the visual tone?</td></tr>
            <tr><td><code>size</code></td><td><code>xs</code> · <code>sm</code> · <code>md</code> · <code>lg</code> · <code>xl</code></td><td>Spatial scale — how much room does it take?</td></tr>
          </tbody>
        </table>
        <p>
          Not every component supports every option — a Button
          has <code>underline</code> and <code>side-indicator</code> variants,
          a Card has <code>elevated</code>, a Table has <code>striped</code>.
          Each component's API reference lists its specific options.
          But the vocabulary is shared: a <code>filled</code> Button and
          a <code>filled</code> Alert use the same visual language.
        </p>
        <p>
          A <code>Button</code> with <code>intent="danger"</code> uses the exact same
          color token as an <code>Alert</code> with <code>intent="danger"</code>. There is
          no <code>color="red"</code> on one and <code>severity="critical"</code> on another.
          Intent is consistent across every component — TypeScript autocompletes it,
          and invalid values fail at build time.
        </p>

        <DocsHeading id="defaults-do-the-right-thing">Defaults do the right thing</DocsHeading>
        <p>
          Every component works with zero configuration. You escalate only when
          you need to. This keeps code minimal and diffs small.
        </p>
        <DocsCodeBlock code={`// This is a complete, accessible, keyboard-navigable button.
<Button label="Save" />

// Add visual weight when the design calls for it.
<Button label="Save" variant="filled" intent="primary" />

// Add an icon when meaning needs reinforcement.
<Button label="Save" variant="filled" intent="primary" iconLeading="check" />

// Each line adds one decision. Nothing from before changes.`} language="tsx" filename="ButtonExamples.tsx" />
        <p>
          In a pull request, this reads top-down: what is it, how does it look,
          what extra does it carry. A reviewer scans intents and variants — not
          hex codes, not class names, not inline styles.
        </p>

        <DocsHeading id="how-to-structure-component-code">How to structure component code</DocsHeading>

        <h3>Declare intent, not appearance</h3>
        <DocsCodeBlock code={`// Bad — appearance is hardcoded, meaning is lost
<Button label="Delete" style={{ background: '#e53e3e', color: 'white' }} />

// Bad — utility classes duplicate what the design system already knows
<Button label="Delete" className="bg-red-600 text-white rounded-full" />

// Good — intent carries meaning, appearance follows automatically
<Button label="Delete" variant="filled" intent="danger" />`} language="tsx" filename="IntentExample.tsx" />
        <p>
          When your team switches themes, updates brand colors, or adds a
          high-contrast mode — <code>intent="danger"</code> adapts.
          Hardcoded values don't.
        </p>

        <h3>One component per concern</h3>
        <DocsCodeBlock code={`// Bad — rebuilding what the library already provides
<div className="card" style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
  <h3>Title</h3>
  <p>Content</p>
  <button onClick={onSave}>Save</button>
</div>

// Good — the component handles surface, spacing, elevation, focus, and ARIA
<Card variant="outlined" shape="rounded">
  <h3>Title</h3>
  <p>Content</p>
  <Button label="Save" onClick={onSave} intent="primary" />
</Card>`} language="tsx" filename="CardExample.tsx" />
        <p>
          The first version requires reviewing 4 style decisions. The second
          requires reviewing 2 prop choices. Multiply by every component
          in a feature PR, and the difference is significant.
        </p>

        <h3>Keep data props flat</h3>
        <p>
          Components that accept structured data — <code>Select</code>, <code>Accordion</code>,
          <code>Table</code>, <code>Carousel</code> — take a single array prop.
          Keep the data close to the component, shaped exactly as the prop expects:
        </p>
        <DocsCodeBlock code={`// Shape data at the boundary, pass it directly
const options = users.map(u => ({ label: u.name, value: u.id }));

<Select items={options} label="Assign to" />

// Don't transform inside JSX — it's harder to read and review
<Select items={users.map(u => ({ label: u.name, value: u.id }))} label="Assign to" />`} language="tsx" filename="DataShaping.tsx" />

        <DocsHeading id="token-driven-theming">Token-driven theming</DocsHeading>
        <p>
          Prefer not to write per-component CSS. Start with design tokens
          on <code>:root</code>, and let components inherit them through the cascade:
        </p>
        <DocsCodeBlock code={`:root {
  --color-primary: oklch(0.55 0.22 265);   /* Brand purple */
  --radius-md: 12px;                       /* Rounder corners */
  --font-sans: 'Inter', sans-serif;        /* Custom font */
}`} language="css" filename="index.css" />
        <p>
          Dark mode is a single attribute:
        </p>
        <DocsCodeBlock code={`<html data-theme="dark">`} language="html" filename="index.html" />
        <p>
          If you need structural overrides beyond tokens, use <code>::part()</code>
          selectors. These are intentional styling hooks — they won't break
          between versions:
        </p>
        <DocsCodeBlock code={`cx-card::part(base) {
  border: 2px solid var(--color-primary);
}

cx-button::part(base) {
  letter-spacing: 0.02em;
}`} language="css" filename="theme-parts.css" />
        <p>
          If a component doesn't expose a part for something, that's deliberate.
          Use tokens for colors and spacing. Use parts for structure.
          Don't reach inside with global CSS expecting internal implementation details
          to be stable. Shadow DOM encapsulation is the contract.
        </p>

        <DocsHeading id="events">Events</DocsHeading>
        <p>
          Every interactive component fires events through standard React props:
        </p>
        <DocsCodeBlock code={`<Button onClick={(e) => console.log('clicked', e.detail)} />
<TextInput onInput={(e) => setQuery(e.detail.value)} />
<Select onChange={(e) => setSelected(e.detail.value)} />
<Accordion onChange={(e) => setExpanded(e.detail.expanded)} />`} language="tsx" filename="Events.tsx" />
        <p>
          The pattern is always the same: <code>on</code> + event name in React,
          payload on <code>e.detail</code>. This works identically across every
          component — no special hooks, no context providers, no state management
          libraries required.
        </p>

        <DocsHeading id="forms-just-work">Forms just work</DocsHeading>
        <p>
          Form components participate in native <code>&lt;form&gt;</code> submission.
          No hidden inputs. No <code>onChange</code> → state → FormData glue:
        </p>
        <DocsCodeBlock code={`<form onSubmit={(e) => {
  const data = new FormData(e.currentTarget);
  console.log(data.get('email'));
}}>
  <TextInput name="email" kind="email" label="Email" />
  <Select name="role" label="Role" items={roles} />
  <Button kind="submit" label="Invite" intent="primary" />
</form>`} language="tsx" filename="FormExample.tsx" />

        <DocsHeading id="accessibility-is-not-your-job">Accessibility is not your job</DocsHeading>
        <p>
          You should not need to hand-author ARIA attributes, focus management,
          or keyboard interaction for standard component behavior. The component
          handles those mechanics:
        </p>
        <ul>
          <li>WCAG 2.2 AA compliance is enforced at the component build level</li>
          <li>ARIA roles and states are set automatically</li>
          <li>Focus rings, keyboard navigation, and screen reader announcements are built in</li>
          <li>Icon-only buttons and inputs require accessible labels — your editor will tell you if you forget</li>
        </ul>
        <p>
          Your job is still to provide meaningful content: labels, descriptions,
          error messages, and logical page structure. The component handles the
          low-level interaction mechanics.
        </p>

        <DocsHeading id="pull-request-checklist">Pull request checklist</DocsHeading>
        <p>
          When reviewing Collet code in PRs, these are the only questions:
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Check</th><th>What to look for</th></tr>
          </thead>
          <tbody>
            <tr><td>Right component?</td><td>Is this a <code>Button</code> or should it be a <code>Link</code>? Is this a <code>Select</code> or an <code>Autocomplete</code>?</td></tr>
            <tr><td>Right intent?</td><td>Does <code>intent="danger"</code> match the action's severity?</td></tr>
            <tr><td>Right variant?</td><td>Is the visual weight appropriate? Primary actions <code>filled</code>, secondary <code>outline</code> or <code>ghost</code>.</td></tr>
            <tr><td>Labels present?</td><td>Does every input have a <code>label</code>? Does every icon-only button have an <code>ariaLabel</code>?</td></tr>
            <tr><td>No custom CSS?</td><td>If there's component-level CSS, is it using tokens or <code>::part()</code> — not class overrides?</td></tr>
            <tr><td>Data shaped at boundary?</td><td>Are array props prepared before JSX, not inline-transformed?</td></tr>
          </tbody>
        </table>
        <p>
          In most Collet UI work, that is the primary review surface. You should
          spend far less time auditing colors, responsive edge cases, or low-level
          accessibility wiring because the design system handles those concerns
          more uniformly.
        </p>

        <DocsHeading id="cross-framework-teams">Cross-framework teams</DocsHeading>
        <p>
          If your organization has teams on different frameworks, Collet is the
          same everywhere. The underlying Custom Element is identical —
          framework wrappers only change the syntax:
        </p>
        <DocsCodeBlock code={`// React — @colletdev/react
<Button label="Save" variant="filled" intent="primary" onClick={save} />

// Vue 3 — @colletdev/vue
<Button label="Save" variant="filled" intent="primary" @cx-click="save" />

// Svelte 5 — @colletdev/svelte
<Button label="Save" variant="filled" intent="primary" onClick={save} />

// Angular 16+ — @colletdev/angular
<cx-button collet label="Save" variant="filled" intent="primary" (cxClick)="save()" />

// Vanilla JS — @colletdev/core only
<cx-button label="Save" variant="filled" intent="primary"></cx-button>
<script>
  document.querySelector('cx-button').addEventListener('cx-click', save);
</script>`} language="tsx" filename="CrossFrameworkExamples.tsx" />
        <p>
          One design system. One set of tokens. One documentation site. One
          component fixed is fixed for every team. A designer reviews the same
          <code>variant</code> / <code>intent</code> / <code>shape</code> vocabulary
          regardless of which framework rendered it.
        </p>

        <DocsHeading id="what-you-can-trust">What you can trust</DocsHeading>
        <p>
          Under the hood, Collet components are compiled from Rust to WebAssembly
          and delivered as Custom Elements with Shadow DOM. You don't need to
          think about this — but it's why these guarantees hold:
        </p>
        <ul>
          <li><strong>Styles can't leak</strong> — Shadow DOM encapsulation, not naming conventions</li>
          <li><strong>Accessibility can't be skipped</strong> — compiler-enforced, not linter-suggested</li>
          <li><strong>Prop changes are batched</strong> — multiple updates = one render, automatically</li>
          <li><strong>Bundle size scales</strong> — register only what you use, code-split per component</li>
          <li><strong>No framework ships to users</strong> — static HTML first, behavior on demand</li>
        </ul>
        <p>
          You import components, use the shared vocabulary, and write
          your application logic. Everything between the prop and the pixel
          is handled.
        </p>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/seam">
          <Button label="SEAM Demo" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/migrating-from-shadcn-ui">
          <Button label="Migration" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
