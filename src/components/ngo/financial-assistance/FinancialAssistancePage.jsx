import { useRef, useState } from 'react';
import {
  Info, IndianRupee, Calendar, Users, FileText, StickyNote,
  Upload, X, Save, Send, Clock, FileCheck, AlertCircle, Check,
  Stethoscope, GraduationCap, UtensilsCrossed, Home, ShieldAlert,
  Briefcase, HeartHandshake
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import { coreClient } from '../../../api/platformApi';
import {
  FINANCIAL_PURPOSE_CATEGORIES,
  FINANCIAL_PRIORITY_OPTIONS,
  FINANCIAL_AMOUNT_MIN,
  FINANCIAL_AMOUNT_MAX,
  FINANCIAL_REVIEW_TIME,
  INITIAL_FINANCIAL_FORM,
  getPurposeById,
  getPriorityById,
  formatInrDisplay,
  parseAmountInput,
  isFinancialFormValid
} from '../../../data/ngoFinancialAssistance';
import { formatCurrency } from '../../../utils/donorHelpers';

const PURPOSE_ICONS = {
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  Home,
  ShieldAlert,
  Briefcase,
  HeartHandshake
};

const ACCEPTED_DOCS = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

function PurposeIcon({ name, size = 26 }) {
  const Icon = PURPOSE_ICONS[name] || HeartHandshake;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

function LiveSummary({ form }) {
  const purpose = getPurposeById(form.purposeCategory);
  const priority = getPriorityById(form.priority);
  const amountNum = form.amount === '' ? null : Number(form.amount);
  const amountValid =
    amountNum != null &&
    !Number.isNaN(amountNum) &&
    amountNum >= FINANCIAL_AMOUNT_MIN &&
    amountNum <= FINANCIAL_AMOUNT_MAX;

  return (
    <aside className="nfa-summary" aria-live="polite">
      <div className="nfa-summary__head">
        <h2>Live Request Summary</h2>
        <p>Updates as you complete the form</p>
      </div>

      <div className="nfa-summary__rows">
        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Amount Requested</span>
          <span className={`nfa-summary__val ${amountValid ? 'nfa-summary__val--amount' : ''}`}>
            {amountValid ? formatCurrency(amountNum) : '—'}
          </span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Purpose</span>
          <span className="nfa-summary__val">
            {purpose ? (
              <span className="nfa-summary__purpose">
                <span className="nfa-summary__purpose-icon">
                  <PurposeIcon name={purpose.icon} size={16} />
                </span>
                {purpose.label}
              </span>
            ) : '—'}
          </span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Priority</span>
          <span className="nfa-summary__val" style={{ color: priority.color }}>
            {form.priority || '—'}
          </span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Required Before</span>
          <span className="nfa-summary__val">{form.requiredBefore || '—'}</span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Beneficiary Count</span>
          <span className="nfa-summary__val">
            {form.beneficiaryCount ? Number(form.beneficiaryCount).toLocaleString('en-IN') : '—'}
          </span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Documents Uploaded</span>
          <span className="nfa-summary__val">
            {form.documents?.length
              ? `${form.documents.length} file${form.documents.length > 1 ? 's' : ''}`
              : 'None'}
          </span>
        </div>

        <div className="nfa-summary__row">
          <span className="nfa-summary__label">Request Status</span>
          <span className="nfa-summary__badge">Draft</span>
        </div>

        <div className="nfa-summary__row nfa-summary__row--last">
          <span className="nfa-summary__label">Estimated Review Time</span>
          <span className="nfa-summary__val nfa-summary__val--review">
            <Clock size={14} aria-hidden="true" />
            {FINANCIAL_REVIEW_TIME}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default function FinancialAssistancePage() {
  const { currentUser, ngoProfile, refreshPlatformData } = useApp();
  const { showToast } = useToast();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ ...INITIAL_FINANCIAL_FORM });
  const [amountDisplay, setAmountDisplay] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const handleAmountChange = (e) => {
    const parsed = parseAmountInput(e.target.value);
    patch({ amount: parsed });
    setAmountDisplay(parsed === '' ? '' : formatInrDisplay(parsed));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowed = files.filter((f) =>
      /pdf|jpeg|jpg|png/i.test(f.type) || /\.(pdf|jpe?g|png)$/i.test(f.name)
    );

    if (allowed.length < files.length) {
      showToast('Only PDF, JPG, and PNG files are allowed', 'error');
    }

    const next = [
      ...(form.documents || []),
      ...allowed.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    ].slice(0, 5);

    patch({ documents: next });
    e.target.value = '';
  };

  const removeDocument = (name) => {
    patch({ documents: (form.documents || []).filter((d) => d.name !== name) });
  };

  const validate = () => {
    const next = {};
    const amount = Number(form.amount);

    if (form.amount === '' || Number.isNaN(amount)) {
      next.amount = 'Enter a requested amount';
    } else if (amount < FINANCIAL_AMOUNT_MIN) {
      next.amount = `Minimum amount is ₹${FINANCIAL_AMOUNT_MIN.toLocaleString('en-IN')}`;
    } else if (amount > FINANCIAL_AMOUNT_MAX) {
      next.amount = `Maximum amount is ₹${FINANCIAL_AMOUNT_MAX.toLocaleString('en-IN')}`;
    }

    if (!form.purposeCategory) next.purposeCategory = 'Select a purpose category';
    if (!form.priority) next.priority = 'Select a priority';
    if (!form.requiredBefore) next.requiredBefore = 'Select a required before date';
    if (!form.beneficiaryCount || Number(form.beneficiaryCount) <= 0) {
      next.beneficiaryCount = 'Enter the number of beneficiaries';
    }
    if (!form.beneficiaryDetails?.trim()) {
      next.beneficiaryDetails = 'Describe the beneficiaries';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (status) => {
    const purpose = getPurposeById(form.purposeCategory);
    return {
      id: 'NGO-REQ-' + Date.now(),
      ngoEmail: currentUser.email,
      type: 'Financial',
      purpose: purpose?.label || form.purposeCategory || 'Financial Assistance',
      purposeCategory: form.purposeCategory,
      amount: Number(form.amount) || 0,
      priority: form.priority,
      requiredBefore: form.requiredBefore,
      beneficiaryCount: Number(form.beneficiaryCount) || 0,
      beneficiary: form.beneficiaryDetails.trim(),
      notes: form.notes?.trim() || '',
      documents: (form.documents || []).map((d) => d.name),
      status,
      appliedDate: new Date().toISOString().split('T')[0]
    };
  };

  const resetForm = () => {
    setForm({ ...INITIAL_FINANCIAL_FORM });
    setAmountDisplay('');
    setErrors({});
  };

  const handleSaveDraft = () => {
    showToast('Draft saving is not available — complete and submit the form.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete the required fields', 'error');
      return;
    }
    const ngoId = ngoProfile?.ngo_id;
    if (!ngoId) {
      showToast('NGO profile not found. Complete registration first.', 'error');
      return;
    }
    const purpose = getPurposeById(form.purposeCategory);
    const purposeText = [
      purpose?.label || form.purposeCategory,
      form.beneficiaryDetails?.trim(),
      form.notes?.trim(),
    ].filter(Boolean).join(' — ');

    setSubmitting(true);
    try {
      await coreClient.createNgoFundRequest({
        ngo_id: ngoId,
        amount_requested: Number(form.amount),
        purpose: purposeText,
      });
      await refreshPlatformData('ngo', currentUser?.email);
      showToast('Financial request submitted!', 'success');
      resetForm();
    } catch (err) {
      showToast(err.message || 'Could not submit request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const valid = isFinancialFormValid(form);

  return (
    <div className="nfa-page ngo-page ngo-module page-route">
      <header className="nfa-hero">
        <h1>Request Financial Assistance</h1>
        <p>Submit verified funding needs for medical care, education, relief, and community programs.</p>
      </header>

      <div className="nfa-info-banner" role="note">
        <span className="nfa-info-banner__icon" aria-hidden="true">
          <Info size={18} />
        </span>
        <p>
          Submit requests for verified financial assistance such as medical care, education, food
          distribution, disaster relief, or community welfare. Requests will be reviewed before being
          published to donors.
        </p>
      </div>

      <div className="nfa-layout">
        <form className="nfa-form-card" onSubmit={handleSubmit} noValidate>
          <div className="nfa-field">
            <label htmlFor="nfa-amount">Requested Amount (₹)</label>
            <div className={`nfa-amount ${errors.amount ? 'is-invalid' : ''}`}>
              <span className="nfa-amount__prefix" aria-hidden="true">
                <IndianRupee size={16} />
              </span>
              <input
                id="nfa-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={amountDisplay}
                onChange={handleAmountChange}
                aria-describedby="nfa-amount-help"
                aria-invalid={!!errors.amount}
              />
            </div>
            <p id="nfa-amount-help" className="nfa-help">
              Minimum ₹{FINANCIAL_AMOUNT_MIN.toLocaleString('en-IN')} · Maximum ₹
              {FINANCIAL_AMOUNT_MAX.toLocaleString('en-IN')}
            </p>
            {errors.amount && (
              <p className="nfa-error" role="alert">
                <AlertCircle size={14} /> {errors.amount}
              </p>
            )}
          </div>

          <fieldset className="nfa-field nfa-field--purpose">
            <legend>Purpose Category</legend>
            <p id="nfa-purpose-help" className="nfa-help nfa-help--purpose">
              Select the primary reason for requesting financial assistance.
            </p>
            <div
              className="nfa-purpose-grid"
              role="radiogroup"
              aria-label="Purpose category"
              aria-describedby="nfa-purpose-help"
            >
              {FINANCIAL_PURPOSE_CATEGORIES.map((cat) => {
                const selected = form.purposeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={cat.label}
                    className={`nfa-purpose-card${selected ? ' is-selected' : ''}`}
                    onClick={() => {
                      patch({ purposeCategory: cat.id });
                      if (errors.purposeCategory) {
                        setErrors((prev) => ({ ...prev, purposeCategory: undefined }));
                      }
                    }}
                  >
                    {selected && (
                      <span className="nfa-purpose-card__check" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <span className="nfa-purpose-card__icon">
                      <PurposeIcon name={cat.icon} size={26} />
                    </span>
                    <span className="nfa-purpose-card__label">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.purposeCategory && (
              <p id="nfa-purpose-error" className="nfa-error" role="alert">
                <AlertCircle size={14} /> {errors.purposeCategory}
              </p>
            )}
          </fieldset>

          <div className="nfa-row">
            <div className="nfa-field">
              <label htmlFor="nfa-priority">Priority</label>
              <select
                id="nfa-priority"
                value={form.priority}
                onChange={(e) => patch({ priority: e.target.value })}
                aria-invalid={!!errors.priority}
              >
                {FINANCIAL_PRIORITY_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="nfa-field">
              <label htmlFor="nfa-date">Required Before Date</label>
              <div className="nfa-input-icon">
                <Calendar size={16} aria-hidden="true" />
                <input
                  id="nfa-date"
                  type="date"
                  value={form.requiredBefore}
                  onChange={(e) => {
                    patch({ requiredBefore: e.target.value });
                    if (errors.requiredBefore) {
                      setErrors((prev) => ({ ...prev, requiredBefore: undefined }));
                    }
                  }}
                  aria-invalid={!!errors.requiredBefore}
                />
              </div>
              {errors.requiredBefore && (
                <p className="nfa-error" role="alert">
                  <AlertCircle size={14} /> {errors.requiredBefore}
                </p>
              )}
            </div>
          </div>

          <div className="nfa-field">
            <label htmlFor="nfa-count">Number of Beneficiaries</label>
            <div className="nfa-input-icon">
              <Users size={16} aria-hidden="true" />
              <input
                id="nfa-count"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 25"
                value={form.beneficiaryCount}
                onChange={(e) => {
                  patch({ beneficiaryCount: e.target.value });
                  if (errors.beneficiaryCount) {
                    setErrors((prev) => ({ ...prev, beneficiaryCount: undefined }));
                  }
                }}
                aria-invalid={!!errors.beneficiaryCount}
              />
            </div>
            {errors.beneficiaryCount && (
              <p className="nfa-error" role="alert">
                <AlertCircle size={14} /> {errors.beneficiaryCount}
              </p>
            )}
          </div>

          <div className="nfa-field">
            <label htmlFor="nfa-details">Beneficiary Details</label>
            <div className="nfa-textarea-wrap">
              <FileText size={16} aria-hidden="true" />
              <textarea
                id="nfa-details"
                rows={5}
                placeholder="Describe who will benefit and how the funds will be used…"
                value={form.beneficiaryDetails}
                onChange={(e) => {
                  patch({ beneficiaryDetails: e.target.value });
                  if (errors.beneficiaryDetails) {
                    setErrors((prev) => ({ ...prev, beneficiaryDetails: undefined }));
                  }
                }}
                aria-invalid={!!errors.beneficiaryDetails}
              />
            </div>
            {errors.beneficiaryDetails && (
              <p className="nfa-error" role="alert">
                <AlertCircle size={14} /> {errors.beneficiaryDetails}
              </p>
            )}
          </div>

          <div className="nfa-field">
            <label id="nfa-docs-label">Supporting Documents (Optional)</label>
            <p className="nfa-help">
              PDF, JPG, or PNG — Medical Bills, Fee Receipts, Quotations, NGO Approval Letter
            </p>
            <div
              className="nfa-upload"
              role="group"
              aria-labelledby="nfa-docs-label"
            >
              <FileCheck size={22} strokeWidth={1.5} aria-hidden="true" />
              <p>Upload supporting documents</p>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_DOCS}
                multiple
                hidden
                onChange={handleFiles}
              />
              <button
                type="button"
                className="nfa-btn nfa-btn--ghost"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={14} /> Browse Files
              </button>
              {form.documents?.length > 0 && (
                <ul className="nfa-upload-list">
                  {form.documents.map((doc) => (
                    <li key={doc.name} className="nfa-upload-tag">
                      <span>{doc.name}</span>
                      <button
                        type="button"
                        className="nfa-upload-tag__remove"
                        onClick={() => removeDocument(doc.name)}
                        aria-label={`Remove ${doc.name}`}
                      >
                        <X size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="nfa-field">
            <label htmlFor="nfa-notes">Additional Notes (Optional)</label>
            <div className="nfa-textarea-wrap">
              <StickyNote size={16} aria-hidden="true" />
              <textarea
                id="nfa-notes"
                rows={3}
                placeholder="Any extra context for reviewers…"
                value={form.notes}
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </div>
          </div>

          <div className="nfa-actions">
            <button type="button" className="nfa-btn nfa-btn--secondary" onClick={handleSaveDraft}>
              <Save size={16} />
              Save as Draft
            </button>
            <button type="submit" className="nfa-btn nfa-btn--primary" disabled={!valid}>
              <Send size={16} />
              Submit Financial Request
            </button>
          </div>
        </form>

        <LiveSummary form={form} />
      </div>
    </div>
  );
}
