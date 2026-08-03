/** Category-specific modal form configurations */

export const CATEGORY_MODAL_CONFIG = {
  clothes: {
    title: 'Clothes',
    subtitle: 'Specify who needs clothes and what types are required.',
    sections: [
      {
        id: 'audience',
        type: 'radio',
        label: 'Who are the clothes for?',
        required: true,
        options: ['Men', 'Women', 'Boys', 'Girls', 'Infants', 'Senior Citizens']
      },
      {
        id: 'items',
        type: 'checkbox',
        label: 'Type of Clothes',
        required: true,
        options: [
          'Shirts', 'T-Shirts', 'Pants', 'Jeans', 'Sarees', 'Kurtas', 'Dresses',
          'School Uniforms', 'Sweaters', 'Jackets', 'Blankets', 'Socks', 'Shoes',
          'Slippers', 'Undergarments'
        ]
      },
      {
        id: 'condition',
        type: 'radio',
        label: 'Condition',
        required: true,
        options: ['New', 'Gently Used']
      },
      {
        id: 'size',
        type: 'size',
        label: 'Size',
        required: false,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Additional Notes', required: false }
    ]
  },
  food: {
    title: 'Food',
    subtitle: 'Tell us who will receive food and what items are needed.',
    sections: [
      {
        id: 'audience',
        type: 'radio',
        label: 'Who is it for?',
        required: true,
        options: ['Families', 'Children', 'Elderly', 'Students']
      },
      {
        id: 'items',
        type: 'checkbox',
        label: 'Food Type',
        required: true,
        options: [
          'Rice', 'Wheat', 'Dal', 'Flour', 'Oil', 'Vegetables', 'Fruits',
          'Ready Meals', 'Baby Food', 'Milk Powder', 'Dry Ration Kit'
        ]
      },
      {
        id: 'diet',
        type: 'radio',
        label: 'Diet',
        required: true,
        options: ['Vegetarian', 'Non-Vegetarian']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  books: {
    title: 'Books',
    subtitle: 'Select the audience and types of books needed.',
    sections: [
      {
        id: 'audience',
        type: 'radio',
        label: 'Audience',
        required: true,
        options: ['Kids', 'School Students', 'College Students', 'Competitive Exams', 'Adults']
      },
      {
        id: 'items',
        type: 'checkbox',
        label: 'Book Types',
        required: true,
        options: [
          'Textbooks', 'Notebooks', 'Story Books', 'Dictionaries',
          'Reference Books', 'Competitive Books', 'Educational Kits'
        ]
      },
      {
        id: 'language',
        type: 'text',
        label: 'Language',
        required: false,
        placeholder: 'e.g. English, Hindi, Marathi'
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  electronics: {
    title: 'Electronics',
    subtitle: 'Specify devices and their condition.',
    sections: [
      {
        id: 'items',
        type: 'checkbox',
        label: 'Category',
        required: true,
        options: ['Laptop', 'Desktop', 'Tablet', 'Mobile Phone', 'Printer', 'Monitor', 'Keyboard', 'Mouse']
      },
      {
        id: 'condition',
        type: 'radio',
        label: 'Condition',
        required: true,
        options: ['New', 'Used']
      },
      {
        id: 'workingStatus',
        type: 'radio',
        label: 'Working Status',
        required: true,
        options: ['Fully Working', 'Needs Repair']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  furniture: {
    title: 'Furniture',
    subtitle: 'Select furniture items and condition.',
    sections: [
      {
        id: 'items',
        type: 'checkbox',
        label: 'Items',
        required: true,
        options: ['Bed', 'Chair', 'Table', 'Sofa', 'Cupboard', 'Study Desk', 'Dining Table']
      },
      {
        id: 'condition',
        type: 'radio',
        label: 'Condition',
        required: true,
        options: ['New', 'Gently Used']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  medical: {
    title: 'Medical Equipment',
    subtitle: 'Specify medical supplies and equipment needed.',
    sections: [
      {
        id: 'items',
        type: 'checkbox',
        label: 'Equipment',
        required: true,
        options: [
          'Wheelchair', 'Walker', 'Crutches', 'First Aid Kit', 'Medicines',
          'BP Monitor', 'Glucometer', 'Oxygen Concentrator'
        ]
      },
      {
        id: 'condition',
        type: 'radio',
        label: 'Condition',
        required: true,
        options: ['New', 'Used']
      },
      { id: 'expiryDate', type: 'date', label: 'Expiry Date', required: false },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  children: {
    title: "Children's Items",
    subtitle: 'Items for children and age-appropriate supplies.',
    sections: [
      {
        id: 'items',
        type: 'checkbox',
        label: 'Items',
        required: true,
        options: ['Toys', 'School Bags', 'Baby Clothes', 'Diapers', 'Baby Food', 'Story Books', 'Games']
      },
      {
        id: 'ageGroup',
        type: 'radio',
        label: 'Age Group',
        required: true,
        options: ['0–2 years', '3–5 years', '6–12 years', '13–18 years']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  bedding: {
    title: 'Bedding',
    subtitle: 'Blankets, mattresses and bedding essentials.',
    sections: [
      {
        id: 'items',
        type: 'checkbox',
        label: 'Items',
        required: true,
        options: ['Blanket', 'Mattress', 'Pillow', 'Bedsheet', 'Quilt', 'Sleeping Bag']
      },
      {
        id: 'condition',
        type: 'radio',
        label: 'Condition',
        required: true,
        options: ['New', 'Gently Used']
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  other: {
    title: 'Other Essentials',
    subtitle: 'Describe custom items not listed in other categories.',
    sections: [
      {
        id: 'customItemName',
        type: 'text',
        label: 'Item Name',
        required: true,
        placeholder: 'Enter the item name'
      },
      { id: 'quantity', type: 'stepper', label: 'Quantity', required: true, min: 1, max: 9999 },
      { id: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  }
};

export function getCategoryModalConfig(categoryId) {
  return CATEGORY_MODAL_CONFIG[categoryId] || null;
}

export function getDefaultCategoryDetails(categoryId) {
  const config = getCategoryModalConfig(categoryId);
  if (!config) return { categoryId, quantity: 1 };

  const details = { categoryId, quantity: 1 };
  config.sections.forEach((section) => {
    if (section.type === 'checkbox') details[section.id] = [];
    else if (section.type === 'stepper') details[section.id] = 1;
    else details[section.id] = '';
  });
  return details;
}

export function buildCategorySummary(details) {
  if (!details) return { lines: [], itemCount: 0, quantity: 0 };

  const lines = [];
  if (details.audience) lines.push(details.audience);
  if (details.ageGroup) lines.push(details.ageGroup);
  if (details.customItemName) lines.push(details.customItemName);

  const items = Array.isArray(details.items) ? details.items : [];
  if (items.length === 1) lines.push(items[0]);
  else if (items.length > 1) lines.push(`${items.length} item types`);

  const quantity = Number(details.quantity) || 0;
  return {
    lines: lines.filter(Boolean).slice(0, 3),
    itemCount: items.length || (details.customItemName ? 1 : 0),
    quantity
  };
}

export function validateCategoryDetails(categoryId, details) {
  const config = getCategoryModalConfig(categoryId);
  if (!config || !details) return false;

  return config.sections.every((section) => {
    if (!section.required) return true;
    const val = details[section.id];
    if (section.type === 'checkbox') return Array.isArray(val) && val.length > 0;
    if (section.type === 'stepper') return Number(val) >= (section.min || 1);
    return val !== undefined && val !== null && String(val).trim() !== '';
  });
}

export function formatCategoryDetailsForSubmit(details) {
  if (!details) return '';
  const parts = [];
  if (details.audience) parts.push(`Audience: ${details.audience}`);
  if (details.ageGroup) parts.push(`Age: ${details.ageGroup}`);
  if (details.customItemName) parts.push(`Item: ${details.customItemName}`);
  if (details.items?.length) parts.push(`Items: ${details.items.join(', ')}`);
  if (details.condition) parts.push(`Condition: ${details.condition}`);
  if (details.diet) parts.push(`Diet: ${details.diet}`);
  if (details.size) parts.push(`Size: ${details.size}`);
  if (details.language) parts.push(`Language: ${details.language}`);
  if (details.workingStatus) parts.push(`Status: ${details.workingStatus}`);
  if (details.expiryDate) parts.push(`Expiry: ${details.expiryDate}`);
  if (details.notes) parts.push(`Notes: ${details.notes}`);
  return parts.join(' · ');
}
