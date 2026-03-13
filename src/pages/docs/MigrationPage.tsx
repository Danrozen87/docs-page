import { Button } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';

export function MigrationPage() {
  usePageMeta(
    'Migrating from shadcn/ui',
    'Move from copied shadcn/ui component source and underlying Radix patterns to Collet’s typed component layer, token system, and lower-context workflow.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Migrating from shadcn/ui</h1>
      <p className="docs-page-lead">
        The easiest migration is usually not a full feature rewrite. It is replacing the internals
        of your existing <code>components/ui</code> layer first, keeping import paths stable, and
        simplifying feature code after the app already runs on Collet-backed primitives.
      </p>

      <section className="docs-prose">
        <DocsHeading id="where-to-start">Where to start</DocsHeading>
        <p>
          In most shadcn/ui apps, the natural seam is the local <code>components/ui</code> folder.
          That is where copied component source, Tailwind variants, and Radix composition patterns
          usually live. It is the right place to begin because it lets you migrate internals without
          forcing every feature import to change on day one.
        </p>
        <DocsCodeBlock code={`// Feature code stays stable at first
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// The migration happens behind those files first.`} language="tsx" filename="FeatureImports.tsx" />

        <DocsHeading id="what-changes">What changes</DocsHeading>
        <p>
          With shadcn/ui, you typically own copied React component source, Tailwind classes,
          and a lot of behavior inherited from Radix primitives. With Collet, you move up a level:
          typed props, shared design tokens, and framework wrappers over the same underlying
          Custom Elements.
        </p>
        <p>
          The point of migration is not to preserve every local abstraction forever. The point is
          to reduce how much UI implementation detail leaks into feature code.
        </p>

        <DocsHeading id="path-of-least-resistance">Path of least resistance</DocsHeading>
        <p>
          The lowest-risk path is to keep your existing exports for a while and swap the internals.
          Start with primitives like buttons, alerts, cards, badges, and text inputs. After that,
          migrate overlays and more structured inputs.
        </p>
        <DocsCodeBlock code={`// components/ui/button.tsx
import { Button as ColletButton } from '@colletdev/react';
import type { ButtonProps as ColletButtonProps } from '@colletdev/react';

type LegacyVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type LegacySize = 'sm' | 'default' | 'lg';

type Props = {
  children?: React.ReactNode;
  variant?: LegacyVariant;
  size?: LegacySize;
  disabled?: boolean;
  onClick?: ColletButtonProps['onClick'];
};

function mapVariant(variant: LegacyVariant) {
  switch (variant) {
    case 'destructive':
      return { variant: 'filled', intent: 'danger' } as const;
    case 'outline':
      return { variant: 'outline', intent: 'neutral' } as const;
    case 'ghost':
      return { variant: 'ghost', intent: 'neutral' } as const;
    case 'secondary':
      return { variant: 'filled', intent: 'neutral' } as const;
    default:
      return { variant: 'filled', intent: 'primary' } as const;
  }
}

function mapSize(size: LegacySize) {
  switch (size) {
    case 'sm':
      return 'sm' as const;
    case 'lg':
      return 'lg' as const;
    default:
      return 'md' as const;
  }
}

export function Button({ children, variant = 'default', size = 'default', ...props }: Props) {
  if (typeof children !== 'string') {
    throw new Error('Temporary migration wrapper only supports string children. Migrate this call site to Collet props.');
  }

  return (
    <ColletButton
      label={children}
      size={mapSize(size)}
      {...mapVariant(variant)}
      {...props}
    />
  );
}`} language="tsx" filename="components/ui/button.tsx" />
        <p>
          That wrapper is not the final state. It is the bridge. Its job is to keep your app working
          while you migrate from old variant names to native Collet props like <code>intent</code> and
          <code>variant</code>.
        </p>

        <DocsHeading id="mental-model-shift">Mental model shift</DocsHeading>
        <DocsCodeBlock code={`// shadcn/ui mindset
// Own the implementation, style locally, compose around primitive behavior
<Button className="bg-slate-900 hover:bg-slate-800 rounded-full">
  Save
</Button>

// Collet mindset
// Declare intent, keep styling in tokens, trust the component contract
<Button label="Save" variant="filled" intent="primary" />`} language="tsx" filename="MentalModel.tsx" />
        <p>
          The migration is mostly about deleting local appearance logic and replacing it with
          a stable component vocabulary: <code>variant</code>, <code>intent</code>, <code>shape</code>,
          and <code>size</code>.
        </p>

        <DocsHeading id="incremental-migration-stages">Incremental migration stages</DocsHeading>
        <ol>
          <li>Wrap Collet behind your existing <code>components/ui</code> exports.</li>
          <li>Keep feature imports stable while replacing internals file by file.</li>
          <li>Update feature code to use Collet-native props directly.</li>
          <li>Delete temporary compatibility wrappers once the old API surface is no longer needed.</li>
        </ol>

        <DocsHeading id="mapping-common-patterns">Mapping common patterns</DocsHeading>
        <DocsCodeBlock code={`// shadcn/ui button
<Button variant="destructive">Delete</Button>

// Collet button
<Button label="Delete" variant="filled" intent="danger" />

// shadcn/ui dialog footer actions
<DialogFooter>
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</DialogFooter>

// Collet dialog actions
<Dialog
  open={open}
  title="Edit profile"
  footer={
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
      <Button label="Cancel" variant="ghost" onClick={() => setOpen(false)} />
      <Button label="Save" variant="filled" intent="primary" onClick={() => setOpen(false)} />
    </div>
  }
/>`} language="tsx" filename="MigrationExamples.tsx" />

        <DocsHeading id="what-to-stop-doing">What to stop doing</DocsHeading>
        <ul>
          <li>Stop copying and forking component source when the goal is only to restyle or rename behavior.</li>
          <li>Stop pushing semantic meaning into class names like <code>bg-red-600</code> or ad hoc variants.</li>
          <li>Stop rebuilding focus handling, ARIA wiring, popover positioning, and form glue in product code.</li>
          <li>Stop treating every product surface as a new component-authoring exercise.</li>
        </ul>

        <DocsHeading id="what-to-keep">What to keep</DocsHeading>
        <ul>
          <li>Keep your route structure, product logic, and data flow exactly where they are.</li>
          <li>Keep your <code>components/ui</code> folder during migration if it gives you a controlled rollout path.</li>
          <li>Keep layout wrappers that encode product structure rather than design-system duplication.</li>
          <li>Keep brand decisions, but move them into tokens and <code>::part()</code> hooks instead of per-component class stacks.</li>
        </ul>

        <DocsHeading id="verified-caveats">Verified caveats</DocsHeading>
        <p>
          These are the important caveats to understand up front. They are not theoretical. They
          follow from the actual Collet React wrapper API in this repo.
        </p>
        <ul>
          <li>There is no direct <code>asChild</code> equivalent. If your app relies on that Radix pattern heavily, those call sites need explicit redesign.</li>
          <li>Collet <code>Button</code> takes <code>label</code>, <code>iconLeading</code>, <code>iconTrailing</code>, and <code>iconOnly</code> props. It is not a general free-form children button API.</li>
          <li>Compatibility wrappers can preserve import paths, but they often cannot preserve every old prop or every JSX child shape.</li>
          <li>Tailwind selectors tied to Radix DOM state like <code>data-state="open"</code> do not map one-to-one. Expect to delete those, not translate them mechanically.</li>
          <li>Overlay and menu migrations usually take longer than simple primitives because they replace both styling and behavior assumptions at the same time.</li>
        </ul>

        <DocsHeading id="radix-specific-things-to-watch">Radix-specific things to watch</DocsHeading>
        <p>
          The page is titled shadcn/ui because that is what most teams identify with, but a lot of
          migration friction actually comes from the Radix-era patterns underneath:
        </p>
        <ul>
          <li>State attributes such as <code>data-state</code> and animation classes bound to those attributes</li>
          <li>Portal-heavy overlay composition patterns</li>
          <li>Slotting and composition tricks built around <code>asChild</code></li>
          <li>Utility classes that assume a specific internal DOM structure</li>
        </ul>
        <p>
          Expect to replace those patterns with Collet-native component APIs rather than recreating
          Radix internals on top of Collet.
        </p>

        <DocsHeading id="when-not-to-migrate">When not to migrate</DocsHeading>
        <p>
          Do not migrate just to chase novelty. If your team depends on total source ownership,
          custom internal markup, or heavy Tailwind-driven component authoring, shadcn/ui may still
          fit better. Collet is strongest when your problem is codebase sprawl, review overhead,
          and too much UI implementation detail leaking into feature work.
        </p>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/conventions">
          <Button label="Conventions" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/theming">
          <Button label="Theming" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
