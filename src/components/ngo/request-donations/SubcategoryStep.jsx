import { Check } from 'lucide-react';
import { getCategoryById, getSubcategoriesFor } from '../../../data/ngoDonationCategories';

export default function SubcategoryStep({ categoryId, selected = [], onToggle }) {
  const category = getCategoryById(categoryId);
  const items = getSubcategoriesFor(categoryId);

  return (
    <section className="rd-step-panel" key="step-subcategory">
      <header className="rd-panel-head">
        <h2>Select Items Needed</h2>
        <p>
          Choose one or more {category?.label?.toLowerCase() || 'item'} types for this request.
        </p>
      </header>

      <div className="rd-subcat-grid">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              className={`rd-subcat-card${active ? ' is-selected' : ''}`}
              aria-pressed={active}
              onClick={() => onToggle(item)}
            >
              {active && (
                <span className="rd-subcat-card__check" aria-hidden="true">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
              <span className="rd-subcat-card__label">{item}</span>
            </button>
          );
        })}
      </div>

      <p className="rd-step-hint">
        {selected.length
          ? `${selected.length} item type${selected.length > 1 ? 's' : ''} selected`
          : 'Select at least one item type to continue'}
      </p>
    </section>
  );
}
