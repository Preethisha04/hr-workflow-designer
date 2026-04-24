import type { SimulationLog } from '../../store/workflowStore';
import type { Node, Edge } from 'reactflow';

function buildTopologicalOrder(nodes: Node[], edges: Edge[]): Node[] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  for (const n of nodes) {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  }
  for (const e of edges) {
    adj[e.source].push(e.target);
    inDegree[e.target]++;
  }

  const queue = nodes.filter((n) => inDegree[n.id] === 0);
  const order: Node[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of adj[node.id] ?? []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        const neighborNode = nodes.find((n) => n.id === neighbor);
        if (neighborNode) queue.push(neighborNode);
      }
    }
  }

  return order;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

export async function simulateWorkflow(
  nodes: Node[],
  edges: Edge[],
  onLog: (log: SimulationLog) => void,
  onActiveNode: (id: string | null) => void
): Promise<void> {
  const ordered = buildTopologicalOrder(nodes, edges);

  for (const node of ordered) {
    onActiveNode(node.id);
    await new Promise((r) => setTimeout(r, 700));

    const data = node.data as Record<string, unknown>;
    const label = (data?.label as string) || node.type || 'Node';

    switch (node.type) {
      case 'start':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'start',
          message: `🚀 Workflow started: "${label}"`,
          status: 'success',
          timestamp: new Date(),
        });
        break;

      case 'task':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'task',
          message: `📋 Task assigned: "${label}"${data.assignee ? ` → ${data.assignee}` : ''}${data.dueDate ? ` (due ${data.dueDate})` : ''}`,
          status: 'info',
          timestamp: new Date(),
        });
        if (data.priority === 'high') {
          onLog({
            id: makeId(),
            nodeId: node.id,
            nodeType: 'task',
            message: `⚠️ High priority task — expedited processing triggered`,
            status: 'warning',
            timestamp: new Date(),
          });
        }
        break;

      case 'approval':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'approval',
          message: `🔐 Approval required from ${data.approverRole || 'Manager'}`,
          status: 'info',
          timestamp: new Date(),
        });
        await new Promise((r) => setTimeout(r, 400));
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'approval',
          message: `✅ Approval granted by ${data.approverRole || 'Manager'}`,
          status: 'success',
          timestamp: new Date(),
        });
        break;

      case 'automation':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'automation',
          message: `⚡ Running automation: ${data.actionId || 'action'}`,
          status: 'info',
          timestamp: new Date(),
        });
        await new Promise((r) => setTimeout(r, 500));
        if (data.params && typeof data.params === 'object') {
          const paramStr = Object.entries(data.params as Record<string, string>)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ');
          onLog({
            id: makeId(),
            nodeId: node.id,
            nodeType: 'automation',
            message: `   ↳ Params: ${paramStr}`,
            status: 'info',
            timestamp: new Date(),
          });
        }
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'automation',
          message: `✅ Automation "${data.actionId}" completed successfully`,
          status: 'success',
          timestamp: new Date(),
        });
        break;

      case 'condition':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'condition',
          message: `🔀 Evaluating condition: ${data.field || 'field'} ${data.operator || '=='} "${data.value || ''}"`,
          status: 'info',
          timestamp: new Date(),
        });
        await new Promise((r) => setTimeout(r, 300));
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'condition',
          message: `↳ Condition resolved → TRUE branch taken`,
          status: 'success',
          timestamp: new Date(),
        });
        break;

      case 'end':
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: 'end',
          message: `🏁 Workflow completed: "${label}"`,
          status: 'success',
          timestamp: new Date(),
        });
        break;

      default:
        onLog({
          id: makeId(),
          nodeId: node.id,
          nodeType: node.type || 'unknown',
          message: `Processing node: ${label}`,
          status: 'info',
          timestamp: new Date(),
        });
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  onActiveNode(null);
}
