import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../utils/graphutils';
import { simulateWorkflow } from '../../services/api/simulation';
import type { SimulationLog } from '../../store/workflowStore';

const statusColors: Record<SimulationLog['status'], string> = {
  info: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#f43f5e',
};

const statusBg: Record<SimulationLog['status'], string> = {
  info: 'rgba(59,130,246,0.08)',
  success: 'rgba(16,185,129,0.08)',
  warning: 'rgba(245,158,11,0.08)',
  error: 'rgba(244,63,94,0.08)',
};

const nodeTypeColors: Record<string, string> = {
  start: '#10b981',
  task: '#3b82f6',
  approval: '#8b5cf6',
  automation: '#f59e0b',
  condition: '#06b6d4',
  end: '#f43f5e',
};

export default function SimulationPanel() {
  const {
    nodes,
    edges,
    simulationLogs,
    simulationStatus,
    addSimulationLog,
    setSimulationStatus,
    setActiveSimNodeId,
    clearSimulation,
  } = useWorkflowStore();

  const validationErrors = validateWorkflow(nodes, edges);
  const canRun = validationErrors.length === 0 && nodes.length > 0;

  const handleRun = async () => {
    clearSimulation();
    setSimulationStatus('running');

    try {
      await simulateWorkflow(
        nodes,
        edges,
        (log) => addSimulationLog(log),
        (id) => setActiveSimNodeId(id)
      );
      setSimulationStatus('success');
    } catch {
      setSimulationStatus('error');
    }
  };

  const isRunning = simulationStatus === 'running';

  return (
    <div
      className="flex flex-col h-screen border-l"
      style={{
        width: 300,
        minWidth: 300,
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">▶️</span>
          <p className="text-sm font-bold text-white">Simulation</p>
          {simulationStatus !== 'idle' && (
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                color:
                  simulationStatus === 'running'
                    ? '#f59e0b'
                    : simulationStatus === 'success'
                    ? '#10b981'
                    : '#f43f5e',
                background:
                  simulationStatus === 'running'
                    ? 'rgba(245,158,11,0.15)'
                    : simulationStatus === 'success'
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(244,63,94,0.15)',
              }}
            >
              {simulationStatus === 'running'
                ? '● Running…'
                : simulationStatus === 'success'
                ? '✓ Done'
                : '✗ Error'}
            </span>
          )}
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div
            className="mb-3 p-2.5 rounded-lg"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
          >
            {validationErrors.map((err, i) => (
              <p key={i} className="text-xs" style={{ color: '#f43f5e' }}>
                ⚠ {err}
              </p>
            ))}
          </div>
        )}

        {/* Run / Clear buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!canRun || isRunning}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: canRun && !isRunning ? 'rgba(16,185,129,0.2)' : 'rgba(99,115,130,0.1)',
              border: `1px solid ${canRun && !isRunning ? 'rgba(16,185,129,0.5)' : 'rgba(99,115,130,0.2)'}`,
              color: canRun && !isRunning ? '#10b981' : 'var(--text-muted)',
              cursor: canRun && !isRunning ? 'pointer' : 'not-allowed',
            }}
          >
            {isRunning ? (
              <>
                <span className="animate-spin-slow inline-block">⚙</span> Running…
              </>
            ) : (
              '▶ Run Workflow'
            )}
          </button>

          {simulationLogs.length > 0 && (
            <button
              onClick={clearSimulation}
              disabled={isRunning}
              className="px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: 'rgba(99,115,130,0.1)',
                border: '1px solid rgba(99,115,130,0.2)',
                color: 'var(--text-muted)',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Workflow stats */}
      {nodes.length > 0 && (
        <div
          className="px-4 py-3 border-b grid grid-cols-3 gap-2"
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            { label: 'Nodes', value: nodes.length, color: '#3b82f6' },
            { label: 'Edges', value: edges.length, color: '#8b5cf6' },
            { label: 'Steps', value: simulationLogs.length, color: '#10b981' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-2 rounded-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Node breakdown */}
      {nodes.length > 0 && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Node Breakdown
          </p>
          <div className="space-y-1.5">
            {Object.entries(
              nodes.reduce((acc, n) => {
                acc[n.type ?? 'unknown'] = (acc[n.type ?? 'unknown'] ?? 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: nodeTypeColors[type] ?? '#94a3b8' }}
                />
                <span className="text-xs capitalize flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {type}
                </span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ color: nodeTypeColors[type], background: `${nodeTypeColors[type]}18` }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulation Logs */}
      <div className="flex-1 overflow-y-auto">
        {simulationLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
            <p className="text-3xl mb-3 opacity-20">📋</p>
            <p className="text-sm opacity-40">No logs yet</p>
            <p className="text-xs opacity-25 mt-1">Run the workflow to see execution logs</p>
          </div>
        ) : (
          <div className="px-3 py-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest px-1 mb-2" style={{ color: 'var(--text-muted)' }}>
              Execution Log
            </p>
            {simulationLogs.map((log, idx) => (
              <div
                key={log.id}
                className="log-item p-2.5 rounded-lg"
                style={{
                  background: statusBg[log.status],
                  border: `1px solid ${statusColors[log.status]}30`,
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <p className="text-xs leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {log.message}
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                  {log.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}

            {simulationStatus === 'success' && (
              <div
                className="p-3 rounded-lg text-center mt-2"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <p className="text-sm font-bold" style={{ color: '#10b981' }}>
                  ✅ Simulation Complete
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {simulationLogs.length} steps executed
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
