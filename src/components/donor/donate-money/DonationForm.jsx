import { DONOR_MONEY_PRESETS, DONOR_PURPOSES } from '../../../data/donorConstants';
import PaymentSelector from './PaymentSelector';
import DonationSummary from './DonationSummary';

export default function DonationForm({
  checkout,
  amount,
  purpose,
  payment,
  onAmountChange,
  onPurposeChange,
  onPaymentSelect
}) {
  return (
    <div className="money-donation-form">
      {!checkout && (
        <header className="money-donation-form__head">
          <h2>Make a Donation</h2>
          <p>Choose an amount and payment method to continue securely.</p>
        </header>
      )}

      <div className="money-field">
        <label className="money-field-label">Select Amount</label>
        <div className="money-amt-grid">
          {DONOR_MONEY_PRESETS.map((preset) => {
            const selected = Number(amount) === preset;
            return (
              <button
                key={preset}
                type="button"
                className={`money-amt-chip ${selected ? 'is-selected' : ''}`}
                onClick={() => onAmountChange(String(preset))}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="money-field">
        <label className="money-field-label" htmlFor="donate-custom-amount">Custom Amount</label>
        <div className="money-custom-input-wrap">
          <span className="money-custom-input-prefix">₹</span>
          <input
            id="donate-custom-amount"
            type="number"
            className="money-custom-input"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter amount"
            min="1"
          />
        </div>
      </div>

      <div className="money-field">
        <label className="money-field-label" htmlFor="donate-purpose">Purpose</label>
        <select
          id="donate-purpose"
          className="money-select"
          value={purpose}
          onChange={(e) => onPurposeChange(e.target.value)}
        >
          {DONOR_PURPOSES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <PaymentSelector
        value={payment}
        onChange={onPaymentSelect}
        compact={checkout}
      />

      {checkout && (
        <DonationSummary
          amount={Number(amount) || 0}
          purpose={purpose}
          payment={payment}
        />
      )}
    </div>
  );
}
