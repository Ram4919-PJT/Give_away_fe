import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight, ArrowLeft, X, Check, ChevronRight, Upload, FileText,
  ShieldCheck, IndianRupee, ClipboardList, Info, Sparkles,
} from 'lucide-react';
import {
  APPLY_FLOW_STEPS,
  APPLY_FLOW_HIGHLIGHTS,
  MAX_PURPOSE_LENGTH,
} from '../../data/receiverApplyConfig';
import { useReceiverAssistanceConfig } from '../../hooks/useReceiverAssistanceConfig';
import {
  validatePurposeCategory,
  validateSpecificPurpose,
  validateAmount,
  validateExpenseBreakdown,
} from '../../utils/receiverApplyValidation';
import { formatCurrency } from '../../utils/donorHelpers';
import { useApp } from '../../context/AppContext';
import {
  loadReceiverApplyDraft,
  loadStoredReceiverSettings,
  saveReceiverApplyDraft,
  clearReceiverApplyDraft,
} from '../../utils/receiverSettings';
import { normalizeAssistanceCategoryCode } from '../../utils/assistanceCategoryNormalize';
import {
  createAssistanceDraft,
  getAssistanceReadiness,
  submitAssistanceApplication,
  updateAssistanceApplication,
} from '../../api/applicationClient';
import { buildAssistanceRequestPayload } from '../../api/mappers';
import { ApiRequestError } from '../../api/client';
import AssistanceDocumentUploadCard from './AssistanceDocumentUploadCard';

function ApplyFlowProgress({ step }) {
  const current = APPLY_FLOW_STEPS.find((s) => s.id === step);
  return (
    <div className="apply-flow-progress-wrap">
      <div className="apply-flow-progress-meta">
        <span className="apply-flow-progress-meta__badge">Step {step} of {APPLY_FLOW_STEPS.length}</span>
        <span className="apply-flow-progress-meta__label">{current?.label}</span>
      </div>
      <nav className="apply-flow-progress" aria-label="Application progress">
        {APPLY_FLOW_STEPS.map((s, i) => (
          <div key={s.id} className="apply-flow-progress__item-wrap">
            <div
              className={`apply-flow-progress__item ${step === s.id ? 'is-active' : ''} ${step > s.id ? 'is-done' : ''}`}
              aria-current={step === s.id ? 'step' : undefined}
            >
              <span className="apply-flow-progress__num">
                {step > s.id ? <Check size={13} strokeWidth={3} /> : s.id}
              </span>
              <span className="apply-flow-progress__label">{s.label}</span>
            </div>
            {i < APPLY_FLOW_STEPS.length - 1 && (
              <div className={`apply-flow-progress__line ${step > s.id ? 'is-done' : ''}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

function StepHead({ icon: Icon, title, description }) {
  return (
    <header className="apply-flow-step__head">
      <div className="apply-flow-step__head-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  );
}

function StepPurpose({ categories, selected, specificPurpose, onSelect, onPurposeChange, error, loading }) {
  const charCount = specificPurpose.length;
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <StepHead
        icon={ClipboardList}
        title="Purpose of Request"
        description="Select a category and explain exactly what the funds will be used for."
      />
      <p className="apply-flow-section-label">Purpose Category *</p>
      {loading ? (
        <p className="apply-flow-muted">Loading categories…</p>
      ) : (
      <div className="apply-flow-type-grid-wrap">
        <div className="apply-flow-type-grid">
          {categories.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`apply-flow-type-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelect(cat.id)}
              >
                <span
                  className="apply-flow-type-card__icon-wrap"
                  style={{ background: cat.accent }}
                  aria-hidden="true"
                >
                  <span className="apply-flow-type-card__icon">{cat.icon}</span>
                </span>
                <span className="apply-flow-type-card__body">
                  <strong>{cat.title}</strong>
                </span>
                {isSelected ? (
                  <span className="apply-flow-type-card__check" aria-hidden="true">
                    <Check size={13} strokeWidth={3} />
                  </span>
                ) : (
                  <ChevronRight size={16} className="apply-flow-type-card__arrow" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}
      <label className="apply-flow-field apply-flow-field--purpose">
        <span className="apply-flow-field__label-row">
          <span>Specific Purpose *</span>
          <span className="apply-flow-char-count">{charCount}/{MAX_PURPOSE_LENGTH}</span>
        </span>
        <textarea
          rows={4}
          maxLength={MAX_PURPOSE_LENGTH}
          placeholder="Clearly explain what the funds will be used for. Example: I need ₹25,000 for my mother's medical treatment and prescribed medicines."
          value={specificPurpose}
          onChange={(e) => onPurposeChange(e.target.value)}
        />
      </label>
      {error && <p className="apply-flow-error" role="alert">{error}</p>}
    </div>
  );
}

function StepAmount({ values, onChange, error, limits }) {
  const maxAmount = limits?.max_amount;
  const minAmount = limits?.min_amount;
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <StepHead
        icon={IndianRupee}
        title="Amount & Financial Details"
        description="Enter the total amount needed and a clear expense breakdown."
      />
      <div className="apply-flow-fields">
        <label className="apply-flow-field">
          <span>Requested Amount *</span>
          <div className="apply-flow-currency-input">
            <span className="apply-flow-currency-input__prefix" aria-hidden="true">₹</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="25,000"
              value={values.amount}
              onChange={(e) => onChange('amount', e.target.value)}
            />
            <span className="apply-flow-currency-input__suffix">INR</span>
          </div>
          {(minAmount || maxAmount) && (
            <small className="apply-flow-muted">
              {minAmount ? `Minimum: ₹${Number(minAmount).toLocaleString('en-IN')}` : ''}
              {minAmount && maxAmount ? ' · ' : ''}
              {maxAmount ? `Maximum: ₹${Number(maxAmount).toLocaleString('en-IN')}` : ''}
            </small>
          )}
        </label>
        <label className="apply-flow-field">
          <span>Expense Breakdown *</span>
          <textarea
            rows={5}
            className="apply-flow-field__mono"
            placeholder={'Hospital treatment: ₹18,000\nMedicines: ₹5,000\nTravel: ₹2,000\nTotal: ₹25,000'}
            value={values.expenseBreakdown}
            onChange={(e) => onChange('expenseBreakdown', e.target.value)}
          />
        </label>
        <label className="apply-flow-field">
          <span>Additional Notes <em className="apply-flow-optional">(optional)</em></span>
          <textarea
            rows={2}
            placeholder="Any extra context for the review team"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        </label>
      </div>
      {error && <p className="apply-flow-error" role="alert">{error}</p>}
    </div>
  );
}

function StepDocuments({ category, application, onApplicationUpdated, error }) {
  const requiredDocs = category?.required_documents || [];
  const optionalDocs = [
    ...(category?.optional_documents || []),
    ...(category?.conditional_documents || []),
  ];
  const docsByType = {};
  (application?.documents || []).forEach((d) => { docsByType[d.document_type] = d; });

  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <StepHead
        icon={Upload}
        title="Supporting Documents"
        description="Upload the documents required for your selected category."
      />
      <div className="apply-flow-info-banner">
        <Info size={16} aria-hidden="true" />
        <div>
          <strong>{category?.title || 'Your category'}</strong>
          <p>Documents are stored securely and reviewed only by authorized staff.</p>
        </div>
      </div>
      <div className="apply-flow-upload-list">
        {requiredDocs.map((doc) => (
          <AssistanceDocumentUploadCard
            key={doc.type}
            applicationId={application?.application_id}
            documentType={doc.type}
            label={doc.label}
            required
            uploaded={docsByType[doc.type]}
            onUpdated={onApplicationUpdated}
          />
        ))}
        {optionalDocs.map((doc) => (
          <AssistanceDocumentUploadCard
            key={doc.type}
            applicationId={application?.application_id}
            documentType={doc.type}
            label={doc.label}
            required={false}
            uploaded={docsByType[doc.type]}
            onUpdated={onApplicationUpdated}
          />
        ))}
      </div>
      {error && <p className="apply-flow-error" role="alert">{error}</p>}
    </div>
  );
}

function StepReview({ category, values, application, onEditStep }) {
  const docList = application?.documents || [];
  const amount = Number(String(values.amount || '').replace(/[^\d.]/g, '')) || 0;

  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <StepHead
        icon={ClipboardList}
        title="Review Your Request"
        description="Confirm your details before submitting for verification."
      />
      <div className="apply-flow-review-summary">
        <div className="apply-flow-review-summary__icon" style={{ background: category?.accent || '#EEF5FF' }}>
          <span aria-hidden="true">{category?.icon}</span>
        </div>
        <div>
          <p className="apply-flow-review-summary__cat">{category?.title}</p>
          <p className="apply-flow-review-summary__amount">{formatCurrency(amount)}</p>
        </div>
      </div>
      <div className="apply-flow-review">
        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Purpose</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(1)}>Edit</button>
          </div>
          <dl className="apply-flow-review__dl">
            <div><dt>Category</dt><dd>{category?.title || '—'}</dd></div>
            <div className="apply-flow-review__dl--full"><dt>Specific Purpose</dt><dd>{values.specificPurpose || '—'}</dd></div>
          </dl>
        </section>
        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Amount &amp; Details</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(2)}>Edit</button>
          </div>
          <dl className="apply-flow-review__dl">
            <div><dt>Requested Amount</dt><dd>{amount ? formatCurrency(amount) : '—'}</dd></div>
            <div className="apply-flow-review__dl--full"><dt>Expense Breakdown</dt><dd className="apply-flow-pre">{values.expenseBreakdown || '—'}</dd></div>
          </dl>
        </section>
        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Documents</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(3)}>Edit</button>
          </div>
          {docList.length ? (
            <ul className="apply-flow-review__docs">
              {docList.map((doc) => (
                <li key={doc.document_id}>
                  <FileText size={15} aria-hidden="true" />
                  <span>{doc.original_filename || doc.document_type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="apply-flow-review__empty">No documents attached</p>
          )}
        </section>
      </div>
    </div>
  );
}

function StepSubmit({ category, values, submitting, error }) {
  const amount = Number(String(values.amount || '').replace(/[^\d.]/g, '')) || 0;
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <StepHead
        icon={ShieldCheck}
        title="Ready to Submit"
        description="Your request will be reviewed by the AJA Abayahastham verification team."
      />
      <div className="apply-flow-confirm-card">
        <div className="apply-flow-confirm-card__top">
          <span className="apply-flow-confirm-card__emoji" aria-hidden="true">{category?.icon}</span>
          <div>
            <p className="apply-flow-confirm-card__cat">{category?.title}</p>
            <p className="apply-flow-confirm-card__purpose">{values.specificPurpose}</p>
          </div>
        </div>
        <div className="apply-flow-confirm-card__amount-row">
          <span>Requested Amount</span>
          <strong>{formatCurrency(amount)}</strong>
        </div>
      </div>
      <div className="apply-flow-trust-note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Your information is kept confidential and used only for verification.</span>
      </div>
      {error && <p className="apply-flow-error" role="alert">{error}</p>}
      {submitting && (
        <div className="apply-flow-submitting" role="status">
          <span className="apply-flow-submitting__spinner" aria-hidden="true" />
          Submitting your request…
        </div>
      )}
    </div>
  );
}

export function SuccessModal({ application, onViewApplications, onDashboard }) {
  const amount = application?.amount;
  return createPortal(
    <div className="apply-flow-overlay apply-flow-overlay--success" role="dialog" aria-modal="true" aria-labelledby="apply-success-title">
      <div className="apply-flow-success apply-flow-success--premium">
        <div className="apply-flow-success__illustration" aria-hidden="true">
          <div className="apply-flow-success__ring">
            <Check size={36} strokeWidth={2.5} />
          </div>
        </div>
        <h2 id="apply-success-title">Request Submitted Successfully</h2>
        <p>
          Your request has been sent to the AJA Abayahastham admin team for review.
          You will be notified once it is approved — then you can add bank details to receive funds.
        </p>
        <dl className="apply-flow-success__meta">
          {application?.id && <div><dt>Request ID</dt><dd>{application.id}</dd></div>}
          {amount != null && <div><dt>Requested Amount</dt><dd>{formatCurrency(amount)}</dd></div>}
          {application?.purpose && <div><dt>Purpose</dt><dd>{application.purpose}</dd></div>}
          <div><dt>Status</dt><dd><span className="apply-flow-status-pill">Pending Review</span></dd></div>
          {application?.appliedDate && <div><dt>Submitted</dt><dd>{application.appliedDate}</dd></div>}
        </dl>
        <div className="apply-flow-success__actions">
          <button type="button" className="apply-flow-btn apply-flow-btn--primary apply-flow-btn--block" onClick={onViewApplications}>
            View My Requests
          </button>
          <button type="button" className="apply-flow-btn apply-flow-btn--ghost apply-flow-btn--block" onClick={onDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ApplyAssistanceModal({ onClose, onSubmitted }) {
  const { currentUser } = useApp();
  const { categories, limits, loading: categoriesLoading, getCategoryByCode } = useReceiverAssistanceConfig();
  const userId = currentUser?.userId || currentUser?.id;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({
    specificPurpose: '',
    amount: '',
    expenseBreakdown: '',
    notes: '',
  });
  const [application, setApplication] = useState(null);
  const [stepError, setStepError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const settings = loadStoredReceiverSettings(userId);
    setAutoSaveDrafts(settings.autoSaveDrafts !== false);
    const draft = loadReceiverApplyDraft(userId);
    if (draft) {
      if (draft.selectedType) setSelectedType(normalizeAssistanceCategoryCode(draft.selectedType));
      if (draft.form) setForm((prev) => ({ ...prev, ...draft.form }));
      if (draft.step) setStep(draft.step);
      if (draft.applicationId) {
        setApplication({ application_id: draft.applicationId, documents: draft.documents || [] });
      }
      return;
    }
    if (settings.defaultRequestCategory) {
      setSelectedType(normalizeAssistanceCategoryCode(settings.defaultRequestCategory));
    }
  }, [userId]);

  useEffect(() => {
    if (!autoSaveDrafts || !userId) return;
    const hasContent = selectedType || form.specificPurpose || form.amount || form.expenseBreakdown || form.notes;
    if (!hasContent) return;
    saveReceiverApplyDraft(userId, {
      selectedType,
      form,
      step,
      applicationId: application?.application_id,
      documents: application?.documents,
      savedAt: new Date().toISOString(),
    });
  }, [autoSaveDrafts, userId, selectedType, form, step, application]);

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const selectedCategory = getCategoryByCode(selectedType);

  const buildPayload = () => {
    const cat = selectedCategory;
    return buildAssistanceRequestPayload({
      categoryId: selectedType,
      categoryTitle: cat?.title || cat?.name,
      form: { ...form, specificPurpose: form.specificPurpose },
    });
  };

  const ensureDraft = async () => {
    if (application?.application_id) {
      const payload = buildPayload();
      const updated = await updateAssistanceApplication(application.application_id, {
        purpose: payload.purpose,
        amount_requested: payload.amount_requested,
        category: payload.category,
        expense_breakdown: payload.expense_breakdown,
        notes: payload.notes,
      });
      setApplication(updated);
      return updated;
    }
    const payload = buildPayload();
    const created = await createAssistanceDraft(payload);
    setApplication(created);
    return created;
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      return validatePurposeCategory(selectedType) || validateSpecificPurpose(form.specificPurpose);
    }
    if (currentStep === 2) {
      const amountErr = validateAmount(form.amount, limits);
      return amountErr || validateExpenseBreakdown(form.expenseBreakdown, form.amount);
    }
    if (currentStep === 3) {
      const requiredTypes = (selectedCategory?.required_documents || []).map((d) => d.type);
      if (requiredTypes.length) {
        const uploaded = new Set((application?.documents || []).map((d) => d.document_type));
        const missing = requiredTypes.filter((t) => !uploaded.has(t));
        if (missing.length) {
          return `Please upload required documents: ${missing.map((t) => t.replace(/_/g, ' ')).join(', ')}`;
        }
      }
      return null;
    }
    return null;
  };

  const goNext = async () => {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    try {
      if (step === 2) {
        await ensureDraft();
      }
    } catch (e) {
      setStepError(e?.message || 'Could not save your application');
      return;
    }
    setDirection('forward');
    setStep((s) => Math.min(5, s + 1));
  };

  const goBack = () => {
    if (step === 1) {
      onClose();
      return;
    }
    setStepError(null);
    setDirection('back');
    setStep((s) => Math.max(1, s - 1));
  };

  const goToStep = (targetStep) => {
    setStepError(null);
    setDirection(targetStep < step ? 'back' : 'forward');
    setStep(targetStep);
  };

  const handleSubmit = async () => {
    for (let s = 1; s <= 3; s += 1) {
      const stepErr = validateStep(s);
      if (stepErr) {
        setStepError(stepErr);
        setDirection('back');
        setStep(s);
        return;
      }
    }
    setSubmitting(true);
    setStepError(null);
    try {
      const draft = await ensureDraft();
      const readiness = await getAssistanceReadiness(draft.application_id);
      if (!readiness.ready) {
        const msgs = (readiness.errors || []).map((e) => e.message).filter(Boolean);
        setStepError(msgs.join(' ') || 'Please complete all required fields and documents.');
        setStep(4);
        return;
      }
      const submitted = await submitAssistanceApplication(draft.application_id);
      clearReceiverApplyDraft(userId);
      await onSubmitted(submitted);
    } catch (e) {
      if (e instanceof ApiRequestError && e.errors?.length) {
        setStepError(e.errors.map((err) => err.message).join(' '));
      } else {
        setStepError(e?.message || 'Could not submit request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="apply-flow-overlay" role="presentation">
      <div className="apply-flow-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="apply-flow-modal" role="dialog" aria-modal="true" aria-labelledby="apply-flow-title">
        <div className="apply-flow-modal__accent" aria-hidden="true" />
        <header className="apply-flow-modal__header">
          <div className="apply-flow-modal__title-block">
            <p className="apply-flow-modal__eyebrow">AJA Abayahastham</p>
            <h2 id="apply-flow-title">Request Financial Assistance</h2>
          </div>
          <button type="button" className="apply-flow-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <ApplyFlowProgress step={step} />

        <div className={`apply-flow-modal__body apply-flow-modal__body--${direction}`} key={step}>
          {step === 1 && (
            <StepPurpose
              categories={categories}
              loading={categoriesLoading}
              selected={selectedType}
              specificPurpose={form.specificPurpose}
              onSelect={(id) => {
                setSelectedType(id);
                if (stepError) setStepError(null);
              }}
              onPurposeChange={(v) => updateForm('specificPurpose', v)}
              error={stepError}
            />
          )}
          {step === 2 && (
            <StepAmount values={form} onChange={updateForm} error={stepError} limits={limits} />
          )}
          {step === 3 && (
            <StepDocuments
              category={selectedCategory}
              application={application}
              onApplicationUpdated={setApplication}
              error={stepError}
            />
          )}
          {step === 4 && (
            <StepReview
              category={selectedCategory}
              values={form}
              application={application}
              onEditStep={goToStep}
            />
          )}
          {step === 5 && (
            <StepSubmit
              category={selectedCategory}
              values={form}
              submitting={submitting}
              error={stepError}
            />
          )}
        </div>

        <footer className="apply-flow-modal__footer">
          <button
            type="button"
            className="apply-flow-btn apply-flow-btn--ghost"
            onClick={goBack}
            disabled={submitting}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          {step < 5 ? (
            <button type="button" className="apply-flow-btn apply-flow-btn--primary" onClick={goNext}>
              Continue
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className={`apply-flow-btn apply-flow-btn--primary apply-flow-btn--submit${submitting ? ' is-loading' : ''}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
              {!submitting && <Check size={16} aria-hidden="true" />}
            </button>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
}

export function ApplyAssistanceLanding({ onStart }) {
  return (
    <div className="apply-flow-landing page-route">
      <div className="apply-flow-landing__inner">
        <div className="apply-flow-landing__hero">
          <div className="apply-flow-landing__content">
            <p className="apply-flow-landing__eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              AJA Abayahastham · Receiver Support
            </p>
            <h1>Request Financial Assistance</h1>
            <p className="apply-flow-landing__subtitle">
              Apply for verified financial support with a clear purpose, detailed breakdown,
              and supporting documents — reviewed with care and dignity.
            </p>
            <div className="apply-flow-landing__actions">
              <button type="button" className="apply-flow-start-btn" onClick={onStart}>
                Start Application
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <p className="apply-flow-landing__note">
                <ShieldCheck size={14} aria-hidden="true" />
                Verification required before submission
              </p>
            </div>
          </div>
          <div className="apply-flow-landing__panel" aria-hidden="true">
            <div className="apply-flow-landing__panel-head">
              <span>How it works</span>
            </div>
            <ol className="apply-flow-landing__steps">
              {APPLY_FLOW_HIGHLIGHTS.map((item) => (
                <li key={item.step}>
                  <span className="apply-flow-landing__step-num">{item.step}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
