const DEFAULT_ADMIN_PORTAL = 'http://localhost:5174';

export function getAdminPortalUrl(path = '/') {
  const base = (import.meta.env.VITE_ADMIN_PORTAL_URL || DEFAULT_ADMIN_PORTAL).replace(/\/$/, '');
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

const DASHBOARD_ADMIN_ROUTE_MAP = {
  'admin-users': '?tab=users',
  'admin-kyc-review': '?tab=verification',
  'admin-assistance-review': '?tab=assistance',
  'admin-item-verification': '?tab=items',
};

export function getAdminPortalRedirectUrl(dashboardPath = '') {
  const segment = String(dashboardPath || '')
    .replace(/^\/dashboard\//, '')
    .replace(/^\//, '');
  const query = DASHBOARD_ADMIN_ROUTE_MAP[segment] || '';
  return getAdminPortalUrl(query ? `/${query}` : '/');
}

export function redirectToAdminPortal(dashboardPath = '') {
  window.location.replace(getAdminPortalRedirectUrl(dashboardPath));
}

export const ADMIN_PORTAL_MESSAGE =
  'Admin users must sign in through the Admin Portal.';

export function adminPortalLoginHint() {
  return `${ADMIN_PORTAL_MESSAGE} Open ${getAdminPortalUrl('/')}`;
}
