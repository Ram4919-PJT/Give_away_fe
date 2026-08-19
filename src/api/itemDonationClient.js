import { apiRequest } from './client';

const BASE = '/core';

export async function getDonorVerificationStatus() {
  return apiRequest(`${BASE}/donors/me/item-donations/verification-status`);
}

export async function listItemCategories() {
  return apiRequest(`${BASE}/item-categories`);
}

export async function listMyItemDonations() {
  return apiRequest(`${BASE}/donors/me/item-donations`);
}

export async function getMyItemDonation(id) {
  return apiRequest(`${BASE}/donors/me/item-donations/${id}`);
}

export async function createItemDonationDraft(payload) {
  return apiRequest(`${BASE}/donors/me/item-donations`, { method: 'POST', body: payload });
}

export async function updateItemDonation(id, payload) {
  return apiRequest(`${BASE}/donors/me/item-donations/${id}`, { method: 'PATCH', body: payload });
}

export async function deleteItemDonation(id) {
  return apiRequest(`${BASE}/donors/me/item-donations/${id}`, { method: 'DELETE' });
}

export async function uploadItemDocument(id, file, documentType = 'ITEM_PHOTO') {
  const form = new FormData();
  form.append('file', file);
  form.append('document_type', documentType);
  return apiRequest(`${BASE}/donors/me/item-donations/${id}/documents`, {
    method: 'POST',
    body: form,
  });
}

export async function submitItemDonation(id) {
  return apiRequest(`${BASE}/donors/me/item-donations/${id}/submit`, { method: 'POST' });
}

export async function listCatalogItems(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`${BASE}/catalog/items${qs ? `?${qs}` : ''}`);
}

export async function getCatalogItem(id) {
  return apiRequest(`${BASE}/catalog/items/${id}`);
}

export async function createItemRequest(itemDonationId, payload) {
  const qs = new URLSearchParams({ item_donation_id: itemDonationId }).toString();
  return apiRequest(`${BASE}/receivers/me/item-requests?${qs}`, { method: 'POST', body: payload });
}

export async function listMyItemRequests() {
  return apiRequest(`${BASE}/receivers/me/item-requests`);
}

export async function cancelItemRequest(requestId) {
  return apiRequest(`${BASE}/receivers/me/item-requests/${requestId}/cancel`, { method: 'POST' });
}

export async function listDonorItemRequests(itemId) {
  const qs = itemId ? `?item=${itemId}` : '';
  return apiRequest(`${BASE}/donors/me/item-requests${qs}`);
}

export async function respondToItemRequest(requestId, payload) {
  return apiRequest(`${BASE}/donors/me/item-requests/${requestId}/respond`, {
    method: 'POST',
    body: payload,
  });
}

export async function completeItemRequest(requestId) {
  return apiRequest(`${BASE}/donors/me/item-requests/${requestId}/complete`, { method: 'POST' });
}

export async function listAdminItemQueue(status) {
  const qs = status ? `?status=${status}` : '';
  return apiRequest(`${BASE}/admin/item-donations/queue${qs}`);
}

export async function getAdminItemDetail(id) {
  return apiRequest(`${BASE}/admin/item-donations/${id}`);
}

export async function reviewAdminItem(id, payload) {
  return apiRequest(`${BASE}/admin/item-donations/${id}/review`, { method: 'POST', body: payload });
}

export function statusLabel(status) {
  const map = {
    DRAFT: 'Draft',
    PENDING_VERIFICATION: 'Pending Verification',
    SUBMITTED: 'Pending Verification',
    UNDER_REVIEW: 'Under Review',
    REJECTED: 'Rejected',
    APPROVED: 'Approved',
    AVAILABLE: 'Available',
    REQUESTED: 'Requested',
    RESERVED: 'Reserved',
    UNAVAILABLE: 'Unavailable',
    FULFILLMENT_IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
  };
  return map[status] || status;
}

export function statusBadgeClass(status) {
  const s = (status || '').toUpperCase();
  if (['AVAILABLE', 'APPROVED', 'ACCEPTED', 'COMPLETED'].includes(s)) return 'idw-badge idw-badge--approved';
  if (['PENDING_VERIFICATION', 'SUBMITTED', 'UNDER_REVIEW', 'PENDING', 'REQUESTED'].includes(s)) return 'idw-badge idw-badge--pending';
  if (['REJECTED', 'CANCELLED'].includes(s)) return 'idw-badge idw-badge--rejected';
  if (['DRAFT'].includes(s)) return 'idw-badge idw-badge--draft';
  if (['RESERVED', 'FULFILLMENT_IN_PROGRESS'].includes(s)) return 'idw-badge idw-badge--requested';
  return 'idw-badge';
}
