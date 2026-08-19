/** Fields an admin can request the receiver to update during KYC review. */
export const RECEIVER_KYC_ADMIN_FIELDS = [
  { path: 'personal.first_name', label: 'First name', stepId: 'personal' },
  { path: 'personal.last_name', label: 'Last name', stepId: 'personal' },
  { path: 'personal.dob', label: 'Date of birth', stepId: 'personal' },
  { path: 'personal.email', label: 'Email address', stepId: 'personal' },
  { path: 'identity.id_type', label: 'Identity document type', stepId: 'identity' },
  { path: 'identity.id_number', label: 'Identity document number', stepId: 'identity' },
  { path: 'address.address_line', label: 'Address', stepId: 'address' },
  { path: 'address.city', label: 'City', stepId: 'address' },
  { path: 'address.state', label: 'State', stepId: 'address' },
  { path: 'address.pincode', label: 'Postal code', stepId: 'address' },
  { path: 'beneficiary.relationship', label: 'Beneficiary relationship', stepId: 'beneficiary' },
  { path: 'beneficiary.full_name', label: 'Beneficiary name', stepId: 'beneficiary' },
  { path: 'beneficiary.dob', label: 'Beneficiary date of birth', stepId: 'beneficiary' },
  { path: 'assistance.category', label: 'Verification purpose', stepId: 'assistance' },
  { path: 'assistance.explanation', label: 'Purpose explanation', stepId: 'assistance' },
  { path: 'bank.account_holder_name', label: 'Account holder name', stepId: 'bank' },
  { path: 'bank.bank_name', label: 'Bank name', stepId: 'bank' },
  { path: 'bank.account_number', label: 'Account number', stepId: 'bank' },
  { path: 'bank.ifsc', label: 'IFSC code', stepId: 'bank' },
];

export function labelForKycFieldPath(path) {
  const match = RECEIVER_KYC_ADMIN_FIELDS.find((f) => f.path === path);
  if (match) return match.label;
  return String(path || '').replace(/\./g, ' — ').replace(/_/g, ' ');
}

export function pendingAdminDocumentRequests(payload = {}) {
  return (payload.admin_document_requests || []).filter(
    (r) => r.status === 'PENDING' || !r.status,
  );
}

export function pendingAdminFieldRequests(payload = {}) {
  return (payload.admin_field_requests || []).filter(
    (r) => r.status === 'PENDING' || !r.status,
  );
}
