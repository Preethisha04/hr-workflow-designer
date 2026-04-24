import { useWorkflowStore } from '../../store/workflowStore';
import { serializeWorkflow } from '../../utils/graphutils';

export default function Toolbar() {
  const { nodes, edges, clearCanvas } = useWorkflowStore();

  const handleExport = () => {
    const data = serializeWorkflow(nodes, edges);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.nodes && data.edges) {
            useWorkflowStore.getState().setNodes(data.nodes);
            useWorkflowStore.getState().setEdges(data.edges);
          }
        } catch {
          alert('Invalid workflow JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 border-b"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        minHeight: 48,
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest mr-2" style={{ color: 'var(--text-muted)' }}>
        Canvas
      </span>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={handleImport}
          className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.5)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          📥 Import
        </button>

        <button
          onClick={handleExport}
          disabled={nodes.length === 0}
          className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
          style={{
            background: nodes.length > 0 ? 'rgba(59,130,246,0.1)' : 'var(--bg-card)',
            border: `1px solid ${nodes.length > 0 ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
            color: nodes.length > 0 ? '#3b82f6' : 'var(--text-muted)',
            cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          📤 Export
        </button>

        <button
          onClick={() => { if (confirm('Clear the entire canvas?')) clearCanvas(); }}
          disabled={nodes.length === 0}
          className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: nodes.length > 0 ? '#f43f5e' : 'var(--text-muted)',
            cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => { if (nodes.length > 0) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.4)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}
