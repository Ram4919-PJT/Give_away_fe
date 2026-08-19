export function getNgoRequests(requests, user) {
  if (!user) return [];
  const key = String(user.email || '').toLowerCase();
  return (Array.isArray(requests) ? requests : []).filter(
    (r) => String(r.ngoEmail ?? '').toLowerCase() === key
  );
}

export function getNgoStats(requests, beneficiaries, verified, submitted) {
  const list = Array.isArray(requests) ? requests : [];
  const approved = list.filter((r) => r.status === 'Approved').length;
  const underReview = list.filter((r) => r.status === 'Under Review').length;
  return {
    donationRequests: list.length,
    approved,
    underReview,
    beneficiaries: verified ? (beneficiaries?.length || 0) : 0,
    pendingVerification: submitted ? 0 : verified ? 0 : 1
  };
}

export function requestStatusClass(status) {
  const map = {
    Draft: 'ngo-dash-badge--draft',
    Submitted: 'ngo-dash-badge--submitted',
    'Under Review': 'ngo-dash-badge--review',
    Approved: 'ngo-dash-badge--approved',
    Rejected: 'ngo-dash-badge--rejected',
    Processing: 'ngo-dash-badge--processing',
    Completed: 'ngo-dash-badge--completed'
  };
  return map[status] || 'ngo-dash-badge--submitted';
}

export function notificationStatusClass(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('approved')) return 'ngo-dash-badge--approved';
  if (t.includes('review')) return 'ngo-dash-badge--review';
  if (t.includes('verification') || t.includes('complete')) return 'ngo-dash-badge--pending';
  return 'ngo-dash-badge--submitted';
}

export function formatRequestAmount(req) {
  if (req.amount != null) return `₹${Number(req.amount).toLocaleString('en-IN')}`;
  if (req.quantity != null) return `${req.quantity} items`;
  return '—';
}

const BENEFICIARY_CATEGORIES = [
  { id: 'medical', label: 'Medical', color: '#2563EB', match: /medical|health/i },
  { id: 'education', label: 'Education', color: '#22C55E', match: /education|school/i },
  { id: 'emergency', label: 'Emergency', color: '#F59E0B', match: /emergency|relief|food/i },
  { id: 'welfare', label: 'Women & Child Welfare', color: '#8B5CF6', match: /shelter|women|child|family/i }
];

export function getBeneficiaryCategoryStats(beneficiaries) {
  const list = beneficiaries || [];
  const total = list.length || 1;
  return BENEFICIARY_CATEGORIES.map((cat) => {
    const count = list.filter((b) => cat.match.test(b.type || '')).length;
    const pct = total ? Math.round((count / total) * 100) : 0;
    return { ...cat, count, pct: count ? Math.max(pct, 12) : 0 };
  });
}

export function buildActivityTimeline(requests, notifications) {
  const items = [];
  (requests || []).slice(0, 3).forEach((req, index) => {
    items.push({
      id: `act-req-${req.id || index}`,
      label: req.status === 'Approved' ? 'Request approved' : 'Request submitted',
      detail: `${req.id} · ${req.category || req.type}`,
      at: req.appliedDate || null,
      icon: 'send',
    });
  });
  (notifications || []).slice(0, 2).forEach((notif, index) => {
    items.push({
      id: `act-notif-${notif.id || index}`,
      label: notif.title,
      detail: notif.message,
      at: notif.created_at || null,
      icon: notif.icon || 'bell',
    });
  });
  return items.slice(0, 6);
}
