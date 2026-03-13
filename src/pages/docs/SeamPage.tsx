import { Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { SeamTriggerDemo } from '../../components/SeamTriggerDemo';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  seamAdapterSnippet,
  seamGraphSnippet,
  seamNodes,
  seamResolverSnippet,
} from '../../docs/seamDemo';
import {
  seamAdapterPrinciples,
  seamArchitectureLayers,
  seamAttachmentSnippet,
  seamCliSnippet,
  seamCurrentState,
  seamDeliveryPlan,
  seamEnforcementSurfaces,
  seamHookSnippet,
  seamRuntimeSnippet,
  seamWriterSnippet,
} from '../../docs/seamPlan';

export function SeamPage() {
  usePageMeta(
    'SEAM Demo',
    'Interactive proof-of-concept for ambient SEAM-style context pings in this docs repo.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">SEAM Demo</h1>
      <p className="docs-page-lead">
        This page is a repo-local proof of concept for SEAM-style context triggers. It uses
        real constraints from this docs app so an AI or human can receive small, continuous
        context packets on session start, file open, and task requests without changing
        how they normally work.
      </p>

      <section className="docs-prose">
        <DocsHeading id="why-this-repo-works">Why this repo works as a POC</DocsHeading>
        <p>
          This docs app already has real invariants that are easy to break unless the editor is
          reminded at the right moment: the render-first lazy Collet init strategy, disabled WASM
          preload, version propagation through generated outputs, and the message API naming mismatch
          between grouped and standalone message surfaces.
        </p>
        <p>
          That makes it a strong place to test the trigger layer. The goal is not to replace normal
          coding behavior. The goal is to let the assistant behave normally while the tooling layer
          quietly injects the smallest relevant packet of repo knowledge.
        </p>

        <DocsHeading id="graph-surface">What the graph models here</DocsHeading>
        <table className="docs-table">
          <thead>
            <tr><th>Node</th><th>Type</th><th>What it protects</th></tr>
          </thead>
          <tbody>
            {seamNodes.map((node) => (
              <tr key={node.id}>
                <td><code>{node.id}</code></td>
                <td><code>{node.type}</code> · <code>{node.authority}</code></td>
                <td>{node.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="interactive-trigger-demo">Interactive trigger demo</DocsHeading>
        <p>
          The trigger simulator below shows the behavior we want from a real AI tooling layer:
          session start returns repo-wide constraints, file-open triggers return path-linked rules,
          and task prompts return procedures, examples, and warnings matched to the job.
        </p>
        <SeamTriggerDemo />

        <DocsHeading id="how-the-pings-are-achieved">How the pings are achieved</DocsHeading>
        <p>
          The implementation is intentionally small. A repo-local graph declares the watched surfaces.
          A resolver maps session, file, and task triggers to the relevant nodes. Then a thin adapter
          can turn that result into host-native behavior without changing the tool&apos;s normal workflow.
        </p>
        <ol>
          <li>Declare nodes with summaries, authority, watched file paths, and optional task keywords.</li>
          <li>Resolve events against those nodes by exact path, directory scope, or semantic task keywords.</li>
          <li>Rank results so warnings and canonical constraints appear before examples and context.</li>
          <li>Inject only the matched packet, not the whole graph.</li>
        </ol>

        <DocsHeading id="graph-example">Graph example</DocsHeading>
        <DocsCodeBlock code={seamGraphSnippet} language="json" filename=".seam/graph.json" />

        <DocsHeading id="resolver-example">Resolver example</DocsHeading>
        <DocsCodeBlock code={seamResolverSnippet} language="tsx" filename="seamResolver.ts" />

        <DocsHeading id="adapter-example">Adapter example</DocsHeading>
        <DocsCodeBlock code={seamAdapterSnippet} language="tsx" filename="seamAdapter.ts" />

        <DocsHeading id="what-this-poc-is-testing">What this POC is testing</DocsHeading>
        <ul>
          <li>Whether the assistant can get useful repo knowledge without manual SEAM commands.</li>
          <li>Whether startup, docs generation, versioning, and message-system rules stay visible at the right moments.</li>
          <li>Whether a small packet of context is enough to reduce drift without overwhelming the model.</li>
          <li>Whether the same trigger model can later support a real Writer and Reader without changing the repo’s development habits.</li>
        </ul>

        <DocsHeading id="what-the-demo-achieves-today">What the demo achieves today</DocsHeading>
        <div className="docs-card-grid">
          {seamCurrentState.map((item) => (
            <div key={item.title} className="docs-component-index-link">
              <div className="docs-component-index-body">
                <h3 className="docs-card-title">{item.title}</h3>
                <p className="docs-card-desc docs-component-index-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <DocsHeading id="current-repo-alignment">Current repo alignment</DocsHeading>
        <p>
          This POC is anchored to the actual repo state, not a hypothetical setup. It reflects the
          current render-first <code>{'init({ lazy: true })'}</code> pattern, the disabled WASM preload
          in Vite, the generated docs exports workflow, and the current Collet message API as documented
          in this app.
        </p>

        <DocsHeading id="target-architecture">Target architecture</DocsHeading>
        <p>
          The full SEAM system needs more than the current demo. The graph stays canonical, the Node API
          makes files and components attach to that graph, the runtime contract keeps triggers stable,
          adapters make it portable, the Reader makes it ambient for AI, and the Writer keeps it honest
          over time.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Layer</th><th>Purpose</th><th>How it should work</th></tr>
          </thead>
          <tbody>
            {seamArchitectureLayers.map((layer) => (
              <tr key={layer.layer}>
                <td><strong>{layer.layer}</strong></td>
                <td>{layer.purpose}</td>
                <td>{layer.implementation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="node-api-direction">Node API direction</DocsHeading>
        <p>
          The next research pass pointed to a typed attachment surface rather than comment-only pragmas.
          The graph should remain the source of truth, while code-local attachments give the editor and
          Reader a stable, autocomplete-friendly handle into that graph.
        </p>
        <DocsCodeBlock code={seamAttachmentSnippet} language="tsx" filename="seamAttachment.ts" />

        <DocsHeading id="runtime-contract">Runtime contract</DocsHeading>
        <p>
          The repo now owns a small runtime contract for SEAM events. That contract maps
          session-start, file-open, and task-request events to the same packet shape regardless of
          whether the consumer is an AI hook, an editor extension, a CLI, or a future MCP server.
        </p>
        <DocsCodeBlock code={seamRuntimeSnippet} language="tsx" filename="seamRuntime.ts" />

        <DocsHeading id="adapter-principles">Adapter principles</DocsHeading>
        <ul>
          {seamAdapterPrinciples.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>

        <DocsHeading id="repo-native-preflight">Repo-native preflight</DocsHeading>
        <p>
          To make SEAM harder to avoid, the repo now exposes a generic CLI and agent instructions in
          <code> AGENTS.md</code>. Any compliant coding agent can read the same session, file, and task
          packets without depending on one specific editor or AI product.
        </p>
        <DocsCodeBlock code={seamCliSnippet} language="sh" filename="scripts/seam-context.ts" />

        <DocsHeading id="example-adapter">Example adapter</DocsHeading>
        <p>
          Claude Code is just one adapter that already exists in this repo. It proves the model works,
          but it should remain an edge integration rather than the thing that defines SEAM.
        </p>
        <DocsCodeBlock code={seamHookSnippet} language="json" filename=".claude/settings.json" />

        <DocsHeading id="enforcement-surfaces">Current enforcement surfaces</DocsHeading>
        <p>
          SEAM is now unavoidable in the repo for compliant agents and hooked hosts, because the repo
          itself carries the graph, runtime contract, CLI, agent instructions, and a first Writer
          implementation. The remaining gap is richer installation and acknowledgment ergonomics, not
          the absence of a Writer path.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Surface</th><th>Status</th><th>What it means</th></tr>
          </thead>
          <tbody>
            {seamEnforcementSurfaces.map((surface) => (
              <tr key={surface.surface}>
                <td><strong>{surface.surface}</strong></td>
                <td>{surface.status}</td>
                <td>{surface.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="writer-example">Writer example</DocsHeading>
        <p>
          The Writer can now check explicit files, staged files, or a Git range. It can also write an
          explicit acknowledgment record into <code>.seam/audit/</code> when governed files changed but
          the graph itself does not need to.
        </p>
        <DocsCodeBlock code={seamWriterSnippet} language="sh" filename="scripts/seam-writer.ts" />

        <DocsHeading id="plan-a-to-z">Plan A to Z</DocsHeading>
        <p>
          This is the delivery sequence that would take the current docs demo to a real SEAM system that
          works for both AI tools and humans. Each phase is intentionally scoped so the graph, Reader,
          authoring layer, and Writer can mature without collapsing into one large implementation.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Step</th><th>Phase</th><th>Deliverable</th><th>What it unlocks</th></tr>
          </thead>
          <tbody>
            {seamDeliveryPlan.map((phase) => (
              <tr key={phase.step}>
                <td><code>{phase.step}</code></td>
                <td><strong>{phase.title}</strong></td>
                <td>{phase.deliverable}</td>
                <td>{phase.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="what-finished-seam-would-change">What finished SEAM would change</DocsHeading>
        <ul>
          <li>AI sessions would receive repo bootstrap, file, and task context automatically instead of through demo buttons.</li>
          <li>Files and components could attach to canonical nodes through a typed Node API rather than ad hoc human memory.</li>
          <li>Teams could choose their editor, AI tool, or CLI host without changing the graph or packet model.</li>
          <li>Commit and CI checks could detect drift between changed files and watched nodes without relying on team discipline alone.</li>
        </ul>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/usage">
          <Button label="Usage" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/conventions">
          <Button label="Conventions" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
