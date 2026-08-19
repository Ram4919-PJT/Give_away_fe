export const ACTIVE_REQUEST_STATUSES = new Set([
  'PENDING',
  'ACCEPTED',
  'RESERVED',
  'FULFILLMENT_IN_PROGRESS',
]);

export const REQUEST_STATUS_TABS = [
  { id: 'ALL', label: 'All Requests' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ACCEPTED', label: 'Approved' },
  { id: 'COMPLETED', label: 'Fulfilled' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export const REQUEST_SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'updated', label: 'Recently Updated' },
];

function normalizeStatus(status) {
  return String(status || '').toUpperCase();
}

export function getActiveRequestMap(requests = []) {
  const map = new Map();
  for (const req of requests) {
    if (ACTIVE_REQUEST_STATUSES.has(normalizeStatus(req.status))) {
      map.set(req.item_donation_id, req);
    }
  }
  return map;
}

export function computeItemRequestSummary(requests = [], availableTotal = 0) {
  let pending = 0;
  let approved = 0;
  let fulfilled = 0;
  let rejected = 0;

  for (const req of requests) {
    const status = normalizeStatus(req.status);
    if (status === 'PENDING') pending += 1;
    else if (['ACCEPTED', 'RESERVED', 'FULFILLMENT_IN_PROGRESS'].includes(status)) approved += 1;
    else if (status === 'COMPLETED') fulfilled += 1;
    else if (status === 'REJECTED') rejected += 1;
  }

  return [
    {
      key: 'available',
      label: 'Available Items',
      value: availableTotal,
      hint: 'Approved & in stock',
      tone: 'blue',
    },
    {
      key: 'pending',
      label: 'Pending Requests',
      value: pending,
      hint: 'Awaiting review',
      tone: 'amber',
    },
    {
      key: 'approved',
      label: 'Approved Requests',
      value: approved,
      hint: 'Ready to receive support',
      tone: 'green',
    },
    {
      key: 'fulfilled',
      label: 'Fulfilled Requests',
      value: fulfilled,
      hint: 'Support received',
      tone: 'purple',
    },
    {
      key: 'rejected',
      label: 'Rejected Requests',
      value: rejected,
      hint: 'Not approved',
      tone: 'red',
    },
  ];
}

export function filterItemRequests(requests = [], { status = 'ALL', search = '', sort = 'newest' } = {}) {
  const term = String(search || '').trim().toLowerCase();
  let list = [...(requests || [])];

  if (status && status !== 'ALL') {
    const target = normalizeStatus(status);
    if (target === 'ACCEPTED') {
      list = list.filter((r) => ['ACCEPTED', 'RESERVED', 'FULFILLMENT_IN_PROGRESS'].includes(normalizeStatus(r.status)));
    } else {
      list = list.filter((r) => normalizeStatus(r.status) === target);
    }
  }

  if (term) {
    list = list.filter((r) => {
      const haystack = [
        r.item_name,
        r.category,
        r.message,
        r.donor_response,
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }

  list.sort((a, b) => {
    const aCreated = new Date(a.created_at || 0).getTime();
    const bCreated = new Date(b.created_at || 0).getTime();
    const aUpdated = new Date(a.updated_at || a.created_at || 0).getTime();
    const bUpdated = new Date(b.updated_at || b.created_at || 0).getTime();
    if (sort === 'oldest') return aCreated - bCreated;
    if (sort === 'updated') return bUpdated - aUpdated;
    return bCreated - aCreated;
  });

  return list;
}

export function formatRequestDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRequestPhoto(req) {
  return req?.photo_urls?.[0] || null;
}

export function getItemPhoto(item) {
  return item?.photo_urls?.[0] || null;
}
