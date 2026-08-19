import PaymentSelector from './PaymentSelector';
import DonationSummary from './DonationSummary';

const FALLBACK_PRESETS = [500, 1000, 2500, 5000];

export default function DonationForm({
  checkout,
  amount,
  purpose,
  programId,
  payment,
  programs = [],
  onAmountChange,
  onPurposeChange,
  onProgramChange,
  onPaymentSelect
}) {
  const activePrograms = (programs || []).filter(
    (p) => String(p.status || '').toUpperCase() === 'ACTIVE'
  );
  const presets = FALLBACK_PRESETS;

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
          {presets.map((preset) => {
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
        <label className="money-field-label" htmlFor="donate-purpose">Program / Cause</label>
        {activePrograms.length === 0 ? (
          <p className="text-sm text-[#49638F] m-0">No active programs are available yet. Your donation will support general platform relief.</p>
        ) : (
          <select
            id="donate-purpose"
            className="money-select"
            value={programId || activePrograms[0]?.program_id || ''}
            onChange={(e) => {
              const id = Number(e.target.value);
              const prog = activePrograms.find((p) => Number(p.program_id || p.id) === id);
              onProgramChange?.(id, prog?.title || prog?.program_name || purpose);
              onPurposeChange(prog?.title || prog?.program_name || 'General Donation');
            }}
          >
            {activePrograms.map((p) => (
              <option key={p.program_id || p.id} value={p.program_id || p.id}>
                {p.title || p.program_name}
              </option>
            ))}
          </select>
        )}
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
