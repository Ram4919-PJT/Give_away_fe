import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  Shield, ShieldCheck, Package, Users, BarChart3, Layers, Clock,
  CheckCircle, Send, Bell, ArrowRight, Building2, FileText, TrendingUp
} from 'lucide-react';
import { useApp, isNgoVerified, getNgoVerificationStatus, isNgoVerificationSubmitted } from '../../context/AppContext';
import {
  getNgoRequests, getNgoStats, requestStatusClass, notificationStatusClass,
  formatRequestAmount, getBeneficiaryCategoryStats, buildActivityTimeline
} from '../../utils/ngoHelpers';

function StatusBadge({ user }) {
  const status = getNgoVerificationStatus(user);
  const labels = {
    registered: 'Registered NGO',
    pending: 'Pending Verification',
    verified: 'Verified NGO',
    rejected: 'Rejected',
    suspended: 'Suspended'
  };
  return (
    <span className={`ngo-status-badge ngo-dash-status-badge ngo-status-badge--${status}`}>
      {status === 'verified' && <ShieldCheck size={12} aria-hidden="true" />}
      {status === 'pending' && <Clock size={12} aria-hidden="true" />}
      {labels[status] || labels.registered}
    </span>
  );
}

function NotifIcon({ name, size = 18 }) {
  const key = (name || 'bell').split('-').map((p, i) =>
    i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)
  ).join('');
  const Cmp = LucideIcons[key] || Bell;
  return <Cmp size={size} />;
}

function CircularProgress({ pct, color, label, count }) {
  const deg = Math.min(100, Math.max(0, pct)) * 3.6;
  return (
    <div className="ngo-dash-ring" title={`${label}: ${count}`}>
      <div
        className="ngo-dash-ring__chart"
        style={{ background: `conic-gradient(${color} ${deg}deg, #E5E7EB ${deg}deg)` }}
        aria-hidden="true"
      >
        <span className="ngo-dash-ring__value">{count}</span>
      </div>
      <span className="ngo-dash-ring__label">{label}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="ngo-dash-skeleton" aria-hidden="true">
      <div className="ngo-dash-skeleton__hero" />
      <div className="ngo-dash-skeleton__stats">
        {[1, 2, 3, 4].map((i) => <div key={i} className="ngo-dash-skeleton__stat" />)}
      </div>
      <div className="ngo-dash-skeleton__grid">
        <div className="ngo-dash-skeleton__panel" />
        <div className="ngo-dash-skeleton__panel ngo-dash-skeleton__panel--sm" />
      </div>
    </div>
  );
}

export default function NgoDashboardView() {
  const { currentUser, ngoRequests, ngoNotifications, ngoBeneficiaries } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const verified = isNgoVerified(currentUser);
  const submitted = isNgoVerificationSubmitted(currentUser);
  const reqs = getNgoRequests(ngoRequests, currentUser);
  const stats = getNgoStats(reqs, ngoBeneficiaries, verified, submitted);
  const recentReqs = reqs.slice(0, 3);
  const notifs = (ngoNotifications || []).slice(0, 4);
  const beneficiaryCats = getBeneficiaryCategoryStats(ngoBeneficiaries);
  const timeline = buildActivityTimeline(reqs, ngoNotifications);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 480);
    return () => clearTimeout(t);
  }, []);

  const quickActions = [
    {
      icon: Layers,
      emoji: '📚',
      title: 'Browse Programs',
      desc: 'Explore AJA assistance programs',
      arrow: 'Browse',
      path: '/dashboard/ngo-programs',
      disabled: false
    },
    {
      icon: Package,
      emoji: '📄',
      title: 'Request Donation',
      desc: 'Submit item or financial requests',
      arrow: 'Apply',
      path: '/dashboard/ngo-request-donations',
      disabled: !verified
    },
    {
      icon: Users,
      emoji: '👥',
      title: 'Manage Beneficiaries',
      desc: 'Track people you support',
      arrow: 'View',
      path: '/dashboard/ngo-beneficiaries',
      disabled: !verified
    },
    {
      icon: ShieldCheck,
      emoji: '🛡',
      title: 'Verification',
      desc: 'Complete NGO documentation',
      arrow: 'Complete',
      path: '/dashboard/ngo-verify',
      disabled: verified
    },
    {
      icon: BarChart3,
      emoji: '📊',
      title: 'Reports',
      desc: 'Donation and impact analytics',
      arrow: 'Open',
      path: '/dashboard/ngo-reports',
      disabled: !verified
    }
  ];

  const statCards = [
    {
      icon: Package,
      emoji: '📦',
      value: stats.donationRequests,
      label: 'Donation Requests',
      trend: `+${Math.max(stats.donationRequests, 1)} this month`,
      accent: 'blue'
    },
    {
      icon: CheckCircle,
      emoji: '✅',
      value: stats.approved,
      label: 'Approved',
      trend: stats.approved ? `${stats.approved} active` : 'Awaiting approvals',
      accent: 'green'
    },
    {
      icon: Users,
      emoji: '👥',
      value: verified ? stats.beneficiaries : '—',
      label: 'Beneficiaries',
      trend: verified ? 'People supported' : 'Unlock after verification',
      accent: 'purple'
    },
    {
      icon: Shield,
      emoji: '🛡',
      value: submitted ? null : verified ? null : 1,
      label: submitted ? 'Review Status' : verified ? 'Verification' : 'Pending Verification',
      trend: submitted ? 'Documents under review' : verified ? 'Fully verified' : 'Action required',
      accent: 'orange',
      badge: submitted ? 'Under Review' : verified ? 'Verified' : null
    }
  ];

  if (loading) {
    return (
      <div className="ngo-page ngo-module page-route ngo-dashboard">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="ngo-page ngo-module page-route ngo-dashboard ngo-dashboard--premium">
      {/* Hero */}
      <section className="ngo-dash-hero ngo-dash-animate">
        <div className="ngo-dash-hero__content">
          <StatusBadge user={currentUser} />
          <h1>Together We Build Stronger Communities</h1>
          <p className="ngo-dash-hero__subtitle">
            Welcome back, <strong>{currentUser.name}</strong>.
          </p>
          <p className="ngo-dash-hero__desc">
            Manage donation requests, beneficiaries, and verification from one place.
          </p>
        </div>
        <div className="ngo-dash-hero__visual" aria-hidden="true">
          <div className="ngo-dash-hero__float">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      {!verified && !submitted && (
        <section className="ngo-dash-verify ngo-dash-animate ngo-dash-animate--delay-1" aria-labelledby="ngo-verify-title">
          <div className="ngo-dash-verify__left">
            <div className="ngo-dash-verify__icon">
              <Shield size={28} strokeWidth={1.75} />
            </div>
            <div>
              <h2 id="ngo-verify-title">Complete NGO Verification</h2>
              <p>Verify your organization to request donations and manage beneficiaries on the platform.</p>
              <ul className="ngo-dash-verify__benefits">
                <li><CheckCircle size={14} /> Verified NGO Badge</li>
                <li><CheckCircle size={14} /> Access Donation Requests</li>
                <li><CheckCircle size={14} /> Financial Assistance Programs</li>
              </ul>
            </div>
          </div>
          <button type="button" className="ngo-dash-btn ngo-dash-btn--primary" onClick={() => navigate('/dashboard/ngo-verify')}>
            Complete Verification
          </button>
        </section>
      )}

      {submitted && (
        <section className="ngo-verify-review-banner ngo-dash-animate ngo-dash-animate--delay-1" role="status" aria-live="polite">
          <div className="ngo-verify-review-banner__content">
            <h3>Verification Under Review</h3>
            <p>
              Thank you for submitting your documentation. The verification process typically takes 24–48 hours.
              We will notify you via email as soon as your account is fully verified.
            </p>
          </div>
          <div className="ngo-verify-review-banner__status" aria-disabled="true">
            <Clock size={18} aria-hidden="true" />
            <span>Documents Under Review</span>
          </div>
        </section>
      )}

      {/* Statistics */}
      <section className="ngo-dash-stats ngo-dash-animate ngo-dash-animate--delay-2" aria-label="Dashboard statistics">
        {statCards.map((card) => (
          <article key={card.label} className={`ngo-dash-stat ngo-dash-stat--${card.accent}`}>
            <div className="ngo-dash-stat__top">
              <span className="ngo-dash-stat__emoji" aria-hidden="true">{card.emoji}</span>
              <div className={`ngo-dash-stat__icon ngo-dash-stat__icon--${card.accent}`}>
                <card.icon size={20} strokeWidth={2} />
              </div>
            </div>
            {card.badge ? (
              <span className={`ngo-dash-badge ${card.badge === 'Verified' ? 'ngo-dash-badge--approved' : 'ngo-dash-badge--review'}`}>
                {card.badge}
              </span>
            ) : (
              <p className="ngo-dash-stat__value">{card.value}</p>
            )}
            <p className="ngo-dash-stat__label">{card.label}</p>
            <p className="ngo-dash-stat__trend">
              <TrendingUp size={12} aria-hidden="true" />
              {card.trend}
            </p>
          </article>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="ngo-dash-section ngo-dash-animate ngo-dash-animate--delay-3">
        <h2 className="ngo-dash-section__title">Quick Actions</h2>
        <div className="ngo-dash-actions">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              className="ngo-dash-action-card"
              disabled={action.disabled}
              onClick={() => navigate(action.path)}
            >
              <span className="ngo-dash-action-card__emoji" aria-hidden="true">{action.emoji}</span>
              <span className="ngo-dash-action-card__icon">
                <action.icon size={18} strokeWidth={2} />
              </span>
              <strong>{action.title}</strong>
              <span className="ngo-dash-action-card__desc">{action.desc}</span>
              <span className="ngo-dash-action-card__arrow">
                {action.arrow} <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main grid: content + timeline */}
      <div className="ngo-dash-layout ngo-dash-animate ngo-dash-animate--delay-4">
        <div className="ngo-dash-layout__main">
          {/* Notifications */}
          <section className="ngo-dash-panel">
            <div className="ngo-dash-panel__head">
              <h2 className="ngo-dash-section__title">Recent Notifications</h2>
              <button type="button" className="ngo-dash-link" onClick={() => navigate('/dashboard/ngo-notifications')}>
                View all
              </button>
            </div>
            {notifs.length ? (
              <div className="ngo-dash-notif-list">
                {notifs.map((n) => (
                  <article key={n.id} className={`ngo-dash-notif ${n.read ? '' : 'is-unread'}`}>
                    <div className={`ngo-dash-notif__status-dot ngo-dash-notif__status-dot--${notificationStatusClass(n.title).replace('ngo-dash-badge--', '')}`} aria-hidden="true" />
                    <div className="ngo-dash-notif__icon">
                      <NotifIcon name={n.icon} size={18} />
                    </div>
                    <div className="ngo-dash-notif__body">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <span className="ngo-dash-notif__time">{n.time}</span>
                    </div>
                    <span className={`ngo-dash-badge ${notificationStatusClass(n.title)}`}>
                      {n.title.toLowerCase().includes('approved') ? 'Approved'
                        : n.title.toLowerCase().includes('review') ? 'Review'
                        : n.title.toLowerCase().includes('verification') ? 'Pending'
                        : 'Update'}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="ngo-dash-empty">
                <div className="ngo-dash-empty__illus"><Bell size={40} strokeWidth={1.25} /></div>
                <h3>No notifications yet</h3>
                <p>Updates about your requests and verification will appear here.</p>
              </div>
            )}
          </section>

          {/* Recent Requests */}
          <section className="ngo-dash-panel">
            <div className="ngo-dash-panel__head">
              <h2 className="ngo-dash-section__title">Recent Requests</h2>
              <button type="button" className="ngo-dash-link" onClick={() => navigate('/dashboard/ngo-my-requests')}>
                View all
              </button>
            </div>
            {recentReqs.length ? (
              <div className="ngo-dash-request-list">
                {recentReqs.map((r) => (
                  <article key={r.id} className="ngo-dash-request-card">
                    <div className="ngo-dash-request-card__head">
                      <span className="ngo-dash-request-card__id">{r.id}</span>
                      <span className={`ngo-dash-badge ${requestStatusClass(r.status)}`}>{r.status}</span>
                    </div>
                    <div className="ngo-dash-request-card__meta">
                      <span><FileText size={14} /> {r.category || r.type}</span>
                      <span>{formatRequestAmount(r)}</span>
                      <span>{r.appliedDate}</span>
                    </div>
                    <p className="ngo-dash-request-card__purpose">{r.purpose}</p>
                    <button
                      type="button"
                      className="ngo-dash-btn ngo-dash-btn--ghost"
                      onClick={() => navigate('/dashboard/ngo-my-requests')}
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="ngo-dash-empty">
                <div className="ngo-dash-empty__illus"><Package size={40} strokeWidth={1.25} /></div>
                <h3>No requests yet</h3>
                <p>Submit your first donation request once verification is complete.</p>
                <button
                  type="button"
                  className="ngo-dash-btn ngo-dash-btn--primary"
                  disabled={!verified}
                  onClick={() => navigate('/dashboard/ngo-request-donations')}
                >
                  Request Donation
                </button>
              </div>
            )}
          </section>

          {/* Beneficiary Snapshot */}
          <section className="ngo-dash-panel ngo-dash-panel--snapshot">
            <div className="ngo-dash-panel__head">
              <h2 className="ngo-dash-section__title">Beneficiary Snapshot</h2>
              {verified && (
                <button type="button" className="ngo-dash-link" onClick={() => navigate('/dashboard/ngo-beneficiaries')}>
                  View all
                </button>
              )}
            </div>
            {verified && ngoBeneficiaries?.length ? (
              <div className="ngo-dash-snapshot">
                <div className="ngo-dash-snapshot__total">
                  <span className="ngo-dash-snapshot__total-num">{ngoBeneficiaries.length}</span>
                  <span className="ngo-dash-snapshot__total-label">Total Beneficiaries</span>
                </div>
                <div className="ngo-dash-snapshot__rings">
                  {beneficiaryCats.map((cat) => (
                    <CircularProgress
                      key={cat.id}
                      pct={cat.pct}
                      color={cat.color}
                      label={cat.label}
                      count={cat.count}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="ngo-dash-empty ngo-dash-empty--compact">
                <div className="ngo-dash-empty__illus"><Users size={36} strokeWidth={1.25} /></div>
                <h3>{verified ? 'No beneficiaries yet' : 'Beneficiaries locked'}</h3>
                <p>
                  {verified
                    ? 'Add beneficiaries after your first approved donation request.'
                    : 'Complete verification to manage beneficiaries.'}
                </p>
                {!verified && (
                  <button type="button" className="ngo-dash-btn ngo-dash-btn--outline" onClick={() => navigate('/dashboard/ngo-verify')}>
                    Complete Verification
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Activity Timeline */}
        <aside className="ngo-dash-timeline-panel">
          <h2 className="ngo-dash-section__title">Activity Timeline</h2>
          <ol className="ngo-dash-timeline">
            {timeline.map((item, i) => (
              <li key={item.id} className={`ngo-dash-timeline__item ${i === 0 ? 'is-current' : ''}`}>
                <div className="ngo-dash-timeline__marker">
                  <div className="ngo-dash-timeline__dot">
                    <NotifIcon name={item.icon} size={14} />
                  </div>
                  {i < timeline.length - 1 && <div className="ngo-dash-timeline__line" aria-hidden="true" />}
                </div>
                <div className="ngo-dash-timeline__content">
                  <span className="ngo-dash-timeline__time">{item.time}</span>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
