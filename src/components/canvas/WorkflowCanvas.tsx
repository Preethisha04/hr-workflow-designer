import { useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { generateNodeId } from '../../utils/graphutils';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomationNode from '../nodes/AutomationNode';
import ConditionNode from '../nodes/ConditionNode';
import EndNode from '../nodes/EndNode';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automation: AutomationNode,
  condition: ConditionNode,
  end: EndNode,
};

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<unknown>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)),
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge({ ...params, animated: true }, edges)),
    [edges, setEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow-type');
      const rawData = e.dataTransfer.getData('application/reactflow-data');
      if (!type || !rawData) return;

      const data = JSON.parse(rawData);

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds || !reactFlowInstance) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const position = (reactFlowInstance as any).screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      addNode({
        id: generateNodeId(type),
        type,
        position,
        data,
      });
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="flex-1 h-full relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }}
      >
        <MiniMap
          nodeColor={(n) => {
            const colorMap: Record<string, string> = {
              start: '#10b981',
              task: '#3b82f6',
              approval: '#8b5cf6',
              automation: '#f59e0b',
              condition: '#06b6d4',
              end: '#f43f5e',
            };
            return colorMap[n.type ?? ''] ?? '#94a3b8';
          }}
          maskColor="rgba(15,25,35,0.8)"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        />
        <Controls />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(99,130,170,0.15)"
        />
      </ReactFlow>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        >
          <p className="text-5xl mb-4 opacity-30">🗂️</p>
          <p className="text-lg font-semibold opacity-40">Canvas is empty</p>
          <p className="text-sm opacity-30 mt-1">
            Drag nodes from the sidebar or load a template
          </p>
        </div>
      )}
    </div>
  );
}

// Need React for useState
import React from 'react';
