/** Rich mock verification records for the admin Verification Queue wireframe */

const DOC = (label, filename, date = '2026-07-08') => ({ label, filename, uploadedAt: date });

export const VERIFICATION_TABS = [
  { id: 'Donor', emoji: '👤', label: 'Donor Verification' },
  { id: 'Receiver', emoji: '👥', label: 'Receiver Verification' },
  { id: 'NGO', emoji: '🏢', label: 'NGO Verification' }
];

export const DEFAULT_CHECKLIST = [
  { id: 'gov-id', label: 'Government ID Verified', checked: true },
  { id: 'address', label: 'Address Verified', checked: true },
  { id: 'registration', label: 'Registration Valid', checked: false },
  { id: 'income', label: 'Income Proof Checked', checked: false },
  { id: 'duplicate', label: 'Duplicate Check', checked: true }
];

export function buildVerificationMockData(contextVerifications = []) {
  const base = [
    {
      id: 'v-donor-1', type: 'Donor', name: 'Rajesh Mehta', email: 'rajesh@example.com',
      phone: '+91 98765 43210', avatar: 'RM', status: 'Pending', submitted: '2026-07-10',
      registrationDate: '2026-07-01', verificationLevel: 'Standard',
      documents: [
        DOC('Government ID', 'aadhaar_rajesh.pdf'),
        DOC('Address Proof', 'address_proof_rajesh.pdf'),
        DOC('Profile Photo', 'profile_rajesh.jpg', '2026-07-01')
      ],
      checklist: DEFAULT_CHECKLIST,
      timeline: [
        { date: '2026-07-10', event: 'Application submitted' },
        { date: '2026-07-10', event: 'Documents received' }
      ],
      notes: 'First-time donor registration. Documents appear clear.',
      reviewer: 'Unassigned'
    },
    {
      id: 'v-donor-2', type: 'Donor', name: 'Anita Verma', email: 'anita@example.com',
      phone: '+91 91234 56789', avatar: 'AV', status: 'Under Review', submitted: '2026-07-09',
      registrationDate: '2026-07-05', verificationLevel: 'Enhanced',
      documents: [
        DOC('Government ID', 'pan_anita.pdf'),
        DOC('Address Proof', 'utility_bill_anita.pdf'),
        DOC('Profile Photo', 'profile_anita.jpg')
      ],
      checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 3 })),
      timeline: [
        { date: '2026-07-09', event: 'Application submitted' },
        { date: '2026-07-09', event: 'Assigned to Admin' }
      ],
      notes: 'Enhanced verification requested for large donations.',
      reviewer: 'Platform Admin'
    },
    {
      id: 'v-donor-3', type: 'Donor', name: 'Demo Donor', email: 'donor@gmail.com',
      phone: '+91 98765 43210', avatar: 'DD', status: 'Verified', submitted: '2026-07-05',
      registrationDate: '2026-01-15', verificationLevel: 'Standard',
      documents: [
        DOC('Government ID', 'aadhaar_demo.pdf'),
        DOC('Address Proof', 'address_demo.pdf'),
        DOC('Profile Photo', 'profile_demo.jpg')
      ],
      checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, checked: true })),
      timeline: [
        { date: '2026-01-15', event: 'Registered' },
        { date: '2026-01-16', event: 'Verified' }
      ],
      notes: '',
      reviewer: 'Platform Admin'
    },
    {
      id: 'v-2', type: 'Receiver', name: 'Ravi Kumar', email: 'receiver@outlook.com',
      phone: '+91 98765 43211', avatar: 'RK', status: 'Pending', submitted: '2026-07-07',
      registrationDate: '2026-06-01', assistanceType: 'Emergency',
      address: '12 Green Park, Andheri East, Mumbai, Maharashtra',
      incomeStatus: 'Low Income — Verified',
      documents: [
        DOC('Government ID', 'aadhaar_ravi.pdf'),
        DOC('Income Proof', 'income_cert_ravi.pdf'),
        DOC('Medical Reports', 'medical_report_ravi.pdf'),
        DOC('Education Proof', 'education_cert_ravi.pdf'),
        DOC('Recommendation Letter', 'recommendation_ravi.pdf')
      ],
      checklist: DEFAULT_CHECKLIST,
      timeline: [
        { date: '2026-07-07', event: 'Verification submitted' },
        { date: '2026-07-08', event: 'Documents under review' }
      ],
      notes: 'Emergency assistance applicant. Priority review recommended.',
      reviewer: 'Unassigned'
    },
    {
      id: 'v-4', type: 'Receiver', name: 'Sunita Deshmukh', email: 'sunita@example.com',
      phone: '+91 99887 76655', avatar: 'SD', status: 'Pending', submitted: '2026-07-09',
      registrationDate: '2026-07-05', assistanceType: 'Medical',
      address: '45 MG Road, Pune, Maharashtra',
      incomeStatus: 'Below Poverty Line',
      documents: [
        DOC('Government ID', 'aadhaar_sunita.pdf'),
        DOC('Income Proof', 'income_sunita.pdf'),
        DOC('Medical Reports', 'hospital_bills_sunita.pdf')
      ],
      checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 2 })),
      timeline: [{ date: '2026-07-09', event: 'Application submitted' }],
      notes: '',
      reviewer: 'Unassigned'
    },
    {
      id: 'v-recv-3', type: 'Receiver', name: 'Priya Nair', email: 'priya@example.com',
      phone: '+91 87654 32109', avatar: 'PN', status: 'Rejected', submitted: '2026-07-04',
      registrationDate: '2026-07-02', assistanceType: 'Education',
      address: '78 Lake View, Kochi, Kerala',
      incomeStatus: 'Self-Declared',
      documents: [DOC('Government ID', 'id_priya.pdf'), DOC('Education Proof', 'marksheet_priya.pdf')],
      checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, checked: false })),
      timeline: [
        { date: '2026-07-04', event: 'Submitted' },
        { date: '2026-07-05', event: 'Rejected — incomplete documents' }
      ],
      notes: 'Missing income proof.',
      reviewer: 'Platform Admin',
      rejectionReason: 'Incomplete Documentation'
    },
    {
      id: 'v-1', type: 'NGO', name: 'Asha Kiran Foundation', email: 'ngo@ashakiran.org',
      phone: '+91 22 4000 1234', avatar: '🏛', logo: '🏛', status: 'Pending', submitted: '2026-07-08',
      registrationDate: '2010-03-15', registrationId: 'MH/NGO/2010/004521',
      representative: 'Priya Sharma', location: 'Andheri East, Mumbai, Maharashtra',
      operatingAreas: ['Mumbai', 'Thane', 'Maharashtra'],
      documents: [
        DOC('NGO Registration Certificate', 'ngo_registration_certificate.pdf'),
        DOC('PAN Card', 'pan_card_ashakiran.pdf'),
        DOC('Address Proof', 'address_proof.pdf'),
        DOC('Representative ID', 'representative_gov_id.pdf'),
        DOC('Bank Details', 'bank_account_details.pdf')
      ],
      checklist: [
        { id: 'reg', label: 'Registration Certificate Valid', checked: true },
        { id: 'pan', label: 'PAN Verified', checked: true },
        { id: 'bank', label: 'Bank Details Confirmed', checked: false },
        { id: 'rep', label: 'Representative ID Verified', checked: true },
        { id: 'duplicate', label: 'Duplicate Check', checked: true }
      ],
      timeline: [
        { date: '2026-07-08', event: 'Documents submitted' },
        { date: '2026-07-09', event: 'Under admin review' }
      ],
      notes: 'Established NGO with strong track record.',
      reviewer: 'Unassigned'
    },
    {
      id: 'v-3', type: 'NGO', name: 'Helpage India', email: 'info@helpageindia.org',
      phone: '+91 11 4200 5000', avatar: '💚', logo: '💚', status: 'Verified', submitted: '2026-07-05',
      registrationDate: '1978-06-12', registrationId: 'DL/NGO/1978/001102',
      representative: 'Dr. Rajesh Singh', location: 'New Delhi, Delhi',
      operatingAreas: ['Delhi NCR', 'Pan India'],
      documents: [
        DOC('NGO Registration Certificate', 'trust_deed_12A.pdf'),
        DOC('PAN Card', 'pan_helpage.pdf'),
        DOC('Bank Details', 'bank_helpage.pdf')
      ],
      checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, checked: true })),
      timeline: [
        { date: '2026-07-05', event: 'Submitted' },
        { date: '2026-07-06', event: 'Approved' }
      ],
      notes: '',
      reviewer: 'Platform Admin'
    },
    {
      id: 'v-ngo-4', type: 'NGO', name: 'Smile Foundation', email: 'info@smilefoundationindia.org',
      phone: '+91 124 400 4444', avatar: '😊', logo: '😊', status: 'Under Review', submitted: '2026-07-09',
      registrationDate: '2002-08-20', registrationId: 'HR/NGO/2002/005678',
      representative: 'Amit Gupta', location: 'Gurugram, Haryana',
      operatingAreas: ['Haryana', 'Uttar Pradesh', 'Rajasthan'],
      documents: [
        DOC('NGO Registration Certificate', 'registration_smile.pdf'),
        DOC('PAN Card', 'pan_smile.pdf'),
        DOC('Address Proof', 'address_smile.pdf'),
        DOC('Representative ID', 'rep_id_smile.pdf'),
        DOC('Bank Details', 'bank_smile.pdf')
      ],
      checklist: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 2 })),
      timeline: [{ date: '2026-07-09', event: 'Application submitted' }],
      notes: 'Pending bank detail verification.',
      reviewer: 'Platform Admin'
    }
  ];

  const ctxIds = new Set(contextVerifications.map((v) => v.id));
  const merged = base.map((item) => {
    const ctx = contextVerifications.find((v) => v.id === item.id);
    if (ctx) return { ...item, status: ctx.status, rejectionReason: ctx.rejectionReason };
    return item;
  });
  contextVerifications.forEach((v) => {
    if (!merged.find((m) => m.id === v.id)) {
      merged.push(enrichFromContext(v));
    }
  });
  return merged;
}

function enrichFromContext(v) {
  const initials = v.name?.split(' ').map((p) => p[0]).join('').slice(0, 2) || v.avatar || '?';
  return {
    id: v.id,
    type: v.type,
    name: v.name,
    email: v.email || '—',
    phone: v.phone || '—',
    avatar: initials,
    status: v.status,
    submitted: v.submitted,
    registrationDate: v.submitted,
    registrationId: v.registrationId,
    documents: v.documents?.length
      ? v.documents.map((d) => (typeof d === 'object' ? { ...d, uploadedAt: v.submitted } : DOC(d, d)))
      : [],
    checklist: v.checklist || DEFAULT_CHECKLIST,
    timeline: v.timeline?.length ? v.timeline : [{ date: v.submitted, event: 'Submitted' }],
    notes: v.notes || '',
    reviewer: v.reviewer || 'Unassigned'
  };
}

/** Production list — API verifications only, no demo seed data */
export function buildVerificationListFromApi(contextVerifications = []) {
  return contextVerifications.map(enrichFromContext);
}

export function getVerificationSummary(items, type) {
  const list = items.filter((i) => i.type === type);
  const today = new Date().toISOString().split('T')[0];
  const isToday = (d) => String(d || '').startsWith(today);
  return {
    pending: list.filter((i) => i.status === 'Pending' || i.status === 'Under Review').length,
    approvedToday: list.filter((i) => i.status === 'Verified' && isToday(i.reviewedAt || i.submitted)).length,
    rejectedToday: list.filter((i) => i.status === 'Rejected' && isToday(i.reviewedAt || i.submitted)).length,
    total: list.length
  };
}

export function getStatusCounts(items, type) {
  const list = items.filter((i) => i.type === type);
  return {
    Pending: list.filter((i) => i.status === 'Pending').length,
    Verified: list.filter((i) => i.status === 'Verified').length,
    Rejected: list.filter((i) => i.status === 'Rejected').length,
    'Under Review': list.filter((i) => i.status === 'Under Review').length
  };
}

export const ASSISTANCE_TYPES = [
  'Medical', 'Education', 'Emergency', 'Women & Child Welfare', 'Senior Citizen', 'Disability'
];

export const NGO_DOC_LABELS = [
  'NGO Registration Certificate', 'PAN', 'Address Proof', 'Representative ID', 'Bank Details'
];

export const RECEIVER_DOC_LABELS = [
  'Government ID', 'Income Proof', 'Medical Reports', 'Education Proof', 'Recommendation Letter'
];

export const DONOR_DOC_LABELS = ['Government ID', 'Address Proof', 'Profile Photo'];
