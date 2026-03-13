# Collet React Reference

React wrappers for the Collet component library. Auto-generated from
`custom-elements.json` via `scripts/generate-react.mjs`.

---

## Package

```
@colletdev/react
```

**Peer dependencies:** `react >= 18.0.0`, `@colletdev/core >= 0.1.0`

## Architecture

React wrappers are thin `forwardRef` components that render the underlying
`<cx-*>` Custom Element. They handle:

- **Attribute serialization** — objects/arrays go through `JSON.stringify`
- **Event bridging** — `on{Event}` props attach listeners for `cx-{event}` CustomEvents
- **Slot projection** — named slots via `<div slot="name" style={{display:'contents'}}>`
- **Typed imperative refs** — `useImperativeHandle` exposes typed methods

### Package Structure

```
packages/react/
  generated/          ← Auto-generated wrappers (DO NOT EDIT)
    button.tsx
    dialog.tsx
    ...
    index.ts          ← Barrel exports
    types.ts          ← Shared TypeScript interfaces
    elements.d.ts     ← JSX IntrinsicElements augmentation
  dist/               ← Compiled output (JS + .d.ts)
```

---

## Patterns

### Basic Usage

```tsx
import { Button, Dialog, type DialogRef } from '@colletdev/react';

function App() {
  const dialogRef = useRef<DialogRef>(null);

  return (
    <>
      <Button label="Open" onClick={() => dialogRef.current?.open()} />
      <Dialog
        ref={dialogRef}
        title="Confirm"
        onClose={(e) => console.log(e.detail.reason)}
        footer={<Button label="OK" variant="filled" />}
      >
        <p>Are you sure?</p>
      </Dialog>
    </>
  );
}
```

### Event Callbacks

All events use `on{PascalEvent}` naming. The callback receives a `CustomEvent<Detail>`:

```tsx
<TextInput
  label="Email"
  onInput={(e) => setValue(e.detail.value)}    // InputDetail
  onChange={(e) => validate(e.detail.value)}    // InputDetail
  onFocus={(e) => setFocused(true)}            // FocusDetail
  onKeydown={(e) => {                          // KeyboardDetail
    if (e.detail.key === 'Enter') submit();
  }}
/>
```

### Overlays (Dialog, Drawer)

Overlays support both declarative and imperative control. **Always keep them
mounted** — never conditionally render with `{show && <Dialog>}`. This matches
MUI, Radix, Ant Design, and every major React UI library.

**Declarative (recommended):**

```tsx
const [open, setOpen] = useState(false);

<Button label="Open" onClick={() => setOpen(true)} />
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm"
  footer={<Button label="OK" variant="filled" onClick={() => setOpen(false)} />}
>
  <p>Are you sure?</p>
</Dialog>
```

**Imperative (ref-based):**

```tsx
const ref = useRef<DialogRef>(null);

<Button label="Open" onClick={() => ref.current?.open()} />
<Dialog ref={ref} title="Confirm" onClose={() => console.log('closed')}>
  <p>Are you sure?</p>
</Dialog>
```

Both patterns work for Dialog and Drawer. The component owns its animation
lifecycle — open/close transitions play fully without being interrupted by
React state changes.

**Do NOT conditionally render overlays:**

```tsx
// WRONG — unmounting kills exit animation, breaks accessibility
{isOpen && <Drawer open title="Settings">...</Drawer>}

// CORRECT — always mounted, visibility controlled by open prop
<Drawer open={isOpen} onClose={() => setIsOpen(false)} title="Settings">...</Drawer>
```

### Imperative Refs

Components with `open/close/focus` methods expose typed refs:

```tsx
import { Select, type SelectRef } from '@colletdev/react';

const ref = useRef<SelectRef>(null);
ref.current?.open();   // Opens dropdown
ref.current?.close();  // Closes dropdown
ref.current?.focus();  // Focuses trigger
```

### Named Slots

Named slots use React props that accept `ReactNode`:

```tsx
<Card
  header={<h3>Title</h3>}
  footer={<Button label="Action" />}
>
  <p>Body content (default slot)</p>
</Card>
```

Under the hood, these render as `<div slot="name" style={{display:'contents'}}>`.

### Complex Props (Structured Data)

Props that accept arrays/objects are serialized to JSON attributes via `useEffect`:

```tsx
<Table
  caption="Users"
  columns={[
    { id: 'name', header: 'Name', sortable: true },
    { id: 'email', header: 'Email' },
  ]}
  rows={[
    { id: '1', cells: { name: 'Alice', email: 'alice@example.com' } },
  ]}
  sorts={[{ column_id: 'name', direction: 'asc' }]}
  onSort={(e) => handleSort(e.detail)}
/>
```

### Form Integration

Form-associated components work with uncontrolled forms via `name` prop:

```tsx
<form onSubmit={handleSubmit}>
  <TextInput name="email" label="Email" required />
  <Select name="country" label="Country" items={countries} />
  <Button label="Submit" kind="submit" />
</form>
```

For controlled forms, use event callbacks:

```tsx
const [value, setValue] = useState('');
<TextInput
  label="Name"
  value={value}
  onInput={(e) => setValue(e.detail.value)}
/>
```

### DOM Collision Handling

React 19 sets DOM properties directly on Custom Elements. The wrappers
automatically route these through `useEffect` + `setAttribute`:

- **HTML properties** (`title`, `width`, `loading`, `role`) — bypasses HTMLElement property setters
- **Form properties** (`name`, `value`, `type`) — on form components (TextInput, Select, Slider, etc.)
- **Numeric attributes** (`lines`, `min`, `max`, `step`, `duration`, `currentPage`, etc.) — ensures `attributeChangedCallback` fires for `_numericAttrs` coercion
- **Complex data** (`columns`, `rows`, `items`, etc.) — JSON-serialized objects/arrays

```tsx
// All of these work correctly — routed through setAttribute automatically
<Dialog title="My Dialog" />
<Slider min={0} max={100} step={5} value={50} />
<Skeleton variant="text" lines={3} />
<Pagination currentPage={1} pageSize={10} totalItems={100} />
```

No special handling needed from consumers.

### Markdown Support

```tsx
import { useMarkdown } from '@colletdev/react';
import { MessagePart, type MessagePartRef } from '@colletdev/react';

// Static markdown
const html = useMarkdown('**Hello** world');

// Streaming markdown (AI chat)
const { ref, startStream, appendTokens, endStream } = useMarkdownStream();
<MessagePart ref={ref} stream />
```

### Server Rendering

```tsx
// Next.js App Router — Server Component
import { createRenderer } from '@colletdev/core/server';

export default async function Page() {
  const cx = await createRenderer();
  const buttonHtml = cx.renderDSD('button', { label: 'Click', id: 'btn-1' });
  return <div dangerouslySetInnerHTML={{ __html: buttonHtml }} />;
}
```

---

## TypeScript

All props, events, and ref types are fully typed. Import types from `@colletdev/react`:

```tsx
import type {
  // Structured data props
  TableColumn, TableRow, SelectOption, MenuEntry,
  // Event details
  InputDetail, ClickDetail, CloseDetail,
  // Ref types (from component exports)
  DialogRef, SelectRef, TextInputRef,
} from '@colletdev/react';
```

### JSX IntrinsicElements

`@colletdev/react` augments `JSX.IntrinsicElements` with all `cx-*` elements
for direct Custom Element usage when wrappers aren't needed:

```tsx
// Works with full type checking
<cx-button label="Raw CE" variant="filled" />
```

---

## Codegen

React wrappers are generated by `scripts/generate-react.mjs`. Configuration
lives in both the React generator (inline maps) and `scripts/component-config.mjs`
(shared across all framework generators).

**Do not edit** files in `packages/react/generated/` — they are overwritten
by `bash scripts/build-packages.sh`.

Custom files (preserved by codegen):
- `generated/message-part.tsx` — streaming markdown support
- `generated/use-markdown.ts` — `useMarkdown()` hook
- `generated/use-markdown-stream.ts` — `useMarkdownStream()` hook
- `generated/drawer.tsx` — custom drawer implementation
