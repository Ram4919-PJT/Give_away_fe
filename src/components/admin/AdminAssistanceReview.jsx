import { useEffect, useState } from 'react';
import {
  ClipboardList, CheckCircle2, XCircle, Clock, User, IndianRupee,
  FileText, AlertCircle,
} from 'lucide-react';
import {
  listAdminAssistanceQueue,
  getAdminAssistanceDetail,
  reviewAdminAssistance,
  disburseAdminAssistance,
  assistanceStatusLabel,
  assistanceStatusBadgeClass,
  payoutStatusLabel,
  formatInr,
} from '../../api/assistanceClient';
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
    { label: 'Receiver submits request', done: true },
    { label: 'Admin reviews details', active: true },
    { label: 'Approved funds are disbursed', done: false },
  ];
  return (
    <div className="idw-admin__workflow" aria-label="Assistance review workflow">
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

export default function AdminAssistanceReviewView() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [disburseRef, setDisburseRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadQueue = () => {
    setLoading(true);
    listAdminAssistanceQueue()
      .then(setQueue)
      .catch(() => showToast('Could not load assistance requests.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQueue(); }, []);

  const openDetail = async (id) => {
    setSelectedId(id);
    try {
      const app = await getAdminAssistanceDetail(id);
      setSelected(app);
      setReason('');
      setDisburseRef('');
      setApprovedAmount(String(app.amount_requested || ''));
    } catch {
      showToast('Could not load request details.', 'error');
    }
  };

  const review = async (action) => {
    if (!selected) return;
    if (action === 'reject' && !reason.trim()) {
      showToast('Please enter a rejection reason.', 'error');
      return;
    }
    if (action === 'approve') {
      const amt = Number(String(approvedAmount).replace(/[^\d.]/g, ''));
      if (!amt || amt <= 0) {
        showToast('Enter a valid approved amount.', 'error');
        return;
      }
    }
    setBusy(true);
    try {
      await reviewAdminAssistance(selected.application_id, {
        action,
        approved_amount: action === 'approve'
          ? Number(String(approvedAmount).replace(/[^\d.]/g, ''))
          : undefined,
        rejection_reason: action === 'reject' ? reason.trim() : undefined,
      });
      const messages = {
        approve: 'Request approved. Receiver has been notified.',
        reject: 'Request rejected. Receiver has been notified.',
        under_review: 'Request marked as under review.',
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

  const disburse = async () => {
    if (!selected || !disburseRef.trim()) {
      showToast('Enter UTR / transaction reference.', 'error');
      return;
    }
    setBusy(true);
    try {
      await disburseAdminAssistance(selected.application_id, {
        disbursementReference: disburseRef.trim(),
        note: reason.trim() || undefined,
      });
      showToast('Disbursement recorded. Receiver notified.', 'success');
      setSelected(null);
      setSelectedId(null);
      loadQueue();
    } catch (e) {
      showToast(e?.message || 'Disbursement failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const canApprove = selected?.receiver_verification_status === 'VERIFIED';
  const canDisburse = selected?.status === 'APPROVED'
    && ['READY_FOR_DISBURSEMENT', 'BANK_DETAILS_SUBMITTED'].includes(selected?.payout_status);

  return (
    <IdwPage className="page-route idw-admin" maxWidth="1180px">
      <IdwPageHeader
        title="Financial Assistance Review"
        subtitle="Review receiver financial assistance requests and approve or reject based on verification."
      />

      <WorkflowSteps />

      {loading && <IdwLoading label="Loading assistance requests…" />}

      {!loading && (
        <div className="idw-admin__layout">
          <IdwCard className="idw-admin__list-wrap" padding={false}>
            <div className="idw-admin__list-head">
              <strong>Review queue</strong>
              <span className="idw-badge idw-badge--pending">{queue.length}</span>
            </div>
            <div className="idw-admin__list">
              {queue.map((app) => (
                <button
                  key={app.application_id}
                  type="button"
                  className={`idw-admin__row ${selectedId === app.application_id ? 'idw-admin__row--active' : ''}`}
                  onClick={() => openDetail(app.application_id)}
                >
                  <div className="idw-admin__row-main">
                    <strong>{app.category || 'Financial Assistance'}</strong>
                    <small>{app.purpose?.slice(0, 72)}{(app.purpose?.length || 0) > 72 ? '…' : ''}</small>
                    <small className="idw-admin__row-meta">
                      <Clock size={12} aria-hidden="true" />
                      {formatWhen(app.submitted_at)}
                    </small>
                  </div>
                  <span className={assistanceStatusBadgeClass(app.status)}>
                    {assistanceStatusLabel(app.status)}
                  </span>
                </button>
              ))}
              {queue.length === 0 && (
                <div className="idw-admin__list-empty">
                  <ClipboardList size={28} aria-hidden="true" />
                  <p>All caught up — no assistance requests waiting for review.</p>
                </div>
              )}
            </div>
          </IdwCard>

          {selected ? (
            <IdwCard className="idw-admin__detail">
              <div className="idw-admin__detail-head">
                <div>
                  <h2>{selected.category || 'Financial Assistance Request'}</h2>
                  <p className="idw-admin__detail-sub">
                    Request #{selected.application_id} · Submitted {formatWhen(selected.submitted_at)}
                  </p>
                </div>
                <span className={assistanceStatusBadgeClass(selected.status)}>
                  {assistanceStatusLabel(selected.status)}
                </span>
              </div>

              <div className="idw-admin__donor-strip">
                <User size={16} aria-hidden="true" />
                <span>{selected.receiver_name || 'Receiver'}</span>
                {selected.receiver_email && <em>{selected.receiver_email}</em>}
                {selected.receiver_verification_status === 'VERIFIED' && (
                  <span className="idw-badge idw-badge--approved">Verified receiver</span>
                )}
              </div>

              <p className="idw-detail-page__desc">{selected.purpose}</p>

              <div className="idw-admin__detail-grid">
                <div><IndianRupee size={15} /><span>Requested</span><strong>{formatInr(selected.amount_requested)}</strong></div>
                {selected.amount_approved != null && (
                  <div><span>Approved</span><strong>{formatInr(selected.amount_approved)}</strong></div>
                )}
                <div><FileText size={15} /><span>Category</span><strong>{selected.category || '—'}</strong></div>
                <div><span>Mobile</span><strong>{selected.receiver_mobile || '—'}</strong></div>
                {selected.payout_status && (
                  <div><span>Payout</span><strong>{payoutStatusLabel(selected.payout_status)}</strong></div>
                )}
              </div>

              {selected.bank_account_holder && (
                <div className="idw-admin__notes">
                  <strong>Bank details</strong>
                  <p>
                    {selected.bank_account_holder} · {selected.bank_name} · IFSC {selected.bank_ifsc}
                    {selected.bank_account_last4 ? ` · ****${selected.bank_account_last4}` : ''}
                  </p>
                </div>
              )}

              {selected.disbursement_reference && (
                <div className="idw-admin__notes">
                  <strong>Disbursement reference</strong>
                  <p>{selected.disbursement_reference}</p>
                </div>
              )}

              {selected.expense_breakdown && (
                <div className="idw-admin__notes">
                  <strong>Expense breakdown</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selected.expense_breakdown}</p>
                </div>
              )}

              {selected.notes && (
                <div className="idw-admin__notes">
                  <strong>Additional notes</strong>
                  <p>{selected.notes}</p>
                </div>
              )}

              {selected.receiver_verification_status !== 'VERIFIED' && (
                <div className="idw-alert idw-alert--error idw-alert--compact">
                  <AlertCircle size={16} />
                  <p>Receiver must complete KYC verification before this request can be approved.</p>
                </div>
              )}

              {['SUBMITTED', 'UNDER_REVIEW', 'PENDING_REVIEW', 'OPEN'].includes(selected.status) && (
              <div className="idw-admin__form">
                <label className="idw-field">
                  <span className="idw-field__label">Approved amount (INR)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    placeholder="Amount to approve"
                  />
                </label>
                <label className="idw-field">
                  <span className="idw-field__label">Rejection reason</span>
                  <textarea
                    rows={2}
                    placeholder="Required if rejecting this request…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
              </div>
              )}

              {['SUBMITTED', 'UNDER_REVIEW', 'PENDING_REVIEW', 'OPEN'].includes(selected.status) && (
              <div className="idw-admin__actions">
                <button
                  type="button"
                  className="dd-btn btn-sm-card"
                  disabled={busy || !canApprove}
                  title={!canApprove ? 'Receiver KYC must be verified first' : undefined}
                  onClick={() => review('approve')}
                >
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button type="button" className="btn-outline btn-sm-card" disabled={busy} onClick={() => review('under_review')}>
                  <Clock size={16} /> Mark under review
                </button>
                <button type="button" className="idw-btn-danger btn-sm-card" disabled={busy} onClick={() => review('reject')}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
              )}

              {canDisburse && (
                <div className="idw-admin__form idw-admin__form--disburse">
                  <strong>Record disbursement</strong>
                  <label className="idw-field">
                    <span className="idw-field__label">UTR / transaction reference</span>
                    <input
                      type="text"
                      value={disburseRef}
                      onChange={(e) => setDisburseRef(e.target.value)}
                      placeholder="e.g. UTR1234567890"
                    />
                  </label>
                  <button type="button" className="dd-btn btn-sm-card" disabled={busy} onClick={disburse}>
                    <CheckCircle2 size={16} /> Mark as disbursed
                  </button>
                </div>
              )}
            </IdwCard>
          ) : (
            <IdwCard className="idw-admin__placeholder">
              <IdwEmpty
                icon={ClipboardList}
                title="Select a request to review"
                description="Open a pending financial assistance request to review purpose, amount, and receiver details."
              />
            </IdwCard>
          )}
        </div>
      )}
    </IdwPage>
  );
}
