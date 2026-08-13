import { useCallback, useEffect, useState } from 'react';
import { getMyRecurringGifts } from '../api/coreClient';

export function useMyRecurringGifts({
  period = 'all',
  tab = 'all',
  category = 'all',
  sort = 'next_payment',
  page = 1,
  pageSize = 8,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getMyRecurringGifts({
        period,
        tab,
        category: category === 'all' ? '' : category,
        sort,
        page,
        pageSize,
      });
      setData(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load your recurring gifts.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period, tab, category, sort, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
