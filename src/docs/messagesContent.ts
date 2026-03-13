export interface MessageLayerRow {
  component: string;
  useItFor: string;
  thinkOfItAs: string;
}

export interface CurrentReactApiRow {
  component: string;
  useItThisWay: string;
}

export interface AgentPatternRow {
  workflow: string;
  structure: string;
  reason: string;
}

export const messageLayerRows: MessageLayerRow[] = [
  {
    component: 'MessageBubble',
    useItFor: 'Simple user or assistant turns with sender framing, alignment, and timestamp',
    thinkOfItAs: 'The outer visual container',
  },
  {
    component: 'MessageGroup',
    useItFor: 'Assistant responses made of typed parts such as text, code, thinking, tool calls, and errors',
    thinkOfItAs: 'The structured turn payload',
  },
  {
    component: 'MessagePart',
    useItFor: 'Standalone typed content blocks with optional markdown and streaming',
    thinkOfItAs: 'The individual render unit',
  },
  {
    component: 'ActivityGroup',
    useItFor: 'Tool progress, status updates, and grouped activity entries adjacent to the conversation',
    thinkOfItAs: 'The operational timeline block',
  },
  {
    component: 'CodeBlock',
    useItFor: 'Standalone code samples outside the message stack',
    thinkOfItAs: 'The code surface',
  },
];

export const currentReactApiRows: CurrentReactApiRow[] = [
  { component: 'MessageBubble', useItThisWay: 'React wrapper for sender framing and layout' },
  { component: 'MessageGroup', useItThisWay: 'Declarative parts array for typed assistant content' },
  { component: 'MessagePart', useItThisWay: 'Declarative typed part props plus an imperative ref API for streaming' },
  { component: 'ActivityGroup', useItThisWay: 'Explicitly configured activity surface with a manual status prop' },
  { component: 'MessageTimeline', useItThisWay: 'Conceptual upstream reducer, not an npm React export yet' },
];

export const commonAgentPatternRows: AgentPatternRow[] = [
  {
    workflow: 'Simple answer',
    structure: 'MessageBubble with a MessageGroup containing text and optional code parts',
    reason: 'Keeps the full assistant turn in one stable unit',
  },
  {
    workflow: 'Tool call then answer',
    structure: 'MessageBubble with ActivityGroup above a MessageGroup',
    reason: 'Separates operational status from user-facing prose',
  },
  {
    workflow: 'Streaming draft',
    structure: 'Stable shell plus streamed MessagePart, then settle into grouped parts',
    reason: 'Avoids re-rendering the entire turn on every token',
  },
  {
    workflow: 'Tool loop during streaming',
    structure: 'Keep streaming text and activity as separate surfaces inside the same assistant turn',
    reason: 'Lets tool status change without corrupting in-progress text',
  },
  {
    workflow: 'Error and recovery',
    structure: 'Add an error part or failed activity state, then append the recovery step as a new part',
    reason: 'Preserves chronology instead of hiding failure',
  },
];

export const wrapperGapNotes: string[] = [
  'MessageGroupPart uses snake_case fields like tool_name and thinking_label, while standalone MessagePart uses camelCase props like toolName and thinkingLabel.',
  'ActivityGroup still takes a manual status prop, even though the timeline model describes derived activity status.',
  'MessageTimeline is still conceptual from the npm app perspective. The reducer is not exposed as a React-facing API in this install.',
  'MessageBubble still focuses on sender framing and does not expose the fuller metadata shape implied by some upstream examples.',
];

export const scrutinyRules: string[] = [
  'Keep one assistant bubble per logical turn unless you are intentionally building a raw event log.',
  'Use MessageGroup for settled multi-part output; use standalone MessagePart for one segment or streaming.',
  'Use ActivityGroup for operations and tool status, not for the final user-facing answer body.',
  'Treat tool calls, tool results, thinking, errors, and final prose as distinct semantic states, not as one mutable text blob.',
  'Prefer append-and-settle over destructive rewrites so failures and recoveries remain legible.',
  'Keep the wrapper naming mismatch in mind: grouped parts are snake_case, standalone parts are camelCase.',
];

export const MESSAGE_BUBBLE_EXAMPLE = `<MessageBubble
  role="assistant"
  variant="ghost"
  senderName="Assistant"
  timestamp="2:34 PM"
>
  <p>Run npm install @colletdev/core @colletdev/react</p>
</MessageBubble>`;

export const MESSAGE_GROUP_EXAMPLE = `const parts = [
  { kind: 'text', content: 'Here is the fix:' },
  {
    kind: 'code-block',
    language: 'tsx',
    content: '<Button label="Save" />',
  },
  {
    kind: 'tool-call',
    tool_name: 'apply_patch',
    tool_arguments: '{"file":"src/App.tsx"}',
    tool_status: 'success',
  },
  {
    kind: 'thinking',
    thinking_label: 'Checking generated types...',
  },
];

<MessageGroup
  role="assistant"
  senderName="Assistant"
  parts={parts}
/>`;

export const MESSAGE_PART_EXAMPLE = `<MessagePart kind="text" markdown content="**Hello** world" />

<MessagePart
  kind="code-block"
  language="rust"
  filename="main.rs"
  content="fn main() {}"
/>

<MessagePart
  kind="tool-call"
  toolName="search_docs"
  toolStatus="pending"
  toolArguments='{"query":"messages"}'
/>

<MessagePart kind="thinking" thinkingLabel="Analyzing..." />

<MessagePart kind="error" content="Connection failed" />`;

export const MESSAGE_PART_STREAM_EXAMPLE = `const ref = useRef<MessagePartRef>(null);

<MessagePart
  ref={ref}
  kind="text"
  markdown
  stream
  onStreamEnd={() => console.log('stream complete')}
/>

await ref.current?.startStream();
ref.current?.appendTokens('**Hello**');
ref.current?.appendTokens(' world');
await ref.current?.endStream();`;

export const ACTIVITY_GROUP_EXAMPLE = `<ActivityGroup
  status="running"
  summary="Indexing repository"
  action="View details"
  expanded
/>`;

export const TURN_STATE_EXAMPLE = `type TurnState = {
  id: string;
  role: 'user' | 'assistant';
  activity?: {
    status: 'running' | 'completed' | 'error';
    summary: string;
    action?: string;
  };
  parts: MessageGroupPart[];
  streaming?: {
    active: boolean;
    target: 'draft' | 'final';
  };
};`;

export const AI_MESSAGE_LIFECYCLE_EXAMPLE = `import { init } from '@colletdev/core';
import {
  ActivityGroup,
  MessageBubble,
  MessageGroup,
  MessagePart,
} from '@colletdev/react';
import type { MessageGroupPart } from '@colletdev/react';

await init({ lazy: true });

type AssistantTurn = {
  id: string;
  senderName: string;
  parts: MessageGroupPart[];
  activity?: {
    status: string;
    summary: string;
    action?: string;
  };
  streaming?: boolean;
};

function AssistantMessage({ turn }: { turn: AssistantTurn }) {
  return (
    <MessageBubble
      role="assistant"
      variant="ghost"
      senderName={turn.senderName}
      timestamp="just now"
    >
      {turn.activity && (
        <ActivityGroup
          status={turn.activity.status}
          summary={turn.activity.summary}
          action={turn.activity.action}
          expanded
        />
      )}

      <MessageGroup
        role="assistant"
        senderName={turn.senderName}
        parts={turn.parts}
      />

      {turn.streaming && (
        <MessagePart kind="text" markdown stream />
      )}
    </MessageBubble>
  );
}

const turn: AssistantTurn = {
  id: 'turn-42',
  senderName: 'Collet',
  activity: {
    status: 'running',
    summary: 'Searching documentation',
    action: 'View details',
  },
  parts: [
    { kind: 'thinking', thinking_label: 'Looking through docs...' },
    {
      kind: 'tool-call',
      tool_name: 'search_docs',
      tool_arguments: '{"query":"message api"}',
      tool_status: 'success',
    },
    {
      kind: 'text',
      content: 'Here is the current message API in React.',
    },
    {
      kind: 'code-block',
      language: 'tsx',
      content: '<MessagePart kind="text" markdown content="**Hello** world" />',
    },
  ],
};`;

export const TOOL_LOOP_PATTERN_EXAMPLE = `// 1. Assistant starts reasoning
turn.parts.push({
  kind: 'thinking',
  thinking_label: 'Looking up the latest docs...',
});

// 2. Tool begins
turn.activity = {
  status: 'running',
  summary: 'Searching documentation',
  action: 'View details',
};

turn.parts.push({
  kind: 'tool-call',
  tool_name: 'search_docs',
  tool_arguments: '{"query":"message-part"}',
  tool_status: 'pending',
});

// 3. Tool settles
turn.activity = {
  status: 'completed',
  summary: 'Documentation search complete',
};

turn.parts.push({
  kind: 'tool-result',
  tool_name: 'search_docs',
  tool_status: 'success',
  content: 'Found the current MessagePart API.',
});

// 4. Assistant answers
turn.parts.push({
  kind: 'text',
  content: 'MessagePart now supports declarative typed props plus streaming.',
});`;
