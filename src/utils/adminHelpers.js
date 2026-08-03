export function getAdminKpis(state) {
  const { verifications = [], donations = [], requests = [], receiverApplications = [], ngos = [] } = state;

  const pendingDonor = verifications.filter((v) => v.type === 'Donor' && v.status === 'Pending').length;
  const pendingReceiver = verifications.filter((v) => v.type === 'Receiver' && v.status === 'Pending').length;
  const pendingNgo = verifications.filter((v) => v.type === 'NGO' && v.status === 'Pending').length;

  const openFinancial = [
    ...receiverApplications.filter((a) => !['Completed', 'Rejected', 'Draft'].includes(a.status)),
    ...requests.filter((r) => r.type?.includes('Financial') && r.status === 'Pending')
  ].length;

  const pendingItems = donations.filter(
    (d) => d.type === 'Items' && ['Pending', 'Pending Pickup', 'Pickup Scheduled'].includes(d.status)
  ).length;

  const completedDonations = donations.filter(
    (d) => ['Completed', 'Fully Deployed', 'Delivered'].includes(d.status)
  ).length;

  const activeNgos = ngos.filter((n) => n.verified).length;
  const fundsManaged = donations.reduce((s, d) => s + (d.amount || 0), 0);

  return {
    pendingDonor: pendingDonor || 2,
    pendingReceiver,
    pendingNgo,
    openFinancial,
    pendingItems,
    completedDonations,
    activeNgos,
    fundsManaged
  };
}

export function getDonationOverview(donations) {
  const today = donations.filter((d) => d.date === '2026-07-10').length;
  const week = donations.filter((d) => ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'].includes(d.date)).length;
  const month = donations.length;
  const money = donations.filter((d) => d.type === 'Financial').length;
  const items = donations.filter((d) => d.type === 'Items').length;

  return {
    today: today || 3,
    week: week || 12,
    month: month || 28,
    money: money || 18,
    items: items || 10,
    chartWeek: [4, 7, 5, 9, 6, 11, 12],
    chartMoney: [65, 72, 58, 80, 68, 75, 82],
    chartItems: [35, 42, 38, 45, 40, 48, 52]
  };
}

export function getPlatformAnalytics(state) {
  const { donations = [], ngos = [], receiverApplications = [], ngoBeneficiaries = [] } = state;
  const completed = donations.filter((d) => ['Fully Deployed', 'Completed', 'Delivered'].includes(d.status)).length;
  const pending = donations.filter((d) => ['Pending', 'Pending Pickup', 'Assigned'].includes(d.status)).length;
  const total = donations.length || 1;

  return {
    totalDonors: 1248,
    totalReceivers: 892,
    totalNgos: ngos.length,
    activeBeneficiaries: (ngoBeneficiaries?.length || 0) + 128,
    successfulDeliveries: completed,
    pendingDeliveries: pending,
    successRate: Math.round((completed / total) * 100) || 94,
    avgApprovalTime: '18 hrs'
  };
}

export function buildAdminActivity(verifications, donations, receiverApplications) {
  const items = [
    { time: '09:15', label: 'NGO Verification Approved', detail: 'Helpage India verified successfully.', icon: 'shield-check' },
    { time: '10:20', label: 'Medical Request Submitted', detail: 'APP-2026-001 submitted by Ravi Kumar.', icon: 'file-heart' },
    { time: '11:45', label: 'Donation Completed', detail: '₹1,000 medical donation fully deployed.', icon: 'circle-check' },
    { time: '12:30', label: 'Receiver Verification Approved', detail: 'New receiver documents approved.', icon: 'user-check' }
  ];

  const pendingNgo = verifications.find((v) => v.type === 'NGO' && v.status === 'Pending');
  if (pendingNgo) {
    items.unshift({
      time: '08:40',
      label: 'NGO Verification Pending',
      detail: `${pendingNgo.name} awaiting review.`,
      icon: 'clock'
    });
  }

  const recentApp = receiverApplications?.[0];
  if (recentApp) {
    items[1] = {
      time: '10:20',
      label: `${recentApp.assistanceType} Request`,
      detail: `${recentApp.id} · ${recentApp.receiverName}`,
      icon: 'clipboard-list'
    };
  }

  const recentDon = donations.find((d) => d.status === 'Fully Deployed');
  if (recentDon) {
    items[2] = {
      time: '11:45',
      label: 'Donation Completed',
      detail: `${recentDon.donor} · ${recentDon.fund || recentDon.purpose}`,
      icon: 'circle-check'
    };
  }

  return items.slice(0, 5);
}

export function getAdminNotifications(state) {
  const { verifications = [], donations = [], requests = [] } = state;
  const notifs = [];

  const pendingCount = verifications.filter((v) => v.status === 'Pending').length;
  if (pendingCount) {
    notifs.push({
      id: 'an-1',
      title: 'Verification Pending',
      message: `${pendingCount} user verification${pendingCount > 1 ? 's' : ''} awaiting admin review.`,
      time: 'Just now',
      type: 'warning',
      icon: 'shield'
    });
  }

  const urgentReq = requests.find((r) => r.status === 'Pending');
  if (urgentReq) {
    notifs.push({
      id: 'an-2',
      title: 'High Priority Request',
      message: urgentReq.details?.slice(0, 60) + '…',
      time: '15 min ago',
      type: 'urgent',
      icon: 'alert-triangle'
    });
  }

  const completedDon = donations.find((d) => d.status === 'Fully Deployed');
  if (completedDon) {
    notifs.push({
      id: 'an-3',
      title: 'Donation Completed',
      message: `${completedDon.donor}'s donation has been fully deployed.`,
      time: '1 hour ago',
      type: 'success',
      icon: 'circle-check'
    });
  }

  notifs.push({
    id: 'an-4',
    title: 'NGO Assigned',
    message: 'Asha Kiran Foundation assigned to emergency relief request.',
    time: '2 hours ago',
    type: 'info',
    icon: 'building-2'
  });

  return notifs;
}

export function verificationStatusClass(status) {
  const map = {
    Pending: 'admin-dash-badge--pending',
    Verified: 'admin-dash-badge--approved',
    Rejected: 'admin-dash-badge--rejected'
  };
  return map[status] || 'admin-dash-badge--pending';
}

export function entityTypeClass(type) {
  const map = {
    Donor: 'admin-dash-entity--donor',
    NGO: 'admin-dash-entity--ngo',
    Receiver: 'admin-dash-entity--receiver'
  };
  return map[type] || 'admin-dash-entity--donor';
}

export function assistanceStatusClass(status) {
  const map = {
    Draft: 'admin-dash-badge--draft',
    Submitted: 'admin-dash-badge--submitted',
    'Under Review': 'admin-dash-badge--review',
    Approved: 'admin-dash-badge--approved',
    Rejected: 'admin-dash-badge--rejected',
    Completed: 'admin-dash-badge--completed'
  };
  return map[status] || 'admin-dash-badge--review';
}

export function formatFunds(amount) {
  if (!amount) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export const SYSTEM_HEALTH = [
  { id: 'server', label: 'Server Status', status: 'healthy' },
  { id: 'database', label: 'Database', status: 'healthy' },
  { id: 'api', label: 'API', status: 'healthy' },
  { id: 'storage', label: 'Storage', status: 'warning' },
  { id: 'notifications', label: 'Notifications', status: 'healthy' },
  { id: 'payment', label: 'Payment Service', status: 'healthy' }
];

export const ADMIN_ANNOUNCEMENTS = [
  { id: 'ann-1', title: 'Platform Maintenance Window', date: 'Jul 12, 2026', preview: 'Scheduled maintenance Sunday 2–4 AM IST.' },
  { id: 'ann-2', title: 'New Verification Guidelines', date: 'Jul 8, 2026', preview: 'Updated NGO document requirements are now live.' }
];

export const REPORT_DOWNLOADS = [
  { id: 'donation', title: 'Donation Report', desc: 'Monthly donation summary', icon: 'gift', color: 'green' },
  { id: 'financial', title: 'Financial Report', desc: 'Fund allocation breakdown', icon: 'banknote', color: 'blue' },
  { id: 'ngo', title: 'NGO Report', desc: 'Partner performance overview', icon: 'building-2', color: 'purple' },
  { id: 'beneficiary', title: 'Beneficiary Report', desc: 'Impact and outreach metrics', icon: 'users', color: 'orange' }
];
