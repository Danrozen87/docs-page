import { Button, Card } from '@colletdev/react';
import { Link } from 'react-router-dom';
import { DocsCodeBlock } from '../../components/DocsCodeBlock';
import { DocsHeading } from '../../components/DocsHeading';
import { usePageMeta } from '../../hooks/usePageMeta';
import { COLLET_VERSION } from '../../docs/registry';
import {
  ACTIVITY_GROUP_EXAMPLE,
  AI_MESSAGE_LIFECYCLE_EXAMPLE,
  commonAgentPatternRows,
  currentReactApiRows,
  MESSAGE_BUBBLE_EXAMPLE,
  MESSAGE_GROUP_EXAMPLE,
  MESSAGE_PART_EXAMPLE,
  MESSAGE_PART_STREAM_EXAMPLE,
  messageLayerRows,
  scrutinyRules,
  TOOL_LOOP_PATTERN_EXAMPLE,
  TURN_STATE_EXAMPLE,
  wrapperGapNotes,
} from '../../docs/messagesContent';

export function MessagesPage() {
  usePageMeta(
    'Messages',
    'Understand how Collet message components, timeline concepts, and streaming primitives fit together in chat and agent-style interfaces.',
  );

  return (
    <div className="docs-section">
      <h1 className="docs-page-title">Messages</h1>
      <p className="docs-page-lead">
        Collet does not ship a single top-level <code>Message</code> component. It ships a
        small message system. That split is intentional: a production conversation UI needs
        one layer for visual framing, one for grouped parts, one for individual content blocks,
        and one for operational activity.
      </p>

      <section className="docs-prose">
        <DocsHeading id="mental-model">Mental model</DocsHeading>
        <p>
          Think in layers. <code>MessageBubble</code> handles the outer shell and speaker
          framing. <code>MessageGroup</code> handles a structured assistant turn. <code>MessagePart</code>
          handles the individual content block, whether that block is text, code, tool activity,
          thinking, error output, or a streamed segment. <code>ActivityGroup</code> handles
          operational status blocks that sit beside the conversation rather than inside plain prose.
        </p>
        <p>
          The broader Collet model is timeline-oriented: one user turn can produce thinking,
          tool work, streamed text, and code output over time. In the current npm React API,
          you model that timeline in your app state and then render it with these components.
        </p>

        <DocsHeading id="which-component-owns-what">Which layer owns what</DocsHeading>
        <table className="docs-table">
          <thead>
            <tr><th>Component</th><th>Use it for</th><th>Think of it as</th></tr>
          </thead>
          <tbody>
            {messageLayerRows.map((row) => (
              <tr key={row.component}>
                <td><code>{row.component}</code></td>
                <td>{row.useItFor}</td>
                <td>{row.thinkOfItAs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="timeline-vs-react-api">Timeline model vs current React API</DocsHeading>
        <p>
          The upstream Collet docs describe a richer timeline model with derived status,
          chronological event reduction, and message-part kinds that can be hydrated over
          time. That is useful architectural context, but this docs site should stay precise
          about what you can import today:
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Today in React</th><th>Use it this way</th></tr>
          </thead>
          <tbody>
            {currentReactApiRows.map((row) => (
              <tr key={row.component}>
                <td><code>{row.component}</code></td>
                <td>{row.useItThisWay}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="start-simple">Start simple</DocsHeading>
        <p>
          If you only need a chat bubble with text, start with <code>MessageBubble</code>.
          Reach for <code>MessageGroup</code> only when the content is actually multipart,
          and reach for <code>MessagePart</code> when you need one typed content block or
          explicit streaming control.
        </p>
        <DocsCodeBlock
          code={MESSAGE_BUBBLE_EXAMPLE}
          language="tsx"
          filename="MessageBubbleExample.tsx"
        />

        <DocsHeading id="when-to-use-message-group">When to use Message Group</DocsHeading>
        <p>
          Use <code>MessageGroup</code> when a single assistant turn is made of multiple
          typed segments. In the current React wrapper, that means passing a{' '}
          <code>parts</code> array made of <code>MessageGroupPart</code> objects. This is the
          main message API for richer assistant turns.
        </p>
        <DocsCodeBlock
          code={MESSAGE_GROUP_EXAMPLE}
          language="tsx"
          filename="MessageGroupExample.tsx"
        />

        <DocsHeading id="when-to-use-message-part">When to use Message Part</DocsHeading>
        <p>
          Use <code>MessagePart</code> when you want to render one segment directly without
          building a full group first. In <code>{COLLET_VERSION}</code>, the React wrapper exposes the
          real typed part API: text, markdown, code blocks, tool calls, tool results,
          thinking states, and errors all render through one component.
        </p>
        <DocsCodeBlock
          code={MESSAGE_PART_EXAMPLE}
          language="tsx"
          filename="MessagePartExample.tsx"
        />

        <DocsHeading id="streaming-with-message-part">Streaming with Message Part</DocsHeading>
        <p>
          The declarative API does not replace streaming. <code>MessagePart</code> still exposes
          ref methods for token-by-token updates, then performs a final sanitizing render pass
          when the stream ends.
        </p>
        <DocsCodeBlock
          code={MESSAGE_PART_STREAM_EXAMPLE}
          language="tsx"
          filename="MessagePartStream.tsx"
        />

        <DocsHeading id="where-activity-group-fits">Where Activity Group fits</DocsHeading>
        <p>
          <code>ActivityGroup</code> is related, but not identical, to message rendering.
          Use it for grouped operational updates like uploads, deployments, tool runs, or
          task progress. It often appears beside chat output in agent products, but it is
          better understood as an activity surface than as the main message primitive. The
          current React wrapper still expects you to pass a concrete <code>status</code>;
          upstream derived-status behavior is architectural guidance, not a client-side API here.
        </p>
        <DocsCodeBlock
          code={ACTIVITY_GROUP_EXAMPLE}
          language="tsx"
          filename="ActivityGroupExample.tsx"
        />

        <DocsHeading id="message-timeline">Message timeline</DocsHeading>
        <p>
          The new Collet docs are right to frame this as a timeline problem. Assistant turns do
          not arrive as one immutable blob. They evolve through states: thinking starts, tool
          calls run, results settle, text streams in, then the turn becomes stable. Collet has
          an upstream message timeline reducer for that model, but it is not exposed through the
          npm React package yet.
        </p>
        <p>
          In this docs site, the practical guidance is: keep timeline state in your app, then
          render it with <code>MessageBubble</code>, <code>MessageGroup</code>,{' '}
          <code>MessagePart</code>, and <code>ActivityGroup</code>. Use grouped rendering for
          full assistant turns, and standalone parts when one segment needs to stand on its own
          or stream independently.
        </p>

        <DocsHeading id="ai-message-lifecycle">AI message lifecycle in practice</DocsHeading>
        <p>
          A practical AI turn usually looks like this: the user sends a prompt, the assistant
          starts thinking, tool activity appears, one or more results settle, then the final
          answer renders as grouped text and code. In this repo, Collet is initialized once with
          <code> await init({`{ lazy: true }`}) </code>, then React state drives the message UI.
        </p>
        <DocsCodeBlock
          code={AI_MESSAGE_LIFECYCLE_EXAMPLE}
          language="tsx"
          filename="AiMessageLifecycle.tsx"
        />
        <p>
          That example is intentionally anchored in the wrapper APIs that are installed here:
          <code>MessageGroup</code> takes a <code>parts</code> array, <code>MessagePart</code>
          is available for standalone or streamed segments, and <code>ActivityGroup</code>
          still needs an explicit <code>status</code>.
        </p>

        <DocsHeading id="common-agent-patterns">Common agent patterns</DocsHeading>
        <p>
          For agentic products, the important question is not just which component exists. It is
          which component should own each phase of the turn so that retries, tool loops, and
          mid-stream updates stay intelligible under pressure.
        </p>
        <table className="docs-table">
          <thead>
            <tr><th>Workflow</th><th>Recommended structure</th><th>Why it holds up</th></tr>
          </thead>
          <tbody>
            {commonAgentPatternRows.map((row) => (
              <tr key={row.workflow}>
                <td>{row.workflow}</td>
                <td>{row.structure}</td>
                <td>{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <DocsHeading id="recommended-turn-shape">Recommended turn shape</DocsHeading>
        <p>
          A good default is one user turn, then one assistant shell that can own every downstream
          event for that response. Do not create a new top-level assistant bubble for every tool
          call or partial token burst unless your product deliberately wants a fragmented log.
        </p>
        <DocsCodeBlock
          code={TURN_STATE_EXAMPLE}
          language="tsx"
          filename="TurnState.ts"
        />
        <p>
          That shape keeps one place for the assistant turn, one place for grouped settled parts,
          and one place for in-flight streaming state. It is simple enough to reason about and
          explicit enough to support auditability.
        </p>

        <DocsHeading id="tool-loop-pattern">Tool loop pattern</DocsHeading>
        <p>
          The safest tool-loop pattern is append-only at the semantic level. When a tool starts,
          show it in activity or as a tool-call part. When it finishes, update the status and
          append the next visible outcome. Do not rewrite the whole turn to pretend the earlier
          state never happened.
        </p>
        <DocsCodeBlock
          code={TOOL_LOOP_PATTERN_EXAMPLE}
          language="tsx"
          filename="ToolLoopPattern.ts"
        />

        <DocsHeading id="mid-stream-updates">Mid-stream updates</DocsHeading>
        <p>
          Mid-stream text and mid-stream tool activity should not fight for the same render slot.
          If text is actively streaming, keep the streamed <code>MessagePart</code> isolated and
          let tool updates land in <code>ActivityGroup</code> or in later settled parts. That
          keeps the DOM stable and the chronology readable.
        </p>
        <p>
          A practical rule is: stream the answer text in one place, settle tool state in another,
          then fold the final stable answer back into grouped parts once the turn is complete.
        </p>

        <DocsHeading id="under-scrutiny-rules">Rules that hold up under scrutiny</DocsHeading>
        <ul>
          {scrutinyRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <DocsHeading id="wrapper-gaps">Current wrapper gaps</DocsHeading>
        <p>
          There are still a few edges where the broader Collet message model and the published
          npm wrappers do not line up perfectly. Those are worth keeping visible so the Collet
          team can tighten the API story upstream.
        </p>
        <ul>
          {wrapperGapNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p>
          Short version: the docs now explain how to build AI message flows with the wrappers as
          they exist today, and the gaps above are the ones to push upstream if Collet wants a
          cleaner end-to-end conversation API.
        </p>

        <DocsHeading id="recommended-composition">Recommended composition</DocsHeading>
        <ol>
          <li>Use <code>MessageBubble</code> for conventional user/assistant chat bubbles.</li>
          <li>Use <code>MessageGroup</code> for assistant turns with multiple typed parts via the <code>parts</code> array.</li>
          <li>Use <code>MessagePart</code> for one standalone typed segment, or when that segment needs streaming.</li>
          <li>Use <code>ActivityGroup</code> for operational status blocks around the conversation.</li>
          <li>Use <code>CodeBlock</code> directly when the content is docs-oriented rather than message-oriented.</li>
        </ol>

        <DocsHeading id="component-map">Component map</DocsHeading>
        <div className="docs-card-grid">
          <Link to="/docs/components/message-bubble" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Message Bubble</h3>
              <p className="docs-card-desc">Outer chat container for simple sender-aligned messages.</p>
            </Card>
          </Link>
          <Link to="/docs/components/message-group" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Message Group</h3>
              <p className="docs-card-desc">Structured assistant response built from a typed parts array.</p>
            </Card>
          </Link>
          <Link to="/docs/components/message-part" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Message Part</h3>
              <p className="docs-card-desc">Standalone typed message segment with markdown, code, tool, thinking, error, and streaming support.</p>
            </Card>
          </Link>
          <Link to="/docs/components/activity-group" style={{ textDecoration: 'none' }}>
            <Card variant="outlined" shape="rounded" size="md" clickable>
              <h3 className="docs-card-title">Activity Group</h3>
              <p className="docs-card-desc">Grouped status and tool progress surface adjacent to messages.</p>
            </Card>
          </Link>
        </div>
      </section>

      <div className="docs-page-nav">
        <Link to="/docs/components">
          <Button label="Components" variant="ghost" size="sm" iconLeading="arrow-left" />
        </Link>
        <Link to="/docs/components/message-bubble">
          <Button label="Message Bubble" variant="ghost" size="sm" iconTrailing="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
