import { useCallback, useEffect, useState } from 'react';
import { getReceiverKycConfig } from '../api/configClient';

let memoryCache = null;
let memoryCacheAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export function useReceiverKycConfig({ enabled = true } = {}) {
  const [config, setConfig] = useState(memoryCache);
  const [loading, setLoading] = useState(Boolean(enabled && !memoryCache));
  const [error, setError] = useState(null);

  const refresh = useCallback(async ({ force = false } = {}) => {
    if (!enabled) return null;
    if (!force && memoryCache && Date.now() - memoryCacheAt < CACHE_TTL_MS) {
      setConfig(memoryCache);
      return memoryCache;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getReceiverKycConfig({ force });
      memoryCache = data;
      memoryCacheAt = Date.now();
      setConfig(data);
      return data;
    } catch (err) {
      setError(err?.message || 'Could not load verification configuration');
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { config, loading, error, refresh };
}
