import { Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { DocsInlineCommand } from '../../components/DocsInlineCommand';
import { usePageMeta } from '../../hooks/usePageMeta';
import { COLLET_VERSION, totalComponentCount } from '../../docs/registry';

export function InstallationPage() {
  usePageMeta(
    'Installation',
    'Install Collet from npm, understand the shared runtime and wrapper packages, and optionally wire up @colletdev/docs for AI tooling.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Installation</h1>
      <p className="docs-page-lead">
        Install the runtime once, then keep UI complexity out of feature code.
      </p>

      <section className="docs-prose">
        <DocsHeading id="what-you-are-installing">What you are installing</DocsHeading>
        <p>
          Collet is not a starter kit that copies component code into your app.
          You are installing a shared UI runtime plus a thin framework wrapper.
          That keeps accessibility, interaction behavior, theming primitives, and
          component conventions inside the design system instead of scattering them
          across product files.
        </p>
        <p>
          The practical result is smaller diffs, a lower review surface, and less
          context required for humans or AI agents to make safe changes. The install
          step matters because it changes where UI complexity lives.
        </p>

        <DocsHeading id="packages">Packages</DocsHeading>
        <p>
          <strong>@colletdev/core</strong> — Custom Element definitions, design tokens, WASM binary,
          and the runtime loader. Required by all framework wrappers. This is the engine.
        </p>
        <p>
          <strong>@colletdev/react</strong> — Thin React wrappers that handle attribute serialization,
          event bridging, and typed refs. This is the developer experience layer.
        </p>
        <p>
          The same pattern applies to <code>@colletdev/vue</code>, <code>@colletdev/svelte</code>,
          and <code>@colletdev/angular</code> — each provides typed, idiomatic wrappers for
          its framework while delegating rendering to <code>@colletdev/core</code>.
        </p>

        <DocsHeading id="prerequisites">Prerequisites</DocsHeading>
        <ul>
          <li>Node.js 18+</li>
          <li>React 18+ (peer dependency)</li>
          <li>A modern bundler — Vite, webpack, or Next.js</li>
        </ul>

        <DocsHeading id="install-from-npm">Install from npm</DocsHeading>
        <DocsInlineCommand command="npm install @colletdev/core @colletdev/react" ariaLabel="Copy npm install command" />

        <DocsHeading id="install-from-tarballs">Install from tarballs</DocsHeading>
        <p>If you have local builds:</p>
        <DocsInlineCommand
          command={`npm install ./collet-core-${COLLET_VERSION}.tgz ./collet-react-${COLLET_VERSION}.tgz`}
          ariaLabel="Copy tarball install command"
        />

        <DocsHeading id="other-frameworks">Other frameworks</DocsHeading>
        <p>
          Collet has framework wrappers for Vue, Svelte, and Angular alongside React.
          Install the one that matches your stack:
        </p>
        <DocsCodeBlock code={`npm install @colletdev/core @colletdev/react    # React
npm install @colletdev/core @colletdev/vue      # Vue 3
npm install @colletdev/core @colletdev/svelte   # Svelte 5
npm install @colletdev/core @colletdev/angular  # Angular 16+`} language="bash" filename="framework-install.sh" />
        <p>
          Every wrapper renders the same <code>&lt;cx-*&gt;</code> Custom Elements underneath.
          The component API, design tokens, and accessibility guarantees are identical
          across all frameworks.
        </p>

        <DocsHeading id="ai-agent-context">Optional: AI agent context</DocsHeading>
        <p>
          If you use coding agents, install the companion package <code>@colletdev/docs</code>.
          It gives AI assistants full knowledge of all {totalComponentCount} components —
          props, events, methods, types, and framework-specific patterns.
        </p>
        <DocsInlineCommand command="npm install @colletdev/docs" ariaLabel="Copy @colletdev/docs install command" />
        <p>
          Then run the CLI to configure your AI tool:
        </p>
        <DocsCodeBlock code={`npx @colletdev/docs init            # auto-detect your AI tool
npx @colletdev/docs init --claude   # Claude Code
npx @colletdev/docs init --codex    # OpenAI Codex
npx @colletdev/docs init --cursor   # Cursor AI
npx @colletdev/docs init --all      # all formats`} language="bash" filename="ai-init.sh" />
        <p>
          The CLI detects your framework from <code>package.json</code> and generates
          context-aware configuration. For Claude Code it creates a skill
          at <code>.claude/skills/collet/</code> with the full API reference.
          For Codex it appends to <code>AGENTS.md</code>. For Cursor
          it writes <code>.cursor/rules/collet.md</code>.
        </p>
        <p>
          The docs are designed to work for both humans and agents. Human readers get
          stable heading structure and the <code>On this page</code> table of contents.
          Agents get machine-readable exports through <code>llms.txt</code>, the JSON index,
          and per-component JSON files.
        </p>

        <DocsHeading id="what-you-get">What you get</DocsHeading>
        <p>Seven reference files (108 KB total) covering the entire library:</p>
        <table className="docs-table">
          <thead>
            <tr><th>File</th><th>Contents</th></tr>
          </thead>
          <tbody>
            <tr><td><code>core.md</code></td><td>Initialization, theming, CSS architecture, SSR, events, form integration</td></tr>
            <tr><td><code>components.md</code></td><td>All {totalComponentCount} components — props, events, methods, types, ARIA</td></tr>
            <tr><td><code>react.md</code></td><td>React 18+ wrappers, hooks, ref types, event callbacks</td></tr>
            <tr><td><code>vue.md</code></td><td>Vue 3.3+ wrappers, Composition API, Volar setup</td></tr>
            <tr><td><code>svelte.md</code></td><td>Svelte 5 runes wrappers, callback props</td></tr>
            <tr><td><code>angular.md</code></td><td>Angular 16+ standalone components, forms, template binding</td></tr>
          </tbody>
        </table>
        <p>
          Your AI agent can then answer questions about any Collet component, suggest
          correct imports, generate framework-idiomatic code, and reference the exact
          prop types — without you looking anything up.
        </p>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/introduction">
          <Button label="Introduction" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/usage">
          <Button label="Usage" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
