import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import VerificationRequiredModal from '../verification/VerificationRequiredModal';

const LOCKED_HINT = 'Complete verification to request assistance.';

export default function ReceiverQuickActions() {
  const navigate = useNavigate();
  const { verified, guardAction, modalOpen, closeModal, goToVerification } = useReceiverVerification();

  const handleApply = () => {
    if (!verified) {
      guardAction();
      return;
    }
    navigate('/dashboard/receiver-apply');
  };

  const handleRequests = () => {
    if (!verified) {
      guardAction();
      return;
    }
    navigate('/dashboard/receiver-requests');
  };

  return (
    <>
      <section className="rd-quick-actions rd-quick-actions--financial" aria-label="Quick actions">
        <button
          type="button"
          className={`rd-quick-action rd-quick-action--primary${!verified ? ' rd-quick-action--locked' : ''}`}
          onClick={handleApply}
          title={!verified ? LOCKED_HINT : undefined}
        >
          <span className="rd-quick-action__icon rd-quick-action__icon--primary">
            <Plus size={18} strokeWidth={2.5} />
          </span>
          <span className="rd-quick-action__label">Request Financial Assistance</span>
        </button>
        <button
          type="button"
          className={`rd-quick-action${!verified ? ' rd-quick-action--locked' : ''}`}
          onClick={handleRequests}
          title={!verified ? LOCKED_HINT : undefined}
        >
          <span className="rd-quick-action__icon">
            <ClipboardList size={18} strokeWidth={2} />
          </span>
          <span className="rd-quick-action__label">My Requests</span>
        </button>
      </section>
      <VerificationRequiredModal
        open={modalOpen}
        onClose={closeModal}
        onVerify={goToVerification}
        message="Complete verification to request financial assistance."
      />
    </>
  );
}
