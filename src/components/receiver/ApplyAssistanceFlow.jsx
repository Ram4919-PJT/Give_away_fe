import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight, ArrowLeft, X, Check, ChevronRight, Upload, FileText, CloudUpload
} from 'lucide-react';
import {
  APPLY_FLOW_STEPS,
  APPLY_ASSISTANCE_CATEGORIES,
  APPLY_WIREFRAME_DOCUMENTS,
  APPLY_UPLOAD_PLACEHOLDERS
} from '../../data/receiverApplyConfig';

function ApplyFlowProgress({ step }) {
  return (
    <nav className="apply-flow-progress" aria-label="Application progress">
      {APPLY_FLOW_STEPS.map((s, i) => (
        <div key={s.id} className="apply-flow-progress__item-wrap">
          <div
            className={`apply-flow-progress__item ${step === s.id ? 'is-active' : ''} ${step > s.id ? 'is-done' : ''}`}
          >
            <span className="apply-flow-progress__num">
              {step > s.id ? <Check size={14} strokeWidth={3} /> : s.id}
            </span>
            <span className="apply-flow-progress__label">{s.label}</span>
          </div>
          {i < APPLY_FLOW_STEPS.length - 1 && (
            <div className={`apply-flow-progress__line ${step > s.id ? 'is-done' : ''}`} aria-hidden="true" />
          )}
        </div>
      ))}
    </nav>
  );
}

function StepChooseType({ selected, onSelect }) {
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <header className="apply-flow-step__head">
        <h2>Choose Assistance Type</h2>
        <p>Select the category that best describes your financial need.</p>
      </header>
      <div className="apply-flow-type-grid">
        {APPLY_ASSISTANCE_CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`apply-flow-type-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelect(cat.id)}
            >
              {isSelected && (
                <span className="apply-flow-type-card__check" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
              <span className="apply-flow-type-card__icon" aria-hidden="true">{cat.icon}</span>
              <span className="apply-flow-type-card__body">
                <strong>{cat.title}</strong>
                <span>{cat.description}</span>
              </span>
              <ChevronRight size={20} className="apply-flow-type-card__arrow" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDetails({ values, onChange }) {
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <header className="apply-flow-step__head">
        <h2>Application Details</h2>
        <p>Tell us about your request — this is a wireframe preview only.</p>
      </header>
      <div className="apply-flow-fields">
        <label className="apply-flow-field">
          <span>Purpose</span>
          <input
            type="text"
            placeholder="e.g. Emergency house rent support"
            value={values.purpose}
            onChange={(e) => onChange('purpose', e.target.value)}
          />
        </label>
        <label className="apply-flow-field">
          <span>Required Amount</span>
          <input
            type="text"
            placeholder="Enter amount needed (₹)"
            value={values.amount}
            onChange={(e) => onChange('amount', e.target.value)}
          />
        </label>
        <label className="apply-flow-field">
          <span>Description</span>
          <textarea
            rows={4}
            placeholder="Explain your situation and how funds will be used"
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </label>
        <label className="apply-flow-field">
          <span>Additional Notes</span>
          <textarea
            rows={2}
            placeholder="Any extra details (optional)"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

function StepDocuments() {
  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <header className="apply-flow-step__head">
        <h2>Upload Documents</h2>
        <p>Wireframe placeholders — upload functionality is not implemented.</p>
      </header>

      <div className="apply-flow-dropzone" role="presentation">
        <CloudUpload size={40} strokeWidth={1.5} aria-hidden="true" />
        <strong>Drag &amp; drop files here</strong>
        <span>or click to browse from your device</span>
        <span className="apply-flow-dropzone__hint">PDF, JPG, PNG · Max 5MB per file</span>
      </div>

      <div className="apply-flow-upload-cards">
        {APPLY_UPLOAD_PLACEHOLDERS.map((item) => (
          <div key={item.label} className="apply-flow-upload-card">
            <div className="apply-flow-upload-card__icon">
              <Upload size={20} aria-hidden="true" />
            </div>
            <div>
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="apply-flow-doc-list">
        <h3>Document List</h3>
        <ul>
          {APPLY_WIREFRAME_DOCUMENTS.map((doc) => (
            <li key={doc.name} className="apply-flow-doc-item">
              <div className="apply-flow-doc-item__info">
                <FileText size={18} aria-hidden="true" />
                <div>
                  <strong>{doc.name}</strong>
                  <span>{doc.filename}</span>
                </div>
              </div>
              <div className="apply-flow-doc-item__progress">
                <div className="apply-flow-doc-item__bar">
                  <div className="apply-flow-doc-item__fill" style={{ width: `${doc.progress}%` }} />
                </div>
                <span>{doc.progress === 100 ? 'Complete' : doc.progress > 0 ? `${doc.progress}%` : 'Pending'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepReview({ category, values, onEditStep }) {
  const cat = APPLY_ASSISTANCE_CATEGORIES.find((c) => c.id === category);

  return (
    <div className="apply-flow-step apply-flow-step--enter">
      <header className="apply-flow-step__head">
        <h2>Review &amp; Submit</h2>
        <p>Confirm your application details before submitting to AJA Abayahastham.</p>
      </header>

      <div className="apply-flow-review">
        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Selected Assistance</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(1)}>Edit</button>
          </div>
          {cat ? (
            <div className="apply-flow-review__card">
              <span className="apply-flow-review__emoji">{cat.icon}</span>
              <div>
                <strong>{cat.title}</strong>
                <p>{cat.description}</p>
              </div>
            </div>
          ) : (
            <p className="apply-flow-review__empty">No type selected (wireframe)</p>
          )}
        </section>

        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Application Details</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(2)}>Edit</button>
          </div>
          <dl className="apply-flow-review__dl">
            <div><dt>Purpose</dt><dd>{values.purpose || '—'}</dd></div>
            <div><dt>Required Amount</dt><dd>{values.amount || '—'}</dd></div>
            <div><dt>Description</dt><dd>{values.description || '—'}</dd></div>
            <div><dt>Additional Notes</dt><dd>{values.notes || '—'}</dd></div>
          </dl>
        </section>

        <section className="apply-flow-review__block">
          <div className="apply-flow-review__head">
            <h3>Uploaded Documents</h3>
            <button type="button" className="apply-flow-review__edit" onClick={() => onEditStep(3)}>Edit</button>
          </div>
          <ul className="apply-flow-review__docs">
            {APPLY_WIREFRAME_DOCUMENTS.map((doc) => (
              <li key={doc.name}>
                <FileText size={16} aria-hidden="true" />
                <span>{doc.name}</span>
                <span className={`apply-flow-review__doc-status ${doc.progress === 100 ? 'is-done' : ''}`}>
                  {doc.progress === 100 ? 'Uploaded' : 'Placeholder'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function SuccessModal({ onViewApplications, onDashboard }) {
  return createPortal(
    <div className="apply-flow-overlay apply-flow-overlay--success" role="dialog" aria-modal="true" aria-labelledby="apply-success-title">
      <div className="apply-flow-success apply-flow-success--premium">
        <div className="apply-flow-success__illustration" aria-hidden="true">
          <div className="apply-flow-success__ring">
            <Check size={40} strokeWidth={2.5} />
          </div>
          <span className="apply-flow-success__spark">✨</span>
        </div>
        <h2 id="apply-success-title">Application Submitted Successfully</h2>
        <p>
          Your financial assistance request has been submitted to AJA Abayahastham.
          Our team will review your application and notify you of any updates.
        </p>
        <div className="apply-flow-success__actions">
          <button type="button" className="apply-flow-btn apply-flow-btn--primary apply-flow-btn--block" onClick={onViewApplications}>
            View My Applications
          </button>
          <button type="button" className="apply-flow-btn apply-flow-btn--ghost apply-flow-btn--block" onClick={onDashboard}>
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ApplyAssistanceModal({ onClose, onSubmitted }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({
    purpose: '',
    amount: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goBack = () => (step === 1 ? onClose() : setStep((s) => s - 1));
  const handleSubmit = () => {
    onSubmitted({ categoryId: selectedType, form });
  };

  return createPortal(
    <div className="apply-flow-overlay" role="presentation">
      <div className="apply-flow-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="apply-flow-modal" role="dialog" aria-modal="true" aria-labelledby="apply-flow-title">
        <header className="apply-flow-modal__header">
          <div>
            <p className="apply-flow-modal__eyebrow">Guided Application</p>
            <h2 id="apply-flow-title">Financial Assistance Request</h2>
          </div>
          <button type="button" className="apply-flow-close" onClick={onClose} aria-label="Close application">
            <X size={20} />
          </button>
        </header>

        <ApplyFlowProgress step={step} />

        <div className="apply-flow-modal__body" key={step}>
          {step === 1 && <StepChooseType selected={selectedType} onSelect={setSelectedType} />}
          {step === 2 && <StepDetails values={form} onChange={updateForm} />}
          {step === 3 && <StepDocuments />}
          {step === 4 && <StepReview category={selectedType} values={form} onEditStep={setStep} />}
        </div>

        <footer className="apply-flow-modal__footer">
          <button type="button" className="apply-flow-btn apply-flow-btn--ghost" onClick={goBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button type="button" className="apply-flow-btn apply-flow-btn--primary" onClick={goNext}>
              Next
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className="apply-flow-btn apply-flow-btn--primary" onClick={handleSubmit}>
              Submit Application
              <Check size={18} aria-hidden="true" />
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
      <div className="apply-flow-landing__hero">
        <div className="apply-flow-landing__content">
          <p className="apply-flow-landing__eyebrow">AJA Abayahastham · Receiver Support</p>
          <h1>Apply for Financial Assistance</h1>
          <p className="apply-flow-landing__subtitle">
            Need support? AJA Abayahastham is here to help. Complete a simple guided application
            to request financial assistance.
          </p>
          <button type="button" className="apply-flow-start-btn" onClick={onStart}>
            Start Application
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="apply-flow-landing__illus" aria-hidden="true">
          <div className="apply-flow-landing__graphic">
            <span className="apply-flow-landing__emoji apply-flow-landing__emoji--1">🤝</span>
            <span className="apply-flow-landing__emoji apply-flow-landing__emoji--2">💚</span>
            <span className="apply-flow-landing__emoji apply-flow-landing__emoji--3">🏠</span>
          </div>
          <p className="apply-flow-landing__illus-caption">People helping people</p>
        </div>
      </div>
    </div>
  );
}

export { SuccessModal };
