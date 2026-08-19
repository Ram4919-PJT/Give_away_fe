const IAM_TO_FRONTEND = {
  DONOR: 'donor',
  RECEIVER: 'receiver',
  NGO: 'ngo',
  SUPER_ADMIN: 'admin',
};

const FRONTEND_TO_IAM = {
  donor: 'DONOR',
  receiver: 'RECEIVER',
  ngo: 'NGO',
  admin: 'SUPER_ADMIN',
};

export const USER_APP_ROLES = ['donor', 'receiver', 'ngo'];

export const REGISTER_ROLES = [
  {
    key: 'donor',
    title: 'I want to donate',
    desc: 'Give items or money and track your impact.',
    icon: 'heart'
  },
  {
    key: 'receiver',
    title: 'I need support',
    desc: 'Apply for financial assistance when you need help.',
    icon: 'people'
  },
  {
    key: 'ngo',
    title: 'I represent an NGO',
    desc: 'Partner with us to coordinate relief programs.',
    icon: 'business'
  }
];

export function mapRoleToIam(role) {
  return FRONTEND_TO_IAM[role] || null;
}

export function normalizeMobileInput(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

const FRONTEND_TO_DASHBOARD = {
  donor: '/dashboard/donor-dashboard',
  receiver: '/dashboard/receiver-dashboard',
  ngo: '/dashboard/ngo-dashboard',
};

export function mapRoleFromIam(iamRoleName) {
  if (!iamRoleName) return null;
  return IAM_TO_FRONTEND[String(iamRoleName).toUpperCase()] || null;
}

export function isUserAppRole(role) {
  return USER_APP_ROLES.includes(role);
}

export function getDashboardPathForRole(role) {
  return FRONTEND_TO_DASHBOARD[role] || '/dashboard';
}

export function mapIamUser(iamUser) {
  const rawRole = iamUser.role?.role_name || iamUser.role_name;
  const roleName = rawRole ? String(rawRole).toUpperCase() : null;
  const rawStatus = iamUser.status;
  const status = rawStatus ? String(rawStatus).toUpperCase() : 'ACTIVE';
  return {
    userId: iamUser.user_id,
    name: iamUser.full_name,
    email: iamUser.email,
    mobile: iamUser.mobile || '',
    role: mapRoleFromIam(roleName),
    status,
    memberSince: iamUser.created_at ? String(iamUser.created_at).split('T')[0] : '',
    verified: false,
  };
}
