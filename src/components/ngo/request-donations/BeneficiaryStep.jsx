import { Check } from 'lucide-react';
import {
  TARGET_BENEFICIARIES,
  CONDITION_OPTIONS
} from '../../../data/ngoDonationCategories';

export default function BeneficiaryStep({
  selected = [],
  condition = 'either',
  showCondition = false,
  onToggle,
  onConditionChange
}) {
  return (
    <section className="rd-step-panel" key="step-beneficiaries">
      <header className="rd-panel-head">
        <h2>Who are these items for?</h2>
        <p>Select all beneficiary groups that will receive this donation.</p>
      </header>

      <div className="rd-chip-grid">
        {TARGET_BENEFICIARIES.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              className={`rd-chip${active ? ' is-selected' : ''}`}
              aria-pressed={active}
              onClick={() => onToggle(item)}
            >
              {active && <Check size={13} strokeWidth={3} />}
              {item}
            </button>
          );
        })}
      </div>

      {showCondition && (
        <div className="rd-condition-block">
          <h3>Condition Needed</h3>
          <div className="rd-condition-options">
            {CONDITION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`rd-condition-card${condition === opt.id ? ' is-selected' : ''}`}
                aria-pressed={condition === opt.id}
                onClick={() => onConditionChange(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="rd-step-hint">
        {selected.length
          ? `${selected.length} group${selected.length > 1 ? 's' : ''} selected`
          : 'Select at least one beneficiary group to continue'}
      </p>
    </section>
  );
}
