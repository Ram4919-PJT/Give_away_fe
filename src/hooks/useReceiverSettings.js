import { useCallback, useEffect, useMemo, useState } from 'react';
import { listNotificationPreferences, updateNotificationPreference } from '../api/notificationsClient';
import { getSecurityInfo } from '../api/iamClient';
import {
  applyTheme,
  loadStoredReceiverSettings,
  mergeReceiverSettings,
  persistReceiverSettings,
  splitReceiverSettingsForSave,
} from '../utils/receiverSettings';

export function useReceiverSettings({ userId, userSettings, onSaved } = {}) {
  const [settings, setSettings] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [notificationPrefs, securityInfo] = await Promise.all([
        listNotificationPreferences().catch(() => []),
        getSecurityInfo().catch(() => null),
      ]);
      const stored = loadStoredReceiverSettings(userId);
      const merged = mergeReceiverSettings(stored, notificationPrefs, userSettings);
      setSettings(merged);
      setBaseline(JSON.stringify(merged));
      setSecurity(securityInfo);
      applyTheme(merged.theme);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [userId, userSettings]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!settings || !baseline) return false;
    return JSON.stringify(settings) !== baseline;
  }, [settings, baseline]);

  const patch = useCallback((key, value) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const resetChanges = useCallback(() => {
    if (!baseline) return;
    const restored = JSON.parse(baseline);
    setSettings(restored);
    applyTheme(restored.theme);
  }, [baseline]);

  const saveSettings = useCallback(async () => {
    if (!settings || !dirty) return;
    setSaving(true);
    setError('');
    try {
      const { localPayload, notificationUpdates } = splitReceiverSettingsForSave(settings);
      await Promise.all(
        notificationUpdates.map((row) => updateNotificationPreference(row))
      );
      const saved = persistReceiverSettings(userId, { ...settings, ...localPayload });
      setSettings(saved);
      setBaseline(JSON.stringify(saved));
      applyTheme(saved.theme);
      onSaved?.(saved);
      return saved;
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [settings, dirty, userId, onSaved]);

  const refreshSecurity = useCallback(async () => {
    try {
      const securityInfo = await getSecurityInfo();
      setSecurity(securityInfo);
    } catch {
      /* best-effort */
    }
  }, []);

  return {
    settings,
    security,
    loading,
    saving,
    error,
    dirty,
    patch,
    resetChanges,
    saveSettings,
    reload: load,
    refreshSecurity,
  };
}
