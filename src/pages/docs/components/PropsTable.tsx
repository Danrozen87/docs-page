export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface EventDoc {
  name: string;
  detail: string;
  description: string;
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <table className="docs-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((p) => (
          <tr key={p.name}>
            <td>
              <code>{p.name}</code>
              {p.required && <span className="docs-required">*</span>}
            </td>
            <td><code className="docs-type">{p.type}</code></td>
            <td>{p.default ? <code>{p.default}</code> : <span className="docs-muted">—</span>}</td>
            <td>{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EventsTable({ events }: { events: EventDoc[] }) {
  return (
    <table className="docs-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Detail Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.name}>
            <td><code>{e.name}</code></td>
            <td><code className="docs-type">{e.detail}</code></td>
            <td>{e.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PartsTable({ parts }: { parts: string[] }) {
  return (
    <div className="docs-parts">
      {parts.map((part) => (
        <code key={part} className="docs-part-tag">{part}</code>
      ))}
    </div>
  );
}
