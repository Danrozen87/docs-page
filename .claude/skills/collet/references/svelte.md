# Collet Svelte Reference

Svelte 5 wrappers for the Collet component library. Auto-generated from
`custom-elements.json` via `scripts/generate-svelte.mjs`.

---

## Package

```
@colletdev/svelte
```

**Peer dependencies:** `svelte >= 5.0.0`, `@colletdev/core >= 0.1.0`

Ships raw `.svelte` source files — consumers compile with their own Svelte toolchain.

## Architecture

Svelte wrappers use Svelte 5 runes (`$props`, `$effect`) for reactive prop
syncing and event bridging. They handle:

- **Attribute serialization** — objects/arrays synced via `$effect` + `setAttribute`
- **Event bridging** — callback props (`onClick`, `onChange`) wired via `$effect` listeners
- **Slot projection** — `{@render children?.()}` for default, `{@render footer?.()}` for named
- **Imperative methods** — `export function open()` exposed to consumers

### Package Structure

```
packages/svelte/
  src/                    ← Auto-generated wrappers (DO NOT EDIT)
    button.svelte
    button.svelte.d.ts
    dialog.svelte
    dialog.svelte.d.ts
    ...
    index.ts              ← Barrel exports + type re-exports
    types.ts              ← Shared TypeScript interfaces
    elements.d.ts         ← SvelteHTMLElements augmentation
```

---

## Patterns

### Basic Usage

```svelte
<script lang="ts">
  import Button from '@colletdev/svelte/button.svelte';
  import Dialog from '@colletdev/svelte/dialog.svelte';

  let dialog: { open: () => void; close: () => void };
</script>

<Button label="Open" onClick={() => dialog.open()} />
<Dialog
  bind:this={dialog}
  title="Confirm"
  onClose={(e) => console.log(e.detail.reason)}
>
  <p>Are you sure?</p>
  {#snippet footer()}
    <Button label="OK" variant="filled" />
  {/snippet}
</Dialog>
```

### Event Callbacks

Svelte 5 uses callback props instead of `on:event` directives:

```svelte
<TextInput
  label="Email"
  onInput={(e) => value = e.detail.value}
  onChange={(e) => validate(e.detail.value)}
  onFocus={(e) => focused = true}
  onKeydown={(e) => {
    if (e.detail.key === 'Enter') submit();
  }}
/>
```

Callback props are typed: `(event: CustomEvent<InputDetail>) => void`.

### Imperative Methods

Components expose methods via `export function`. Access through `bind:this`:

```svelte
<script lang="ts">
  import Select from '@colletdev/svelte/select.svelte';

  let select: { open: () => void; close: () => void; focus: () => void };
</script>

<Select bind:this={select} label="Country" items={countries} />
<button onclick={() => select.open()}>Open dropdown</button>
```

### Named Slots (Snippets)

Svelte 5 uses `{#snippet}` for named slots:

```svelte
<Card>
  {#snippet header()}
    <h3>Title</h3>
  {/snippet}

  <p>Body content (default slot via children)</p>

  {#snippet footer()}
    <Button label="Action" />
  {/snippet}
</Card>
```

The wrapper renders snippets inside `<div slot="name">` wrappers for
Shadow DOM slot projection.

### Complex Props (Structured Data)

Props accepting arrays/objects are synced via `$effect` + `setAttribute(JSON.stringify())`:

```svelte
<Table
  caption="Users"
  columns={[
    { id: 'name', header: 'Name', sortable: true },
    { id: 'email', header: 'Email' },
  ]}
  rows={rows}
  sorts={[{ column_id: 'name', direction: 'asc' }]}
  onSort={(e) => handleSort(e.detail)}
/>
```

### Form Integration

```svelte
<form onsubmit={handleSubmit}>
  <TextInput name="email" label="Email" required />
  <Select name="country" label="Country" items={countries} />
  <Button label="Submit" kind="submit" />
</form>
```

### DOM Collision Handling

Attributes like `title`, `width`, `loading` are routed through `$effect` +
`setAttribute` to avoid Svelte setting them as DOM properties:

```svelte
<!-- Works correctly -->
<Dialog title="My Dialog" />
<Table loading={75} />
```

---

## TypeScript

### Type Imports

```ts
import type {
  TableColumn, TableRow, SelectOption, MenuEntry,
  InputDetail, ClickDetail, CloseDetail,
} from '@colletdev/svelte';
```

### Component Types

Each `.svelte` file has a `.svelte.d.ts` companion with full prop types:

```ts
import type { Component } from 'svelte';

interface ButtonProps {
  label?: string;
  variant?: 'filled' | 'ghost' | 'outline' | 'underline' | 'side-indicator';
  // ... all props typed
  onClick?: (event: CustomEvent<ClickDetail>) => void;
}

declare const Button: Component<ButtonProps, { /* exports */ }>;
```

### SvelteHTMLElements Augmentation

`@colletdev/svelte` augments `SvelteHTMLElements` for direct Custom Element usage:

```svelte
<!-- Type-checked cx-* elements -->
<cx-button label="Raw CE" variant="filled" />
```

Import the augmentation in `app.d.ts`:

```ts
/// <reference types="@colletdev/svelte/elements" />
```

---

## Svelte 5 Migration Notes

The wrappers are Svelte 5 native. Key differences from Svelte 4:

| Svelte 4 | Svelte 5 (Collet) |
|----------|-------------------|
| `export let prop` | `let { prop } = $props()` |
| `on:click` | `onclick` callback prop |
| `<slot />` | `{@render children?.()}` |
| `<slot name="x" />` | `{@render x?.()}` |
| `onMount(() => {})` | `$effect(() => { ... })` |
| `$: derived` | `let derived = $derived(...)` |
| `SvelteComponent` | `Component` type |
| `createEventDispatcher` | Callback props |

---

## Codegen

Svelte wrappers are generated by `scripts/generate-svelte.mjs`. Configuration
lives in `scripts/component-config.mjs` (shared across all framework generators).

**Do not edit** files in `packages/svelte/src/` — they are overwritten by
`bash scripts/build-packages.sh`.

Raw source ships to consumers (no pre-compilation needed).
