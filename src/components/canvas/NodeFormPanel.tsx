import { useWorkflowStore } from '../../store/workflowStore';
import { nodeFormSchema } from '../../config/nodeFormSchema';
import type { FieldConfig } from '../../types/form.types';
import { useAutomations } from '../../hooks/useAutomations';

const nodeColors: Record<string, string> = {
  start: '#10b981',
  task: '#3b82f6',
  approval: '#8b5cf6',
  automation: '#f59e0b',
  condition: '#06b6d4',
  end: '#f43f5e',
};

const nodeIcons: Record<string, string> = {
  start: '🚀',
  task: '📋',
  approval: '🔐',
  automation: '⚡',
  condition: '🔀',
  end: '🏁',
};

export default function NodeFormPanel() {
  const { selectedNode, updateNodeData, removeNode } = useWorkflowStore();
  const { actions } = useAutomations();

  if (!selectedNode) {
    return (
      <div
        className="flex flex-col h-screen border-l items-center justify-center"
        style={{
          width: 280,
          minWidth: 280,
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="text-center px-6">
          <p className="text-3xl mb-3 opacity-30">🖱️</p>
          <p className="text-sm font-medium opacity-40" style={{ color: 'var(--text-primary)' }}>
            Select a node
          </p>
          <p className="text-xs mt-1 opacity-30" style={{ color: 'var(--text-secondary)' }}>
            Click any node on the canvas to configure it
          </p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type as string;
  const schema = nodeFormSchema[nodeType] ?? [];
  const accentColor = nodeColors[nodeType] ?? '#3b82f6';
  const icon = nodeIcons[nodeType] ?? '🔷';
  const data = selectedNode.data as Record<string, unknown>;

  const handleChange = (name: string, value: unknown) => {
    updateNodeData(selectedNode.id, { [name]: value });
  };

  const getSelectOptions = (field: FieldConfig): string[] => {
    if (nodeType === 'automation' && field.name === 'actionId') {
      return actions.map((a) => a.id);
    }
    return field.options ?? [];
  };

  const getOptionLabel = (field: FieldConfig, opt: string): string => {
    if (nodeType === 'automation' && field.name === 'actionId') {
      return actions.find((a) => a.id === opt)?.label ?? opt;
    }
    return opt;
  };

  const selectedAction =
    nodeType === 'automation' && data.actionId
      ? actions.find((a) => a.id === (data.actionId as string))
      : null;

  return (
    <div
      className="flex flex-col h-screen border-l animate-slideInRight"
      style={{
        width: 280,
        minWidth: 280,
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-4 border-b flex items-center gap-3"
        style={{ borderColor: 'var(--border)', borderLeft: `3px solid ${accentColor}` }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
            {nodeType} node
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
            {selectedNode.id}
          </p>
        </div>
        <button
          onClick={() => removeNode(selectedNode.id)}
          className="text-xs px-2 py-1 rounded transition-all"
          style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.1)';
          }}
        >
          🗑️
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {schema.map((field: FieldConfig) => (
          <div key={field.name}>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              {field.label}
              {field.required && <span style={{ color: '#f43f5e' }}> *</span>}
            </label>

            {field.type === 'text' && (
              <input
                className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                placeholder={field.placeholder}
                value={(data[field.name] as string) ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                rows={3}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all resize-none"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                placeholder={field.placeholder}
                value={(data[field.name] as string) ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                placeholder={field.placeholder}
                value={(data[field.name] as number) ?? ''}
                onChange={(e) => handleChange(field.name, Number(e.target.value))}
                onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            )}

            {field.type === 'date' && (
              <input
                type="date"
                className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  colorScheme: 'dark',
                }}
                value={(data[field.name] as string) ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            )}

            {field.type === 'select' && (
              <select
                className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all cursor-pointer"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  colorScheme: 'dark',
                }}
                value={(data[field.name] as string) ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <option value="">-- Select --</option>
                {getSelectOptions(field).map((opt) => (
                  <option key={opt} value={opt}>
                    {getOptionLabel(field, opt)}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Dynamic automation params */}
        {selectedAction && (
          <div>
            <div
              className="h-px my-2"
              style={{ background: 'var(--border)' }}
            />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
              Action Parameters
            </p>
            <div className="space-y-3">
              {selectedAction.params.map((param) => (
                <div key={param}>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                    {param}
                  </label>
                  <input
                    className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder={`Enter ${param}...`}
                    value={((data.params as Record<string, string>)?.[param]) ?? ''}
                    onChange={(e) =>
                      handleChange('params', {
                        ...((data.params as Record<string, string>) ?? {}),
                        [param]: e.target.value,
                      })
                    }
                    onFocus={(ev) => { ev.currentTarget.style.borderColor = accentColor; }}
                    onBlur={(ev) => { ev.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>Delete</kbd> to remove selected node
        </p>
      </div>
    </div>
  );
}
