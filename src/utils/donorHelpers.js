import { DONOR_JOURNEY_STEPS, DONOR_STATUS_MAP } from '../data/donorConstants';

export function getDonorDonations(donations, user) {
  if (!user) return [];
  const emailKey = (user.email || '').toLowerCase();
  const userId = user.id || user.user_id || user.userId;
  const list = donations || [];
  const matched = list.filter(
    (d) =>
      (d.donorEmail || '').toLowerCase() === emailKey
      || d.donor === user.name
      || (userId && (d.donor_user_id === userId || d.donorEmail === userId))
  );
  if (!matched.length && list.length && user.role === 'donor') return list;
  return matched;
}

export function normalizeDonorStatus(status) {
  return DONOR_STATUS_MAP[status] || status || 'Pending';
}

export function getDonorStats(donations, user) {
  const list = getDonorDonations(donations, user);
  const financial = list.filter((d) => d.type === 'Financial');
  const items = list.filter((d) => d.type === 'Items');
  const completed = list.filter((d) => normalizeDonorStatus(d.status) === 'Completed');

  return {
    totalDonations: list.length,
    itemsDonated: items.length,
    moneyDonated: financial.reduce((s, d) => s + (d.amount || 0), 0),
    completedDonations: completed.length,
  };
}

export function getJourneyIndex(status) {
  const normalized = normalizeDonorStatus(status);
  const map = {
    Pending: 0,
    Approved: 1,
    'Pickup Scheduled': 1,
    Collected: 2,
    Assigned: 3,
    Delivered: 4,
    Completed: 4
  };
  return map[normalized] ?? 0;
}

export function getDonorInitials(name) {
  return (name || 'D')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function statusBadgeClass(status) {
  const n = normalizeDonorStatus(status);
  const map = {
    Pending: 'donor-status--pending',
    Approved: 'donor-status--approved',
    'Pickup Scheduled': 'donor-status--scheduled',
    Collected: 'donor-status--collected',
    Assigned: 'donor-status--assigned',
    Delivered: 'donor-status--delivered',
    Completed: 'donor-status--completed'
  };
  return map[n] || 'donor-status--pending';
}

export function formatCurrency(amount, currency = '₹') {
  if (amount == null) return '—';
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
}

export function maskBeneficiaryName(fullName) {
  if (!fullName) return 'Beneficiary';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0].charAt(0)}.`;
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

export { DONOR_JOURNEY_STEPS };
