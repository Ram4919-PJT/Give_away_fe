import { apiRequest } from './client';

const BASE = '/core/admin/applications';

export async function listAdminAssistanceQueue(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest(`${BASE}/queue${qs}`);
}

export async function getAdminAssistanceDetail(applicationId) {
  return apiRequest(`${BASE}/${applicationId}`);
}

export async function reviewAdminAssistance(applicationId, payload) {
  return apiRequest(`${BASE}/${applicationId}/review`, { method: 'POST', body: payload });
}

export async function disburseAdminAssistance(applicationId, { disbursementReference, note }) {
  return apiRequest(`${BASE}/${applicationId}/disburse`, {
    method: 'POST',
    body: {
      disbursement_reference: disbursementReference,
      note,
    },
  });
}

export function payoutStatusLabel(status) {
  const map = {
    AWAITING_BANK_DETAILS: 'Awaiting bank details',
    READY_FOR_DISBURSEMENT: 'Ready for disbursement',
    BANK_DETAILS_SUBMITTED: 'Bank details submitted',
    DISBURSED: 'Disbursed',
  };
  return map[(status || '').toUpperCase()] || status || '—';
}

export function assistanceStatusLabel(status) {
  const map = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    PENDING_REVIEW: 'Pending Review',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    FULFILLED: 'Fulfilled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return map[(status || '').toUpperCase()] || status;
}

export function assistanceStatusBadgeClass(status) {
  const s = (status || '').toUpperCase();
  if (['APPROVED', 'FULFILLED', 'COMPLETED'].includes(s)) return 'idw-badge idw-badge--approved';
  if (['SUBMITTED', 'UNDER_REVIEW', 'PENDING_REVIEW', 'OPEN'].includes(s)) return 'idw-badge idw-badge--pending';
  if (['REJECTED', 'CANCELLED'].includes(s)) return 'idw-badge idw-badge--rejected';
  return 'idw-badge';
}

export function formatInr(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
