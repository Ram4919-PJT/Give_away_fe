import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ShieldCheck, Shield, ArrowRight, Loader2, AlertCircle,
  Users, Package, Banknote, Layers, TrendingUp, Clock, Lock,
} from 'lucide-react';
import { useApp, isNgoVerified, isNgoVerificationSubmitted, isNgoSuspended, getNgoVerificationStatus } from '../../context/AppContext';
import { useNgoDashboard } from '../../hooks/useNgoDashboard';
import { DonationTrendChart, DonationDistributionChart } from '../ngo/reports/ReportCharts';
import AjaBrandMark from '../branding/AjaBrandMark';

const PERIOD_OPTIONS = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'year', label: 'This Year' },
];

function KpiCard({ kpi }) {
  return (
    <article className={`ngo-kpi ngo-kpi--${kpi.accent}`}>
      <p className="ngo-kpi__label">{kpi.label}</p>
      <p className="ngo-kpi__value">{kpi.display}</p>
      <p className="ngo-kpi__hint">{kpi.hint}</p>
    </article>
  );
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  let cls = 'ngo-status-pill';
  if (key.includes('approv') || key.includes('fulfil') || key.includes('complete')) cls += ' ngo-status-pill--success';
  else if (key.includes('reject') || key.includes('cancel')) cls += ' ngo-status-pill--danger';
  else if (key.includes('review') || key.includes('pending') || key.includes('submit')) cls += ' ngo-status-pill--warning';
  return <span className={cls}>{status}</span>;
}

function DashboardSkeleton() {
  return (
    <div className="ngo-dash-v2-skeleton" aria-hidden="true">
      <div className="ngo-dash-v2-skeleton__hero" />
      <div className="ngo-dash-v2-skeleton__kpis">
        {[1, 2, 3, 4].map((i) => <div key={i} />)}
      </div>
      <div className="ngo-dash-v2-skeleton__grid">
        <div />
        <div />
      </div>
    </div>
  );
}

function EmptyPanel({ title, description, actionLabel, onAction, disabled }) {
  return (
    <div className="ngo-dash-empty-v2">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && (
        <button type="button" className="ngo-btn ngo-btn--primary" onClick={onAction} disabled={disabled}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function NgoDashboardView() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { data, loading, error, period, changePeriod, reload } = useNgoDashboard('month');

  const verified = isNgoVerified(currentUser);
  const submitted = isNgoVerificationSubmitted(currentUser);
  const suspended = isNgoSuspended(currentUser);
  const verificationStatus = getNgoVerificationStatus(currentUser);
  const ngoName = data?.profile?.ngo_name || currentUser?.name || 'NGO Partner';
  const verificationMessage = data?.verification_message
    || (suspended
      ? 'Your NGO account is suspended. Contact platform support for assistance.'
      : 'Complete NGO verification to access donations, funds, inventory, beneficiaries, and reports.');

  const trendData = useMemo(
    () => (data?.donation_trend || []).map((row) => ({ label: row.label, value: row.value })),
    [data]
  );
  const typeData = useMemo(() => data?.donations_by_type || [], [data]);

  if (loading && !data) {
    return (
      <div className="ngo-page ngo-module page-route ngo-dashboard-v2">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="ngo-page ngo-module page-route ngo-dashboard-v2">
        <div className="ngo-dash-error" role="alert">
          <AlertCircle size={20} />
          <div>
            <strong>Could not load dashboard</strong>
            <p>{error}</p>
          </div>
          <button type="button" className="ngo-btn ngo-btn--secondary" onClick={reload}>Retry</button>
        </div>
      </div>
    );
  }

  const kpis = (data?.kpis || []).slice(0, 6);
  const activities = data?.recent_activity || [];
  const pending = data?.pending_requests || [];
  const impact = data?.impact_snapshot || {};

  return (
    <div className="ngo-page ngo-module page-route ngo-dashboard-v2">
      <header className="ngo-dash-v2-header">
        <div className="ngo-dash-v2-header__lead">
          <AjaBrandMark size="hero" className="ngo-dash-v2-header__mark" />
          <div className="ngo-dash-v2-header__copy">
            <p className="ngo-dash-v2-header__eyebrow">AJA Abayahastham</p>
            <h1>Welcome back, {ngoName}</h1>
            <p>Here&apos;s what&apos;s happening with your organization today.</p>
          </div>
        </div>
        <div className="ngo-dash-v2-header__actions">
          {suspended ? (
            <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate('/dashboard/ngo-profile')}>
              View Profile
            </button>
          ) : verified ? (
            <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-programs')}>
              <Layers size={16} /> View Programs
            </button>
          ) : (
            <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-verify')}>
              <Shield size={16} /> Complete Verification
            </button>
          )}
        </div>
      </header>

      <section className={`ngo-dash-v2-verify${verified ? ' is-verified' : ''}${suspended ? ' is-suspended' : ''}`}>
        {suspended ? (
          <>
            <div className="ngo-dash-v2-verify__icon ngo-dash-v2-verify__icon--danger">
              <Lock size={22} />
            </div>
            <div className="ngo-dash-v2-verify__body">
              <strong>Account Suspended</strong>
              <p>{verificationMessage}</p>
            </div>
          </>
        ) : verified ? (
          <>
            <div className="ngo-dash-v2-verify__icon ngo-dash-v2-verify__icon--success">
              <ShieldCheck size={22} />
            </div>
            <div className="ngo-dash-v2-verify__body">
              <strong>Verified NGO</strong>
              <p>Your organization profile has been verified.</p>
            </div>
            <div className="ngo-dash-v2-verify__actions">
              <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate('/dashboard/ngo-profile')}>
                View NGO Profile
              </button>
              <button type="button" className="ngo-btn ngo-btn--ghost" onClick={() => navigate('/dashboard/ngo-verify')}>
                View Documents
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ngo-dash-v2-verify__icon ngo-dash-v2-verify__icon--warn">
              <Shield size={22} />
            </div>
            <div className="ngo-dash-v2-verify__body">
              <strong>{submitted ? 'Verification Under Review' : verificationStatus === 'rejected' ? 'Verification Rejected' : 'Verification Required'}</strong>
              <p>{verificationMessage}</p>
            </div>
            {!submitted && verificationStatus !== 'rejected' && (
              <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-verify')}>
                Complete Verification
              </button>
            )}
            {verificationStatus === 'rejected' && (
              <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-verify')}>
                Resubmit Documents
              </button>
            )}
          </>
        )}
      </section>

      {!verified && (
        <section className="ngo-dash-v2-unverified-guide">
          <h2>Getting Started</h2>
          <p>Until your NGO is verified, you can use Dashboard, Verification, Profile, Settings, and Notifications.</p>
          <ul>
            <li>Upload required documents in Verification</li>
            <li>Keep your profile and contact details up to date</li>
            <li>Track review status from this dashboard</li>
          </ul>
          <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-verify')}>
            Go to Verification
          </button>
        </section>
      )}

      {verified && !suspended && (
        <>
      <section className="ngo-dash-v2-kpis" aria-label="Key metrics">
        {kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
      </section>

      <div className="ngo-dash-v2-toolbar">
        <h2>Support Overview</h2>
        <div className="ngo-dash-v2-period">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`ngo-dash-v2-period__btn${period === opt.id ? ' is-active' : ''}`}
              onClick={() => changePeriod(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ngo-dash-v2-charts">
        <section className="ngo-dash-v2-card">
          <div className="ngo-dash-v2-card__head">
            <h3>Support Received</h3>
            <span className="ngo-dash-v2-card__meta">Funds &amp; items over time</span>
          </div>
          {trendData.some((d) => d.value > 0) ? (
            <DonationTrendChart data={trendData} />
          ) : (
            <EmptyPanel
              title="No support data yet"
              description="Approved fund requests and item allocations will appear here."
            />
          )}
        </section>

        <section className="ngo-dash-v2-card">
          <div className="ngo-dash-v2-card__head">
            <h3>Support by Type</h3>
            <span className="ngo-dash-v2-card__meta">Category breakdown</span>
          </div>
          {typeData.length ? (
            <DonationDistributionChart data={typeData} />
          ) : (
            <EmptyPanel
              title="No category data"
              description="Support breakdown will appear once you receive approved assistance."
            />
          )}
        </section>
      </div>

      <div className="ngo-dash-v2-grid">
        <section className="ngo-dash-v2-card">
          <div className="ngo-dash-v2-card__head">
            <h3>Recent Activity</h3>
            <button type="button" className="ngo-link-btn" onClick={() => navigate('/dashboard/ngo-my-requests')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {activities.length ? (
            <ul className="ngo-activity-list">
              {activities.map((item) => (
                <li key={item.id} className="ngo-activity-list__item">
                  <div className="ngo-activity-list__main">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="ngo-activity-list__meta">
                    <span>{item.amount_display}</span>
                    <StatusBadge status={item.status} />
                    <time>{item.relative_time}</time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyPanel title="No activity yet" description="Request updates and allocations will show here." />
          )}
        </section>

        <section className="ngo-dash-v2-card">
          <div className="ngo-dash-v2-card__head">
            <h3>Pending Requests</h3>
            <button type="button" className="ngo-link-btn" onClick={() => navigate('/dashboard/ngo-my-requests')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {pending.length ? (
            <ul className="ngo-pending-list">
              {pending.map((item) => (
                <li key={`${item.request_type}-${item.id}`} className="ngo-pending-list__item">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.amount_display} · {item.relative_time}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyPanel title="No pending requests" description="All caught up — no requests awaiting review." />
          )}
        </section>
      </div>

      <section className="ngo-dash-v2-impact">
        <div>
          <h3>Impact Snapshot</h3>
          <p>Real outcomes from your approved requests and beneficiaries.</p>
        </div>
        <div className="ngo-dash-v2-impact__stats">
          <div><strong>{impact.beneficiaries_helped ?? 0}</strong><span>Beneficiaries</span></div>
          <div><strong>₹{Number(impact.funds_distributed || 0).toLocaleString('en-IN')}</strong><span>Funds received</span></div>
          <div><strong>{impact.items_distributed ?? 0}</strong><span>Items allocated</span></div>
          <div><strong>{impact.approved_requests ?? 0}</strong><span>Approved requests</span></div>
        </div>
        <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate('/dashboard/ngo-reports')} disabled={!verified}>
          {verified ? 'View Impact Report' : <><Lock size={14} /> Verify to view reports</>}
        </button>
      </section>

      <section className="ngo-dash-v2-quick">
        <h3>Quick Actions</h3>
        <div className="ngo-dash-v2-quick__grid">
          <button type="button" className="ngo-quick-card" disabled={!verified} onClick={() => navigate('/dashboard/ngo-request-funds')}>
            <Banknote size={18} /> Request Funds {!verified && <Lock size={14} />}
          </button>
          <button type="button" className="ngo-quick-card" disabled={!verified} onClick={() => navigate('/dashboard/ngo-request-donations')}>
            <Package size={18} /> Request Items {!verified && <Lock size={14} />}
          </button>
          <button type="button" className="ngo-quick-card" disabled={!verified} onClick={() => navigate('/dashboard/ngo-beneficiaries')}>
            <Users size={18} /> Beneficiaries {!verified && <Lock size={14} />}
          </button>
          <button type="button" className="ngo-quick-card" onClick={() => navigate('/dashboard/ngo-programs')}>
            <Layers size={18} /> Programs
          </button>
        </div>
      </section>
        </>
      )}

      {loading && (
        <div className="ngo-dash-v2-loading" role="status">
          <Loader2 size={18} className="ngo-spin" /> Updating…
        </div>
      )}
    </div>
  );
}
