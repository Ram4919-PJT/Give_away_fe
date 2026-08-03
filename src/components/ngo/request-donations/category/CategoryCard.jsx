import { Check } from 'lucide-react';
import CategoryIcon from '../CategoryIcon';

export default function CategoryCard({ category, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rd-cat-card${selected ? ' is-selected' : ''}`}
    >
      {selected && (
        <span className="rd-cat-card__check" aria-hidden="true">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      <span className="rd-cat-card__icon" aria-hidden="true">
        <CategoryIcon name={category.iconName} size={26} strokeWidth={1.6} />
      </span>

      <span className="rd-cat-card__title">{category.label}</span>
      <span className="rd-cat-card__desc">{category.description}</span>
    </button>
  );
}
