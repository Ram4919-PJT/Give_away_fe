import { apiRequest } from './client';
import { getStoredAccessToken } from './tokenStorage';
import { getApiBase } from './client';

const BASE = '/core/verification';

export async function getMyVerification() {
  return apiRequest(`${BASE}/me`);
}

export async function getReceiverEligibility() {
  return apiRequest(`${BASE}/eligibility`);
}

export async function sendKycMobileOtp(mobile, requestId) {
  return apiRequest(`${BASE}/mobile/send-otp`, {
    method: 'POST',
    body: { mobile, request_id: requestId },
  });
}

export async function verifyKycMobileOtp(mobile, otpCode, requestId) {
  return apiRequest(`${BASE}/mobile/verify-otp`, {
    method: 'POST',
    body: { mobile, otp_code: otpCode, request_id: requestId },
  });
}

export async function createOrResumeVerification() {
  return apiRequest(`${BASE}/requests`, { method: 'POST' });
}

export async function updateVerificationDraft(requestId, payload) {
  return apiRequest(`${BASE}/requests/${requestId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function uploadVerificationDocument(requestId, documentType, file) {
  const form = new FormData();
  form.append('document_type', documentType);
  form.append('file', file);
  return apiRequest(`${BASE}/requests/${requestId}/documents`, {
    method: 'POST',
    body: form,
  });
}

export async function deleteVerificationDocument(requestId, documentId) {
  return apiRequest(`${BASE}/requests/${requestId}/documents/${documentId}`, {
    method: 'DELETE',
  });
}

export async function getKycReadiness(requestId, { consentGiven = false } = {}) {
  const qs = consentGiven ? '?consent_given=true' : '';
  return apiRequest(`${BASE}/requests/${requestId}/readiness${qs}`);
}

export async function submitVerificationRequest(requestId, { consentGiven = true, consentVersion = 'kyc-v1' } = {}) {
  return apiRequest(`${BASE}/requests/${requestId}/submit`, {
    method: 'POST',
    body: { consent_given: consentGiven, consent_version: consentVersion },
  });
}

export function verificationDocumentViewUrl(requestId, documentId) {
  return `${getApiBase()}/core/verification/requests/${requestId}/documents/${documentId}/view`;
}

export async function openVerificationDocument(requestId, documentId) {
  const token = getStoredAccessToken();
  const response = await fetch(verificationDocumentViewUrl(requestId, documentId), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error('Could not open document');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function listAdminVerifications(params = {}) {
  const qs = new URLSearchParams();
  if (params.request_type) qs.set('request_type', params.request_type);
  if (params.status) qs.set('status', params.status);
  const q = qs.toString();
  return apiRequest(`/core/admin/verifications${q ? `?${q}` : ''}`);
}

export async function getAdminVerificationDetail(requestId) {
  return apiRequest(`/core/admin/verifications/${requestId}`);
}

export async function approveVerification(requestId, note) {
  return apiRequest(`/core/admin/verifications/${requestId}/approve`, {
    method: 'POST',
    body: { note },
  });
}

export async function rejectVerification(requestId, reason) {
  return apiRequest(`/core/admin/verifications/${requestId}/reject`, {
    method: 'POST',
    body: { reason },
  });
}

export async function requestMoreDocuments(requestId, { documentType, reason, comment, deadline }) {
  return apiRequest(`/core/admin/verifications/${requestId}/request-documents`, {
    method: 'POST',
    body: {
      document_type: documentType,
      reason,
      comment,
      deadline,
    },
  });
}

export async function requestFieldUpdates(requestId, { fieldPaths, reason, comment }) {
  return apiRequest(`/core/admin/verifications/${requestId}/request-field-updates`, {
    method: 'POST',
    body: {
      field_paths: fieldPaths,
      reason,
      comment,
    },
  });
}

export async function suspendVerification(requestId, reason) {
  return apiRequest(`/core/admin/verifications/${requestId}/suspend`, {
    method: 'POST',
    body: { reason },
  });
}

export function profileStatusToUserPatch(profileStatus) {
  const s = String(profileStatus || '').toUpperCase();
  if (s === 'VERIFIED' || s === 'APPROVED') {
    return { verified: true, verificationStatus: 'approved', rejectionReason: undefined };
  }
  if (s === 'REJECTED') {
    return { verified: 'rejected', verificationStatus: 'rejected' };
  }
  if (s === 'SUSPENDED') {
    return { verified: 'suspended', verificationStatus: 'suspended' };
  }
  if (s === 'UNDER_REVIEW' || s === 'DOCUMENTS_SUBMITTED' || s === 'VALIDATION_IN_PROGRESS') {
    return { verified: 'pending', verificationStatus: 'under_review' };
  }
  if (s === 'MORE_DOCUMENTS_REQUIRED' || s === 'KYC_IN_PROGRESS') {
    return { verified: false, verificationStatus: s.toLowerCase() };
  }
  return { verified: false, verificationStatus: 'registered' };
}
