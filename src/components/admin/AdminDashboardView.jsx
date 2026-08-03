import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  LayoutDashboard, Shield, Users, Building2, FileHeart, Package, CheckCircle,
  IndianRupee, AlertTriangle, Bell, ArrowRight, TrendingUp, Activity,
  UserCheck, ClipboardList, Gift, BarChart3, Settings, Megaphone, FileText,
  Download, Server, Database, Cloud, HardDrive, CreditCard, Eye, X, Check,
  Calendar, PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  getAdminKpis, getDonationOverview, getPlatformAnalytics, buildAdminActivity,
  getAdminNotifications, verificationStatusClass, entityTypeClass, assistanceStatusClass,
  formatFunds, SYSTEM_HEALTH, ADMIN_ANNOUNCEMENTS, REPORT_DOWNLOADS
} from '../../utils/adminHelpers';
import { getAdminNgoList, ADMIN_INVENTORY_ITEMS, ADMIN_FUND_SUMMARY, PRIORITY_QUEUE_ITEMS, getInventorySummary } from '../../data/adminMockData';

function DashIcon({ name, size = 18 }) {
  const key = (name || 'bell').split('-').map((p, i) =>
    i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)
  ).join('');
  const Cmp = LucideIcons[key] || Bell;
  return <Cmp size={size} />;
}

function MiniBarChart({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div className="admin-dash-chart" aria-hidden="true">
      {data.map((v, i) => (
        <div
          key={i}
          className="admin-dash-chart__bar"
          style={{ height: `${(v / max) * 100}%`, background: color }}
        />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="admin-dash-skeleton" aria-hidden="true">
      <div className="admin-dash-skeleton__hero" />
      <div className="admin-dash-skeleton__kpis">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="admin-dash-skeleton__kpi" />)}
      </div>
      <div className="admin-dash-skeleton__row">
        <div className="admin-dash-skeleton__panel" />
        <div className="admin-dash-skeleton__panel" />
      </div>
    </div>
  );
}

function todayFormatted() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function AdminDashboardView() {
  const state = useApp();
  const { verifications, donations, requests, receiverApplications, verifyEntity, rejectEntity } = state;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const kpis = getAdminKpis(state);
  const donationOverview = getDonationOverview(donations);
  const analytics = getPlatformAnalytics(state);
  const activity = buildAdminActivity(verifications, donations, receiverApplications);
  const adminNotifs = getAdminNotifications(state);
  const recentVerifications = verifications.filter((v) => v.status === 'Pending').slice(0, 5);
  const assistanceRequests = (receiverApplications || []).slice(0, 4);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const kpiCards = [
    { key: 'pendingDonor', icon: UserCheck, emoji: '👤', label: 'Pending Donor Verification', value: kpis.pendingDonor, trend: '+2 today', accent: 'blue' },
    { key: 'pendingReceiver', icon: Users, emoji: '👥', label: 'Pending Receiver Verification', value: kpis.pendingReceiver, trend: 'Needs review', accent: 'orange' },
    { key: 'pendingNgo', icon: Building2, emoji: '🏛', label: 'Pending NGO Verification', value: kpis.pendingNgo, trend: 'Priority queue', accent: 'purple' },
    { key: 'openFinancial', icon: FileHeart, emoji: '💰', label: 'Open Financial Assistance', value: kpis.openFinancial, trend: '3 high priority', accent: 'red' },
    { key: 'pendingItems', icon: Package, emoji: '📦', label: 'Pending Item Donations', value: kpis.pendingItems, trend: 'Pickup scheduled', accent: 'orange' },
    { key: 'completedDonations', icon: CheckCircle, emoji: '✅', label: 'Completed Donations', value: kpis.completedDonations, trend: '+8 this week', accent: 'green' },
    { key: 'activeNgos', icon: Shield, emoji: '🛡', label: 'Active NGOs', value: kpis.activeNgos, trend: 'Verified partners', accent: 'green' },
    { key: 'fundsManaged', icon: IndianRupee, emoji: '💵', label: 'Platform Funds Managed', value: formatFunds(kpis.fundsManaged), trend: '+12% MoM', accent: 'blue', isText: true }
  ];

  const priorityActions = [
    { icon: UserCheck, title: 'Verify New Donors', desc: 'Review donor identity documents', btn: 'Open Queue', path: '/dashboard/admin-verifications' },
    { icon: FileHeart, title: 'Review Receiver Requests', desc: 'Assess financial assistance applications', btn: 'Review', path: '/dashboard/admin-financial-assistance' },
    { icon: Building2, title: 'Approve NGOs', desc: 'Validate NGO registration documents', btn: 'Approve', path: '/dashboard/admin-ngos' },
    { icon: Users, title: 'Assign NGO', desc: 'Match requests to verified partners', btn: 'Assign', path: '/dashboard/admin-ngos', mock: true },
    { icon: Gift, title: 'Review Donations', desc: 'Monitor incoming donations and pickups', btn: 'Manage', path: '/dashboard/admin-donations' },
    { icon: AlertTriangle, title: 'Resolve Reports', desc: 'Address flagged platform issues', btn: 'Resolve', path: '/dashboard/admin-logs' }
  ];

  const quickActions = [
    { icon: Shield, label: 'Verify Users', path: '/dashboard/admin-verifications' },
    { icon: Building2, label: 'Assign NGO', path: '/dashboard/admin-ngos', mock: true },
    { icon: Megaphone, label: 'Create Announcement', mock: true },
    { icon: FileText, label: 'Generate Report', path: '/dashboard/admin-reports' },
    { icon: Gift, label: 'Manage Donations', path: '/dashboard/admin-donations' },
    { icon: Users, label: 'Manage Users', path: '/dashboard/admin-users' },
    { icon: BarChart3, label: 'View Analytics', path: '/dashboard/admin-reports' },
    { icon: Settings, label: 'System Settings', path: '/dashboard/admin-settings' }
  ];

  const healthIcon = { server: Server, database: Database, api: Cloud, storage: HardDrive, notifications: Bell, payment: CreditCard };
  const healthLabel = { healthy: 'Healthy', warning: 'Warning', issue: 'Issue' };

  const handleAction = (path, mock, label) => {
    if (mock) {
      showToast(`${label} — wireframe preview only.`, 'info');
      return;
    }
    navigate(path);
  };

  const handleApprove = (id, name) => {
    verifyEntity(id);
    showToast(`${name} verified successfully.`, 'success');
  };

  const handleReject = (id, name) => {
    rejectEntity(id);
    showToast(`${name} rejected.`, 'info');
  };

  if (loading) {
    return (
      <div className="admin-command-dashboard admin-command-dashboard--premium page-route">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="admin-command-dashboard admin-command-dashboard--premium page-route">
      {/* Hero */}
      <section className="admin-dash-hero admin-dash-animate">
        <div className="admin-dash-hero__content">
          <span className="admin-dash-hero__eyebrow">
            <LayoutDashboard size={14} /> Admin Command Center
          </span>
          <h1>Command Dashboard</h1>
          <p>Manage and monitor the Give Away platform from one centralized location.</p>
          <div className="admin-dash-hero__meta">
            <span className="admin-dash-hero__date">
              <Calendar size={14} /> {todayFormatted()}
            </span>
            <span className="admin-dash-hero__status">
              <span className="admin-dash-hero__status-dot" aria-hidden="true" />
              All Systems Operational
            </span>
          </div>
        </div>
        <div className="admin-dash-hero__visual" aria-hidden="true">
          <div className="admin-dash-hero__float">
            <PieChart size={48} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* 8 KPI Cards */}
      <section className="admin-dash-kpis admin-dash-animate admin-dash-animate--d1" aria-label="Key metrics">
        {kpiCards.map((card) => (
          <article key={card.key} className={`admin-dash-kpi admin-dash-kpi--${card.accent}`}>
            <div className="admin-dash-kpi__top">
              <span className="admin-dash-kpi__emoji" aria-hidden="true">{card.emoji}</span>
              <div className={`admin-dash-kpi__icon admin-dash-kpi__icon--${card.accent}`}>
                <card.icon size={18} strokeWidth={2} />
              </div>
            </div>
            <p className={`admin-dash-kpi__value ${card.isText ? 'admin-dash-kpi__value--sm' : ''}`}>{card.value}</p>
            <p className="admin-dash-kpi__label">{card.label}</p>
            <p className="admin-dash-kpi__trend">
              <TrendingUp size={11} aria-hidden="true" /> {card.trend}
            </p>
          </article>
        ))}
      </section>

      {/* Priority Actions */}
      <section className="admin-dash-section admin-dash-animate admin-dash-animate--d2">
        <h2 className="admin-dash-section__title">Priority Actions</h2>
        <div className="admin-dash-priority-grid">
          {priorityActions.map((action) => (
            <article key={action.title} className="admin-dash-priority-card">
              <div className="admin-dash-priority-card__icon">
                <action.icon size={22} strokeWidth={1.75} />
              </div>
              <div className="admin-dash-priority-card__body">
                <strong>{action.title}</strong>
                <p>{action.desc}</p>
              </div>
              <button
                type="button"
                className="admin-dash-btn admin-dash-btn--primary admin-dash-btn--sm"
                onClick={() => handleAction(action.path, action.mock, action.title)}
              >
                {action.btn}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Verification + Assistance */}
      <div className="admin-dash-grid-2 admin-dash-animate admin-dash-animate--d3">
        <section className="admin-dash-panel">
          <div className="admin-dash-panel__head">
            <h2 className="admin-dash-section__title">Recent Verification Requests</h2>
            <button type="button" className="admin-dash-link" onClick={() => navigate('/dashboard/admin-verifications')}>
              View all
            </button>
          </div>
          {recentVerifications.length ? (
            <div className="admin-dash-verify-list">
              {recentVerifications.map((v) => (
                <div key={v.id} className="admin-dash-verify-row">
                  <div className="admin-dash-verify-row__user">
                    <strong>{v.name}</strong>
                    <span className={`admin-dash-entity ${entityTypeClass(v.type)}`}>{v.type}</span>
                  </div>
                  <span className="admin-dash-verify-row__type">{v.doc || v.type}</span>
                  <span className="admin-dash-verify-row__date">{v.submitted}</span>
                  <span className={`admin-dash-badge ${verificationStatusClass(v.status)}`}>{v.status}</span>
                  <div className="admin-dash-verify-row__actions">
                    <button type="button" className="admin-dash-verify-btn admin-dash-verify-btn--approve" onClick={() => handleApprove(v.id, v.name)} title="Approve">
                      <Check size={14} />
                    </button>
                    <button type="button" className="admin-dash-verify-btn admin-dash-verify-btn--reject" onClick={() => handleReject(v.id, v.name)} title="Reject">
                      <X size={14} />
                    </button>
                    <button type="button" className="admin-dash-verify-btn admin-dash-verify-btn--view" onClick={() => navigate('/dashboard/admin-verifications')} title="View">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-dash-empty">
              <Shield size={36} strokeWidth={1.25} />
              <h3>All caught up</h3>
              <p>No pending verification requests at the moment.</p>
            </div>
          )}
        </section>

        <section className="admin-dash-panel">
          <div className="admin-dash-panel__head">
            <h2 className="admin-dash-section__title">Latest Financial Assistance</h2>
            <button type="button" className="admin-dash-link" onClick={() => navigate('/dashboard/admin-verifications')}>
              View all
            </button>
          </div>
          {assistanceRequests.length ? (
            <div className="admin-dash-assist-list">
              {assistanceRequests.map((app) => (
                <article key={app.id} className="admin-dash-assist-card">
                  <div className="admin-dash-assist-card__head">
                    <span className="admin-dash-assist-card__id">{app.id}</span>
                    <span className={`admin-dash-badge ${assistanceStatusClass(app.status)}`}>{app.status}</span>
                  </div>
                  <div className="admin-dash-assist-card__grid">
                    <div><span>Receiver</span><strong>{app.receiverName}</strong></div>
                    <div><span>Category</span><strong>{app.assistanceType}</strong></div>
                    <div><span>Amount</span><strong>₹{Number(app.amount).toLocaleString('en-IN')}</strong></div>
                    <div><span>Priority</span><strong className="admin-dash-priority--high">High</strong></div>
                    <div><span>Assigned NGO</span><strong>Asha Kiran Foundation</strong></div>
                  </div>
                  <button type="button" className="admin-dash-btn admin-dash-btn--ghost" onClick={() => navigate('/dashboard/admin-verifications')}>
                    View Details <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-dash-empty">
              <FileHeart size={36} strokeWidth={1.25} />
              <h3>No assistance requests</h3>
              <p>New receiver applications will appear here.</p>
            </div>
          )}
        </section>
      </div>

      {/* Donation Overview + Analytics */}
      <div className="admin-dash-grid-2 admin-dash-animate admin-dash-animate--d4">
        <section className="admin-dash-panel">
          <h2 className="admin-dash-section__title">Donation Overview</h2>
          <div className="admin-dash-overview-stats">
            <div className="admin-dash-overview-stat">
              <span className="admin-dash-overview-stat__num">{donationOverview.today}</span>
              <span className="admin-dash-overview-stat__lbl">Today</span>
            </div>
            <div className="admin-dash-overview-stat">
              <span className="admin-dash-overview-stat__num">{donationOverview.week}</span>
              <span className="admin-dash-overview-stat__lbl">This Week</span>
            </div>
            <div className="admin-dash-overview-stat">
              <span className="admin-dash-overview-stat__num">{donationOverview.month}</span>
              <span className="admin-dash-overview-stat__lbl">This Month</span>
            </div>
          </div>
          <div className="admin-dash-overview-charts">
            <div className="admin-dash-overview-chart">
              <div className="admin-dash-overview-chart__head">
                <span>Money Donations</span>
                <strong>{donationOverview.money}</strong>
              </div>
              <MiniBarChart data={donationOverview.chartMoney} color="#2563EB" />
            </div>
            <div className="admin-dash-overview-chart">
              <div className="admin-dash-overview-chart__head">
                <span>Item Donations</span>
                <strong>{donationOverview.items}</strong>
              </div>
              <MiniBarChart data={donationOverview.chartItems} color="#22C55E" />
            </div>
          </div>
        </section>

        <section className="admin-dash-panel">
          <h2 className="admin-dash-section__title">Platform Analytics</h2>
          <div className="admin-dash-analytics-grid">
            {[
              ['Total Donors', analytics.totalDonors, 'blue'],
              ['Total Receivers', analytics.totalReceivers, 'orange'],
              ['Total NGOs', analytics.totalNgos, 'purple'],
              ['Active Beneficiaries', analytics.activeBeneficiaries, 'green'],
              ['Successful Deliveries', analytics.successfulDeliveries, 'green'],
              ['Pending Deliveries', analytics.pendingDeliveries, 'orange'],
              ['Donation Success Rate', `${analytics.successRate}%`, 'blue'],
              ['Avg. Approval Time', analytics.avgApprovalTime, 'purple']
            ].map(([label, val, color]) => (
              <div key={label} className={`admin-dash-analytic admin-dash-analytic--${color}`}>
                <span className="admin-dash-analytic__val">{val}</span>
                <span className="admin-dash-analytic__lbl">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Announcements */}
      <section className="admin-dash-announce admin-dash-animate admin-dash-animate--d5">
        <div className="admin-dash-announce__content">
          <h2 className="admin-dash-section__title">Recent Announcements</h2>
          <div className="admin-dash-announce-list">
            {ADMIN_ANNOUNCEMENTS.map((a) => (
              <article key={a.id} className="admin-dash-announce-item">
                <Megaphone size={16} aria-hidden="true" />
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.preview}</p>
                  <span>{a.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button type="button" className="admin-dash-btn admin-dash-btn--outline" onClick={() => showToast('Create Announcement — wireframe preview.', 'info')}>
          <Megaphone size={16} /> Create Announcement
        </button>
      </section>

      {/* Activity + Notifications */}
      <div className="admin-dash-grid-2 admin-dash-animate admin-dash-animate--d6">
        <section className="admin-dash-panel admin-dash-panel--timeline">
          <h2 className="admin-dash-section__title">Recent Activity</h2>
          <ol className="admin-dash-timeline">
            {activity.map((item, i) => (
              <li key={item.time + item.label} className={`admin-dash-timeline__item ${i === 0 ? 'is-current' : ''}`}>
                <div className="admin-dash-timeline__marker">
                  <div className="admin-dash-timeline__dot">
                    <DashIcon name={item.icon} size={14} />
                  </div>
                  {i < activity.length - 1 && <div className="admin-dash-timeline__line" aria-hidden="true" />}
                </div>
                <div className="admin-dash-timeline__content">
                  <span className="admin-dash-timeline__time">{item.time}</span>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="admin-dash-panel">
          <h2 className="admin-dash-section__title">Notifications</h2>
          <div className="admin-dash-notif-list">
            {adminNotifs.map((n) => (
              <article key={n.id} className={`admin-dash-notif admin-dash-notif--${n.type}`}>
                <div className="admin-dash-notif__icon">
                  <DashIcon name={n.icon} size={18} />
                </div>
                <div className="admin-dash-notif__body">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <span>{n.time}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Command Center Modules */}
      <section className="admin-dash-modules admin-dash-animate admin-dash-animate--d6">
        <h2 className="admin-dash-section__title">Command Center Modules</h2>
        <div className="admin-dash-module-quick">
          {[
            ['NGO Management', Building2, '/dashboard/admin-ngos'],
            ['Item Inventory', Package, '/dashboard/admin-inventory'],
            ['Fund Management', IndianRupee, '/dashboard/admin-funds'],
            ['Donations', Gift, '/dashboard/admin-donations'],
            ['Users', Users, '/dashboard/admin-users'],
            ['Reports', BarChart3, '/dashboard/admin-reports']
          ].map(([label, Icon, path]) => (
            <button key={label} type="button" className="admin-dash-module-quick__card" onClick={() => navigate(path)}>
              <span><Icon size={18} /></span>
              {label}
            </button>
          ))}
        </div>
        <div className="admin-dash-modules__grid">
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><Building2 size={16} /> Recent NGOs</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-ngos')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              {getAdminNgoList(state.ngos).slice(0, 3).map((n) => (
                <li key={n.id}><span>{n.logo} {n.name}</span><span>{n.verificationStatus}</span></li>
              ))}
            </ul>
          </div>
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><Gift size={16} /> Recent Donations</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-donations')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              {donations.slice(0, 3).map((d) => (
                <li key={d.id}><span>{d.donor}</span><span>{d.status}</span></li>
              ))}
            </ul>
          </div>
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><Package size={16} /> Inventory Overview</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-inventory')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              {(() => {
                const inv = getInventorySummary(ADMIN_INVENTORY_ITEMS);
                return [
                  ['Total Items', inv.total],
                  ['Available', inv.available],
                  ['Reserved', inv.reserved]
                ].map(([l, v]) => <li key={l}><span>{l}</span><strong>{v}</strong></li>);
              })()}
            </ul>
          </div>
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><IndianRupee size={16} /> Fund Overview</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-funds')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              <li><span>Available Balance</span><strong>{formatFunds(ADMIN_FUND_SUMMARY.availableBalance)}</strong></li>
              <li><span>Allocated</span><strong>{formatFunds(ADMIN_FUND_SUMMARY.allocated)}</strong></li>
              <li><span>Pending</span><strong>{formatFunds(ADMIN_FUND_SUMMARY.pendingAllocation)}</strong></li>
            </ul>
          </div>
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><Bell size={16} /> Notifications</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-notifications')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              {adminNotifs.slice(0, 3).map((n) => (
                <li key={n.id}><span>{n.title}</span><span>{n.time}</span></li>
              ))}
            </ul>
          </div>
          <div className="admin-dash-module-widget">
            <div className="admin-dash-module-widget__head">
              <h3><AlertTriangle size={16} /> Priority Tasks</h3>
              <button type="button" className="admin-dash-module-link" onClick={() => navigate('/dashboard/admin-priority-queue')}>View all</button>
            </div>
            <ul className="admin-dash-module-widget__list">
              {PRIORITY_QUEUE_ITEMS.slice(0, 3).map((t) => (
                <li key={t.id}><span>{t.title}</span><span>{t.priority}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="admin-dash-section admin-dash-animate admin-dash-animate--d7">
        <h2 className="admin-dash-section__title">Quick Actions</h2>
        <div className="admin-dash-quick-grid">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="admin-dash-quick-card"
              onClick={() => handleAction(action.path, action.mock, action.label)}
            >
              <span className="admin-dash-quick-card__icon">
                <action.icon size={20} strokeWidth={1.75} />
              </span>
              <span>{action.label}</span>
              <ArrowRight size={14} className="admin-dash-quick-card__arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {/* Reports + System Health */}
      <div className="admin-dash-grid-2 admin-dash-animate admin-dash-animate--d8">
        <section className="admin-dash-panel">
          <h2 className="admin-dash-section__title">Reports</h2>
          <div className="admin-dash-reports-grid">
            {REPORT_DOWNLOADS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`admin-dash-report-card admin-dash-report-card--${r.color}`}
                onClick={() => showToast(`Downloading ${r.title}… (mock)`, 'info')}
              >
                <div className="admin-dash-report-card__icon">
                  <DashIcon name={r.icon} size={20} />
                </div>
                <div>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </div>
                <Download size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="admin-dash-panel">
          <div className="admin-dash-panel__head">
            <h2 className="admin-dash-section__title">System Health</h2>
            <span className="admin-dash-health-live">
              <Activity size={14} /> Live
            </span>
          </div>
          <div className="admin-dash-health-grid">
            {SYSTEM_HEALTH.map((svc) => {
              const Icon = healthIcon[svc.id] || Server;
              return (
                <div key={svc.id} className={`admin-dash-health-item admin-dash-health-item--${svc.status}`}>
                  <div className="admin-dash-health-item__icon">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="admin-dash-health-item__body">
                    <strong>{svc.label}</strong>
                    <span>{healthLabel[svc.status]}</span>
                  </div>
                  <span className={`admin-dash-health-dot admin-dash-health-dot--${svc.status}`} aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
