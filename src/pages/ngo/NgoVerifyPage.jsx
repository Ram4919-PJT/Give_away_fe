import { ShieldOff } from 'lucide-react';
import { useApp, isNgoSuspended } from '../../context/AppContext';
import { PageBackLink } from '../../components/ui/FlowNav';
import KycFlow from '../../components/kyc/KycFlow';
import { profileStatusToUserPatch } from '../../api/verificationClient';
import { NGO_KYC_STEPS } from '../../data/kycConfig';

export default function NgoVerifyPage() {
  const { currentUser, dispatch } = useApp();

  if (isNgoSuspended(currentUser)) {
    return (
      <div className="ngo-page ngo-module page-route">
        <div className="ngo-verify-status-card ngo-verify-status-card--suspended">
          <ShieldOff size={28} />
          <div>
            <strong>Account Suspended</strong>
            <p>Your NGO account has been suspended. Contact platform support for assistance.</p>
          </div>
        </div>
        <PageBackLink to="/dashboard/ngo-dashboard" label="Back to Dashboard" />
      </div>
    );
  }

  return (
    <div className="ngo-page ngo-module">
      <KycFlow
        role="ngo"
        roleLabel="NGO"
        steps={NGO_KYC_STEPS}
        dashboardPath="/dashboard/ngo-dashboard"
        onStatusChange={(profileStatus) => {
          const patch = profileStatusToUserPatch(profileStatus);
          dispatch({ type: 'UPDATE_USER', payload: patch });
        }}
      />
    </div>
  );
}
