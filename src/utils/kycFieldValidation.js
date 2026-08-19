/** Client-side KYC field validation — mirrors backend receiver_kyc_validation rules. */

import { looksMaskedSensitive } from './kycPayloadMerge';

const PINCODE_RE = /^\d{6}$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
const NAME_RE = /^[A-Za-z][A-Za-z\s'.-]{0,59}$/;

const ID_NUMBER_RULES = {
  AADHAAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}\d{4}[A-Z]$/i,
  PASSPORT: /^[A-Z]\d{7}$/i,
  VOTER_ID: /^[A-Z]{3}\d{7}$/i,
};

export function normalizeMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

export function splitFullName(full) {
  const trimmed = String(full || '').trim();
  if (!trimmed) return { first_name: '', last_name: '' };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: '' };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

export function mergePersonalNames(personal = {}) {
  const first = String(personal.first_name || '').trim();
  const last = String(personal.last_name || '').trim();
  const full = [first, last].filter(Boolean).join(' ').trim();
  return { ...personal, full_name: full || String(personal.full_name || '').trim() };
}

function err(field, message) {
  return { field, message };
}

function missing(value) {
  return value == null || !String(value).trim();
}

function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

function validateNameField(fieldPath, label, value, { required = true } = {}) {
  const errors = [];
  const v = String(value || '').trim();
  if (required && missing(v)) {
    errors.push(err(fieldPath, `Enter your ${label}.`));
    return errors;
  }
  if (v && !NAME_RE.test(v)) {
    errors.push(err(fieldPath, `${label} must use letters only (2–60 characters).`));
  }
  if (v && v.length < 2 && required) {
    errors.push(err(fieldPath, `${label} must be at least 2 characters.`));
  }
  return errors;
}

export function validatePersonalStep(form) {
  const personal = form.personal || {};
  const errors = [];
  errors.push(...validateNameField('personal.first_name', 'first name', personal.first_name));
  errors.push(...validateNameField('personal.last_name', 'last name', personal.last_name));

  if (missing(personal.dob)) {
    errors.push(err('personal.dob', 'Enter your date of birth.'));
  } else {
    const dob = new Date(personal.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dob > today) {
      errors.push(err('personal.dob', 'Date of birth cannot be in the future.'));
    } else {
      const age = ageFromDob(personal.dob);
      if (age != null && age < 18) {
        errors.push(err('personal.dob', 'You must be at least 18 years old.'));
      }
      if (age != null && age > 120) {
        errors.push(err('personal.dob', 'Enter a valid date of birth.'));
      }
    }
  }

  if (missing(personal.email)) {
    errors.push(err('personal.email', 'Enter your email.'));
  } else if (!EMAIL_RE.test(String(personal.email).trim())) {
    errors.push(err('personal.email', 'Enter a valid email address.'));
  }

  return errors;
}

export function validateMobileNumber(mobileDigits) {
  const errors = [];
  if (!mobileDigits) {
    errors.push(err('mobile.mobile', 'Enter your mobile number.'));
  } else if (!MOBILE_RE.test(mobileDigits)) {
    errors.push(err('mobile.mobile', 'Enter a valid 10-digit Indian mobile number (starts with 6–9).'));
  }
  return errors;
}

export function validateMobileStep(form, mobileVerified) {
  const mobile = normalizeMobile(form.mobile?.mobile);
  const errors = validateMobileNumber(mobile);
  if (!mobileVerified && !form.mobile_verification?.verified_at) {
    errors.push(err('mobile_verification', 'Verify your mobile number with OTP before continuing.'));
  }
  return errors;
}

export function validateIdentityStep(form, documentsByType = {}) {
  const identity = form.identity || {};
  const errors = [];
  const idType = String(identity.id_type || '').trim().toUpperCase();

  if (missing(idType)) {
    errors.push(err('identity.id_type', 'Select your identity document type.'));
  }

  const idNumber = String(identity.id_number || '').trim();
  if (missing(idNumber)) {
    errors.push(err('identity.id_number', 'Enter your document number.'));
  } else if (looksMaskedSensitive(idNumber)) {
    errors.push(err('identity.id_number', 'Re-enter your full document number (masked values cannot be submitted).'));
  } else if (idType && ID_NUMBER_RULES[idType]) {
    let normalized = idNumber.replace(/\s+/g, '').toUpperCase();
    if (idType === 'AADHAAR') normalized = idNumber.replace(/\D/g, '');
    if (!ID_NUMBER_RULES[idType].test(normalized)) {
      errors.push(err('identity.id_number', `Enter a valid ${idType.replace(/_/g, ' ')} number.`));
    }
  }

  if (!documentsByType.ID_FRONT) {
    errors.push(err('document.ID_FRONT', 'Upload the front of your identity document.'));
  }

  if (idType === 'DRIVING_LICENCE' && !documentsByType.ID_BACK) {
    errors.push(err('document.ID_BACK', 'Upload the back of your driving licence.'));
  }

  return errors;
}

export function validateAddressStep(form, documentsByType = {}) {
  const address = form.address || {};
  const errors = [];
  for (const [key, label] of [
    ['address_line', 'address'],
    ['city', 'city'],
    ['state', 'state'],
    ['pincode', 'postal code'],
  ]) {
    if (missing(address[key])) {
      errors.push(err(`address.${key}`, `Enter your ${label}.`));
    }
  }
  const pincode = String(address.pincode || '').trim();
  if (pincode && !PINCODE_RE.test(pincode)) {
    errors.push(err('address.pincode', 'Enter a valid 6-digit postal code.'));
  }
  if (!documentsByType.ADDRESS_PROOF) {
    errors.push(err('document.ADDRESS_PROOF', 'Upload a valid address proof document.'));
  }
  return errors;
}

export function validateBeneficiaryStep(form, documentsByType = {}) {
  const beneficiary = form.beneficiary || {};
  const errors = [];
  const rel = beneficiary.relationship;

  if (missing(rel)) {
    errors.push(err('beneficiary.relationship', 'Select who will benefit from assistance.'));
  }

  if (rel && rel !== 'SELF') {
    if (missing(beneficiary.full_name)) {
      errors.push(err('beneficiary.full_name', 'Enter the beneficiary full name.'));
    }
    if (missing(beneficiary.dob)) {
      errors.push(err('beneficiary.dob', 'Enter the beneficiary date of birth.'));
    }
    if (!documentsByType.RELATIONSHIP_PROOF) {
      errors.push(err('document.RELATIONSHIP_PROOF', 'Upload relationship proof.'));
    }
  }

  return errors;
}

export function validateBankStep(form, documentsByType = {}) {
  const bank = form.bank || {};
  const errors = [];
  for (const [key, label] of [
    ['account_holder_name', 'account holder name'],
    ['bank_name', 'bank name'],
    ['account_number', 'account number'],
    ['ifsc', 'IFSC code'],
  ]) {
    if (missing(bank[key])) {
      errors.push(err(`bank.${key}`, `Enter your ${label}.`));
    }
  }
  const ifsc = String(bank.ifsc || '').trim().toUpperCase();
  if (ifsc && !IFSC_RE.test(ifsc)) {
    errors.push(err('bank.ifsc', 'Enter a valid IFSC code (e.g. SBIN0001234).'));
  }
  const acct = String(bank.account_number || '').replace(/\s/g, '');
  if (acct && (acct.length < 9 || acct.length > 18 || !/^\d+$/.test(acct))) {
    errors.push(err('bank.account_number', 'Enter a valid account number (9–18 digits).'));
  }
  if (!documentsByType.BANK_PROOF) {
    errors.push(err('document.BANK_PROOF', 'Upload bank proof (cheque, statement, or passbook).'));
  }
  return errors;
}

export function validateAssistanceStep(form) {
  const assistance = form.assistance || {};
  const errors = [];
  if (missing(assistance.category)) {
    errors.push(err('assistance.category', 'Select your verification purpose.'));
  }
  const explanation = String(assistance.explanation || '').trim();
  if (missing(explanation)) {
    errors.push(err('assistance.explanation', 'Briefly explain why you need assistance.'));
  } else if (explanation.length < 20) {
    errors.push(err('assistance.explanation', 'Please provide at least 20 characters.'));
  }
  return errors;
}

export function validateKycStep(step, form, { documentsByType = {}, mobileVerified = false } = {}) {
  if (!step) return [];
  switch (step.id) {
    case 'personal':
      return validatePersonalStep(form);
    case 'mobile':
      return validateMobileStep(form, mobileVerified);
    case 'identity':
      return validateIdentityStep(form, documentsByType);
    case 'address':
      return validateAddressStep(form, documentsByType);
    case 'beneficiary':
      return validateBeneficiaryStep(form, documentsByType);
    case 'assistance':
      return validateAssistanceStep(form);
    case 'bank':
      return validateBankStep(form, documentsByType);
    default:
      return [];
  }
}

export function errorsToMap(errors = []) {
  const map = {};
  errors.forEach((e) => {
    if (e?.field) map[e.field] = e.message;
  });
  return map;
}
