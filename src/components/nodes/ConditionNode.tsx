import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';

export default function ConditionNode(props: NodeProps) {
  const { id, data, selected } = props;
  const { activeSimNodeId } = useWorkflowStore();
  const isActive = activeSimNodeId === id;
  const nodeData = data as Record<string, unknown>;

  return (
    <div
      style={{
        background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(26, 39, 64, 0.95)',
        borderColor: isActive ? '#06b6d4' : selected ? '#67e8f9' : 'rgba(6, 182, 212, 0.5)',
        borderWidth: isActive || selected ? 2 : 1,
        boxShadow: isActive
          ? '0 0 20px rgba(6, 182, 212, 0.5)'
          : selected
          ? '0 0 12px rgba(6,182,212,0.4)'
          : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        transform: 'rotate(45deg)',
        width: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="border rounded-lg"
    >
      <div style={{ transform: 'rotate(-45deg)', textAlign: 'center', padding: '4px' }}>
        <p className="text-lg leading-none mb-1">🔀</p>
        <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Condition</p>
        <p className="text-xs text-slate-300 mt-0.5 leading-tight max-w-[80px] truncate">
          {(nodeData.label as string) || 'Check'}
        </p>
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -6 }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -6 }} id="yes" />
      <Handle type="source" position={Position.Right} style={{ right: -6 }} id="no" />
    </div>
  );
}
