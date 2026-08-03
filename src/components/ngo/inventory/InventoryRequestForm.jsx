import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Lock, Hash, Users, Calendar, MapPin, FileText,
  MessageSquare, Send, Check, Clock
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  TARGET_BENEFICIARIES,
  PRIORITY_OPTIONS,
  getPriorityStyle
} from '../../../data/ngoDonationCategories';
import {
  getInventoryStockStatus,
  INITIAL_INVENTORY_REQUEST_FORM
} from '../../../utils/inventoryHelpers';

function LiveSummary({ item, form, status }) {
  const pri = getPriorityStyle(form.priority);
  const qty = Number(form.quantity) || 0;
  const remaining = Math.max(0, Number(item.qty) - qty);

  return (
    <aside className="inv-req-summary" aria-live="polite">
      <div className="inv-req-summary__head">
        <h2>Live Summary</h2>
        <p>Updates as you complete the request</p>
      </div>

      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Selected Item</span>
        <span className="inv-req-summary__val">{item.name}</span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Available Stock</span>
        <span className="inv-req-summary__val">
          {item.qty} {item.unit}
          <span className={`inv-status inv-status--${status.tone} inv-status--inline`}>
            {status.label}
          </span>
        </span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Requested Quantity</span>
        <span className="inv-req-summary__val inv-req-summary__val--accent">
          {qty > 0 ? `${qty} ${item.unit}` : '—'}
        </span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Remaining After Request</span>
        <span className="inv-req-summary__val">
          {qty > 0 ? `${remaining} ${item.unit}` : `${item.qty} ${item.unit}`}
        </span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Beneficiary Type</span>
        <span className="inv-req-summary__val">
          {form.beneficiaries?.length ? form.beneficiaries.join(', ') : '—'}
        </span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Priority</span>
        <span className="inv-req-summary__val" style={{ color: pri.color }}>
          {form.priority || '—'}
        </span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Required Before</span>
        <span className="inv-req-summary__val">{form.deliveryDate || '—'}</span>
      </div>
      <div className="inv-req-summary__row">
        <span className="inv-req-summary__label">Location</span>
        <span className="inv-req-summary__val">{form.location || '—'}</span>
      </div>
      <div className="inv-req-summary__row inv-req-summary__row--last">
        <span className="inv-req-summary__label">Estimated Approval Status</span>
        <span className="inv-req-summary__val inv-req-summary__val--review">
          <Clock size={14} aria-hidden="true" />
          Pending review · 24–48 hrs
        </span>
      </div>
    </aside>
  );
}

export default function InventoryRequestForm({ inventoryItem }) {
  const { currentUser, dispatch } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...INITIAL_INVENTORY_REQUEST_FORM });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const status = useMemo(
    () => getInventoryStockStatus(inventoryItem.qty),
    [inventoryItem.qty]
  );

  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const toggleBeneficiary = (value) => {
    setForm((prev) => {
      const list = prev.beneficiaries || [];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, beneficiaries: next };
    });
    if (errors.beneficiaries) setErrors((prev) => ({ ...prev, beneficiaries: undefined }));
  };

  const validate = () => {
    const next = {};
    const qty = Number(form.quantity);
    const available = Number(inventoryItem.qty) || 0;

    if (!form.quantity || Number.isNaN(qty) || qty <= 0) {
      next.quantity = 'Quantity must be greater than zero';
    } else if (qty > available) {
      next.quantity = `Cannot exceed available stock (${available} ${inventoryItem.unit})`;
    }

    if (!form.beneficiaries?.length) next.beneficiaries = 'Select at least one beneficiary type';
    if (!form.beneficiaryCount || Number(form.beneficiaryCount) <= 0) {
      next.beneficiaryCount = 'Enter beneficiary count';
    }
    if (!form.priority) next.priority = 'Select priority';
    if (!form.deliveryDate) next.deliveryDate = 'Select a required before date';
    if (!form.location?.trim()) next.location = 'Enter delivery location';
    if (!form.reason?.trim()) next.reason = 'Enter a reason for this request';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    dispatch({
      type: 'ADD_NGO_REQUEST',
      payload: {
        id: 'NGO-REQ-' + Date.now(),
        ngoEmail: currentUser.email,
        type: 'Items',
        source: 'inventory',
        inventoryItemId: inventoryItem.id,
        category: inventoryItem.category,
        itemName: inventoryItem.name,
        subcategories: [inventoryItem.name],
        beneficiaries: form.beneficiaries,
        title: `Inventory: ${inventoryItem.name}`,
        purpose: form.reason.trim(),
        quantity: Number(form.quantity),
        availableStock: Number(inventoryItem.qty),
        priority: form.priority,
        beneficiary: `${form.beneficiaryCount} beneficiaries · ${form.beneficiaries.join(', ')}`,
        beneficiaryCount: Number(form.beneficiaryCount),
        location: form.location.trim(),
        distributionDate: form.deliveryDate,
        targetDate: form.deliveryDate,
        notes: form.specialInstructions?.trim() || '',
        status: 'Submitted',
        appliedDate: new Date().toISOString().split('T')[0]
      }
    });

    setSubmitted(true);
    showToast('Your inventory request has been submitted successfully.', 'success');
  };

  const qtyNum = Number(form.quantity) || 0;
  const available = Number(inventoryItem.qty) || 0;
  const remaining = Math.max(0, available - qtyNum);

  const valid =
    qtyNum > 0 &&
    qtyNum <= available &&
    form.beneficiaries?.length > 0 &&
    Number(form.beneficiaryCount) > 0 &&
    form.priority &&
    form.deliveryDate &&
    form.location?.trim() &&
    form.reason?.trim();

  if (submitted) {
    return (
      <div className="inv-req-page">
        <div className="inv-req-success">
          <div className="inv-req-success__icon" aria-hidden="true">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h2>Request Submitted</h2>
          <p>Your inventory request for {inventoryItem.name} is pending review.</p>
          <div className="inv-req-success__actions">
            <button
              type="button"
              className="inv-btn inv-btn--secondary"
              onClick={() => navigate('/dashboard/ngo-inventory')}
            >
              Back to Inventory
            </button>
            <button
              type="button"
              className="inv-btn inv-btn--primary"
              onClick={() => navigate('/dashboard/ngo-my-requests')}
            >
              View My Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inv-req-page">
      <nav className="inv-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard/ngo-inventory">Inventory</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span>Request Item</span>
      </nav>

      <header className="inv-req-hero">
        <h1>Request Inventory Item</h1>
        <p>Complete the details below. Item selection is locked from inventory.</p>
      </header>

      <div className="inv-req-layout">
        <form className="inv-req-form" onSubmit={handleSubmit} noValidate>
          <section className="inv-req-locked" aria-label="Selected inventory item">
            <div className="inv-req-locked__head">
              <Lock size={14} aria-hidden="true" />
              <span>Selected from inventory</span>
            </div>

            <input type="hidden" name="itemId" value={inventoryItem.id} />

            <div className="inv-req-locked__grid">
              <div className="inv-locked-field">
                <span className="inv-locked-field__label">Category</span>
                <span className="inv-locked-field__val">{inventoryItem.category}</span>
              </div>
              <div className="inv-locked-field">
                <span className="inv-locked-field__label">Item Name</span>
                <span className="inv-locked-field__val">{inventoryItem.name}</span>
              </div>
              <div className="inv-locked-field">
                <span className="inv-locked-field__label">Available Quantity</span>
                <span className="inv-locked-field__val">
                  {inventoryItem.qty} {inventoryItem.unit}
                </span>
              </div>
              <div className="inv-locked-field">
                <span className="inv-locked-field__label">Current Stock Status</span>
                <span className="inv-locked-field__val">
                  <span className={`inv-status inv-status--${status.tone}`}>{status.label}</span>
                </span>
              </div>
            </div>
          </section>

          <div className="inv-req-field">
            <label htmlFor="inv-qty">Quantity Needed</label>
            <div className={`inv-req-input ${errors.quantity ? 'is-invalid' : ''}`}>
              <Hash size={16} aria-hidden="true" />
              <input
                id="inv-qty"
                type="number"
                min="1"
                max={available}
                step="1"
                value={form.quantity}
                onChange={(e) => {
                  patch({ quantity: e.target.value });
                  if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
                aria-invalid={!!errors.quantity}
                aria-describedby="inv-qty-help"
              />
            </div>
            <p id="inv-qty-help" className="inv-req-help">
              Available: {available} {inventoryItem.unit}
              {qtyNum > 0 ? ` · Remaining after request: ${remaining} ${inventoryItem.unit}` : ''}
            </p>
            {errors.quantity && (
              <p className="inv-req-error" role="alert">{errors.quantity}</p>
            )}
          </div>

          <fieldset className="inv-req-field">
            <legend>Target Beneficiaries</legend>
            <div className="inv-chip-grid" role="group" aria-label="Target beneficiaries">
              {TARGET_BENEFICIARIES.map((item) => {
                const active = form.beneficiaries.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`inv-chip${active ? ' is-selected' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleBeneficiary(item)}
                  >
                    {active && <Check size={12} strokeWidth={3} />}
                    {item}
                  </button>
                );
              })}
            </div>
            {errors.beneficiaries && (
              <p className="inv-req-error" role="alert">{errors.beneficiaries}</p>
            )}
          </fieldset>

          <div className="inv-req-row">
            <div className="inv-req-field">
              <label htmlFor="inv-ben-count">Beneficiary Count</label>
              <div className={`inv-req-input ${errors.beneficiaryCount ? 'is-invalid' : ''}`}>
                <Users size={16} aria-hidden="true" />
                <input
                  id="inv-ben-count"
                  type="number"
                  min="1"
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
                <p className="inv-req-error" role="alert">{errors.beneficiaryCount}</p>
              )}
            </div>

            <div className="inv-req-field">
              <label htmlFor="inv-priority">Priority</label>
              <select
                id="inv-priority"
                value={form.priority}
                onChange={(e) => patch({ priority: e.target.value })}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="inv-req-row">
            <div className="inv-req-field">
              <label htmlFor="inv-date">Required Before Date</label>
              <div className={`inv-req-input ${errors.deliveryDate ? 'is-invalid' : ''}`}>
                <Calendar size={16} aria-hidden="true" />
                <input
                  id="inv-date"
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => {
                    patch({ deliveryDate: e.target.value });
                    if (errors.deliveryDate) {
                      setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
                    }
                  }}
                  aria-invalid={!!errors.deliveryDate}
                />
              </div>
              {errors.deliveryDate && (
                <p className="inv-req-error" role="alert">{errors.deliveryDate}</p>
              )}
            </div>

            <div className="inv-req-field">
              <label htmlFor="inv-loc">Delivery Location</label>
              <div className={`inv-req-input ${errors.location ? 'is-invalid' : ''}`}>
                <MapPin size={16} aria-hidden="true" />
                <input
                  id="inv-loc"
                  type="text"
                  placeholder="City / warehouse / drop point"
                  value={form.location}
                  onChange={(e) => {
                    patch({ location: e.target.value });
                    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="inv-req-error" role="alert">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="inv-req-field">
            <label htmlFor="inv-reason">Reason for Request</label>
            <div className={`inv-req-textarea ${errors.reason ? 'is-invalid' : ''}`}>
              <FileText size={16} aria-hidden="true" />
              <textarea
                id="inv-reason"
                rows={4}
                placeholder="Explain why these items are needed…"
                value={form.reason}
                onChange={(e) => {
                  patch({ reason: e.target.value });
                  if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
                }}
                aria-invalid={!!errors.reason}
              />
            </div>
            {errors.reason && (
              <p className="inv-req-error" role="alert">{errors.reason}</p>
            )}
          </div>

          <div className="inv-req-field">
            <label htmlFor="inv-notes">Special Instructions</label>
            <div className="inv-req-textarea">
              <MessageSquare size={16} aria-hidden="true" />
              <textarea
                id="inv-notes"
                rows={3}
                placeholder="Optional delivery or handling notes…"
                value={form.specialInstructions}
                onChange={(e) => patch({ specialInstructions: e.target.value })}
              />
            </div>
          </div>

          <div className="inv-req-actions">
            <button
              type="button"
              className="inv-btn inv-btn--secondary"
              onClick={() => navigate('/dashboard/ngo-inventory')}
            >
              Cancel
            </button>
            <button type="submit" className="inv-btn inv-btn--primary" disabled={!valid}>
              <Send size={16} />
              Submit Inventory Request
            </button>
          </div>
        </form>

        <LiveSummary item={inventoryItem} form={form} status={status} />
      </div>
    </div>
  );
}
