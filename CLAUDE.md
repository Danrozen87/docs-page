# Collet Docs Page — Local Agent Notes

## Project Scope

This repo is the Collet documentation site built with Vite, React, TypeScript, and Collet.
It consumes published packages from npm. It does not modify Collet source.

- Runtime package: `@colletdev/core`
- React wrappers: `@colletdev/react`
- Agent docs package: `@colletdev/docs`
- Current docs coverage: 49 component pages

## Local Truth

When local instructions conflict, prefer this order:

1. `AGENTS.md` and the repo-local SEAM packets
2. The app source in `src/`
3. Generated docs exports in `public/ai/` and `public/llms.txt`
4. Local Collet skill files in `.claude/skills/collet/`
5. This file

## SEAM Preflight

This repo carries a repo-native SEAM layer. Before substantial work, read:

1. Session packet:
   `node --experimental-strip-types ./scripts/seam-context.ts session`
2. File packet when working in a specific file:
   `node --experimental-strip-types ./scripts/seam-context.ts file <path>`
3. Task packet for the current user request:
   `node --experimental-strip-types ./scripts/seam-context.ts task "<request>"`

Claude hooks may inject the same packets automatically, but the commands above are the repo-native fallback and source of truth.

## App Basics

- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Regenerate machine-readable docs: `npm run docs:exports`
- SEAM drift check: `npm run seam:check`
- Build: `npm run build`

## Collet Initialization

This app initializes Collet in [`src/main.tsx`](/Users/danrozen87/Documents/Projekt/lab/docs-page/src/main.tsx) with:

```tsx
await init({ lazy: true });
```

Do not document or implement a different default here unless the app changes.

## Docs Structure

- Human guide pages live in `src/pages/docs/`
- Component metadata lives in `src/pages/docs/components/componentData.ts`
- Component categories and routing live in `src/docs/registry.ts`
- Live component previews live in `src/pages/docs/components/ComponentPreviews.tsx`
- Machine-readable exports are generated into `public/ai/`

If you add or remove a component page, update all three:

1. `componentData.ts`
2. `registry.ts`
3. `ComponentPreviews.tsx`

Then run `npm run docs:exports`.

## Writing Rules For This Repo

- Prefer direct, high-signal explanations over marketing copy.
- Keep guide page structure consistent: lead, section headings, code, then navigation.
- Use `@colletdev/docs`, not `@collet/docs`.
- Use the current component count from local source, not hardcoded numbers.
- Preserve existing docs tone: pragmatic, compact, low-hype.

## Collet Styling Rules

Collet components render in Shadow DOM.

Use:

1. CSS custom properties on `:root`
2. `::part()` selectors for exposed internals
3. Host `className` / `style` for layout

Do not rely on internal DOM structure inside Collet components.

## Validation

Before finishing docs changes:

1. Run `npm run docs:exports`
2. Run `npm run typecheck`
3. Run `npm run seam:check` when governed files changed
4. Check for stale package names or stale component counts with `rg`

## Local Collet Skill

The installed Collet skill lives in `.claude/skills/collet/`.
Use it as reference material, but prefer repo-local source when the docs app and the skill disagree.
