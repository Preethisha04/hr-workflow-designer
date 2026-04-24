import { Handle, Position, type NodeProps } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';

interface BaseNodeProps extends NodeProps {
  icon: string;
  title: string;
  color: string;
  borderColor: string;
  showSource?: boolean;
  showTarget?: boolean;
  children?: React.ReactNode;
}

export default function BaseNode({
  id,
  data,
  selected,
  icon,
  title,
  color,
  borderColor,
  showSource = true,
  showTarget = true,
  children,
}: BaseNodeProps) {
  const { activeSimNodeId } = useWorkflowStore();
  const isActive = activeSimNodeId === id;
  const nodeData = data as Record<string, unknown>;

  return (
    <div
      style={{
        background: isActive
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(26, 39, 64, 0.95)',
        borderColor: isActive ? '#3b82f6' : selected ? '#60a5fa' : borderColor,
        borderWidth: isActive || selected ? 2 : 1,
        boxShadow: isActive
          ? '0 0 20px rgba(59, 130, 246, 0.5), 0 4px 20px rgba(0,0,0,0.5)'
          : selected
          ? `0 0 12px ${borderColor}40, 0 4px 16px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        animation: 'nodeAppear 0.25s ease-out',
      }}
      className="rounded-xl border min-w-[180px] max-w-[240px] overflow-hidden"
    >
      {/* Header */}
      <div
        style={{ background: color, opacity: 0.9 }}
        className="px-3 py-2 flex items-center gap-2"
      >
        <span className="text-base leading-none">{icon}</span>
        <span className="text-xs font-semibold tracking-wide text-white uppercase opacity-90">
          {title}
        </span>
        {isActive && (
          <span className="ml-auto text-xs animate-pulse">●</span>
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-slate-100 leading-snug mb-1">
          {(nodeData.label as string) || 'Untitled'}
        </p>
        {children}
      </div>

      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ top: -5 }}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ bottom: -5 }}
        />
      )}
    </div>
  );
}
