import seamGraphData from '../../.seam/graph.json' with { type: 'json' };

export type SeamNodeType = 'constraint' | 'definition' | 'procedure' | 'example' | 'warning' | 'context';
export type SeamAuthority = 'canonical' | 'illustrative' | 'tentative' | 'legacy';
export type SeamEdgeRel = 'illustrates' | 'supersedes' | 'depends-on' | 'contradicts' | 'defines';

export interface SeamNode {
  id: string;
  title: string;
  type: SeamNodeType;
  authority: SeamAuthority;
  summary: string;
  payload: string;
  watchFiles: string[];
  taskKeywords?: string[];
}

export interface SeamEdge {
  from: string;
  to: string;
  rel: SeamEdgeRel;
}

export interface SeamGraph {
  $schema?: string;
  seamVersion: string;
  nodes: SeamNode[];
  edges: SeamEdge[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function assertSeamGraph(value: unknown): asserts value is SeamGraph {
  if (!isObject(value)) {
    throw new Error('Invalid SEAM graph: expected an object.');
  }

  if (typeof value.seamVersion !== 'string') {
    throw new Error('Invalid SEAM graph: missing seamVersion.');
  }

  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)) {
    throw new Error('Invalid SEAM graph: nodes and edges must be arrays.');
  }
}

assertSeamGraph(seamGraphData);

export const seamGraph: SeamGraph = seamGraphData;
