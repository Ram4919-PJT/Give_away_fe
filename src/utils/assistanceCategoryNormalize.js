/** Map legacy web slugs to canonical assistance category codes. */

const LEGACY_SLUG_TO_CODE = {
  medical: 'MEDICAL_HEALTHCARE',
  education: 'EDUCATION',
  food: 'FOOD_BASIC_NEEDS',
  housing: 'HOUSING_SHELTER',
  emergency: 'EMERGENCY',
  disability: 'DISABILITY_SUPPORT',
  family: 'FAMILY_SUPPORT',
  disaster: 'DISASTER_RELIEF',
  other: 'OTHER',
};

const CANONICAL_CODES = new Set(Object.values(LEGACY_SLUG_TO_CODE));

export function normalizeAssistanceCategoryCode(value) {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  const upper = raw.toUpperCase().replace(/-/g, '_');
  if (CANONICAL_CODES.has(upper)) return upper;
  const fromSlug = LEGACY_SLUG_TO_CODE[raw.toLowerCase()];
  return fromSlug || upper;
}
