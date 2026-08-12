import { apiRequest } from './client';
import { getMe } from './iamClient';

async function currentUserId() {
  const me = await getMe();
  return me?.user_id;
}

function normalizeMoneyDonation(row, notes) {
  return {
    donation_id: row.donation_id,
    donation_type: 'MONEY',
    donor_user_id: row.donor_id,
    donor_id: row.donor_id,
    program_id: row.program_id,
    amount: Number(row.amount) || 0,
    status: row.payment_status || 'CONFIRMED',
    notes: notes || `Amount: ${row.amount}`,
    created_at: row.donated_at,
  };
}

function normalizeItemDonation(row) {
  return {
    donation_id: row.item_donation_id,
    item_donation_id: row.item_donation_id,
    donation_type: 'ITEM',
    donor_user_id: row.donor_id,
    donor_id: row.donor_id,
    status: row.status || 'LISTED',
    notes: row.description,
    category: row.category,
    quantity: row.quantity,
    created_at: null,
  };
}

export async function listDonations() {
  const [money, items] = await Promise.all([
    apiRequest('/core/donations/money'),
    apiRequest('/core/donations/items'),
  ]);
  return [
    ...(Array.isArray(money) ? money.map((row) => normalizeMoneyDonation(row)) : []),
    ...(Array.isArray(items) ? items.map((row) => normalizeItemDonation(row)) : []),
  ];
}

export async function createDonation(payload) {
  const donors = await apiRequest('/core/profiles/donors');
  const userId = await currentUserId();
  const donor =
    (Array.isArray(donors) && donors.find((d) => d.user_id === userId)) ||
    (Array.isArray(donors) && donors[0]) ||
    null;
  if (!donor) {
    throw new Error('Donor profile not found. Complete donor registration first.');
  }

  if (payload.donation_type === 'ITEM') {
    const addresses = await apiRequest('/core/addresses');
    const addressId =
      payload.pickup_address_id ||
      donor.address_id ||
      (Array.isArray(addresses) && addresses[0]?.address_id) ||
      1;
    const categoryMatch = String(payload.notes || '').match(/Category:\s*([^|]+)/i);
    const created = await apiRequest('/core/donations/items', {
      method: 'POST',
      body: {
        donor_id: donor.donor_id,
        category: categoryMatch?.[1]?.trim() || payload.category || 'General',
        description: payload.notes || payload.description || 'Item donation',
        quantity: payload.quantity || 1,
        pickup_address_id: addressId,
      },
    });
    return normalizeItemDonation(created);
  }

  const programs = await listPrograms();
  const programId = payload.program_id || programs?.[0]?.program_id || 1;
  const created = await apiRequest('/core/donations/money', {
    method: 'POST',
    body: {
      donor_id: donor.donor_id,
      program_id: programId,
      amount: Number(payload.amount) || 0,
    },
  });
  return normalizeMoneyDonation(created, payload.notes);
}

export async function listVerificationRequests() {
  return apiRequest('/core/verification/requests');
}

export async function createVerificationRequest(payload) {
  const me = await getMe();
  return apiRequest('/core/verification/requests', {
    method: 'POST',
    body: {
      user_id: me.user_id,
      request_type: payload.entity_type || payload.request_type || 'DONOR',
      notes: payload.notes,
    },
  });
}

export async function getMyDonorProfile() {
  const [donors, userId] = await Promise.all([
    apiRequest('/core/profiles/donors'),
    currentUserId(),
  ]);
  const profile = Array.isArray(donors)
    ? donors.find((d) => d.user_id === userId)
    : null;
  if (!profile) return null;
  return {
    ...profile,
    donor_profile_id: profile.donor_id,
  };
}

export async function createDonorProfile(payload = {}) {
  const me = await getMe();
  return apiRequest('/core/profiles/donors', {
    method: 'POST',
    body: {
      user_id: me.user_id,
      full_name: payload.full_name || payload.organization_name || me.full_name,
      mobile: payload.mobile || me.mobile,
      email: payload.email || me.email,
      address_id: payload.address_id ?? null,
    },
  }).then((profile) => ({
    ...profile,
    donor_profile_id: profile.donor_id,
  }));
}

export async function createReceiverProfile(payload) {
  return apiRequest('/core/profiles/receivers', { method: 'POST', body: payload });
}

export async function createNgoProfile(payload) {
  return apiRequest('/core/profiles/ngos', { method: 'POST', body: payload });
}

export async function listPrograms() {
  return apiRequest('/core/programs');
}

export async function getDonorDashboard(period = 'year') {
  const q = encodeURIComponent(period || 'year');
  return apiRequest(`/core/donors/me/dashboard?period=${q}`);
}

export async function searchCausesAndNgos(query) {
  const q = encodeURIComponent(String(query || '').trim());
  if (!q) return { programs: [], ngos: [], query: '' };
  return apiRequest(`/core/search?q=${q}`);
}

export async function listAssistanceRequests() {
  return apiRequest('/core/applications');
}

export async function getAssistanceRequest(requestId) {
  const rows = await listAssistanceRequests();
  return (Array.isArray(rows) ? rows : []).find(
    (row) => row.application_id === requestId || row.assistance_request_id === requestId
  );
}

export async function createAssistanceRequest(payload) {
  const me = await getMe();
  const receivers = await apiRequest('/core/profiles/receivers');
  const receiver =
    (Array.isArray(receivers) && receivers.find((r) => r.user_id === me.user_id)) ||
    (Array.isArray(receivers) && receivers[0]);
  if (!receiver) {
    throw new Error('Receiver profile not found.');
  }

  const amountMatch = String(payload.description || '').match(/Amount:\s*([0-9.]+)/i);
  const purpose =
    payload.purpose ||
    payload.title ||
    String(payload.description || '').match(/Purpose:\s*([^|]+)/i)?.[1]?.trim() ||
    'Assistance request';

  return apiRequest('/core/applications', {
    method: 'POST',
    body: {
      receiver_id: receiver.receiver_id,
      purpose,
      amount_requested: Number(payload.amount_requested ?? amountMatch?.[1] ?? 0),
    },
  });
}

export async function createDonationOrder({ amount, currency = 'INR', causeId, mobile }) {
  return apiRequest('/donations/create-order', {
    method: 'POST',
    body: { amount, currency, causeId, mobile },
  }).catch(async () => {
    return apiRequest('/core/donations/create-order', {
      method: 'POST',
      body: { amount, currency, causeId, mobile },
    });
  });
}

export async function verifyDonationPayment({ orderId, paymentId, signature }) {
  return apiRequest('/donations/verify-payment', {
    method: 'POST',
    body: { orderId, paymentId, signature },
  }).catch(async () => {
    return apiRequest('/core/donations/verify-payment', {
      method: 'POST',
      body: { orderId, paymentId, signature },
    });
  });
}
