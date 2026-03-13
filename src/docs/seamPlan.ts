export interface SeamPlanCard {
  title: string;
  description: string;
}

export interface SeamArchitectureLayer {
  layer: string;
  purpose: string;
  implementation: string;
}

export interface SeamPlanPhase {
  step: string;
  title: string;
  deliverable: string;
  outcome: string;
}

export interface SeamEnforcementSurface {
  surface: string;
  status: string;
  description: string;
}

export const seamCurrentState: SeamPlanCard[] = [
  {
    title: 'Canonical graph is now real',
    description:
      'The current POC now reads from .seam/graph.json instead of hardcoded demo nodes. The repo has a real graph file, a real schema, and editor schema wiring for graph authoring.',
  },
  {
    title: 'Real resolver behavior',
    description:
      'The file, task, and session packets are produced by real matching logic against watched paths and task keywords. The demo UI simulates the event source, but the packets themselves are not hand-written per button.',
  },
  {
    title: 'Validated Reader shape',
    description:
      'The page proves that small, ranked packets are enough to carry useful context. It shows what a Reader should return before there is any editor or MCP integration.',
  },
  {
    title: 'One real adapter is wired',
    description:
      'The repo now has a real runtime event contract plus a project-scoped Claude adapter. That means the codebase owns the packets and triggers, while individual tools can choose how to consume them.',
  },
  {
    title: 'Node API foundation exists',
    description:
      'The repo now includes a first typed defineSeamAttachment(...) helper. It is not wired into editor intelligence yet, but the local primitive now exists as a real code surface instead of a fictional import.',
  },
  {
    title: 'Repo-native preflight exists',
    description:
      'The repo now exposes a generic seam-context CLI plus AGENTS.md instructions, so SEAM can be consumed without depending on one editor or AI host.',
  },
  {
    title: 'Writer enforcement exists',
    description:
      'The repo now includes a real seam-writer CLI, a pre-commit hook file, an audit directory, and a pull-request workflow so governed file drift can be surfaced on both local and CI paths.',
  },
];

export const seamArchitectureLayers: SeamArchitectureLayer[] = [
  {
    layer: 'Graph',
    purpose: 'Canonical knowledge source',
    implementation:
      '.seam/graph.json with nodes, edges, authority, watched files, and task keywords. This stays Git-versioned and language-agnostic.',
  },
  {
    layer: 'Node API',
    purpose: 'Code-local semantic attachment',
    implementation:
      'A typed helper such as defineSeamAttachment(...) for TS/TSX files, plus lightweight metadata patterns for Markdown and non-code surfaces.',
  },
  {
    layer: 'Runtime Contract',
    purpose: 'Tool-agnostic event and packet model',
    implementation:
      'A small repo-owned contract for session, file, and task events that resolves to the same SEAM packets regardless of which AI, editor, or CLI consumes them.',
  },
  {
    layer: 'Adapters',
    purpose: 'Optional integrations chosen by each team',
    implementation:
      'Claude hooks, MCP servers, VS Code extensions, JetBrains plugins, CLIs, and other adapters should all sit at this edge and translate the same packets into tool-native behavior.',
  },
  {
    layer: 'Editor Intelligence',
    purpose: 'Autocomplete, hover, go-to-node, code actions',
    implementation:
      'Editor features remain optional adapters. VS Code can come first, but the semantic model should be reusable through LSP or other editor hosts later.',
  },
  {
    layer: 'Reader',
    purpose: 'Ambient AI context packets',
    implementation:
      'A local Reader sidecar or library exposing session, file, task, and diff context so AI gets the same packets without manual commands.',
  },
  {
    layer: 'Writer',
    purpose: 'Drift detection and auditability',
    implementation:
      'Pre-commit and CI checks that compare changed files against watched nodes, ask for acknowledgment or updates, and store an auditable record of the choice.',
  },
];

export const seamDeliveryPlan: SeamPlanPhase[] = [
  {
    step: 'A',
    title: 'Freeze the canonical graph format',
    deliverable:
      'Define .seam/graph.json, node schema, edge schema, authority model, watched-file semantics, and task-keyword semantics.',
    outcome:
      'SEAM gets one stable source of truth instead of mixing demo data, code comments, and inferred structure.',
  },
  {
    step: 'B',
    title: 'Ship JSON schema support',
    deliverable:
      'Attach a JSON schema so graph authoring immediately gets validation, autocomplete, descriptions, and editor snippets.',
    outcome:
      'The graph becomes pleasant to author before any custom extension work exists.',
  },
  {
    step: 'C',
    title: 'Define the Node API',
    deliverable:
      'Introduce a typed attachment helper for TS/TSX files and a compatible attachment shape for non-code docs surfaces.',
    outcome:
      'Files and components can declare how they relate to SEAM nodes without turning comments into the primary API.',
  },
  {
    step: 'D',
    title: 'Freeze the runtime contract',
    deliverable:
      'Define the repo-owned event and packet model for session, file, task, and later diff or commit flows.',
    outcome:
      'Tool integrations stop owning SEAM behavior; they become thin adapters over one stable contract.',
  },
  {
    step: 'E',
    title: 'Build the graph and attachment indexer',
    deliverable:
      'Index graph nodes, watched paths, task keywords, and code attachments into one in-memory semantic index.',
    outcome:
      'Every later layer can resolve file, task, and component relationships from the same shared index.',
  },
  {
    step: 'F',
    title: 'Extract the Reader from the demo',
    deliverable:
      'Turn the current resolver logic into a local Reader library that returns session, file, task, and diff packets programmatically.',
    outcome:
      'The docs page stops being the only place where SEAM behavior can run.',
  },
  {
    step: 'G',
    title: 'Add optional adapter packages',
    deliverable:
      'Ship at least one AI adapter, one editor adapter, and one CLI or Git adapter to prove the contract is host-agnostic.',
    outcome:
      'SEAM becomes a repo capability instead of a feature tied to one product or editor.',
  },
  {
    step: 'H',
    title: 'Add AI-facing MCP endpoints',
    deliverable:
      'Expose Reader packets through MCP tools and resources so AI tools can request the same context packets shown in this POC.',
    outcome:
      'SEAM becomes consumable by agents without custom prompt gymnastics.',
  },
  {
    step: 'I',
    title: 'Wire project-scoped AI hooks',
    deliverable:
      'Use session, prompt, and pre-tool hooks so AI sessions automatically receive bootstrap, file, and task context.',
    outcome:
      'The pings become ambient for AI instead of living behind a demo button.',
  },
  {
    step: 'J',
    title: 'Ship the editor intelligence layer',
    deliverable:
      'Add completions, hover, code actions, and go-to-node behavior for the graph and Node API inside the editor.',
    outcome:
      'Humans get the same lowered-context benefits while authoring files, not just when reading docs about SEAM.',
  },
  {
    step: 'K',
    title: 'Add lint and integrity checks',
    deliverable:
      'Validate unknown node IDs, broken references, stale attachments, and invalid edge relationships through lint rules.',
    outcome:
      'Authoring guidance becomes enforceable without overloading the Reader or Writer.',
  },
  {
    step: 'L',
    title: 'Introduce the Writer gradually',
    deliverable:
      'Start with advisory drift output, then require acknowledgment for canonical nodes, then backstop it in CI.',
    outcome:
      'Teams get the protection of SEAM without turning the first release into a workflow tax.',
  },
  {
    step: 'M',
    title: 'Measure the system against baseline work',
    deliverable:
      'Compare unassisted work vs SEAM-assisted work on task correctness, prompt churn, context size, and drift rate.',
    outcome:
      'The product gets evidence for what it improves instead of relying on intuition alone.',
  },
  {
    step: 'N',
    title: 'Document the operating model',
    deliverable:
      'Publish the canonical mental model: graph is truth, Node API is attachment, runtime contract is stable, adapters are optional, Reader is ambient context, Writer is drift control.',
    outcome:
      'The team gets a stable architecture and a vocabulary that survives future implementation changes.',
  },
];

export const seamEnforcementSurfaces: SeamEnforcementSurface[] = [
  {
    surface: 'Repo graph',
    status: 'Real now',
    description:
      'The semantic source of truth lives in .seam/graph.json and is not tied to any external tool.',
  },
  {
    surface: 'Runtime contract',
    status: 'Real now',
    description:
      'Session, file, and task events resolve through one repo-owned packet model in src/seam/runtime.ts.',
  },
  {
    surface: 'Generic CLI',
    status: 'Real now',
    description:
      'scripts/seam-context.ts lets any host or human request the same SEAM packets without adopting Claude hooks or MCP.',
  },
  {
    surface: 'Agent instructions',
    status: 'Real now',
    description:
      'AGENTS.md tells compliant coding agents to run the SEAM session, file, and task preflight commands before substantial work.',
  },
  {
    surface: 'Claude adapter',
    status: 'Real now',
    description:
      'Claude hooks inject the same packets automatically, but they are now an adapter on top of the repo-native contract.',
  },
  {
    surface: 'Writer CLI',
    status: 'Real now',
    description:
      'scripts/seam-writer.ts can check staged files, explicit file lists, or a Git range and fail when governed files drift without a SEAM touch.',
  },
  {
    surface: 'Git / CI backstop',
    status: 'Real now',
    description:
      'The repo now carries .githooks/pre-commit and a pull-request workflow. Local install still needs Git hooksPath setup, but the enforcement entrypoints now exist.',
  },
];

export const seamAttachmentSnippet = `import { defineSeamAttachment } from '@/seam/defineSeamAttachment';

export const seam = defineSeamAttachment({
  governs: ['wasm-preload-constraint'],
  illustrates: ['messages-content-example'],
  family: 'docs-runtime',
});`;

export const seamHookSnippet = `{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node --experimental-strip-types ./scripts/seam-hook.ts session"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node --experimental-strip-types ./scripts/seam-hook.ts prompt"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node --experimental-strip-types ./scripts/seam-hook.ts pretool"
          }
        ]
      }
    ]
  }
}`;

export const seamRuntimeSnippet = `import { resolveSeamRuntimeEvent } from '@/seam/runtime';

const packet = resolveSeamRuntimeEvent({
  kind: 'file-open',
  value: 'vite.config.ts',
});

if (packet) {
  adapter.consume(packet.text);
}`;

export const seamCliSnippet = `node --experimental-strip-types ./scripts/seam-context.ts session
node --experimental-strip-types ./scripts/seam-context.ts file src/main.tsx
node --experimental-strip-types ./scripts/seam-context.ts task "Update the docs version and regenerate exports"`;

export const seamWriterSnippet = `node --experimental-strip-types ./scripts/seam-writer.ts files vite.config.ts
node --experimental-strip-types ./scripts/seam-writer.ts ack --reason "Docs copy changed, SEAM graph still accurate" vite.config.ts
npm run seam:check`;

export const seamAdapterPrinciples = [
  'The graph and runtime contract live in the repo. Editors, AI tools, CLIs, and CI only adapt that behavior to their host.',
  'No runtime import in product code should be required to activate SEAM. Code-local attachments are metadata, not framework lock-in.',
  'Any adapter that can observe session, file, task, or commit events should be able to consume the same packets.',
  'Teams can choose Claude Code, Cursor, VS Code, JetBrains, MCP, CLI workflows, or future tools without changing the graph model.',
];
