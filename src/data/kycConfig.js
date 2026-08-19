/** KYC step definitions — NGO and Receiver are separate flows. */

export const ORG_TYPES = [
  { id: 'TRUST', label: 'Trust' },
  { id: 'SOCIETY', label: 'Society' },
  { id: 'SECTION_8', label: 'Section 8 Company' },
];

export const NGO_KYC_STEPS = [
  {
    id: 'organization',
    title: 'Organization Details',
    fields: [
      { key: 'ngo_name', label: 'NGO Name', required: true },
      { key: 'registration_number', label: 'Registration Number', required: true },
      { key: 'organization_type', label: 'Organization Type', required: true, type: 'select', options: ORG_TYPES },
      { key: 'contact_person', label: 'Contact Person', required: true },
      { key: 'mobile', label: 'Mobile Number', required: true },
      { key: 'email', label: 'Email', required: true },
      { key: 'address_line', label: 'Registered Address', required: true },
      { key: 'city', label: 'City', required: true },
      { key: 'state', label: 'State', required: true },
      { key: 'pincode', label: 'Pincode', required: true },
    ],
    documents: [],
  },
  {
    id: 'legal',
    title: 'Legal Documents',
    documents: [
      { type: 'REGISTRATION_CERTIFICATE', label: 'Registration Certificate', required: true },
      { type: 'ORGANIZATION_PAN', label: 'Organization PAN', required: true },
      { type: 'LEGAL_CONSTITUTION', label: 'Legal Constitution Document', required: true },
      { type: 'ADDRESS_PROOF', label: 'Organization Address Proof', required: true },
      { type: 'CERT_12A', label: '12A / 12AB', required: false },
      { type: 'CERT_80G', label: '80G', required: false },
      { type: 'FCRA', label: 'FCRA', required: false },
      { type: 'CSR_1', label: 'CSR-1', required: false },
    ],
  },
  {
    id: 'representative',
    title: 'Authorized Representative',
    fields: [
      { key: 'rep_full_name', label: 'Full Name', required: true },
      { key: 'rep_designation', label: 'Designation', required: true },
      { key: 'rep_mobile', label: 'Mobile Number', required: true },
      { key: 'rep_email', label: 'Email', required: true },
      { key: 'rep_id_type', label: 'Identity Document Type', required: true },
      { key: 'rep_id_number', label: 'Document Number', required: true, sensitive: true },
    ],
    documents: [
      { type: 'REP_ID_DOCUMENT', label: 'Government Identity Document', required: true },
    ],
  },
  {
    id: 'bank',
    title: 'Bank Verification',
    fields: [
      { key: 'account_holder_name', label: 'Account Holder Name', required: true },
      { key: 'bank_name', label: 'Bank Name', required: true },
      { key: 'account_number', label: 'Account Number', required: true, sensitive: true },
      { key: 'ifsc', label: 'IFSC', required: true },
      { key: 'account_type', label: 'Account Type', required: true },
    ],
    documents: [
      { type: 'BANK_PROOF', label: 'Cancelled Cheque / Bank Statement / Passbook', required: true },
    ],
  },
  {
    id: 'additional',
    title: 'Additional Documents',
    documents: [
      { type: 'ADDITIONAL_LEGAL', label: 'Additional Legal Document', required: false },
      { type: 'NGO_LOGO', label: 'NGO Logo', required: false },
    ],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    review: true,
  },
];

export const ID_DOCUMENT_TYPES = [
  { id: 'AADHAAR', label: 'Aadhaar' },
  { id: 'PAN', label: 'PAN' },
  { id: 'PASSPORT', label: 'Passport' },
  { id: 'DRIVING_LICENCE', label: 'Driving Licence' },
  { id: 'VOTER_ID', label: 'Voter ID' },
];

export const RECEIVER_KYC_STEPS = [
  {
    id: 'personal',
    title: 'Personal Information',
    hint: 'Please ensure these details exactly match your identity documents.',
    fields: [
      {
        key: 'first_name',
        label: 'First name',
        required: true,
        half: true,
        placeholder: 'As on ID document',
        hint: 'Letters only, 2–60 characters',
      },
      {
        key: 'last_name',
        label: 'Last name',
        required: true,
        half: true,
        placeholder: 'As on ID document',
      },
      { key: 'dob', label: 'Date of birth', required: true, type: 'date', hint: 'You must be 18 or older' },
      { key: 'gender', label: 'Gender', required: false, type: 'select', options: [
        { id: 'MALE', label: 'Male' },
        { id: 'FEMALE', label: 'Female' },
        { id: 'OTHER', label: 'Other' },
        { id: 'PREFER_NOT', label: 'Prefer not to say' },
      ]},
      {
        key: 'email',
        label: 'Email address',
        required: true,
        type: 'email',
        placeholder: 'you@example.com',
        hint: 'We will use this for verification updates',
      },
    ],
    documents: [],
  },
  {
    id: 'mobile',
    title: 'Mobile Verification',
    mobileOtp: true,
    fields: [],
    documents: [],
  },
  {
    id: 'identity',
    title: 'Identity Verification',
    fields: [
      { key: 'id_type', label: 'Document type', required: true, type: 'select', options: ID_DOCUMENT_TYPES },
      {
        key: 'id_number',
        label: 'Document number',
        required: true,
        sensitive: true,
        hint: 'Enter the number exactly as on your document',
      },
    ],
    documents: [
      { type: 'ID_FRONT', label: 'ID front photo', required: true },
      { type: 'ID_BACK', label: 'ID back photo (if applicable)', required: false, required_when: { field: 'identity.id_type', values: ['DRIVING_LICENCE'] } },
    ],
  },
  {
    id: 'address',
    title: 'Address Verification',
    fields: [
      { key: 'address_line', label: 'Address', required: true },
      { key: 'city', label: 'City', required: true },
      { key: 'state', label: 'State', required: true },
      { key: 'pincode', label: 'Pincode', required: true },
    ],
    documents: [
      { type: 'ADDRESS_PROOF', label: 'Address proof', required: true },
    ],
  },
  {
    id: 'beneficiary',
    title: 'Beneficiary Information',
    hint: 'Who will benefit from this assistance?',
    fields: [
      { key: 'relationship', label: 'Beneficiary', required: true, type: 'select', options: [
        { id: 'SELF', label: 'Myself' },
        { id: 'PARENT', label: 'Parent' },
        { id: 'CHILD', label: 'Child' },
        { id: 'SPOUSE', label: 'Spouse' },
        { id: 'FAMILY_MEMBER', label: 'Family member' },
        { id: 'OTHER', label: 'Other' },
      ]},
      { key: 'full_name', label: 'Beneficiary full name', required: false },
      { key: 'dob', label: 'Beneficiary date of birth', required: false, type: 'date' },
    ],
    documents: [
      { type: 'RELATIONSHIP_PROOF', label: 'Relationship proof (if not yourself)', required: false, required_when: { field: 'beneficiary.relationship', exclude_values: ['SELF'] } },
    ],
  },
  {
    id: 'assistance',
    title: 'Assistance Purpose',
    fields: [
      { key: 'category', label: 'Category', required: true, type: 'select', options: [
        { id: 'MEDICAL', label: 'Medical' },
        { id: 'EDUCATION', label: 'Education' },
        { id: 'EMERGENCY', label: 'Emergency' },
        { id: 'BASIC_NEEDS', label: 'Basic Needs' },
        { id: 'OTHER', label: 'Other' },
      ]},
      { key: 'amount_requested', label: 'Estimated amount needed (₹)', required: true, type: 'number' },
      { key: 'urgency', label: 'Urgency', required: true, type: 'select', options: [
        { id: 'LOW', label: 'Low' },
        { id: 'MEDIUM', label: 'Medium' },
        { id: 'HIGH', label: 'High' },
      ]},
      { key: 'explanation', label: 'Explanation', required: true, type: 'textarea' },
    ],
    documents: [],
  },
  {
    id: 'purpose_documents',
    title: 'Supporting Documents',
    dynamicDocuments: true,
    documents: [],
  },
  {
    id: 'bank',
    title: 'Bank Verification',
    fields: [
      { key: 'account_holder_name', label: 'Account holder name', required: true },
      { key: 'bank_name', label: 'Bank name', required: true },
      { key: 'account_number', label: 'Account number', required: true, sensitive: true },
      { key: 'ifsc', label: 'IFSC', required: true },
    ],
    documents: [
      { type: 'BANK_PROOF', label: 'Cancelled cheque / bank statement', required: true },
    ],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    review: true,
  },
];

export const KYC_CONSENT_TEXT =
  'I confirm that the information and documents I have provided are accurate and belong to me or the stated beneficiary. I authorize AJA Abayahastham to verify my identity, process my documents, and share information with authorized verification and payment providers as needed for assistance review and disbursement, in accordance with the privacy policy.';

export const PURPOSE_DOCUMENTS = {
  // Legacy KYC intent codes — normalized to canonical codes on the backend.
  // Assistance requests use MEDICAL_HEALTHCARE, etc. via GET /core/config/receiver-assistance.
  MEDICAL: [
    { type: 'MEDICAL_REPORT', label: 'Medical report / diagnosis', required: true },
    { type: 'HOSPITAL_ESTIMATE', label: 'Hospital estimate / bill', required: true },
    { type: 'PRESCRIPTION', label: 'Prescription', required: false },
  ],
  EDUCATION: [
    { type: 'ADMISSION_LETTER', label: 'Admission letter', required: true },
    { type: 'FEE_STRUCTURE', label: 'Fee structure', required: true },
  ],
  EMERGENCY: [
    { type: 'EMERGENCY_EVIDENCE', label: 'Emergency evidence', required: true },
  ],
  BASIC_NEEDS: [
    { type: 'SUPPORTING_PRIMARY', label: 'Supporting document', required: true },
  ],
  OTHER: [
    { type: 'SUPPORTING_PRIMARY', label: 'Primary supporting document', required: true },
  ],
};

export function getPurposeDocuments(category) {
  return PURPOSE_DOCUMENTS[category] || PURPOSE_DOCUMENTS.OTHER;
}

export const MAX_UPLOAD_MB = 10;
export const ALLOWED_UPLOAD_HINT = 'PDF, JPG, JPEG, PNG, WEBP — max 10 MB';
