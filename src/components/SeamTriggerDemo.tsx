import { useState } from 'react';
import { Badge, Button, Card } from '@colletdev/react';
import {
  resolveSeamContext,
  seamFileTriggers,
  seamSessionTrigger,
  seamTaskTriggers,
  type SeamTrigger,
} from '../docs/seamDemo';

export function SeamTriggerDemo() {
  const [trigger, setTrigger] = useState<SeamTrigger>(seamSessionTrigger);
  const packet = resolveSeamContext(trigger);

  return (
    <div className="seam-demo">
      <div className="seam-demo-toolbar">
        <div className="seam-demo-toolbar-group">
          <p className="seam-demo-label">Session trigger</p>
          <Button
            label={seamSessionTrigger.label}
            variant={trigger.kind === 'session' ? 'filled' : 'outline'}
            intent={trigger.kind === 'session' ? 'primary' : 'neutral'}
            size="sm"
            onClick={() => setTrigger(seamSessionTrigger)}
          />
        </div>

        <div className="seam-demo-toolbar-group">
          <p className="seam-demo-label">File-open triggers</p>
          <div className="seam-demo-chip-row">
            {seamFileTriggers.map((fileTrigger) => (
              <Button
                key={fileTrigger.value}
                label={fileTrigger.label}
                variant={trigger.value === fileTrigger.value ? 'filled' : 'outline'}
                intent={trigger.value === fileTrigger.value ? 'primary' : 'neutral'}
                size="sm"
                onClick={() => setTrigger(fileTrigger)}
              />
            ))}
          </div>
        </div>

        <div className="seam-demo-toolbar-group">
          <p className="seam-demo-label">Task triggers</p>
          <div className="seam-demo-chip-row">
            {seamTaskTriggers.map((taskTrigger) => (
              <Button
                key={taskTrigger.label}
                label={taskTrigger.label}
                variant={trigger.label === taskTrigger.label ? 'filled' : 'outline'}
                intent={trigger.label === taskTrigger.label ? 'primary' : 'neutral'}
                size="sm"
                onClick={() => setTrigger(taskTrigger)}
              />
            ))}
          </div>
        </div>
      </div>

      <Card variant="outlined" shape="rounded" size="md">
        <div className="seam-demo-packet">
          <div className="seam-demo-packet-header">
            <div>
              <p className="seam-demo-label">Active trigger</p>
              <h3 className="seam-demo-title">{trigger.label}</h3>
              <p className="seam-demo-description">{trigger.description}</p>
            </div>
            <Badge label={trigger.kind} variant="filled" intent="neutral" size="xs" shape="pill" />
          </div>

          <div className="seam-demo-summary">
            <p className="seam-demo-label">Injected context packet</p>
            <p>{packet.summary}</p>
          </div>

          <div className="seam-demo-results">
            {packet.pings.map((ping) => (
              <Card key={ping.node.id} variant="outlined" shape="rounded" size="sm">
                <div className="seam-ping-card">
                  <div className="seam-ping-card-header">
                    <div>
                      <h4 className="seam-ping-title">{ping.node.title}</h4>
                      <p className="seam-ping-id">{ping.node.id}</p>
                    </div>
                    <div className="seam-ping-badges">
                      <Badge label={ping.node.type} variant="outline" intent="primary" size="xs" shape="pill" />
                      <Badge label={ping.node.authority} variant="filled" intent="neutral" size="xs" shape="pill" />
                    </div>
                  </div>
                  <p className="seam-ping-summary">{ping.node.summary}</p>
                  <p className="seam-ping-reason">{ping.reason}</p>
                  {ping.matches.length > 0 && (
                    <div className="seam-ping-matches">
                      <span className="seam-demo-label">Matched by</span>
                      <code>{ping.matches.join(', ')}</code>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
