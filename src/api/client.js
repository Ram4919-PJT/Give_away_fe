import {
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  saveTokens,
} from './tokenStorage';

const API_BASE = import.meta.env.VITE_IAM_API_URL || '/api/v1';

export function getApiBase() {
  return API_BASE;
}

export function parseErrorDetail(data) {
  if (!data?.detail) return 'Request failed';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg || item.message || JSON.stringify(item)).join(', ');
  }
  return 'Request failed';
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('Session expired');

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    clearTokens();
    throw new Error(parseErrorDetail(data));
  }

  saveTokens(data);
  return data.access_token;
}

export async function apiRequest(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  let accessToken = auth ? getStoredAccessToken() : null;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && retry) {
    await refreshAccessToken();
    return apiRequest(path, { method, body, auth, retry: false });
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseErrorDetail(data));
  }
  return data;
}
