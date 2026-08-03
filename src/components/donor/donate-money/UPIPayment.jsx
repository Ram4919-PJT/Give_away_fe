import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { formatCurrency } from '../../../utils/donorHelpers';
import { UPI_APPS } from '../../../data/donateMoneyConfig';

export default function UPIPayment({ amount, onPay, disabled }) {
  const [upiId, setUpiId] = useState('');
  const [verified, setVerified] = useState(false);

  const verify = () => {
    if (!upiId.includes('@')) return;
    setVerified(true);
  };

  return (
    <div className="money-pay-module">
      <header className="money-pay-module__head">
        <h2>UPI Payment</h2>
        <p>Scan the QR code or enter your UPI ID</p>
      </header>

      <div className="money-upi-qr">
        <div className="money-upi-qr__box" aria-hidden="true">
          <QrCode size={120} strokeWidth={1.25} />
        </div>
        <p className="money-upi-qr__hint">Scan with any UPI app</p>
      </div>

      <div className="money-upi-apps">
        <span className="money-upi-apps__label">Supported Apps</span>
        <div className="money-upi-apps__grid">
          {UPI_APPS.map((app) => (
            <span key={app.id} className="money-upi-app">{app.label}</span>
          ))}
        </div>
      </div>

      <div className="money-divider"><span>OR</span></div>

      <div className="money-field">
        <label className="money-field-label" htmlFor="upi-id">Enter UPI ID</label>
        <div className="money-upi-row">
          <input
            id="upi-id"
            type="text"
            className="money-text-input"
            placeholder="name@upi"
            value={upiId}
            onChange={(e) => { setUpiId(e.target.value); setVerified(false); }}
          />
          <button type="button" className="money-btn-secondary" onClick={verify}>Verify</button>
        </div>
        {verified && <p className="money-field-success">UPI ID verified</p>}
      </div>

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
