import { useCallback, useEffect, useState } from 'react';
import { getMyImpact } from '../api/coreClient';

export function useMyImpact(initialPeriod = 'year') {
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (nextPeriod = period) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getMyImpact(nextPeriod);
      setData(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load your impact report.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load(period);
  }, [period, load]);

  return {
    data,
    loading,
    error,
    period,
    setPeriod,
    reload: () => load(period),
  };
}
