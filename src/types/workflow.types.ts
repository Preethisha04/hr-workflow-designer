export type NodeType = 'start' | 'task' | 'approval' | 'automation' | 'condition' | 'end';

export interface BaseNodeData {
  label: string;
}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole?: string;
  threshold?: number;
  escalationDays?: number;
}

export interface AutomationNodeData extends BaseNodeData {
  actionId?: string;
  params?: Record<string, string>;
}

export interface ConditionNodeData extends BaseNodeData {
  field?: string;
  operator?: string;
  value?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  data: TaskNodeData | ApprovalNodeData | AutomationNodeData | ConditionNodeData | BaseNodeData;
  position: { x: number; y: number };
}
