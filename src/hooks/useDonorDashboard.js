import { useCallback, useEffect, useState } from 'react';
import { getDonorDashboard } from '../api/coreClient';

export function useDonorDashboard(initialPeriod = 'year') {
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (nextPeriod = period) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getDonorDashboard(nextPeriod);
      setData(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load your dashboard.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load(period);
  }, [period, load]);

  const changePeriod = (value) => {
    setPeriod(value);
  };

  return {
    data,
    loading,
    error,
    period,
    setPeriod: changePeriod,
    reload: () => load(period),
  };
}
