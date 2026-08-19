import { Lock } from 'lucide-react';

export default function VerificationRequiredModal({
  open,
  onClose,
  onVerify,
  title = 'Verification Required',
  message = 'Your receiver account is not verified yet. Complete your verification to create and manage donation requests.',
}) {
  if (!open) return null;

  return (
    <div className="rd-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="rd-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-verify-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rd-modal__icon" aria-hidden="true">
          <Lock size={28} />
        </div>
        <h2 id="rd-verify-modal-title">{title}</h2>
        <p>{message}</p>
        <div className="rd-modal__actions">
          <button type="button" className="rd-btn rd-btn--primary" onClick={onVerify}>
            Complete Verification
          </button>
          <button type="button" className="rd-btn rd-btn--secondary" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
