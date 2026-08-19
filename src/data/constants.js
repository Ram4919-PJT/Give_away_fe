export const NGO_VERIFY_REQUIRED = [
  'NGO Registration Certificate', 'PAN Card', 'Bank Account Details',
  'Cancelled Cheque / Passbook', 'Authorized Representative Government ID',
  'Organization Address Proof'
];

export const NGO_VERIFY_OPTIONAL = [
  'GST Certificate', '80G Certificate', '12A Certificate',
  'FCRA Certificate (if applicable)', 'NGO Logo'
];

export const ASSISTANCE_TYPES = {};

export const ROLE_AUTH_CONFIG = {
  donor: {
    icon: '💚',
    title: 'Continue as Donor',
    desc: 'Sign in or create a donor account to give items, funds, and track your impact.',
    footnote: 'Donors can see exactly how every contribution is used.',
    registerLabel: 'Register as Donor',
    loginTab: 'donor',
    dashboardTab: 'donor-dashboard',
    requiredRole: 'donor'
  },
  receiver: {
    icon: '🙋',
    title: 'Request Support',
    desc: 'Sign in or register to apply for financial assistance from AJA Abayahastham.',
    footnote: 'AJA reviews every application with care and dignity.',
    registerLabel: 'Register as Receiver',
    loginTab: 'receiver',
    dashboardTab: 'receiver-dashboard',
    requiredRole: 'receiver'
  },
  ngo: {
    icon: '🏛️',
    title: 'NGO Partner Access',
    desc: 'Sign in or register your organization to request stock, funding, and coordinate relief.',
    footnote: 'Verified NGO partners get access to the coordination portal.',
    registerLabel: 'Register as NGO',
    loginTab: 'ngo',
    dashboardTab: 'ngo-dashboard',
    requiredRole: 'ngo'
  }
};

export const DONOR_NAV = [
  { id: 'donor-dashboard', label: 'Dashboard', icon: 'layout-dashboard', group: 'main' },
  { id: 'donor-my-donations', label: 'My Donations', icon: 'gift', group: 'main' },
  { id: 'donor-item-requests', label: 'Donation Requests', icon: 'inbox', group: 'main' },
  { id: 'donor-donate-money', label: 'Donate Money', icon: 'indian-rupee', group: 'give' },
  { id: 'donor-add-item', label: 'Donate Items', icon: 'package', group: 'give', locked: true },
  { id: 'donor-my-pledges', label: 'My Pledges', icon: 'handshake', group: 'giving' },
  { id: 'donor-recurring', label: 'My Recurring Gifts', icon: 'refresh-cw', group: 'giving' },
  { id: 'donor-my-impact', label: 'Impact & Reports', icon: 'bar-chart-3', group: 'giving' },
  { id: 'donor-certificates', label: 'Certificates', icon: 'award', group: 'giving' },
  { id: 'donor-favorites', label: 'Favorites', icon: 'heart', group: 'giving' },
  { id: 'donor-verify', label: 'Verification', icon: 'shield-check', group: 'account' },
  { id: 'donor-profile', label: 'Profile', icon: 'user', group: 'account' },
  { id: 'donor-settings', label: 'Settings', icon: 'settings', group: 'account' },
  { id: 'donor-payment-methods', label: 'Payment Methods', icon: 'credit-card', group: 'account' },
  { id: 'donor-notifications', label: 'Notifications', icon: 'bell', group: 'account' },
  { id: 'donor-help', label: 'Help & Support', icon: 'help-circle', group: 'account' },
];

export const DONOR_NAV_GROUP_LABELS = {
  main: 'Main',
  give: 'Give',
  giving: 'Giving',
  account: 'Account',
};

export const RECEIVER_NAV_GROUP_LABELS = {
  main: 'Main',
  community: 'Community',
  management: 'Management',
  account: 'Account',
};

export const RECEIVER_NAV = [
  { id: 'receiver-dashboard', label: 'Dashboard', icon: 'layout-dashboard', group: 'main' },
  { id: 'receiver-requests', label: 'My Requests', icon: 'clipboard-list', group: 'main', locked: true },
  { id: 'receiver-apply', label: 'Apply for Assistance', icon: 'file-heart', group: 'main', locked: true },
  { id: 'receiver-notifications', label: 'Notifications', icon: 'bell', group: 'community' },
  { id: 'receiver-verify', label: 'Verification (KYC)', icon: 'shield-check', group: 'management', locked: false },
  { id: 'receiver-profile', label: 'Profile', icon: 'user', group: 'management' },
  { id: 'receiver-settings', label: 'Settings', icon: 'settings', group: 'account' },
];

export const NGO_NAV_GROUP_LABELS = {
  main: 'Main',
  donations: 'Donations',
  support: 'Support',
  management: 'Management',
  account: 'Account',
};

export const NGO_NAV = [
  { id: 'ngo-dashboard', label: 'Dashboard', icon: 'layout-dashboard', group: 'main', locked: false },
  { id: 'ngo-verify', label: 'Verification', icon: 'shield-check', group: 'management', locked: false },
  { id: 'ngo-request-donations', label: 'Request Donations', icon: 'package', group: 'donations', locked: true },
  { id: 'ngo-request-funds', label: 'Request Funds', icon: 'banknote', group: 'support', locked: true },
  { id: 'ngo-inventory', label: 'Inventory', icon: 'warehouse', group: 'donations', locked: true },
  { id: 'ngo-beneficiaries', label: 'Beneficiaries', icon: 'users', group: 'support', locked: true },
  { id: 'ngo-reports', label: 'Reports', icon: 'bar-chart-3', group: 'management', locked: true },
  { id: 'ngo-programs', label: 'Programs', icon: 'layers', group: 'donations', locked: true },
  { id: 'ngo-my-requests', label: 'My Requests', icon: 'clipboard-list', group: 'donations', locked: true },
  { id: 'ngo-notifications', label: 'Notifications', icon: 'bell', group: 'management', locked: false },
  { id: 'ngo-profile', label: 'Profile', icon: 'building-2', group: 'account', locked: false },
  { id: 'ngo-settings', label: 'Settings', icon: 'settings', group: 'account', locked: false },
];

export const NGO_VERIFIED_ONLY_ROUTES = [
  'ngo-request-donations',
  'ngo-request-funds',
  'ngo-inventory',
  'ngo-beneficiaries',
  'ngo-reports',
  'ngo-programs',
  'ngo-my-requests',
];

export const NGO_LOCKED_TABS = [
  'ngo-request-donations', 'ngo-request-funds', 'ngo-inventory',
  'ngo-beneficiaries', 'ngo-reports'
];

