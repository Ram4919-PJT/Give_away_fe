import { INITIAL_RECEIVER_SETTINGS } from '../data/receiverSettingsData';
import { normalizeAssistanceCategoryCode } from './assistanceCategoryNormalize';

const THEME_KEY = 'giveaway-theme';
const STORAGE_PREFIX = 'giveaway-receiver-settings';
const DRAFT_PREFIX = 'giveaway-receiver-apply-draft';

function storageKey(userId) {
  return userId ? `${STORAGE_PREFIX}:${userId}` : STORAGE_PREFIX;
}

export function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}

export function loadStoredReceiverSettings(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function persistReceiverSettings(userId, settings) {
  const payload = { ...settings };
  localStorage.setItem(storageKey(userId), JSON.stringify(payload));
  return payload;
}

export function mergeReceiverSettings(stored = {}, notificationPrefs = [], userSettings = {}) {
  const merged = {
    ...INITIAL_RECEIVER_SETTINGS,
    ...stored,
    ...userSettings,
  };

  const prefMap = {};
  (notificationPrefs || []).forEach((row) => {
    prefMap[String(row.channel || '').toUpperCase()] = !!row.is_enabled;
  });

  if ('EMAIL' in prefMap) merged.emailNotifications = prefMap.EMAIL;
  if ('SMS' in prefMap) merged.smsNotifications = prefMap.SMS;

  if (merged.defaultRequestCategory) {
    merged.defaultRequestCategory = normalizeAssistanceCategoryCode(merged.defaultRequestCategory);
  }

  return merged;
}

export function splitReceiverSettingsForSave(settings) {
  const localPayload = {
    assistanceUpdates: settings.assistanceUpdates,
    approvalAlerts: settings.approvalAlerts,
    disbursementAlerts: settings.disbursementAlerts,
    reminderNotifications: settings.reminderNotifications,
    preferredContactMethod: settings.preferredContactMethod,
    defaultRequestCategory: settings.defaultRequestCategory,
    autoSaveDrafts: settings.autoSaveDrafts,
    showContactToAdmin: settings.showContactToAdmin,
    showAddressAfterApproval: settings.showAddressAfterApproval,
    hideFromPublicSearch: settings.hideFromPublicSearch,
    language: settings.language,
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    theme: settings.theme,
    emailNotifications: settings.emailNotifications,
    smsNotifications: settings.smsNotifications,
  };

  const notificationUpdates = [
    { channel: 'EMAIL', is_enabled: !!settings.emailNotifications },
    { channel: 'SMS', is_enabled: !!settings.smsNotifications },
  ];

  return { localPayload, notificationUpdates };
}

function draftKey(userId) {
  return userId ? `${DRAFT_PREFIX}:${userId}` : DRAFT_PREFIX;
}

export function loadReceiverApplyDraft(userId) {
  try {
    const raw = localStorage.getItem(draftKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveReceiverApplyDraft(userId, payload) {
  if (!payload) return;
  localStorage.setItem(draftKey(userId), JSON.stringify(payload));
}

export function clearReceiverApplyDraft(userId) {
  localStorage.removeItem(draftKey(userId));
}

export { formatLastLogin, downloadJson } from './donorSettings';
