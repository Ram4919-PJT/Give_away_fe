/** Mock analytics for NGO Reports dashboard (wireframe) */

export const REPORT_TYPES = [
  { id: 'all', label: 'All Reports' },
  { id: 'donations', label: 'Donations' },
  { id: 'beneficiaries', label: 'Beneficiaries' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'financial', label: 'Financial Assistance' }
];

export const REPORT_CATEGORIES = [
  'All',
  'Clothes',
  'Food',
  'Medical',
  'Education',
  'Other'
];

export const REPORT_STATUSES = ['All', 'Approved', 'Pending', 'Completed', 'In Progress'];

export const DATE_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'Year to date' },
  { id: 'all', label: 'All time' }
];

export const DONATION_TREND = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 18 },
  { label: 'Mar', value: 15 },
  { label: 'Apr', value: 22 },
  { label: 'May', value: 28 },
  { label: 'Jun', value: 24 },
  { label: 'Jul', value: 31 }
];

export const DONATION_DISTRIBUTION = [
  { name: 'Clothes', value: 32, color: '#22C55E' },
  { name: 'Food', value: 28, color: '#16A34A' },
  { name: 'Medical', value: 18, color: '#4ADE80' },
  { name: 'Education', value: 12, color: '#86EFAC' },
  { name: 'Other', value: 10, color: '#BBF7D0' }
];

export const MONTHLY_DONATIONS = [
  { label: 'Jan', value: 42000 },
  { label: 'Feb', value: 51000 },
  { label: 'Mar', value: 47000 },
  { label: 'Apr', value: 62000 },
  { label: 'May', value: 71000 },
  { label: 'Jun', value: 68000 },
  { label: 'Jul', value: 78000 }
];

export const BENEFICIARY_STATUS = [
  { name: 'Active', value: 42, color: '#22C55E' },
  { name: 'Pending', value: 18, color: '#F59E0B' },
  { name: 'Completed', value: 31, color: '#94A3B8' },
  { name: 'On Hold', value: 9, color: '#EF4444' }
];

export const REPORT_KPI_BASE = {
  totalDonations: 156,
  itemsDistributed: 1240,
  activeBeneficiaries: 89,
  pendingRequests: 14,
  donationsDelta: '+12%',
  itemsDelta: '+8%',
  beneficiariesDelta: '+5%',
  pendingDelta: '-3%'
};

export const IMPACT_INSIGHTS = [
  { id: 'most-requested', label: 'Most Requested Category', value: 'Food & Rations' },
  { id: 'highest-month', label: 'Highest Donation Month', value: 'July 2026' },
  { id: 'fulfillment', label: 'Average Fulfillment Time', value: '36 hours' },
  { id: 'active-category', label: 'Most Active Category', value: 'Clothes' },
  { id: 'avg-value', label: 'Average Request Value', value: '₹18,450' },
  { id: 'pending', label: 'Pending Requests', value: '14' }
];

export const REPORT_TEMPLATES = [
  {
    id: 'donation',
    name: 'Donation Report',
    description: 'Summary of item and money donations received and distributed.',
    icon: 'Gift',
    lastGenerated: '2026-07-10 14:22'
  },
  {
    id: 'beneficiary',
    name: 'Beneficiary Report',
    description: 'Active cases, completion rates, and assistance outcomes.',
    icon: 'Users',
    lastGenerated: '2026-07-09 11:05'
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Stock levels, low-stock alerts, and item request activity.',
    icon: 'Package',
    lastGenerated: '2026-07-08 16:40'
  },
  {
    id: 'financial',
    name: 'Financial Assistance Report',
    description: 'Fund requests, approvals, and disbursement timelines.',
    icon: 'Banknote',
    lastGenerated: '2026-07-07 09:18'
  }
];

export const RECENT_REPORTS = [
  {
    id: 'rr-1',
    name: 'Donation Report',
    generatedBy: 'Admin Desk',
    date: '2026-07-10',
    format: 'PDF',
    status: 'Ready'
  },
  {
    id: 'rr-2',
    name: 'Beneficiary Report',
    generatedBy: 'NGO Manager',
    date: '2026-07-09',
    format: 'Excel',
    status: 'Ready'
  },
  {
    id: 'rr-3',
    name: 'Inventory Report',
    generatedBy: 'Warehouse Lead',
    date: '2026-07-08',
    format: 'PDF',
    status: 'Ready'
  },
  {
    id: 'rr-4',
    name: 'Financial Assistance Report',
    generatedBy: 'Finance Desk',
    date: '2026-07-07',
    format: 'Excel',
    status: 'Processing'
  }
];

export const INITIAL_REPORT_FILTERS = {
  dateRange: '30d',
  reportType: 'all',
  category: 'All',
  status: 'All'
};

/** Scale mock series based on filters so charts react to UI changes */
export function getFilteredAnalytics(filters) {
  const rangeFactor = {
    '7d': 0.35,
    '30d': 0.7,
    '90d': 0.9,
    ytd: 1,
    all: 1.1
  }[filters.dateRange] || 1;

  const typeFactor = filters.reportType === 'all' ? 1 : 0.85;
  const categoryFactor = filters.category === 'All' ? 1 : 0.75;
  const statusFactor = filters.status === 'All' ? 1 : 0.8;
  const factor = rangeFactor * typeFactor * categoryFactor * statusFactor;

  const scale = (n) => Math.max(1, Math.round(n * factor));

  const trend = DONATION_TREND.map((d) => ({ ...d, value: scale(d.value) }));
  const monthly = MONTHLY_DONATIONS.map((d) => ({ ...d, value: scale(d.value / 1000) * 1000 }));

  let distribution = DONATION_DISTRIBUTION.map((d) => ({
    ...d,
    value: scale(d.value)
  }));
  if (filters.category !== 'All') {
    distribution = distribution.map((d) =>
      d.name === filters.category ? { ...d, value: Math.max(d.value, 20) } : { ...d, value: Math.max(2, Math.round(d.value * 0.35)) }
    );
  }

  let beneficiaryStatus = BENEFICIARY_STATUS.map((d) => ({
    ...d,
    value: scale(d.value)
  }));
  if (filters.status !== 'All') {
    const match = filters.status === 'In Progress' ? 'Active' : filters.status;
    beneficiaryStatus = beneficiaryStatus.map((d) =>
      d.name === match || (match === 'Approved' && d.name === 'Completed')
        ? { ...d, value: Math.max(d.value, 12) }
        : { ...d, value: Math.max(2, Math.round(d.value * 0.4)) }
    );
  }

  const kpis = {
    totalDonations: scale(REPORT_KPI_BASE.totalDonations),
    itemsDistributed: scale(REPORT_KPI_BASE.itemsDistributed),
    activeBeneficiaries: scale(REPORT_KPI_BASE.activeBeneficiaries),
    pendingRequests: Math.max(1, scale(REPORT_KPI_BASE.pendingRequests)),
    donationsDelta: REPORT_KPI_BASE.donationsDelta,
    itemsDelta: REPORT_KPI_BASE.itemsDelta,
    beneficiariesDelta: REPORT_KPI_BASE.beneficiariesDelta,
    pendingDelta: REPORT_KPI_BASE.pendingDelta
  };

  const insights = IMPACT_INSIGHTS.map((item) => {
    if (item.id === 'pending') return { ...item, value: String(kpis.pendingRequests) };
    if (item.id === 'most-requested' && filters.category !== 'All') {
      return { ...item, value: filters.category };
    }
    return item;
  });

  const hasData = trend.some((d) => d.value > 0);

  return {
    kpis,
    trend,
    distribution,
    monthly,
    beneficiaryStatus,
    insights,
    hasData
  };
}
