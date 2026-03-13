import { Component, useEffect, useMemo, useRef, useState, type ElementRef, type ReactNode } from 'react';
import {
  Button, Card, Badge, TextInput, Select, Checkbox, Switch, Alert,
  Tabs, Accordion, Tooltip, Spinner, Progress, Skeleton,
  ToggleGroup, SplitButton, Fab, SpeedDial, RadioGroup, Autocomplete,
  Slider, Menu, Breadcrumb, Pagination, Table, Listbox,
  Popover, Collapsible, Avatar, Scrollbar, Toast, Carousel, Text,
  ChatInput, DatePicker, SearchBar, FileUpload, CodeBlock,
  Stepper, ProfileMenu, Thinking, Drawer, Dialog, Backdrop,
  ActivityGroup, MessageBubble, MessageGroup, MessagePart,
} from '@colletdev/react';
import type { MessageGroupPart } from '@colletdev/react';
import { ComponentDocCodeBlock } from '../../../components/ComponentDocCodeBlock';
import {
  MESSAGE_GROUP_EXAMPLE,
  MESSAGE_PART_EXAMPLE,
  MESSAGE_PART_STREAM_EXAMPLE,
} from '../../../docs/messagesContent';

const flexRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' };
const flexCol: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' };
const grid: React.CSSProperties = { display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' };

class PreviewErrorBoundary extends Component<
  { id: string; children: ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <p><strong>Preview unavailable</strong> — {this.props.id} threw an error:</p>
          <pre style={{ marginTop: 8, fontSize: '0.8rem', opacity: 0.7 }}>{this.state.error}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ComponentPreview({ id }: { id: string }) {
  return (
    <PreviewErrorBoundary id={id}>
      <ComponentPreviewInner id={id} />
    </PreviewErrorBoundary>
  );
}

const tableColumns = [
  { id: 'name', header: 'Name', sortable: true },
  { id: 'role', header: 'Role', sortable: true },
  { id: 'email', header: 'Email' },
];

const tableRows = [
  { id: '1', cells: [{ text: 'Alice Johnson' }, { text: 'Engineer' }, { text: 'alice@co.com' }] },
  { id: '2', cells: [{ text: 'Bob Smith' }, { text: 'Designer' }, { text: 'bob@co.com' }] },
  { id: '3', cells: [{ text: 'Charlie Brown' }, { text: 'PM' }, { text: 'charlie@co.com' }] },
];

function ProgressPreview() {
  return (
    <div style={flexCol}>
      <Progress label="Upload" value={25} intent="primary" />
      <Progress label="Processing" value={65} intent="primary" valueText="65%" />
      <Progress label="Almost done" value={90} intent="success" />
    </div>
  );
}

function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div style={flexCol}>
      <div style={flexRow}>
        <Button label="Open dialog" variant="outline" onClick={() => setOpen(true)} />
      </div>
      <Dialog
        open={open}
        title="Confirm action"
        description="This will apply the changes to your project."
        size="sm"
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
            <Button label="Cancel" variant="ghost" onClick={() => setOpen(false)} />
            <Button label="Confirm" variant="filled" intent="primary" onClick={() => setOpen(false)} />
          </div>
        }
      >
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          Are you sure you want to proceed?
        </p>
      </Dialog>
    </div>
  );
}

function DrawerPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div style={flexCol}>
      <div style={flexRow}>
        <Button label="Open right" variant="outline" onClick={() => setOpen(true)} />
      </div>
      <Drawer
        open={open}
        title="Settings"
        side="right"
        onClose={() => setOpen(false)}
        footer={<Button label="Save" variant="filled" intent="primary" onClick={() => setOpen(false)} />}
      >
        <p>Drawer content slides in from the edge. Close with the X button, the backdrop, or Escape.</p>
      </Drawer>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div style={flexCol}>
      <h4 className="docs-preview-label">Text</h4>
      <Skeleton variant="text" lines={3} style={{ width: '100%' }} />
      <Skeleton variant="text" lines={2} style={{ width: '75%' }} />
      <Skeleton variant="text" lines={1} style={{ width: '40%' }} size="sm" />
      <h4 className="docs-preview-label">Shapes</h4>
      <div style={flexRow}>
        <Skeleton variant="circle" size="lg" />
        <Skeleton variant="rectangular" size="lg" />
      </div>
    </div>
  );
}

function MessagePartPreview() {
  const ref = useRef<ElementRef<typeof MessagePart>>(null);

  useEffect(() => {
    let cancelled = false;

    async function stream() {
      const current = ref.current;
      if (!current) return;

      await current.startStream();
      if (cancelled) return;

      current.appendTokens('**Collet** can stream markdown');
      current.appendTokens(' into a single message part');
      current.appendTokens(' without re-rendering the whole message.');

      await current.endStream();
    }

    void stream();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={flexCol}>
      <MessagePart kind="text" markdown content="**Hello** world from MessagePart." />
      <MessagePart kind="code-block" language="tsx" filename="Message.tsx" content={'<MessagePart kind="text" />'} />
      <MessagePart kind="thinking" thinkingLabel="Streaming follow-up content..." />
      <MessagePart ref={ref} kind="text" markdown stream />
    </div>
  );
}

function BackdropPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div style={flexCol}>
      <div
        style={{
          position: 'relative',
          minHeight: '180px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--color-primary) 8%, var(--color-surface)) 0%, var(--color-surface) 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <Button
            label="Preview surface under backdrop"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            style={{ pointerEvents: open ? 'none' : 'auto' }}
          />
        </div>
        {open && (
          <>
            <Backdrop
              tint="rgba(15, 23, 42, 0.42)"
              blur="4px"
              style={{ position: 'absolute', inset: 0, zIndex: 2 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Button
                label="Close preview"
                variant="filled"
                intent="primary"
                onClick={() => setOpen(false)}
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TablePreview() {
  const [sort, setSort] = useState<{ column_id: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedRows = useMemo(() => {
    if (!sort) return tableRows;
    const colIdx = tableColumns.findIndex((c) => c.id === sort.column_id);
    if (colIdx < 0) return tableRows;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...tableRows].sort((a, b) => {
      const av = (a.cells[colIdx] as { text: string }).text;
      const bv = (b.cells[colIdx] as { text: string }).text;
      return av.localeCompare(bv) * dir;
    });
  }, [sort]);

  const sorts = sort
    ? [{ column_id: sort.column_id, direction: sort.direction }]
    : undefined;

  return (
    <Table
      caption="Team members"
      variant="striped"
      hoverable
      columns={tableColumns}
      rows={sortedRows}
      sorts={sorts}
      onSort={(e) => {
        const { column_id, direction } = e.detail;
        if (direction === 'asc' || direction === 'desc') {
          setSort({ column_id, direction });
        } else {
          setSort(null);
        }
      }}
    />
  );
}

function ComponentPreviewInner({ id }: { id: string }) {
  switch (id) {
    // ── Actions ──

    case 'button':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Variants</h4>
          <div style={flexRow}>
            <Button label="Filled" variant="filled" intent="primary" />
            <Button label="Outline" variant="outline" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Underline" variant="underline" />
          </div>
          <h4 className="docs-preview-label">Intents</h4>
          <div style={flexRow}>
            <Button label="Primary" variant="filled" intent="primary" />
            <Button label="Success" variant="filled" intent="success" />
            <Button label="Warning" variant="filled" intent="warning" />
            <Button label="Danger" variant="filled" intent="danger" />
            <Button label="Info" variant="filled" intent="info" />
            <Button label="Neutral" variant="filled" intent="neutral" />
          </div>
          <h4 className="docs-preview-label">Shapes</h4>
          <div style={flexRow}>
            <Button label="Sharp" variant="filled" intent="primary" shape="sharp" />
            <Button label="Rounded" variant="filled" intent="primary" shape="rounded" />
            <Button label="Pill" variant="filled" intent="primary" shape="pill" />
          </div>
          <h4 className="docs-preview-label">With Icons</h4>
          <div style={flexRow}>
            <Button label="Save" variant="filled" intent="primary" iconLeading="save" />
            <Button label="Next" variant="outline" iconTrailing="arrow-right" />
            <Button iconOnly="plus" ariaLabel="Add" variant="outline" />
            <Button iconOnly="settings" ariaLabel="Settings" variant="ghost" />
          </div>
          <h4 className="docs-preview-label">Sizes</h4>
          <div style={flexRow}>
            <Button label="XS" variant="filled" intent="primary" size="xs" />
            <Button label="SM" variant="filled" intent="primary" size="sm" />
            <Button label="MD" variant="filled" intent="primary" size="md" />
            <Button label="LG" variant="filled" intent="primary" size="lg" />
            <Button label="XL" variant="filled" intent="primary" size="xl" />
          </div>
          <h4 className="docs-preview-label">States</h4>
          <div style={flexRow}>
            <Button label="Disabled" variant="filled" intent="primary" disabled />
          </div>
        </div>
      );

    case 'badge':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Intents</h4>
          <div style={flexRow}>
            <Badge label="Neutral" intent="neutral" />
            <Badge label="Primary" intent="primary" />
            <Badge label="Success" intent="success" />
            <Badge label="Warning" intent="warning" />
            <Badge label="Danger" intent="danger" />
            <Badge label="Info" intent="info" />
          </div>
          <h4 className="docs-preview-label">Variants</h4>
          <div style={flexRow}>
            <Badge label="Filled" variant="filled" intent="primary" />
            <Badge label="Outline" variant="outline" intent="primary" />
            <Badge label="Ghost" variant="ghost" intent="primary" />
          </div>
          <h4 className="docs-preview-label">Dot</h4>
          <div style={flexRow}>
            <Badge label="Status" dot intent="success" />
            <Badge label="Alert" dot intent="danger" />
          </div>
          <h4 className="docs-preview-label">Sizes</h4>
          <div style={flexRow}>
            <Badge label="XS" size="xs" intent="primary" />
            <Badge label="SM" size="sm" intent="primary" />
            <Badge label="MD" size="md" intent="primary" />
          </div>
        </div>
      );

    case 'toggle-group':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Single Select</h4>
          <ToggleGroup
            label="Alignment"
            mode="single"
            variant="outline"
            size="sm"
            items={[
              { id: 'left', label: 'Left', icon: 'align-left' },
              { id: 'center', label: 'Center', icon: 'align-center' },
              { id: 'right', label: 'Right', icon: 'align-right' },
            ]}
          />
          <h4 className="docs-preview-label">Multiple Select</h4>
          <ToggleGroup
            label="Formatting"
            mode="multiple"
            variant="outline"
            size="sm"
            items={[
              { id: 'bold', label: 'Bold', icon: 'bold' },
              { id: 'italic', label: 'Italic', icon: 'italic' },
              { id: 'underline', label: 'Underline', icon: 'underline' },
            ]}
          />
        </div>
      );

    case 'split-button':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Variants</h4>
          <div style={flexRow}>
            <SplitButton
              id="save-filled"
              label="Save"
              variant="filled"
              intent="primary"
              iconLeading="save"
              triggerLabel="More options"
              entries={[
                { type: 'item', id: 'draft', label: 'Save as draft', icon: 'file-text' },
                { type: 'item', id: 'publish', label: 'Save and publish', icon: 'upload' },
                { type: 'separator' },
                { type: 'item', id: 'discard', label: 'Discard', intent: 'danger', icon: 'trash' },
              ]}
            />
            <SplitButton
              id="save-outline"
              label="Export"
              variant="outline"
              triggerLabel="Export options"
              entries={[
                { type: 'item', id: 'csv', label: 'Export as CSV', icon: 'file-text' },
                { type: 'item', id: 'json', label: 'Export as JSON', icon: 'braces' },
              ]}
            />
          </div>
        </div>
      );

    case 'fab':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Icon Only</h4>
          <div style={flexRow}>
            <Fab icon="plus" ariaLabel="Add" variant="filled" intent="primary" size="sm" />
            <Fab icon="plus" ariaLabel="Add" variant="filled" intent="primary" size="md" />
            <Fab icon="plus" ariaLabel="Add" variant="filled" intent="primary" size="lg" />
          </div>
          <h4 className="docs-preview-label">Extended (Icon + Label)</h4>
          <div style={flexRow}>
            <Fab icon="edit" label="Compose" intent="primary" />
            <Fab icon="plus" label="New item" variant="outline" />
          </div>
        </div>
      );

    case 'speed-dial':
      return (
        <div style={{ position: 'relative', minHeight: '240px' }}>
          <div style={{ position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)' }}>
            <SpeedDial
              id="demo-speed-dial"
              icon="plus"
              ariaLabel="Quick actions"
              direction="up"
              backdrop={false}
              actions={[
                { id: 'compose', icon: 'edit', label: 'Compose' },
                { id: 'upload', icon: 'upload', label: 'Upload' },
                { id: 'share', icon: 'share', label: 'Share' },
              ]}
            />
          </div>
        </div>
      );

    // ── Form Inputs ──

    case 'text-input':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Variants</h4>
          <TextInput label="Outline" variant="outline" placeholder="Type here..." />
          <TextInput label="Filled" variant="filled" placeholder="Type here..." />
          <TextInput label="Ghost" variant="ghost" placeholder="Type here..." />
          <h4 className="docs-preview-label">With Icons</h4>
          <TextInput label="Search" variant="outline" prefixIcon="search" placeholder="Search..." />
          <TextInput label="Email" kind="email" variant="outline" prefixIcon="mail" suffixIcon="check" placeholder="you@example.com" />
          <h4 className="docs-preview-label">States</h4>
          <TextInput label="With helper" variant="outline" helperText="We'll never share your email" />
          <TextInput label="With error" variant="outline" error="This field is required" />
          <TextInput label="Disabled" variant="outline" disabled placeholder="Can't edit" />
          <h4 className="docs-preview-label">Password</h4>
          <TextInput label="Password" kind="password" variant="outline" passwordToggle placeholder="Enter password" />
        </div>
      );

    case 'checkbox':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">States</h4>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" checked="checked" />
          <Checkbox label="Indeterminate" checked="indeterminate" />
          <Checkbox label="Disabled" disabled />
          <h4 className="docs-preview-label">With Helper & Error</h4>
          <Checkbox label="Accept terms" required helperText="Required to continue" />
          <Checkbox label="Agree to policy" error="You must agree" />
        </div>
      );

    case 'switch':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">States</h4>
          <Switch label="Off" />
          <Switch label="On" checked />
          <Switch label="With description" description="Enable push notifications" />
          <Switch label="Disabled" disabled />
          <h4 className="docs-preview-label">Shapes</h4>
          <Switch label="Sharp" shape="sharp" checked />
          <Switch label="Rounded" shape="rounded" checked />
          <Switch label="Pill" shape="pill" checked />
          <h4 className="docs-preview-label">With Helper & Error</h4>
          <Switch label="Notifications" helperText="We'll send you email updates" />
          <Switch label="Terms" error="You must accept to continue" />
        </div>
      );

    case 'radio-group':
      return (
        <RadioGroup
          legend="Select a plan"
          name="demo-plan"
          selected="pro"
          options={[
            { value: 'free', label: 'Free', description: '$0/month — 1 project' },
            { value: 'pro', label: 'Pro', description: '$10/month — unlimited projects' },
            { value: 'team', label: 'Team', description: '$25/month — team collaboration', disabled: true },
          ]}
        />
      );

    case 'select':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Basic</h4>
          <Select
            label="Country"
            variant="outline"
            placeholder="Choose a country"
            items={[
              { value: 'se', label: 'Sweden' },
              { value: 'no', label: 'Norway' },
              { value: 'dk', label: 'Denmark' },
              { value: 'fi', label: 'Finland' },
            ]}
          />
          <h4 className="docs-preview-label">Variants</h4>
          <Select label="Filled" variant="filled" placeholder="Choose..." items={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]} />
        </div>
      );

    case 'autocomplete':
      return (
        <div style={flexCol}>
          <Autocomplete
            label="Search users"
            variant="outline"
            placeholder="Type to search..."
            items={[
              { value: 'alice', label: 'Alice Johnson' },
              { value: 'bob', label: 'Bob Smith' },
              { value: 'charlie', label: 'Charlie Brown' },
              { value: 'diana', label: 'Diana Prince' },
            ]}
          />
        </div>
      );

    case 'slider':
      return (
        <div style={flexCol}>
          <Slider label="Volume" min={0} max={100} step={1} value={65} showValue />
          <Slider label="Opacity" min={0} max={100} step={5} value={80} showValue size="sm" />
        </div>
      );

    // ── Navigation ──

    case 'tabs':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Underline</h4>
          <Tabs
            label="Settings"
            variant="underline"
            defaultTab="general"
            items={[
              { value: 'general', label: 'General', content: '<p>General settings panel content.</p>' },
              { value: 'security', label: 'Security', content: '<p>Security settings panel content.</p>' },
              { value: 'billing', label: 'Billing', content: '<p>Billing settings panel content.</p>' },
            ]}
          />
          <h4 className="docs-preview-label">Enclosed</h4>
          <Tabs
            label="View mode"
            variant="enclosed"
            defaultTab="grid"
            items={[
              { value: 'grid', label: 'Grid', content: '<p>Grid view content.</p>' },
              { value: 'list', label: 'List', content: '<p>List view content.</p>' },
            ]}
          />
          <h4 className="docs-preview-label">Pill</h4>
          <Tabs
            label="Period"
            variant="pill"
            size="sm"
            defaultTab="monthly"
            items={[
              { value: 'monthly', label: 'Monthly', content: '<p>Monthly data.</p>' },
              { value: 'yearly', label: 'Yearly', content: '<p>Yearly data.</p>' },
            ]}
          />
        </div>
      );

    case 'accordion':
      return (
        <div style={flexCol}>
          <Accordion
            label="FAQ"
            mode="single"
            headingLevel="h3"
            defaultExpanded={['q1']}
            items={[
              { id: 'q1', trigger_label: 'What is Collet?', panel_content: '<p>Collet is a zero-hydration web UI component library written in Rust, compiled to WebAssembly, and delivered as Custom Elements.</p>' },
              { id: 'q2', trigger_label: 'How does it work?', panel_content: '<p>Components render as static HTML. WASM loads only when users interact. No JavaScript framework ships to the client.</p>' },
              { id: 'q3', trigger_label: 'Is it accessible?', panel_content: '<p>Yes — WCAG 2.2 AA compliance is enforced at compile time by the Rust type system.</p>' },
            ]}
          />
          <h4 className="docs-preview-label">Code</h4>
          <ComponentDocCodeBlock
            content={`<Accordion
  label="FAQ"
  mode="single"
  headingLevel="h3"
  defaultExpanded={['q1']}
  items={[
    { id: 'q1', trigger_label: 'What is Collet?',
      panel_content: '<p>A zero-hydration UI library.</p>' },
    { id: 'q2', trigger_label: 'How does it work?',
      panel_content: '<p>Static HTML + lazy WASM.</p>' },
  ]}
/>`}
            language="tsx"
          />
        </div>
      );

    case 'breadcrumb':
      return (
        <Breadcrumb
          navLabel="Navigation"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Widgets', href: '/products/widgets' },
            { label: 'Blue Widget', current: true },
          ]}
        />
      );

    case 'menu':
      return (
        <div style={flexRow}>
          <Menu
            triggerLabel="Actions"
            entries={[
              { type: 'item', id: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'Cmd+E' },
              { type: 'item', id: 'duplicate', label: 'Duplicate', icon: 'copy', shortcut: 'Cmd+D' },
              { type: 'separator' },
              { type: 'item', id: 'archive', label: 'Archive', icon: 'archive' },
              { type: 'item', id: 'delete', label: 'Delete', icon: 'trash', danger: true },
            ]}
          />
        </div>
      );

    case 'pagination':
      return (
        <Pagination label="Results" currentPage={3} pageSize={10} totalItems={97} />
      );

    case 'table':
      return <TablePreview />;

    case 'listbox':
      return (
        <Listbox
          label="Select a file"
          items={[
            { value: 'doc1', label: 'Document.pdf', icon: 'file-text' },
            { value: 'img1', label: 'Photo.png', icon: 'image' },
            { value: 'vid1', label: 'Video.mp4', icon: 'film' },
            { value: 'code1', label: 'index.tsx', icon: 'code' },
          ]}
        />
      );

    // ── Overlays ──

    case 'dialog':
      return <DialogPreview />;

    case 'drawer':
      return <DrawerPreview />;

    case 'popover':
      return (
        <div style={flexRow}>
          <Popover triggerLabel="Click me" placement="bottom">
            <div style={{ padding: 'var(--space-3)' }}>
              <p style={{ margin: 0 }}>Popover content with any elements.</p>
            </div>
          </Popover>
        </div>
      );

    case 'tooltip':
      return (
        <div style={flexRow}>
          <Tooltip content="Copy to clipboard" position="top">
            <Button iconOnly="copy" ariaLabel="Copy" variant="outline" />
          </Tooltip>
          <Tooltip content="Download file" position="bottom">
            <Button iconOnly="download" ariaLabel="Download" variant="outline" />
          </Tooltip>
          <Tooltip content="Share link" position="right">
            <Button iconOnly="share" ariaLabel="Share" variant="outline" />
          </Tooltip>
        </div>
      );

    // ── Feedback ──

    case 'alert':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Intents</h4>
          <Alert title="Info" description="This is an informational message." intent="info" variant="subtle" />
          <Alert title="Success" description="Your changes have been saved." intent="success" variant="subtle" />
          <Alert title="Warning" description="This action may have side effects." intent="warning" variant="subtle" />
          <Alert title="Danger" description="This action cannot be undone." intent="danger" variant="subtle" />
          <h4 className="docs-preview-label">Variants</h4>
          <Alert title="Subtle" description="Soft background tint." intent="info" variant="subtle" />
          <Alert title="Filled" description="Solid background." intent="info" variant="filled" />
          <Alert title="Outline" description="Border only." intent="info" variant="outline" />
          <h4 className="docs-preview-label">Dismissible</h4>
          <Alert title="Dismissible" description="Click the X to dismiss." intent="info" variant="subtle" dismissible />
        </div>
      );

    case 'toast':
      return (
        <div style={flexCol}>
          <Toast title="Saved" description="Your changes are live." variant="filled" intent="success" showIcon dismissible />
          <Toast title="Error" description="Something went wrong." variant="filled" intent="danger" showIcon dismissible />
        </div>
      );

    case 'progress':
      return <ProgressPreview />;

    case 'spinner':
      return (
        <div style={flexRow}>
          <Spinner label="Loading..." size="sm" />
          <Spinner label="Loading..." size="md" />
          <Spinner label="Loading..." size="lg" />
        </div>
      );

    case 'skeleton':
      return <SkeletonPreview />;

    // ── Layout ──

    case 'card':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Variants</h4>
          <div className="docs-preview-card-area" style={grid}>
            <Card variant="elevated" shape="soft"><p>Elevated</p></Card>
            <Card variant="outlined" shape="rounded"><p>Outlined</p></Card>
            <Card variant="filled" shape="rounded"><p>Filled</p></Card>
          </div>
          <h4 className="docs-preview-label">Shapes</h4>
          <div className="docs-preview-card-area" style={grid}>
            <Card variant="elevated" shape="sharp"><p>Sharp</p></Card>
            <Card variant="elevated" shape="rounded"><p>Rounded</p></Card>
            <Card variant="elevated" shape="soft"><p>Soft</p></Card>
          </div>
          <h4 className="docs-preview-label">With Header & Footer</h4>
          <div className="docs-preview-card-area">
            <Card
              variant="outlined"
              shape="rounded"
              header={<h3 style={{ margin: 0 }}>Card Title</h3>}
              footer={<Button label="Action" variant="ghost" size="sm" />}
            >
              <p>Body content goes here. The card has header, body, and footer slots.</p>
            </Card>
          </div>
          <h4 className="docs-preview-label">Clickable</h4>
          <div className="docs-preview-card-area">
            <Card variant="outlined" shape="rounded" clickable>
              <p>Hover me — I have interactive states.</p>
            </Card>
          </div>
        </div>
      );

    case 'sidebar':
      return (
        <div style={flexCol}>
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            Sidebar is a navigation component best demonstrated in a full layout. See the docs sidebar on the left.
          </p>
          <ComponentDocCodeBlock
            content={`<Sidebar
  label="Navigation"
  groups={[{
    label: 'Main',
    items: [
      { id: 'home', label: 'Home', icon: 'home', href: '/', active: true },
      { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
    ],
  }]}
/>`}
            language="tsx"
          />
        </div>
      );

    case 'collapsible':
      return (
        <div style={flexCol}>
          <Collapsible
            triggerHtml="<span>Click to show details</span>"
            label="Click to show details"
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <p>
                This content is hidden by default and revealed when you click the trigger.
                Collapsible uses smooth height animation.
              </p>
            </div>
          </Collapsible>
          <Collapsible
            triggerHtml="<span>This one starts open</span>"
            label="This one starts open"
            open
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <p>
                This one starts open. The trigger toggles visibility.
              </p>
            </div>
          </Collapsible>
        </div>
      );

    case 'avatar':
      return (
        <div style={flexRow}>
          <Avatar label="Alice" initials="AJ" size="sm" shape="circle" />
          <Avatar label="Bob" initials="BS" size="md" shape="circle" />
          <Avatar label="Charlie" initials="CB" size="lg" shape="circle" />
          <Avatar label="Diana" initials="DP" size="lg" shape="rounded" />
        </div>
      );

    case 'scrollbar':
      return (
        <div style={flexCol}>
          <Scrollbar
            height="h-48"
            size="md"
            track="with-track"
            axis="vertical"
            shape="rounded"
            label="Demo scroll area"
          >
            <div>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} style={{ padding: '0.5rem 0.75rem', lineHeight: '1.6', borderBottom: '1px solid var(--color-border)' }}>
                  Line {i + 1} — scrollable content with a custom track and thumb.
                </p>
              ))}
            </div>
          </Scrollbar>
          <h4 className="docs-preview-label">Code</h4>
          <ComponentDocCodeBlock
            content={`<Scrollbar
  height="h-48"
  track="with-track"
  axis="vertical"
  shape="rounded"
  label="Demo scroll area"
>
  <div>Your scrollable content here...</div>
</Scrollbar>`}
            language="tsx"
          />
        </div>
      );

    case 'text':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Roles — Headings & Display</h4>
          <div style={flexCol}>
            <Text textRole="display">Display — Instrument Serif</Text>
            <Text textRole="h1">Heading 1</Text>
            <Text textRole="h2">Heading 2</Text>
            <Text textRole="h3">Heading 3</Text>
          </div>
          <h4 className="docs-preview-label">Roles — Body & Labels</h4>
          <div style={flexCol}>
            <Text textRole="body-lg">Body Large — For lead paragraphs and introductions.</Text>
            <Text textRole="body-md">Body Medium — Default body text for most content.</Text>
            <Text textRole="body-sm">Body Small — Secondary descriptions and metadata.</Text>
            <Text textRole="label-lg">Label Large</Text>
            <Text textRole="label-md">Label Medium</Text>
            <Text textRole="label-sm">Label Small</Text>
          </div>
          <h4 className="docs-preview-label">Roles — Utility</h4>
          <div style={flexCol}>
            <Text textRole="overline">Overline — Section Labels</Text>
            <Text textRole="caption">Caption — Image descriptions, timestamps, footnotes.</Text>
            <Text textRole="code">const hello = "Code role — monospace";</Text>
          </div>
          <h4 className="docs-preview-label">Colors</h4>
          <div style={flexRow}>
            <Text textRole="body-md">Default</Text>
            <Text textRole="body-md" color="primary">Primary</Text>
            <Text textRole="body-md" color="muted">Muted</Text>
            <div style={{ background: 'var(--color-primary)', padding: '4px 12px', borderRadius: 'var(--radius-md)' }}>
              <Text textRole="body-md" color="inverse">Inverse</Text>
            </div>
          </div>
          <h4 className="docs-preview-label">Formatting</h4>
          <div style={flexCol}>
            <Text textRole="body-md" strong>Strong / bold text</Text>
            <Text textRole="body-md" italic>Italic text</Text>
            <Text textRole="body-md" underline>Underline text</Text>
            <Text textRole="body-md" underlineStrong>Strong underline text</Text>
          </div>
          <h4 className="docs-preview-label">Alignment</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
            <Text textRole="body-md" align="start">Start aligned</Text>
            <Text textRole="body-md" align="center">Center aligned</Text>
            <Text textRole="body-md" align="end">End aligned</Text>
          </div>
          <h4 className="docs-preview-label">Truncation & Line Clamping</h4>
          <div style={{ maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Text textRole="body-md" truncate>This text is truncated with ellipsis when it overflows its container on a single line.</Text>
            <Text textRole="body-md" lineClamp={2}>This text is clamped to two lines maximum. If the content exceeds that limit it will be cut off with an ellipsis at the end of the second line, keeping the layout clean and predictable.</Text>
          </div>
          <h4 className="docs-preview-label">Balance</h4>
          <div style={{ maxWidth: 400 }}>
            <Text textRole="h2" balance>Balanced heading wraps with even line lengths for better visual rhythm</Text>
          </div>
          <h4 className="docs-preview-label">Code</h4>
          <ComponentDocCodeBlock
            content={`<Text textRole="display">Hero Title</Text>
<Text textRole="h1">Page Heading</Text>
<Text textRole="body-lg" color="muted">Lead paragraph.</Text>
<Text textRole="body-md" strong>Bold body text.</Text>
<Text textRole="overline">Section Label</Text>
<Text textRole="caption" muted>Last updated 2 hours ago</Text>
<Text textRole="code">npm install @colletdev/react</Text>
<Text textRole="body-md" truncate>Long truncated text...</Text>
<Text textRole="body-md" lineClamp={3}>Clamped to 3 lines...</Text>`}
            language="tsx"
          />
        </div>
      );

    case 'carousel':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Editorial</h4>
          <Carousel
            label="Nature photography"
            variant="editorial"
            shape="rounded"
            loopMode
            slides={[
              { image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=450&fit=crop', title: 'Mountain Lake', subtitle: 'Yosemite Valley at dawn', badge: 'Featured', badge_color: 'oklch(0.7 0.15 160)' },
              { image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop', title: 'Golden Fields', subtitle: 'Sunlight through the meadow' },
              { image_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=450&fit=crop', title: 'Forest Path', subtitle: 'Redwood National Park' },
              { image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=450&fit=crop', title: 'Waterfall', subtitle: 'Hidden cascade in the woods', badge: 'New' },
            ]}
          />
          <h4 className="docs-preview-label">Card variant</h4>
          <Carousel
            label="Architecture"
            variant="card"
            shape="rounded"
            slides={[
              { image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop', title: 'Modern Glass', subtitle: 'Urban architecture' },
              { image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&h=400&fit=crop', title: 'City Skyline', subtitle: 'Downtown at dusk' },
              { image_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop', title: 'Concrete & Steel', subtitle: 'Brutalist design' },
            ]}
          />
          <h4 className="docs-preview-label">Code</h4>
          <ComponentDocCodeBlock
            content={`<Carousel
  label="Nature photography"
  variant="editorial"
  shape="rounded"
  loopMode
  slides={[
    { image_url: '...', title: 'Mountain Lake', subtitle: '...' },
    { image_url: '...', title: 'Golden Fields' },
  ]}
/>`}
            language="tsx"
          />
        </div>
      );

    // ── Form Inputs (additional) ──

    case 'chat-input':
      return (
        <div style={flexCol}>
          <ChatInput placeholder="Type a message..." shape="rounded" />
          <ChatInput placeholder="With submit button..." shape="pill" showActionButton submitLabel="Send" />
        </div>
      );

    case 'date-picker':
      return (
        <div style={flexCol}>
          <DatePicker label="Start date" variant="outline" placeholder="Select a date" />
          <DatePicker label="End date" variant="filled" placeholder="Select a date" firstDay="monday" />
        </div>
      );

    case 'search-bar':
      return (
        <div style={flexCol}>
          <SearchBar label="Search" placeholder="Search documentation..." variant="outline" shape="rounded" />
          <SearchBar label="Search" placeholder="Quick search..." variant="outline" shape="pill" shortcut="Cmd+K" />
        </div>
      );

    case 'file-upload':
      return (
        <div style={flexCol}>
          <FileUpload
            label="Upload files"
            variant="outline"
            shape="rounded"
            heading="Drag and drop files here"
            browseText="Browse"
            hint="PNG, JPG, PDF up to 10MB"
            accept="image/*,.pdf"
            multiple
          />
        </div>
      );

    // ── Navigation (additional) ──

    case 'stepper':
      return (
        <div style={flexCol}>
          <Stepper
            label="Setup progress"
            current={1}
            variant="outline"
            steps={[
              { id: 'account', label: 'Account', description: 'Create your account' },
              { id: 'profile', label: 'Profile', description: 'Set up your profile' },
              { id: 'complete', label: 'Complete', description: 'Ready to go' },
            ]}
          />
        </div>
      );

    case 'profile-menu':
      return (
        <div style={flexRow}>
          <ProfileMenu
            label="User menu"
            initials="DJ"
            shape="circle"
            entries={[
              { type: 'item', id: 'profile', label: 'Profile', icon: 'user' },
              { type: 'item', id: 'settings', label: 'Settings', icon: 'settings' },
              { type: 'separator' },
              { type: 'item', id: 'logout', label: 'Log out', icon: 'log-out', danger: true },
            ]}
          />
        </div>
      );

    // ── Overlays (additional) ──

    case 'backdrop':
      return (
        <div style={flexCol}>
          <BackdropPreview />
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            Backdrop is used internally by Dialog and Drawer. It can also be used standalone:
          </p>
          <ComponentDocCodeBlock
            content={`<Backdrop tint="rgba(0, 0, 0, 0.5)" blur="4px" dismissible />`}
            language="tsx"
          />
        </div>
      );

    // ── Feedback (additional) ──

    case 'thinking':
      return (
        <div style={flexCol}>
          <div style={flexRow}>
            <Thinking label="Thinking..." variant="ghost" shape="rounded" size="sm" />
            <Thinking label="Thinking..." variant="ghost" shape="pill" size="md" />
          </div>
          <div style={flexRow}>
            <Thinking label="Processing..." variant="filled" shape="rounded" size="sm" />
          </div>
        </div>
      );

    // ── Data Display ──

    case 'code-block':
      return (
        <div style={flexCol}>
          <h4 className="docs-preview-label">Standard</h4>
          <CodeBlock
            filename="Button.tsx"
            language="tsx"
            content={`import { Button } from '@colletdev/react';

<Button label="Save" variant="filled" intent="primary" />`}
            copyButton
            trafficLights
          />
          <h4 className="docs-preview-label">Minimal</h4>
          <CodeBlock
            variant="minimal"
            language="bash"
            content={`npm install @colletdev/core @colletdev/react
npx @colletdev/docs init`}
            lineNumbers
            copyButton
          />
        </div>
      );

    case 'activity-group':
      return (
        <div style={flexCol}>
          <div style={flexCol}>
            <ActivityGroup
              status="completed"
              summary="3 files uploaded"
              action="View details"
              expanded={false}
              border="var(--color-border)"
            />
            <ActivityGroup
              status="running"
              summary="Deploying preview environment"
              action="Open logs"
              expanded
              border="var(--color-border)"
            />
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            ActivityGroup renders a grouped activity feed with expandable entries:
          </p>
          <ComponentDocCodeBlock
            content={`<ActivityGroup
  status="completed"
  summary="3 files uploaded"
  expanded={false}
/>`}
            language="tsx"
          />
        </div>
      );

    case 'message-bubble':
      return (
        <div style={flexCol}>
          <MessageBubble role="user" variant="filled" shape="rounded" timestamp="2:34 PM">
            <p style={{ margin: 0 }}>How do I install Collet?</p>
          </MessageBubble>
          <MessageBubble
            role="assistant"
            variant="ghost"
            shape="rounded"
            senderName="Assistant"
            timestamp="2:34 PM"
          >
            <p style={{ margin: 0 }}>Run npm install @colletdev/core @colletdev/react</p>
          </MessageBubble>
          <ComponentDocCodeBlock
            content={`<MessageBubble role="user" variant="filled" shape="rounded">
  <p>How do I install Collet?</p>
</MessageBubble>

<MessageBubble role="assistant" variant="ghost" shape="rounded"
  senderName="Assistant" timestamp="2:34 PM">
  <p>Run npm install @colletdev/core @colletdev/react</p>
</MessageBubble>`}
            language="tsx"
          />
        </div>
      );

    case 'message-group': {
      const parts: MessageGroupPart[] = [
        { kind: 'text', content: 'Here is the solution:' },
        { kind: 'code-block', language: 'tsx', content: '<Button label="Hello" />' },
        { kind: 'thinking', thinking_label: 'Checking the generated types...' },
      ];
      return (
        <div style={flexCol}>
          <MessageGroup
            role="assistant"
            senderName="Assistant"
            parts={parts}
          />
          <ComponentDocCodeBlock
            content={MESSAGE_GROUP_EXAMPLE}
            language="tsx"
          />
        </div>
      );
    }

    case 'message-part':
      return (
        <div style={flexCol}>
          <MessagePartPreview />
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            MessagePart now supports both declarative typed content and token streaming:
          </p>
          <ComponentDocCodeBlock
            content={`${MESSAGE_PART_EXAMPLE}

${MESSAGE_PART_STREAM_EXAMPLE}`}
            language="tsx"
          />
        </div>
      );

    default:
      return (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Live preview coming soon.
        </p>
      );
  }
}
