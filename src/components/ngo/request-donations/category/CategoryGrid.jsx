import { DONATION_CATEGORIES } from '../../../../data/ngoDonationCategories';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({ selectedCategory, onSelect }) {
  return (
    <div className="rd-cat-grid">
      {DONATION_CATEGORIES.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          selected={selectedCategory === cat.id}
          onClick={() => onSelect?.(cat.id)}
        />
      ))}
    </div>
  );
}
