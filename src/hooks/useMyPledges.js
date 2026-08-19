import { useCallback, useEffect, useState } from 'react';
import { getMyPledges } from '../api/coreClient';

export function useMyPledges({
  period = 'all',
  tab = 'all',
  category = 'all',
  page = 1,
  pageSize = 10,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getMyPledges({
        period,
        tab,
        category: category === 'all' ? '' : category,
        page,
        pageSize,
      });
      setData(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load your pledges.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period, tab, category, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
