import { useState } from 'react';
import { formatCurrency } from '../../../utils/donorHelpers';

export default function CardPayment({ amount, onPay, disabled }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '', save: false });

  return (
    <div className="money-pay-module">
      <header className="money-pay-module__head">
        <h2>Credit / Debit Card</h2>
        <div className="money-card-brands" aria-hidden="true">
          <span>VISA</span>
          <span>MC</span>
          <span>RuPay</span>
        </div>
      </header>

      <div className="money-field">
        <label className="money-field-label" htmlFor="card-number">Card Number</label>
        <input
          id="card-number"
          type="text"
          className="money-text-input"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={card.number}
          onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
        />
      </div>

      <div className="money-form-row">
        <div className="money-field">
          <label className="money-field-label" htmlFor="card-expiry">Expiry</label>
          <input
            id="card-expiry"
            type="text"
            className="money-text-input"
            placeholder="MM/YY"
            maxLength={5}
            value={card.expiry}
            onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
          />
        </div>
        <div className="money-field">
          <label className="money-field-label" htmlFor="card-cvv">CVV</label>
          <input
            id="card-cvv"
            type="password"
            className="money-text-input"
            placeholder="•••"
            maxLength={4}
            value={card.cvv}
            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
          />
        </div>
      </div>

      <div className="money-field">
        <label className="money-field-label" htmlFor="card-name">Card Holder Name</label>
        <input
          id="card-name"
          type="text"
          className="money-text-input"
          placeholder="Name on card"
          value={card.name}
          onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
        />
      </div>

      <label className="money-checkbox">
        <input
          type="checkbox"
          checked={card.save}
          onChange={(e) => setCard((c) => ({ ...c, save: e.target.checked }))}
        />
        <span>Save card for future donations</span>
      </label>

      <button
        type="button"
        className="login-submit money-pay-btn"
        disabled={disabled || amount <= 0}
        onClick={onPay}
      >
        Pay {amount > 0 ? formatCurrency(amount) : 'Now'}
      </button>
    </div>
  );
}
