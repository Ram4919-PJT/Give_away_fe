import { apiRequest } from './client';

export async function createPaymentOrder({ amount, programId, mobile, donorName, authenticated = false }) {
  return apiRequest('/core/donations/create-order', {
    method: 'POST',
    body: {
      amount: Number(amount),
      program_id: Number(programId),
      mobile: mobile || undefined,
      donor_name: donorName || undefined,
    },
    auth: Boolean(authenticated),
  });
}

export async function verifyPayment({ orderId, paymentId, signature }) {
  return apiRequest('/core/donations/verify-payment', {
    method: 'POST',
    body: { orderId, paymentId, signature },
    auth: false,
  });
}

export async function fetchDonationReceipt(donationId) {
  return apiRequest(`/core/donations/receipt/${donationId}`, { auth: false });
}
