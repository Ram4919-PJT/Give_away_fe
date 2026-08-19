import { useCallback, useEffect, useState } from 'react';
import { getNgoDashboard } from '../api/coreClient';

export function useNgoDashboard(initialPeriod = 'month') {
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextPeriod = period) => {
    setLoading(true);
    setError('');
    try {
      const payload = await getNgoDashboard(nextPeriod);
      setData(payload);
    } catch (err) {
      setError(err.message || 'Could not load dashboard');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load(period);
  }, [period, load]);

  const changePeriod = (next) => {
    setPeriod(next);
  };

  return {
    data,
    loading,
    error,
    period,
    changePeriod,
    reload: () => load(period),
  };
}
