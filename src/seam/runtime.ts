import {
  formatSeamPacket,
  resolveSeamContext,
  type SeamContextPacket,
  type SeamTrigger,
} from './reader.ts';

export type SeamRuntimeEventKind = 'session-start' | 'file-open' | 'task-request';

export interface SeamRuntimeEvent {
  kind: SeamRuntimeEventKind;
  value?: string;
}

export interface SeamAdapterPacket {
  event: SeamRuntimeEvent;
  packet: SeamContextPacket;
  text: string;
}

function toTrigger(event: SeamRuntimeEvent): SeamTrigger | null {
  switch (event.kind) {
    case 'session-start':
      return {
        kind: 'session',
        value: 'repo-session',
      };
    case 'file-open':
      if (!event.value) return null;
      return {
        kind: 'file',
        value: event.value,
      };
    case 'task-request':
      if (!event.value) return null;
      return {
        kind: 'task',
        value: event.value,
      };
  }
}

export function resolveSeamRuntimeEvent(event: SeamRuntimeEvent, maxPings = 4): SeamAdapterPacket | null {
  const trigger = toTrigger(event);
  if (!trigger) {
    return null;
  }

  const packet = resolveSeamContext(trigger);
  const text = formatSeamPacket(packet, maxPings);
  if (!text) {
    return null;
  }

  return {
    event,
    packet,
    text,
  };
}
