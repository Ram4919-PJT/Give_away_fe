import { apiRequest } from './client';

export async function getDonorSettings() {
  return apiRequest('/core/donors/me/settings');
}

export async function updateDonorSettings(payload) {
  return apiRequest('/core/donors/me/settings', {
    method: 'PATCH',
    body: payload,
  });
}
