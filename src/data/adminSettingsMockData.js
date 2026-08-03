/** Mock data for Admin Settings dashboard wireframe */

export const ADMIN_SETTINGS_CATEGORIES = [
  { id: 'security', label: 'Security & Access', icon: '🔐' },
  { id: 'notifications', label: 'Notification Settings', icon: '🔔' },
  { id: 'appearance', label: 'Platform Appearance', icon: '🎨' },
  { id: 'system', label: 'System Configuration', icon: '⚙️' },
  { id: 'verification', label: 'Verification Settings', icon: '🛡' },
  { id: 'donation', label: 'Donation Settings', icon: '💝' },
  { id: 'financial', label: 'Financial Settings', icon: '💰' },
  { id: 'categories', label: 'Category Management', icon: '📂' },
  { id: 'email', label: 'Email Templates', icon: '✉️' },
  { id: 'audit', label: 'Audit & Logs', icon: '📋' },
  { id: 'api', label: 'API & Integrations', icon: '🔗' },
  { id: 'backup', label: 'Backup & Recovery', icon: '💾' }
];

export const ADMIN_ASSISTANCE_CATEGORIES = [
  { id: 'cat-1', name: 'Medical', status: 'Active', requests: 342 },
  { id: 'cat-2', name: 'Education', status: 'Active', requests: 218 },
  { id: 'cat-3', name: 'Emergency', status: 'Active', requests: 156 },
  { id: 'cat-4', name: 'Women & Child Welfare', status: 'Active', requests: 124 },
  { id: 'cat-5', name: 'Senior Citizen', status: 'Active', requests: 89 },
  { id: 'cat-6', name: 'Disability Support', status: 'Active', requests: 67 },
  { id: 'cat-7', name: 'Other', status: 'Disabled', requests: 12 }
];

export const ADMIN_SETTINGS_DEFAULTS = {
  security: {
    sessionTimeout: '30',
    twoFactor: true,
    ipWhitelist: false
  },
  notifications: {
    emailAlerts: true,
    pushAlerts: true,
    urgentOnly: false,
    digestFrequency: 'daily'
  },
  appearance: {
    theme: 'light',
    platformName: 'Give Away',
    primaryColor: '#22C55E',
    layout: 'default'
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    defaultLanguage: 'en-IN',
    timezone: 'Asia/Kolkata'
  },
  verification: {
    donorBadgeRules: true,
    receiverVerification: true,
    ngoVerification: true,
    manualReview: true,
    requiredDocs: 'standard'
  },
  donation: {
    itemDonations: true,
    moneyDonations: true,
    minDonation: '100',
    maxDonation: '500000',
    anonymous: true
  },
  financial: {
    emergencyLimit: '50000',
    monthlyBudget: '500000',
    maxAid: '25000',
    autoAllocate: false
  },
  audit: {
    activityLogs: true,
    retentionDays: '90',
    autoExport: false
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackup: '2026-07-10 02:00 AM'
  },
  api: {
    webhooksEnabled: false,
    apiKeysActive: 2
  }
};

export const ADMIN_EMAIL_TEMPLATES = [
  { id: 'reg', name: 'Registration Email', subject: 'Welcome to Give Away', updated: '2026-06-15' },
  { id: 'verify', name: 'Verification Email', subject: 'Verify your account', updated: '2026-06-20' },
  { id: 'donation', name: 'Donation Confirmation', subject: 'Thank you for your donation', updated: '2026-07-01' },
  { id: 'aid-approve', name: 'Aid Approval', subject: 'Your assistance request was approved', updated: '2026-07-05' },
  { id: 'aid-reject', name: 'Aid Rejection', subject: 'Update on your assistance request', updated: '2026-07-05' }
];

export const ADMIN_LOGIN_HISTORY = [
  { time: '2026-07-10 09:12', ip: '10.0.0.12', device: 'macOS — Safari', status: 'Success' },
  { time: '2026-07-09 18:45', ip: '10.0.0.12', device: 'Windows — Chrome', status: 'Success' },
  { time: '2026-07-08 14:22', ip: '203.0.113.45', device: 'Unknown', status: 'Failed' }
];

export const ADMIN_ROLE_PERMISSIONS = [
  { role: 'Super Admin', users: 2, access: 'Full platform access' },
  { role: 'Review Team', users: 4, access: 'Verification & assistance review' },
  { role: 'Finance Admin', users: 2, access: 'Funds & donation management' }
];
