import { useCallback, useEffect, useState } from 'react';
import { getReceiverEligibility } from '../api/verificationClient';

let memoryCache = null;
let memoryCacheAt = 0;
let inflightRequest = null;
const CACHE_TTL_MS = 30_000;

export function useReceiverEligibility({ enabled = true } = {}) {
  const [data, setData] = useState(memoryCache);
  const [loading, setLoading] = useState(Boolean(enabled && !memoryCache));
  const [error, setError] = useState(null);

  const refresh = useCallback(async ({ force = false } = {}) => {
    if (!enabled) return null;

    if (!force && memoryCache && Date.now() - memoryCacheAt < CACHE_TTL_MS) {
      setData(memoryCache);
      setLoading(false);
      return memoryCache;
    }

    if (inflightRequest && !force) {
      return inflightRequest;
    }

    setLoading(true);
    setError(null);

    inflightRequest = (async () => {
      try {
        const result = await getReceiverEligibility();
        memoryCache = result;
        memoryCacheAt = Date.now();
        setData(result);
        return result;
      } catch (err) {
        setError(err?.message || 'Could not load verification status');
        return null;
      } finally {
        setLoading(false);
        inflightRequest = null;
      }
    })();

    return inflightRequest;
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    eligibility: data,
    eligible: Boolean(data?.eligible),
    canRequestAssistance: Boolean(data?.can_request_assistance ?? data?.eligible),
    blockReasonCode: data?.block_reason_code ?? null,
    loading,
    error,
    refresh,
    progress: data?.progress ?? null,
    reasons: data?.reasons ?? [],
  };
}

export function invalidateReceiverEligibilityCache() {
  memoryCache = null;
  memoryCacheAt = 0;
}
