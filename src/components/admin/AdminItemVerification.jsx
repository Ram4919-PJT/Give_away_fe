import { useEffect, useState } from 'react';
import {
  ClipboardList, CheckCircle2, XCircle, MessageSquare, Clock,
  User, MapPin, Package, ImageIcon, AlertCircle
} from 'lucide-react';
import {
  getAdminItemDetail,
  listAdminItemQueue,
  reviewAdminItem,
  statusBadgeClass,
  statusLabel,
} from '../../api/itemDonationClient';
import { useToast } from '../ui/Toast';
import { IdwCard, IdwEmpty, IdwLoading, IdwPage, IdwPageHeader } from '../donor/item-donations/ItemDonationUi';

function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

function WorkflowSteps() {
  const steps = [
    { label: 'Donor submits item + photos', done: true },
    { label: 'Admin reviews details', active: true },
    { label: 'Approved items go live for receivers', done: false },
  ];
  return (
    <div className="idw-admin__workflow" aria-label="Verification workflow">
      {steps.map((step, i) => (
        <div
          key={step.label}
          className={`idw-admin__workflow-step${step.active ? ' is-active' : ''}${step.done ? ' is-done' : ''}`}
        >
          <span className="idw-admin__workflow-num">{i + 1}</span>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminItemVerificationView() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState('');
  const [changeComment, setChangeComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadQueue = () => {
    setLoading(true);
    listAdminItemQueue()
      .then(setQueue)
      .catch(() => showToast('Could not load verification queue.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQueue(); }, []);

  const openDetail = async (id) => {
    setSelectedId(id);
    try {
      const item = await getAdminItemDetail(id);
      setSelected(item);
      setReason('');
      setChangeComment('');
    } catch {
      showToast('Could not load item details.', 'error');
    }
  };

  const review = async (action) => {
    if (!selected) return;
    if (action === 'reject' && !reason.trim()) {
      showToast('Please enter a rejection reason.', 'error');
      return;
    }
    if (action === 'request_changes' && !changeComment.trim()) {
      showToast('Please describe the changes required.', 'error');
      return;
    }
    setBusy(true);
    try {
      await reviewAdminItem(selected.item_donation_id, {
        action,
        rejection_reason: action === 'reject' ? reason.trim() : undefined,
        change_comment: action === 'request_changes' ? changeComment.trim() : undefined,
      });
      const messages = {
        approve: 'Item approved — now visible to receivers.',
        reject: 'Item rejected. Donor has been notified.',
        request_changes: 'Change request sent to donor.',
      };
      showToast(messages[action] || 'Review saved.', 'success');
      setSelected(null);
      setSelectedId(null);
      loadQueue();
    } catch (e) {
      showToast(e?.message || 'Review failed. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <IdwPage className="page-route idw-admin" maxWidth="1180px">
      <IdwPageHeader
        title="Item Verification Queue"
        subtitle="Review donor-submitted items and photos before they appear to receivers."
      />

      <WorkflowSteps />

      {loading && <IdwLoading label="Loading verification queue…" />}

      {!loading && (
        <div className="idw-admin__layout">
          <IdwCard className="idw-admin__list-wrap" padding={false}>
            <div className="idw-admin__list-head">
              <strong>Pending review</strong>
              <span className="idw-badge idw-badge--pending">{queue.length}</span>
            </div>
            <div className="idw-admin__list">
              {queue.map((item) => (
                <button
                  key={item.item_donation_id}
                  type="button"
                  className={`idw-admin__row ${selectedId === item.item_donation_id ? 'idw-admin__row--active' : ''}`}
                  onClick={() => openDetail(item.item_donation_id)}
                >
                  <div className="idw-admin__row-main">
                    <strong>{item.item_name || item.category}</strong>
                    <small>{item.category} · Qty {item.quantity}</small>
                    <small className="idw-admin__row-meta">
                      <Clock size={12} aria-hidden="true" />
                      {formatWhen(item.submitted_at)}
                    </small>
                  </div>
                  <span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
                </button>
              ))}
              {queue.length === 0 && (
                <div className="idw-admin__list-empty">
                  <ClipboardList size={28} aria-hidden="true" />
                  <p>All caught up — no items waiting for review.</p>
                </div>
              )}
            </div>
          </IdwCard>

          {selected ? (
            <IdwCard className="idw-admin__detail">
              <div className="idw-admin__detail-head">
                <div>
                  <h2>{selected.item_name}</h2>
                  <p className="idw-admin__detail-sub">
                    Submitted {formatWhen(selected.submitted_at)}
                  </p>
                </div>
                <span className={statusBadgeClass(selected.status)}>{statusLabel(selected.status)}</span>
              </div>

              <div className="idw-admin__donor-strip">
                <User size={16} aria-hidden="true" />
                <span>{selected.donor_name || 'Donor'}</span>
                {selected.donor_email && <em>{selected.donor_email}</em>}
                {selected.donor_verified && (
                  <span className="idw-badge idw-badge--approved">Verified donor</span>
                )}
              </div>

              <p className="idw-detail-page__desc">{selected.description}</p>

              <div className="idw-admin__detail-grid">
                <div><Package size={15} /><span>Category</span><strong>{selected.category}</strong></div>
                <div><span>Condition</span><strong>{(selected.condition || '—').replace(/_/g, ' ')}</strong></div>
                <div><span>Quantity</span><strong>{selected.quantity}</strong></div>
                <div><MapPin size={15} /><span>Location</span><strong>{[selected.display_city, selected.display_state].filter(Boolean).join(', ') || '—'}</strong></div>
                {selected.brand && <div><span>Brand</span><strong>{selected.brand}</strong></div>}
                {selected.urgency && <div><span>Urgency</span><strong>{selected.urgency}</strong></div>}
              </div>

              {(selected.photo_urls || []).length > 0 ? (
                <div className="idw-admin__photos">
                  <h3><ImageIcon size={16} /> Item photos ({selected.photo_urls.length})</h3>
                  <div className="idw-photo-grid idw-photo-grid--admin">
                    {selected.photo_urls.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="idw-photo-thumb idw-photo-thumb--link">
                        <img src={url} alt="Item photo" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="idw-alert idw-alert--error idw-alert--compact">
                  <AlertCircle size={16} />
                  <p>No photos attached — consider requesting changes from the donor.</p>
                </div>
              )}

              {selected.additional_notes && (
                <div className="idw-admin__notes">
                  <strong>Donor notes</strong>
                  <p>{selected.additional_notes}</p>
                </div>
              )}

              <div className="idw-admin__form">
                <label className="idw-field">
                  <span className="idw-field__label">Rejection reason</span>
                  <textarea
                    rows={2}
                    placeholder="Required if rejecting this item…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <label className="idw-field">
                  <span className="idw-field__label">Request changes</span>
                  <textarea
                    rows={2}
                    placeholder="Describe what the donor should update…"
                    value={changeComment}
                    onChange={(e) => setChangeComment(e.target.value)}
                  />
                </label>
              </div>

              <div className="idw-admin__actions">
                <button type="button" className="dd-btn btn-sm-card" disabled={busy} onClick={() => review('approve')}>
                  <CheckCircle2 size={16} /> Approve & publish
                </button>
                <button type="button" className="btn-outline btn-sm-card" disabled={busy} onClick={() => review('request_changes')}>
                  <MessageSquare size={16} /> Request changes
                </button>
                <button type="button" className="idw-btn-danger btn-sm-card" disabled={busy} onClick={() => review('reject')}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </IdwCard>
          ) : (
            <IdwCard className="idw-admin__placeholder">
              <IdwEmpty
                icon={ClipboardList}
                title="Select an item to review"
                description="Open a pending submission to inspect photos, donor details, and approve or reject."
              />
            </IdwCard>
          )}
        </div>
      )}
    </IdwPage>
  );
}
