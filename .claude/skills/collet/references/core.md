# Collet Core — Framework-Agnostic Reference

Shared architecture, initialization, theming, CSS, SSR, and conventions
that apply to all Collet framework wrappers and vanilla Custom Element usage.

---

## Architecture

Framework wrappers (`@colletdev/react`, `@colletdev/vue`, `@colletdev/svelte`,
`@colletdev/angular`) are thin adapters that render the underlying `<cx-*>`
Custom Element. They handle:

- **Attribute serialization** -- objects/arrays go through `JSON.stringify`
- **Event bridging** -- framework event props attach listeners for `cx-{event}` CustomEvents
- **Slot projection** -- named slots via `<div slot="name">` (display strategy varies by framework)
- **Typed imperative handles** -- expose typed methods like `.open()`, `.close()`, `.focus()`

### Package structure

```
packages/
  core/                     <- Custom Elements, runtime, WASM, CSS
    src/
      elements/             <- Per-component Custom Element definitions
      runtime.js            <- Shadow DOM, adopted stylesheets, __cx namespace
      styles.js             <- Inlined CSS strings (tokens + utilities)
      index.js              <- init(), element registration
      server.js             <- createRenderer() for SSR/DSD
      markdown.js           <- renderMarkdown(), renderMarkdownSync()
    dist/
      tokens.css            <- Document-level CSS vars, themes, fonts
      tokens-shadow.css     <- Shadow DOM adopted stylesheet (keyframes, motion)
      cx-utilities.css      <- Tailwind utility classes for shadow DOM
      syntax.css            <- Code viewer syntax highlighting theme
  react/
    generated/              <- Auto-generated React wrappers (DO NOT EDIT)
    index.ts                <- Re-exports all components + hooks
  vue/
    src/                    <- Auto-generated Vue 3.3+ wrappers (Composition API)
    dist/                   <- Compiled .js + .d.ts files
  svelte/
    src/                    <- Auto-generated Svelte 5 runes-first wrappers
  angular/
    src/                    <- Auto-generated Angular 16+ standalone components
```

### Regeneration

```bash
bash scripts/build-packages.sh
```

This runs: `gen_tokens` + `gen_shadow_tokens` -> `wasm-pack` -> Tailwind extract -> `inline-css.mjs` -> `generate-elements.mjs` -> `generate-react.mjs` -> `generate-vue.mjs` -> `generate-svelte.mjs` -> `generate-angular.mjs` -> `generate-skill-docs.mjs`

---

## CSS Architecture (Build-Time Split)

The build produces **two** token CSS files instead of one:

| File | Scope | Contents |
|------|-------|----------|
| `tokens.css` | Document `<head>` | CSS vars, fonts, themes, floating rules, view transitions |
| `tokens-shadow.css` | Shadow DOM adopted stylesheet | Keyframes, component motion, slider/scrollbar/texture/prose |

`init()` injects `tokens.css` into `<head>` (CSS variables inherit into Shadow DOM).
The shadow subset is adopted directly -- no runtime CSS parsing.

```
Document <head>
  tokens.css          <- CSS vars (--color-*, --spacing-*, --duration-*, etc.)
                         Fonts, themes, floating panel rules, view transitions

Shadow DOM (per component)
  cx-utilities.css    <- Tailwind utility classes (adopted stylesheet)
  tokens-shadow.css   <- Keyframes + component motion (adopted stylesheet)
  Component HTML      <- Semantic HTML with Tailwind classes
```

**Previous approach (removed):** `stripTokensForShadowDom()` was a runtime
regex/brace-balanced parser that tried to filter a single monolithic CSS blob.
It broke across three patch versions. The build-time split eliminates this
entire class of regressions.

---

## Initialization & Tree-Shaking

The `init()` function from `@colletdev/core` registers Custom Elements and loads
behavior JS. It supports selective component registration so bundlers (Vite,
Webpack, Rollup) can tree-shake unused behavior modules via dynamic `import()`.

### Usage

```js
import { init } from '@colletdev/core';

// Zero-config -- all 49 components (recommended for prototyping)
await init();

// Selective -- only 3 components downloaded (recommended for production)
await init({ components: ['button', 'text-input', 'select'] });

// Lazy -- WASM loads in background, no first-paint blocking
await init({ lazy: true });

// Lazy + selective -- fastest possible first paint
await init({ lazy: true, components: ['button', 'card'] });
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `components` | `string[]` | all | Component names to register. Only these components' behavior JS files are downloaded. |
| `lazy` | `boolean` | `false` | When `true`, WASM loads in the background after first paint instead of blocking. |

### How it works

**Lazy by design:** The heavy assets (WASM binary ~893 KB, CSS strings ~173 KB,
WASM glue ~21 KB) are NOT loaded at module level. They're fetched via dynamic
`import()` inside `init()`, which means `import { init } from '@colletdev/core'`
costs only ~48 KB. Bundlers (Vite, Webpack, Rollup) automatically code-split
the WASM and CSS into separate async chunks.

Each component's behavior JS (`static/_behaviors/*.js`) is also loaded via
dynamic `import()`. When `components` is provided, only the listed components'
chunks are fetched -- the rest never leave the server.

### Bundle impact

| Asset | Raw | Gzip | Brotli | When loaded |
|-------|-----|------|--------|-------------|
| Entry point (index.js + runtime.js) | 48 KB | ~10 KB | ~8 KB | `import { init }` |
| CSS strings (styles.js) | 173 KB | 33 KB | ~28 KB | `init()` call |
| WASM glue (wasm_api.js) | 21 KB | ~5 KB | ~4 KB | `init()` call |
| WASM binary (wasm_api_bg.wasm) | 893 KB | 318 KB | 232 KB | `init()` call |
| Per-component behavior JS | 1-20 KB each | varies | varies | Component registration |

**Total first-paint cost with brotli:** ~8 KB (just the import).
**Total after init():** ~272 KB brotli (all assets loaded).
**WASM is cached:** After first visit, the browser serves it from disk cache.

**Recommendation:** Use `components` in production builds. Use bare `init()`
during prototyping when the component set is still changing.

---

## Custom Theming with Collet Tokens

Collet components use CSS custom properties for all visual values. Override them
with a custom `tokens.css` generated by [Collet Tokens](https://github.com/Danrozen87/collet-tokens):

```bash
# Install the token compiler
cargo install collet-tokens-cli

# Create a token file with your brand
collet-tokens init
# Edit tokens.yaml with your colors, fonts, spacing

# Generate CSS
collet-tokens build --input tokens.yaml --outdir public/
```

Then load your `tokens.css` after Collet's default:

```html
<!-- Your custom tokens override Collet defaults via CSS cascade -->
<link rel="stylesheet" href="/@colletdev/tokens.css">       <!-- Collet defaults -->
<link rel="stylesheet" href="/public/tokens.css">         <!-- Your brand overrides -->
```

Or in JS:

```js
import '@colletdev/core/dist/tokens.css';       // Collet defaults
import './public/tokens.css';                 // Your brand overrides
```

Every Collet component instantly reflects your brand. No code changes needed.

**White-labeling:** Load different `tokens.css` per tenant for multi-brand apps.
See [Theme Registry docs](https://github.com/Danrozen87/collet-tokens/blob/main/docs/theme-registry.md).

---

## Server Rendering & Declarative Shadow DOM

Collet can pre-render components to HTML at build time or on the server.
The browser paints them **instantly** -- no JavaScript needed for first render.
When the Custom Element class registers, the element "upgrades" and becomes
interactive. No hydration step. This is resumability via native browser APIs.

### Server Renderer (Node.js)

```js
import { createRenderer } from '@colletdev/core/server';

const cx = await createRenderer();

// Full DSD element -- browser renders this without JS
const html = cx.renderDSD('button', {
  label: 'Click me',
  variant: 'filled',
  id: 'btn-1',
});
// -> '<cx-button variant="filled" ...>
//      <template shadowrootmode="open">
//        <link rel="stylesheet" href="/@colletdev/cx-utilities.css">
//        <link rel="stylesheet" href="/@colletdev/tokens-shadow.css">
//        <button class="inline-flex items-center ...">Click me</button>
//      </template>
//    </cx-button>'

// Just the inner HTML (for custom injection)
const inner = cx.renderToString('button', { label: 'Click', id: 'btn-2' });
// -> { html: '<button class="...">Click</button>', sprites: '', a11y: {...} }

// Just the <template> fragment (for existing host elements)
const frag = cx.renderDSDFragment('badge', { label: 'New', id: 'b-1' });
// -> '<template shadowrootmode="open">...</template>'
```

### Renderer Options

```js
const cx = await createRenderer({
  stylesUrl: '/assets/cx-utilities.css',   // URL for CSS <link> in DSD templates
  motionUrl: '/assets/tokens-shadow.css',  // URL for motion CSS <link>
  inlineStyles: true,                      // Inline CSS instead of <link> (SSG)
});
```

### Vite Setup

The Vite plugin handles WASM MIME types, binary copying, preload hints, and
dependency pre-bundling automatically:

```js
import { colletPlugin } from '@colletdev/core/vite-plugin';

export default defineConfig({
  plugins: [colletPlugin({
    prerender: true,  // Pre-render <cx-*> in index.html (optional)
    preload: true,    // Inject WASM preload hint (default)
  })],
});
```

The plugin automatically:
- Copies `wasm_api_bg.wasm` to `public/` during dev
- Serves `.wasm` files with correct MIME type (`application/wasm`)
- Emits the WASM binary in production builds
- Configures `optimizeDeps` to pre-bundle `@colletdev/core` (prevents full-page reloads during dev)
- Excludes the WASM glue module from pre-bundling (must stay as native ESM)

**Without the plugin**, manually configure:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['@colletdev/core'],
    exclude: ['@colletdev/core/wasm/wasm_api.js'],
  },
});
```

**For large apps**, pass an explicit component list to `init()` for faster startup
(avoids O(n) DOM scan):

```js
await init({ components: ['button', 'dialog', 'text-input', 'select'] });
```

### Framework SSR Integration

| Framework | Approach |
|-----------|----------|
| **Next.js (App Router)** | Use `createRenderer()` in a Server Component or API route |
| **Nuxt** | Use `createRenderer()` in a server plugin or composable |
| **SvelteKit** | Use `createRenderer()` in a server `load` function |
| **Angular Universal** | Use `createRenderer()` in a transfer state resolver |
| **Remix** | Use `createRenderer()` in the loader, inject DSD in the template |
| **Astro** | Use `createRenderer()` in `.astro` components (SSG or SSR) |
| **Plain HTML** | Use `colletPlugin({ prerender: true })` in Vite |
| **SPA (no SSR)** | Use `init({ lazy: true })` -- DSD not applicable |

### How DSD Upgrade Works

1. Server/build produces `<cx-button><template shadowrootmode="open">...</template></cx-button>`
2. Browser creates the shadow root immediately from the DSD template (spec behavior)
3. Component is **visible and styled** -- zero JavaScript needed
4. When `init()` runs, `customElements.define()` triggers element upgrade
5. The existing shadow root is reused (not recreated) -- `this.shadowRoot` already exists
6. Event handlers attach, adopted stylesheets replace `<link>` tags -- zero visual flash

---

## Event Convention

All Collet components emit events with the `cx-` prefix as `CustomEvent` instances.

### Naming

```
cx-{action}
```

Examples: `cx-close`, `cx-navigate`, `cx-action`, `cx-input`, `cx-change`,
`cx-sort`, `cx-select`, `cx-page`, `cx-expand`, `cx-dismiss`, `cx-stream-end`

### Listening (Vanilla JS)

```js
const el = document.querySelector('cx-dialog');

el.addEventListener('cx-close', (e) => {
  console.log('Dialog closed', e.detail);
});
```

### Detail Types

Every event carries a typed `detail` payload:

| Event | Detail Type | Fields |
|-------|-------------|--------|
| `cx-close` | `CloseDetail` | `{}` |
| `cx-navigate` | `NavigateDetail` | `{ label, href }` |
| `cx-action` | `MenuActionDetail` | `{ id, label }` |
| `cx-input` | `InputDetail` | `{ value }` |
| `cx-change` | varies | Component-specific |
| `cx-sort` | `SortDetail` | `{ column, direction }` |
| `cx-select` | `SelectDetail` | `{ value, label }` |
| `cx-page` | `PageDetail` | `{ page }` |
| `cx-expand` | `TableExpandDetail` | `{ rowId, expanded }` |
| `cx-dismiss` | `DismissDetail` | `{}` |
| `cx-focus` | `FocusDetail` | `{}` |
| `cx-blur` | `FocusDetail` | `{}` |
| `cx-keydown` | `KeyboardDetail` | `{ key, code, ... }` |
| `cx-click` | `ClickDetail` | `{}` |
| `cx-stream-end` | `{}` | Streaming complete |

### Framework wrapper mapping

Framework wrappers map these to idiomatic event props:

- **React:** `onClose`, `onNavigate`, `onAction`, `onInput`, `onChange`, etc.
- **Vue:** `@close`, `@navigate`, `@action`, `@input`, `@change`, etc.
- **Svelte:** `onclose`, `onnavigate`, `onaction`, `oninput`, `onchange`, etc.
- **Angular:** `(cxClose)`, `(cxNavigate)`, `(cxAction)`, `(cxInput)`, `(cxChange)`, etc.

---

## Slot Convention

Collet uses the web standard `<slot>` mechanism via Shadow DOM.

### Default slot

The default slot receives children:

```html
<cx-card>
  <p>This goes into the default slot</p>
</cx-card>
```

### Named slots

Named slots target specific content areas:

```html
<cx-card>
  <div slot="header"><h3>Card Title</h3></div>
  <p>Default slot content</p>
  <div slot="footer"><button>Save</button></div>
</cx-card>

<cx-dialog title="Confirm">
  <p>Are you sure?</p>
  <div slot="footer"><button>OK</button></div>
</cx-dialog>
```

### Common named slots

| Slot | Used by | Purpose |
|------|---------|---------|
| `header` | Card, Dialog, Drawer, Sidebar | Top section content |
| `footer` | Card, Dialog, Drawer, Sidebar | Bottom section content |
| `actions` | Alert | Action buttons area |
| `trigger` | Tooltip, Popover | Element that triggers the floating panel |

### Framework wrapper slot projection

Each framework wrapper maps slot children to the correct `slot` attribute:

- **Vanilla JS / @colletdev/core:** Use `slot="name"` attribute directly
- **React:** Pass as named props (e.g., `header={<h3>Title</h3>}`), wrapper adds `<div slot="name" style={{display:'contents'}}>`
- **Vue:** Use `<template v-slot:header>` or `<template #header>`
- **Svelte:** Use `{#snippet header()}` (Svelte 5) or `<div slot="header">`
- **Angular:** Use `<ng-container slot="header">` or `ngProjectAs`

---

## Form Integration

Form-associated Collet components (`TextInput`, `Select`, `Checkbox`, `Switch`,
`RadioGroup`, `DatePicker`, `Slider`) participate in native `<form>` submission
through the `ElementInternals` API.

### How it works

```html
<form id="signup">
  <cx-text-input name="email" label="Email" required></cx-text-input>
  <cx-select name="role" label="Role" items='[...]'></cx-select>
  <cx-checkbox name="terms" label="Accept terms" required></cx-checkbox>
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('signup').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(data.get('email'), data.get('role'), data.get('terms'));
  });
</script>
```

Each form component:
- Implements `static formAssociated = true`
- Uses `ElementInternals.setFormValue()` to sync the current value
- Participates in `formdata`, `reset`, and `submit` events
- Reports validity via `ElementInternals.setValidity()`

---

## DOM Collision Handling

Some HTML attributes (`title`, `width`, `loading`, `name`, `value`) collide
with Custom Element attribute names. Collet handles this by routing colliding
attributes through explicit DOM operations rather than relying on the
framework's default attribute/property sync.

### Affected attributes

| Attribute | Components | Issue |
|-----------|-----------|-------|
| `title` | Dialog, Drawer, Card | Browser shows native tooltip |
| `name` | TextInput, Select, RadioGroup | React 19 property-first sets wrong target |
| `value` | TextInput, ChatInput, Slider | React 19 property-first sets wrong target |
| `loading` | Table | Conflicts with native `loading` attribute |

### How collisions are resolved

Framework wrappers use effect-based routing: the colliding prop is applied via
`setAttribute()` in a post-render effect rather than as a JSX attribute. This
ensures the value reaches the Custom Element's `attributeChangedCallback`
correctly regardless of framework property-setting behavior.

---

## Floating Components in Shadow DOM

Components with floating panels (Select, Autocomplete, Menu, Popover,
DatePicker, SpeedDial, SplitButton, ProfileMenu) manage their own visibility
inside Shadow DOM.

**Key architectural detail:** The SSR gallery uses `[data-floating]` CSS rules
from `tokens.css` to control floating panel visibility. These rules are
**stripped** from the adopted stylesheet in Shadow DOM because they would make
panels permanently invisible inside Custom Elements.

Instead, each Custom Element's `#open()` / `#close()` methods control visibility
directly via JS:
- `classList.remove('hidden')` / `classList.add('hidden')`
- `style.display = 'block'` / `style.display = 'none'`
- `style.pointerEvents = 'auto'` / `style.pointerEvents = ''`
- `style.opacity = '1'` / `style.opacity = ''`

### Fixed positioning (escape scroll container clipping)

All floating panels use `position: fixed` with viewport coordinates calculated
from `trigger.getBoundingClientRect()`. This ensures panels escape `overflow:
auto/scroll/hidden` on ancestor elements (e.g. when a Select or Popover is
inside `<cx-scrollbar>` or any scroll container).

The base class `CxElement` provides two shared utilities:

```js
// In #open() — positions panel with fixed coordinates + above/below flip logic
this._positionFloatingFixed(trigger, panel, { matchWidth: true, gap: 4 });

// In #close() — resets all inline position styles
this._resetFloatingFixed(panel);
```

Tooltip uses a different approach: the `tooltip.js` behavior module creates a
single shared tooltip element on `document.body` (fully outside all scroll
containers). The `<cx-tooltip>` CE connects its shadow DOM wrapper to this
shared floating tooltip via `__cx._behaviors.tooltip.init(wrapper)`.

**When writing new Custom Elements with floating panels:** Never use `position:
absolute` -- it clips inside scroll containers. Always use
`_positionFloatingFixed()` or portal to `document.body`.

### Shadow DOM containment rule (CRITICAL)

`Node.contains()` does NOT cross shadow DOM boundaries. When checking if focus
or a click target is "inside" the component, you MUST check BOTH trees:

```js
// WRONG -- misses elements inside shadow root
if (!this.contains(active)) { this.#close(); }

// CORRECT -- checks light DOM AND shadow DOM
if (!this.contains(active) && !this._shadow.contains(active) && active !== this) {
  this.#close();
}
```

This applies to:
- **focusout handlers** -- `activeElement` after focus leaves
- **outside click handlers** -- `e.target` from document mousedown
- **relatedTarget checks** -- `e.relatedTarget` in focusin/focusout

Every Custom Element with a close-on-blur or close-on-outside-click pattern
must use the dual check. Without it, the focusout fires and closes the panel
before the click event can register on the shadow DOM option.

---

## Markdown Rendering

Collet provides GFM markdown rendering via WASM with compile-time XSS safety.
No runtime HTML sanitizer -- raw HTML in source is escaped by the Rust type system.

### Static Rendering (Vanilla JS)

```js
import { renderMarkdown, renderMarkdownSync } from '@colletdev/core/markdown';

// Async -- waits for WASM if needed
const html = await renderMarkdown('**Hello** world');
// -> '<div class="cx-prose"><p><strong>Hello</strong> world</p>\n</div>'

// Sync -- returns '' if WASM not loaded yet
const html2 = renderMarkdownSync('# Heading');
```

### Streaming Rendering (SSE/WebSocket)

For AI chat interfaces with token-by-token streaming, use the `MessagePart`
Custom Element directly:

```js
const part = document.querySelector('cx-message-part');
part.startStream();

const source = new EventSource('/api/chat');
source.onmessage = (e) => part.appendTokens(e.data);
source.addEventListener('done', () => {
  source.close();
  part.endStream(); // final WASM sanitization pass
});
```

### Markdown API Reference

| Export | Type | Description |
|--------|------|-------------|
| `renderMarkdown(input)` | `async (string) -> string` | One-shot async rendering. Waits for WASM if needed. |
| `renderMarkdownSync(input)` | `(string) -> string` | Synchronous rendering. Returns `''` if WASM not loaded. |

### Security Model

XSS safety is achieved through **compile-time structural guarantees**, not runtime sanitization:

1. `pulldown-cmark` parses markdown into typed Rust events (not strings)
2. `Event::Html` and `Event::InlineHtml` (raw HTML) are converted to `Event::Text` (escaped)
3. Dangerous URL schemes (`javascript:`, `data:`, `vbscript:`) are stripped from links
4. All text content is HTML-escaped by pulldown-cmark's renderer

This removed the `ammonia` + `html5ever` dependency chain (22 crates, ~400KB WASM),
cutting the binary by ~49% gzipped.

### Streaming Safety

During streaming, `streaming-markdown` (3KB vendored) renders directly to DOM
for instant visual feedback. When `endStream()` is called, the accumulated text
is re-rendered through the WASM pipeline for defense-in-depth XSS sanitization.

### Code Viewer (Mac Terminal Style)

`MessagePart` with `kind="code_block"` renders a macOS-style terminal with
traffic light dots, title bar, copy button, and syntax highlighting for 200+
languages.

Syntax highlighting uses `syntect` (SSR-side, feature-gated). The CSS theme
is in `packages/core/dist/syntax.css` -- include it alongside `tokens.css`
and `cx-utilities.css`.

### Component Preview (Sandboxed)

`MessagePart` with `kind="preview"` renders a sandboxed iframe with framework
tabs. The iframe uses `sandbox="allow-scripts"` for isolation. Tab switching
is handled by the `message-part` behavior module.

---

## Behavior Module Architecture

Component interactivity uses a three-layer runtime:

1. **Core Loader** (`static/loader.js`, ~200 lines) -- event delegation, WASM loading,
   state R/W, floating positioning, behavior routing via `__cx` namespace
2. **Behavior Modules** (`static/_behaviors/*.js`, loaded via `<script defer>`) --
   per-component DOM orchestration (focus, ARIA, classList, scrollIntoView)
3. **WASM Handlers** (`crates/handlers/src/*.rs`, lazy-loaded) -- pure business
   logic (filtering, sorting, state transitions)

Rules:
- Core loader must stay under ~200 lines (core infrastructure only)
- Behavior modules register via `__cx.behavior('name', handler)`
- WASM handlers are pure: `(state) -> new_state`, no DOM access
- Behavior modules include JS fallbacks for WASM functions
- Each Custom Element loads only its needed behavior `<script>` tag

---

## WASM Dispatcher

Collet uses a single WASM entry point instead of per-component exports:

```js
// Internal -- called by Custom Element definitions
import { cx_render } from '@colletdev/core/wasm';

const html = cx_render('button', { label: 'Click', variant: 'filled' });
```

The dispatcher pattern (`cx_render(component, config)`) plus a separate
`cx_render_markdown(input)` export. This gives 2 WASM exports instead
of 45, yielding cleaner binaries and faster WASM instantiation.

---

## TypeScript Types

Shared types are exported from `@colletdev/core`:

```ts
import type {
  CloseDetail,
  NavigateDetail,
  InputDetail,
  SelectDetail,
  MenuActionDetail,
  SidebarGroup,
  SelectOption,
  OptionGroup,
  TableColumn,
  TableRow,
  TabItem,
  MenuEntry,
  CarouselSlide,
  StepperStep,
  RadioOption,
  ToggleGroupItem,
  AccordionItem,
  BreadcrumbItem,
  SpeedDialAction,
  SplitMenuEntry,
  MessageGroupPart,
} from '@colletdev/core';
```

Complex props (`items`, `groups`, `entries`, `slides`, etc.) accept either
a typed object/array or a pre-serialized JSON string. When an object is passed,
the wrapper calls `JSON.stringify` automatically.
