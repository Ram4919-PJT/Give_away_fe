import { useState } from 'react';
import { CheckCircle2, Loader2, Upload } from 'lucide-react';
import {
  deleteAssistanceDocument,
  openAssistanceDocument,
  uploadAssistanceDocument,
} from '../../api/applicationClient';
import { ALLOWED_UPLOAD_HINT, MAX_DOC_BYTES } from '../../data/receiverApplyConfig';

export default function AssistanceDocumentUploadCard({
  applicationId,
  documentType,
  label,
  required,
  uploaded,
  onUpdated,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !applicationId) return;
    if (file.size > MAX_DOC_BYTES) {
      setError('File must be 5 MB or smaller');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadAssistanceDocument(applicationId, documentType, file);
      onUpdated?.(updated);
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const onRemove = async () => {
    if (!uploaded?.document_id || !applicationId) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await deleteAssistanceDocument(applicationId, uploaded.document_id);
      onUpdated?.(updated);
    } catch (err) {
      setError(err?.message || 'Could not remove file');
    } finally {
      setBusy(false);
    }
  };

  const onPreview = async () => {
    if (!uploaded?.document_id || !applicationId) return;
    try {
      await openAssistanceDocument(applicationId, uploaded.document_id);
    } catch (err) {
      setError(err?.message || 'Preview failed');
    }
  };

  return (
    <div className={`kyc-doc-card${uploaded ? ' kyc-doc-card--done' : ''}`}>
      <div className="kyc-doc-card__head">
        <strong>{label}{required ? ' *' : ''}</strong>
        <span className={`kyc-doc-card__tag${required ? '' : ' kyc-doc-card__tag--optional'}`}>
          {required ? 'Required' : 'Optional'}
        </span>
      </div>
      <p className="kyc-doc-card__hint">{ALLOWED_UPLOAD_HINT}</p>

      {!uploaded ? (
        <label className="kyc-doc-card__drop">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFile} disabled={busy || !applicationId} />
          {busy ? <Loader2 size={20} className="kyc-spin" /> : <Upload size={20} />}
          <span>{busy ? 'Uploading…' : applicationId ? 'Browse or drag file here' : 'Complete previous steps first'}</span>
        </label>
      ) : (
        <div className="kyc-doc-card__uploaded">
          <CheckCircle2 size={18} />
          <span>{uploaded.original_filename || 'Document uploaded'}</span>
          <div className="kyc-doc-card__actions">
            <button type="button" className="kyc-doc-card__link" onClick={onPreview}>Preview</button>
            <button type="button" className="kyc-doc-card__link" onClick={onRemove} disabled={busy}>Remove</button>
          </div>
        </div>
      )}
      {error && <p className="kyc-doc-card__error" role="alert">{error}</p>}
    </div>
  );
}
