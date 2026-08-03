/** Sub-items for each main donation category */

function sub(id, label, description, iconName = 'Package') {
  return { id, label, description, iconName };
}

export const CATEGORY_SUBITEMS = {
  clothes: {
    modalTitle: 'Choose Clothing Items',
    modalDescription: 'Select one or more clothing categories needed for this campaign.',
    items: [
      sub('winter-wear', 'Winter Wear', 'Jackets, sweaters and warm layers', 'Snowflake'),
      sub('summer-wear', 'Summer Wear', 'Light cotton and breathable apparel', 'Sun'),
      sub('school-uniforms', 'School Uniforms', 'Shirts, trousers and school sets', 'Shirt'),
      sub('baby-clothes', 'Baby Clothes', 'Onesies, rompers and infant wear', 'Baby'),
      sub('womens-clothing', "Women's Clothing", 'Sarees, kurtas and daily wear', 'Shirt'),
      sub('mens-clothing', "Men's Clothing", 'Shirts, pants and everyday wear', 'Shirt'),
      sub('blankets', 'Blankets', 'Warm blankets for families in need', 'Bed'),
      sub('bedsheets', 'Bedsheets', 'Cotton and fleece bedding sets', 'BedDouble'),
      sub('shoes', 'Shoes', 'Everyday footwear for all ages', 'Footprints'),
      sub('slippers', 'Slippers', 'Indoor and casual slippers', 'Footprints'),
      sub('raincoats', 'Raincoats', 'Waterproof rain protection gear', 'CloudRain'),
      sub('other-clothing', 'Other Clothing', 'Any other apparel not listed above', 'Package')
    ]
  },
  books: {
    modalTitle: 'Choose Book Items',
    modalDescription: 'Select one or more book types needed for this campaign.',
    items: [
      sub('school-textbooks', 'School Textbooks', 'Curriculum books by grade level', 'BookOpen'),
      sub('college-books', 'College Books', 'Higher education reference material', 'GraduationCap'),
      sub('story-books', 'Story Books', 'Fiction and illustrated storybooks', 'BookMarked'),
      sub('reference-books', 'Reference Books', 'Encyclopedias and guides', 'Library'),
      sub('exam-prep', 'Exam Preparation Books', 'Competitive exam study material', 'FileText'),
      sub('notebooks', 'Notebooks', 'Ruled and unruled writing pads', 'NotebookPen'),
      sub('dictionaries', 'Dictionaries', 'Language and subject dictionaries', 'BookOpen'),
      sub('children-books', "Children's Books", 'Early learning and picture books', 'BookOpen'),
      sub('educational-kits', 'Educational Kits', 'Learning kits with activity books', 'Backpack'),
      sub('other-books', 'Other Books', 'Any other reading material', 'Package')
    ]
  },
  food: {
    modalTitle: 'Choose Food Items',
    modalDescription: 'Select one or more food items needed for this campaign.',
    items: [
      sub('rice', 'Rice', 'Staple grain for family ration kits', 'Wheat'),
      sub('dal', 'Dal', 'Lentils and pulses for nutrition', 'UtensilsCrossed'),
      sub('cooking-oil', 'Cooking Oil', 'Edible oil for daily cooking', 'Flame'),
      sub('flour', 'Flour', 'Wheat and multigrain flour packs', 'Wheat'),
      sub('sugar', 'Sugar', 'Refined and raw sugar supplies', 'Candy'),
      sub('salt', 'Salt', 'Iodized salt for households', 'Circle'),
      sub('ready-to-eat', 'Ready-to-Eat Kits', 'Pre-packed meal and snack kits', 'Package'),
      sub('baby-food', 'Baby Food', 'Formula and infant nutrition', 'Baby'),
      sub('nutrition-kits', 'Nutrition Kits', 'Balanced micronutrient supplement packs', 'Heart'),
      sub('drinking-water', 'Drinking Water', 'Bottled or packaged safe water', 'Droplets'),
      sub('other-food', 'Other Food Items', 'Any other food supplies', 'Package')
    ]
  },
  medical: {
    modalTitle: 'Choose Medical Supplies',
    modalDescription: 'Select one or more medical items needed for this campaign.',
    items: [
      sub('medicines', 'Medicines', 'Essential prescription and OTC drugs', 'Pill'),
      sub('first-aid', 'First Aid Kits', 'Bandages, antiseptic and basic kits', 'Cross'),
      sub('wheelchairs', 'Wheelchairs', 'Mobility support for patients', 'Accessibility'),
      sub('walking-sticks', 'Walking Sticks', 'Support canes and walkers', 'Accessibility'),
      sub('hospital-beds', 'Hospital Beds', 'Adjustable beds for care facilities', 'Bed'),
      sub('sanitary-pads', 'Sanitary Pads', 'Menstrual hygiene products', 'Heart'),
      sub('adult-diapers', 'Adult Diapers', 'Incontinence care supplies', 'Heart'),
      sub('medical-equipment', 'Medical Equipment', 'Monitors, nebulizers and devices', 'Stethoscope'),
      sub('masks', 'Masks', 'Surgical and protective face masks', 'Shield'),
      sub('gloves', 'Gloves', 'Medical and examination gloves', 'Hand'),
      sub('other-medical', 'Other Medical Supplies', 'Any other health-related items', 'Package')
    ]
  },
  electronics: {
    modalTitle: 'Choose Electronics',
    modalDescription: 'Select one or more electronic items needed for this campaign.',
    items: [
      sub('laptops', 'Laptops', 'Portable computers for education', 'Laptop'),
      sub('desktops', 'Desktop Computers', 'PC systems for labs and offices', 'Monitor'),
      sub('mobile-phones', 'Mobile Phones', 'Smartphones for connectivity', 'Smartphone'),
      sub('tablets', 'Tablets', 'Tablets for learning programs', 'Tablet'),
      sub('printers', 'Printers', 'Inkjet and laser printers', 'Printer'),
      sub('projectors', 'Projectors', 'Classroom and training projectors', 'Projector'),
      sub('monitors', 'Monitors', 'Display screens and monitors', 'Monitor'),
      sub('keyboards', 'Keyboards', 'Wired and wireless keyboards', 'Keyboard'),
      sub('mouse', 'Mouse', 'Computer mice and pointers', 'Mouse'),
      sub('ups', 'UPS', 'Uninterruptible power supplies', 'Battery'),
      sub('other-electronics', 'Other Electronics', 'Any other electronic devices', 'Package')
    ]
  },
  furniture: {
    modalTitle: 'Choose Furniture Items',
    modalDescription: 'Select one or more furniture items needed for this campaign.',
    items: [
      sub('beds', 'Beds', 'Single and double bed frames', 'Bed'),
      sub('chairs', 'Chairs', 'Seating for homes and classrooms', 'Armchair'),
      sub('tables', 'Tables', 'Dining and utility tables', 'Table'),
      sub('study-desks', 'Study Desks', 'Student desks and writing tables', 'Table'),
      sub('cupboards', 'Cupboards', 'Storage cabinets and wardrobes', 'Archive'),
      sub('shelves', 'Shelves', 'Book and display shelving units', 'Layers'),
      sub('mattresses', 'Mattresses', 'Foam and coir mattresses', 'BedDouble'),
      sub('benches', 'Benches', 'Community and school benches', 'Armchair'),
      sub('office-furniture', 'Office Furniture', 'Desks, chairs and filing units', 'Briefcase'),
      sub('other-furniture', 'Other Furniture', 'Any other furnishing items', 'Package')
    ]
  },
  toys: {
    modalTitle: 'Choose Toy Items',
    modalDescription: 'Select one or more toy types needed for this campaign.',
    items: [
      sub('educational-toys', 'Educational Toys', 'STEM and learning-focused toys', 'Puzzle'),
      sub('soft-toys', 'Soft Toys', 'Plush animals and comfort toys', 'Heart'),
      sub('board-games', 'Board Games', 'Strategy and family board games', 'Grid3x3'),
      sub('sports-kits', 'Sports Kits', 'Balls, bats and outdoor sports gear', 'Dumbbell'),
      sub('art-kits', 'Art Kits', 'Crayons, paints and craft supplies', 'Palette'),
      sub('building-blocks', 'Building Blocks', 'Construction and block sets', 'Blocks'),
      sub('puzzles', 'Puzzles', 'Jigsaw and brain-teaser puzzles', 'Puzzle'),
      sub('musical-toys', 'Musical Toys', 'Instruments and sound toys', 'Music'),
      sub('outdoor-toys', 'Outdoor Toys', 'Slides, swings and play equipment', 'TreePine'),
      sub('other-toys', 'Other Toys', 'Any other recreational items', 'Package')
    ]
  },
  hygiene: {
    modalTitle: 'Choose Hygiene Items',
    modalDescription: 'Select one or more hygiene products needed for this campaign.',
    items: [
      sub('soap', 'Soap', 'Bath and hand soap bars', 'Droplets'),
      sub('toothpaste', 'Toothpaste', 'Oral care toothpaste tubes', 'Smile'),
      sub('toothbrush', 'Toothbrush', 'Individual and family toothbrushes', 'Smile'),
      sub('shampoo', 'Shampoo', 'Hair care shampoo sachets and bottles', 'Droplets'),
      sub('sanitizer', 'Sanitizer', 'Hand sanitizer and disinfectant', 'Shield'),
      sub('sanitary-pads-hygiene', 'Sanitary Pads', 'Menstrual hygiene products', 'Heart'),
      sub('towels', 'Towels', 'Bath and face towels', 'Bath'),
      sub('detergent', 'Detergent', 'Laundry and dish washing soap', 'Sparkles'),
      sub('personal-hygiene-kit', 'Personal Hygiene Kit', 'Complete individual care pack', 'Package'),
      sub('baby-hygiene-kit', 'Baby Hygiene Kit', 'Diapers, wipes and baby care', 'Baby'),
      sub('other-hygiene', 'Other Hygiene Items', 'Any other sanitation supplies', 'Package')
    ]
  }
};

export function getCategorySubitems(categoryId) {
  return CATEGORY_SUBITEMS[categoryId] || null;
}

export function resolveSelectedItems(categoryId, selectedIds = []) {
  const config = CATEGORY_SUBITEMS[categoryId];
  if (!config) return [];
  return selectedIds
    .map((id) => config.items.find((item) => item.id === id))
    .filter(Boolean);
}

export function getSelectedItemLabels(categoryId, selectedIds = []) {
  return resolveSelectedItems(categoryId, selectedIds).map((i) => i.label);
}
