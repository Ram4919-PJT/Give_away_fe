import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, isRoleVerified } from '../context/AppContext';
import { useReceiverEligibility } from './useReceiverEligibility';

const VERIFICATION_ROUTE = '/dashboard/receiver-verify';

export function useReceiverVerification() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { canRequestAssistance, loading: eligLoading, eligibility } = useReceiverEligibility();

  const verified = eligLoading ? isRoleVerified(currentUser) : canRequestAssistance;
  const blockCode = eligibility?.block_reason_code;
  const pending = blockCode === 'KYC_UNDER_REVIEW'
    || currentUser?.verified === 'pending'
    || currentUser?.verificationStatus === 'under_review';
  const rejected = blockCode === 'VERIFICATION_REJECTED'
    || currentUser?.verified === 'rejected'
    || currentUser?.verificationStatus === 'rejected';
  const suspended = blockCode === 'ACCOUNT_SUSPENDED'
    || currentUser?.verified === 'suspended'
    || currentUser?.verificationStatus === 'suspended';

  const goToVerification = useCallback(() => {
    setModalOpen(false);
    navigate(VERIFICATION_ROUTE);
  }, [navigate]);

  const promptVerification = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const guardAction = useCallback((action) => {
    if (verified) {
      action?.();
      return true;
    }
    setModalOpen(true);
    return false;
  }, [verified]);

  return {
    user: currentUser,
    verified,
    canRequestAssistance: verified,
    blockReasonCode: blockCode,
    pending,
    rejected,
    suspended,
    modalOpen,
    setModalOpen,
    goToVerification,
    promptVerification,
    closeModal,
    guardAction,
    verificationRoute: VERIFICATION_ROUTE,
  };
}
