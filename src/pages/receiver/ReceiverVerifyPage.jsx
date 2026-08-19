import { useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import KycFlow from '../../components/kyc/KycFlow';
import { profileStatusToUserPatch } from '../../api/verificationClient';
import { useReceiverKycConfig } from '../../hooks/useReceiverKycConfig';
import { buildKycStepsFromConfig } from '../../utils/kycConfigMapper';

export default function ReceiverVerifyPage() {
  const { dispatch } = useApp();
  const { config, loading } = useReceiverKycConfig();
  const steps = useMemo(() => buildKycStepsFromConfig(config), [config]);

  const handleStatusChange = useCallback((profileStatus) => {
    const patch = profileStatusToUserPatch(profileStatus);
    dispatch({ type: 'UPDATE_USER', payload: patch });
  }, [dispatch]);

  if (loading && !config) {
    return (
      <div className="receiver-page receiver-module kyc-flow kyc-flow--loading">
        <p>Loading verification configuration…</p>
      </div>
    );
  }

  return (
    <div className="receiver-page receiver-module">
      <KycFlow
        role="receiver"
        roleLabel="Receiver"
        steps={steps}
        kycConfig={config}
        dashboardPath="/dashboard/receiver-dashboard"
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
