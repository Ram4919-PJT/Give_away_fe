import { apiRequest } from './client';

export async function listAdminUsers({ status, role, q, limit = 100, skip = 0 } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (role) params.set('role', role);
  if (q) params.set('q', q);
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  const query = params.toString();
  return apiRequest(`/users${query ? `?${query}` : ''}`);
}

export async function updateAdminUserStatus(userId, status) {
  return apiRequest(`/users/${userId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}
