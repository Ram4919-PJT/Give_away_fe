import { useState } from 'react';
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import {
  deleteVerificationDocument,
  openVerificationDocument,
  uploadVerificationDocument,
} from '../../../api/verificationClient';

const DEFAULT_MAX_MB = 10;

export default function DonorDocumentUploadCard({
  requestId,
  documentType,
  label,
  description,
  required,
  uploaded,
  onUpdated,
  maxBytes = DEFAULT_MAX_MB * 1024 * 1024,
  accept = '.pdf,.jpg,.jpeg,.png',
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = async (file) => {
    if (!file || !requestId) return;
    if (file.size > maxBytes) {
      setError(`File must be under ${Math.round(maxBytes / (1024 * 1024))} MB`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadVerificationDocument(requestId, documentType, file);
      onUpdated?.(updated);
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || busy) return;
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const onRemove = async () => {
    if (!uploaded?.document_id || !requestId) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await deleteVerificationDocument(requestId, uploaded.document_id);
      onUpdated?.(updated);
    } catch (err) {
      setError(err?.message || 'Could not remove file');
    } finally {
      setBusy(false);
    }
  };

  const onPreview = async () => {
    if (!uploaded?.document_id || !requestId) return;
    try {
      await openVerificationDocument(requestId, uploaded.document_id);
    } catch (err) {
      setError(err?.message || 'Could not open document');
    }
  };

  const docStatus = uploaded?.verification_status;
  const isRejected = docStatus === 'REJECTED';
  const isApproved = docStatus === 'APPROVED' || docStatus === 'VERIFIED';

  return (
    <article className={`donor-v-doc-card${uploaded ? ' donor-v-doc-card--uploaded' : ''}`}>
      <header className="donor-v-doc-card__head">
        <div className="donor-v-doc-card__icon-wrap" aria-hidden="true">
          <Upload size={18} />
        </div>
        <div>
          <h3 className="donor-v-doc-card__title">
            {label}
            {required ? <span className="donor-v-doc-card__req">*</span> : null}
            {!required && <span className="donor-v-doc-card__opt">(Optional)</span>}
          </h3>
          {description && <p className="donor-v-doc-card__desc">{description}</p>}
        </div>
      </header>

      {!uploaded ? (
        <label
          className={`donor-v-doc-card__drop${dragOver ? ' is-dragover' : ''}${disabled ? ' is-disabled' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={onFile}
            disabled={disabled || busy || !requestId}
            className="donor-v-doc-card__input"
          />
          {busy ? (
            <Loader2 size={28} className="donor-v-spin" aria-hidden="true" />
          ) : (
            <Upload size={28} strokeWidth={1.5} aria-hidden="true" />
          )}
          <span className="donor-v-doc-card__drop-title">
            {busy ? 'Uploading…' : 'Click to upload or drag and drop'}
          </span>
          <span className="donor-v-doc-card__drop-hint">PDF, JPG, JPEG, PNG (Max {DEFAULT_MAX_MB}MB)</span>
        </label>
      ) : (
        <div className="donor-v-doc-card__done">
          <div className="donor-v-doc-card__done-row">
            <CheckCircle2 size={18} className="donor-v-doc-card__check" aria-hidden="true" />
            <div>
              <p className="donor-v-doc-card__filename">{uploaded.original_filename || 'File uploaded'}</p>
              <p className="donor-v-doc-card__status">
                {isRejected ? 'Rejected' : isApproved ? 'Approved' : 'File uploaded'}
              </p>
              {uploaded.rejection_reason && (
                <p className="donor-v-doc-card__reject-reason">{uploaded.rejection_reason}</p>
              )}
            </div>
          </div>
          {!disabled && (
            <div className="donor-v-doc-card__actions">
              <button type="button" className="donor-v-doc-action" onClick={onPreview}>View</button>
              <label className="donor-v-doc-action donor-v-doc-action--label">
                Replace
                <input type="file" accept={accept} onChange={onFile} disabled={busy} hidden />
              </label>
              <button type="button" className="donor-v-doc-action donor-v-doc-action--muted" onClick={onRemove} disabled={busy}>
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="donor-v-doc-card__error" role="alert">{error}</p>}
    </article>
  );
}
