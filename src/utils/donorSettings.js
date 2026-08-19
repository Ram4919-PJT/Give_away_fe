import { INITIAL_DONOR_SETTINGS } from '../data/donorSettingsData';

const THEME_KEY = 'giveaway-theme';

export function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}

export function mergeDonorSettings(apiSettings = {}, notificationPrefs = []) {
  const merged = { ...INITIAL_DONOR_SETTINGS, ...apiSettings };

  const prefMap = {};
  (notificationPrefs || []).forEach((row) => {
    prefMap[String(row.channel || '').toUpperCase()] = !!row.is_enabled;
  });

  if ('EMAIL' in prefMap) merged.emailNotifications = prefMap.EMAIL;
  if ('SMS' in prefMap) merged.smsNotifications = prefMap.SMS;

  return merged;
}

export function splitSettingsForSave(settings) {
  const donorPayload = {
    anonymousDonations: settings.anonymousDonations,
    preferredCategories: settings.preferredCategories || [],
    language: settings.language,
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    theme: settings.theme,
    donationUpdates: settings.donationUpdates,
    impactReports: settings.impactReports,
    marketingEmails: settings.marketingEmails,
  };

  const notificationUpdates = [
    { channel: 'EMAIL', is_enabled: !!settings.emailNotifications },
    { channel: 'SMS', is_enabled: !!settings.smsNotifications },
  ];

  return { donorPayload, notificationUpdates };
}

export function formatLastLogin(isoValue, timezone = 'Asia/Kolkata') {
  if (!isoValue) return 'No recent sign-in recorded';
  try {
    const date = new Date(isoValue);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
  } catch {
    return isoValue;
  }
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
