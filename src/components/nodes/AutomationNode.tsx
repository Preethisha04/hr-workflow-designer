import type { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

export default function AutomationNode(props: NodeProps) {
  const data = props.data as Record<string, unknown>;

  return (
    <BaseNode
      {...props}
      icon="⚡"
      title="Automation"
      color="rgba(245, 158, 11, 0.7)"
      borderColor="rgba(245, 158, 11, 0.5)"
    >
      {data.actionId ? (
        <p className="text-xs text-slate-400 mt-1 font-mono">
          ▶ {String(data.actionId)}
        </p>
      ) : null}
    </BaseNode>
  );
}
