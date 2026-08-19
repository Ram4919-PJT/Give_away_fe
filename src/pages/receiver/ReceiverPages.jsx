import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock, CheckCircle, AlertCircle, ArrowLeft, Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mapAssistanceRequestFromApi } from '../../api/mappers';
import { useReceiverVerification } from '../../hooks/useReceiverVerification';
import { useToast } from '../../components/ui/Toast';
import { PageBackLink } from '../../components/ui/FlowNav';
import { RECEIVER_TIMELINE_STEPS } from '../../data/receiverConstants';
import {
  ApplyAssistanceLanding,
  ApplyAssistanceModal,
  SuccessModal
} from '../../components/receiver/ApplyAssistanceFlow';
import MyApplicationsView from '../../components/receiver/MyApplicationsView';
import ReceiverProfilePage from '../../components/receiver/ReceiverProfilePage';
import ReceiverSettingsPage from '../../components/receiver/ReceiverSettingsPage';
import ReceiverDashboardView from '../../components/receiver/dashboard/ReceiverDashboardView';
import LockedFeatureCard from '../../components/receiver/verification/LockedFeatureCard';
import NotificationsCenter from '../../components/notifications/NotificationsCenter';
import { statusBadgeClass, getTimelineIndex } from '../../utils/receiverHelpers';
import { formatCurrency } from '../../utils/donorHelpers';
import ReceiverVerifyPage from './ReceiverVerifyPage';

function ApplicationTimeline({ status, compact }) {
  const idx = getTimelineIndex(status);
  const rejected = status === 'Rejected';

  if (compact) {
    return (
      <div className="receiver-timeline">
        <p className="receiver-timeline-title">Application Timeline</p>
        <div className="receiver-timeline-track">
          {RECEIVER_TIMELINE_STEPS.map((step, i) => (
            <div
              key={step}
              className={`receiver-timeline-step ${rejected && i === 2 ? 'rejected' : ''} ${idx >= 0 && i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}
            >
              <div className="receiver-timeline-dot" />
              <span>{step.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="receiver-timeline-detail">
      {RECEIVER_TIMELINE_STEPS.map((step, i) => (
        <div key={step} className={`receiver-timeline-row ${idx >= 0 && i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
          <div className="receiver-timeline-row-dot">{idx > i ? <CheckCircle size={14} /> : <Clock size={14} />}</div>
          <div><strong>{step}</strong>{i <= idx && <span> — Completed</span>}</div>
        </div>
      ))}
    </div>
  );
}

export function ReceiverDashboard() {
  return <ReceiverDashboardView />;
}

function ReceiverLockedPage({ title, description }) {
  const { goToVerification } = useReceiverVerification();
  return (
    <div className="receiver-page receiver-module page-route">
      <LockedFeatureCard title={title} description={description} onVerify={goToVerification} />
    </div>
  );
}

/* --- Apply (wireframe guided flow) --- */
export function ReceiverApply() {
  const { refreshPlatformData, currentUser } = useApp();
  const { verified } = useReceiverVerification();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  if (!verified) {
    return (
      <ReceiverLockedPage
        title="Financial Assistance Locked"
        description="Complete your receiver verification to apply for financial assistance from AJA Abayahastham."
      />
    );
  }

  const handleSubmitted = async (apiApplication) => {
    try {
      const mapped = mapAssistanceRequestFromApi(apiApplication);
      setSubmittedApp(mapped);
      setModalOpen(false);
      setSuccessOpen(true);
      await refreshPlatformData('receiver', currentUser?.email, currentUser?.userId);
    } catch (err) {
      showToast(err?.message || 'Could not update your requests list.', 'error');
      throw err;
    }
  };

  return (
    <>
      <ApplyAssistanceLanding onStart={() => setModalOpen(true)} />
      {modalOpen && (
        <ApplyAssistanceModal
          onClose={() => setModalOpen(false)}
          onSubmitted={handleSubmitted}
        />
      )}
      {successOpen && (
        <SuccessModal
          application={submittedApp}
          onViewApplications={() => {
            setSuccessOpen(false);
            navigate('/dashboard/receiver-requests');
          }}
          onDashboard={() => {
            setSuccessOpen(false);
            navigate('/dashboard/receiver-dashboard');
          }}
        />
      )}
    </>
  );
}

/* --- My Applications --- */
export function ReceiverApplications() {
  const { verified } = useReceiverVerification();

  if (!verified) {
    return (
      <ReceiverLockedPage
        title="My Requests Locked"
        description="Complete your receiver verification to view and manage your financial assistance requests."
      />
    );
  }

  return <MyApplicationsView />;
}

export function ReceiverApplicationDetail() {
  const { id } = useParams();
  const { receiverApplications } = useApp();
  const navigate = useNavigate();
  const app = receiverApplications?.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="receiver-page receiver-module">
        <div className="receiver-empty"><h3>Application not found</h3></div>
      </div>
    );
  }

  return (
    <div className="receiver-page receiver-module page-route">
      <PageBackLink
        to="/dashboard/receiver-requests"
        label="Back to My Requests"
      />

      <div className="receiver-detail-card">
        <div className="receiver-detail-head">
          <div>
            <p className="receiver-app-id">{app.id}</p>
            <h1>{app.assistanceType}</h1>
            <span className={`receiver-status-badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
          </div>
          <div className="receiver-detail-amount">
            <span>Requested Amount</span>
            <strong>{formatCurrency(app.amount)}</strong>
          </div>
        </div>

        <div className="receiver-detail-grid">
          <div><label>Purpose</label><p>{app.purpose}</p></div>
          <div><label>Applied Date</label><p>{app.appliedDate}</p></div>
          <div className="receiver-detail-full"><label>Description</label><p>{app.description}</p></div>
          {app.notes && <div className="receiver-detail-full"><label>Additional Info</label><p>{app.notes}</p></div>}
        </div>

        {app.rejectionReason && (
          <div className="receiver-rejection-box">
            <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
            <strong>Rejected:</strong> {app.rejectionReason}
            <div className="empty-state-actions">
              <button type="button" className="login-submit" onClick={() => navigate('/dashboard/receiver-apply')}>Resubmit Application</button>
            </div>
          </div>
        )}

        {app.needsAction && app.actionRequiredReason && (
          <div className="receiver-rejection-box">
            <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
            <strong>Action required:</strong> {app.actionRequiredReason}
            <div className="empty-state-actions">
              <button type="button" className="login-submit" onClick={() => navigate('/dashboard/receiver-apply')}>Fix application</button>
            </div>
          </div>
        )}

        <div className="receiver-detail-timeline-wrap">
          <h3>Application Timeline</h3>
          <ApplicationTimeline status={app.status} />
        </div>

        <div className="receiver-aja-note receiver-aja-note--inline">
          <Lock size={14} /> If approved, AJA Abayahastham may internally assign your case to a verified NGO. You will only see status updates here.
        </div>
      </div>
    </div>
  );
}

export function ReceiverNotifications() {
  return <NotificationsCenter role="receiver" />;
}

export function ReceiverVerify() {
  return <ReceiverVerifyPage />;
}

/* --- Profile --- */
export function ReceiverProfile() {
  return <ReceiverProfilePage />;
}

export function ReceiverSettings() {
  return <ReceiverSettingsPage />;
}
