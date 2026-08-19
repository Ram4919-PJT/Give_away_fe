import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDonorSettings, updateDonorSettings } from '../api/settingsClient';
import { listNotificationPreferences, updateNotificationPreference } from '../api/notificationsClient';
import { getSecurityInfo } from '../api/iamClient';
import {
  applyTheme,
  mergeDonorSettings,
  splitSettingsForSave,
} from '../utils/donorSettings';

export function useDonorSettings({ onSaved } = {}) {
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
      const [donorSettings, notificationPrefs, securityInfo] = await Promise.all([
        getDonorSettings(),
        listNotificationPreferences().catch(() => []),
        getSecurityInfo().catch(() => null),
      ]);
      const merged = mergeDonorSettings(donorSettings, notificationPrefs);
      setSettings(merged);
      setBaseline(JSON.stringify(merged));
      setSecurity(securityInfo);
      applyTheme(merged.theme);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

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
      const { donorPayload, notificationUpdates } = splitSettingsForSave(settings);
      const [saved] = await Promise.all([
        updateDonorSettings(donorPayload),
        ...notificationUpdates.map((row) => updateNotificationPreference(row)),
      ]);
      const merged = mergeDonorSettings(saved, notificationUpdates.map((row) => ({
        channel: row.channel,
        is_enabled: row.is_enabled,
      })));
      setSettings(merged);
      setBaseline(JSON.stringify(merged));
      applyTheme(merged.theme);
      onSaved?.(merged);
      return merged;
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [settings, dirty, onSaved]);

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
    setSettings,
    resetChanges,
    saveSettings,
    reload: load,
    refreshSecurity,
  };
}
