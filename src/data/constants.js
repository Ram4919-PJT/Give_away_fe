export const NGO_PROGRAMS = [
  { id: 'p1', name: 'Medical Support', icon: '🏥', desc: 'Hospital equipment, medicines, and emergency medical aid for underserved communities.', eligibility: 'Registered hospitals, clinics, and medical NGOs', categories: ['Medical', 'Health'] },
  { id: 'p2', name: 'Educational Support', icon: '📚', desc: 'School supplies, scholarships, and infrastructure for children in need.', eligibility: 'Schools, education NGOs, and learning centers', categories: ['Education', 'Children'] },
  { id: 'p3', name: 'Food Assistance', icon: '🍲', desc: 'Community kitchens, ration kits, and nutrition programs.', eligibility: 'Food banks, community kitchens, relief NGOs', categories: ['Food', 'Nutrition'] },
  { id: 'p4', name: 'Disaster Relief', icon: '🌊', desc: 'Emergency response for floods, earthquakes, and natural disasters.', eligibility: 'Disaster response NGOs with field presence', categories: ['Disaster', 'Emergency'] },
  { id: 'p5', name: 'Livelihood Support', icon: '💼', desc: 'Skill training, micro-enterprise, and employment assistance.', eligibility: 'Livelihood and vocational training NGOs', categories: ['Livelihood', 'Skills'] },
  { id: 'p6', name: 'Women Empowerment', icon: '👩', desc: "Programs supporting women's health, safety, and economic independence.", eligibility: 'Women-focused NGOs and self-help groups', categories: ['Women', 'Empowerment'] },
  { id: 'p7', name: 'Child Welfare', icon: '👧', desc: 'Orphan care, child protection, and developmental support programs.', eligibility: 'Child welfare organizations with valid registration', categories: ['Children', 'Welfare'] },
  { id: 'p8', name: 'Senior Citizen Welfare', icon: '👴', desc: 'Elder care, pension support, and healthcare for senior citizens.', eligibility: 'Elder care NGOs and senior citizen associations', categories: ['Elderly', 'Care'] }
];

export const NGO_VERIFY_REQUIRED = [
  'NGO Registration Certificate', 'PAN Card', 'Bank Account Details',
  'Cancelled Cheque / Passbook', 'Authorized Representative Government ID',
  'Organization Address Proof'
];

export const NGO_VERIFY_OPTIONAL = [
  'GST Certificate', '80G Certificate', '12A Certificate',
  'FCRA Certificate (if applicable)', 'NGO Logo'
];

export const ASSISTANCE_TYPES = {
  'Medical Assistance': {
    desc: 'Hospital bills, medicines, and treatment costs',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Doctor Prescription', 'Diagnosis Report', 'Hospital Estimate', 'Hospital Bills', 'Admission Letter']
    }
  },
  'Educational Assistance': {
    desc: 'School fees, books, and educational expenses',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Student ID Card', 'Bonafide Certificate', 'Admission Letter', 'Fee Structure', 'Fee Receipt']
    }
  },
  'Emergency Relief': {
    desc: 'Sudden crises — rent, food, disaster recovery',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Government Certificate', 'Local Authority Letter', 'Supporting Photos (Optional)']
    }
  },
  'Women & Child Welfare': {
    desc: 'Support for women and children in need',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Supporting Certificate', 'Medical Report (if applicable)']
    }
  },
  'Senior Citizen Assistance': {
    desc: 'Elderly care, medical, and livelihood support',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Age Proof', 'Medical Report (if required)']
    }
  },
  'Disability Support': {
    desc: 'Aid for persons with disabilities',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Disability Certificate', 'Medical Report']
    }
  },
  'Other Financial Assistance': {
    desc: 'Other verified financial hardship needs',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Supporting Certificate', 'Supporting Documents']
    }
  }
};

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

export const LOGIN_TAB_CONFIG = {
  donor: {
    label: 'Donor',
    demoEmail: 'verified.donor@demo.com',
    demoPassword: '123456',
    needsMfa: false,
    title: 'Welcome back, Donor',
    subtitle: 'Sign in to manage your contributions and track your impact.',
    primaryLabel: 'Email Address',
    primaryPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    mfaLabel: '2FA Verification Code',
    buttonText: 'Secure Login to Abayahastham',
    buttonClass: 'auth-btn-green',
    accentClass: 'auth-accent--donor',
    showHelpDesk: false,
    showAdminNotice: false,
    registerPath: '/register/donor',
    registerLabel: "Don't have an account? Sign Up"
  },
  ngo: {
    label: 'NGO',
    demoEmail: 'verified.ngo@demo.com',
    demoPassword: '123456',
    needsMfa: true,
    title: 'NGO Partner Portal',
    subtitle: 'Access your organization dashboard and manage relief programs.',
    primaryLabel: 'Organization Email',
    primaryPlaceholder: 'contact@yourngo.org',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    mfaLabel: '2FA Verification Code',
    buttonText: 'Access Partner Portal',
    buttonClass: 'auth-btn-blue',
    accentClass: 'auth-accent--ngo',
    showHelpDesk: false,
    showAdminNotice: false,
    registerPath: '/register/ngo',
    registerLabel: 'Request NGO Account'
  },
  receiver: {
    label: 'Receiver',
    demoEmail: 'verified.receiver@demo.com',
    demoPassword: '123456',
    needsMfa: false,
    title: 'Receiver Sign In',
    subtitle: 'Log in to apply for financial assistance from AJA Abayahastham.',
    primaryLabel: 'Email Address',
    primaryPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    mfaLabel: '2FA Verification Code',
    buttonText: 'Log In to Receive Support',
    buttonClass: 'auth-btn-teal',
    accentClass: 'auth-accent--receiver',
    showHelpDesk: true,
    showAdminNotice: false,
    registerPath: '/register/receiver',
    registerLabel: 'New here? Apply for Support'
  },
  admin: {
    label: 'Admin',
    demoEmail: 'admin@demo.com',
    demoPassword: '123456',
    needsMfa: true,
    title: 'Command Center Access',
    subtitle: 'Restricted administrative login for authorized platform operators.',
    primaryLabel: 'Admin Email',
    primaryPlaceholder: 'admin@abhayahastam.org',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your secure password',
    mfaLabel: '2FA Authenticator Token',
    buttonText: 'Access Command Center',
    buttonClass: 'auth-btn-admin',
    accentClass: 'auth-accent--admin',
    showHelpDesk: false,
    showAdminNotice: true,
    registerPath: null,
    registerLabel: null
  }
};

export const DONOR_NAV = [
  { id: 'donor-dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'donor-donate-item', label: 'Donate Item', icon: 'package' },
  { id: 'donor-donate-money', label: 'Donate Money', icon: 'heart-handshake' },
  { id: 'donor-my-donations', label: 'My Donations', icon: 'gift' },
  { id: 'donor-my-impact', label: 'My Impact', icon: 'sparkles', locked: true },
  { id: 'donor-notifications', label: 'Notifications', icon: 'bell' },
  { id: 'donor-profile', label: 'Profile', icon: 'user' },
  { id: 'donor-settings', label: 'Settings', icon: 'settings' }
];

export const RECEIVER_NAV = [
  { id: 'receiver-dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'receiver-apply', label: 'Apply for Financial Assistance', icon: 'file-heart', locked: true },
  { id: 'receiver-applications', label: 'My Applications', icon: 'clipboard-list', locked: true },
  { id: 'receiver-notifications', label: 'Notifications', icon: 'bell' },
  { id: 'receiver-profile', label: 'Profile', icon: 'user' },
  { id: 'receiver-settings', label: 'Settings', icon: 'settings' }
];

export const NGO_NAV = [
  { id: 'ngo-dashboard', label: 'Dashboard', icon: 'layout-dashboard', locked: false },
  { id: 'ngo-verify', label: 'Complete Verification', icon: 'shield-check', locked: false, hideWhenVerified: true },
  { id: 'ngo-programs', label: 'Browse Programs', icon: 'layers', locked: false },
  { id: 'ngo-request-donations', label: 'Request Donations', icon: 'package', locked: true },
  { id: 'ngo-request-funds', label: 'Request Financial Assistance', icon: 'banknote', locked: true },
  { id: 'ngo-inventory', label: 'Inventory', icon: 'warehouse', locked: true },
  { id: 'ngo-beneficiaries', label: 'Beneficiaries', icon: 'users', locked: true },
  { id: 'ngo-my-requests', label: 'My Requests', icon: 'clipboard-list', locked: false },
  { id: 'ngo-reports', label: 'Reports', icon: 'bar-chart-3', locked: true },
  { id: 'ngo-notifications', label: 'Notifications', icon: 'bell', locked: false },
  { id: 'ngo-profile', label: 'Profile', icon: 'building-2', locked: false },
  { id: 'ngo-settings', label: 'Settings', icon: 'settings', locked: false }
];

export const NGO_LOCKED_TABS = [
  'ngo-request-donations', 'ngo-request-funds', 'ngo-inventory',
  'ngo-beneficiaries', 'ngo-reports'
];

export const ADMIN_NAV = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'admin-priority-queue', label: 'Priority Queue', icon: 'list-todo' },
  { id: 'admin-verifications', label: 'Verification Queue', icon: 'shield-check' },
  { id: 'admin-donations', label: 'Donation Management', icon: 'gift' },
  { id: 'admin-financial-assistance', label: 'Financial Assistance', icon: 'file-heart' },
  { id: 'admin-ngos', label: 'NGO Management', icon: 'building-2' },
  { id: 'admin-inventory', label: 'Item Inventory', icon: 'package' },
  { id: 'admin-funds', label: 'Fund Management', icon: 'wallet' },
  { id: 'admin-users', label: 'User Management', icon: 'users' },
  { id: 'admin-notifications', label: 'Notifications', icon: 'bell' },
  { id: 'admin-reports', label: 'Reports & Analytics', icon: 'bar-chart-3' },
  { id: 'admin-logs', label: 'System Logs', icon: 'scroll-text' },
  { id: 'admin-settings', label: 'Settings', icon: 'settings' }
];
