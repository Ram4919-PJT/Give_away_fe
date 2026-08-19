/** Merge API payload into form without overwriting user secrets with masked API values. */

const MASKED_PATTERN = /[•\*X]{2,}|XXXX/i;

export function looksMaskedSensitive(value) {
  if (value == null || !String(value).trim()) return false;
  return MASKED_PATTERN.test(String(value));
}

/**
 * After save/load, keep locally entered sensitive values when API returns masks.
 */
export function mergeFormFromApiPayload(prevForm, apiPayload = {}) {
  const next = hydrateFormFromPayload(apiPayload);
  const identity = { ...(next.identity || {}) };
  const prevIdentity = prevForm?.identity || {};
  if (looksMaskedSensitive(identity.id_number) && prevIdentity.id_number) {
    identity.id_number = prevIdentity.id_number;
  }
  next.identity = identity;

  const bank = { ...(next.bank || {}) };
  const prevBank = prevForm?.bank || {};
  if (looksMaskedSensitive(bank.account_number) && prevBank.account_number) {
    bank.account_number = prevBank.account_number;
  }
  next.bank = bank;

  return { ...prevForm, ...next, identity, bank };
}

export function hydrateFormFromPayload(payload = {}) {
  const next = { ...payload };
  const personal = { ...(next.personal || {}) };
  if (!personal.first_name && personal.full_name) {
    const parts = String(personal.full_name).trim().split(/\s+/);
    personal.first_name = parts[0] || '';
    personal.last_name = parts.slice(1).join(' ');
  }
  next.personal = personal;
  return next;
}

export function normalizeIdentityNumber(idType, rawValue) {
  const idTypeNorm = String(idType || '').trim().toUpperCase();
  const text = String(rawValue || '').trim();
  if (!text) return '';
  if (idTypeNorm === 'AADHAAR') {
    return text.replace(/\D/g, '').slice(0, 12);
  }
  if (idTypeNorm === 'PAN') {
    return text.replace(/\s+/g, '').toUpperCase().slice(0, 10);
  }
  return text.replace(/\s+/g, '').toUpperCase();
}

export const ID_NUMBER_FORMAT_HINTS = {
  AADHAAR: '12 digits, numbers only',
  PAN: 'Format: ABCDE1234F',
  PASSPORT: 'Format: 1 letter + 7 digits (e.g. A1234567)',
  VOTER_ID: 'Format: 3 letters + 7 digits (e.g. ABC1234567)',
  DRIVING_LICENCE: 'Enter licence number as printed on the card',
};
