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
  let amount = donation.amount != null ? Number(donation.amount) : null;

  if (donation.notes) {
    const amountMatch = donation.notes.match(/Amount:\s*([0-9.]+)/i);
    const purposeMatch = donation.notes.match(/Purpose:\s*([^|]+)/i);
    if (amount == null && amountMatch) amount = Number(amountMatch[1]);
    if (purposeMatch) purpose = purposeMatch[1].trim();
  }

  return {
    id: donation.donation_id,
    donation_id: donation.donation_id,
    donorEmail: donation.donor_email || donation.email || '',
    type: isMoney ? 'Financial' : 'Items',
    donor_user_id: donation.donor_user_id ?? donation.donor_id,
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

function notificationIcon(type) {
  const map = {
    DONATION: 'gift',
    CAMPAIGN: 'megaphone',
    ACCOUNT: 'shield-check',
    SYSTEM: 'bell',
    APPLICATION: 'file-text',
  };
  return map[type?.toUpperCase()] || 'bell';
}

export function mapNotificationFromApi(notification) {
  const type = notification.notification_type || 'ACCOUNT';
  return {
    id: notification.notification_id,
    notification_id: notification.notification_id,
    type,
    title: notification.title,
    message: notification.message || notification.body || '',
    read: notification.status === 'READ',
    status: notification.status,
    icon: notificationIcon(type),
    created_at: notification.created_at,
    relatedEntityType: notification.related_entity_type || null,
    relatedEntityId: notification.related_entity_id ?? null,
    actionUrl: notification.action_url || null,
  };
}

const VERIFICATION_STATUS_MAP = {
  PENDING: 'Pending',
  SUBMITTED: 'Pending',
  IN_REVIEW: 'Under Review',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Verified',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

const ENTITY_TYPE_MAP = {
  DONOR: 'Donor',
  RECEIVER: 'Receiver',
  NGO: 'NGO',
};

export function mapVerificationFromApi(request) {
  const rawType = request.request_type || request.entity_type;
  const type = ENTITY_TYPE_MAP[rawType] || rawType;
  const label = `${type} verification`;
  const id = request.request_id || request.verification_request_id;
  return {
    id,
    verification_request_id: id,
    request_id: id,
    type,
    entity_id: request.entity_id || request.user_id,
    user_id: request.user_id,
    status: VERIFICATION_STATUS_MAP[request.status] || request.status,
    rawStatus: request.status,
    submitted: request.submitted_at,
    notes: request.notes,
    name: label,
    avatar: type?.charAt(0) || '?',
    email: '',
    phone: '',
    documents: request.documents || [],
  };
}

export function mapProgramFromApi(program) {
  return {
    id: program.program_id,
    program_id: program.program_id,
    title: program.program_name || program.title,
    description: program.description || '',
    status: program.status,
    category: program.category,
    created_at: program.created_at,
  };
}

const ASSISTANCE_STATUS_MAP = {
  DRAFT: 'Draft',
  OPEN: 'Submitted',
  SUBMITTED: 'Submitted',
  PENDING_REVIEW: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  MATCHED: 'Under Review',
  DOCUMENTS_VERIFIED: 'Documents Verified',
  APPROVED: 'Approved',
  BANK_DETAILS_SUBMITTED: 'Processing Payout',
  FULFILLED: 'Completed',
  COMPLETED: 'Completed',
  DISBURSED: 'Funds Released',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  ACTION_REQUIRED: 'Action Required',
};

function resolveAssistanceDisplayStatus(request) {
  const raw = (request.status || '').toUpperCase();
  const payout = (request.payout_status || '').toUpperCase();
  if (raw === 'APPROVED' && payout === 'AWAITING_BANK_DETAILS') return 'Add Bank Details';
  if (raw === 'APPROVED' && payout === 'BANK_DETAILS_SUBMITTED') return 'Processing Payout';
  if (payout === 'DISBURSED' || raw === 'DISBURSED') return 'Funds Released';
  return ASSISTANCE_STATUS_MAP[raw] || request.status;
}

function parseAssistanceDescription(description = '') {
  const purposeMatch = description.match(/Purpose:\s*([^|]+)/i);
  const amountMatch = description.match(/Amount:\s*([0-9.]+)/i);
  const categoryMatch = description.match(/Category:\s*([^|]+)/i);
  const notesMatch = description.match(/Notes:\s*([^|]+)/i);
  const breakdownMatch = description.match(/Breakdown:\s*([^|]+)/i);
  const detailsMatch = description.match(/Details:\s*(.+)$/i);
  return {
    purpose: purposeMatch?.[1]?.trim() || '',
    amount: amountMatch ? Number(amountMatch[1]) : 0,
    category: categoryMatch?.[1]?.trim() || '',
    notes: notesMatch?.[1]?.trim() || '',
    breakdown: breakdownMatch?.[1]?.trim() || '',
    details: detailsMatch?.[1]?.trim() || description,
  };
}

export function mapAssistanceRequestFromApi(request) {
  const parsed = parseAssistanceDescription(request.description || '');
  const status = resolveAssistanceDisplayStatus(request);
  const id = request.application_id || request.assistance_request_id;
  const purpose = request.purpose || parsed.purpose || request.title || 'Assistance request';
  const amount = request.amount_requested != null
    ? Number(request.amount_requested)
    : parsed.amount;
  const approvedAmount = request.amount_approved != null
    ? Number(request.amount_approved)
    : request.approved_amount != null
      ? Number(request.approved_amount)
      : null;
  const applied = request.submitted_at || request.created_at;
  const updated = request.updated_at || request.reviewed_at || applied;
  const categoryLabel = request.category || parsed.category || '';
  const idStr = String(id);
  return {
    id: idStr,
    assistance_request_id: idStr,
    application_id: idStr,
    receiver_user_id: request.receiver_id || request.receiver_user_id,
    receiverEmail: request.receiver_email || request.email || '',
    assistanceType: categoryLabel || purpose,
    purpose,
    amount,
    approvedAmount,
    description: request.expense_breakdown || parsed.breakdown || parsed.details || purpose,
    expenseBreakdown: request.expense_breakdown || parsed.breakdown || '',
    notes: request.notes || parsed.notes,
    status,
    rawStatus: request.status,
    payoutStatus: request.payout_status || null,
    needsBankDetails:
      request.status === 'APPROVED' && request.payout_status === 'AWAITING_BANK_DETAILS',
    readyForDisbursement:
      request.status === 'APPROVED'
      && ['READY_FOR_DISBURSEMENT', 'BANK_DETAILS_SUBMITTED'].includes(request.payout_status),
    disbursementReference: request.disbursement_reference || null,
    disbursedAt: request.disbursed_at || null,
    paymentDestinationType: request.payment_destination_type || null,
    bankAccountHolder: request.bank_account_holder || null,
    bankName: request.bank_name || null,
    bankIfsc: request.bank_ifsc || null,
    bankAccountLast4: request.bank_account_last4 || null,
    bankDetailsSubmittedAt: request.bank_details_submitted_at || null,
    appliedDate: applied ? String(applied).split('T')[0] : '',
    updatedDate: updated ? String(updated).split('T')[0] : '',
    assistanceIcon: '📋',
    rejectionReason: request.rejection_reason || null,
    reviewedAt: request.reviewed_at || null,
    reviewNotes:
      request.status === 'OPEN' || request.status === 'SUBMITTED'
        ? 'Your application is queued for initial review by the AJA Abayahastham verification team.'
        : null,
    documents: request.documents || [],
    actionRequiredReason: request.action_required_reason || null,
    needsAction: request.status === 'ACTION_REQUIRED',
  };
}

export function buildAssistanceRequestPayload({ categoryId, categoryTitle, form }) {
  const amountRaw = String(form?.amount || '').replace(/[^\d.]/g, '');
  const specificPurpose = form?.specificPurpose?.trim() || form?.purpose?.trim() || '';
  const purpose = specificPurpose || 'Financial assistance request';
  const title = categoryTitle || purpose;
  const breakdown = form?.expenseBreakdown?.trim() || '';
  const docNames = (form?.documents || []).map((d) => d.name).filter(Boolean);
  const description = [
    categoryTitle || categoryId ? `Category: ${categoryTitle || categoryId}` : null,
    `Purpose: ${purpose}`,
    breakdown ? `Breakdown: ${breakdown}` : null,
    `Amount: ${amountRaw || 0} INR`,
    form?.notes?.trim() ? `Notes: ${form.notes.trim()}` : null,
    docNames.length ? `Documents: ${docNames.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join(' | ');
  return {
    purpose,
    amount_requested: Number(amountRaw) || 0,
    category: categoryId || null,
    expense_breakdown: breakdown || null,
    notes: form?.notes?.trim() || null,
  };
}

export function mapInventoryFromApi(item) {
  return {
    id: item.item_id,
    item_id: item.item_id,
    name: item.description || item.category || 'Inventory item',
    category: item.category || 'General',
    qty: Number(item.quantity) || 0,
    quantity: Number(item.quantity) || 0,
    unit: 'units',
    status: item.status || 'IN_STOCK',
  };
}

export function mapBeneficiaryFromApi(row) {
  return {
    id: row.beneficiary_id,
    beneficiary_id: row.beneficiary_id,
    name: row.name,
    age: row.age,
    type: row.details || 'Beneficiary',
    status: 'Active',
    resources: row.details,
    ngo_id: row.ngo_id,
    lastUpdated: null,
  };
}

const NGO_REQUEST_STATUS_MAP = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
};

export function mapNgoItemRequestFromApi(row, ngoEmail = '') {
  return {
    id: `NGO-ITEM-${row.request_id}`,
    request_id: row.request_id,
    ngoEmail,
    type: 'Items',
    category: row.item_category,
    title: row.item_category,
    purpose: `${row.item_category} — ${row.quantity_requested} units requested`,
    quantity: row.quantity_requested,
    status: NGO_REQUEST_STATUS_MAP[row.status] || row.status,
    appliedDate: '',
  };
}

export function mapNgoFundRequestFromApi(row, ngoEmail = '') {
  return {
    id: `NGO-FUND-${row.request_id}`,
    request_id: row.request_id,
    ngoEmail,
    type: 'Financial',
    category: 'Financial Assistance',
    title: row.purpose?.slice(0, 60) || 'Fund request',
    purpose: row.purpose,
    amount: Number(row.amount_requested) || 0,
    status: NGO_REQUEST_STATUS_MAP[row.status] || row.status,
    appliedDate: '',
  };
}
