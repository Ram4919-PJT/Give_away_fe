import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Info, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import RelativeTime from '../ui/RelativeTime';
import { normalizeMobile } from '../../utils/kycFieldValidation';

const RESEND_SECONDS = 60;
const OTP_LENGTH = 4;

function OtpDigitInputs({ value, onChange, disabled, error, onComplete }) {
  const inputsRef = useRef([]);
  const chars = (value || '').replace(/\D/g, '').slice(0, OTP_LENGTH);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] || '');

  const focusAt = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const setDigits = (nextDigits) => {
    const next = nextDigits.join('').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(next);
    if (next.length === OTP_LENGTH) onComplete?.(next);
  };

  const handleChange = (index, raw) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusAt(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    if (pasted.length === OTP_LENGTH) onComplete?.(pasted);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className={`kyc-otp-digits${error ? ' kyc-otp-digits--error' : ''}`} role="group" aria-label="4-digit OTP">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="kyc-otp-digits__cell"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function KycMobileOtpPanel({
  mobile,
  onMobileChange,
  mobileError,
  otpError,
  verified,
  verifiedAt,
  otpSent,
  otpCode,
  onOtpChange,
  sendBusy,
  verifyBusy,
  sendMessage,
  devOtp,
  onSendOtp,
  onVerifyOtp,
  disabled,
}) {
  const [resendLeft, setResendLeft] = useState(0);
  const lastAutoVerifyRef = useRef('');

  useEffect(() => {
    if (!otpSent || resendLeft <= 0) return undefined;
    const t = setInterval(() => setResendLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [otpSent, resendLeft]);

  useEffect(() => {
    if (!otpSent) lastAutoVerifyRef.current = '';
  }, [otpSent]);

  const handleSend = async () => {
    const issued = await onSendOtp?.();
    if (issued) setResendLeft(RESEND_SECONDS);
  };

  const handleVerify = async () => {
    const code = String(otpCode || '').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (code.length < OTP_LENGTH) return;
    if (lastAutoVerifyRef.current === code && verifyBusy) return;
    lastAutoVerifyRef.current = code;
    const ok = await onVerifyOtp?.();
    if (!ok) lastAutoVerifyRef.current = '';
  };

  const displayMobile = normalizeMobile(mobile);
  const canSend = displayMobile.length === 10 && !sendBusy && !disabled && !verifyBusy;
  const codeDigits = String(otpCode || '').replace(/\D/g, '');
  const canVerify = codeDigits.length >= OTP_LENGTH && !verifyBusy && !disabled && !sendBusy;
  const panelBusy = sendBusy || verifyBusy;
  const showOtpEntry = otpSent || codeDigits.length > 0;

  if (verified || verifiedAt) {
    return (
      <div className="kyc-otp-panel kyc-otp-panel--verified">
        <div className="kyc-otp-panel__verified-icon" aria-hidden="true">
          <ShieldCheck size={24} />
        </div>
        <div className="kyc-otp-panel__verified-body">
          <strong>Mobile verified successfully</strong>
          <p>
            <span className="kyc-otp-panel__verified-number">+91 {displayMobile || '—'}</span>
            {verifiedAt && (
              <span className="kyc-otp-panel__verified-time">
                Verified <RelativeTime value={verifiedAt} />
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-otp-panel">
      <div className="kyc-otp-steps">
        <div className={`kyc-otp-step${showOtpEntry ? ' kyc-otp-step--done' : ' kyc-otp-step--active'}`}>
          <span className="kyc-otp-step__num">1</span>
          <span>Send OTP</span>
        </div>
        <div className="kyc-otp-step__line" aria-hidden="true" />
        <div className={`kyc-otp-step${showOtpEntry ? ' kyc-otp-step--active' : ''}`}>
          <span className="kyc-otp-step__num">2</span>
          <span>Confirm code</span>
        </div>
      </div>

      <div className="kyc-otp-panel__step-card">
        <label className="kyc-otp-panel__label" htmlFor="kyc-mobile-input">
          Mobile number <span className="kyc-form-field__req">*</span>
        </label>
        <div className={`kyc-otp-panel__phone-row${mobileError ? ' kyc-otp-panel__phone-row--error' : ''}`}>
          <span className="kyc-otp-panel__prefix">+91</span>
          <input
            id="kyc-mobile-input"
            type="tel"
            className="kyc-otp-panel__phone-input"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
            value={displayMobile}
            onChange={(e) => onMobileChange(normalizeMobile(e.target.value))}
            disabled={disabled || panelBusy}
            aria-invalid={Boolean(mobileError)}
          />
          <button
            type="button"
            className="kyc-otp-panel__send-btn"
            onClick={handleSend}
            disabled={!canSend || (otpSent && resendLeft > 0)}
          >
            {sendBusy ? <Loader2 size={16} className="kyc-spin" aria-hidden="true" /> : null}
            <span>
              {otpSent
                ? (resendLeft > 0 ? `Resend (${resendLeft}s)` : 'Resend OTP')
                : 'Send OTP'}
            </span>
          </button>
        </div>
        {mobileError && (
          <p className="kyc-form-field__error" role="alert">{mobileError}</p>
        )}
        {sendMessage && !mobileError && (
          <p className="kyc-otp-panel__send-success" role="status">
            <CheckCircle2 size={14} aria-hidden="true" />
            {sendMessage}
          </p>
        )}
      </div>

      {showOtpEntry && (
        <div className="kyc-otp-panel__step-card kyc-otp-panel__step-card--otp">
          <p className="kyc-otp-panel__label">Enter 4-digit verification code</p>
          <p className="kyc-otp-panel__sublabel">
            <Info size={14} aria-hidden="true" />
            This is <strong>not</strong> the last 4 digits of your phone number.
          </p>

          {devOtp && import.meta.env.DEV && (
            <div className="kyc-otp-dev-hint" role="status">
              <MessageSquare size={16} aria-hidden="true" />
              <div>
                <span>Development test code</span>
                <strong className="kyc-otp-dev-hint__code">{devOtp}</strong>
              </div>
            </div>
          )}

          <div className="kyc-otp-panel__otp-center">
            <OtpDigitInputs
              value={otpCode}
              onChange={(v) => {
                lastAutoVerifyRef.current = '';
                onOtpChange(v);
              }}
              onComplete={handleVerify}
              disabled={disabled || panelBusy}
              error={otpError}
            />
          </div>

          {otpError && (
            <p className="kyc-otp-panel__otp-error" role="alert">{otpError}</p>
          )}

          <button
            type="button"
            className="kyc-otp-panel__verify-btn kyc-otp-panel__verify-btn--full"
            onClick={handleVerify}
            disabled={!canVerify}
          >
            {verifyBusy ? (
              <>
                <Loader2 size={18} className="kyc-spin" aria-hidden="true" />
                Verifying…
              </>
            ) : (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                Confirm & verify mobile
              </>
            )}
          </button>

          <p className="kyc-otp-panel__otp-hint">
            Code expires in 10 minutes. Tap Resend OTP if you need a new one.
          </p>
        </div>
      )}
    </div>
  );
}
