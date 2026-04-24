import type { Node, Edge } from 'reactflow';

export function validateWorkflow(nodes: Node[], edges: Edge[]): string[] {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Workflow is empty. Add at least a Start and End node.');
    return errors;
  }

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
  if (startNodes.length > 1) errors.push('Workflow must have only one Start node.');
  if (endNodes.length === 0) errors.push('Workflow must have at least one End node.');

  if (nodes.length > 1 && edges.length === 0) {
    errors.push('Nodes are not connected. Add edges between nodes.');
  }

  // Check for disconnected nodes
  if (edges.length > 0) {
    const connectedIds = new Set<string>();
    edges.forEach((e) => {
      connectedIds.add(e.source);
      connectedIds.add(e.target);
    });
    nodes.forEach((n) => {
      if (!connectedIds.has(n.id)) {
        const label = (n.data as Record<string, unknown>)?.label as string || n.type;
        errors.push(`Node "${label}" (${n.type}) is not connected to the workflow.`);
      }
    });
  }

  return errors;
}

export function serializeWorkflow(nodes: Node[], edges: Edge[]) {
  return {
    version: '1.0',
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
    })),
  };
}

export function generateNodeId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
