import { APPLY_ASSISTANCE_CATEGORIES } from '../data/receiverApplyConfig';

export function getReceiverApps(apps, user) {
  if (!user) return [];
  const key = (user.email || '').toLowerCase();
  return (apps || []).filter((a) => (a.receiverEmail || '').toLowerCase() === key);
}

export function getReceiverStats(apps) {
  const list = apps || [];
  return {
    submitted: list.filter((a) => a.status !== 'Draft').length,
    underReview: list.filter((a) => ['Submitted', 'Documents Verified', 'Under Review'].includes(a.status)).length,
    approved: list.filter((a) => ['Approved', 'Assigned', 'Funds Released', 'Completed'].includes(a.status)).length,
    rejected: list.filter((a) => a.status === 'Rejected').length
  };
}

export function statusBadgeClass(status) {
  const map = {
    Draft: 'receiver-status-badge--draft',
    Submitted: 'receiver-status-badge--submitted',
    'Documents Verified': 'receiver-status-badge--submitted',
    'Under Review': 'receiver-status-badge--admin-review',
    Approved: 'receiver-status-badge--approved',
    Assigned: 'receiver-status-badge--approved',
    'Funds Released': 'receiver-status-badge--funds',
    Completed: 'receiver-status-badge--completed',
    Rejected: 'receiver-status-badge--rejected'
  };
  return map[status] || 'receiver-status-badge--draft';
}

export function getTimelineIndex(status) {
  if (status === 'Rejected') return -1;
  const steps = ['Submitted', 'Documents Verified', 'Under Review', 'Approved', 'Assigned', 'Funds Released', 'Completed'];
  const idx = steps.indexOf(status);
  if (idx >= 0) return idx;
  if (status === 'Draft') return -1;
  return 1;
}

export function buildApplicationTimeline(status, date) {
  const steps = ['Submitted', 'Documents Verified', 'Under Review', 'Approved', 'Assigned', 'Funds Released', 'Completed'];
  const idx = getTimelineIndex(status);
  return steps.map((step, i) => ({
    step,
    done: idx >= 0 && i < idx,
    active: i === idx,
    rejected: status === 'Rejected' && i === 2,
    date: i <= idx ? date : ''
  }));
}

export function getCardTimelineIndex(status) {
  const map = {
    Draft: -1,
    Submitted: 0,
    'Documents Verified': 1,
    'Under Review': 1,
    Approved: 2,
    Assigned: 2,
    'Funds Released': 3,
    Completed: 4,
    Rejected: -1
  };
  return map[status] ?? 0;
}

export function applicationStatusClass(status) {
  const map = {
    Draft: 'receiver-app-status--draft',
    Submitted: 'receiver-app-status--submitted',
    'Documents Verified': 'receiver-app-status--submitted',
    'Under Review': 'receiver-app-status--review',
    Approved: 'receiver-app-status--approved',
    Assigned: 'receiver-app-status--approved',
    'Funds Released': 'receiver-app-status--funds',
    Completed: 'receiver-app-status--completed',
    Rejected: 'receiver-app-status--rejected'
  };
  return map[status] || 'receiver-app-status--draft';
}

export function buildReceiverApplicationFromFlow({ categoryId, form, user }) {
  const cat = APPLY_ASSISTANCE_CATEGORIES.find((c) => c.id === categoryId);
  const year = new Date().getFullYear();
  const id = `APP-${year}-${String(Date.now()).slice(-5)}`;
  const appliedDate = new Date().toISOString().split('T')[0];
  const amountRaw = String(form.amount || '').replace(/[^\d.]/g, '');

  return {
    id,
    receiverEmail: user?.email || '',
    receiverName: user?.name || 'Receiver',
    assistanceType: cat?.title || 'Financial Assistance',
    assistanceIcon: cat?.icon || '📋',
    purpose: form.purpose?.trim() || 'Financial assistance request',
    amount: Number(amountRaw) || 0,
    description: form.description?.trim() || '',
    notes: form.notes?.trim() || '',
    status: 'Submitted',
    appliedDate,
    documents: {
      'Aadhaar Card': { filename: 'aadhaar_card.pdf', uploaded: true },
      'Income Certificate': { filename: 'income_certificate.pdf', uploaded: true },
      'Supporting Document': { filename: 'supporting_document.pdf', uploaded: true }
    },
    rejectionReason: null,
    reviewNotes: 'Your application is queued for initial review by the AJA Abayahastham verification team.'
  };
}

export function getInitials(name) {
  return (name || 'R')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
