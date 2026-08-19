import { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock, FileText, Loader2, Shield, XCircle,
} from 'lucide-react';
import {
  approveVerification,
  getAdminVerificationDetail,
  listAdminVerifications,
  openVerificationDocument,
  rejectVerification,
  requestFieldUpdates,
  requestMoreDocuments,
  suspendVerification,
} from '../../api/verificationClient';
import {
  labelForKycFieldPath,
  pendingAdminDocumentRequests,
  pendingAdminFieldRequests,
  RECEIVER_KYC_ADMIN_FIELDS,
} from '../../data/receiverKycAdminFields';
import { useToast } from '../ui/Toast';
import RelativeTime from '../ui/RelativeTime';
import KycAdminPayloadView from './KycAdminPayloadView';
import KycAdminApplicantCard from './KycAdminApplicantCard';
import KycAdminFlowGuide from './KycAdminFlowGuide';

const TABS = [
  { id: 'UNDER_REVIEW', label: 'Pending review' },
  { id: 'RECEIVER', label: 'All receivers' },
  { id: 'NGO', label: 'NGOs' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'all', label: 'All' },
];

const REVIEWABLE = new Set([
  'UNDER_REVIEW',
  'MORE_DOCUMENTS_REQUIRED',
  'DOCUMENTS_SUBMITTED',
  'VALIDATION_IN_PROGRESS',
]);

function statusTone(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'VERIFIED') return 'ok';
  if (s === 'REJECTED' || s === 'SUSPENDED') return 'bad';
  if (s === 'MORE_DOCUMENTS_REQUIRED') return 'warn';
  return 'info';
}

function RiskFlags({ flags = [] }) {
  if (!flags?.length) return null;
  return (
    <ul className="kyc-admin-flags">
      {flags.map((f) => (
        <li key={f}><AlertTriangle size={14} /> {f.replace(/_/g, ' ')}</li>
      ))}
    </ul>
  );
}

function PendingAdminRequests({ payload }) {
  const fieldReqs = pendingAdminFieldRequests(payload);
  const docReqs = pendingAdminDocumentRequests(payload);
  if (!fieldReqs.length && !docReqs.length) return null;

  return (
    <div className="kyc-admin__section kyc-admin__section--pending">
      <h3>Outstanding receiver actions</h3>
      {fieldReqs.length > 0 && (
        <ul className="kyc-admin__pending-list">
          {fieldReqs.flatMap((r) =>
            (r.field_paths || []).map((path) => (
              <li key={`${r.requested_at}-${path}`}>
                <strong>Update field:</strong> {labelForKycFieldPath(path)}
                {r.reason && <em>{r.reason}</em>}
              </li>
            )),
          )}
        </ul>
      )}
      {docReqs.length > 0 && (
        <ul className="kyc-admin__pending-list">
          {docReqs.map((r) => (
            <li key={`${r.document_type}-${r.requested_at}`}>
              <strong>Upload:</strong> {r.document_type?.replace(/_/g, ' ')}
              {r.reason && <em>{r.reason}</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminKycReview() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('UNDER_REVIEW');
  const [queue, setQueue] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [docType, setDocType] = useState('SUPPORTING_PRIMARY');
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadQueue = () => {
    setLoading(true);
    const params = {};
    if (tab === 'NGO' || tab === 'RECEIVER') params.request_type = tab;
    else if (tab !== 'all') params.status = tab;
    listAdminVerifications(params)
      .then(setQueue)
      .catch(() => showToast('Could not load verification queue.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQueue(); }, [tab]);

  const openDetail = async (id) => {
    setSelectedId(id);
    setApprovalNote('');
    setRejectReason('');
    setRequestReason('');
    setSelectedFields([]);
    try {
      const data = await getAdminVerificationDetail(id);
      setDetail(data);
    } catch {
      showToast('Could not load verification detail.', 'error');
    }
  };

  const approve = async () => {
    if (!selectedId) return;
    setBusy(true);
    try {
      await approveVerification(selectedId, approvalNote.trim() || undefined);
      showToast(
        detail?.request_type === 'RECEIVER'
          ? 'Receiver KYC approved. They can now request assistance.'
          : 'Verification approved.',
        'success',
      );
      setDetail(null);
      setSelectedId(null);
      loadQueue();
    } catch (err) {
      showToast(err?.message || 'Approve failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!selectedId || !rejectReason.trim()) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    setBusy(true);
    try {
      await rejectVerification(selectedId, rejectReason.trim());
      showToast('Verification rejected. Receiver has been notified with your reason.', 'success');
      setDetail(null);
      setSelectedId(null);
      loadQueue();
    } catch (err) {
      showToast(err?.message || 'Reject failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const requestDocs = async () => {
    if (!selectedId || !docType || !requestReason.trim()) {
      showToast('Select a document type and explain what is needed.', 'error');
      return;
    }
    setBusy(true);
    try {
      await requestMoreDocuments(selectedId, {
        documentType: docType,
        reason: requestReason.trim(),
      });
      showToast('Document request sent to receiver.', 'success');
      setRequestReason('');
      openDetail(selectedId);
      loadQueue();
    } catch (err) {
      showToast(err?.message || 'Request failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const requestFields = async () => {
    if (!selectedId || !selectedFields.length) {
      showToast('Select at least one field to update.', 'error');
      return;
    }
    if (!requestReason.trim()) {
      showToast('Please explain why these fields need to be updated.', 'error');
      return;
    }
    setBusy(true);
    try {
      await requestFieldUpdates(selectedId, {
        fieldPaths: selectedFields,
        reason: requestReason.trim(),
      });
      showToast('Field update request sent to receiver.', 'success');
      setRequestReason('');
      setSelectedFields([]);
      openDetail(selectedId);
      loadQueue();
    } catch (err) {
      showToast(err?.message || 'Request failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const suspend = async () => {
    if (!selectedId || !rejectReason.trim()) {
      showToast('Suspension reason is required.', 'error');
      return;
    }
    setBusy(true);
    try {
      await suspendVerification(selectedId, rejectReason.trim());
      showToast('Receiver verification suspended.', 'success');
      setDetail(null);
      setSelectedId(null);
      loadQueue();
    } catch (err) {
      showToast(err?.message || 'Suspend failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const toggleField = (path) => {
    setSelectedFields((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const isReceiver = detail?.request_type === 'RECEIVER';
  const canReview = detail && REVIEWABLE.has(detail.status);

  return (
    <div className="kyc-admin page-route">
      <header className="kyc-admin__header">
        <div>
          <h1>Platform verification review</h1>
          <p>
            Review receiver identity, documents, and bank details. Approve to unlock assistance requests,
            or request specific field or document updates with clear reasons.
          </p>
        </div>
        <Shield size={28} aria-hidden="true" />
      </header>

      <KycAdminFlowGuide />

      <div className="kyc-admin__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={`kyc-admin__tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="kyc-admin__layout">
        <section className="kyc-admin__queue">
          <h3 className="kyc-admin__queue-title">Queue</h3>
          {loading ? (
            <p className="kyc-admin__loading"><Loader2 className="kyc-spin" size={18} /> Loading…</p>
          ) : !queue.length ? (
            <p className="kyc-admin__empty">
              {tab === 'UNDER_REVIEW'
                ? 'No pending KYC reviews. Receivers appear here after they submit verification.'
                : 'No verification requests in this view.'}
            </p>
          ) : (
            <ul className="kyc-admin__list">
              {queue.map((row) => (
                <li key={row.request_id}>
                  <button
                    type="button"
                    className={`kyc-admin__row${selectedId === row.request_id ? ' is-selected' : ''}`}
                    onClick={() => openDetail(row.request_id)}
                  >
                    <div className="kyc-admin__row-main">
                      <strong>{row.applicant_name || `User #${row.user_id}`}</strong>
                      <span>{row.reference_code || `VER-${row.request_id}`}</span>
                    </div>
                    <div className="kyc-admin__row-meta">
                      <span className="kyc-admin__type">{row.request_type}</span>
                      <span className={`kyc-admin__status kyc-admin__status--${statusTone(row.status)}`}>
                        {row.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="kyc-admin__detail">
          {!detail ? (
            <div className="kyc-admin__empty kyc-admin__empty--detail">
              <FileText size={32} aria-hidden="true" />
              <p>Select a verification from the queue to review documents and approve or reject.</p>
            </div>
          ) : (
            <>
              <header className="kyc-admin__detail-head">
                <div>
                  <h2>{detail.reference_code}</h2>
                  <p className="kyc-admin__detail-sub">
                    {detail.request_type} · User #{detail.user_id}
                  </p>
                </div>
                <div className="kyc-admin__detail-badges">
                  <span className={`kyc-admin__status kyc-admin__status--${statusTone(detail.status)}`}>
                    {detail.status?.replace(/_/g, ' ')}
                  </span>
                  {detail.submitted_at && (
                    <span className="kyc-admin__submitted">
                      Submitted <RelativeTime value={detail.submitted_at} />
                    </span>
                  )}
                </div>
              </header>

              <RiskFlags flags={detail.risk_flags} />

              <KycAdminApplicantCard
                applicant={detail.applicant}
                payload={detail.payload}
                requestType={detail.request_type}
              />

              <PendingAdminRequests payload={detail.payload} />

              <div className="kyc-admin__section">
                <h3>Submitted information</h3>
                <KycAdminPayloadView payload={detail.payload} requestType={detail.request_type} />
              </div>

              <div className="kyc-admin__section">
                <h3>Uploaded documents ({detail.documents?.length || 0})</h3>
                {!detail.documents?.length ? (
                  <p className="kyc-admin__empty">No documents uploaded.</p>
                ) : (
                  <ul className="kyc-admin__doc-grid">
                    {(detail.documents || []).map((doc) => (
                      <li key={doc.document_id} className="kyc-admin__doc-card">
                        <div className="kyc-admin__doc-card-icon" aria-hidden="true">
                          <FileText size={18} />
                        </div>
                        <div className="kyc-admin__doc-card-body">
                          <strong>{doc.document_type?.replace(/_/g, ' ')}</strong>
                          <span>{doc.original_filename || 'Document'}</span>
                          <small>{doc.verification_status || 'Pending review'}</small>
                        </div>
                        <button
                          type="button"
                          className="kyc-admin__doc-view"
                          onClick={() => openVerificationDocument(detail.request_id, doc.document_id)}
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {detail.history?.length > 0 && (
                <div className="kyc-admin__section">
                  <h3>Status history</h3>
                  <ul className="kyc-admin__history">
                    {(detail.history || []).map((h) => (
                      <li key={h.history_id}>
                        <Clock size={14} />
                        <RelativeTime value={h.changed_at} />
                        <span>{h.status}</span>
                        {h.note && <em>{h.note}</em>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {canReview && (
                <div className="kyc-admin__decision">
                  <h3>Admin decision</h3>
                  {isReceiver && (
                    <p className="kyc-admin__decision-hint">
                      Approve to unlock <strong>Request Assistance</strong>, or request specific updates with reasons.
                    </p>
                  )}

                  <div className="kyc-admin__decision-grid">
                    <div className="kyc-admin__decision-card kyc-admin__decision-card--approve">
                      <h4><CheckCircle2 size={18} /> Approve</h4>
                      <label className="kyc-field">
                        <span>Approval note (optional)</span>
                        <textarea
                          className="kyc-admin__reason"
                          placeholder="e.g. Documents verified. KYC approved."
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                          rows={2}
                        />
                      </label>
                      <button
                        type="button"
                        className="kyc-btn kyc-btn--success kyc-admin__approve-btn"
                        onClick={approve}
                        disabled={busy}
                      >
                        <CheckCircle2 size={18} />
                        {isReceiver ? 'Approve KYC' : 'Approve verification'}
                      </button>
                    </div>

                    <div className="kyc-admin__decision-card kyc-admin__decision-card--reject">
                      <h4><XCircle size={18} /> Reject</h4>
                      <label className="kyc-field">
                        <span>Rejection reason (required)</span>
                        <textarea
                          className="kyc-admin__reason"
                          placeholder="Explain why this KYC cannot be approved"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={3}
                        />
                      </label>
                      <button type="button" className="kyc-btn kyc-btn--danger" onClick={reject} disabled={busy}>
                        Reject KYC
                      </button>
                    </div>
                  </div>

                  <div className="kyc-admin__decision-card kyc-admin__decision-card--request">
                    <h4>Request updates from receiver</h4>
                    <p className="kyc-admin__decision-hint">
                      Select fields or a document type and explain what needs to change.
                    </p>

                    {isReceiver && (
                      <div className="kyc-admin__field-picker">
                        <span className="kyc-admin__field-picker-label">Fields to update</span>
                        <div className="kyc-admin__field-chips">
                          {RECEIVER_KYC_ADMIN_FIELDS.map((field) => (
                            <button
                              key={field.path}
                              type="button"
                              className={`kyc-admin__field-chip${selectedFields.includes(field.path) ? ' is-selected' : ''}`}
                              onClick={() => toggleField(field.path)}
                            >
                              {field.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <label className="kyc-field">
                      <span>Additional document (optional)</span>
                      <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                        <option value="">— None —</option>
                        <option value="MEDICAL_REPORT">Medical report</option>
                        <option value="HOSPITAL_ESTIMATE">Hospital estimate</option>
                        <option value="ADDRESS_PROOF">Address proof</option>
                        <option value="BANK_PROOF">Bank proof</option>
                        <option value="RELATIONSHIP_PROOF">Relationship proof</option>
                        <option value="ID_FRONT">Identity document</option>
                        <option value="SUPPORTING_PRIMARY">Supporting document</option>
                      </select>
                    </label>

                    <label className="kyc-field">
                      <span>Reason / instructions for receiver (required)</span>
                      <textarea
                        className="kyc-admin__reason"
                        placeholder="Explain what is wrong and what the receiver should provide or correct"
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                        rows={3}
                      />
                    </label>

                    <div className="kyc-admin__action-btns">
                      {isReceiver && (
                        <button
                          type="button"
                          className="kyc-btn kyc-btn--secondary"
                          onClick={requestFields}
                          disabled={busy || !selectedFields.length}
                        >
                          Request field updates
                        </button>
                      )}
                      <button
                        type="button"
                        className="kyc-btn kyc-btn--secondary"
                        onClick={requestDocs}
                        disabled={busy || !docType}
                      >
                        Request document only
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {detail.status === 'VERIFIED' && isReceiver && (
                <div className="kyc-admin__decision kyc-admin__decision--verified">
                  <CheckCircle2 size={20} />
                  <p>This receiver is verified and can request assistance. Review individual requests in Assistance Review.</p>
                  {detail.history?.find((h) => h.status === 'VERIFIED')?.note && (
                    <p className="kyc-admin__approval-note">
                      Approval note: {detail.history.find((h) => h.status === 'VERIFIED')?.note}
                    </p>
                  )}
                </div>
              )}

              {detail.status === 'VERIFIED' && !isReceiver && (
                <div className="kyc-admin__actions">
                  <textarea
                    className="kyc-admin__reason"
                    placeholder="Suspension reason (required)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                  />
                  <button type="button" className="kyc-btn kyc-btn--danger" onClick={suspend} disabled={busy}>
                    Suspend verification
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
