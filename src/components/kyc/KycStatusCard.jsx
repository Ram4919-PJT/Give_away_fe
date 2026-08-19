import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

function toneClass(tone) {
  if (tone === 'success') return 'kyc-status-card--success';
  if (tone === 'danger') return 'kyc-status-card--danger';
  if (tone === 'warning') return 'kyc-status-card--warning';
  if (tone === 'info') return 'kyc-status-card--info';
  return '';
}

export default function KycStatusCard({
  title,
  message,
  tone = 'muted',
  progress,
  reasons = [],
  actionLabel,
  onAction,
}) {
  return (
    <div className={`kyc-status-card ${toneClass(tone)}`} role="status">
      {tone === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
      <div>
        {title && <strong>{title}</strong>}
        {message && <p>{message}</p>}
        {progress != null && (
          <div className="kyc-status-card__progress">
            <div className="kyc-status-card__progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <small>{progress}% complete</small>
          </div>
        )}
        {reasons.length > 0 && (
          <ul className="kyc-status-card__reasons">
            {reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
        {actionLabel && onAction && (
          <button type="button" className="rd-btn rd-btn--secondary rd-btn--sm" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function KycValidationChecklist({ errors = [], onGoToField }) {
  if (!errors.length) return null;

  const grouped = errors.reduce((acc, err) => {
    const key = err.field?.split('.')[0] || 'general';
    if (!acc[key]) acc[key] = [];
    acc[key].push(err);
    return acc;
  }, {});

  return (
    <div className="kyc-validation-checklist" role="alert">
      <strong>Please fix the following before submitting:</strong>
      <ul>
        {Object.entries(grouped).map(([section, items]) => (
          <li key={section}>
            <span className="kyc-validation-checklist__section">{section.replace(/_/g, ' ')}</span>
            <ul>
              {items.map((item) => (
                <li key={`${item.field}-${item.code}`}>
                  <button
                    type="button"
                    className="kyc-validation-checklist__item"
                    onClick={() => onGoToField?.(item.field)}
                  >
                    <Circle size={12} aria-hidden="true" />
                    {item.message}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
