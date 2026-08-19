import { ShieldCheck, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import { useReceiverEligibility } from '../../../hooks/useReceiverEligibility';
import { buildProgressFromEligibility, formatStepLabel, hasActionRequired } from '../../../utils/receiverKycHelpers';

export default function ReceiverWelcomeBanner({ name, loading }) {
  if (loading) {
    return <div className="rd-card rd-welcome rd-skeleton rd-skeleton--hero" aria-hidden="true" />;
  }

  return (
    <section className="rd-card rd-welcome" aria-label="Welcome">
      <div className="rd-welcome__copy">
        <p className="rd-welcome__eyebrow">Receiver Dashboard</p>
        <h1>
          Welcome back,
          <br />
          {name || 'Receiver'} <span aria-hidden="true">👋</span>
        </h1>
        <p>Track your financial assistance requests and support received from AJA Abayahastham.</p>
      </div>
      <div className="rd-welcome__art" aria-hidden="true">
        <img
          src="/assets/images/Impact_Heart_Hands.png"
          alt=""
          width={140}
          height={140}
          decoding="async"
        />
      </div>
    </section>
  );
}

function ProgressList({ completed, pending, labels }) {
  return (
    <div className="rd-verify-card__checklist">
      {completed.slice(0, 4).map((id) => (
        <div key={id} className="rd-verify-card__check-item rd-verify-card__check-item--done">
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>{formatStepLabel(id, labels)}</span>
        </div>
      ))}
      {pending.slice(0, 3).map((id) => (
        <div key={id} className="rd-verify-card__check-item">
          <Circle size={14} aria-hidden="true" />
          <span>{formatStepLabel(id, labels)}</span>
        </div>
      ))}
    </div>
  );
}

export function ReceiverVerificationCard({ loading }) {
  const { verified, pending, goToVerification } = useReceiverVerification();
  const { eligibility, loading: eligLoading, reasons } = useReceiverEligibility();
  const progress = buildProgressFromEligibility(eligibility);
  const actionRequired = hasActionRequired(eligibility);

  if (loading || eligLoading) {
    return <div className="rd-card rd-verify-card rd-skeleton rd-skeleton--verify" aria-hidden="true" />;
  }

  if (verified) {
    return (
      <article className="rd-card rd-verify-card rd-verify-card--verified">
        <div className="rd-verify-card__head">
          <span className="rd-verify-card__icon rd-verify-card__icon--ok" aria-hidden="true">
            <ShieldCheck size={20} strokeWidth={2.25} />
          </span>
          <div>
            <h2>Verified Receiver</h2>
            <p className="rd-verify-card__status rd-verify-card__status--ok">Verification complete</p>
          </div>
        </div>
        <p>You can now request financial assistance.</p>
        <p className="rd-verify-card__footnote">
          Verified based on the information and documents reviewed by the platform.
        </p>
        <button type="button" className="rd-btn rd-btn--secondary rd-btn--sm" onClick={goToVerification}>
          View verification
        </button>
      </article>
    );
  }

  return (
    <article className={`rd-card rd-verify-card rd-verify-card--required${actionRequired ? ' rd-verify-card--action' : ''}`}>
      <div className="rd-verify-card__head">
        <span className="rd-verify-card__icon rd-verify-card__icon--warn" aria-hidden="true">
          <AlertTriangle size={20} strokeWidth={2.25} />
        </span>
        <div>
          <h2>Complete your verification</h2>
          <p className="rd-verify-card__status rd-verify-card__status--warn">
            {actionRequired ? 'Action required' : pending ? 'Under review' : 'Verification required'}
          </p>
        </div>
      </div>
      <p>
        {actionRequired
          ? 'Additional documents are required. Please review the list below and continue verification.'
          : pending
            ? 'Your verification is under admin review. Request Money unlocks once approved.'
            : 'Complete identity and supporting-document verification before requesting financial assistance.'}
      </p>

      <div className="rd-verify-card__progress">
        <div className="rd-verify-card__progress-label">
          <span>Verification progress</span>
          <strong>{progress.percent}%</strong>
        </div>
        <div className="rd-verify-card__progress-bar" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <ProgressList completed={progress.completed} pending={progress.pending} labels={progress.labels} />

      {reasons.length > 0 && !pending && (
        <ul className="rd-verify-card__reasons">
          {reasons.slice(0, 3).map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}

      <button type="button" className="rd-btn rd-btn--primary rd-btn--sm" onClick={goToVerification}>
        {actionRequired ? 'Upload required documents' : 'Continue verification'}
      </button>
    </article>
  );
}
