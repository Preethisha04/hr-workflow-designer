import Sidebar from './components/canvas/Sidebar';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeFormPanel from './components/canvas/NodeFormPanel';
import SimulationPanel from './components/canvas/SimulationPanel';
import Toolbar from './components/canvas/Toolbar';

function App() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Left: Node Palette */}
      <Sidebar />

      {/* Center: Canvas + Toolbar */}
      <div className="flex flex-col flex-1 min-w-0">
        <Toolbar />
        <WorkflowCanvas />
      </div>

      {/* Right: Config + Simulation */}
      <div className="flex">
        <NodeFormPanel />
        <SimulationPanel />
      </div>
    </div>
  );
}

export default App;
