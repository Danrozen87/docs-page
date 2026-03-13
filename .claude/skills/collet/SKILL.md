---
name: collet
description: >
  Collet component library — 49 accessible Custom Element + WASM components
  with typed React wrappers.
---

# Collet

49 accessible web components built in Rust/WASM. Distributed as Custom Elements
with first-class React, Vue, Svelte, and Angular wrappers.

## Context Detection

Read the reference that matches the user's context:

| Signal | Load |
|--------|------|
| .tsx / .jsx / React | core.md + react.md |
| .vue / Vue | core.md + vue.md |
| .svelte / Svelte | core.md + svelte.md |
| .component.ts / Angular | core.md + angular.md |
| Custom Elements / @colletdev/core | core.md only |
| Component API question | components.md |
| Chat / messages / streaming | messages.md |

Always read core.md first, then the framework-specific reference.

## Quick Reference

- **Install:** `npm install @colletdev/core @colletdev/{react,vue,svelte,angular}`
- **Prefix:** `cx-` (e.g., `<cx-button>`, `<cx-dialog>`)
- **Init:** `import { init } from '@colletdev/core'; await init();`
- **Theming:** CSS custom properties via custom `tokens.css`
- **Docs:** `@colletdev/docs` package or references/ in this directory
