# docs-page

Collet documentation site built with Vite, React, TypeScript, and `@colletdev/react`.

## What this repo contains

- the public docs pages for Collet components and guides
- generated AI-facing exports in `public/ai/` and `public/llms.txt`
- a repo-native SEAM proof of concept under `.seam/`, `src/seam/`, and `scripts/`
- a first Writer path for drift detection via `.githooks/pre-commit` and `.github/workflows/seam-writer.yml`

## Local development

```sh
npm install
npm run dev
```

## Key commands

```sh
npm run docs:exports
npm run typecheck
npm run build
npm run seam:session
npm run seam:check
```

## SEAM

This repo carries a repo-native SEAM layer.

Read the session packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts session
```

Read a file packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts file src/main.tsx
```

Read a task packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts task "Update the docs version and regenerate exports"
```

Run the Writer check:

```sh
node --experimental-strip-types ./scripts/seam-writer.ts files vite.config.ts
```

To enable the local pre-commit hook:

```sh
git config core.hooksPath .githooks
```
