export const NGO_REJECTION_REASONS = [
  'Incomplete Documentation',
  'Illegible/Blurry Document Scans',
  'Expired Registration License',
  'Mismatched Organization Details',
  'Custom Reason...'
];

export const CUSTOM_REJECTION_OPTION = 'Custom Reason...';

export function buildNgoDocumentList() {
  return [
    { label: 'NGO Registration Certificate', filename: 'ngo_registration_certificate.pdf' },
    { label: 'PAN Card', filename: 'pan_card_ashakiran.pdf' },
    { label: 'Bank Account Details', filename: 'bank_account_details.pdf' },
    { label: 'Cancelled Cheque / Passbook', filename: 'cancelled_cheque.pdf' },
    { label: 'Authorized Representative Government ID', filename: 'representative_gov_id.pdf' },
    { label: 'Organization Address Proof', filename: 'address_proof.pdf' },
    { label: '80G Certificate', filename: '80g_certificate.pdf' }
  ];
}
