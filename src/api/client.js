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
  if (!data?.detail) return data?.message || 'Request failed';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    if (data.detail.every((item) => item?.field && item?.message)) {
      return data.detail.map((item) => item.message).filter(Boolean).join(' ');
    }
    const msgs = data.detail.map((item) => {
      const field = item?.loc?.[item.loc.length - 1];
      const raw = item.msg || item.message || '';
      if (field && typeof field === 'string') {
        const label = field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const minLen = raw.match(/at least (\d+) character/i);
        if (minLen) return `${label} must be at least ${minLen[1]} characters`;
        if (/field required/i.test(raw)) return `${label} is required`;
      }
      return raw || JSON.stringify(item);
    });
    return msgs.filter(Boolean).join('. ');
  }
  return data?.message || 'Request failed';
}

export function extractStructuredErrors(data) {
  if (!Array.isArray(data?.detail)) return [];
  if (!data.detail.every((item) => item?.field && item?.message)) return [];
  return data.detail;
}

export class ApiRequestError extends Error {
  constructor(message, { code, errors } = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.errors = errors;
  }
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

export async function apiRequest(path, {
  method = 'GET',
  body,
  auth = true,
  retry = true,
  accessToken: explicitToken,
} = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = { Accept: 'application/json' };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  let accessToken = auth ? (explicitToken || getStoredAccessToken()) : null;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }

  const isRefreshCall = path === '/auth/refresh' || path.endsWith('/auth/refresh');
  if (response.status === 401 && auth && retry && !isRefreshCall) {
    await refreshAccessToken();
    return apiRequest(path, { method, body, auth, retry: false });
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = extractStructuredErrors(data);
    const detail = parseErrorDetail(data);
    const message = detail === 'Request failed'
      ? `Request failed (${response.status}). Please try again or contact support if this continues.`
      : detail;
    throw new ApiRequestError(message, {
      code: data.code,
      errors,
      status: response.status,
    });
  }
  return data;
}
