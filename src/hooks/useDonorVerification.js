import { useCallback, useEffect, useState } from 'react';
import { ApiRequestError } from '../api/client';
import { getDonorVerificationConfig } from '../api/configClient';
import { getMyVerification, createOrResumeVerification } from '../api/verificationClient';

let memoryCache = null;
let memoryCacheAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function formatVerificationError(err, fallback) {
  if (err instanceof ApiRequestError) return err.message;
  if (err?.message && err.message !== 'Request failed') return err.message;
  return fallback;
}

export function useDonorVerificationConfig({ enabled = true } = {}) {
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
      const data = await getDonorVerificationConfig({ force });
      memoryCache = data;
      memoryCacheAt = Date.now();
      setConfig(data);
      return data;
    } catch (err) {
      setError(formatVerificationError(err, 'Could not load verification configuration.'));
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

export function useDonorVerificationSession() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileStatus, setProfileStatus] = useState('REGISTERED');
  const [request, setRequest] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMyVerification();
      setProfileStatus(me.profile_status || 'REGISTERED');
      let req = me.request;
      const profileVerified = ['VERIFIED', 'APPROVED'].includes(
        String(me.profile_status || '').toUpperCase()
      );
      if (!req && !profileVerified) {
        try {
          req = await createOrResumeVerification();
        } catch (createErr) {
          setRequest(null);
          setError(
            formatVerificationError(
              createErr,
              'Could not start your verification session. Check that you are logged in as a donor and try again.',
            ),
          );
          return null;
        }
      }
      setRequest(req);
      return { me, request: req };
    } catch (err) {
      setError(
        formatVerificationError(
          err,
          'Could not load your verification status. Please refresh or try again in a moment.',
        ),
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    error,
    profileStatus,
    request,
    setRequest,
    reload: load,
  };
}
