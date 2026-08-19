export const CATEGORY_DETAIL_FIELDS = {
  clothing: [
    { key: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex', 'Children'] },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'age_group', label: 'Age group', type: 'select', options: ['Infant', 'Child', 'Teen', 'Adult'] },
    { key: 'material', label: 'Material', type: 'text' },
  ],
  electronics: [
    { key: 'working_condition', label: 'Working condition', type: 'select', options: ['Fully working', 'Minor issues', 'Needs repair'] },
    { key: 'purchase_year', label: 'Purchase year', type: 'text' },
    { key: 'accessories', label: 'Accessories included', type: 'text' },
  ],
  furniture: [
    { key: 'dimensions', label: 'Dimensions', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'approximate_age', label: 'Approximate age', type: 'text' },
  ],
  books: [
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'isbn', label: 'ISBN', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'edition', label: 'Edition', type: 'text' },
  ],
};
