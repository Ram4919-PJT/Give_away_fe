import { apiRequest } from './client';
import { getStoredAccessToken } from './tokenStorage';
import { getApiBase } from './client';

const BASE = '/core/applications';

export async function createAssistanceDraft(payload) {
  return apiRequest(BASE, { method: 'POST', body: payload });
}

export async function updateAssistanceApplication(applicationId, payload) {
  return apiRequest(`${BASE}/${applicationId}`, { method: 'PATCH', body: payload });
}

export async function getAssistanceReadiness(applicationId) {
  return apiRequest(`${BASE}/${applicationId}/readiness`);
}

export async function submitAssistanceApplication(applicationId) {
  return apiRequest(`${BASE}/${applicationId}/submit`, { method: 'POST', body: {} });
}

export async function uploadAssistanceDocument(applicationId, documentType, file) {
  const form = new FormData();
  form.append('document_type', documentType);
  form.append('file', file);
  return apiRequest(`${BASE}/${applicationId}/documents`, { method: 'POST', body: form });
}

export async function deleteAssistanceDocument(applicationId, documentId) {
  return apiRequest(`${BASE}/${applicationId}/documents/${documentId}`, { method: 'DELETE' });
}

export function assistanceDocumentViewUrl(applicationId, documentId) {
  return `${getApiBase()}${BASE}/${applicationId}/documents/${documentId}/view`;
}

export async function openAssistanceDocument(applicationId, documentId) {
  const token = getStoredAccessToken();
  const response = await fetch(assistanceDocumentViewUrl(applicationId, documentId), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error('Could not open document');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
