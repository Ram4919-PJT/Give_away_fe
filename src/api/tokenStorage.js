export const ACCESS_TOKEN_KEY = 'giveaway-access-token';
export const REFRESH_TOKEN_KEY = 'giveaway-refresh-token';

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
