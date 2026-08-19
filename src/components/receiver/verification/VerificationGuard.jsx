import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import VerificationRequiredModal from './VerificationRequiredModal';
import LockedFeatureCard from './LockedFeatureCard';

export default function VerificationGuard({
  children,
  fallback = null,
  lockedCard,
  showModal = true,
}) {
  const {
    verified,
    modalOpen,
    closeModal,
    goToVerification,
    promptVerification,
  } = useReceiverVerification();

  if (verified) {
    return children;
  }

  if (lockedCard) {
    return (
      <>
        <LockedFeatureCard
          title={lockedCard.title}
          description={lockedCard.description}
          onVerify={goToVerification}
          compact={lockedCard.compact}
        />
        {showModal && (
          <VerificationRequiredModal
            open={modalOpen}
            onClose={closeModal}
            onVerify={goToVerification}
            title={lockedCard.modalTitle}
            message={lockedCard.modalMessage}
          />
        )}
      </>
    );
  }

  return (
    <>
      {fallback}
      {showModal && (
        <VerificationRequiredModal
          open={modalOpen}
          onClose={closeModal}
          onVerify={goToVerification}
        />
      )}
    </>
  );
}

export function VerificationLockedButton({
  children,
  className = 'rd-btn rd-btn--locked',
  message,
  ...props
}) {
  const { verified, guardAction, modalOpen, closeModal, goToVerification } = useReceiverVerification();

  if (verified) {
    return (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        title={message || 'Verification required'}
        onClick={() => guardAction()}
        {...props}
      >
        {children}
      </button>
      <VerificationRequiredModal
        open={modalOpen}
        onClose={closeModal}
        onVerify={goToVerification}
        message={message}
      />
    </>
  );
}
