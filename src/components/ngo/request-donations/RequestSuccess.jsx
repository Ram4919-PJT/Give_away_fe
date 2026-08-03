import { CheckCircle2, ClipboardList, Plus } from 'lucide-react';

export default function RequestSuccess({ onViewRequests, onCreateAnother }) {
  return (
    <div className="rd-success">
      <div className="rd-success__illus" aria-hidden="true">
        <CheckCircle2 size={52} strokeWidth={1.6} />
      </div>
      <h2>Donation Request Submitted Successfully</h2>
      <p>Your request has been forwarded for review. You will be notified within 24–48 hours.</p>
      <div className="rd-success__actions">
        <button type="button" className="rd-btn rd-btn--secondary" onClick={onViewRequests}>
          <ClipboardList size={16} />
          View My Requests
        </button>
        <button type="button" className="rd-btn rd-btn--primary" onClick={onCreateAnother}>
          <Plus size={16} />
          Create Another Request
        </button>
      </div>
    </div>
  );
}
