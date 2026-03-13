import { seamGraph } from '../seam/graph.ts';
import type { SeamTrigger } from '../seam/reader.ts';
export {
  resolveSeamContext,
  seamNodes,
  type SeamContextPacket,
  type SeamPing,
  type SeamTrigger,
  type SeamTriggerKind,
} from '../seam/reader.ts';

export const seamSessionTrigger: SeamTrigger = {
  kind: 'session',
  value: 'repo-session',
  label: 'Repo Session Start',
  description: 'Bootstraps an AI working session with the most important repo-wide constraints and procedures.',
};

export const seamFileTriggers: SeamTrigger[] = [
  {
    kind: 'file',
    value: 'vite.config.ts',
    label: 'Open vite.config.ts',
    description: 'Surfaces startup and preload constraints before anyone tweaks the Vite plugin.',
  },
  {
    kind: 'file',
    value: 'src/main.tsx',
    label: 'Open src/main.tsx',
    description: 'Surfaces the render-first lazy-init pattern and related startup decisions.',
  },
  {
    kind: 'file',
    value: 'src/docs/registry.ts',
    label: 'Open src/docs/registry.ts',
    description: 'Surfaces the version source of truth and the generated docs relationship.',
  },
  {
    kind: 'file',
    value: 'src/pages/docs/MessagesPage.tsx',
    label: 'Open MessagesPage.tsx',
    description: 'Surfaces message API consistency warnings and shared example guidance.',
  },
];

export const seamTaskTriggers: SeamTrigger[] = [
  {
    kind: 'task',
    value: 'Update the docs to a new Collet release version and regenerate the published outputs.',
    label: 'Task: bump docs version',
    description: 'Matches versioning rules, generated artifact context, and the docs validation procedure.',
  },
  {
    kind: 'task',
    value: 'Optimize startup and reduce wasm pressure without breaking the lazy Collet setup.',
    label: 'Task: optimize startup',
    description: 'Matches the init strategy and preload constraints.',
  },
  {
    kind: 'task',
    value: 'Fix the message docs after a MessagePart API change and keep examples consistent.',
    label: 'Task: update message docs',
    description: 'Matches the message naming warning, the shared examples example, and docs regeneration procedure.',
  },
];

export const seamGraphSnippet = JSON.stringify(seamGraph, null, 2);

export const seamResolverSnippet = `function fileContext(filePath: string) {
  return seamNodes
    .filter((node) => node.watchFiles.some((pattern) => matchesWatchPattern(filePath, pattern)))
    .sort(sortByAuthorityAndType)
    .map((node) => ({
      id: node.id,
      summary: node.summary,
      authority: node.authority,
      type: node.type,
    }));
}`;

export const seamAdapterSnippet = `// Trigger adapter — what the AI tooling layer would do
const packet = resolveSeamContext({
  kind: 'file',
  value: 'vite.config.ts',
  label: 'Open vite.config.ts',
  description: 'File-open trigger',
});

// The assistant keeps working normally.
// The tooling layer quietly injects packet.pings before editing begins.`;
