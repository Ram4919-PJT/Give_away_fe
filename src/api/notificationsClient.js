import { apiRequest } from './client';

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function listNotifications(params = {}) {
  return apiRequest(`/notifications${buildQuery(params)}`);
}

export async function getNotificationSummary() {
  return apiRequest('/notifications/summary');
}

export async function getUnreadCount() {
  return apiRequest('/notifications/unread-count');
}

export async function markNotificationRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead() {
  return apiRequest('/notifications/read-all', { method: 'PATCH' });
}

export async function deleteNotification(notificationId) {
  return apiRequest(`/notifications/${notificationId}`, { method: 'DELETE' });
}

export async function listNotificationPreferences() {
  return apiRequest('/notifications/preferences').catch(() => apiRequest('/preferences'));
}

export async function updateNotificationPreference(payload) {
  return apiRequest('/notifications/preferences', { method: 'PUT', body: payload }).catch(() =>
    apiRequest('/preferences', { method: 'PUT', body: payload })
  );
}
