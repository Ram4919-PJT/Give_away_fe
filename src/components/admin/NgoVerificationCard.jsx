import { useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  X,
  FileText,
  ExternalLink,
  Download,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { NGO_REJECTION_REASONS, CUSTOM_REJECTION_OPTION } from '../../data/adminConstants';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function StatusPill({ status }) {
  const map = {
    Pending: 'admin-verify-pill--pending',
    Verified: 'admin-verify-pill--approved',
    Rejected: 'admin-verify-pill--rejected'
  };
  return <span className={`admin-verify-pill ${map[status] || ''}`}>{status}</span>;
}

export default function NgoVerificationCard({ verification, onApprove, onReject }) {
  const { showToast } = useToast();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState(NGO_REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const isPending = verification.status === 'Pending';
  const documents = verification.documents?.length
    ? verification.documents
    : [{ label: verification.doc || 'Submitted Document', filename: verification.doc || 'document.pdf' }];

  const handleApprove = () => {
    onApprove(verification.id);
    setShowRejectForm(false);
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
    setRejectReason(NGO_REJECTION_REASONS[0]);
    setCustomReason('');
  };

  const handleConfirmReject = () => {
    const reason = rejectReason === CUSTOM_REJECTION_OPTION
      ? customReason.trim()
      : rejectReason;

    if (!reason) {
      showToast('Please provide a rejection reason.', 'error');
      return;
    }

    onReject(verification.id, reason);
    setShowRejectForm(false);
    setCustomReason('');
  };

  const handleViewDocument = (filename) => {
    showToast(`Opening ${filename} in document viewer (demo).`, 'info');
  };

  return (
    <article className="admin-verify-card">
      <div className="admin-verify-card__body">
        <section className="admin-verify-profile">
          <div className="admin-verify-profile__head">
            <div className="admin-verify-profile__icon" aria-hidden="true">
              <Building2 size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 className="admin-verify-profile__name">{verification.name}</h2>
              <StatusPill status={verification.status} />
            </div>
          </div>

          <dl className="admin-verify-meta">
            <div className="admin-verify-meta__row">
              <dt>Registration ID</dt>
              <dd>{verification.registrationId || '—'}</dd>
            </div>
            <div className="admin-verify-meta__row">
              <dt>Contact Email</dt>
              <dd>{verification.email}</dd>
            </div>
            <div className="admin-verify-meta__row">
              <dt>Submission Date</dt>
              <dd>
                <Calendar size={14} aria-hidden="true" />
                {formatDate(verification.submitted)}
              </dd>
            </div>
            {verification.reviewedAt && (
              <div className="admin-verify-meta__row">
                <dt>Reviewed On</dt>
                <dd>{formatDate(verification.reviewedAt)}</dd>
              </div>
            )}
            {verification.rejectionReason && (
              <div className="admin-verify-meta__row admin-verify-meta__row--reject">
                <dt>Rejection Reason</dt>
                <dd>{verification.rejectionReason}</dd>
              </div>
            )}
          </dl>

          <div className="admin-verify-docs">
            <h3 className="admin-verify-docs__title">Submitted Documents</h3>
            <ul className="admin-verify-docs__list">
              {documents.map((doc) => (
                <li key={doc.filename} className="admin-verify-doc-item">
                  <div className="admin-verify-doc-item__info">
                    <span className="admin-verify-doc-item__icon" aria-hidden="true">
                      <FileText size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="admin-verify-doc-item__label">{doc.label}</p>
                      <p className="admin-verify-doc-item__file">{doc.filename}</p>
                    </div>
                  </div>
                  <div className="admin-verify-doc-item__actions">
                    <button
                      type="button"
                      className="admin-verify-doc-btn"
                      onClick={() => handleViewDocument(doc.filename)}
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      View
                    </button>
                    <button
                      type="button"
                      className="admin-verify-doc-btn admin-verify-doc-btn--ghost"
                      onClick={() => showToast(`Downloading ${doc.filename} (demo).`, 'info')}
                    >
                      <Download size={15} aria-hidden="true" />
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="admin-verify-actions">
          {isPending ? (
            <>
              <p className="admin-verify-actions__label">Review Decision</p>
              <button
                type="button"
                className="admin-verify-btn admin-verify-btn--approve"
                onClick={handleApprove}
              >
                <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                Approve Verification
              </button>
              <button
                type="button"
                className="admin-verify-btn admin-verify-btn--reject"
                onClick={handleRejectClick}
              >
                <X size={18} strokeWidth={2.5} aria-hidden="true" />
                Reject Application
              </button>

              {showRejectForm && (
                <div className="admin-verify-reject-panel">
                  <label htmlFor={`reject-reason-${verification.id}`} className="admin-verify-reject-panel__label">
                    Rejection Reason
                  </label>
                  <select
                    id={`reject-reason-${verification.id}`}
                    className="admin-verify-reject-select"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    {NGO_REJECTION_REASONS.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>

                  {rejectReason === CUSTOM_REJECTION_OPTION && (
                    <textarea
                      className="admin-verify-reject-textarea"
                      rows={3}
                      placeholder="Enter a clear reason for the NGO..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                  )}

                  <button
                    type="button"
                    className="admin-verify-btn admin-verify-btn--confirm-reject"
                    onClick={handleConfirmReject}
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </>
          ) : verification.status === 'Verified' ? (
            <div className="admin-verify-resolved admin-verify-resolved--approved">
              <ShieldCheck size={28} aria-hidden="true" />
              <strong>Verification Approved</strong>
              <p>This NGO partner has been verified and can access all platform features.</p>
            </div>
          ) : (
            <div className="admin-verify-resolved admin-verify-resolved--rejected">
              <AlertCircle size={28} aria-hidden="true" />
              <strong>Application Rejected</strong>
              <p>{verification.rejectionReason || 'This application was rejected.'}</p>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

export function AdminVerifyQueueItem({ verification, active, onSelect }) {
  return (
    <button
      type="button"
      className={`admin-verify-queue-item ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(verification.id)}
    >
      <span className="admin-verify-queue-item__name">{verification.name}</span>
      <span className="admin-verify-queue-item__meta">
        <Clock size={13} aria-hidden="true" />
        {formatDate(verification.submitted)}
      </span>
      <StatusPill status={verification.status} />
    </button>
  );
}
