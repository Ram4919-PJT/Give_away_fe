import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Clock, AlertCircle, CheckCircle2, Info, Send, Loader2,
  FileText, Camera, MapPin, RefreshCw, Package, ArrowRight,
} from 'lucide-react';
import { PageBackLink, FlowStepFooter, FlowStepPanel } from '../ui/FlowNav';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import {
  getKycReadiness,
  submitVerificationRequest,
} from '../../api/verificationClient';
import { ApiRequestError } from '../../api/client';
import DonorDocumentUploadCard from './verification/DonorDocumentUploadCard';
import { useDonorVerificationConfig, useDonorVerificationSession } from '../../hooks/useDonorVerification';

const PENDING_STATUSES = new Set([
  'UNDER_REVIEW',
  'DOCUMENTS_SUBMITTED',
  'VALIDATION_IN_PROGRESS',
  'MORE_DOCUMENTS_REQUIRED',
]);

const WIZARD_STEPS = [
  { id: 'intro', label: 'Overview', hint: 'What you need' },
  { id: 'aadhaar', label: 'Aadhaar', hint: 'Required document' },
  { id: 'optional', label: 'Optional', hint: 'Extra documents' },
  { id: 'review', label: 'Submit', hint: 'Send to admin' },
];

function resolveUiStatus(profileStatus, requestStatus) {
  const profile = String(profileStatus || '').toUpperCase();
  const request = String(requestStatus || '').toUpperCase();
  if (profile === 'VERIFIED' || request === 'VERIFIED') return 'verified';
  if (profile === 'REJECTED' || request === 'REJECTED') return 'rejected';
  if (PENDING_STATUSES.has(request) || profile === 'UNDER_REVIEW') return 'pending';
  return 'not_started';
}

function VerificationStepper({ steps, currentStep, onStepClick }) {
  return (
    <ol className="donor-v-stepper" aria-label="Verification steps">
      {steps.map((step, index) => {
        const n = index + 1;
        const done = n < currentStep;
        const active = n === currentStep;
        const clickable = done && onStepClick;

        return (
          <li
            key={step.id}
            className={`donor-v-stepper__item${done ? ' is-done' : ''}${active ? ' is-active' : ''}${clickable ? ' is-clickable' : ''}`}
          >
            <button
              type="button"
              className="donor-v-stepper__btn"
              onClick={() => clickable && onStepClick(n)}
              disabled={!clickable}
              aria-current={active ? 'step' : undefined}
              aria-label={`${step.label}${done ? ' (completed)' : active ? ' (current)' : ''}`}
            >
              <span className="donor-v-stepper__dot" aria-hidden="true">
                {done ? <CheckCircle2 size={14} /> : n}
              </span>
              <span className="donor-v-stepper__label">{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StatusBanner({ status, rejectionReason, reviewedAt, referenceCode, submittedAt }) {
  if (status === 'verified') {
    return (
      <div className="donor-v-banner donor-v-banner--success">
        <div className="donor-v-banner__icon"><CheckCircle2 size={22} /></div>
        <div className="donor-v-banner__body">
          <strong>Verification complete</strong>
          <p>Your identity has been verified by our team. You can now donate items on Give Away.</p>
        </div>
        <span className="donor-v-banner__badge donor-v-banner__badge--success">Verified</span>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="donor-v-banner donor-v-banner--pending">
        <div className="donor-v-banner__icon"><Clock size={22} /></div>
        <div className="donor-v-banner__body">
          <strong>Sent to admin for review</strong>
          <p>
            Your verification request has been submitted successfully. An administrator will review
            your documents and you will be notified once approved.
          </p>
          {referenceCode && (
            <p className="donor-v-banner__meta">
              Reference: <strong>{referenceCode}</strong>
              {submittedAt && ` · Submitted ${new Date(submittedAt).toLocaleDateString()}`}
            </p>
          )}
        </div>
        <span className="donor-v-banner__badge donor-v-banner__badge--pending">Under review</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="donor-v-banner donor-v-banner--rejected">
        <div className="donor-v-banner__icon"><AlertCircle size={22} /></div>
        <div className="donor-v-banner__body">
          <strong>Verification rejected</strong>
          <p>{rejectionReason || 'Please update your documents and resubmit for admin review.'}</p>
          {reviewedAt && (
            <p className="donor-v-banner__meta">Reviewed on {new Date(reviewedAt).toLocaleDateString()}</p>
          )}
        </div>
        <span className="donor-v-banner__badge donor-v-banner__badge--rejected">Rejected</span>
      </div>
    );
  }

  return null;
}

function SessionErrorCard({ message, onRetry, retrying }) {
  return (
    <div className="donor-v-error-card" role="alert">
      <AlertCircle size={22} aria-hidden="true" />
      <div>
        <strong>We couldn&apos;t load verification</strong>
        <p>{message}</p>
        <button type="button" className="donor-v-retry-btn" onClick={onRetry} disabled={retrying}>
          {retrying ? (
            <>
              <Loader2 size={16} className="donor-v-spin" aria-hidden="true" />
              Retrying…
            </>
          ) : (
            <>
              <RefreshCw size={16} aria-hidden="true" />
              Try again
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StepHead({ step, total, title, hint }) {
  return (
    <div className="donor-v-step-head">
      <span className="donor-v-step-head__badge">Step {step} of {total}</span>
      <h2>{title}</h2>
      {hint && <p>{hint}</p>}
    </div>
  );
}

export default function DonorVerifyPage() {
  const { dispatch } = useApp();
  const { showToast } = useToast();
  const panelRef = useRef(null);
  const { config, loading: configLoading } = useDonorVerificationConfig();
  const {
    loading: sessionLoading,
    error: sessionError,
    profileStatus,
    request,
    setRequest,
    reload,
  } = useDonorVerificationSession();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [consent, setConsent] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const uiStatus = resolveUiStatus(profileStatus, request?.status);
  const canEdit = uiStatus === 'not_started' || uiStatus === 'rejected';
  const showWizard = canEdit && !sessionError && request?.request_id;

  const { step, direction, goNext, goBack, goToStep } = useStepNavigation(1, {
    min: 1,
    max: WIZARD_STEPS.length,
  });

  const documentsByType = useMemo(() => {
    const map = {};
    (request?.documents || []).forEach((d) => { map[d.document_type] = d; });
    return map;
  }, [request?.documents]);

  const docSpecs = config?.documents || [];
  const requiredDocs = docSpecs.filter((d) => d.required);
  const optionalDocs = docSpecs.filter((d) => !d.required);
  const maxBytes = config?.upload_limits?.max_bytes || 10 * 1024 * 1024;
  const consentVersion = config?.consent_version || 'donor-verification-v1';
  const consentText = config?.consent_text || 'I confirm that the documents I have uploaded are accurate and belong to me.';

  const aadhaarUploaded = Boolean(documentsByType.AADHAAR_CARD);
  const optionalCount = optionalDocs.filter((d) => documentsByType[d.type]).length;
  const currentMeta = WIZARD_STEPS[step - 1];

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  useEffect(() => {
    if (uiStatus === 'pending' || uiStatus === 'verified') {
      setJustSubmitted(false);
    }
  }, [uiStatus]);

  const handleSubmit = async () => {
    if (!request?.request_id || !consent) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const readiness = await getKycReadiness(request.request_id, { consentGiven: true });
      if (!readiness.ready) {
        const msg = readiness.errors?.[0]?.message || 'Aadhaar Card is required to submit verification.';
        setSubmitError(msg);
        showToast(msg, 'error');
        return;
      }
      const updated = await submitVerificationRequest(request.request_id, {
        consentGiven: true,
        consentVersion,
      });
      setRequest(updated);
      setJustSubmitted(true);
      dispatch({
        type: 'UPDATE_USER',
        payload: { verified: 'pending', verificationStatus: 'submitted' },
      });
      showToast('Verification sent to admin for review.', 'success');
      await reload();
    } catch (err) {
      const msg = err instanceof ApiRequestError
        ? (err.errors?.[0]?.message || err.message)
        : (err?.message || 'Submission failed');
      setSubmitError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await reload();
    setRetrying(false);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      goToStep(targetStep);
    }
  };

  const loading = sessionLoading || configLoading;

  const canContinue = () => {
    if (step === 2) return aadhaarUploaded;
    if (step === 4) return consent && aadhaarUploaded;
    return true;
  };

  return (
    <div className="donor-page donor-module page-route donor-v-page">
      <PageBackLink
        to="/dashboard/donor-dashboard"
        label="Back to Dashboard"
        className="donor-v-back"
      />

      <header className="donor-v-header">
        <div className="donor-v-header__icon" aria-hidden="true">
          <ShieldCheck size={28} strokeWidth={1.75} />
        </div>
        <div>
          <h1>Donor Verification</h1>
          <p>Complete each step below. After you submit, an admin will review your documents.</p>
        </div>
      </header>

      {loading ? (
        <div className="donor-v-loading-card" aria-busy="true">
          <Loader2 size={28} className="donor-v-spin" />
          <p>Preparing your verification session…</p>
        </div>
      ) : (
        <>
          {(uiStatus !== 'not_started' || justSubmitted) && (
            <StatusBanner
              status={justSubmitted ? 'pending' : uiStatus}
              rejectionReason={request?.rejection_reasons?.[0]}
              reviewedAt={request?.reviewed_at}
              referenceCode={request?.reference_code}
              submittedAt={request?.submitted_at}
            />
          )}

          {sessionError && (
            <SessionErrorCard message={sessionError} onRetry={handleRetry} retrying={retrying} />
          )}

          {showWizard && !justSubmitted && (
            <div className="donor-v-wizard" ref={panelRef}>
              <VerificationStepper
                steps={WIZARD_STEPS}
                currentStep={step}
                onStepClick={handleStepClick}
              />

              <div className="donor-v-wizard__panel">
                <FlowStepPanel stepKey={step} direction={direction} className="donor-v-step-panel">
                  {step === 1 && (
                    <div className="donor-v-intro">
                      <StepHead
                        step={1}
                        total={WIZARD_STEPS.length}
                        title="What you'll need"
                        hint="A quick identity check helps receivers trust donated items. This usually takes about 5 minutes."
                      />
                      <ul className="donor-v-checklist">
                        <li>
                          <FileText size={18} aria-hidden="true" />
                          <span><strong>Aadhaar Card</strong> — front side (required)</span>
                        </li>
                        <li>
                          <Camera size={18} aria-hidden="true" />
                          <span><strong>Selfie</strong> — recent photo (optional)</span>
                        </li>
                        <li>
                          <MapPin size={18} aria-hidden="true" />
                          <span><strong>Address proof</strong> — utility bill or similar (optional)</span>
                        </li>
                      </ul>
                      <p className="donor-v-intro__hint">
                        <Info size={15} aria-hidden="true" />
                        PDF, JPG, or PNG up to 10 MB per file. Documents are stored securely.
                      </p>
                    </div>
                  )}

                  {step === 2 && requiredDocs.length > 0 && (
                    <div className="donor-v-step-focus">
                      <StepHead
                        step={2}
                        total={WIZARD_STEPS.length}
                        title="Upload Aadhaar Card"
                        hint="Upload a clear photo or scan of the front side of your Aadhaar card."
                      />
                      <div className="donor-v-step-focus__card">
                        <DonorDocumentUploadCard
                          requestId={request.request_id}
                          documentType={requiredDocs[0].type}
                          label={requiredDocs[0].label}
                          description={requiredDocs[0].description}
                          required
                          uploaded={documentsByType[requiredDocs[0].type]}
                          onUpdated={setRequest}
                          maxBytes={maxBytes}
                        />
                      </div>
                      {!aadhaarUploaded && (
                        <p className="donor-v-step-hint donor-v-step-hint--warn">
                          Upload Aadhaar to continue to the next step.
                        </p>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="donor-v-step-focus">
                      <StepHead
                        step={3}
                        total={WIZARD_STEPS.length}
                        title="Optional documents"
                        hint="These help speed up admin review but are not required."
                      />
                      <div className="donor-v-docs-grid donor-v-docs-grid--optional">
                        {optionalDocs.map((doc) => (
                          <DonorDocumentUploadCard
                            key={doc.type}
                            requestId={request.request_id}
                            documentType={doc.type}
                            label={doc.label}
                            description={doc.description}
                            required={false}
                            uploaded={documentsByType[doc.type]}
                            onUpdated={setRequest}
                            maxBytes={maxBytes}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="donor-v-review">
                      <StepHead
                        step={4}
                        total={WIZARD_STEPS.length}
                        title="Review & send to admin"
                        hint="Confirm your uploads. Your request will be queued for administrator review."
                      />
                      <ul className="donor-v-review-list">
                        <li className={aadhaarUploaded ? 'is-done' : 'is-missing'}>
                          {aadhaarUploaded ? (
                            <CheckCircle2 size={18} aria-hidden="true" />
                          ) : (
                            <AlertCircle size={18} aria-hidden="true" />
                          )}
                          Aadhaar Card {aadhaarUploaded ? 'uploaded' : '— required'}
                        </li>
                        <li className={optionalCount > 0 ? 'is-done' : 'is-neutral'}>
                          <CheckCircle2 size={18} aria-hidden="true" />
                          Optional documents — {optionalCount} of {optionalDocs.length} uploaded
                        </li>
                      </ul>
                      <label className="donor-v-consent">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                        />
                        <span>{consentText}</span>
                      </label>
                      {submitError && (
                        <p className="donor-v-submit-error" role="alert">{submitError}</p>
                      )}
                    </div>
                  )}
                </FlowStepPanel>

                <FlowStepFooter
                  step={step}
                  totalSteps={WIZARD_STEPS.length}
                  onBack={goBack}
                  backLabel="Previous step"
                  onContinue={goNext}
                  continueLabel={step === 3 ? 'Review & submit' : 'Continue'}
                  continueDisabled={!canContinue()}
                  isLastStep={step === WIZARD_STEPS.length}
                  onSubmit={handleSubmit}
                  submitLabel="Send to admin for review"
                  submitting={submitting}
                  submitDisabled={!consent || !aadhaarUploaded}
                  footerClassName="donor-v-wizard__footer flow-step-footer flow-step-footer--split"
                  backButtonClassName="flow-btn flow-btn--ghost"
                  primaryButtonClassName="flow-btn flow-btn--primary"
                />
              </div>
            </div>
          )}

          {canEdit && !sessionError && !request?.request_id && !loading && (
            <SessionErrorCard
              message="Your verification session could not be started. Please try again."
              onRetry={handleRetry}
              retrying={retrying}
            />
          )}

          {uiStatus === 'verified' && (
            <div className="donor-v-actions-card">
              <p>Your account is verified. You can start listing donation items.</p>
              <div className="donor-v-actions-card__btns">
                <Link to="/dashboard/donor-add-item" className="flow-btn flow-btn--primary">
                  <Package size={18} aria-hidden="true" />
                  Donate items
                </Link>
                <Link to="/dashboard/donor-dashboard" className="flow-btn flow-btn--ghost">
                  Back to dashboard
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {uiStatus === 'pending' && !showWizard && (
            <div className="donor-v-actions-card donor-v-actions-card--pending">
              <p>
                Verification is <strong>not complete yet</strong> — admin review is in progress.
                You can donate money now; item donations unlock after approval.
              </p>
              <div className="donor-v-actions-card__btns">
                <Link to="/dashboard/donor-donate-money" className="flow-btn flow-btn--primary">
                  Donate money
                </Link>
                <Link to="/dashboard/donor-dashboard" className="flow-btn flow-btn--ghost">
                  Back to dashboard
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
