import { apiRequest } from './client';

export async function listDonations() {
  return apiRequest('/core/donations');
}

export async function createDonation(payload) {
  return apiRequest('/core/donations', { method: 'POST', body: payload });
}

export async function listVerificationRequests() {
  return apiRequest('/core/verification/requests');
}

export async function createVerificationRequest(payload) {
  return apiRequest('/core/verification/requests', { method: 'POST', body: payload });
}

export async function getMyDonorProfile() {
  return apiRequest('/core/profiles/me/donor');
}

export async function createDonorProfile(payload) {
  return apiRequest('/core/profiles/donor', { method: 'POST', body: payload });
}

export async function createReceiverProfile(payload) {
  return apiRequest('/core/profiles/receiver', { method: 'POST', body: payload });
}

export async function createNgoProfile(payload) {
  return apiRequest('/core/profiles/ngo', { method: 'POST', body: payload });
}

export async function listPrograms() {
  return apiRequest('/core/profiles/programs');
}

export async function listAssistanceRequests() {
  return apiRequest('/core/assistance/requests');
}

export async function getAssistanceRequest(requestId) {
  return apiRequest(`/core/assistance/requests/${requestId}`);
}

export async function createAssistanceRequest(payload) {
  return apiRequest('/core/assistance/requests', { method: 'POST', body: payload });
}
