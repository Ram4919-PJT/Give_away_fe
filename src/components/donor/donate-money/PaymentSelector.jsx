import { Check } from 'lucide-react';
import { DONOR_PAYMENT_METHODS } from '../../../data/donorConstants';

export default function PaymentSelector({ value, onChange, compact }) {
  return (
    <div className={`money-pay-selector ${compact ? 'money-pay-selector--compact' : ''}`}>
      <label className="money-field-label">Payment Method</label>
      <div className="money-pay-grid" role="radiogroup" aria-label="Payment method">
        {DONOR_PAYMENT_METHODS.map((method) => {
          const selected = value === method.id;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`money-pay-opt ${selected ? 'is-selected' : ''}`}
              onClick={() => onChange(method.id)}
            >
              <span className="money-pay-opt__icon" aria-hidden="true">{method.icon}</span>
              <span className="money-pay-opt__label">{method.label}</span>
              {selected && (
                <span className="money-pay-opt__tick" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
