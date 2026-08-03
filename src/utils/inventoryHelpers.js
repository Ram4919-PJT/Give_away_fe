/** Helpers for NGO inventory → donation request flow */

export const INVENTORY_CATEGORY_ICONS = {
  'Shelter/Clothing': 'BedDouble',
  'Medical Supplies': 'HeartPulse',
  'Medical Equipment': 'Accessibility',
  'Food & Rations': 'UtensilsCrossed'
};

export function getInventoryStockStatus(qty) {
  const n = Number(qty) || 0;
  if (n <= 0) return { id: 'out', label: 'Out of Stock', tone: 'danger' };
  if (n <= 10) return { id: 'low', label: 'Low Stock', tone: 'warning' };
  return { id: 'available', label: 'Available', tone: 'success' };
}

export function mapInventoryToDonationCategory(inventoryCategory) {
  const map = {
    'Shelter/Clothing': { id: 'bedding', label: 'Bedding' },
    'Medical Supplies': { id: 'medical', label: 'Medical Equipment' },
    'Medical Equipment': { id: 'medical', label: 'Medical Equipment' },
    'Food & Rations': { id: 'food', label: 'Food' }
  };
  return map[inventoryCategory] || { id: 'other', label: inventoryCategory || 'Other Essentials' };
}

export const INITIAL_INVENTORY_REQUEST_FORM = {
  quantity: '',
  beneficiaries: [],
  beneficiaryCount: '',
  priority: 'Medium',
  deliveryDate: '',
  location: '',
  reason: '',
  specialInstructions: ''
};
