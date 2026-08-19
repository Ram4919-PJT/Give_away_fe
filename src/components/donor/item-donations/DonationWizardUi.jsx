import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Pencil, Upload, X } from 'lucide-react';

export function WizardField({
  id,
  label,
  required,
  optional,
  hint,
  error,
  className = '',
  children,
}) {
  return (
    <div className={`idw-field ${error ? 'idw-field--error' : ''} ${className}`.trim()}>
      <label htmlFor={id} className="idw-field__label">
        {label}
        {required && <span className="idw-field__req" aria-hidden="true">*</span>}
      </label>
      {children}
      {optional && !error && <span className="idw-field__optional">Optional</span>}
      {hint && !error && !optional && <span className="idw-field__hint">{hint}</span>}
      {error && (
        <span className="idw-field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function DonationStepper({ steps, currentStep, onStepClick }) {
  const progressPct = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <>
      <nav className="idw-stepper" aria-label="Form progress">
        <ol className="idw-stepper__track">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={`idw-stepper__step${i < currentStep ? ' is-done' : ''}${i === currentStep ? ' is-current' : ''}`}
            >
              <button
                type="button"
                className="idw-stepper__btn"
                onClick={() => onStepClick(i)}
                disabled={i > currentStep}
                aria-current={i === currentStep ? 'step' : undefined}
              >
                <span className="idw-stepper__dot" aria-hidden="true">
                  {i < currentStep ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <span className="idw-stepper__label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <p className="idw-stepper__mobile-current" aria-live="polite">
        Step {currentStep + 1}: {steps[currentStep]?.label}
      </p>
      <div className="idw-progress" aria-hidden="true">
        <div className="idw-progress__bar" style={{ width: `${progressPct}%` }} />
      </div>
    </>
  );
}

export function StepPanel({ stepKey, direction, title, hint, children }) {
  const dir = direction >= 0 ? 'forward' : 'back';
  return (
    <div
      className={`flow-step-panel flow-step-panel--${dir} idw-wizard__panel idw-wizard__panel--slide idw-wizard__panel--${dir}`}
      key={stepKey}
    >
      <div className="idw-wizard__panel-head">
        <h2>{title}</h2>
        <p>{hint}</p>
      </div>
      {children}
    </div>
  );
}

export function StepNavigation({
  step,
  totalSteps,
  onBack,
  onContinue,
  onSubmit,
  busy,
  uploading,
  continueLabel = 'Continue',
  submitLabel = 'Submit Donation',
}) {
  const isLast = step >= totalSteps - 1;
  const disabled = busy || uploading;

  return (
    <footer className="idw-wizard__footer">
      <div className="idw-wizard__footer-left">
            {step > 0 && (
          <button
            type="button"
            className="idw-btn idw-btn--secondary"
            onClick={onBack}
            disabled={disabled}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Previous
          </button>
        )}
      </div>
      <div className="idw-wizard__footer-right">
        <span className="idw-wizard__step-count">
          Step {step + 1} of {totalSteps}
        </span>
        {isLast ? (
          <button
            type="button"
            className="idw-btn idw-btn--primary"
            onClick={onSubmit}
            disabled={disabled}
          >
            {busy ? (
              <>
                <Loader2 size={16} className="idw-spin" aria-hidden="true" />
                Submitting donation…
              </>
            ) : (
              <>
                <Check size={16} aria-hidden="true" />
                {submitLabel}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            className="idw-btn idw-btn--primary"
            onClick={onContinue}
            disabled={disabled}
          >
            {busy ? (
              <>
                <Loader2 size={16} className="idw-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                {continueLabel}
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
    </footer>
  );
}

export function PhotoUploader({
  photos,
  pendingPhotos,
  previewUrls,
  uploading,
  onUpload,
  onRemovePending,
  onDragOver,
  onDrop,
}) {
  return (
    <div className="idw-photos-step">
      <label
        className={`idw-upload-zone${uploading ? ' is-uploading' : ''}`}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {uploading ? (
          <Loader2 size={24} className="idw-spin" aria-hidden="true" />
        ) : (
          <Upload size={22} aria-hidden="true" />
        )}
        <span className="idw-upload-zone__title">
          {uploading ? 'Uploading…' : 'Drag & drop photos here'}
        </span>
        <span className="idw-upload-zone__sub">or click to browse · JPG/PNG · Max 10 MB · At least 1 required</span>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={uploading}
          onChange={(e) => {
            onUpload(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {(photos.length > 0 || pendingPhotos.length > 0) && (
        <div className="idw-photo-grid idw-photo-grid--upload">
          {photos.map((url) => (
            <div key={url} className="idw-photo-card">
              <img src={url} alt="Uploaded item" />
              <span className="idw-photo-card__status idw-photo-card__status--done">
                <Check size={12} /> Uploaded
              </span>
            </div>
          ))}
          {previewUrls.map((url, i) => (
            <div key={url} className="idw-photo-card idw-photo-card--pending">
              <img src={url} alt={`Pending upload ${i + 1}`} />
              <span className="idw-photo-card__status">Pending save</span>
              <button
                type="button"
                className="idw-photo-card__remove"
                aria-label="Remove photo"
                onClick={() => onRemovePending(i)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewSection({ title, onEdit, children }) {
  return (
    <section className="idw-review-section">
      <div className="idw-review-section__head">
        <h3>{title}</h3>
        <button type="button" className="idw-review-section__edit" onClick={onEdit}>
          <Pencil size={14} aria-hidden="true" />
          Edit
        </button>
      </div>
      <div className="idw-review-section__body">{children}</div>
    </section>
  );
}

export function WizardSuccess({ itemId, itemName, onViewDonations, onDashboard }) {
  return (
    <div className="idw-success">
      <div className="idw-success__icon" aria-hidden="true">
        <CheckCircle2 size={40} strokeWidth={1.75} />
      </div>
      <h2>Donation submitted successfully</h2>
      <p>
        <strong>{itemName}</strong> has been submitted for admin verification.
        Receivers will see it only after approval.
      </p>
      <dl className="idw-success__meta">
        <div>
          <dt>Donation ID</dt>
          <dd>#{itemId}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd><span className="idw-badge idw-badge--pending">Pending Verification</span></dd>
        </div>
      </dl>
      <div className="idw-success__actions">
        <button type="button" className="idw-btn idw-btn--primary" onClick={onViewDonations}>
          View My Donations
        </button>
        <button type="button" className="idw-btn idw-btn--secondary" onClick={onDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export function InlineError({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="idw-inline-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="idw-btn idw-btn--secondary idw-btn--sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
