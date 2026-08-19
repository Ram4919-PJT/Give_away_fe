import { formatCurrency } from './donorHelpers';

const RECEIVED_APP_STATUSES = new Set(['Completed', 'Funds Released']);
const ACTIVE_APP_STATUSES = new Set(['Submitted', 'Under Review', 'Documents Verified', 'Draft']);
const PENDING_APP_STATUSES = new Set(['Submitted', 'Draft']);
const APPROVED_APP_STATUSES = new Set(['Approved', 'Assigned', 'Funds Released', 'Completed']);

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'short' });
}

export function computeReceiverDashboardStats(applications = []) {
  const apps = applications || [];

  const totalReceived = apps
    .filter((a) => RECEIVED_APP_STATUSES.has(a.status))
    .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  const pending = apps.filter((a) => PENDING_APP_STATUSES.has(a.status)).length;
  const approved = apps.filter((a) => APPROVED_APP_STATUSES.has(a.status)).length;
  const active = apps.filter((a) => ACTIVE_APP_STATUSES.has(a.status)).length;
  const rejected = apps.filter((a) => a.status === 'Rejected').length;

  return [
    {
      key: 'received',
      label: 'Assistance Received',
      value: formatCurrency(totalReceived || 0),
      hint: `${apps.filter((a) => RECEIVED_APP_STATUSES.has(a.status)).length} fulfilled`,
    },
    {
      key: 'pending',
      label: 'Pending Requests',
      value: String(pending),
      hint: 'Awaiting review',
    },
    {
      key: 'approved',
      label: 'Approved Requests',
      value: String(approved),
      hint: 'Ready for fulfillment',
    },
    {
      key: 'active',
      label: 'Active Requests',
      value: String(active),
      hint: 'In progress',
    },
    {
      key: 'applications',
      label: 'Total Requests',
      value: String(apps.length),
      hint: rejected > 0 ? `${rejected} rejected` : 'All time',
    },
  ];
}

export function buildAssistanceSeries(applications = [], months = 6) {
  const buckets = new Map();
  const now = new Date();

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(monthKey(d), 0);
  }

  (applications || []).forEach((app) => {
    if (!RECEIVED_APP_STATUSES.has(app.status)) return;
    const date = parseDate(app.appliedDate || app.created_at);
    if (!date) return;
    const key = monthKey(date);
    if (!buckets.has(key)) return;
    buckets.set(key, (buckets.get(key) || 0) + (Number(app.amount) || 0));
  });

  return Array.from(buckets.entries()).map(([key, amount]) => ({
    label: monthLabel(key),
    amount,
  }));
}

export function buildCauseBreakdown(applications = []) {
  const totals = new Map();

  (applications || []).forEach((app) => {
    if (!RECEIVED_APP_STATUSES.has(app.status)) return;
    const label = app.assistanceType || app.purpose || 'General';
    totals.set(label, (totals.get(label) || 0) + (Number(app.amount) || 0));
  });

  return Array.from(totals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildRecentReceived(applications = [], limit = 5) {
  return (applications || [])
    .filter((a) => RECEIVED_APP_STATUSES.has(a.status))
    .map((a) => ({
      id: `app-${a.id}`,
      title: a.purpose || a.assistanceType || 'Financial assistance',
      subtitle: a.assistanceType || 'Financial Assistance',
      amount: Number(a.amount) || 0,
      date: a.appliedDate || a.created_at,
      status: a.status === 'Completed' ? 'Completed' : 'Approved',
      avatar: null,
      donorName: 'AJA Abayahastham',
    }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, limit);
}

export function buildActiveRequests(applications = []) {
  return (applications || [])
    .filter((a) => ACTIVE_APP_STATUSES.has(a.status))
    .map((a) => ({
      id: `app-${a.id}`,
      title: a.purpose || a.assistanceType || 'Financial assistance request',
      category: a.assistanceType || 'Financial',
      amount: Number(a.amount) || 0,
      status: a.status,
      priority: a.status === 'Under Review' ? 'Under Review' : 'Submitted',
      daysLeft: null,
      image: null,
      type: 'financial',
    }))
    .slice(0, 5);
}

export function buildImpactSnapshot(applications = []) {
  const completedApps = (applications || []).filter((a) => RECEIVED_APP_STATUSES.has(a.status));

  if (!completedApps.length) return [];

  const tiles = [
    {
      key: 'assistance',
      label: 'Assistance Grants',
      value: String(completedApps.length),
    },
  ];

  const totalAmount = completedApps.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  if (totalAmount > 0) {
    tiles.push({
      key: 'funds',
      label: 'Funds Received',
      value: formatCurrency(totalAmount),
    });
  }

  const categories = new Set(
    completedApps.map((a) => a.assistanceType || a.purpose).filter(Boolean)
  );
  if (categories.size > 0) {
    tiles.push({
      key: 'causes',
      label: 'Purpose Categories',
      value: String(categories.size),
    });
  }

  return tiles.slice(0, 4);
}

export function computeProfileCompletion(user, form = {}) {
  const checks = [
    form.name || user?.name,
    user?.email,
    form.mobile || user?.mobile,
    form.address || user?.address,
    form.city || user?.city,
    form.state || user?.state,
    user?.verified === true,
  ];
  const done = checks.filter(Boolean).length;
  return { done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
}

export function formatDisplayDate(value) {
  const d = parseDate(value);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
