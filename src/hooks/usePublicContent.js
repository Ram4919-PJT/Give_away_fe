import { useCallback, useEffect, useState } from 'react';
import { getPublicPrograms, getPublicStats } from '../api/coreClient';

export function usePublicContent() {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [programRows, statRows] = await Promise.all([
        getPublicPrograms().catch(() => []),
        getPublicStats().catch(() => null),
      ]);
      setPrograms(Array.isArray(programRows) ? programRows : []);
      setStats(statRows);
    } catch (err) {
      setError(err?.message || 'Unable to load public content.');
      setPrograms([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { programs, stats, loading, error, reload: load };
}
