export function getNgoRequests(requests, user) {
  if (!user) return [];
  const key = (user.email || '').toLowerCase();
  return (requests || []).filter((r) => (r.ngoEmail || '').toLowerCase() === key);
}

export function getNgoStats(requests, beneficiaries, verified, submitted) {
  const approved = requests.filter((r) => r.status === 'Approved').length;
  const underReview = requests.filter((r) => r.status === 'Under Review').length;
  return {
    donationRequests: requests.length,
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
  const latestReq = requests[0];
  const latestNotif = (notifications || [])[0];

  if (latestReq) {
    items.push({
      id: 'act-req',
      label: 'Request Submitted',
      detail: `${latestReq.id} · ${latestReq.category || latestReq.type}`,
      time: 'Today',
      icon: 'send'
    });
  }
  if (latestNotif) {
    items.push({
      id: 'act-notif',
      label: latestNotif.title,
      detail: latestNotif.message,
      time: latestNotif.time?.includes('hour') ? 'Today' : latestNotif.time || 'Yesterday',
      icon: latestNotif.icon || 'bell'
    });
  }
  items.push({
    id: 'act-approved',
    label: 'Donation Approved',
    detail: 'NGO-REQ-002 financial assistance approved.',
    time: '2 Days Ago',
    icon: 'circle-check'
  });

  return items.slice(0, 4);
}
