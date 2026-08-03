/** Mock data for System Logs / Audit dashboard wireframe */

export const ADMIN_LOGS_SUMMARY = {
  totalToday: 1842,
  userActivities: 624,
  adminActions: 148,
  ngoActivities: 96,
  warnings: 12,
  criticalErrors: 3
};

export const ADMIN_LOGS_TRENDS = {
  totalToday: '+8% vs yesterday',
  userActivities: '+12% active users',
  adminActions: '24 in last hour',
  ngoActivities: '+5 new events',
  warnings: '2 unresolved',
  criticalErrors: 'All monitored'
};

export const ADMIN_LOG_CATEGORIES = [
  { id: 'all', label: 'All Logs', icon: '📋' },
  { id: 'user', label: 'User Activity', icon: '👤' },
  { id: 'donation', label: 'Donation Activity', icon: '💝' },
  { id: 'verification', label: 'Verification Activity', icon: '🛡' },
  { id: 'fund', label: 'Fund Management', icon: '💰' },
  { id: 'ngo', label: 'NGO Management', icon: '🏢' },
  { id: 'system', label: 'System Events', icon: '⚙️' },
  { id: 'admin', label: 'Admin Actions', icon: '🔐' },
  { id: 'security', label: 'Security Logs', icon: '🔒' }
];

export const ADMIN_LOGS_TIMELINE = [
  { time: '09:15 AM', title: 'Donor Registration Approved', user: 'Platform Admin', icon: '✅', color: '#22C55E' },
  { time: '09:30 AM', title: 'NGO Verification Completed', user: 'Review Team A', icon: '🏢', color: '#2563EB' },
  { time: '10:10 AM', title: 'Fund Released', user: 'Platform Admin', icon: '💰', color: '#22C55E' },
  { time: '10:45 AM', title: 'Receiver Verification Approved', user: 'Platform Admin', icon: '👤', color: '#2563EB' },
  { time: '11:30 AM', title: 'Donation Completed', user: 'Demo Donor', icon: '💝', color: '#22C55E' }
];

export const ADMIN_LOGS_ENTRIES = [
  {
    id: 'LOG-2026-1842', datetime: '2026-07-10 11:30:22', user: 'Demo Donor', role: 'Donor',
    activity: 'Donation Completed', module: 'Donations', category: 'donation',
    severity: 'SUCCESS', status: 'Completed', ip: '192.168.1.42',
    description: '₹1,000 medical support donation completed and assigned to Asha Kiran Foundation.',
    device: 'Windows 11 Desktop', browser: 'Chrome 126'
  },
  {
    id: 'LOG-2026-1841', datetime: '2026-07-10 10:45:18', user: 'Platform Admin', role: 'Admin',
    activity: 'Receiver Verification Approved', module: 'Verification', category: 'verification',
    severity: 'SUCCESS', status: 'Completed', ip: '10.0.0.12',
    description: 'Receiver Ravi Kumar identity documents verified and account activated.',
    device: 'macOS Sonoma', browser: 'Safari 17'
  },
  {
    id: 'LOG-2026-1840', datetime: '2026-07-10 10:10:05', user: 'Platform Admin', role: 'Admin',
    activity: 'Fund Released', module: 'Fund Management', category: 'fund',
    severity: 'SUCCESS', status: 'Completed', ip: '10.0.0.12',
    description: '₹25,000 released to Asha Kiran Foundation for medical assistance case REL-2026-008.',
    device: 'macOS Sonoma', browser: 'Safari 17'
  },
  {
    id: 'LOG-2026-1839', datetime: '2026-07-10 09:30:44', user: 'Review Team A', role: 'Admin',
    activity: 'NGO Verification Completed', module: 'NGO Management', category: 'ngo',
    severity: 'SUCCESS', status: 'Completed', ip: '10.0.0.18',
    description: 'Helpage India verification documents reviewed and partner status approved.',
    device: 'Windows 11 Desktop', browser: 'Edge 126'
  },
  {
    id: 'LOG-2026-1838', datetime: '2026-07-10 09:15:33', user: 'Platform Admin', role: 'Admin',
    activity: 'Donor Registration Approved', module: 'User Management', category: 'user',
    severity: 'INFO', status: 'Completed', ip: '10.0.0.12',
    description: 'New donor Anita Verma registration reviewed and approved for platform access.',
    device: 'macOS Sonoma', browser: 'Safari 17'
  },
  {
    id: 'LOG-2026-1837', datetime: '2026-07-10 08:52:11', user: 'Unknown', role: 'Guest',
    activity: 'Failed Login Attempt', module: 'Security', category: 'security',
    severity: 'WARNING', status: 'Blocked', ip: '203.0.113.45',
    description: 'Multiple failed login attempts detected from unrecognized IP address.',
    device: 'Unknown', browser: 'Chrome 125'
  },
  {
    id: 'LOG-2026-1836', datetime: '2026-07-10 08:40:02', user: 'System', role: 'System',
    activity: 'Scheduled Backup Completed', module: 'System', category: 'system',
    severity: 'INFO', status: 'Completed', ip: '127.0.0.1',
    description: 'Daily platform database backup completed successfully.',
    device: 'Server', browser: 'N/A'
  },
  {
    id: 'LOG-2026-1835', datetime: '2026-07-10 08:15:27', user: 'Ravi Kumar', role: 'Receiver',
    activity: 'Application Submitted', module: 'Financial Assistance', category: 'user',
    severity: 'INFO', status: 'Pending', ip: '192.168.2.88',
    description: 'Emergency medical assistance application APP-2026-004 submitted for review.',
    device: 'Android Mobile', browser: 'Chrome Mobile 126'
  },
  {
    id: 'LOG-2026-1834', datetime: '2026-07-10 07:58:19', user: 'Smile Foundation', role: 'NGO',
    activity: 'Documents Uploaded', module: 'NGO Management', category: 'ngo',
    severity: 'INFO', status: 'Under Review', ip: '192.168.5.20',
    description: 'NGO registration certificate and PAN documents uploaded for verification.',
    device: 'Windows 10 Desktop', browser: 'Firefox 128'
  },
  {
    id: 'LOG-2026-1833', datetime: '2026-07-10 07:22:55', user: 'Platform Admin', role: 'Admin',
    activity: 'Report Exported', module: 'Reports', category: 'admin',
    severity: 'INFO', status: 'Completed', ip: '10.0.0.12',
    description: 'July Donation Summary report exported as PDF.',
    device: 'macOS Sonoma', browser: 'Safari 17'
  },
  {
    id: 'LOG-2026-1832', datetime: '2026-07-10 06:45:08', user: 'System', role: 'System',
    activity: 'API Rate Limit Triggered', module: 'Security', category: 'security',
    severity: 'WARNING', status: 'Resolved', ip: '198.51.100.22',
    description: 'API rate limit threshold reached and automatically throttled.',
    device: 'Server', browser: 'N/A'
  },
  {
    id: 'LOG-2026-1831', datetime: '2026-07-10 06:12:41', user: 'System', role: 'System',
    activity: 'Payment Gateway Timeout', module: 'Donations', category: 'donation',
    severity: 'ERROR', status: 'Failed', ip: '127.0.0.1',
    description: 'Payment gateway timeout during donation processing — transaction rolled back.',
    device: 'Server', browser: 'N/A'
  }
];

export const ADMIN_LOG_ALERTS = [
  { icon: '⚠', text: 'Multiple Failed Login Attempts', type: 'warning' },
  { icon: '✅', text: 'Verification Completed — Helpage India', type: 'success' },
  { icon: '💰', text: 'Fund Released — ₹25,000', type: 'success' },
  { icon: '🏥', text: 'Emergency Request Approved', type: 'info' }
];

export const ADMIN_LOG_QUICK_STATS = [
  { label: 'Top Active User', value: 'Platform Admin', sub: '48 actions today' },
  { label: 'Most Used Module', value: 'Verification', sub: '312 events' },
  { label: 'Verifications Today', value: '18', sub: '+4 vs yesterday' },
  { label: 'Completed Donations', value: '42', sub: 'Today' },
  { label: 'Rejected Requests', value: '3', sub: 'Requires review' },
  { label: 'Most Active NGO', value: 'Asha Kiran Foundation', sub: '24 activities' }
];
