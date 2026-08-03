import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FileHeart, ClipboardList, Bell, User, Clock, CheckCircle, Send,
  FileCheck, AlertCircle, IndianRupee, ArrowLeft, ArrowRight,
  Shield, Lock
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { ASSISTANCE_TYPE_ICONS, RECEIVER_TIMELINE_STEPS } from '../../data/receiverConstants';
import {
  ApplyAssistanceLanding,
  ApplyAssistanceModal,
  SuccessModal
} from '../../components/receiver/ApplyAssistanceFlow';
import MyApplicationsView from '../../components/receiver/MyApplicationsView';
import ReceiverProfilePage from '../../components/receiver/ReceiverProfilePage';
import ReceiverSettingsPage from '../../components/receiver/ReceiverSettingsPage';
import {
  getReceiverApps, getReceiverStats, statusBadgeClass, getTimelineIndex, getInitials,
  buildReceiverApplicationFromFlow
} from '../../utils/receiverHelpers';
import { formatCurrency } from '../../utils/donorHelpers';

function NotifIcon({ name, size = 18 }) {
  const key = name.split('-').map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1))).join('');
  const Cmp = LucideIcons[key] || Bell;
  return <Cmp size={size} />;
}

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
  const { currentUser, receiverApplications, receiverNotifications } = useApp();
  const navigate = useNavigate();
  const apps = getReceiverApps(receiverApplications, currentUser);
  const stats = getReceiverStats(apps);
  const recent = apps.slice(0, 3);
  const notifs = (receiverNotifications || []).slice(0, 3);
  const unread = (receiverNotifications || []).filter((n) => !n.read).length;

  return (
    <div className="receiver-page receiver-module page-route receiver-dashboard">
      <div className="receiver-hero-banner receiver-hero-banner--modern">
        <div className="receiver-hero-content">
          <span className="receiver-badge receiver-badge--registered receiver-badge--modern">
            <Shield size={14} /> Registered Receiver
          </span>
          <h1>We&apos;re Here to Support You</h1>
          <p>
            Submit your financial assistance request to <strong>AJA Abayahastham</strong>.
            Our team will review your application and guide you through every step.
          </p>
          <p className="receiver-aja-note receiver-aja-note--hero">
            <Lock size={14} /> Only AJA Abayahastham reviews applications — you never interact with NGOs directly.
          </p>
        </div>
        <div className="receiver-hero-illus receiver-hero-illus--modern" aria-hidden="true">
          <div className="receiver-hero-graphic">🤝</div>
        </div>
      </div>

      <div className="receiver-stats-grid receiver-stats-grid--modern">
        {[
          [Send, 'Submitted', stats.submitted, 'blue'],
          [Clock, 'Under Review', stats.underReview, 'orange'],
          [CheckCircle, 'Approved', stats.approved, 'green'],
          [AlertCircle, 'Rejected', stats.rejected, 'red']
        ].map(([Icon, label, val, color]) => (
          <article key={label} className="receiver-stat-card receiver-stat-card--modern">
            <div className={`receiver-stat-icon receiver-stat-icon--${color}`}>
              <Icon size={20} />
            </div>
            <p className="receiver-stat-label">{label}</p>
            <p className="receiver-stat-value">{val}</p>
          </article>
        ))}
      </div>

      <div className="receiver-section">
        <h2 className="receiver-section-title receiver-section-title--modern">Quick Actions</h2>
        <div className="receiver-quick-actions receiver-quick-actions--modern">
          <button type="button" className="receiver-quick-btn receiver-quick-btn--compact" onClick={() => navigate('/dashboard/receiver-apply')}>
            <span className="receiver-quick-btn-icon">
              <FileHeart size={20} strokeWidth={2} />
            </span>
            <span className="receiver-quick-btn-label">Apply for Assistance</span>
          </button>
          <button type="button" className="receiver-quick-btn receiver-quick-btn--compact" onClick={() => navigate('/dashboard/receiver-applications')}>
            <span className="receiver-quick-btn-icon">
              <ClipboardList size={20} strokeWidth={2} />
            </span>
            <span className="receiver-quick-btn-label">My Applications</span>
          </button>
          <button type="button" className="receiver-quick-btn receiver-quick-btn--compact" onClick={() => navigate('/dashboard/receiver-notifications')}>
            <span className="receiver-quick-btn-icon">
              <Bell size={20} strokeWidth={2} />
            </span>
            <span className="receiver-quick-btn-label">Notifications</span>
          </button>
        </div>
      </div>

      <div className="receiver-grid-2 receiver-grid-2--modern">
        <div className="receiver-panel">
          <div className="receiver-section-head">
            <h2 className="receiver-section-title receiver-section-title--modern">Recent Applications</h2>
            <button type="button" className="receiver-section-link" onClick={() => navigate('/dashboard/receiver-applications')}>View all</button>
          </div>
          {recent.length ? (
            <div className="receiver-activity-list receiver-activity-list--modern">
              {recent.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="receiver-activity-item receiver-activity-item--modern"
                  onClick={() => navigate(`/dashboard/receiver-application-detail/${a.id}`)}
                >
                  <div className="receiver-activity-icon receiver-activity-icon--modern">
                    {ASSISTANCE_TYPE_ICONS[a.assistanceType] || '📋'}
                  </div>
                  <div className="receiver-activity-body">
                    <strong>{a.assistanceType}</strong>
                    <span className="receiver-activity-meta">
                      {a.id} · {formatCurrency(a.amount)} · {a.appliedDate}
                    </span>
                    <span className={`receiver-status-badge ${statusBadgeClass(a.status)}`}>{a.status}</span>
                  </div>
                  <ArrowRight size={16} className="receiver-activity-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : (
            <div className="receiver-empty receiver-empty--modern">
              <div className="receiver-empty-icon"><ClipboardList size={36} /></div>
              <h3>No applications yet</h3>
              <p>Start your financial assistance request with AJA Abayahastham.</p>
              <div className="empty-state-actions">
                <button type="button" className="login-submit" onClick={() => navigate('/dashboard/receiver-apply')}>Apply Now</button>
              </div>
            </div>
          )}
        </div>

        <div className="receiver-panel">
          <div className="receiver-section-head">
            <h2 className="receiver-section-title receiver-section-title--modern">Notifications</h2>
            <button type="button" className="receiver-section-link" onClick={() => navigate('/dashboard/receiver-notifications')}>
              View all{unread > 0 ? ` (${unread})` : ''}
            </button>
          </div>
          {notifs.length ? (
            <div className="receiver-activity-list receiver-activity-list--modern">
              {notifs.map((n) => (
                <div key={n.id} className={`receiver-activity-item receiver-activity-item--modern receiver-activity-item--static ${n.read ? '' : 'receiver-notif-unread'}`}>
                  <div className="receiver-activity-icon receiver-activity-icon--modern">
                    <NotifIcon name={n.icon || 'bell'} />
                  </div>
                  <div className="receiver-activity-body">
                    <strong>{n.title}</strong>
                    <span className="receiver-activity-meta">{n.message || n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="receiver-empty receiver-empty--modern receiver-empty--compact">
              <div className="receiver-empty-icon"><Bell size={32} /></div>
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>

      {!isRoleVerified(currentUser) && (
        <div className="donor-verify-cta">
          <div>
            <h3>Verification Required</h3>
            <p>Complete receiver verification to unlock Financial Assistance and submit applications to AJA Abayahastham.</p>
          </div>
          <button type="button" className="btn-verify-cta" onClick={() => navigate('/dashboard/receiver-profile')}>
            Complete Verification
          </button>
        </div>
      )}
    </div>
  );
}

/* --- Apply (wireframe guided flow) --- */
export function ReceiverApply() {
  const { dispatch, currentUser, receiverNotifications } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  if (!isRoleVerified(currentUser)) {
    return (
      <div className="receiver-page receiver-module page-route">
        <div className="ngo-locked-overlay">
          <Lock size={48} />
          <h2>Financial Assistance Locked</h2>
          <p>Complete receiver verification before applying for financial assistance from AJA Abayahastham.</p>
          <button type="button" className="login-submit" onClick={() => navigate('/dashboard/receiver-profile')}>
            Complete Verification
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitted = ({ categoryId, form }) => {
    const application = buildReceiverApplicationFromFlow({ categoryId, form, user: currentUser });
    dispatch({ type: 'ADD_RECEIVER_APPLICATION', payload: application });
    dispatch({
      type: 'PATCH_DATA',
      payload: {
        receiverNotifications: [
          {
            id: `rn-${Date.now()}`,
            title: 'Application Submitted',
            message: `${application.id} has been submitted to AJA Abayahastham for review.`,
            time: 'Just now',
            group: 'today',
            read: false,
            icon: 'file-check'
          },
          ...(receiverNotifications || [])
        ]
      }
    });
    setModalOpen(false);
    setSuccessOpen(true);
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
          onViewApplications={() => {
            setSuccessOpen(false);
            navigate('/dashboard/receiver-applications');
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
  const { currentUser } = useApp();
  const navigate = useNavigate();

  if (!isRoleVerified(currentUser)) {
    return (
      <div className="receiver-page receiver-module page-route">
        <div className="ngo-locked-overlay">
          <Lock size={48} />
          <h2>My Applications Locked</h2>
          <p>Complete receiver verification to view and manage your financial assistance applications.</p>
          <button type="button" className="login-submit" onClick={() => navigate('/dashboard/receiver-profile')}>
            Complete Verification
          </button>
        </div>
      </div>
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
      <button type="button" className="receiver-back-btn" onClick={() => navigate('/dashboard/receiver-applications')}>
        <ArrowLeft size={16} /> Back to My Applications
      </button>

      <div className="receiver-detail-card">
        <div className="receiver-detail-head">
          <div>
            <p className="receiver-app-id">{app.id}</p>
            <h1>{app.assistanceType}</h1>
            <span className={`receiver-status-badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
          </div>
          <div className="receiver-detail-amount">
            <span>Requested Amount</span>
            <strong>${app.amount?.toLocaleString()}</strong>
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

/* --- Notifications --- */
export function ReceiverNotifications() {
  const { receiverNotifications, dispatch } = useApp();
  const groups = ['today', 'yesterday', 'earlier'];
  const list = receiverNotifications || [];

  return (
    <div className="receiver-page receiver-module page-route">
      <div className="receiver-page-header">
        <h1>Notifications</h1>
        <p>Updates on your applications from AJA Abayahastham.</p>
      </div>

      {list.length ? groups.map((g) => {
        const items = list.filter((n) => n.group === g);
        if (!items.length) return null;
        return (
          <div key={g} className="receiver-notif-group">
            <p className="receiver-notif-group-title">{g}</p>
            {items.map((n) => (
              <div
                key={n.id}
                className={`receiver-notif-item ${n.read ? '' : 'unread'}`}
                onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey: 'receiverNotifications', id: n.id } })}
              >
                <div className="receiver-notif-icon"><NotifIcon name={n.icon || 'bell'} /></div>
                <div className="receiver-notif-body">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <p className="receiver-notif-time">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }) : (
        <div className="receiver-empty">
          <Bell size={48} color="#9CA3AF" />
          <h3>No Notifications</h3>
          <p>Application updates will appear here.</p>
        </div>
      )}
    </div>
  );
}

/* --- Profile --- */
export function ReceiverProfile() {
  return <ReceiverProfilePage />;
}

export function ReceiverSettings() {
  return <ReceiverSettingsPage />;
}
