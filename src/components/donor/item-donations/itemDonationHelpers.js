export const APPROVED_STATUSES = new Set([
  'AVAILABLE',
  'APPROVED',
  'LISTED',
  'COMPLETED',
  'DISTRIBUTED',
  'RECEIVED',
  'PICKUP_SCHEDULED',
  'ACCEPTED',
]);

export const PENDING_STATUSES = new Set([
  'PENDING_VERIFICATION',
  'SUBMITTED',
  'UNDER_REVIEW',
]);

export const REQUESTED_STATUSES = new Set([
  'REQUESTED',
  'RESERVED',
  'FULFILLMENT_IN_PROGRESS',
  'UNAVAILABLE',
]);

export const REJECTED_STATUSES = new Set(['REJECTED']);

export const DRAFT_STATUSES = new Set(['DRAFT', 'CANCELLED']);

export const ITEM_TABS = [
  { id: 'all', label: 'All Items' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'requested', label: 'Requested' },
  { id: 'rejected', label: 'Rejected' },
];

const CONDITION_LABELS = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  USED: 'Used',
  NEEDS_REPAIR: 'Needs Repair',
};

export function formatCondition(value) {
  if (!value) return '—';
  return CONDITION_LABELS[value] || String(value).replace(/_/g, ' ');
}

export function formatItemDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getItemPhoto(item) {
  return item?.photo_urls?.[0] || item?.documents?.[0]?.file_url || null;
}

export function getItemTabGroup(item) {
  const status = (item?.status || '').toUpperCase();
  if (REJECTED_STATUSES.has(status)) return 'rejected';
  if (PENDING_STATUSES.has(status)) return 'pending';
  if (DRAFT_STATUSES.has(status)) return 'draft';
  if (REQUESTED_STATUSES.has(status) || Number(item?.request_count) > 0) return 'requested';
  if (APPROVED_STATUSES.has(status)) return 'approved';
  return 'other';
}

export function computeItemStats(items) {
  const list = Array.isArray(items) ? items : [];
  let approved = 0;
  let pending = 0;
  let requested = 0;
  let rejected = 0;

  for (const item of list) {
    const group = getItemTabGroup(item);
    if (group === 'approved') approved += 1;
    else if (group === 'pending' || group === 'draft') pending += 1;
    else if (group === 'requested') requested += 1;
    else if (group === 'rejected') rejected += 1;
  }

  return {
    total: list.length,
    approved,
    pending,
    requested,
    rejected,
  };
}

export function getUniqueCategories(items) {
  const set = new Set();
  for (const item of items || []) {
    if (item?.category) set.add(item.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getUniqueConditions(items) {
  const set = new Set();
  for (const item of items || []) {
    if (item?.condition) set.add(item.condition);
  }
  return [...set].sort();
}

export function filterAndSortItems(items, { tab, search, category, condition, sort }) {
  let result = [...(items || [])];

  if (tab && tab !== 'all') {
    result = result.filter((item) => {
      const group = getItemTabGroup(item);
      if (tab === 'pending') return group === 'pending' || group === 'draft';
      return group === tab;
    });
  }

  const q = (search || '').trim().toLowerCase();
  if (q) {
    result = result.filter((item) => {
      const hay = [
        item.item_name,
        item.category,
        item.subcategory,
        item.description,
        item.brand,
        item.model_variant,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  if (category && category !== 'all') {
    result = result.filter((item) => item.category === category);
  }

  if (condition && condition !== 'all') {
    result = result.filter((item) => item.condition === condition);
  }

  result.sort((a, b) => {
    if (sort === 'name') {
      return (a.item_name || a.category || '').localeCompare(b.item_name || b.category || '');
    }
    if (sort === 'oldest') {
      const da = new Date(a.submitted_at || a.reviewed_at || 0).getTime();
      const db = new Date(b.submitted_at || b.reviewed_at || 0).getTime();
      return da - db || a.item_donation_id - b.item_donation_id;
    }
    const da = new Date(a.submitted_at || a.reviewed_at || 0).getTime();
    const db = new Date(b.submitted_at || b.reviewed_at || 0).getTime();
    return db - da || b.item_donation_id - a.item_donation_id;
  });

  return result;
}

export function getEmptyStateCopy(tab) {
  const map = {
    all: {
      title: 'No donation items yet',
      description: "List items you'd like to donate. They'll be reviewed before receivers can request them.",
    },
    approved: {
      title: 'No approved donation items yet',
      description: 'Items approved by our team will appear here.',
    },
    pending: {
      title: 'No items waiting for review',
      description: 'Submitted items awaiting admin verification will show up here.',
    },
    requested: {
      title: 'No donation requests yet',
      description: 'When receivers request your approved items, they will appear here.',
    },
    rejected: {
      title: 'No rejected items',
      description: 'Items that were not approved will be listed here with the reason provided.',
    },
  };
  return map[tab] || map.all;
}
