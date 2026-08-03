import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Target, Hash, Users, Calendar, MapPin, FileText, MessageSquare
} from 'lucide-react';
import {
  getCategoryById,
  getPriorityStyle,
  PRIORITY_OPTIONS,
  DESCRIPTION_MAX,
  CONDITION_OPTIONS
} from '../../../data/ngoDonationCategories';
import CategoryIcon from './CategoryIcon';

function FloatField({ id, label, icon: Icon, type = 'text', value, onChange, rows }) {
  const isTextarea = rows > 0;
  const Tag = isTextarea ? 'textarea' : 'input';
  return (
    <div className={`rd-float-field ${!Icon ? 'rd-float-field--no-icon' : ''}`}>
      {Icon && (
        <span className={`rd-float-field__icon ${isTextarea ? 'rd-float-field__icon--top' : ''}`}>
          <Icon size={16} />
        </span>
      )}
      <Tag
        id={id}
        type={isTextarea ? undefined : type}
        rows={rows}
        value={value}
        placeholder=" "
        onChange={onChange}
        aria-label={label}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function LiveSummary({ form }) {
  const category = getCategoryById(form.category);
  const pri = getPriorityStyle(form.priority);
  const conditionLabel = CONDITION_OPTIONS.find((c) => c.id === form.condition)?.label;

  return (
    <aside className="rd-modal__summary">
      <h3>Live Summary</h3>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Category</span>
        <span className="rd-summary-row__val rd-summary-row__val--cat">
          {category ? (
            <>
              <span className="rd-summary-icon">
                <CategoryIcon name={category.iconName} size={16} />
              </span>
              {category.label}
            </>
          ) : '—'}
        </span>
      </div>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Subcategory</span>
        <span className="rd-summary-row__val">
          {form.subcategories?.length ? form.subcategories.join(', ') : '—'}
        </span>
      </div>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Target Beneficiaries</span>
        <span className="rd-summary-row__val">
          {form.beneficiaries?.length ? form.beneficiaries.join(', ') : '—'}
        </span>
      </div>

      {form.category === 'clothes' && (
        <div className="rd-summary-row">
          <span className="rd-summary-row__label">Condition</span>
          <span className="rd-summary-row__val">{conditionLabel || '—'}</span>
        </div>
      )}

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Quantity</span>
        <span className="rd-summary-row__val">{form.quantity ? `${form.quantity} units` : '—'}</span>
      </div>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Priority</span>
        <span className="rd-summary-row__val" style={{ color: pri.color }}>{form.priority || '—'}</span>
      </div>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Required Before Date</span>
        <span className="rd-summary-row__val">{form.deliveryDate || '—'}</span>
      </div>

      <div className="rd-summary-row">
        <span className="rd-summary-row__label">Delivery Location</span>
        <span className="rd-summary-row__val">{form.location || '—'}</span>
      </div>
    </aside>
  );
}

export default function RequestDetailsModal({ form, onChange, onClose, onContinue }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const category = getCategoryById(form.category);
  const patch = (updates) => onChange({ ...form, ...updates });

  const valid =
    form.purpose?.trim() &&
    form.quantity &&
    form.priority &&
    form.beneficiaryCount &&
    form.deliveryDate &&
    form.location?.trim();

  return createPortal(
    <div className="rd-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="rd-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rd-modal__form-col">
          <div className="rd-modal__head">
            <div>
              <h2 id="rd-details-title">Request Details</h2>
              <p>
                {category
                  ? `${category.label} · ${form.subcategories?.length || 0} item types selected`
                  : 'Complete your donation request'}
              </p>
            </div>
            <button type="button" className="rd-modal__close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="rd-modal__fields">
            <FloatField
              id="rd-purpose"
              label="Purpose"
              icon={Target}
              value={form.purpose}
              onChange={(e) => patch({ purpose: e.target.value })}
            />
            <div className="rd-modal__row">
              <FloatField
                id="rd-ben"
                label="Estimated Beneficiary Count"
                icon={Users}
                type="number"
                value={form.beneficiaryCount}
                onChange={(e) => patch({ beneficiaryCount: e.target.value })}
              />
              <FloatField
                id="rd-qty"
                label="Quantity Required"
                icon={Hash}
                type="number"
                value={form.quantity}
                onChange={(e) => patch({ quantity: e.target.value })}
              />
            </div>
            <div className="rd-modal__row">
              <div className="rd-float-field rd-float-field--no-icon">
                <select
                  id="rd-priority"
                  value={form.priority}
                  onChange={(e) => patch({ priority: e.target.value })}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label} — {p.hint}</option>
                  ))}
                </select>
                <label htmlFor="rd-priority">Priority</label>
              </div>
              <FloatField
                id="rd-date"
                label="Required Before Date"
                icon={Calendar}
                type="date"
                value={form.deliveryDate}
                onChange={(e) => patch({ deliveryDate: e.target.value })}
              />
            </div>
            <FloatField
              id="rd-loc"
              label="Delivery Location"
              icon={MapPin}
              value={form.location}
              onChange={(e) => patch({ location: e.target.value })}
            />
            <FloatField
              id="rd-desc"
              label="Description"
              icon={FileText}
              rows={3}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value.slice(0, DESCRIPTION_MAX) })}
            />
            <FloatField
              id="rd-notes"
              label="Special Instructions"
              icon={MessageSquare}
              rows={3}
              value={form.specialInstructions}
              onChange={(e) => patch({ specialInstructions: e.target.value })}
            />
          </div>
        </div>

        <LiveSummary form={form} />

        <footer className="rd-modal__footer">
          <button type="button" className="rd-btn rd-btn--secondary" onClick={onClose}>
            Back
          </button>
          <button type="button" className="rd-btn rd-btn--primary" onClick={onContinue} disabled={!valid}>
            Continue to Review
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
