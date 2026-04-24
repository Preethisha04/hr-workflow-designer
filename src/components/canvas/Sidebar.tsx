import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { generateNodeId } from '../../utils/graphutils';

interface NodeDef {
  type: string;
  icon: string;
  label: string;
  description: string;
  color: string;
  defaultData: Record<string, unknown>;
}

const NODE_TYPES: NodeDef[] = [
  {
    type: 'start',
    icon: '🚀',
    label: 'Start',
    description: 'Entry point of the workflow',
    color: '#10b981',
    defaultData: { label: 'Start' },
  },
  {
    type: 'task',
    icon: '📋',
    label: 'Task',
    description: 'Assign a task to someone',
    color: '#3b82f6',
    defaultData: { label: 'New Task', priority: 'medium' },
  },
  {
    type: 'approval',
    icon: '🔐',
    label: 'Approval',
    description: 'Require sign-off from a role',
    color: '#8b5cf6',
    defaultData: { label: 'Approval', approverRole: 'Manager' },
  },
  {
    type: 'automation',
    icon: '⚡',
    label: 'Automation',
    description: 'Trigger an automated action',
    color: '#f59e0b',
    defaultData: { label: 'Automation' },
  },
  {
    type: 'condition',
    icon: '🔀',
    label: 'Condition',
    description: 'Branch based on a condition',
    color: '#06b6d4',
    defaultData: { label: 'Condition' },
  },
  {
    type: 'end',
    icon: '🏁',
    label: 'End',
    description: 'Completion of the workflow',
    color: '#f43f5e',
    defaultData: { label: 'End' },
  },
];

const TEMPLATES = [
  {
    name: 'Employee Onboarding',
    icon: '👋',
    nodes: [
      { type: 'start', position: { x: 250, y: 50 }, data: { label: 'New Hire Starts' } },
      { type: 'task', position: { x: 250, y: 180 }, data: { label: 'Collect Documents', assignee: 'HR Manager', priority: 'high' } },
      { type: 'approval', position: { x: 250, y: 310 }, data: { label: 'Document Review', approverRole: 'HRBP' } },
      { type: 'automation', position: { x: 250, y: 440 }, data: { label: 'Send Welcome Email', actionId: 'send_email' } },
      { type: 'task', position: { x: 250, y: 570 }, data: { label: 'IT Setup', assignee: 'IT Department', priority: 'medium' } },
      { type: 'end', position: { x: 250, y: 700 }, data: { label: 'Onboarding Complete!' } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
    ],
  },
  {
    name: 'Leave Approval',
    icon: '🏖️',
    nodes: [
      { type: 'start', position: { x: 250, y: 50 }, data: { label: 'Leave Request' } },
      { type: 'condition', position: { x: 250, y: 190 }, data: { label: 'Days > 5?', field: 'days', operator: 'greater_than', value: '5' } },
      { type: 'approval', position: { x: 100, y: 350 }, data: { label: 'Manager Approval', approverRole: 'Manager' } },
      { type: 'approval', position: { x: 400, y: 350 }, data: { label: 'Director Approval', approverRole: 'Director' } },
      { type: 'automation', position: { x: 250, y: 490 }, data: { label: 'Update HRIS', actionId: 'update_hris' } },
      { type: 'end', position: { x: 250, y: 620 }, data: { label: 'Leave Approved' } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 4 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
    ],
  },
  {
    name: 'Performance Review',
    icon: '📊',
    nodes: [
      { type: 'start', position: { x: 250, y: 50 }, data: { label: 'Review Cycle Start' } },
      { type: 'task', position: { x: 250, y: 180 }, data: { label: 'Self Assessment', assignee: 'Employee', priority: 'medium' } },
      { type: 'task', position: { x: 250, y: 310 }, data: { label: 'Manager Review', assignee: 'Manager', priority: 'high' } },
      { type: 'approval', position: { x: 250, y: 440 }, data: { label: 'HR Sign-off', approverRole: 'HRBP' } },
      { type: 'automation', position: { x: 250, y: 570 }, data: { label: 'Notify Employee', actionId: 'send_email' } },
      { type: 'end', position: { x: 250, y: 700 }, data: { label: 'Review Complete' } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
    ],
  },
];

export default function Sidebar() {
  const { addNode, setNodes, setEdges, clearCanvas } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState<'nodes' | 'templates'>('nodes');
  const [search, setSearch] = useState('');

  const filteredNodes = NODE_TYPES.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, nodeDef: NodeDef) => {
    e.dataTransfer.setData('application/reactflow-type', nodeDef.type);
    e.dataTransfer.setData('application/reactflow-data', JSON.stringify(nodeDef.defaultData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeDef: NodeDef) => {
    const id = generateNodeId(nodeDef.type);
    addNode({
      id,
      type: nodeDef.type,
      position: {
        x: 300 + Math.random() * 100,
        y: 200 + Math.random() * 100,
      },
      data: { ...nodeDef.defaultData },
    });
  };

  const loadTemplate = (tpl: typeof TEMPLATES[0]) => {
    clearCanvas();
    const ids = tpl.nodes.map((_, i) => generateNodeId(tpl.nodes[i].type));
    const nodes = tpl.nodes.map((n, i) => ({
      id: ids[i],
      type: n.type,
      position: n.position,
      data: { ...n.data },
    }));
    const edges = tpl.edges.map((e, i) => ({
      id: `e-${i}`,
      source: ids[e.source],
      target: ids[e.target],
    }));
    setNodes(nodes);
    setEdges(edges);
  };

  return (
    <div
      className="flex flex-col h-screen border-r"
      style={{
        width: 260,
        minWidth: 260,
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo Header */}
      <div
        className="px-4 py-4 border-b flex items-center gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
        >
          🔧
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">HR Workflow</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Designer
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {(['nodes', 'templates'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2.5 text-xs font-semibold capitalize transition-all"
            style={{
              color: activeTab === tab ? '#3b82f6' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'nodes' && (
        <>
          {/* Search */}
          <div className="px-3 pt-3">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nodes..."
                className="w-full text-xs pl-7 pr-3 py-2 rounded-lg outline-none"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Drag or click to add
          </p>

          {/* Node List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {filteredNodes.map((nodeDef) => (
              <div
                key={nodeDef.type}
                draggable
                onDragStart={(e) => handleDragStart(e, nodeDef)}
                onClick={() => handleAddNode(nodeDef)}
                className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all group"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = nodeDef.color;
                  (e.currentTarget as HTMLElement).style.background = `${nodeDef.color}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${nodeDef.color}25`, border: `1px solid ${nodeDef.color}50` }}
                >
                  {nodeDef.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{nodeDef.label}</p>
                  <p className="text-xs leading-snug truncate" style={{ color: 'var(--text-muted)' }}>
                    {nodeDef.description}
                  </p>
                </div>
                <span className="text-xs opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: nodeDef.color }}>
                  +
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Load a pre-built HR workflow to get started quickly.
          </p>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              onClick={() => loadTemplate(tpl)}
              className="w-full text-left p-3 rounded-xl transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.5)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{tpl.icon}</span>
                <p className="text-sm font-semibold text-white">{tpl.name}</p>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {tpl.nodes.length} nodes · {tpl.edges.length} connections
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Drag nodes onto canvas
        </p>
      </div>
    </div>
  );
}
