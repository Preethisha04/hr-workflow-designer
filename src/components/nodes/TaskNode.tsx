import type { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

const priorityColors: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f43f5e',
};

export default function TaskNode(props: NodeProps) {
  const data = props.data as Record<string, unknown>;
  const priority = data.priority as string;
  const assignee = data.assignee as string;

  return (
    <BaseNode
      {...props}
      icon="📋"
      title="Task"
      color="rgba(59, 130, 246, 0.7)"
      borderColor="rgba(59, 130, 246, 0.5)"
    >
      {(assignee || priority) ? (
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {assignee ? (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span>👤</span> {assignee}
            </span>
          ) : null}
          {priority ? (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{
                color: priorityColors[priority] || '#94a3b8',
                background: `${priorityColors[priority] ?? '#94a3b8'}22`,
                border: `1px solid ${priorityColors[priority] ?? '#94a3b8'}44`,
              }}
            >
              {priority}
            </span>
          ) : null}
        </div>
      ) : null}
      {data.dueDate ? (
        <p className="text-xs text-slate-500 mt-1">📅 {String(data.dueDate)}</p>
      ) : null}
    </BaseNode>
  );
}
