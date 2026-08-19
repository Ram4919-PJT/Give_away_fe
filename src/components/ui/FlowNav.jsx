import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

/**
 * Leave a page / return to a parent route. Prefer explicit `to` over browser history.
 */
export function PageBackLink({
  to,
  onClick,
  label,
  className = '',
  disabled = false,
}) {
  const classes = `page-back-link ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={label}>
        <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

/**
 * Animated wrapper when moving between wizard steps.
 */
export function FlowStepPanel({
  stepKey,
  direction = 'forward',
  className = '',
  children,
}) {
  const dir = direction === 'back' ? 'back' : 'forward';
  return (
    <div
      key={stepKey}
      className={`flow-step-panel flow-step-panel--${dir} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/**
 * Standard wizard footer: previous/cancel on the left, continue/submit on the right.
 */
export function FlowStepFooter({
  step,
  firstStep = 1,
  totalSteps,
  onBack,
  onCancel,
  cancelLabel = 'Cancel',
  backLabel = 'Previous',
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  continueIcon = true,
  isLastStep = false,
  onSubmit,
  submitLabel = 'Submit',
  submitting = false,
  submitDisabled = false,
  footerClassName = 'flow-step-footer flow-step-footer--split',
  backButtonClassName = 'flow-btn flow-btn--ghost',
  primaryButtonClassName = 'flow-btn flow-btn--primary',
}) {
  const showBack = step > firstStep;
  const showCancel = step === firstStep && onCancel;
  const showStepCount = totalSteps != null && step <= totalSteps;

  return (
    <footer className={footerClassName}>
      <div className="flow-step-footer__left">
        {showBack && (
          <button
            type="button"
            className={backButtonClassName}
            onClick={onBack}
            disabled={submitting}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {backLabel}
          </button>
        )}
        {showCancel && (
          <button
            type="button"
            className={backButtonClassName}
            onClick={onCancel}
            disabled={submitting}
          >
            {cancelLabel}
          </button>
        )}
      </div>

      <div className="flow-step-footer__right">
        {showStepCount && (
          <span className="flow-step-footer__count" aria-live="polite">
            Step {step} of {totalSteps}
          </span>
        )}
        {isLastStep ? (
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={onSubmit}
            disabled={submitting || submitDisabled}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="flow-spin" aria-hidden="true" />
                Submitting…
              </>
            ) : (
              submitLabel
            )}
          </button>
        ) : (
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={onContinue}
            disabled={continueDisabled || submitting}
          >
            {continueLabel}
            {continueIcon && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
    </footer>
  );
}
