import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import useRazorpayCheckout from '../../hooks/useRazorpayCheckout';
import { formatInr } from '../../utils/paymentHelpers';

const PRESETS = [500, 1000, 2500, 5000, 10000];
const slide = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

function StepPill({ index, label, active, done }) {
  return (
    <div className={`pay-step-pill${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}>
      <span className="pay-step-pill__dot">{done ? <CheckCircle2 size={14} /> : index}</span>
      <span>{label}</span>
    </div>
  );
}

export default function PaymentCheckoutExperience({
  programs = [],
  mobile,
  donorName,
  donorNameEditable = false,
  authenticated = false,
  initialAmount = 2500,
  initialProgramId,
  onSuccess,
  onBack,
  showHeader = true,
}) {
  const activePrograms = useMemo(
    () => (programs || []).filter((p) => String(p.status || 'ACTIVE').toUpperCase() === 'ACTIVE'),
    [programs]
  );

  const [step, setStep] = useState('amount');
  const [amount, setAmount] = useState(String(initialAmount));
  const [customAmount, setCustomAmount] = useState(String(initialAmount));
  const [programId, setProgramId] = useState(
    initialProgramId || activePrograms[0]?.program_id || activePrograms[0]?.id || 1
  );
  const [name, setName] = useState(donorName || '');
  const { pay, phase, error, isBusy } = useRazorpayCheckout();

  const numericAmount = Number(amount) || 0;
  const selectedProgram = activePrograms.find(
    (p) => Number(p.program_id || p.id) === Number(programId)
  );
  const programName = selectedProgram?.program_name || selectedProgram?.title || 'General Donation';

  const selectAmount = (val) => {
    setAmount(String(val));
    setCustomAmount(String(val));
  };

  const handleCustomChange = (val) => {
    setCustomAmount(val);
    const num = Number(val);
    if (!Number.isNaN(num) && num > 0) setAmount(String(num));
  };

  const goReview = () => {
    if (numericAmount < 1) return;
    setStep('review');
  };

  const handlePay = async () => {
    try {
      const result = await pay({
        amount: numericAmount,
        programId,
        programName,
        mobile,
        donorName: name || donorName,
        authenticated,
        onSuccess: (donation) => {
          onSuccess?.(donation);
        },
      });
      return result;
    } catch {
      /* surfaced via error state */
    }
  };

  const phaseLabel = {
    creating: 'Creating secure order…',
    checkout: 'Opening payment gateway…',
    verifying: 'Confirming your payment…',
    success: 'Payment successful!',
  }[phase];

  return (
    <div className="pay-checkout">
      {showHeader && (
        <header className="pay-checkout__head">
          <div className="pay-checkout__badge">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Secure checkout</span>
          </div>
          <h2>Complete your donation</h2>
          <p>Fast, encrypted payments powered by Razorpay.</p>
          {mobile && (
            <div className="pay-checkout__mobile" aria-label={`Verified mobile +91 ${mobile}`}>
              📱 +91 {mobile}
            </div>
          )}
        </header>
      )}

      <div className="pay-steps" aria-label="Checkout progress">
        <StepPill index={1} label="Amount" active={step === 'amount'} done={step === 'review'} />
        <div className="pay-steps__line" />
        <StepPill index={2} label="Review & Pay" active={step === 'review'} done={false} />
      </div>

      {error && (
        <motion.div
          className="pay-alert"
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="pay-checkout__body">
        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div key="amount" className="pay-panel" {...slide}>
              <label className="pay-label">Choose amount</label>
              <div className="pay-amount-grid">
                {PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`pay-amount-chip${numericAmount === val ? ' is-selected' : ''}`}
                    onClick={() => selectAmount(val)}
                  >
                    {formatInr(val)}
                  </button>
                ))}
              </div>

              <label className="pay-label" htmlFor="pay-custom-amount">Custom amount</label>
              <div className="pay-input-wrap">
                <span>₹</span>
                <input
                  id="pay-custom-amount"
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <label className="pay-label" htmlFor="pay-program">Program / cause</label>
              {activePrograms.length === 0 ? (
                <p className="pay-hint">Your donation will support AJA Abayahastham relief programs.</p>
              ) : (
                <select
                  id="pay-program"
                  className="pay-select"
                  value={programId}
                  onChange={(e) => setProgramId(Number(e.target.value))}
                >
                  {activePrograms.map((p) => (
                    <option key={p.program_id || p.id} value={p.program_id || p.id}>
                      {p.program_name || p.title}
                    </option>
                  ))}
                </select>
              )}

              {donorNameEditable && (
                <>
                  <label className="pay-label" htmlFor="pay-donor-name">Name for receipt (optional)</label>
                  <input
                    id="pay-donor-name"
                    type="text"
                    className="pay-text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name for 80G tax receipt"
                  />
                </>
              )}
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div key="review" className="pay-panel" {...slide}>
              <div className="pay-review-card">
                <div className="pay-review-card__icon" aria-hidden="true">
                  <Heart size={22} />
                </div>
                <div>
                  <p className="pay-review-card__eyebrow">You are supporting</p>
                  <h3>{programName}</h3>
                </div>
              </div>

              <div className="pay-summary">
                <div className="pay-summary__row">
                  <span>Donation amount</span>
                  <strong>{formatInr(numericAmount)}</strong>
                </div>
                <div className="pay-summary__row">
                  <span>Platform fee</span>
                  <strong className="pay-summary__free">₹0</strong>
                </div>
                <div className="pay-summary__row">
                  <span>80G tax benefit</span>
                  <strong className="pay-summary__yes">Eligible</strong>
                </div>
                <div className="pay-summary__total">
                  <span>Total payable</span>
                  <strong>{formatInr(numericAmount)}</strong>
                </div>
              </div>

              <div className="pay-trust-row">
                <Sparkles size={16} aria-hidden="true" />
                <span>256-bit encryption · PCI-DSS compliant · Razorpay secured</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pay-checkout__footer">
        {step === 'amount' ? (
          <button type="button" className="pay-btn pay-btn--primary" onClick={goReview} disabled={numericAmount < 1}>
            <span>Continue</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <div className="pay-footer-actions">
            <button
              type="button"
              className="pay-btn pay-btn--ghost"
              onClick={() => setStep('amount')}
              disabled={isBusy}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="pay-btn pay-btn--primary pay-btn--grow"
              onClick={handlePay}
              disabled={isBusy}
            >
              {isBusy ? (
                <>
                  <Loader2 size={18} className="pay-spin" aria-hidden="true" />
                  <span>{phaseLabel || 'Processing…'}</span>
                </>
              ) : (
                <>
                  <Lock size={16} aria-hidden="true" />
                  <span>Pay {formatInr(numericAmount)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {onBack && step === 'amount' && (
        <button type="button" className="pay-back-link" onClick={onBack}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </button>
      )}
    </div>
  );
}
