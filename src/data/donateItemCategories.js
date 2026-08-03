/** Donate Item — hierarchical category configuration */

export const ITEM_CONDITIONS = ['New', 'Like New', 'Good', 'Used'];

export const DONATE_ITEM_CATEGORY_CONFIG = [
  {
    id: 'clothes',
    label: 'Clothes',
    icon: '👕',
    steps: [
      {
        key: 'gender',
        label: 'Gender',
        options: ['Men', 'Women', 'Boys', 'Girls', 'Unisex']
      },
      {
        key: 'itemType',
        label: 'Clothing Type',
        dependsOn: 'gender',
        options: [
          'Shirts', 'T-Shirts', 'Jeans', 'Pants', 'Jackets', 'Sweaters',
          'Winter Wear', 'Traditional Wear', 'School Uniform', 'Baby Clothes',
          'Shoes', 'Blankets', 'Others'
        ]
      }
    ]
  },
  {
    id: 'books',
    label: 'Books',
    icon: '📚',
    steps: [
      {
        key: 'itemType',
        label: 'Book Type',
        options: [
          'Educational', 'Story Books', 'Novels', 'Competitive Exams',
          "Children's Books", 'Religious Books', 'Magazines', 'Others'
        ]
      }
    ]
  },
  {
    id: 'furniture',
    label: 'Furniture',
    icon: '🪑',
    steps: [
      {
        key: 'itemType',
        label: 'Furniture Type',
        options: [
          'Chair', 'Table', 'Bed', 'Sofa', 'Cupboard',
          'Study Table', 'Bookshelf', 'Others'
        ]
      }
    ]
  },
  {
    id: 'electronics',
    label: 'Electronics',
    icon: '💻',
    steps: [
      {
        key: 'itemType',
        label: 'Electronic Item',
        options: [
          'Mobile Phones', 'Laptops', 'Tablets', 'Desktop', 'Monitor', 'Printer',
          'TV', 'Keyboard', 'Mouse', 'Chargers', 'Fans', 'Mixers', 'Others'
        ]
      }
    ]
  },
  {
    id: 'medical',
    label: 'Medical Equipment',
    icon: '🏥',
    steps: [
      {
        key: 'itemType',
        label: 'Equipment Type',
        options: [
          'Wheelchair', 'Walker', 'Crutches', 'Hospital Bed', 'Nebulizer',
          'BP Monitor', 'Oxygen Concentrator', 'Others'
        ]
      }
    ]
  },
  {
    id: 'kitchen',
    label: 'Kitchen Items',
    icon: '🍳',
    steps: [
      {
        key: 'itemType',
        label: 'Kitchen Item',
        options: [
          'Utensils', 'Cooker', 'Plates', 'Glasses', 'Mixer', 'Water Filter', 'Others'
        ]
      }
    ]
  },
  {
    id: 'education',
    label: 'Educational Materials',
    icon: '✏️',
    steps: [
      {
        key: 'itemType',
        label: 'Material Type',
        options: [
          'School Bag', 'Notebook', 'Stationery', 'Pens', 'Geometry Box',
          'Calculator', 'Art Supplies', 'Others'
        ]
      }
    ]
  },
  {
    id: 'others',
    label: 'Others',
    icon: '📦',
    steps: [],
    emptyHint: 'Select a general category and describe your items in the next step.'
  }
];

export function getDonateCategoryConfig(categoryId) {
  return DONATE_ITEM_CATEGORY_CONFIG.find((c) => c.id === categoryId) || null;
}

export function getVisibleSteps(config, selections) {
  if (!config?.steps?.length) return [];
  return config.steps.filter((step) => {
    if (!step.dependsOn) return true;
    return Boolean(selections[step.dependsOn]);
  });
}

export function isStepComplete(step, selections) {
  return Boolean(selections[step.key]);
}

export function isCategorySelectionComplete(categoryId, selections) {
  const config = getDonateCategoryConfig(categoryId);
  if (!config) return false;
  if (!selections.condition) return false;

  const visibleSteps = getVisibleSteps(config, selections);
  return visibleSteps.every((step) => isStepComplete(step, selections));
}

export function buildSelectionBreadcrumb(categoryId, selections) {
  const config = getDonateCategoryConfig(categoryId);
  if (!config) return [];

  const crumbs = [{ label: 'Category', value: null }];
  crumbs.push({ label: config.label, value: config.id });

  getVisibleSteps(config, selections).forEach((step) => {
    if (selections[step.key]) {
      crumbs.push({ label: step.label, value: selections[step.key] });
    }
  });

  return crumbs;
}

export function formatDonationCategoryLabel(categoryId, selections) {
  const config = getDonateCategoryConfig(categoryId);
  if (!config) return '';

  const parts = [config.label];
  getVisibleSteps(config, selections).forEach((step) => {
    if (selections[step.key]) parts.push(selections[step.key]);
  });
  if (selections.condition) parts.push(`(${selections.condition})`);
  return parts.join(' › ');
}

export function clearDependentSelections(config, changedKey, selections) {
  if (!config?.steps) return selections;
  const next = { ...selections };
  const stepIndex = config.steps.findIndex((s) => s.key === changedKey);
  config.steps.slice(stepIndex + 1).forEach((step) => {
    delete next[step.key];
  });
  return next;
}
