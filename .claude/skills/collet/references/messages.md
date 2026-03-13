# Messages — Composition Guide

How to build chat interfaces, AI assistant UIs, and conversational experiences
with Collet's message component system.

---

## Architecture

Messages are **composed, not monolithic**. There is no single `<Message>` component.
Instead, four specialized components snap together like building blocks:

```
MessageBubble          ← outer container (alignment, sender metadata, timestamp)
└── MessageGroup       ← groups connected content blocks
    ├── MessagePart    ← text, code, tool calls, errors, thinking
    ├── MessagePart    ← another content block
    └── ActivityGroup  ← tool call/result group with derived status
```

This design lets you build anything from a simple chat bubble to a full
AI coding assistant with tool calls, streaming markdown, and code blocks.

---

## The Components

### MessageBubble

The outer container. Controls sender alignment, name, and timestamp.

```tsx
import { MessageBubble } from '@colletdev/react';

<MessageBubble role="assistant" senderName="Collet" timestamp="2:34 PM">
  {/* MessageGroup(s) go here */}
</MessageBubble>

<MessageBubble role="user" senderName="Dan">
  {/* User message content */}
</MessageBubble>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `'user' \| 'assistant'` | `'user'` | Determines alignment and color |
| `senderName` | `string` | — | Name displayed above the bubble |
| `timestamp` | `string` | — | Timestamp text |
| `variant` | `'filled' \| 'ghost'` | `'filled'` | Visual style |
| `shape` | `'sharp' \| 'rounded'` | `'rounded'` | Border radius |

**Alignment:** `role="user"` right-aligns, `role="assistant"` left-aligns.

### MessageGroup

Groups multiple message segments into a single connected card. In the React
wrapper, the grouped content is passed through the `parts` array.

```tsx
import { MessageGroup } from '@colletdev/react';

<MessageGroup
  role="assistant"
  senderName="Collet"
  parts={[
    { kind: 'text', content: 'Here is what I found:' },
    { kind: 'code-block', language: 'rust', content: 'fn main() { println!(\"Hello\"); }' },
  ]}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `'user' \| 'assistant'` | `'user'` | Color scheme |
| `alignment` | `'auto' \| 'start' \| 'end'` | `'auto'` | Layout alignment |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Part sizing |
| `senderName` | `string` | — | Sender label |
| `parts` | `MessageGroupPart[] \| string` | — | Grouped part payload |

### MessagePart

The individual content block. Each part has a `kind` that determines its rendering:

| Kind | Renders as | Use for |
|------|-----------|---------|
| `text` | Plain or markdown text | Chat messages, explanations |
| `code-block` | Syntax-highlighted code with terminal chrome | Code snippets, file contents |
| `tool-call` | Collapsible tool invocation row | Function calls, API requests |
| `tool-result` | Collapsible tool output | Function responses |
| `thinking` | Shimmer animation or completed indicator | "Thinking..." state |
| `error` | Danger-styled error message | Error responses |

```tsx
import { MessagePart } from '@colletdev/react';

{/* Plain text */}
<MessagePart kind="text" content="Hello, how can I help?" />

{/* Markdown text */}
<MessagePart
  kind="text"
  markdown
  content="Here is a **bold** statement with a [link](https://example.com)."
/>

{/* Code block */}
<MessagePart
  kind="code-block"
  language="typescript"
  filename="setup.ts"
  content={`import { init } from '@colletdev/core';
await init();`}
/>

{/* Tool call (pending) */}
<MessagePart
  kind="tool-call"
  toolName="search_docs"
  toolArguments='{"query": "auth"}'
  toolStatus="pending"
/>

{/* Tool result */}
<MessagePart
  kind="tool-result"
  toolName="search_docs"
  toolStatus="success"
  collapsible
  content="Found 3 results..."
/>

{/* Thinking indicator */}
<MessagePart kind="thinking" thinkingLabel="Analyzing code..." />

{/* Error */}
<MessagePart kind="error" content="Connection timed out" />
```

### ActivityGroup

Groups related operational updates with an explicit status indicator.

```tsx
import { ActivityGroup } from '@colletdev/react';

<ActivityGroup
  status="running"
  summary="Code analysis"
  action="View details"
  expanded
/>
```

| Status | Meaning | Visual |
|--------|---------|--------|
| `running` | At least one tool is pending | Shimmer animation |
| `done` | All tools completed successfully | Checkmark |
| `error` | At least one tool failed | Error indicator |

---

## Markdown Rendering

MessagePart with `kind="text"` and `markdown` enabled renders GitHub Flavored
Markdown through Collet's WASM-powered renderer:

```tsx
<MessagePart kind="text" markdown>
  ## Features

  - **Tables** with column alignment
  - `inline code` and fenced code blocks
  - Task lists: - [x] done - [ ] todo
  - [Links](https://example.com) with external indicators
  - Heading anchors for deep linking
</MessagePart>
```

**What's supported:** paragraphs, headings (h1-h6) with anchor IDs, bold, italic,
strikethrough, ordered/unordered/nested lists, task lists, tables, inline code,
fenced code blocks with language labels, blockquotes, links, images, horizontal rules.

**Security:** XSS-safe at compile time — raw HTML in markdown source is escaped,
not passed through. No runtime sanitizer needed.

**Programmatic rendering:**

```tsx
import { renderMarkdown } from '@colletdev/core/markdown';

// Async (lazy-loads WASM)
const html = await renderMarkdown('**Hello** world');

// Sync (after WASM is loaded)
import { renderMarkdownSync } from '@colletdev/core/markdown';
const html = renderMarkdownSync('**Hello** world');
```

**React hook:**

```tsx
import { useMarkdown } from '@colletdev/react';

function MyComponent({ content }) {
  const html = useMarkdown(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

---

## Streaming Messages

For real-time AI responses, use the streaming API on MessagePart:

```tsx
import { useRef } from 'react';
import { MessagePart } from '@colletdev/react';
import type { MessagePartRef } from '@colletdev/react';

function StreamingMessage() {
  const ref = useRef<MessagePartRef>(null);

  useEffect(() => {
    // Start streaming
    ref.current?.startStream();

    // Append tokens as they arrive
    eventSource.onmessage = (e) => {
      ref.current?.appendTokens(e.data);
    };

    // End stream (triggers WASM re-render for XSS safety)
    eventSource.onclose = () => {
      ref.current?.endStream();
    };
  }, []);

  return <MessagePart ref={ref} kind="text" stream markdown />;
}
```

**How streaming works:**
1. `startStream()` — switches to DOM-based incremental rendering (fast)
2. `appendTokens(text)` — appends text tokens with rAF batching
3. `endStream()` — re-renders accumulated text through WASM markdown pipeline
   (defense-in-depth XSS sanitization)

---

## MessageTimeline (Rust-side reducer)

For production chat UIs with tool calls, streaming, and complex turn lifecycle,
Collet provides a Rust-side chronological reducer. This is the recommended way
to build AI assistant interfaces.

**What it handles:**
- Chronological ordering of text, thinking, tool calls, code blocks, errors
- Out-of-order tool result hydration
- Tool group status derivation (running → done/error) from child state
- Thinking auto-settlement when the turn advances
- Duplicate tool result deduplication
- Terminal turn immutability (completed/aborted turns reject new events)

**Note:** MessageTimeline is currently Rust-side only. It renders directly to HTML
via the SSR gallery. WASM/npm export is planned — see the project roadmap.

---

## Complete Example

A full AI assistant conversation with tool calls:

```tsx
import {
  MessageBubble, MessageGroup, MessagePart, ActivityGroup
} from '@colletdev/react';

function Conversation() {
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      {/* User message */}
      <MessageBubble role="user" senderName="Dan">
        <MessageGroup role="user">
          <MessagePart kind="text">
            How do I set up Collet in my Next.js app?
          </MessagePart>
        </MessageGroup>
      </MessageBubble>

      {/* Assistant response with tool calls */}
      <MessageBubble role="assistant" senderName="Collet" timestamp="2:34 PM">
        <MessageGroup role="assistant">
          {/* Thinking */}
          <MessagePart kind="thinking" completed thinkingLabel="Searched documentation" />

          {/* Tool activity */}
          <ActivityGroup summary="Documentation search" status="done" expanded>
            <MessagePart
              kind="tool-call"
              toolName="search_docs"
              toolStatus="success"
              description="Searched Next.js setup guide"
            />
          </ActivityGroup>

          {/* Response text with markdown */}
          <MessagePart kind="text" markdown>
            Here's how to set up Collet in Next.js:

            1. Install the packages
            2. Add the Vite plugin (or configure manually for Next.js)
            3. Call `init()` in your root layout
          </MessagePart>

          {/* Code example */}
          <MessagePart kind="code-block" language="tsx" filename="app/layout.tsx">
{`import { init } from '@colletdev/core';

init();

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}`}
          </MessagePart>
        </MessageGroup>
      </MessageBubble>
    </div>
  );
}
```

---

## Standalone Code Blocks

For code display outside of messages, use the dedicated `CodeBlock` component:

```tsx
import { CodeBlock } from '@colletdev/react';

{/* Full terminal chrome */}
<CodeBlock content="fn main() {}" language="rust" filename="main.rs" />

{/* Minimal (no chrome, hover copy button) */}
<CodeBlock content="npm install @colletdev/core" variant="minimal" />

{/* No traffic lights */}
<CodeBlock content="code" language="js" trafficLights={false} />
```

See the [CodeBlock component docs](./components.md#codeblock) for full props reference.
