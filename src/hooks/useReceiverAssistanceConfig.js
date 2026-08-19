import { useCallback, useEffect, useState } from 'react';
import { getReceiverAssistanceConfig } from '../api/configClient';
import { buildCategoriesFromConfig } from '../data/assistanceCategoryUi';

export function useReceiverAssistanceConfig() {
  const [categories, setCategories] = useState([]);
  const [limits, setLimits] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = await getReceiverAssistanceConfig();
      setCategories(buildCategoriesFromConfig(config));
      setLimits(config?.limits || null);
      setVersion(config?.version || '1');
      setSource('api');
      return config;
    } catch (err) {
      const fallback = buildCategoriesFromConfig(null);
      setCategories(fallback);
      setVersion('1');
      setSource('fallback');
      setError(err?.message || 'Could not load assistance categories');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getCategoryByCode = useCallback(
    (code) => categories.find((c) => c.code === code || c.id === code) || null,
    [categories],
  );

  return {
    categories,
    limits,
    version,
    loading,
    error,
    source,
    refresh,
    getCategoryByCode,
  };
}
