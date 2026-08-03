export default function CategoryCard({ category, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`donate-cat-card ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(category.id)}
      aria-pressed={selected}
    >
      <span className="donate-cat-card__icon" aria-hidden="true">{category.icon}</span>
      <span className="donate-cat-card__label">{category.label}</span>
      {selected && <span className="donate-cat-card__check" aria-hidden="true">✓</span>}
    </button>
  );
}
