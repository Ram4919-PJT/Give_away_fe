import { useState } from 'react';
import { formatCurrency } from '../../../utils/donorHelpers';
import { POPULAR_BANKS } from '../../../data/donateMoneyConfig';

export default function NetBankingPayment({ amount, onPay, disabled }) {
  const [bank, setBank] = useState('');

  return (
    <div className="money-pay-module">
      <header className="money-pay-module__head">
        <h2>Net Banking</h2>
        <p>Select your bank to continue</p>
      </header>

      <div className="money-field">
        <span className="money-field-label">Popular Banks</span>
        <div className="money-bank-grid">
          {POPULAR_BANKS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`money-bank-opt ${bank === b.id ? 'is-selected' : ''}`}
              onClick={() => setBank(b.id)}
            >
              <span className="money-bank-opt__badge">{b.short}</span>
              <span>{b.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={`money-bank-opt money-bank-opt--other ${bank === 'other' ? 'is-selected' : ''}`}
            onClick={() => setBank('other')}
          >
            <span className="money-bank-opt__badge">+</span>
            <span>Other Bank</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="login-submit money-pay-btn"
        disabled={disabled || amount <= 0 || !bank}
        onClick={onPay}
      >
        Continue · {amount > 0 ? formatCurrency(amount) : ''}
      </button>
    </div>
  );
}
