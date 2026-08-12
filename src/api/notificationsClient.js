import { apiRequest } from './client';

export async function listNotifications() {
  return apiRequest('/notifications');
}

export async function markNotificationRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function listNotificationPreferences() {
  return apiRequest('/notifications/preferences').catch(() =>
    apiRequest('/preferences')
  );
}

export async function updateNotificationPreference(payload) {
  return apiRequest('/notifications/preferences', { method: 'PUT', body: payload }).catch(
    () => apiRequest('/preferences', { method: 'PUT', body: payload })
  );
}
