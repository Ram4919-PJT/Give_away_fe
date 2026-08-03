/** Wireframe config — Apply for Financial Assistance guided flow (UI only) */

export const APPLY_FLOW_STEPS = [
  { id: 1, label: 'Choose Type' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review' }
];

export const APPLY_ASSISTANCE_CATEGORIES = [
  {
    id: 'medical',
    title: 'Medical Assistance',
    icon: '🏥',
    description: 'Hospital bills, medicines, and treatment costs'
  },
  {
    id: 'education',
    title: 'Educational Assistance',
    icon: '🎓',
    description: 'School fees, books, and educational expenses'
  },
  {
    id: 'emergency',
    title: 'Emergency Relief',
    icon: '🚨',
    description: 'Sudden crises — rent, food, disaster recovery'
  },
  {
    id: 'women-child',
    title: 'Women & Child Welfare',
    icon: '👩',
    description: 'Support for women and children in need'
  },
  {
    id: 'senior',
    title: 'Senior Citizen Assistance',
    icon: '👴',
    description: 'Elderly care, medical, and livelihood support'
  },
  {
    id: 'disability',
    title: 'Disability Support',
    icon: '♿',
    description: 'Aid for persons with disabilities'
  },
  {
    id: 'other',
    title: 'Other Financial Assistance',
    icon: '💙',
    description: 'Other verified financial hardship needs'
  }
];

export const APPLY_WIREFRAME_DOCUMENTS = [
  { name: 'Aadhaar Card', filename: 'aadhaar_card.pdf', progress: 100 },
  { name: 'Income Certificate', filename: 'income_certificate.pdf', progress: 72 },
  { name: 'Supporting Document', filename: 'supporting_doc.pdf', progress: 0 }
];

export const APPLY_UPLOAD_PLACEHOLDERS = [
  { label: 'Identity Proof', hint: 'PDF, JPG up to 5MB' },
  { label: 'Income Certificate', hint: 'PDF, JPG up to 5MB' },
  { label: 'Supporting Documents', hint: 'Optional additional files' }
];
