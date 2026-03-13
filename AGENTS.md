# SEAM Agent Instructions

This repo carries a repo-native SEAM layer. Any coding agent working here should use it before making decisions.

## Mandatory SEAM Preflight

Before substantial work, read the session packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts session
```

Before editing or reasoning deeply about a specific file, read the file packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts file <path>
```

Before implementing a user request, especially one involving docs updates, versions, startup/runtime behavior, or messages, read the task packet:

```sh
node --experimental-strip-types ./scripts/seam-context.ts task "<user request>"
```

These packets are not optional guidance. They are the repo-local semantic context layer for this codebase.

## Why This Exists

SEAM keeps a small, canonical set of repo rules close to the code:

- startup/runtime invariants
- docs export and versioning procedures
- generated-file boundaries
- message API caveats

The graph lives in `.seam/graph.json`. The runtime contract lives in `src/seam/runtime.ts`.
The first Writer check lives in `scripts/seam-writer.ts`.

## Working Rule

Do not rely only on local intuition or broad file scanning when SEAM has a packet for the current session, file, or task. Use the SEAM packet first, then inspect source as needed.

## Validation

After docs or SEAM changes:

1. `npm run docs:exports`
2. `npm run typecheck`
3. `npm run build`
4. If governed files changed, run `npm run seam:check` or update the graph / audit record
