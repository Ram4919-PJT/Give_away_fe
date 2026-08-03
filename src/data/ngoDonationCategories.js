export const REQUEST_WIZARD_STEPS = [
  { id: 1, label: 'Category' },
  { id: 2, label: 'Items' },
  { id: 3, label: 'For Whom' },
  { id: 4, label: 'Details' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Submitted' }
];

export const DONATION_CATEGORIES = [
  {
    id: 'clothes',
    iconName: 'Shirt',
    emoji: '👕',
    label: 'Clothes',
    description: 'Winter wear, uniforms and daily essentials'
  },
  {
    id: 'books',
    iconName: 'BookOpen',
    emoji: '📚',
    label: 'Books',
    description: 'Textbooks, notebooks and learning materials'
  },
  {
    id: 'food',
    iconName: 'UtensilsCrossed',
    emoji: '🍚',
    label: 'Food',
    description: 'Ration kits, dry goods and nutrition packs'
  },
  {
    id: 'bedding',
    iconName: 'BedDouble',
    emoji: '🛏',
    label: 'Bedding',
    description: 'Blankets, mattresses and bedding sets'
  },
  {
    id: 'furniture',
    iconName: 'Sofa',
    emoji: '🪑',
    label: 'Furniture',
    description: 'Beds, desks, chairs and home furnishings'
  },
  {
    id: 'medical',
    iconName: 'Stethoscope',
    emoji: '🩺',
    label: 'Medical Equipment',
    description: 'Mobility aids and medical devices'
  },
  {
    id: 'electronics',
    iconName: 'Laptop',
    emoji: '💻',
    label: 'Electronics',
    description: 'Laptops, phones and devices for education'
  },
  {
    id: 'children',
    iconName: 'Baby',
    emoji: '🧸',
    label: "Children's Essentials",
    description: 'Toys, kits and supplies for children'
  },
  {
    id: 'other',
    iconName: 'Package',
    emoji: '📦',
    label: 'Other Essentials',
    description: 'Hygiene kits and miscellaneous supplies'
  }
];

export const CATEGORY_SUBCATEGORIES = {
  clothes: [
    'Shirts', 'T-Shirts', 'Pants', 'Jeans', 'Sarees', 'Salwar Suits',
    'Jackets', 'Sweaters', 'Blankets', 'School Uniforms', 'Shoes', 'Socks', 'Mixed Clothing'
  ],
  books: [
    'Academic Books', "Children's Books", 'Story Books', 'Competitive Exam Books',
    'College Textbooks', 'Notebooks', 'Stationery Kits'
  ],
  food: [
    'Rice', 'Flour', 'Pulses', 'Cooking Oil', 'Baby Food', 'Dry Ration Kits', 'Ready-to-Eat Meals'
  ],
  bedding: [
    'Blankets', 'Bedsheets', 'Pillows', 'Mattresses', 'Quilts', 'Towels'
  ],
  furniture: [
    'Beds', 'Chairs', 'Tables', 'Study Tables', 'Cupboards', 'Mattresses'
  ],
  medical: [
    'Wheelchairs', 'Walking Sticks', 'Crutches', 'Hospital Beds',
    'Oxygen Concentrators', 'BP Monitor', 'Glucometer'
  ],
  electronics: [
    'Laptops', 'Tablets', 'Smartphones', 'Printers', 'Projectors', 'Chargers & Accessories'
  ],
  children: [
    'Toys', 'School Bags', 'Diapers', 'Feeding Bottles', 'Clothes for Kids', 'Learning Kits'
  ],
  other: [
    'Hygiene Kits', 'Sanitary Pads', 'Cleaning Supplies', 'Kitchenware', 'Mixed Essentials'
  ]
};

export const TARGET_BENEFICIARIES = [
  'Men',
  'Women',
  'Boys',
  'Girls',
  'Children',
  'Infants',
  'Senior Citizens',
  'Persons with Disabilities',
  'Mixed Group'
];

export const CONDITION_OPTIONS = [
  { id: 'new', label: 'New Only' },
  { id: 'gently-used', label: 'Gently Used' },
  { id: 'either', label: 'Either' }
];

export const REQUEST_TEMPLATES = [
  {
    id: 'winter-clothing',
    emoji: '👕',
    title: 'Winter Clothing Drive',
    categoryId: 'clothes',
    subcategories: ['Jackets', 'Sweaters', 'Blankets', 'Socks'],
    beneficiaries: ['Men', 'Women', 'Children'],
    condition: 'either',
    purpose: 'Winter clothing distribution for shelter residents',
    priority: 'High'
  },
  {
    id: 'school-kit',
    emoji: '📚',
    title: 'School Kit Distribution',
    categoryId: 'books',
    subcategories: ['Notebooks', 'Stationery Kits', 'Academic Books'],
    beneficiaries: ['Boys', 'Girls', 'Children'],
    condition: null,
    purpose: 'Back-to-school kits for underprivileged students',
    priority: 'Medium'
  },
  {
    id: 'monthly-food',
    emoji: '🍚',
    title: 'Monthly Food Distribution',
    categoryId: 'food',
    subcategories: ['Rice', 'Flour', 'Pulses', 'Cooking Oil', 'Dry Ration Kits'],
    beneficiaries: ['Mixed Group'],
    condition: null,
    purpose: 'Monthly dry ration kit distribution for families in need',
    priority: 'High'
  },
  {
    id: 'medical-camp',
    emoji: '🩺',
    title: 'Medical Camp',
    categoryId: 'medical',
    subcategories: ['BP Monitor', 'Glucometer', 'Wheelchairs', 'Walking Sticks'],
    beneficiaries: ['Senior Citizens', 'Persons with Disabilities', 'Mixed Group'],
    condition: null,
    purpose: 'Equipment support for community medical camp',
    priority: 'High'
  },
  {
    id: 'children-care',
    emoji: '🧸',
    title: "Children's Care Kit",
    categoryId: 'children',
    subcategories: ['Toys', 'Clothes for Kids', 'Learning Kits', 'School Bags'],
    beneficiaries: ['Children', 'Infants'],
    condition: null,
    purpose: 'Care kits for children in temporary shelters',
    priority: 'Medium'
  },
  {
    id: 'disaster-relief',
    emoji: '🛏',
    title: 'Disaster Relief Package',
    categoryId: 'bedding',
    subcategories: ['Blankets', 'Bedsheets', 'Mattresses', 'Towels'],
    beneficiaries: ['Mixed Group', 'Senior Citizens', 'Children'],
    condition: null,
    purpose: 'Emergency bedding and essentials for disaster-affected families',
    priority: 'High'
  }
];

export const PRIORITY_OPTIONS = [
  { id: 'High', label: 'High', hint: 'Urgent — reviewed first', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
  { id: 'Medium', label: 'Medium', hint: 'Standard timeline', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'Low', label: 'Low', hint: 'Flexible delivery', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
];

export const FREQUENT_CATEGORIES = ['Clothes', 'Food', 'Bedding', 'Medical Equipment', 'Books'];

export const GUIDELINE_ITEMS = [
  'Provide accurate quantities',
  'Explain the purpose clearly',
  'Mention beneficiary count',
  'Specify delivery location and required date',
  'Requests are reviewed within 24–48 hours'
];

export const DESCRIPTION_MAX = 500;

export const INITIAL_REQUEST_FORM = {
  category: null,
  subcategories: [],
  beneficiaries: [],
  condition: 'either',
  purpose: '',
  quantity: '',
  priority: 'Medium',
  beneficiaryCount: '',
  deliveryDate: '',
  location: '',
  description: '',
  specialInstructions: '',
  templateId: null
};

/** @deprecated use REQUEST_WIZARD_STEPS */
export const CAMPAIGN_WIZARD_STEPS = REQUEST_WIZARD_STEPS;

export function getCategoryById(id) {
  return DONATION_CATEGORIES.find((c) => c.id === id) || null;
}

export function getSubcategoriesFor(categoryId) {
  return CATEGORY_SUBCATEGORIES[categoryId] || [];
}

export function getTemplateById(id) {
  return REQUEST_TEMPLATES.find((t) => t.id === id) || null;
}

export function getPriorityStyle(priority) {
  return PRIORITY_OPTIONS.find((p) => p.id === priority) || PRIORITY_OPTIONS[1];
}

export function normalizeRequestStatus(status) {
  const map = {
    Draft: 'Pending',
    Submitted: 'Pending',
    Pending: 'Pending',
    'Under Review': 'Pending',
    Approved: 'Approved',
    Processing: 'In Progress',
    'In Progress': 'In Progress',
    Completed: 'Completed',
    Delivered: 'Completed',
    Rejected: 'Rejected'
  };
  return map[status] || 'Pending';
}

/** @deprecated */
export const normalizeCampaignStatus = normalizeRequestStatus;

export function computeRequestStats(requests = []) {
  const items = requests.filter((r) => r.type === 'Items');
  let open = 0;
  let approved = 0;
  let delivered = 0;
  let pending = 0;
  let rejected = 0;

  items.forEach((r) => {
    const s = normalizeRequestStatus(r.status);
    if (s === 'Approved') approved += 1;
    else if (s === 'Completed') delivered += 1;
    else if (s === 'Rejected') rejected += 1;
    else if (s === 'Pending') pending += 1;
    if (['Pending', 'Approved', 'In Progress'].includes(s)) open += 1;
  });

  return { open, approved, delivered, pending, rejected, total: items.length };
}

export function matchCategoryLabel(label) {
  if (!label) return null;
  return DONATION_CATEGORIES.find(
    (c) => c.label === label || label.toLowerCase().includes(c.label.split(' ')[0].toLowerCase())
  );
}
