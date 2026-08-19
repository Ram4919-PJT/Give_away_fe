import { useEffect, useState } from 'react';
import { RecurringGiftStatusBadge } from './RecurringGiftTable';
import { formatCurrency } from '../../../utils/donorHelpers';

function Backdrop({ children, onClose, label }) {
  return (
    <div className="mp-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dd-card mp-modal rg-modal"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function RecurringGiftDetailsModal({ row, onClose }) {
  if (!row) return null;
  return (
    <Backdrop onClose={onClose} label="Recurring gift details">
      <div className="mp-modal__head">
        <div>
          <h2>{row.title}</h2>
          <p>{row.ngo_name} · {row.category}</p>
        </div>
        <button type="button" className="mp-page-btn" onClick={onClose}>Close</button>
      </div>
      <dl className="mp-modal__grid">
        <div><dt>Amount</dt><dd>{row.amount_label}</dd></div>
        <div><dt>Frequency</dt><dd>{row.frequency_label}</dd></div>
        <div><dt>Start date</dt><dd>{row.start_label}</dd></div>
        <div><dt>Next payment</dt><dd>{row.next_payment_label || '—'}</dd></div>
        <div><dt>Payments made</dt><dd>{row.payments_made ?? 0}</dd></div>
        <div><dt>Contributed</dt><dd>{formatCurrency(row.contributed)}</dd></div>
        <div><dt>Status</dt><dd><RecurringGiftStatusBadge status={row.status} /></dd></div>
        <div><dt>Payment method</dt><dd>{row.payment_method || '—'}</dd></div>
      </dl>
    </Backdrop>
  );
}

export function RecurringGiftEditModal({
  row,
  frequencies = [],
  paymentMethods = [],
  submitting,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState(row?.amount != null ? String(row.amount) : '');
  const [frequency, setFrequency] = useState(row?.frequency || 'MONTHLY');
  const [paymentMethod, setPaymentMethod] = useState(row?.payment_method || '');
  const [nextDate, setNextDate] = useState(row?.next_payment_date || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount(row?.amount != null ? String(row.amount) : '');
    setFrequency(row?.frequency || 'MONTHLY');
    setPaymentMethod(row?.payment_method || '');
    setNextDate(row?.next_payment_date || '');
    setError('');
  }, [row]);

  if (!row) return null;

  const canChangeNext = row.status === 'Active';
  const freqOptions = frequencies.length
    ? frequencies
    : [
        { id: 'DAILY', label: 'Daily' },
        { id: 'WEEKLY', label: 'Weekly' },
        { id: 'MONTHLY', label: 'Monthly' },
        { id: 'QUARTERLY', label: 'Quarterly' },
        { id: 'YEARLY', label: 'Yearly' },
      ];

  const submit = (e) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) {
      setError('Enter a valid amount greater than zero.');
      return;
    }
    if (!frequency) {
      setError('Select a frequency.');
      return;
    }
    if (canChangeNext && nextDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const picked = new Date(`${nextDate}T00:00:00`);
      if (Number.isNaN(picked.getTime()) || picked < today) {
        setError('Next payment date cannot be in the past.');
        return;
      }
    }
    setError('');
    onSubmit({
      amount: numeric,
      frequency,
      payment_method: paymentMethod || null,
      next_payment_date: canChangeNext && nextDate ? nextDate : undefined,
    });
  };

  return (
    <Backdrop onClose={submitting ? undefined : onClose} label="Edit recurring gift">
      <div className="mp-modal__head">
        <div>
          <h2>Edit Recurring Gift</h2>
          <p>{row.title} · {row.ngo_name}</p>
        </div>
        <button type="button" className="mp-page-btn" onClick={onClose} disabled={submitting}>Close</button>
      </div>
      <form className="rg-form" onSubmit={submit}>
        <label className="form-group">
          <span>Amount (₹)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className="form-group">
          <span>Frequency</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            {freqOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </label>
        <label className="form-group">
          <span>Payment method</span>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select method</option>
            {paymentMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
            {row.payment_method && !paymentMethods.includes(row.payment_method) && (
              <option value={row.payment_method}>{row.payment_method}</option>
            )}
          </select>
        </label>
        {canChangeNext && (
          <label className="form-group">
            <span>Next payment date</span>
            <input type="date" value={nextDate || ''} onChange={(e) => setNextDate(e.target.value)} />
          </label>
        )}
        {error && <p className="rg-form__error">{error}</p>}
        <div className="rg-form__actions">
          <button type="button" className="mp-page-btn" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" className="dd-btn" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Backdrop>
  );
}

export function RecurringGiftConfirmModal({
  row,
  type,
  submitting,
  onClose,
  onConfirm,
}) {
  if (!row || !type) return null;

  const copy = {
    pause: {
      title: 'Pause recurring gift?',
      body: 'Are you sure you want to pause this recurring gift?',
      confirm: 'Pause gift',
    },
    resume: {
      title: 'Resume recurring gift?',
      body: 'Resume this recurring gift?',
      confirm: 'Resume gift',
    },
    cancel: {
      title: 'Cancel recurring gift?',
      body: 'This will stop future payments. Past contributions remain unchanged.',
      confirm: 'Cancel gift',
    },
  }[type];

  return (
    <Backdrop onClose={submitting ? undefined : onClose} label={copy.title}>
      <div className="mp-modal__head">
        <div>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
      </div>
      <dl className="mp-modal__grid">
        <div><dt>Cause</dt><dd>{row.title}</dd></div>
        <div><dt>Amount</dt><dd>{row.amount_label}</dd></div>
        <div><dt>Frequency</dt><dd>{row.frequency_label}</dd></div>
        <div><dt>Status</dt><dd><RecurringGiftStatusBadge status={row.status} /></dd></div>
      </dl>
      <div className="rg-form__actions">
        <button type="button" className="mp-page-btn" onClick={onClose} disabled={submitting}>Keep gift</button>
        <button
          type="button"
          className={type === 'cancel' ? 'rg-danger-btn' : 'dd-btn'}
          onClick={onConfirm}
          disabled={submitting}
        >
          {submitting ? 'Working…' : copy.confirm}
        </button>
      </div>
    </Backdrop>
  );
}
