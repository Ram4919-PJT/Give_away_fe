/** Mock data for Reports & Analytics dashboard wireframe */

export const ADMIN_REPORTS_SUMMARY = {
  totalReports: 248,
  reportsThisMonth: 32,
  scheduledReports: 7,
  totalDonations: 1248,
  fundsDistributed: 920000,
  activeNgos: 24
};

export const ADMIN_REPORTS_TRENDS = {
  totalReports: '+14% vs last quarter',
  reportsThisMonth: '+8 this month',
  scheduledReports: '3 due this week',
  totalDonations: '+18% MoM',
  fundsDistributed: '+15% disbursements',
  activeNgos: '+3 new partners'
};

export const ADMIN_REPORT_CATEGORIES = [
  { id: 'donation', emoji: '📦', label: 'Donation Reports' },
  { id: 'fund', emoji: '💰', label: 'Fund Reports' },
  { id: 'ngo', emoji: '🏢', label: 'NGO Reports' },
  { id: 'beneficiary', emoji: '👥', label: 'Beneficiary Reports' },
  { id: 'platform', emoji: '📈', label: 'Platform Analytics' }
];

export const ADMIN_REPORTS_DONATION = {
  kpis: [
    { label: 'Money Donations', value: 842, trend: '+12%', accent: 'blue' },
    { label: 'Item Donations', value: 406, trend: '+6%', accent: 'green' },
    { label: 'Completed', value: 1089, trend: '+9%', accent: 'green' },
    { label: 'Pending', value: 98, trend: '-4%', accent: 'orange' },
    { label: 'Cancelled', value: 61, trend: '-2%', accent: 'red' }
  ],
  monthlyTrend: [82, 95, 88, 110, 102, 118, 125, 132, 128, 140, 135, 148],
  donationTypes: [
    { label: 'Money', pct: 58, color: '#2563EB' },
    { label: 'Items', pct: 32, color: '#22C55E' },
    { label: 'Mixed', pct: 10, color: '#F59E0B' }
  ],
  topDonors: [
    { name: 'Corporate CSR', amount: 185000 },
    { name: 'Demo Donor', amount: 42000 },
    { name: 'Rajesh Mehta', amount: 28500 },
    { name: 'Anita Verma', amount: 19200 },
    { name: 'Priya Nair', amount: 15800 }
  ],
  table: [
    { id: 'RPT-DON-042', name: 'July Donation Summary', period: 'Jul 2026', records: 142, status: 'Ready' },
    { id: 'RPT-DON-041', name: 'Item Donation Audit', period: 'Jun 2026', records: 89, status: 'Ready' },
    { id: 'RPT-DON-040', name: 'Top Donors Q2', period: 'Q2 2026', records: 50, status: 'Generated' },
    { id: 'RPT-DON-039', name: 'Pending Donations', period: 'Jul 2026', records: 98, status: 'Draft' }
  ]
};

export const ADMIN_REPORTS_FUND = {
  kpis: [
    { label: 'Funds Received', value: '₹24.5L', trend: '+12%', accent: 'blue' },
    { label: 'Funds Allocated', value: '₹12L', trend: '+8%', accent: 'purple' },
    { label: 'Funds Distributed', value: '₹9.2L', trend: '+15%', accent: 'green' },
    { label: 'Remaining Balance', value: '₹6.8L', trend: 'Stable', accent: 'orange' }
  ],
  incomeVsDistribution: {
    income: [120, 145, 132, 168, 155, 185, 172, 198, 210, 225, 218, 240],
    distribution: [95, 110, 88, 125, 102, 140, 128, 148, 155, 168, 162, 175]
  },
  categoryAllocation: [
    { label: 'Medical', pct: 28, color: '#2563EB' },
    { label: 'Education', pct: 20, color: '#22C55E' },
    { label: 'Emergency', pct: 18, color: '#F59E0B' },
    { label: 'Welfare', pct: 14, color: '#8B5CF6' },
    { label: 'Other', pct: 20, color: '#64748B' }
  ],
  utilization: 74,
  table: [
    { id: 'RPT-FND-018', name: 'Fund Allocation Report', period: 'Jul 2026', amount: '₹12L', status: 'Ready' },
    { id: 'RPT-FND-017', name: 'Disbursement Summary', period: 'Jun 2026', amount: '₹9.2L', status: 'Ready' },
    { id: 'RPT-FND-016', name: 'Category Utilization', period: 'Q2 2026', amount: '—', status: 'Generated' }
  ]
};

export const ADMIN_REPORTS_NGO = {
  kpis: [
    { label: 'Verified NGOs', value: 22, trend: '+2', accent: 'green' },
    { label: 'Pending Verification', value: 6, trend: 'Review', accent: 'orange' },
    { label: 'Top Performing', value: 8, trend: 'Q2', accent: 'blue' },
    { label: 'Active NGOs', value: 24, trend: '+3', accent: 'purple' }
  ],
  performance: [72, 85, 78, 92, 88, 95, 90, 87, 93, 96, 91, 98],
  requestsCompleted: [45, 52, 48, 58, 55, 62, 60, 57, 65, 68, 63, 70],
  beneficiariesServed: [320, 380, 350, 420, 400, 450, 430, 410, 460, 480, 455, 490],
  regional: [
    { region: 'Maharashtra', pct: 32, color: '#2563EB' },
    { region: 'Delhi NCR', pct: 24, color: '#22C55E' },
    { region: 'Karnataka', pct: 18, color: '#F59E0B' },
    { region: 'Other', pct: 26, color: '#8B5CF6' }
  ],
  table: [
    { id: 'RPT-NGO-012', name: 'NGO Performance Q2', period: 'Q2 2026', ngos: 24, status: 'Ready' },
    { id: 'RPT-NGO-011', name: 'Verification Pipeline', period: 'Jul 2026', ngos: 6, status: 'Draft' },
    { id: 'RPT-NGO-010', name: 'Regional Distribution', period: 'H1 2026', ngos: 24, status: 'Generated' }
  ]
};

export const ADMIN_REPORTS_BENEFICIARY = {
  kpis: [
    { label: 'Total Beneficiaries', value: '12,480', trend: '+9%', accent: 'blue' },
    { label: 'Medical', value: '3,840', trend: '31%', accent: 'green' },
    { label: 'Education', value: '2,960', trend: '24%', accent: 'purple' },
    { label: 'Emergency', value: '1,880', trend: '15%', accent: 'orange' },
    { label: 'Women & Child', value: '1,520', trend: '12%', accent: 'blue' },
    { label: 'Senior Citizens', value: '1,280', trend: '10%', accent: 'green' },
    { label: 'Disability', value: 1000, trend: '8%', accent: 'red' }
  ],
  categoryDistribution: [
    { label: 'Medical', pct: 31, color: '#2563EB' },
    { label: 'Education', pct: 24, color: '#22C55E' },
    { label: 'Emergency', pct: 15, color: '#F59E0B' },
    { label: 'Women & Child', pct: 12, color: '#8B5CF6' },
    { label: 'Senior', pct: 10, color: '#06B6D4' },
    { label: 'Disability', pct: 8, color: '#EF4444' }
  ],
  monthlyBeneficiaries: [820, 880, 910, 950, 980, 1020, 1050, 1080, 1100, 1140, 1180, 1220],
  aidDistribution: [65, 72, 68, 78, 75, 82, 80, 77, 85, 88, 84, 90],
  table: [
    { id: 'RPT-BEN-009', name: 'Beneficiary Impact Report', period: 'Jul 2026', count: 12480, status: 'Ready' },
    { id: 'RPT-BEN-008', name: 'Category Breakdown', period: 'Q2 2026', count: 11800, status: 'Generated' }
  ]
};

export const ADMIN_REPORTS_PLATFORM = {
  kpis: [
    { label: 'Total Users', value: '2,410', trend: '+11%', accent: 'blue' },
    { label: 'Donors', value: 245, trend: '+8%', accent: 'green' },
    { label: 'Receivers', value: 132, trend: '+12%', accent: 'orange' },
    { label: 'NGOs', value: 28, trend: '+3', accent: 'purple' },
    { label: 'Admins', value: 5, trend: 'Stable', accent: 'blue' }
  ],
  userGrowth: [180, 195, 210, 225, 240, 255, 268, 282, 295, 310, 325, 340],
  monthlyRegistrations: [42, 48, 45, 52, 50, 58, 55, 60, 62, 68, 65, 72],
  verificationRate: 87,
  donationSuccessRate: 94,
  timeline: [
    { event: 'Platform milestone: 2,000 users', date: '2026-07-01' },
    { event: 'Record monthly donations', date: '2026-06-28' },
    { event: '12 NGOs verified in Q2', date: '2026-06-15' },
    { event: 'Fund disbursement peak', date: '2026-06-01' }
  ],
  table: [
    { id: 'RPT-PLT-006', name: 'Platform Analytics Monthly', period: 'Jul 2026', metric: '2,410 users', status: 'Ready' },
    { id: 'RPT-PLT-005', name: 'User Growth Report', period: 'H1 2026', metric: '+340 new', status: 'Generated' }
  ]
};

export const ADMIN_REPORT_RECENT_EXPORTS = [
  { id: 'EXP-089', name: 'July Donation Summary', generatedBy: 'Platform Admin', date: '2026-07-10', format: 'PDF' },
  { id: 'EXP-088', name: 'Fund Allocation Report', generatedBy: 'Platform Admin', date: '2026-07-09', format: 'Excel' },
  { id: 'EXP-087', name: 'NGO Performance Q2', generatedBy: 'Review Team A', date: '2026-07-08', format: 'PDF' },
  { id: 'EXP-086', name: 'Beneficiary Impact', generatedBy: 'Platform Admin', date: '2026-07-07', format: 'PDF' },
  { id: 'EXP-085', name: 'Platform Analytics', generatedBy: 'Platform Admin', date: '2026-07-05', format: 'Excel' }
];

export const ADMIN_REPORT_QUICK_ACTIONS = [
  { id: 'monthly', label: 'Generate Monthly Report' },
  { id: 'annual', label: 'Generate Annual Report' },
  { id: 'financial', label: 'Download Financial Statement' },
  { id: 'weekly', label: 'Schedule Weekly Report' }
];

export const CATEGORY_DATA = {
  donation: ADMIN_REPORTS_DONATION,
  fund: ADMIN_REPORTS_FUND,
  ngo: ADMIN_REPORTS_NGO,
  beneficiary: ADMIN_REPORTS_BENEFICIARY,
  platform: ADMIN_REPORTS_PLATFORM
};
