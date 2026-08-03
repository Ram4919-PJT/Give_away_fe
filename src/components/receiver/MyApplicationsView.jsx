import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Search, Filter, FileText, Download, Eye, X, ClipboardList,
  Calendar, IndianRupee, ChevronRight, CheckCircle, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  getReceiverApps,
  applicationStatusClass,
  getCardTimelineIndex
} from '../../utils/receiverHelpers';
import { formatCurrency } from '../../utils/donorHelpers';
import {
  ASSISTANCE_TYPE_ICONS,
  RECEIVER_CARD_TIMELINE,
  APPLICATION_STATUS_FILTERS
} from '../../data/receiverConstants';

function CardTimeline({ status }) {
  const activeIdx = getCardTimelineIndex(status);
  const rejected = status === 'Rejected';

  if (rejected) {
    return (
      <div className="receiver-app-card-timeline receiver-app-card-timeline--rejected">
        <span className="receiver-app-card-timeline__rejected">Application Rejected</span>
      </div>
    );
  }

  return (
    <div className="receiver-app-card-timeline">
      {RECEIVER_CARD_TIMELINE.map((step, i) => (
        <div
          key={step}
          className={`receiver-app-card-timeline__step ${i < activeIdx ? 'is-done' : ''} ${i === activeIdx ? 'is-active' : ''}`}
        >
          <div className="receiver-app-card-timeline__dot">
            {i < activeIdx ? <CheckCircle size={12} /> : i === activeIdx ? <Clock size={12} /> : null}
          </div>
          <span>{step}</span>
          {i < RECEIVER_CARD_TIMELINE.length - 1 && (
            <ChevronRight size={14} className="receiver-app-card-timeline__arrow" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function ApplicationDetailModal({ app, onClose }) {
  const { showToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const docs = app.documents
    ? Object.entries(app.documents).map(([name, val]) => ({
        name,
        filename: typeof val === 'object' ? val.filename : `${name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        uploaded: typeof val === 'object' ? val.uploaded : !!val
      }))
    : [];

  return createPortal(
    <div className="receiver-app-modal-overlay" role="presentation">
      <div className="receiver-app-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="receiver-app-modal" role="dialog" aria-modal="true" aria-labelledby="app-detail-title">
        <header className="receiver-app-modal__header">
          <div>
            <p className="receiver-app-modal__id">{app.id}</p>
            <h2 id="app-detail-title">{ASSISTANCE_TYPE_ICONS[app.assistanceType] || app.assistanceIcon} {app.assistanceType}</h2>
          </div>
          <button type="button" className="receiver-app-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="receiver-app-modal__body">
          <div className="receiver-app-modal__status-row">
            <span className={`receiver-app-status ${applicationStatusClass(app.status)}`}>{app.status}</span>
            <span className="receiver-app-modal__date"><Calendar size={14} /> Submitted {app.appliedDate}</span>
          </div>

          <dl className="receiver-app-modal__grid">
            <div><dt>Purpose</dt><dd>{app.purpose}</dd></div>
            <div><dt>Requested Amount</dt><dd>{formatCurrency(app.amount)}</dd></div>
            <div className="receiver-app-modal__full"><dt>Description</dt><dd>{app.description || '—'}</dd></div>
            {app.notes && <div className="receiver-app-modal__full"><dt>Additional Notes</dt><dd>{app.notes}</dd></div>}
          </dl>

          <section className="receiver-app-modal__section">
            <h3>Timeline</h3>
            <CardTimeline status={app.status} />
          </section>

          <section className="receiver-app-modal__section">
            <h3>Uploaded Documents</h3>
            <ul className="receiver-app-modal__docs">
              {docs.length ? docs.map((d) => (
                <li key={d.name}>
                  <FileText size={16} />
                  <span>{d.name}</span>
                  <span className="receiver-app-modal__doc-file">{d.filename}</span>
                </li>
              )) : (
                <li className="receiver-app-modal__doc-placeholder">Document placeholders (wireframe)</li>
              )}
            </ul>
          </section>

          {app.reviewNotes && (
            <section className="receiver-app-modal__section receiver-app-modal__review">
              <h3>Review Notes</h3>
              <p>{app.reviewNotes}</p>
            </section>
          )}

          {app.rejectionReason && (
            <section className="receiver-app-modal__section receiver-app-modal__rejected">
              <h3>Rejection Reason</h3>
              <p>{app.rejectionReason}</p>
            </section>
          )}
        </div>

        <footer className="receiver-app-modal__footer">
          <button type="button" className="receiver-app-btn receiver-app-btn--ghost" onClick={onClose}>Close</button>
          <button
            type="button"
            className="receiver-app-btn receiver-app-btn--primary"
            onClick={() => showToast(`Downloading summary for ${app.id} (demo).`, 'info')}
          >
            <Download size={16} /> Download Summary
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

function ApplicationCard({ app, onViewDetails, onDownload }) {
  const icon = app.assistanceIcon || ASSISTANCE_TYPE_ICONS[app.assistanceType] || '📋';

  return (
    <article className="receiver-app-card-modern">
      <div className="receiver-app-card-modern__head">
        <div>
          <p className="receiver-app-card-modern__id">{app.id}</p>
          <span className={`receiver-app-status ${applicationStatusClass(app.status)}`}>{app.status}</span>
        </div>
        <span className="receiver-app-card-modern__type-icon" aria-hidden="true">{icon}</span>
      </div>

      <h3 className="receiver-app-card-modern__title">{app.assistanceType}</h3>
      <p className="receiver-app-card-modern__purpose">{app.purpose}</p>
      <p className="receiver-app-card-modern__desc">{app.description}</p>

      <div className="receiver-app-card-modern__meta">
        <span><IndianRupee size={14} /> {formatCurrency(app.amount)}</span>
        <span><Calendar size={14} /> {app.appliedDate}</span>
      </div>

      <CardTimeline status={app.status} />

      <div className="receiver-app-card-modern__actions">
        <button type="button" className="receiver-app-btn receiver-app-btn--primary" onClick={() => onViewDetails(app)}>
          <Eye size={16} /> View Details
        </button>
        <button type="button" className="receiver-app-btn receiver-app-btn--outline" onClick={() => onDownload(app)}>
          <Download size={16} /> Download PDF
        </button>
      </div>
    </article>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="receiver-apps-skeleton">
      {[1, 2].map((n) => (
        <div key={n} className="receiver-apps-skeleton__card">
          <div className="receiver-apps-skeleton__line receiver-apps-skeleton__line--short" />
          <div className="receiver-apps-skeleton__line" />
          <div className="receiver-apps-skeleton__line receiver-apps-skeleton__line--medium" />
        </div>
      ))}
    </div>
  );
}

export default function MyApplicationsView() {
  const { receiverApplications, currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [detailApp, setDetailApp] = useState(null);

  const apps = getReceiverApps(receiverApplications, currentUser);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const typeOptions = useMemo(() => {
    const types = new Set(apps.map((a) => a.assistanceType));
    return ['All', ...Array.from(types)];
  }, [apps]);

  const filtered = useMemo(() => {
    let list = [...apps];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.assistanceType.toLowerCase().includes(q) ||
          a.purpose.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') {
      list = list.filter((a) => {
        if (statusFilter === 'Under Review') {
          return ['Under Review', 'Documents Verified'].includes(a.status);
        }
        return a.status === statusFilter;
      });
    }
    if (typeFilter !== 'All') {
      list = list.filter((a) => a.assistanceType === typeFilter);
    }
    list.sort((a, b) => {
      const da = new Date(a.appliedDate).getTime();
      const db = new Date(b.appliedDate).getTime();
      return sort === 'newest' ? db - da : da - db;
    });
    return list;
  }, [apps, search, statusFilter, typeFilter, sort]);

  return (
    <div className="receiver-apps-page page-route">
      <header className="receiver-apps-page__header">
        <div>
          <h1>My Applications</h1>
          <p>Track every financial assistance request submitted to AJA Abayahastham.</p>
        </div>
        <button type="button" className="receiver-app-btn receiver-app-btn--primary" onClick={() => navigate('/dashboard/receiver-apply')}>
          + New Application
        </button>
      </header>

      {apps.length > 0 && (
        <div className="receiver-apps-toolbar">
          <div className="receiver-apps-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by ID, type, or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="receiver-apps-filters">
            <label className="receiver-apps-filter">
              <Filter size={16} aria-hidden="true" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {APPLICATION_STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                ))}
              </select>
            </label>
            <label className="receiver-apps-filter">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
                ))}
              </select>
            </label>
            <label className="receiver-apps-filter">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {loading ? (
        <ApplicationsSkeleton />
      ) : filtered.length ? (
        <div className="receiver-apps-grid">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onViewDetails={setDetailApp}
              onDownload={(a) => showToast(`Downloading PDF for ${a.id} (demo).`, 'info')}
            />
          ))}
        </div>
      ) : apps.length ? (
        <div className="receiver-apps-empty receiver-apps-empty--filter">
          <p>No applications match your filters.</p>
          <button type="button" className="receiver-app-btn receiver-app-btn--ghost" onClick={() => { setSearch(''); setStatusFilter('All'); setTypeFilter('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="receiver-apps-empty">
          <div className="receiver-apps-empty__illus" aria-hidden="true">
            <ClipboardList size={48} strokeWidth={1.5} />
          </div>
          <h2>No Applications Yet</h2>
          <p>You haven&apos;t submitted any financial assistance requests yet.</p>
          <button type="button" className="receiver-app-btn receiver-app-btn--primary" onClick={() => navigate('/dashboard/receiver-apply')}>
            Apply for Assistance
          </button>
        </div>
      )}

      {detailApp && <ApplicationDetailModal app={detailApp} onClose={() => setDetailApp(null)} />}
    </div>
  );
}
