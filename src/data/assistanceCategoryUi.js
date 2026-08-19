/**
 * UI-only presentation metadata for canonical assistance category codes.
 * Business rules (names, documents) come from GET /core/config/receiver-assistance.
 *
 * Sync rule: codes must match backend receiver_assistance_config.py exactly.
 */

export const CATEGORY_UI_BY_CODE = {
  MEDICAL_HEALTHCARE: { icon: '🏥', accent: '#EEF5FF' },
  EDUCATION: { icon: '🎓', accent: '#F3E8FF' },
  FOOD_BASIC_NEEDS: { icon: '🍽️', accent: '#FFF7ED' },
  HOUSING_SHELTER: { icon: '🏠', accent: '#ECFDF5' },
  EMERGENCY: { icon: '🚨', accent: '#FEF2F2' },
  DISABILITY_SUPPORT: { icon: '♿', accent: '#EEF2FF' },
  FAMILY_SUPPORT: { icon: '👨‍👩‍👧', accent: '#FDF2F8' },
  DISASTER_RELIEF: { icon: '🌊', accent: '#ECFEFF' },
  OTHER: { icon: '💙', accent: '#F1F5F9' },
};

/** Fallback when API is unavailable — mirrors backend canonical list (labels only). */
export const FALLBACK_ASSISTANCE_CATEGORIES = [
  { code: 'MEDICAL_HEALTHCARE', name: 'Medical & Healthcare', description: 'Hospital bills, medicines, diagnostics, and treatment-related expenses.' },
  { code: 'EDUCATION', name: 'Education', description: 'School or college fees, admission, and education-related costs.' },
  { code: 'FOOD_BASIC_NEEDS', name: 'Food & Basic Needs', description: 'Food, groceries, and essential daily living support.' },
  { code: 'HOUSING_SHELTER', name: 'Housing & Shelter', description: 'Rent, shelter, repairs, eviction, or housing emergency support.' },
  { code: 'EMERGENCY', name: 'Emergency', description: 'Urgent crisis support requiring timely assistance.' },
  { code: 'DISABILITY_SUPPORT', name: 'Disability Support', description: 'Aid for persons with disabilities including medical and assistive needs.' },
  { code: 'FAMILY_SUPPORT', name: 'Family Support', description: 'Support for family members in verified financial hardship.' },
  { code: 'DISASTER_RELIEF', name: 'Disaster Relief', description: 'Recovery support after natural or community disasters.' },
  { code: 'OTHER', name: 'Other', description: 'Other verified financial hardship not covered above.' },
];

export function mergeCategoryWithUi(apiCategory) {
  const ui = CATEGORY_UI_BY_CODE[apiCategory.code] || CATEGORY_UI_BY_CODE.OTHER;
  return {
    code: apiCategory.code,
    id: apiCategory.code,
    name: apiCategory.name,
    title: apiCategory.name,
    description: apiCategory.description,
    icon: ui.icon,
    accent: ui.accent,
    requires_detailed_explanation: apiCategory.requires_detailed_explanation,
    required_documents: apiCategory.required_documents || [],
    optional_documents: apiCategory.optional_documents || [],
    conditional_documents: apiCategory.conditional_documents || [],
  };
}

export function buildCategoriesFromConfig(config) {
  const list = config?.categories?.length ? config.categories : FALLBACK_ASSISTANCE_CATEGORIES;
  return list.map(mergeCategoryWithUi);
}

export function documentHintsForCategory(category) {
  if (!category) return [];
  const required = (category.required_documents || []).map((d) => d.label);
  const optional = (category.optional_documents || []).map((d) => d.label);
  const conditional = (category.conditional_documents || []).map((d) => d.label);
  return [...required, ...optional, ...conditional].filter(Boolean);
}

export function categoryRequiresUploadedDocuments(category) {
  return Boolean(category?.required_documents?.length);
}
