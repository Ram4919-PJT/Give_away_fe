import { Link } from 'react-router-dom';
import {
  Shield, ShieldCheck, Lock, Clock, AlertTriangle, CheckCircle2,
  HelpCircle, TrendingUp, BarChart3, FileText, Headphones,
} from 'lucide-react';

import { labelForKycFieldPath } from '../../../data/receiverKycAdminFields';

export function ReceiverKycHeader({ onHelp }) {
  return (
    <header className="rkyc-header">
      <div className="rkyc-header__title-row">
        <div className="rkyc-header__icon" aria-hidden="true">
          <ShieldCheck size={28} strokeWidth={1.75} />
        </div>
        <div>
          <h1>Receiver Verification (KYC)</h1>
          <p>Complete your verification to request assistance</p>
        </div>
      </div>
      <button type="button" className="rkyc-help-btn" onClick={onHelp}>
        <HelpCircle size={18} aria-hidden="true" />
        Need Help?
      </button>
    </header>
  );
}

export function ReceiverKycSecurityBanner() {
  return (
    <div className="rkyc-security-banner" role="note">
      <Lock size={20} aria-hidden="true" />
      <div>
        <strong>Your information is safe with us</strong>
        <p>We use bank-level security to protect your personal data and documents.</p>
      </div>
    </div>
  );
}

export function ReceiverKycProgressSidebar({
  steps,
  currentStep,
  onStepClick,
  percent,
}) {
  const total = steps.length;
  const completedCount = Math.max(0, currentStep - 1);
  const displayPercent = percent ?? Math.round((completedCount / total) * 100);

  return (
    <aside className="rkyc-progress-card" aria-label="Verification progress">
      <h2>Verification Progress</h2>
      <div className="rkyc-progress-card__meta">
        <span>Step {currentStep} of {total}</span>
        <span className="rkyc-progress-card__pct">{displayPercent}%</span>
      </div>
      <div className="rkyc-progress-bar" aria-hidden="true">
        <div className="rkyc-progress-bar__fill" style={{ width: `${displayPercent}%` }} />
      </div>
      <ol className="rkyc-progress-list">
        {steps.map((step, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          const clickable = done && onStepClick;
          return (
            <li
              key={step.id}
              className={`rkyc-progress-list__item${done ? ' is-done' : ''}${active ? ' is-active' : ''}${clickable ? ' is-clickable' : ''}`}
            >
              <button
                type="button"
                className="rkyc-progress-list__btn"
                onClick={() => clickable && onStepClick(n)}
                disabled={!clickable}
                aria-current={active ? 'step' : undefined}
              >
                <span className="rkyc-progress-list__dot" aria-hidden="true">
                  {done ? <CheckCircle2 size={14} /> : n}
                </span>
                <span className="rkyc-progress-list__label">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export function ReceiverKycGuidelines() {
  return (
    <div className="rkyc-guidelines">
      <h3>Upload Guidelines</h3>
      <ul>
        <li>PDF, JPG, JPEG, PNG, WEBP</li>
        <li>Maximum file size: 10 MB</li>
        <li>Clear and readable documents only</li>
        <li>All corners should be visible</li>
        <li>Documents should not be expired where applicable</li>
      </ul>
    </div>
  );
}

export function ReceiverKycSupportCard() {
  return (
    <div className="rkyc-support-card">
      <Headphones size={20} aria-hidden="true" />
      <p>Need help with verification?</p>
      <Link to="/dashboard/receiver-settings" className="rkyc-support-card__btn">
        Contact Support
      </Link>
    </div>
  );
}

export function ReceiverKycWhySection() {
  const items = [
    { icon: Lock, title: 'Secure', text: 'Your data is protected and secure.' },
    { icon: Shield, title: 'Trusted', text: 'Helps us verify genuine requests.' },
    { icon: TrendingUp, title: 'Faster Processing', text: 'Complete KYC gets faster approval.' },
    { icon: BarChart3, title: 'More Opportunities', text: 'Verified users can receive support.' },
  ];
  return (
    <section className="rkyc-why" aria-labelledby="rkyc-why-title">
      <h2 id="rkyc-why-title">Why verification is important?</h2>
      <div className="rkyc-why__grid">
        {items.map((item) => (
          <div key={item.title} className="rkyc-why__card">
            <item.icon size={22} aria-hidden="true" />
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReceiverKycStatusCard({ status, request, onAction }) {
  const s = String(status || '').toUpperCase();

  if (s === 'VERIFIED' || s === 'APPROVED') {
    return (
      <div className="rkyc-status-card rkyc-status-card--success">
        <CheckCircle2 size={28} aria-hidden="true" />
        <div>
          <strong>Verification approved</strong>
          <p>Your KYC is complete. You can now request financial assistance with supporting documents for each request.</p>
          {request?.reviewed_at && (
            <p className="rkyc-status-card__meta">Verified on {new Date(request.reviewed_at).toLocaleDateString()}</p>
          )}
          <div className="rkyc-status-card__actions">
            <Link to="/dashboard/receiver-apply" className="rkyc-btn rkyc-btn--primary">
              Request Assistance
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (['UNDER_REVIEW', 'DOCUMENTS_SUBMITTED', 'VALIDATION_IN_PROGRESS'].includes(s)) {
    return (
      <div className="rkyc-status-card rkyc-status-card--review">
        <Clock size={28} aria-hidden="true" />
        <div>
          <strong>Verification submitted — under admin review</strong>
          <p>Our platform team is reviewing your identity and documents. You will be notified when KYC is approved.</p>
          <p className="rkyc-status-card__next">Next after approval: <strong>Request Assistance</strong> becomes available.</p>
          <p className="rkyc-status-card__badge">Status: Under Review</p>
          {request?.submitted_at && (
            <p className="rkyc-status-card__meta">Submitted {new Date(request.submitted_at).toLocaleString()}</p>
          )}
          {request?.reference_code && (
            <p className="rkyc-status-card__meta">Reference: {request.reference_code}</p>
          )}
          <ol className="rkyc-status-card__timeline">
            <li className="is-done">KYC submitted</li>
            <li className="is-active">Admin review in progress</li>
            <li>KYC approved → Request assistance</li>
          </ol>
        </div>
      </div>
    );
  }

  if (s === 'MORE_DOCUMENTS_REQUIRED') {
    const fieldReqs = (request?.payload?.admin_field_requests || []).filter(
      (r) => r.status === 'PENDING' || !r.status,
    );
    const docReqs = (request?.payload?.admin_document_requests || []).filter(
      (r) => r.status === 'PENDING' || !r.status,
    );
    return (
      <div className="rkyc-status-card rkyc-status-card--warning">
        <AlertTriangle size={28} aria-hidden="true" />
        <div>
          <strong>Updates required from admin</strong>
          <p>Please correct the items below and resubmit for admin review.</p>
          {(fieldReqs.length > 0 || docReqs.length > 0) && (
            <ul className="rkyc-status-card__feedback">
              {fieldReqs.flatMap((r) =>
                (r.field_paths || []).map((path) => (
                  <li key={path}>
                    <strong>{labelForKycFieldPath(path)}</strong>
                    {r.reason && <span>{r.reason}</span>}
                  </li>
                )),
              )}
              {docReqs.map((r) => (
                <li key={r.document_type}>
                  <strong>{r.document_type?.replace(/_/g, ' ')}</strong>
                  {r.reason && <span>{r.reason}</span>}
                </li>
              ))}
            </ul>
          )}
          <div className="rkyc-status-card__actions">
            <button type="button" className="rkyc-btn rkyc-btn--primary" onClick={onAction}>
              Update & Resubmit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (s === 'REJECTED') {
    return (
      <div className="rkyc-status-card rkyc-status-card--danger">
        <AlertTriangle size={28} aria-hidden="true" />
        <div>
          <strong>Verification Rejected</strong>
          <p>{request?.rejection_reasons?.[0] || 'Please review the feedback and update your information.'}</p>
          <div className="rkyc-status-card__actions">
            <button type="button" className="rkyc-btn rkyc-btn--primary" onClick={onAction}>
              Update & Resubmit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (s === 'NOT_STARTED' || s === 'REGISTERED' || s === 'DRAFT' || s === 'KYC_IN_PROGRESS') {
    return (
      <div className="rkyc-status-card rkyc-status-card--neutral">
        <FileText size={28} aria-hidden="true" />
        <div>
          <strong>Start your verification</strong>
          <p>Complete all steps below to unlock financial assistance requests.</p>
        </div>
      </div>
    );
  }

  return null;
}

export function ReceiverKycPrivacyFooter() {
  return (
    <footer className="rkyc-privacy">
      <Shield size={16} aria-hidden="true" />
      <span>Your privacy is important to us. We never share your information with third parties.</span>
    </footer>
  );
}
