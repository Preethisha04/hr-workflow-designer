import type { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

export default function ApprovalNode(props: NodeProps) {
  const data = props.data as Record<string, unknown>;

  return (
    <BaseNode
      {...props}
      icon="🔐"
      title="Approval"
      color="rgba(139, 92, 246, 0.7)"
      borderColor="rgba(139, 92, 246, 0.5)"
    >
      {data.approverRole ? (
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <span>👔</span> {String(data.approverRole)}
        </p>
      ) : null}
      {data.escalationDays ? (
        <p className="text-xs text-slate-500 mt-0.5">
          ⏰ Escalate after {Number(data.escalationDays)}d
        </p>
      ) : null}
    </BaseNode>
  );
}
