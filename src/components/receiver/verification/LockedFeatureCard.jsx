import { Lock } from 'lucide-react';

export default function LockedFeatureCard({
  title,
  description = 'Complete your receiver verification to unlock this feature.',
  onVerify,
  compact = false,
}) {
  return (
    <div className={`rd-locked-card${compact ? ' rd-locked-card--compact' : ''}`}>
      <div className="rd-locked-card__icon" aria-hidden="true">
        <Lock size={compact ? 18 : 22} />
      </div>
      <div className="rd-locked-card__body">
        <h3>{title}</h3>
        <p>{description}</p>
        <button type="button" className="rd-btn rd-btn--primary rd-btn--sm" onClick={onVerify}>
          Complete Verification
        </button>
      </div>
    </div>
  );
}
