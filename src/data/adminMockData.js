import { initialNgos } from './mockData';

export const NGO_CATEGORY_TAGS = [
  'Medical', 'Education', 'Emergency', 'Women & Child Welfare',
  'Senior Citizen', 'Disability Support'
];

export const INVENTORY_CATEGORIES = [
  'Clothes', 'Books', 'Furniture', 'Electronics', 'Kitchen Items',
  'Medical Equipment', 'Educational Materials', 'Toys', 'Others'
];

export const ITEM_CONDITIONS = ['New', 'Good', 'Fair', 'Used'];
export const ITEM_STATUSES = ['Available', 'Reserved', 'Delivered', 'In Storage'];

export function enrichNgoForAdmin(ngo) {
  const state = ngo.location?.includes(',') ? ngo.location.split(',').slice(-2)[0]?.trim() : 'Maharashtra';
  return {
    ...ngo,
    contactPerson: ngo.repName || 'Priya Sharma',
    email: ngo.contact?.email || 'contact@ngo.org',
    phone: ngo.contact?.phone || '+91 98765 43210',
    state,
    operatingAreas: [ngo.city, `${ngo.city} District`, 'State-wide'],
    categoryTags: NGO_CATEGORY_TAGS.filter((_, i) => i < 3 + (ngo.id.charCodeAt(4) % 3)),
    totalBeneficiaries: ngo.peopleHelped || 0,
    requestsCompleted: Math.round((ngo.donationsReceived || 0) * 0.72),
    activeRequests: Math.max(1, Math.round((ngo.donationsReceived || 0) * 0.08)),
    dateJoined: ngo.id === 'ngo-5' ? '2026-06-15' : '2018-04-20',
    verificationStatus: ngo.verified ? 'Verified' : 'Pending Verification',
    accountStatus: ngo.verified ? 'Active' : 'Under Review'
  };
}

export function getAdminNgoList(ngos = initialNgos) {
  return ngos.map(enrichNgoForAdmin);
}

export const ADMIN_INVENTORY_ITEMS = [
  {
    id: 'inv-item-1', name: 'Winter Jackets', emoji: '🧥', category: 'Clothes', condition: 'Good',
    quantity: 15, donorName: 'Demo Donor', receivedDate: '2026-07-10', status: 'Available',
    storageLocation: 'Warehouse A — Shelf 12', assignedNgo: null, image: null
  },
  {
    id: 'inv-item-2', name: 'First Aid Kits', emoji: '🏥', category: 'Medical Equipment', condition: 'New',
    quantity: 30, donorName: 'Rajesh Mehta', receivedDate: '2026-07-08', status: 'Reserved',
    storageLocation: 'Medical Storage — Unit 3', assignedNgo: 'Asha Kiran Foundation', image: null
  },
  {
    id: 'inv-item-3', name: 'Study Books Set', emoji: '📚', category: 'Educational Materials', condition: 'Good',
    quantity: 48, donorName: 'Anita Verma', receivedDate: '2026-07-07', status: 'Available',
    storageLocation: 'Warehouse B — Shelf 4', assignedNgo: null, image: null
  },
  {
    id: 'inv-item-4', name: 'Wheelchairs', emoji: '♿', category: 'Medical Equipment', condition: 'Fair',
    quantity: 8, donorName: 'Corporate CSR Fund', receivedDate: '2026-07-05', status: 'Delivered',
    storageLocation: 'Delivered', assignedNgo: 'Helpage India', image: null
  },
  {
    id: 'inv-item-5', name: 'Kitchen Utensils', emoji: '🍳', category: 'Kitchen Items', condition: 'Good',
    quantity: 22, donorName: 'Demo Donor', receivedDate: '2026-07-09', status: 'In Storage',
    storageLocation: 'Warehouse A — Shelf 8', assignedNgo: null, image: null
  },
  {
    id: 'inv-item-6', name: 'Children Toys', emoji: '🧸', category: 'Toys', condition: 'New',
    quantity: 35, donorName: 'Sunil Patel', receivedDate: '2026-07-06', status: 'Available',
    storageLocation: 'Warehouse C — Shelf 2', assignedNgo: null, image: null
  }
];

export const ADMIN_FUND_SUMMARY = {
  totalReceived: 2450000,
  availableBalance: 680000,
  allocated: 1200000,
  distributed: 920000,
  pendingAllocation: 280000,
  monthlyDonations: 185000
};

export const ADMIN_FUND_KPI_TRENDS = {
  totalReceived: '+12% vs last month',
  availableBalance: 'Sufficient for 12 requests',
  allocated: '+8% allocation rate',
  distributed: '+15% disbursements',
  pendingAllocation: '4 releases pending',
  monthlyDonations: '+18% this month'
};

export const ADMIN_FUND_MONTHLY_TREND = [
  { month: 'Jan', donations: 142000, distributed: 98000 },
  { month: 'Feb', donations: 158000, distributed: 112000 },
  { month: 'Mar', donations: 135000, distributed: 105000 },
  { month: 'Apr', donations: 172000, distributed: 128000 },
  { month: 'May', donations: 165000, distributed: 118000 },
  { month: 'Jun', donations: 189000, distributed: 142000 },
  { month: 'Jul', donations: 185000, distributed: 135000 },
  { month: 'Aug', donations: 198000, distributed: 148000 },
  { month: 'Sep', donations: 210000, distributed: 155000 },
  { month: 'Oct', donations: 225000, distributed: 168000 },
  { month: 'Nov', donations: 218000, distributed: 162000 },
  { month: 'Dec', donations: 240000, distributed: 175000 }
];

export const ADMIN_FUND_TRANSACTIONS = [
  { id: 'TXN-2026-0142', donor: 'Demo Donor', purpose: 'Medical Support', amount: 1000, status: 'Distributed', date: '2026-07-10', category: 'Medical', ngo: 'Asha Kiran Foundation' },
  { id: 'TXN-2026-0141', donor: 'Rajesh Mehta', purpose: 'General Health Fund', amount: 500, status: 'Allocated', date: '2026-07-09', category: 'Medical', ngo: 'Helpage India' },
  { id: 'TXN-2026-0140', donor: 'Priya Nair', purpose: 'Emergency Relief', amount: 2500, status: 'Pending', date: '2026-07-08', category: 'Emergency Relief', ngo: 'Goonj Foundation' },
  { id: 'TXN-2026-0139', donor: 'Corporate CSR', purpose: 'Education Fund', amount: 15000, status: 'Distributed', date: '2026-07-07', category: 'Education', ngo: 'Akshaya Patra' },
  { id: 'TXN-2026-0138', donor: 'Demo Donor', purpose: 'Emergency Relief', amount: 300, status: 'Allocated', date: '2026-07-06', category: 'Emergency Relief', ngo: 'Uday Foundation' },
  { id: 'TXN-2026-0137', donor: 'Anita Verma', purpose: 'Women Welfare Program', amount: 5000, status: 'Distributed', date: '2026-07-05', category: 'Women & Child Welfare', ngo: 'Asha Kiran Foundation' },
  { id: 'TXN-2026-0136', donor: 'Corporate CSR', purpose: 'Senior Care Initiative', amount: 8000, status: 'Pending', date: '2026-07-04', category: 'Senior Citizens', ngo: 'Helpage India' },
  { id: 'TXN-2026-0135', donor: 'Rajesh Mehta', purpose: 'Disability Support', amount: 3500, status: 'Distributed', date: '2026-07-03', category: 'Disability Support', ngo: 'Smile Foundation' },
  { id: 'TXN-2026-0134', donor: 'Priya Nair', purpose: 'General Platform Fund', amount: 1200, status: 'Allocated', date: '2026-07-02', category: 'Other', ngo: 'Goonj Foundation' },
  { id: 'TXN-2026-0133', donor: 'Demo Donor', purpose: 'Education Scholarship', amount: 2000, status: 'Distributed', date: '2026-07-01', category: 'Education', ngo: 'Akshaya Patra' }
];

export const ADMIN_FUND_ALLOCATIONS = [
  { id: 'medical', label: 'Medical', icon: '🏥', pct: 28, color: '#2563EB', allocated: 336000, remaining: 84000 },
  { id: 'education', label: 'Education', icon: '📚', pct: 20, color: '#22C55E', allocated: 240000, remaining: 60000 },
  { id: 'emergency', label: 'Emergency Relief', icon: '🚨', pct: 18, color: '#F59E0B', allocated: 216000, remaining: 54000 },
  { id: 'welfare', label: 'Women & Child Welfare', icon: '👩‍👧', pct: 12, color: '#8B5CF6', allocated: 144000, remaining: 36000 },
  { id: 'senior', label: 'Senior Citizens', icon: '👴', pct: 10, color: '#06B6D4', allocated: 120000, remaining: 30000 },
  { id: 'disability', label: 'Disability Support', icon: '♿', pct: 7, color: '#EF4444', allocated: 84000, remaining: 21000 },
  { id: 'other', label: 'Other', icon: '📦', pct: 5, color: '#64748B', allocated: 60000, remaining: 15000 }
];

export const ADMIN_FUND_PENDING_RELEASES = [
  { id: 'REL-2026-008', receiver: 'Ravi Kumar', ngo: 'Asha Kiran Foundation', purpose: 'Medical Treatment', amount: 25000, status: 'Pending Approval', expectedDate: '2026-07-15' },
  { id: 'REL-2026-007', receiver: 'Sunita Deshmukh', ngo: 'Helpage India', purpose: 'Senior Care Support', amount: 12000, status: 'Under Review', expectedDate: '2026-07-14' },
  { id: 'REL-2026-006', receiver: 'Amit Patel', ngo: 'Akshaya Patra', purpose: 'Education Fees', amount: 8500, status: 'Approved', expectedDate: '2026-07-13' },
  { id: 'REL-2026-005', receiver: 'Meera Singh', ngo: 'Goonj Foundation', purpose: 'Emergency Relief', amount: 18000, status: 'Pending Approval', expectedDate: '2026-07-16' }
];

export const ADMIN_FUND_INSIGHTS = [
  { icon: '📈', text: 'Donations increased by 18% this month.' },
  { icon: '🏥', text: 'Medical Assistance received the highest allocation.' },
  { icon: '📚', text: 'Education requests increased this week.' },
  { icon: '💚', text: 'Available balance is sufficient for 12 pending requests.' }
];

export const ADMIN_FUND_QUICK_ACTIONS = [
  { id: 'allocate', label: 'Allocate Funds', icon: 'wallet' },
  { id: 'report', label: 'Generate Report', icon: 'file' },
  { id: 'transactions', label: 'View Transactions', icon: 'list' },
  { id: 'statement', label: 'Download Statement', icon: 'download' },
  { id: 'export', label: 'Export Analytics', icon: 'chart' }
];

export const ADMIN_USER_TAB_COUNTS = {
  donors: 245,
  receivers: 132,
  ngos: 28,
  admins: 5
};

export const ADMIN_PLATFORM_USERS = {
  donors: [
    { id: 'u-d1', name: 'Demo Donor', email: 'donor@gmail.com', role: 'Donor', verificationStatus: 'Verified', joinedDate: '2026-01-15', status: 'Active', avatar: 'DD' },
    { id: 'u-d2', name: 'Rajesh Mehta', email: 'rajesh@example.com', role: 'Donor', verificationStatus: 'Verified', joinedDate: '2026-03-20', status: 'Active', avatar: 'RM' },
    { id: 'u-d3', name: 'Anita Verma', email: 'anita@example.com', role: 'Donor', verificationStatus: 'Pending', joinedDate: '2026-07-01', status: 'Active', avatar: 'AV' }
  ],
  receivers: [
    { id: 'u-r1', name: 'Ravi Kumar', email: 'receiver@outlook.com', role: 'Receiver', verificationStatus: 'Verified', joinedDate: '2026-06-01', status: 'Active', avatar: 'RK' },
    { id: 'u-r2', name: 'Sunita Deshmukh', email: 'sunita@example.com', role: 'Receiver', verificationStatus: 'Pending', joinedDate: '2026-07-05', status: 'Active', avatar: 'SD' }
  ],
  ngos: getAdminNgoList().slice(0, 4).map((n) => ({
    id: n.id, name: n.name, email: n.contact?.email || n.email, role: 'NGO',
    verificationStatus: n.verificationStatus, joinedDate: n.dateJoined,
    status: n.accountStatus, avatar: n.logo
  })),
  admins: [
    { id: 'u-a1', name: 'Platform Admin', email: 'admin@abhayahastam.org', role: 'Admin', verificationStatus: 'Verified', joinedDate: '2025-01-01', status: 'Active', avatar: 'PA' }
  ]
};

export const ADMIN_NOTIFICATIONS_LIST = [
  { id: 'adm-n1', title: 'New NGO Verification', message: 'Smile Foundation submitted verification documents.', time: '10 min ago', group: 'today', priority: 'High', status: 'Unread', read: false, icon: 'shield', type: 'verification' },
  { id: 'adm-n2', title: 'Emergency Assistance Request', message: 'APP-2026-001 flagged as high priority medical case.', time: '25 min ago', group: 'today', priority: 'Urgent', status: 'Unread', read: false, icon: 'alert-triangle', type: 'urgent' },
  { id: 'adm-n3', title: 'Donation Assigned', message: 'Item donation assigned to Asha Kiran Foundation.', time: '1 hour ago', group: 'today', priority: 'Normal', status: 'Read', read: true, icon: 'gift', type: 'info' },
  { id: 'adm-n4', title: 'Funds Released', message: '₹1,000 medical fund released to verified beneficiary.', time: 'Yesterday', group: 'yesterday', priority: 'Normal', status: 'Read', read: true, icon: 'banknote', type: 'success' },
  { id: 'adm-n5', title: 'High Priority Case', message: 'Receiver rent support request requires immediate review.', time: 'Yesterday', group: 'yesterday', priority: 'High', status: 'Unread', read: false, icon: 'flag', type: 'urgent' },
  { id: 'adm-n6', title: 'Verification Approved', message: 'Helpage India verification completed successfully.', time: '3 days ago', group: 'earlier', priority: 'Normal', status: 'Read', read: true, icon: 'circle-check', type: 'success' }
];

export const PRIORITY_QUEUE_ITEMS = [
  { id: 'pq-1', title: 'Emergency Rent Support', entity: 'Ravi Kumar', type: 'Financial', priority: 'Urgent', status: 'Pending', date: '2026-07-10', assignee: 'Unassigned' },
  { id: 'pq-2', title: 'NGO Verification — Smile Foundation', entity: 'Smile Foundation', type: 'Verification', priority: 'High', status: 'Pending', date: '2026-07-09', assignee: 'Admin' },
  { id: 'pq-3', title: 'Winter Blankets Request', entity: 'Asha Kiran Foundation', type: 'Items', priority: 'High', status: 'Under Review', date: '2026-07-08', assignee: 'Admin' },
  { id: 'pq-4', title: 'Receiver Verification', entity: 'Sunita Deshmukh', type: 'Verification', priority: 'Normal', status: 'Pending', date: '2026-07-09', assignee: 'Unassigned' }
];

export function getInventorySummary(items = ADMIN_INVENTORY_ITEMS) {
  return {
    total: items.reduce((s, i) => s + i.quantity, 0),
    available: items.filter((i) => i.status === 'Available').reduce((s, i) => s + i.quantity, 0),
    reserved: items.filter((i) => i.status === 'Reserved').reduce((s, i) => s + i.quantity, 0),
    delivered: items.filter((i) => i.status === 'Delivered').reduce((s, i) => s + i.quantity, 0)
  };
}
