const API_BASE = import.meta.env.VITE_IAM_API_URL || '/api/v1';

export const ACCESS_TOKEN_KEY = 'giveaway-access-token';
export const REFRESH_TOKEN_KEY = 'giveaway-refresh-token';

function parseErrorDetail(data) {
  if (!data?.detail) return 'Request failed';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg || item.message || JSON.stringify(item)).join(', ');
  }
  return 'Request failed';
}

async function request(path, { method = 'GET', body, accessToken } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseErrorDetail(data));
  }
  return data;
}

export function saveTokens({ access_token, refresh_token }) {
  if (access_token) sessionStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password }
  });
}

export async function register({ full_name, email, mobile, password, role_name }) {
  return request('/auth/register', {
    method: 'POST',
    body: {
      full_name,
      email: email.trim().toLowerCase(),
      mobile,
      password,
      role_name
    }
  });
}

export async function refresh(refreshToken) {
  return request('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken }
  });
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  try {
    await request('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken }
    });
  } catch {
    /* revoke best-effort */
  }
}

export async function getMe(accessToken) {
  return request('/auth/me', { accessToken });
}
