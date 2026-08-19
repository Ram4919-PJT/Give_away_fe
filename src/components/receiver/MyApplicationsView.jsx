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
  getCardTimelineIndex,
  applicationNeedsBankDetails,
} from '../../utils/receiverHelpers';
import ReceiverBankDetailsModal from './ReceiverBankDetailsModal';
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

function ApplicationDetailModal({ app, onClose, onAddBankDetails }) {
  const { showToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const docs = Array.isArray(app.documents)
    ? app.documents.map((d) => ({
        name: d.document_type,
        filename: d.original_filename || d.document_type,
        uploaded: true,
      }))
    : app.documents
      ? Object.entries(app.documents).map(([name, val]) => ({
          name,
          filename: typeof val === 'object' ? val.filename : `${name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          uploaded: typeof val === 'object' ? val.uploaded : !!val,
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
            {app.approvedAmount != null && app.approvedAmount > 0 && (
              <div><dt>Approved Amount</dt><dd>{formatCurrency(app.approvedAmount)}</dd></div>
            )}
            <div className="receiver-app-modal__full"><dt>Expense Breakdown</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{app.expenseBreakdown || app.description || '—'}</dd></div>
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
                <li className="receiver-app-modal__doc-placeholder">No documents attached</li>
              )}
            </ul>
          </section>

          {applicationNeedsBankDetails(app) && (
            <section className="receiver-app-modal__section receiver-app-bank-cta">
              <h3>Disbursement — Bank Details Required</h3>
              <p>
                Your request was approved for {formatCurrency(app.approvedAmount ?? app.amount)}.
                Add your bank account details to receive the funds.
              </p>
              <button
                type="button"
                className="receiver-app-btn receiver-app-btn--primary"
                onClick={() => {
                  onClose();
                  onAddBankDetails(app);
                }}
              >
                Open disbursement portal
              </button>
            </section>
          )}

          {app.payoutStatus === 'BANK_DETAILS_SUBMITTED' && (
            <section className="receiver-app-modal__section receiver-app-bank-submitted">
              <h3>Bank details on file</h3>
              <p>
                {app.bankName} · ****{app.bankAccountLast4 || '····'} · {app.bankIfsc}
              </p>
              <p className="receiver-app-modal__muted">Disbursement is being processed by AJA Abayahastham.</p>
            </section>
          )}

          {app.rejectionReason && (
            <section className="receiver-app-modal__section receiver-app-modal__rejected">
              <h3>Rejection Reason</h3>
              <p>{app.rejectionReason}</p>
            </section>
          )}

          {app.actionRequiredReason && (
            <section className="receiver-app-modal__section receiver-app-modal__action">
              <h3>Action Required</h3>
              <p>{app.actionRequiredReason}</p>
            </section>
          )}
        </div>

        <footer className="receiver-app-modal__footer">
          <button type="button" className="receiver-app-btn receiver-app-btn--ghost" onClick={onClose}>Close</button>
          <button
            type="button"
            className="receiver-app-btn receiver-app-btn--primary"
            onClick={() => showToast('Download will be available soon.', 'info')}
          >
            <Download size={16} /> Download Summary
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

function ApplicationCard({ app, onViewDetails, onDownload, onAddBankDetails }) {
  const icon = app.assistanceIcon || ASSISTANCE_TYPE_ICONS[app.assistanceType] || '📋';
  const needsBank = applicationNeedsBankDetails(app);

  return (
    <article className={`receiver-app-card-modern${needsBank ? ' receiver-app-card-modern--bank' : ''}`}>
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
        {app.approvedAmount != null && app.approvedAmount > 0 && (
          <span>Approved: {formatCurrency(app.approvedAmount)}</span>
        )}
        <span><Calendar size={14} /> {app.appliedDate}</span>
      </div>

      <CardTimeline status={app.status} />

      {needsBank && (
        <div className="receiver-app-bank-banner">
          <p>
            <strong>Action required:</strong> Add bank details to receive{' '}
            {formatCurrency(app.approvedAmount ?? app.amount)}.
          </p>
          <button
            type="button"
            className="receiver-app-btn receiver-app-btn--primary receiver-app-btn--sm"
            onClick={() => onAddBankDetails(app)}
          >
            Add bank details
          </button>
        </div>
      )}

      {app.needsAction && !needsBank && (
        <div className="receiver-app-bank-banner">
          <p>
            <strong>Action required:</strong> {app.actionRequiredReason || 'Please update your application and resubmit.'}
          </p>
          <button
            type="button"
            className="receiver-app-btn receiver-app-btn--primary receiver-app-btn--sm"
            onClick={() => window.location.assign('/dashboard/receiver-apply')}
          >
            Fix application
          </button>
        </div>
      )}

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
  const { receiverApplications, currentUser, submitAssistanceBankDetails } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [detailApp, setDetailApp] = useState(null);
  const [bankApp, setBankApp] = useState(null);

  const apps = getReceiverApps(receiverApplications, currentUser);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const typeOptions = useMemo(() => {
    const types = new Set(apps.map((a) => a.assistanceType));
    return ['All', ...Array.from(types)];
  }, [apps]);

  const dateOptions = useMemo(() => {
    const months = new Set(
      apps
        .map((a) => (a.appliedDate ? a.appliedDate.slice(0, 7) : null))
        .filter(Boolean)
    );
    return ['All', ...Array.from(months).sort().reverse()];
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
        if (statusFilter === 'Completed') {
          return ['Completed', 'Funds Released', 'Processing Payout'].includes(a.status);
        }
        return a.status === statusFilter;
      });
    }
    if (typeFilter !== 'All') {
      list = list.filter((a) => a.assistanceType === typeFilter);
    }
    if (dateFilter !== 'All') {
      list = list.filter((a) => (a.appliedDate || '').startsWith(dateFilter));
    }
    list.sort((a, b) => {
      const da = new Date(a.appliedDate).getTime();
      const db = new Date(b.appliedDate).getTime();
      return sort === 'newest' ? db - da : da - db;
    });
    return list;
  }, [apps, search, statusFilter, typeFilter, dateFilter, sort]);

  return (
    <div className="receiver-apps-page page-route">
      <header className="receiver-apps-page__header">
        <div>
          <h1>My Requests</h1>
          <p>Track every financial assistance request submitted to AJA Abayahastham.</p>
        </div>
        <button type="button" className="receiver-app-btn receiver-app-btn--primary" onClick={() => navigate('/dashboard/receiver-apply')}>
          + Request Financial Assistance
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
                  <option key={t} value={t}>{t === 'All' ? 'All Categories' : t}</option>
                ))}
              </select>
            </label>
            <label className="receiver-apps-filter">
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All Dates' : d}</option>
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
              onDownload={() => showToast('Download will be available soon.', 'info')}
              onAddBankDetails={setBankApp}
            />
          ))}
        </div>
      ) : apps.length ? (
        <div className="receiver-apps-empty receiver-apps-empty--filter">
          <p>No requests match your filters.</p>
          <button type="button" className="receiver-app-btn receiver-app-btn--ghost" onClick={() => { setSearch(''); setStatusFilter('All'); setTypeFilter('All'); setDateFilter('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="receiver-apps-empty">
          <div className="receiver-apps-empty__illus" aria-hidden="true">
            <ClipboardList size={48} strokeWidth={1.5} />
          </div>
          <h2>No financial assistance requests yet</h2>
          <p>Submit a request when you need financial support for a specific purpose.</p>
          <button type="button" className="receiver-app-btn receiver-app-btn--primary" onClick={() => navigate('/dashboard/receiver-apply')}>
            Request Financial Assistance
          </button>
        </div>
      )}

      {detailApp && (
        <ApplicationDetailModal
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onAddBankDetails={setBankApp}
        />
      )}

      {bankApp && (
        <ReceiverBankDetailsModal
          application={bankApp}
          onClose={() => setBankApp(null)}
          onSubmit={async (payload) => {
            await submitAssistanceBankDetails(bankApp.id, payload);
            showToast('Bank details submitted successfully. Disbursement will be processed soon.', 'success');
            setBankApp(null);
          }}
        />
      )}
    </div>
  );
}
