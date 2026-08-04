const DONATION_STATUS_MAP = {
  DRAFT: 'Draft',
  SUBMITTED: 'Pending Verification',
  CONFIRMED: 'Confirmed',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Completed',
  CANCELLED: 'Cancelled',
};

export function mapDonationStatus(status) {
  return DONATION_STATUS_MAP[status] || status;
}

export function mapDonationFromApi(donation) {
  const isMoney = donation.donation_type === 'MONEY';
  let purpose = 'General Donation';
  let amount = null;

  if (donation.notes) {
    const amountMatch = donation.notes.match(/Amount:\s*([0-9.]+)/i);
    const purposeMatch = donation.notes.match(/Purpose:\s*([^|]+)/i);
    if (amountMatch) amount = Number(amountMatch[1]);
    if (purposeMatch) purpose = purposeMatch[1].trim();
  }

  return {
    id: donation.donation_id,
    donation_id: donation.donation_id,
    donorEmail: donation.donor_user_id,
    type: isMoney ? 'Financial' : 'Items',
    donor_user_id: donation.donor_user_id,
    amount: amount || 0,
    fund: purpose,
    purpose,
    details: donation.notes || (isMoney ? 'Money donation' : 'Item donation'),
    date: donation.created_at ? String(donation.created_at).split('T')[0] : '',
    status: mapDonationStatus(donation.status),
    rawStatus: donation.status,
    paymentMethod: isMoney ? 'Online' : 'Pickup',
    livesImpacted: 0,
    familiesHelped: 0,
    usage: null,
  };
}

export function buildMoneyDonationNotes({ purpose, amount }) {
  return `Purpose: ${purpose} | Amount: ${amount} INR`;
}

export function buildItemDonationNotes({ category, description, pickupAddress, pickupDate }) {
  return `Purpose: Item donation | Category: ${category} | ${description} | Pickup: ${pickupAddress} | Date: ${pickupDate}`;
}

function relativeTime(isoDate) {
  if (!isoDate) return 'Recently';
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function notificationGroup(isoDate) {
  if (!isoDate) return 'earlier';
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  return 'earlier';
}

export function mapNotificationFromApi(notification) {
  return {
    id: notification.notification_id,
    notification_id: notification.notification_id,
    title: notification.title,
    message: notification.body,
    read: notification.status === 'READ',
    time: relativeTime(notification.created_at),
    group: notificationGroup(notification.created_at),
    icon: 'bell',
    created_at: notification.created_at,
  };
}

const VERIFICATION_STATUS_MAP = {
  PENDING: 'Pending',
  IN_REVIEW: 'Under Review',
  APPROVED: 'Verified',
  REJECTED: 'Rejected',
};

const ENTITY_TYPE_MAP = {
  DONOR: 'Donor',
  RECEIVER: 'Receiver',
  NGO: 'NGO',
};

export function mapVerificationFromApi(request) {
  const type = ENTITY_TYPE_MAP[request.entity_type] || request.entity_type;
  const label = `${type} verification`;
  return {
    id: request.verification_request_id,
    verification_request_id: request.verification_request_id,
    type,
    entity_id: request.entity_id,
    user_id: request.user_id,
    status: VERIFICATION_STATUS_MAP[request.status] || request.status,
    rawStatus: request.status,
    submitted: request.submitted_at,
    notes: request.notes,
    name: label,
    avatar: type?.charAt(0) || '?',
    email: '',
    phone: '',
    documents: [],
  };
}

export function mapProgramFromApi(program) {
  return {
    id: program.program_id,
    program_id: program.program_id,
    title: program.title,
    description: program.description || '',
    status: program.status,
    created_at: program.created_at,
  };
}

const ASSISTANCE_STATUS_MAP = {
  OPEN: 'Submitted',
  MATCHED: 'Under Review',
  FULFILLED: 'Completed',
  CLOSED: 'Completed',
  CANCELLED: 'Rejected',
};

function parseAssistanceDescription(description = '') {
  const purposeMatch = description.match(/Purpose:\s*([^|]+)/i);
  const amountMatch = description.match(/Amount:\s*([0-9.]+)/i);
  const categoryMatch = description.match(/Category:\s*([^|]+)/i);
  const notesMatch = description.match(/Notes:\s*([^|]+)/i);
  const detailsMatch = description.match(/Details:\s*(.+)$/i);
  return {
    purpose: purposeMatch?.[1]?.trim() || '',
    amount: amountMatch ? Number(amountMatch[1]) : 0,
    category: categoryMatch?.[1]?.trim() || '',
    notes: notesMatch?.[1]?.trim() || '',
    details: detailsMatch?.[1]?.trim() || description,
  };
}

export function mapAssistanceRequestFromApi(request) {
  const parsed = parseAssistanceDescription(request.description || '');
  const status = ASSISTANCE_STATUS_MAP[request.status] || request.status;
  return {
    id: request.assistance_request_id,
    assistance_request_id: request.assistance_request_id,
    receiver_user_id: request.receiver_user_id,
    receiverEmail: request.receiver_user_id,
    assistanceType: parsed.category || request.title,
    purpose: parsed.purpose || request.title,
    amount: parsed.amount,
    description: parsed.details,
    notes: parsed.notes,
    status,
    rawStatus: request.status,
    appliedDate: request.created_at ? String(request.created_at).split('T')[0] : '',
    assistanceIcon: '📋',
    rejectionReason: request.status === 'CANCELLED' ? 'Application was cancelled or rejected.' : null,
    reviewNotes:
      request.status === 'OPEN'
        ? 'Your application is queued for initial review by the AJA Abayahastham verification team.'
        : null,
  };
}

export function buildAssistanceRequestPayload({ categoryId, categoryTitle, form }) {
  const amountRaw = String(form?.amount || '').replace(/[^\d.]/g, '');
  const purpose = form?.purpose?.trim() || 'Financial assistance request';
  const title = categoryTitle || purpose;
  const description = [
    categoryTitle || categoryId ? `Category: ${categoryTitle || categoryId}` : null,
    `Purpose: ${purpose}`,
    `Amount: ${amountRaw || 0} INR`,
    form?.notes?.trim() ? `Notes: ${form.notes.trim()}` : null,
    form?.description?.trim() ? `Details: ${form.description.trim()}` : null,
  ]
    .filter(Boolean)
    .join(' | ');
  return { title, description };
}
