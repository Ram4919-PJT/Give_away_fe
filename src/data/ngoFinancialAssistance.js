export const FINANCIAL_PURPOSE_CATEGORIES = [
  { id: 'medical', label: 'Medical', description: 'Treatment, medicines, and hospital care', icon: 'Stethoscope' },
  { id: 'education', label: 'Education', description: 'Fees, books, and learning support', icon: 'GraduationCap' },
  { id: 'food', label: 'Food', description: 'Nutrition kits and meal programs', icon: 'UtensilsCrossed' },
  { id: 'housing', label: 'Housing', description: 'Shelter, rent, and basic housing needs', icon: 'Home' },
  { id: 'disaster', label: 'Disaster Relief', description: 'Emergency response and recovery', icon: 'ShieldAlert' },
  { id: 'livelihood', label: 'Livelihood', description: 'Skills, tools, and income support', icon: 'Briefcase' },
  { id: 'other', label: 'Other', description: 'Community welfare and other needs', icon: 'HeartHandshake' }
];

export const FINANCIAL_PRIORITY_OPTIONS = [
  { id: 'Low', label: 'Low', color: '#2563EB' },
  { id: 'Medium', label: 'Medium', color: '#F59E0B' },
  { id: 'High', label: 'High', color: '#EF4444' },
  { id: 'Urgent', label: 'Urgent', color: '#DC2626' }
];

export const FINANCIAL_AMOUNT_MIN = 500;
export const FINANCIAL_AMOUNT_MAX = 500000;
export const FINANCIAL_REVIEW_TIME = '24–48 hours';

export const INITIAL_FINANCIAL_FORM = {
  amount: '',
  purposeCategory: '',
  priority: 'Medium',
  requiredBefore: '',
  beneficiaryCount: '',
  beneficiaryDetails: '',
  documents: [],
  notes: ''
};

export function getPurposeById(id) {
  return FINANCIAL_PURPOSE_CATEGORIES.find((c) => c.id === id) || null;
}

export function getPriorityById(id) {
  return FINANCIAL_PRIORITY_OPTIONS.find((p) => p.id === id) || FINANCIAL_PRIORITY_OPTIONS[1];
}

export function formatInrDisplay(value) {
  if (value === '' || value == null) return '';
  const num = Number(String(value).replace(/,/g, ''));
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('en-IN');
}

export function parseAmountInput(raw) {
  const digits = String(raw).replace(/[^\d]/g, '');
  if (!digits) return '';
  return String(Number(digits));
}

export function isFinancialFormValid(form) {
  const amount = Number(form.amount);
  return (
    form.amount !== '' &&
    !Number.isNaN(amount) &&
    amount >= FINANCIAL_AMOUNT_MIN &&
    amount <= FINANCIAL_AMOUNT_MAX &&
    !!form.purposeCategory &&
    !!form.priority &&
    !!form.requiredBefore &&
    !!form.beneficiaryCount &&
    Number(form.beneficiaryCount) > 0 &&
    !!form.beneficiaryDetails?.trim()
  );
}
