const IAM_TO_FRONTEND = {
  DONOR: 'donor',
  RECEIVER: 'receiver',
  NGO: 'ngo',
  SUPER_ADMIN: 'super-admin'
};

const FRONTEND_TO_DASHBOARD = {
  donor: '/dashboard/donor-dashboard',
  receiver: '/dashboard/receiver-dashboard',
  ngo: '/dashboard/ngo-dashboard',
  'super-admin': '/dashboard/admin-dashboard'
};

export function mapRoleFromIam(iamRoleName) {
  return IAM_TO_FRONTEND[iamRoleName] || 'donor';
}

export function getDashboardPathForRole(role) {
  return FRONTEND_TO_DASHBOARD[role] || '/dashboard';
}

export function mapIamUser(iamUser) {
  const roleName = iamUser.role?.role_name || iamUser.role_name;
  return {
    userId: iamUser.user_id,
    name: iamUser.full_name,
    email: iamUser.email,
    mobile: iamUser.mobile || '',
    role: mapRoleFromIam(roleName),
    status: iamUser.status,
    memberSince: iamUser.created_at ? String(iamUser.created_at).split('T')[0] : '',
    verified: false
  };
}
