import { useState } from 'react';
import { formatCurrency } from '../../../utils/donorHelpers';
import { WALLET_OPTIONS } from '../../../data/donateMoneyConfig';

export default function WalletPayment({ amount, onPay, disabled }) {
  const [wallet, setWallet] = useState('');

  return (
    <div className="money-pay-module">
      <header className="money-pay-module__head">
        <h2>Choose Wallet</h2>
        <p>Select a wallet to complete your donation</p>
      </header>

      <div className="money-wallet-grid">
        {WALLET_OPTIONS.map((w) => (
          <button
            key={w.id}
            type="button"
            className={`money-wallet-opt ${wallet === w.id ? 'is-selected' : ''}`}
            onClick={() => setWallet(w.id)}
          >
            <span className="money-wallet-opt__icon" aria-hidden="true">{w.icon}</span>
            <span>{w.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="login-submit money-pay-btn"
        disabled={disabled || amount <= 0 || !wallet}
        onClick={onPay}
      >
        Continue · {amount > 0 ? formatCurrency(amount) : ''}
      </button>
    </div>
  );
}
