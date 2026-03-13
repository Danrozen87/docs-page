import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Badge, Button } from '@colletdev/react';
import { componentDocs } from './components/componentData';
import { PropsTable, EventsTable, PartsTable } from './components/PropsTable';
import { ComponentPreview } from './components/ComponentPreviews';
import { ComponentDocCodeBlock } from '../../components/ComponentDocCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  allComponentIds,
  componentCategories,
  getComponentExportHref,
  getComponentHref,
  totalComponentCount,
} from '../../docs/registry';

function ComponentOverview() {
  usePageMeta(
    'Components',
    `Browse all ${totalComponentCount} Collet components with live previews, props, events, CSS parts, and structured exports.`,
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Components</h1>
      <p className="docs-page-lead">
        {totalComponentCount} production-grade, accessible components. Compiled to WASM and
        delivered as Custom Elements. Click any to see its full API, live previews, and code examples.
      </p>
      <section className="docs-prose">
        {componentCategories.map((cat) => (
          <div key={cat.title} style={{ marginBottom: 'var(--space-8)' }}>
            <DocsHeading id={`components-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}>{cat.title}</DocsHeading>
            <div className="docs-card-grid">
              {cat.title === 'Data Display' && (
                <Link to="/docs/messages" className="docs-component-index-link">
                  <div className="docs-component-index-body">
                    <h3 className="docs-card-title">Messages</h3>
                    <p className="docs-card-desc docs-component-index-desc">
                      Composition guide for timeline-oriented chat, assistant, and agent interfaces.
                    </p>
                  </div>
                </Link>
              )}
              {cat.ids.map((id) => {
                const meta = componentDocs[id];
                return meta ? (
                  <Link key={id} to={getComponentHref(id)} className="docs-component-index-link">
                    <div className="docs-component-index-body">
                      <h3 className="docs-card-title">{meta.title}</h3>
                      <p className="docs-card-desc docs-component-index-desc">{meta.description}</p>
                    </div>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ComponentDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const componentId = id as keyof typeof componentDocs;
  const meta = componentDocs[componentId];

  if (!meta) {
    return (
      <div className="docs-section">
        <h1 className="docs-page-title">Component not found</h1>
        <p className="docs-page-lead">
          No documentation available for <code>{id}</code>.
        </p>
        <Link to="/docs/components">
          <Button label="Browse all components" variant="ghost" iconLeading="arrow-left" />
        </Link>
      </div>
    );
  }

  // Prev/next navigation
  const idx = allComponentIds.indexOf(componentId);
  const prevId = idx > 0 ? allComponentIds[idx - 1] : null;
  const nextId = idx < allComponentIds.length - 1 ? allComponentIds[idx + 1] : null;
  const prevMeta = prevId ? componentDocs[prevId] : null;
  const nextMeta = nextId ? componentDocs[nextId] : null;

  usePageMeta(meta.title, meta.description);

  return (
    <div className="docs-section">
      {/* Header */}
      <div className="docs-component-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <h1 className="docs-page-title" style={{ marginBottom: 0 }}>{meta.title}</h1>
            <Badge label={meta.category} variant="outline" intent="primary" size="xs" shape="pill" />
          </div>
          <Button
            label="Open JSON"
            variant="outline"
            size="sm"
            kind="link"
            href={getComponentExportHref(componentId)}
          />
        </div>
        <p className="docs-page-lead">{meta.description}</p>
        <p className="docs-component-meta-note">
          Use <strong>On this page</strong> to scan the human docs and <strong>Open JSON</strong>
          {' '}for the machine-readable component export.
        </p>
      </div>

      <section className="docs-prose">
        {/* Import */}
        <DocsHeading id="import">Import</DocsHeading>
        <ComponentDocCodeBlock
          content={`import { ${meta.importName} } from '@colletdev/react';`}
          language="tsx"
        />

        {/* Live Preview */}
        <DocsHeading id="preview">Preview</DocsHeading>
        <div className="docs-preview">
          <ComponentPreview id={componentId} />
        </div>

        {/* Variants / Shapes / Intents */}
        {(meta.variants || meta.shapes || meta.intents) && (
          <>
            <DocsHeading id="options">Options</DocsHeading>
            <div className="docs-options-grid">
              {meta.variants && (
                <div>
                  <h4 className="docs-option-label">Variants</h4>
                  <div className="docs-option-tags">
                    {meta.variants.map((v) => (
                      <code key={v} className="docs-option-tag">{v}</code>
                    ))}
                  </div>
                </div>
              )}
              {meta.shapes && (
                <div>
                  <h4 className="docs-option-label">Shapes</h4>
                  <div className="docs-option-tags">
                    {meta.shapes.map((s) => (
                      <code key={s} className="docs-option-tag">{s}</code>
                    ))}
                  </div>
                </div>
              )}
              {meta.intents && (
                <div>
                  <h4 className="docs-option-label">Intents</h4>
                  <div className="docs-option-tags">
                    {meta.intents.map((i) => (
                      <code key={i} className="docs-option-tag">{i}</code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Props Table */}
        <DocsHeading id="props">Props</DocsHeading>
        <PropsTable props={meta.props} />

        {/* Events */}
        {meta.events && meta.events.length > 0 && (
          <>
            <DocsHeading id="events">Events</DocsHeading>
            <EventsTable events={meta.events} />
          </>
        )}

        {/* CSS Parts */}
        {meta.parts.length > 0 && (
          <>
            <DocsHeading id="css-parts">CSS Parts</DocsHeading>
            <p>Target these parts with <code>::part()</code> selectors:</p>
            <PartsTable parts={meta.parts} />
            <ComponentDocCodeBlock
              content={`cx-${componentId}::part(${meta.parts[0]}) {\n  /* your styles */\n}`}
              language="css"
            />
          </>
        )}

        {/* Notes */}
        {meta.notes && meta.notes.length > 0 && (
          <>
            <DocsHeading id="notes">Notes</DocsHeading>
            <ul>
              {meta.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </>
        )}

        {/* Accessibility */}
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <ul>
          <li>WCAG 2.2 AA compliant — enforced by the Rust compiler.</li>
          <li>Keyboard navigation built in.</li>
          <li>ARIA attributes generated automatically.</li>
          <li>Focus indicators always visible.</li>
        </ul>
      </section>

      {/* Prev / Next */}
      <div className="docs-page-nav">
        {prevMeta && prevId ? (
          <Button label={prevMeta.title} variant="ghost" size="sm" iconLeading="arrow-left" onClick={() => navigate(`/docs/components/${prevId}`)} />
        ) : <div />}
        {nextMeta && nextId ? (
          <Button label={nextMeta.title} variant="ghost" size="sm" iconTrailing="arrow-right" onClick={() => navigate(`/docs/components/${nextId}`)} />
        ) : <div />}
      </div>
    </div>
  );
}

export function ComponentPage() {
  const { componentId } = useParams();

  if (!componentId) {
    return <ComponentOverview />;
  }

  return <ComponentDetail id={componentId} />;
}
