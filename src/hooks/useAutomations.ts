import { useEffect, useState } from 'react';
import { fetchAutomations, type AutomationAction } from '../services/api/automation';

export function useAutomations() {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations()
      .then(setActions)
      .finally(() => setLoading(false));
  }, []);

  return { actions, loading };
}
