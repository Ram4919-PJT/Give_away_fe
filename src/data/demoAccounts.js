/** Predefined demo accounts for wireframe / prototype testing — no backend required */

export const DEMO_ACCOUNTS = [
  {
    id: 'verified-donor',
    group: 'Donor',
    role: 'donor',
    roleLabel: 'Donor',
    title: 'Verified Donor',
    email: 'verified.donor@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Verified Demo Donor',
    features: ['All modules unlocked', 'Verified Badge', 'Full dashboard access'],
    accent: 'donor'
  },
  {
    id: 'pending-donor',
    group: 'Donor',
    role: 'donor',
    roleLabel: 'Donor',
    title: 'Pending Donor',
    email: 'pending.donor@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'registered',
    name: 'Pending Demo Donor',
    features: ['Locked premium features', 'Verification banner visible', 'Complete Verification button'],
    accent: 'donor'
  },
  {
    id: 'verified-receiver',
    group: 'Receiver',
    role: 'receiver',
    roleLabel: 'Receiver',
    title: 'Verified Receiver',
    email: 'verified.receiver@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Verified Demo Receiver',
    features: ['Financial Assistance unlocked', 'My Applications available', 'Verified Badge'],
    accent: 'receiver',
    profile: {
      mobile: '+91 98765 43220',
      city: 'Mumbai',
      state: 'Maharashtra',
      memberSince: '2026-05-01'
    }
  },
  {
    id: 'pending-receiver',
    group: 'Receiver',
    role: 'receiver',
    roleLabel: 'Receiver',
    title: 'Pending Receiver',
    email: 'pending.receiver@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'registered',
    name: 'Pending Demo Receiver',
    features: ['Financial Assistance locked', 'Verification Required banner', 'Limited access'],
    accent: 'receiver',
    profile: {
      mobile: '+91 98765 43221',
      city: 'Pune',
      state: 'Maharashtra',
      memberSince: '2026-06-15'
    }
  },
  {
    id: 'verified-ngo',
    group: 'NGO',
    role: 'ngo',
    roleLabel: 'NGO',
    title: 'Verified NGO',
    email: 'verified.ngo@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Asha Kiran Foundation (Demo)',
    features: [
      'Donation Requests',
      'Manage Beneficiaries',
      'Financial Assistance Requests',
      'Reports & Analytics',
      'Verified Badge'
    ],
    accent: 'ngo',
    profile: {
      mobile: '+91 98765 43230',
      city: 'Mumbai',
      state: 'Maharashtra',
      repName: 'Priya Sharma',
      orgType: 'Registered Trust',
      regNumber: 'NGO-MH-2024-001',
      status: 'Verified NGO Partner',
      memberSince: '2025-11-01'
    }
  },
  {
    id: 'pending-ngo',
    group: 'NGO',
    role: 'ngo',
    roleLabel: 'NGO',
    title: 'Pending NGO',
    email: 'pending.ngo@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'submitted',
    name: 'Smile Foundation (Demo)',
    features: ['Features locked', 'Verification progress shown', 'Complete Verification button', 'Lock icons on modules'],
    accent: 'ngo',
    profile: {
      mobile: '+91 98765 43231',
      city: 'Delhi',
      state: 'Delhi',
      repName: 'Anil Mehta',
      orgType: 'Society',
      regNumber: 'NGO-DL-2025-014',
      status: 'Verification Pending',
      memberSince: '2026-06-01'
    }
  },
  {
    id: 'admin',
    group: 'Admin',
    role: 'super-admin',
    roleLabel: 'Admin',
    title: 'Platform Admin',
    email: 'admin@demo.com',
    password: '123456',
    statusLabel: 'Full Access',
    statusType: 'admin',
    verified: true,
    verificationStatus: 'verified',
    name: 'Platform Administrator',
    features: ['Full platform access', 'Verification queue', 'All admin modules'],
    accent: 'admin'
  }
];

export const DEMO_ACCOUNT_GROUPS = ['Donor', 'Receiver', 'NGO', 'Admin'];

export function getDemoAccountById(id) {
  return DEMO_ACCOUNTS.find((a) => a.id === id) || null;
}

export function getDemoAccountByEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized) || null;
}

export function getDemoAccountsByGroup(group) {
  return DEMO_ACCOUNTS.filter((a) => a.group === group);
}
