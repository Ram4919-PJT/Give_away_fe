export const DONOR_ITEM_CATEGORIES = [
  { id: 'clothes', label: 'Clothes', icon: '👕' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'medical', label: 'Medical Equipment', icon: '🏥' },
  { id: 'kitchen', label: 'Kitchen Items', icon: '🍳' },
  { id: 'education', label: 'Educational Materials', icon: '✏️' },
  { id: 'others', label: 'Others', icon: '📦' }
];

export const DONOR_MONEY_PRESETS = [500, 1000, 2500, 5000];

export const DONOR_PURPOSES = [
  'General Donation',
  'Medical Support',
  'Educational Support',
  'Emergency Relief',
  'Women & Child Welfare'
];

export const DONOR_PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: '👛' }
];

export const DONOR_JOURNEY_STEPS = [
  'Donation Submitted',
  'Verified by AJA Abayahastham',
  'Assigned to Verified NGO',
  'Delivered to Beneficiary',
  'Completed'
];

export const DONOR_STATUS_MAP = {
  'Pending Verification': 'Pending',
  'Pending Pickup': 'Pickup Scheduled',
  Pending: 'Pending',
  Approved: 'Approved',
  'Pickup Scheduled': 'Pickup Scheduled',
  Collected: 'Collected',
  Assigned: 'Assigned',
  Allocated: 'Assigned',
  Delivered: 'Delivered',
  'Fully Deployed': 'Completed',
  Completed: 'Completed'
};

export const IMPACT_STORIES = [
  {
    id: 'story-1',
    title: 'Medical Assistance Changed a Life',
    summary: 'Your donation helped provide emergency medical supplies to a family in need through AJA Abayahastham.',
    category: 'Medical Assistance',
    date: '2026-07-07',
    emoji: '🏥'
  },
  {
    id: 'story-2',
    title: 'Educational Support for Children',
    summary: 'Books and learning materials reached students who could not afford school supplies.',
    category: 'Educational Support',
    date: '2026-06-15',
    emoji: '📚'
  },
  {
    id: 'story-3',
    title: 'Emergency Relief Reached On Time',
    summary: 'Families affected by sudden hardship received timely support coordinated by AJA.',
    category: 'Emergency Relief',
    date: '2026-05-20',
    emoji: '🆘'
  },
  {
    id: 'story-4',
    title: 'Women & Child Welfare Program',
    summary: 'Essential supplies were distributed to mothers and children through verified partners.',
    category: 'Women & Child Welfare',
    date: '2026-04-10',
    emoji: '💝'
  }
];
