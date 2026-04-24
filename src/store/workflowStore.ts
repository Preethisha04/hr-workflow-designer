import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

export type SimulationStatus = 'idle' | 'running' | 'success' | 'error';

export interface SimulationLog {
  id: string;
  nodeId: string;
  nodeType: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  simulationLogs: SimulationLog[];
  simulationStatus: SimulationStatus;
  activeSimNodeId: string | null;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  setSelectedNode: (node: Node | null) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  clearCanvas: () => void;

  setSimulationLogs: (logs: SimulationLog[]) => void;
  addSimulationLog: (log: SimulationLog) => void;
  setSimulationStatus: (status: SimulationStatus) => void;
  setActiveSimNodeId: (id: string | null) => void;
  clearSimulation: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  simulationLogs: [],
  simulationStatus: 'idle',
  activeSimNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  updateNodeData: (id, newData) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...newData } } : n
      ),
      selectedNode:
        state.selectedNode?.id === id
          ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...newData } }
          : state.selectedNode,
    })),

  clearCanvas: () =>
    set({ nodes: [], edges: [], selectedNode: null }),

  setSimulationLogs: (logs) => set({ simulationLogs: logs }),
  addSimulationLog: (log) =>
    set((state) => ({ simulationLogs: [...state.simulationLogs, log] })),
  setSimulationStatus: (status) => set({ simulationStatus: status }),
  setActiveSimNodeId: (id) => set({ activeSimNodeId: id }),
  clearSimulation: () =>
    set({ simulationLogs: [], simulationStatus: 'idle', activeSimNodeId: null }),
}));
