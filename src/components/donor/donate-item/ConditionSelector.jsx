import { ITEM_CONDITIONS } from '../../../data/donateItemCategories';

export default function ConditionSelector({ value, onChange, disabled }) {
  return (
    <section className={`donate-subsection donate-subsection--condition ${disabled ? 'is-disabled' : ''}`}>
      <div className="donate-subsection__head">
        <h3 className="donate-subsection__title">Item Condition</h3>
        <p className="donate-subsection__hint">Select the overall condition of your donation</p>
      </div>
      <div className="donate-condition-grid" role="radiogroup" aria-label="Item condition">
        {ITEM_CONDITIONS.map((condition) => (
          <label
            key={condition}
            className={`donate-condition-opt ${value === condition ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name="item-condition"
              value={condition}
              checked={value === condition}
              disabled={disabled}
              onChange={() => onChange(condition)}
            />
            <span className="donate-condition-opt__dot" aria-hidden="true" />
            <span>{condition}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
