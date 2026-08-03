import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ScrollText, Download, RefreshCw, Search, Eye, X,
  ArrowUpRight, AlertTriangle, Filter
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { AdminBadge } from '../AdminModuleShell';
import {
  ADMIN_LOGS_SUMMARY, ADMIN_LOGS_TRENDS, ADMIN_LOG_CATEGORIES,
  ADMIN_LOGS_TIMELINE, ADMIN_LOGS_ENTRIES, ADMIN_LOG_ALERTS, ADMIN_LOG_QUICK_STATS
} from '../../../data/adminLogsMockData';

const SUMMARY_KPIS = [
  { key: 'totalToday', icon: '📋', label: 'Total Logs Today', accent: 'blue' },
  { key: 'userActivities', icon: '👤', label: 'User Activities', accent: 'green' },
  { key: 'adminActions', icon: '🛡', label: 'Admin Actions', accent: 'purple' },
  { key: 'ngoActivities', icon: '🏢', label: 'NGO Activities', accent: 'blue' },
  { key: 'warnings', icon: '⚠', label: 'Warning Events', accent: 'orange' },
  { key: 'criticalErrors', icon: '❌', label: 'Critical Errors', accent: 'red' }
];

const SEVERITY_VARIANT = { INFO: 'blue', SUCCESS: 'green', WARNING: 'orange', ERROR: 'red' };

function LogsSkeleton() {
  return (
    <div className="logs-dash logs-dash--loading" aria-hidden="true">
      <div className="logs-dash-skeleton logs-dash-skeleton--header" />
      <div className="logs-dash-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="logs-dash-skeleton logs-dash-skeleton--kpi" />)}
      </div>
      <div className="logs-dash-skeleton logs-dash-skeleton--filters" />
      <div className="logs-dash-skeleton-row">
        <div className="logs-dash-skeleton logs-dash-skeleton--timeline" />
        <div className="logs-dash-skeleton logs-dash-skeleton--alerts" />
      </div>
      <div className="logs-dash-skeleton logs-dash-skeleton--table" />
    </div>
  );
}

function LogDetailModal({ log, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!log) return null;

  return createPortal(
    <div className="logs-dash-modal-overlay" role="presentation">
      <div className="logs-dash-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="logs-dash-modal" role="dialog" aria-modal="true" aria-labelledby="log-modal-title" onClick={(e) => e.stopPropagation()}>
        <header className="logs-dash-modal__header">
          <div>
            <span className="logs-dash-modal__id">{log.id}</span>
            <h2 id="log-modal-title">Log Details</h2>
          </div>
          <button type="button" className="logs-dash-modal__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        <div className="logs-dash-modal__body">
          <dl className="logs-dash-modal__grid">
            <div><dt>Timestamp</dt><dd>{log.datetime}</dd></div>
            <div><dt>User</dt><dd>{log.user}</dd></div>
            <div><dt>Role</dt><dd>{log.role}</dd></div>
            <div><dt>Module</dt><dd>{log.module}</dd></div>
            <div><dt>Action Performed</dt><dd>{log.activity}</dd></div>
            <div><dt>Status</dt><dd><AdminBadge variant={log.severity === 'ERROR' ? 'red' : log.severity === 'WARNING' ? 'orange' : 'green'}>{log.status}</AdminBadge></dd></div>
            <div><dt>Device</dt><dd>{log.device}</dd></div>
            <div><dt>Browser</dt><dd>{log.browser}</dd></div>
            <div><dt>IP Address</dt><dd>{log.ip}</dd></div>
            <div className="logs-dash-modal__full"><dt>Description</dt><dd>{log.description}</dd></div>
          </dl>
        </div>
        <footer className="logs-dash-modal__footer">
          <button type="button" className="logs-dash-btn logs-dash-btn--outline" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

export default function AdminSystemLogs() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchUser, setSearchUser] = useState('');
  const [searchId, setSearchId] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('2026-07-10');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const filteredLogs = useMemo(() => {
    return ADMIN_LOGS_ENTRIES.filter((log) => {
      const matchCat = category === 'all' || log.category === category;
      const matchUser = !searchUser || log.user.toLowerCase().includes(searchUser.toLowerCase());
      const matchId = !searchId || log.id.toLowerCase().includes(searchId.toLowerCase());
      const matchRole = roleFilter === 'All' || log.role === roleFilter;
      const matchAction = actionFilter === 'All' || log.activity.includes(actionFilter);
      const matchSeverity = severityFilter === 'All' || log.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchDate = !dateFilter || log.datetime.startsWith(dateFilter);
      return matchCat && matchUser && matchId && matchRole && matchAction && matchSeverity && matchStatus && matchDate;
    });
  }, [category, searchUser, searchId, roleFilter, actionFilter, severityFilter, statusFilter, dateFilter]);

  const clearFilters = () => {
    setCategory('all');
    setSearchUser('');
    setSearchId('');
    setRoleFilter('All');
    setActionFilter('All');
    setSeverityFilter('All');
    setStatusFilter('All');
    setDateFilter('2026-07-10');
  };

  if (loading) {
    return <div className="logs-dash page-route"><LogsSkeleton /></div>;
  }

  return (
    <div className="logs-dash page-route">
      <header className="logs-dash-header">
        <div className="logs-dash-header__text">
          <h1>System Logs</h1>
          <p>Monitor platform activities, administrator actions, user events, security logs, and audit history.</p>
        </div>
        <div className="logs-dash-header__actions">
          <button type="button" className="logs-dash-btn logs-dash-btn--outline" onClick={() => showToast('Exporting logs (mock).', 'info')}>
            <Download size={16} /> Export Logs
          </button>
          <button type="button" className="logs-dash-btn logs-dash-btn--outline" onClick={() => showToast('Downloading CSV (mock).', 'info')}>
            <ScrollText size={16} /> Download CSV
          </button>
          <button type="button" className="logs-dash-btn logs-dash-btn--primary" onClick={() => showToast('Logs refreshed (mock).', 'success')}>
            <RefreshCw size={16} /> Refresh Logs
          </button>
        </div>
      </header>

      <div className="logs-dash-summary-grid">
        {SUMMARY_KPIS.map((k, i) => (
          <article key={k.key} className={`logs-dash-summary logs-dash-summary--${k.accent} logs-dash-animate logs-dash-animate--d${i + 1}`}>
            <span className="logs-dash-summary__icon" aria-hidden="true">{k.icon}</span>
            <strong>{ADMIN_LOGS_SUMMARY[k.key].toLocaleString('en-IN')}</strong>
            <span className="logs-dash-summary__lbl">{k.label}</span>
            <em><ArrowUpRight size={11} /> {ADMIN_LOGS_TRENDS[k.key]}</em>
          </article>
        ))}
      </div>

      <div className="logs-dash-categories">
        {ADMIN_LOG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`logs-dash-cat-card ${category === cat.id ? 'is-active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            <span aria-hidden="true">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="logs-dash-filters">
        <div className="logs-dash-filters__search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search by user name…" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} aria-label="Search by user" />
        </div>
        <div className="logs-dash-filters__search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search by Log ID…" value={searchId} onChange={(e) => setSearchId(e.target.value)} aria-label="Search by log ID" />
        </div>
        <input type="date" className="logs-dash-filters__date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} aria-label="Date filter" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Role filter">
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Donor">Donor</option>
          <option value="Receiver">Receiver</option>
          <option value="NGO">NGO</option>
          <option value="System">System</option>
        </select>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} aria-label="Action filter">
          <option value="All">All Actions</option>
          <option value="Verification">Verification</option>
          <option value="Donation">Donation</option>
          <option value="Fund">Fund</option>
          <option value="Login">Login</option>
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} aria-label="Severity filter">
          <option value="All">All Severity</option>
          <option value="INFO">INFO</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="WARNING">WARNING</option>
          <option value="ERROR">ERROR</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status filter">
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Blocked">Blocked</option>
        </select>
        <button type="button" className="logs-dash-btn logs-dash-btn--primary" onClick={() => showToast('Filters applied (mock).', 'info')}>
          <Filter size={14} /> Apply Filters
        </button>
        <button type="button" className="logs-dash-btn logs-dash-btn--outline" onClick={clearFilters}>Clear</button>
      </div>

      <div className="logs-dash-mid-row">
        <section className="logs-dash-card logs-dash-card--timeline">
          <h3>Recent Activities</h3>
          <ol className="logs-dash-timeline">
            {ADMIN_LOGS_TIMELINE.map((ev) => (
              <li key={ev.time + ev.title}>
                <span className="logs-dash-timeline__icon" style={{ background: `${ev.color}18`, color: ev.color }}>{ev.icon}</span>
                <div className="logs-dash-timeline__body">
                  <span className="logs-dash-timeline__time">{ev.time}</span>
                  <strong>{ev.title}</strong>
                  <span>{ev.user}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="logs-dash-card logs-dash-card--alerts">
          <h3><AlertTriangle size={16} /> Recent Alerts</h3>
          <ul className="logs-dash-alerts">
            {ADMIN_LOG_ALERTS.map((a) => (
              <li key={a.text} className={`logs-dash-alerts__item logs-dash-alerts__item--${a.type}`}>
                <span aria-hidden="true">{a.icon}</span>
                <p>{a.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="logs-dash-card">
        <div className="logs-dash-card__head">
          <h3>System Log Table</h3>
          <span className="logs-dash-card__meta">{filteredLogs.length} entries</span>
        </div>
        {filteredLogs.length ? (
          <div className="logs-dash-table-wrap">
            <table className="logs-dash-table">
              <thead>
                <tr>
                  <th>Log ID</th><th>Date & Time</th><th>User</th><th>Role</th>
                  <th>Activity</th><th>Module</th><th>Severity</th><th>Status</th>
                  <th>IP Address</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="logs-dash-table__id">{log.id}</td>
                    <td className="logs-dash-table__date">{log.datetime}</td>
                    <td>{log.user}</td>
                    <td>{log.role}</td>
                    <td>{log.activity}</td>
                    <td>{log.module}</td>
                    <td><AdminBadge variant={SEVERITY_VARIANT[log.severity]}>{log.severity}</AdminBadge></td>
                    <td>{log.status}</td>
                    <td className="logs-dash-table__ip">{log.ip}</td>
                    <td>
                      <div className="logs-dash-table__actions">
                        <button type="button" className="logs-dash-btn logs-dash-btn--ghost" onClick={() => setSelectedLog(log)}>
                          <Eye size={14} /> View
                        </button>
                        <button type="button" className="logs-dash-btn logs-dash-btn--ghost" onClick={() => showToast(`Downloading ${log.id} (mock).`, 'info')}>
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="logs-dash-empty">
            <ScrollText size={48} strokeWidth={1.25} />
            <h3>No logs found</h3>
            <p>Try adjusting your filters or category selection.</p>
          </div>
        )}
      </section>

      <section className="logs-dash-card">
        <h3>Quick Statistics</h3>
        <div className="logs-dash-stats-grid">
          {ADMIN_LOG_QUICK_STATS.map((s) => (
            <article key={s.label} className="logs-dash-stat-card">
              <span className="logs-dash-stat-card__lbl">{s.label}</span>
              <strong>{s.value}</strong>
              <em>{s.sub}</em>
            </article>
          ))}
        </div>
      </section>

      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
