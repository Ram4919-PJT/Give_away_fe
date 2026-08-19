import {
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  saveTokens,
} from './tokenStorage';
import { apiRequest } from './client';

export {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  saveTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from './tokenStorage';

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
    auth: false,
  });
}

export async function register({ full_name, email, mobile, password, role_name }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: {
      full_name,
      email: email.trim().toLowerCase(),
      mobile,
      password,
      role_name,
    },
    auth: false,
  });
}

export async function refresh(refreshToken) {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  });
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      auth: false,
    });
  } catch {
    /* revoke best-effort */
  }
}

export async function getMe(accessToken) {
  const token = accessToken || getStoredAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return apiRequest('/auth/me', { auth: true, accessToken: token, retry: true });
}

export async function sendOtp(mobile, purpose = 'DONATION_LOGIN') {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: { mobile, purpose },
    auth: false,
  }).catch(async () => {
    return apiRequest('/otp/send', {
      method: 'POST',
      body: { identifier: mobile, purpose },
      auth: false,
    });
  });
}

export async function verifyOtp(mobile, otpCode, purpose = 'DONATION_LOGIN') {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: { mobile, otp: otpCode, purpose },
    auth: false,
  }).catch(async () => {
    return apiRequest('/otp/verify', {
      method: 'POST',
      body: { identifier: mobile, otp_code: otpCode, purpose },
      auth: false,
    });
  });
}

export async function forgotPassword(email) {
  return apiRequest('/auth/password/forgot', {
    method: 'POST',
    body: { email: String(email || '').trim().toLowerCase() },
    auth: false,
  });
}

export async function resetPassword({ email, otp_code, new_password }) {
  return apiRequest('/auth/password/reset', {
    method: 'POST',
    body: {
      email: String(email || '').trim().toLowerCase(),
      otp_code: String(otp_code || '').trim(),
      new_password,
    },
    auth: false,
  });
}

export async function changePassword({ current_password, new_password }) {
  return apiRequest('/auth/password/change', {
    method: 'POST',
    body: { current_password, new_password },
  });
}

export async function getSecurityInfo() {
  return apiRequest('/auth/me/security');
}

export async function logoutAllSessions() {
  return apiRequest('/auth/logout-all', { method: 'POST' });
}

export async function deactivateAccount(password) {
  return apiRequest('/auth/account/deactivate', {
    method: 'POST',
    body: { password },
  });
}

export async function deleteAccount({ password, confirmation }) {
  return apiRequest('/auth/account/delete', {
    method: 'POST',
    body: { password, confirmation },
  });
}
