import { seamGraph, type SeamAuthority, type SeamNode, type SeamNodeType } from './graph.ts';

export type SeamTriggerKind = 'session' | 'file' | 'task';

export interface SeamTrigger {
  kind: SeamTriggerKind;
  value: string;
  label?: string;
  description?: string;
}

export interface SeamPing {
  node: SeamNode;
  reason: string;
  matches: string[];
}

export interface SeamContextPacket {
  title: string;
  summary: string;
  pings: SeamPing[];
}

const authorityRank: Record<SeamAuthority, number> = {
  canonical: 0,
  illustrative: 1,
  tentative: 2,
  legacy: 3,
};

const typeRank: Record<SeamNodeType, number> = {
  warning: 0,
  constraint: 1,
  definition: 2,
  procedure: 3,
  example: 4,
  context: 5,
};

export const seamNodes: SeamNode[] = seamGraph.nodes;

function matchesWatchPattern(filePath: string, pattern: string): boolean {
  if (pattern.endsWith('/**')) {
    return filePath.startsWith(pattern.slice(0, -3));
  }
  return filePath === pattern;
}

function taskKeywordMatches(task: string, keyword: string): boolean {
  return task.includes(keyword.toLowerCase());
}

function sortPings(a: SeamPing, b: SeamPing): number {
  const authorityDelta = authorityRank[a.node.authority] - authorityRank[b.node.authority];
  if (authorityDelta !== 0) return authorityDelta;
  const typeDelta = typeRank[a.node.type] - typeRank[b.node.type];
  if (typeDelta !== 0) return typeDelta;
  return a.node.title.localeCompare(b.node.title);
}

function buildSessionPacket(): SeamContextPacket {
  const pings = seamNodes
    .filter((node) => node.authority === 'canonical' && node.type !== 'example')
    .map((node) => ({
      node,
      reason: 'Injected automatically at session start so the assistant begins with the repo’s non-negotiable context.',
      matches: [],
    }))
    .sort(sortPings);

  return {
    title: 'Session Context Packet',
    summary: 'A tiny repo bootstrap packet should hydrate the assistant with startup, versioning, generation, and message-system rules before it edits anything.',
    pings,
  };
}

function buildFilePacket(filePath: string): SeamContextPacket {
  const pings = seamNodes
    .map((node) => {
      const matches = node.watchFiles.filter((pattern) => matchesWatchPattern(filePath, pattern));
      if (matches.length === 0) return null;
      return {
        node,
        reason: `Triggered because ${filePath} is watched by this node.`,
        matches,
      } satisfies SeamPing;
    })
    .filter((ping): ping is SeamPing => ping !== null)
    .sort(sortPings);

  return {
    title: `File Context Packet — ${filePath}`,
    summary: 'Opening a file should quietly return only the constraints, warnings, procedures, and examples attached to that path.',
    pings,
  };
}

function buildTaskPacket(task: string): SeamContextPacket {
  const normalizedTask = task.toLowerCase();
  const pings = seamNodes
    .map((node) => {
      const matches = (node.taskKeywords ?? []).filter((keyword) => taskKeywordMatches(normalizedTask, keyword));
      if (matches.length === 0) return null;
      return {
        node,
        reason: 'Triggered because the task text overlaps this node’s semantic keywords.',
        matches,
      } satisfies SeamPing;
    })
    .filter((ping): ping is SeamPing => ping !== null)
    .sort(sortPings);

  return {
    title: 'Task Context Packet',
    summary: 'Task triggers should surface the smallest possible context packet: the rules and procedures relevant to the job, not the whole graph.',
    pings,
  };
}

export function resolveSeamContext(trigger: SeamTrigger): SeamContextPacket {
  switch (trigger.kind) {
    case 'session':
      return buildSessionPacket();
    case 'file':
      return buildFilePacket(trigger.value);
    case 'task':
      return buildTaskPacket(trigger.value);
  }
}

export function formatSeamPacket(packet: SeamContextPacket, maxPings = 4): string {
  const selected = packet.pings.slice(0, maxPings);
  if (selected.length === 0) {
    return '';
  }

  const lines = [`SEAM: ${packet.title}`, packet.summary, ''];

  for (const ping of selected) {
    lines.push(
      `- ${ping.node.title} [${ping.node.type} · ${ping.node.authority}]`,
      `  ${ping.node.summary}`,
    );

    if (ping.matches.length > 0) {
      lines.push(`  matched by: ${ping.matches.join(', ')}`);
    }
  }

  return lines.join('\n');
}
