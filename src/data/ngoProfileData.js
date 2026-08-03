export const NGO_FOCUS_AREAS = [
  'Education',
  'Medical',
  'Food Distribution',
  'Disaster Relief',
  'Shelter',
  'Women Empowerment',
  'Child Welfare',
  'Environment'
];

export const NGO_DOC_TYPES = [
  { id: 'registration', label: 'Registration Certificate', file: 'ngo-registration.pdf' },
  { id: 'pan', label: 'PAN', file: 'pan-card.pdf' },
  { id: '80g', label: '80G', file: '80g-certificate.pdf' },
  { id: '12a', label: '12A', file: '12a-certificate.pdf' },
  { id: 'tax', label: 'Tax Certificates', file: 'tax-certificate.pdf' }
];

export function buildProfileForm(user = {}) {
  return {
    name: user.name || '',
    repName: user.repName || '',
    email: user.email || '',
    mobile: user.mobile || '',
    website: user.website || '',
    regNumber: user.regNumber || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    pincode: user.pincode || '',
    mission: user.mission || '',
    about: user.about || '',
    focusAreas: Array.isArray(user.focusAreas) ? [...user.focusAreas] : [],
    logoUrl: user.logoUrl || '',
    logoName: user.logoName || ''
  };
}

export function computeProfileCompletion(form) {
  const checks = [
    form.name,
    form.repName,
    form.email,
    form.mobile,
    form.website,
    form.regNumber,
    form.address,
    form.city,
    form.state,
    form.pincode,
    form.mission,
    form.about,
    form.focusAreas?.length > 0,
    form.logoUrl
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function getVerificationDocs(verified) {
  if (verified) {
    return [
      { id: 'ngo-reg', label: 'NGO Registration', status: 'Verified' },
      { id: 'pan', label: 'PAN', status: 'Verified' },
      { id: '80g', label: '80G Certificate', status: 'Verified' },
      { id: '12a', label: '12A Certificate', status: 'Verified' },
      { id: 'csr', label: 'CSR Eligibility', status: 'Verified' }
    ];
  }
  return [
    { id: 'ngo-reg', label: 'NGO Registration', status: 'Pending' },
    { id: 'pan', label: 'PAN', status: 'Pending' },
    { id: '80g', label: '80G Certificate', status: 'Pending' },
    { id: '12a', label: '12A Certificate', status: 'Pending' },
    { id: 'csr', label: 'CSR Eligibility', status: 'Rejected' }
  ];
}
