import { useApp } from '../../../context/AppContext';
import { useReceiverDashboard } from '../../../hooks/useReceiverDashboard';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import VerificationRequiredModal from '../verification/VerificationRequiredModal';
import ReceiverWelcomeBanner, { ReceiverVerificationCard } from './ReceiverWelcomeBanner';
import ReceiverStatCards from './ReceiverStatCards';
import ReceiverQuickActions from './ReceiverQuickActions';
import ReceiverAssistanceOverview from './ReceiverAssistanceOverview';
import ReceiverRecentReceived from './ReceiverRecentReceived';
import ReceiverActiveRequests from './ReceiverActiveRequests';
import ReceiverMessagesPreview, { ReceiverImpactSnapshot } from './ReceiverMessagesPreview';

export default function ReceiverDashboardView() {
  const { currentUser } = useApp();
  const { verified, modalOpen, closeModal, goToVerification } = useReceiverVerification();
  const { data, platformLoading, error, reload } = useReceiverDashboard();

  const name = currentUser?.name || 'Receiver';
  const shellReady = Boolean(currentUser);
  const sectionsLoading = platformLoading;

  return (
    <div className="receiver-dashboard-page rd-stack">
      <VerificationRequiredModal
        open={modalOpen}
        onClose={closeModal}
        onVerify={goToVerification}
      />

      <div className="rd-hero-grid">
        <ReceiverWelcomeBanner name={name} loading={!shellReady} />
        <ReceiverVerificationCard loading={!shellReady} />
      </div>

      <ReceiverStatCards stats={data?.stats} loading={sectionsLoading} />

      <ReceiverQuickActions />

      <ReceiverAssistanceOverview
        series={data?.series}
        causeBreakdown={data?.causeBreakdown}
        periodTotal={data?.periodTotal}
        loading={sectionsLoading}
        error={error}
        onRetry={reload}
      />

      <div className="rd-main-grid">
        <ReceiverRecentReceived items={data?.recentReceived} loading={sectionsLoading} />
        <ReceiverActiveRequests items={data?.activeRequests} loading={sectionsLoading} verified={verified} />
      </div>

      <div className="rd-bottom-grid">
        <ReceiverImpactSnapshot tiles={data?.impactSnapshot} loading={sectionsLoading} />
        <ReceiverMessagesPreview notifications={data?.notifications} loading={platformLoading} />
      </div>
    </div>
  );
}
