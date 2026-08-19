import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Landmark, ShieldCheck, IndianRupee, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/donorHelpers';

const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function validateBankForm(form) {
  const holder = form.account_holder_name.trim();
  const bank = form.bank_name.trim();
  const account = form.account_number.trim();
  const confirm = form.confirm_account_number.trim();
  const ifsc = form.ifsc_code.trim().toUpperCase();

  if (holder.length < 2) return 'Enter the account holder name as per bank records.';
  if (bank.length < 2) return 'Enter your bank name.';
  if (!/^\d{8,18}$/.test(account)) return 'Account number must be 8–18 digits.';
  if (account !== confirm) return 'Account numbers do not match.';
  if (!IFSC_PATTERN.test(ifsc)) return 'Enter a valid 11-character IFSC code (e.g. SBIN0001234).';
  return null;
}

export default function ReceiverBankDetailsModal({ application, onClose, onSubmit }) {
  const [form, setForm] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateBankForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        account_holder_name: form.account_holder_name.trim(),
        bank_name: form.bank_name.trim(),
        account_number: form.account_number.trim(),
        confirm_account_number: form.confirm_account_number.trim(),
        ifsc_code: form.ifsc_code.trim().toUpperCase(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.message || 'Could not save bank details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const approvedAmount = application?.approvedAmount ?? application?.amount;

  return createPortal(
    <div className="bank-portal-overlay" role="presentation">
      <div className="bank-portal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="bank-portal-modal" role="dialog" aria-modal="true" aria-labelledby="bank-portal-title">
        <header className="bank-portal-modal__header">
          <div className="bank-portal-modal__header-icon" aria-hidden="true">
            <Landmark size={20} />
          </div>
          <div>
            <p className="bank-portal-modal__eyebrow">Disbursement Portal</p>
            <h2 id="bank-portal-title">Add Bank Account Details</h2>
          </div>
          <button type="button" className="bank-portal-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        {success ? (
          <div className="bank-portal-success">
            <div className="bank-portal-success__icon" aria-hidden="true">
              <Check size={28} strokeWidth={2.5} />
            </div>
            <h3>Bank details submitted</h3>
            <p>
              Your bank information for request <strong>#{application?.id}</strong> has been received.
              Disbursement of {formatCurrency(approvedAmount)} will be processed by AJA Abayahastham.
            </p>
            <button type="button" className="bank-portal-btn bank-portal-btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="bank-portal-summary">
              <div>
                <span>Approved amount</span>
                <strong>{formatCurrency(approvedAmount)}</strong>
              </div>
              <div>
                <span>Request ID</span>
                <strong>#{application?.id}</strong>
              </div>
            </div>

            <form className="bank-portal-form" onSubmit={handleSubmit}>
              <label className="bank-portal-field">
                <span>Account holder name *</span>
                <input
                  type="text"
                  value={form.account_holder_name}
                  onChange={(e) => update('account_holder_name', e.target.value)}
                  placeholder="As printed on your bank passbook"
                  autoComplete="name"
                />
              </label>

              <label className="bank-portal-field">
                <span>Bank name *</span>
                <input
                  type="text"
                  value={form.bank_name}
                  onChange={(e) => update('bank_name', e.target.value)}
                  placeholder="e.g. State Bank of India"
                />
              </label>

              <div className="bank-portal-form__row">
                <label className="bank-portal-field">
                  <span>Account number *</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.account_number}
                    onChange={(e) => update('account_number', e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    autoComplete="off"
                  />
                </label>
                <label className="bank-portal-field">
                  <span>Confirm account number *</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.confirm_account_number}
                    onChange={(e) => update('confirm_account_number', e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter account number"
                    autoComplete="off"
                  />
                </label>
              </div>

              <label className="bank-portal-field">
                <span>IFSC code *</span>
                <input
                  type="text"
                  value={form.ifsc_code}
                  onChange={(e) => update('ifsc_code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
                  placeholder="SBIN0001234"
                  autoComplete="off"
                />
              </label>

              <div className="bank-portal-trust">
                <ShieldCheck size={16} aria-hidden="true" />
                <p>Your bank details are encrypted and used only for approved assistance disbursements.</p>
              </div>

              {error && <p className="bank-portal-error" role="alert">{error}</p>}

              <footer className="bank-portal-form__footer">
                <button type="button" className="bank-portal-btn bank-portal-btn--ghost" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="bank-portal-btn bank-portal-btn--primary" disabled={submitting}>
                  <IndianRupee size={15} />
                  {submitting ? 'Submitting…' : 'Submit bank details'}
                </button>
              </footer>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
