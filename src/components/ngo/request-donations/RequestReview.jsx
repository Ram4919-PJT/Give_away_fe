import { Send, Pencil, ArrowLeft } from 'lucide-react';
import {
  getCategoryById,
  getPriorityStyle,
  CONDITION_OPTIONS
} from '../../../data/ngoDonationCategories';
import CategoryIcon from './CategoryIcon';

function ReviewCard({ label, value, wide = false, children }) {
  return (
    <article className={`rd-review-card${wide ? ' rd-review-card--wide' : ''}`}>
      <span className="rd-review-card__label">{label}</span>
      <span className="rd-review-card__val">{children || value || '—'}</span>
    </article>
  );
}

export default function RequestReview({ form, onEdit, onBack, onSubmit, submitting = false }) {
  const category = getCategoryById(form.category);
  const pri = getPriorityStyle(form.priority);
  const conditionLabel = CONDITION_OPTIONS.find((c) => c.id === form.condition)?.label;

  return (
    <div className="rd-review">
      <header className="rd-panel-head">
        <h2>Review Request</h2>
        <p>Confirm all details before submitting for admin review.</p>
      </header>

      <div className="rd-review-grid">
        <ReviewCard label="Category">
          <span className="rd-review-card__val--cat">
            <span className="rd-review-card__icon">
              <CategoryIcon name={category?.iconName || 'Package'} size={18} />
            </span>
            {category?.label || '—'}
          </span>
        </ReviewCard>

        <ReviewCard label="Priority">
          <span style={{ color: pri.color }}>{form.priority}</span>
        </ReviewCard>

        <ReviewCard label="Subcategories" wide>
          {form.subcategories?.length ? (
            <span className="rd-review-tags">
              {form.subcategories.map((s) => (
                <span key={s} className="rd-review-tag">{s}</span>
              ))}
            </span>
          ) : '—'}
        </ReviewCard>

        <ReviewCard label="Target Beneficiaries" wide>
          {form.beneficiaries?.length ? (
            <span className="rd-review-tags">
              {form.beneficiaries.map((b) => (
                <span key={b} className="rd-review-tag rd-review-tag--blue">{b}</span>
              ))}
            </span>
          ) : '—'}
        </ReviewCard>

        {form.category === 'clothes' && (
          <ReviewCard label="Condition Needed" value={conditionLabel} />
        )}

        <ReviewCard label="Quantity" value={form.quantity ? `${form.quantity} units` : '—'} />
        <ReviewCard label="Beneficiaries" value={form.beneficiaryCount || '—'} />
        <ReviewCard label="Required Before" value={form.deliveryDate || '—'} />
        <ReviewCard label="Purpose" wide value={form.purpose} />
        <ReviewCard label="Delivery Location" wide value={form.location} />
        <ReviewCard label="Description" wide value={form.description || '—'} />
        <ReviewCard label="Special Instructions" wide value={form.specialInstructions || '—'} />
      </div>

      <div className="rd-review-actions rd-review-actions--split">
        <button type="button" className="rd-btn rd-btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Previous
        </button>
        <div className="rd-review-actions__primary">
          <button type="button" className="rd-btn rd-btn--ghost" onClick={onEdit}>
            <Pencil size={16} />
            Edit
          </button>
          <button
            type="button"
            className="rd-btn rd-btn--primary"
            onClick={onSubmit}
            disabled={submitting}
          >
            <Send size={16} />
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
