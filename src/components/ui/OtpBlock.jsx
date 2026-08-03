import { useState } from 'react';

export default function OtpBlock({ type, prefix, onVerified }) {
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const send = () => {
    // demo
  };

  const verify = () => {
    if (!/^\d{6}$/.test(otp)) return false;
    setVerified(true);
    onVerified?.(true);
    return true;
  };

  const blockClass = prefix === 'receiver' ? 'receiver-reg-otp-block' : prefix === 'ngo' ? 'ngo-reg-otp-block' : 'donor-reg-otp-block';
  const btnClass = prefix === 'receiver' ? 'receiver-otp-btn' : prefix === 'ngo' ? 'ngo-otp-btn' : 'donor-otp-btn';

  return (
    <div className={`${blockClass} ${verified ? 'verified' : ''}`}>
      <div className={`${prefix}-reg-otp-head ${prefix === 'donor' ? 'donor-reg-otp-head' : prefix === 'receiver' ? 'receiver-reg-otp-head' : 'ngo-reg-otp-head'}`}>
        <span>{type === 'email' ? 'Email OTP' : 'Mobile OTP'}</span>
        <span className={`${prefix}-reg-otp-status ${verified ? 'is-verified' : ''}`}>
          {verified ? 'Verified ✓' : 'Not verified'}
        </span>
      </div>
      <div className={`${prefix}-reg-otp-row`}>
        <input
          type="text"
          placeholder="6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={verified}
        />
        <button type="button" className={`btn-outline btn-sm ${btnClass}`} onClick={send} disabled={verified}>
          Send
        </button>
        <button type="button" className={`btn-outline btn-sm ${btnClass}`} onClick={verify} disabled={verified}>
          Verify
        </button>
      </div>
    </div>
  );
}
