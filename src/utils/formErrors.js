const FIELD_LABELS = {
  item_name: 'Item name',
  category_id: 'Category',
  description: 'Description',
  quantity: 'Quantity',
  condition: 'Condition',
  pickup_line1: 'Pickup address',
  pickup_city: 'City',
  pickup_state: 'State',
  pickup_pincode: 'PIN / ZIP',
  subcategory: 'Subcategory',
  brand: 'Brand',
  model_variant: 'Model / variant',
};

const MSG_PATTERNS = [
  [/string should have at least (\d+) characters?/i, (n) => `must be at least ${n} characters`],
  [/string should have at most (\d+) characters?/i, (n) => `must be no more than ${n} characters`],
  [/field required/i, () => 'is required'],
  [/input should be a valid integer/i, () => 'must be a whole number'],
  [/greater than or equal to (\d+)/i, (n) => `must be at least ${n}`],
];

function humanizeSingleMessage(msg, fieldKey) {
  const label = FIELD_LABELS[fieldKey] || fieldKey?.replace(/_/g, ' ') || 'This field';
  const raw = String(msg || '').trim();
  for (const [pattern, fmt] of MSG_PATTERNS) {
    const m = raw.match(pattern);
    if (m) return `${label} ${fmt(m[1])}.`;
  }
  if (raw.toLowerCase().includes('required')) return `${label} is required.`;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Turn API error detail into a short user-facing string. */
export function formatApiError(error) {
  const message = error?.message || String(error || '');
  if (!message) return 'Something went wrong. Please try again.';

  // Comma-separated pydantic msgs from parseErrorDetail
  const parts = message.split(/,\s*(?=String |Field |Input |Value )/i).filter(Boolean);
  if (parts.length > 1) {
    const friendly = parts.map((p) => humanizeSingleMessage(p)).filter(Boolean);
    return friendly.length === 1 ? friendly[0] : `Please check: ${friendly.join(' ')}`;
  }

  return humanizeSingleMessage(message);
}

/** Map pydantic loc paths from API array detail to field keys. */
export function apiDetailToFieldErrors(detail) {
  if (!Array.isArray(detail)) return {};
  const errors = {};
  for (const item of detail) {
    const key = item?.loc?.[item.loc.length - 1];
    if (!key || typeof key !== 'string') continue;
    errors[key] = humanizeSingleMessage(item.msg, key);
  }
  return errors;
}
