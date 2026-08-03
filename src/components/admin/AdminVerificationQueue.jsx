import { useState, useEffect, useMemo } from 'react';
import {
  Shield, Search, FileText, Eye, Download, Check, X,
  UserPlus, MessageSquare, UserCheck, CheckCircle2, AlertCircle, Inbox
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { NGO_REJECTION_REASONS, CUSTOM_REJECTION_OPTION } from '../../data/adminConstants';
import {
  VERIFICATION_TABS, buildVerificationMockData, getVerificationSummary,
  getStatusCounts, ASSISTANCE_TYPES
} from '../../data/adminVerificationMockData';

const STATUS_VARIANT = {
  Pending: 'pending',
  Verified: 'approved',
  Rejected: 'rejected',
  'Under Review': 'review'
};

function StatusBadge({ status }) {
  return (
    <span className={`vq-badge vq-badge--${STATUS_VARIANT[status] || 'pending'}`}>{status}</span>
  );
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function VerifySkeleton() {
  return (
    <div className="vq-skeleton" aria-hidden="true">
      <div className="vq-skeleton__header" />
      <div className="vq-skeleton__tabs" />
      <div className="vq-skeleton__layout">
        <div className="vq-skeleton__side" />
        <div className="vq-skeleton__main" />
        <div className="vq-skeleton__actions" />
      </div>
    </div>
  );
}

function DocumentCards({ documents, onPreview, onDownload }) {
  return (
    <div className="vq-doc-grid">
      {documents.map((doc) => (
        <article key={doc.filename} className="vq-doc-card">
          <div className="vq-doc-card__icon"><FileText size={22} strokeWidth={1.5} /></div>
          <div className="vq-doc-card__body">
            <strong>{doc.label}</strong>
            <span>{doc.filename}</span>
            <span className="vq-doc-card__date">Uploaded {formatDate(doc.uploadedAt)}</span>
          </div>
          <div className="vq-doc-card__actions">
            <button type="button" className="vq-btn vq-btn--ghost" onClick={() => onPreview(doc.filename)}>
              <Eye size={14} /> Preview
            </button>
            <button type="button" className="vq-btn vq-btn--ghost" onClick={() => onDownload(doc.filename)}>
              <Download size={14} /> Download
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function DetailPanel({ item, checklist, onToggleCheck, onPreview, onDownload }) {
  if (!item) {
    return (
      <div className="vq-empty vq-empty--detail">
        <Shield size={48} strokeWidth={1.25} />
        <h3>Select an application</h3>
        <p>Choose a verification request from the sidebar to review details.</p>
      </div>
    );
  }

  const isNgo = item.type === 'NGO';
  const isReceiver = item.type === 'Receiver';
  const isDonor = item.type === 'Donor';

  return (
    <div className="vq-detail vq-detail--enter">
      <header className="vq-detail__head">
        <div className="vq-detail__avatar">{item.logo || item.avatar}</div>
        <div>
          <h2>{item.name}</h2>
          <StatusBadge status={item.status} />
        </div>
      </header>

      <section className="vq-detail__section">
        <h3>Profile Information</h3>
        <dl className="vq-detail__grid">
          <div><dt>Email</dt><dd>{item.email}</dd></div>
          <div><dt>Phone</dt><dd>{item.phone}</dd></div>
          <div><dt>Registration Date</dt><dd>{formatDate(item.registrationDate || item.submitted)}</dd></div>
          {isDonor && (
            <>
              <div><dt>Verification Level</dt><dd>{item.verificationLevel}</dd></div>
              <div><dt>Documents Submitted</dt><dd>{item.documents?.length || 0}</dd></div>
            </>
          )}
          {isReceiver && (
            <>
              <div><dt>Assistance Type</dt><dd>{item.assistanceType}</dd></div>
              <div><dt>Address</dt><dd>{item.address}</dd></div>
              <div><dt>Income Status</dt><dd>{item.incomeStatus}</dd></div>
            </>
          )}
          {isNgo && (
            <>
              <div><dt>Registration No.</dt><dd>{item.registrationId}</dd></div>
              <div><dt>Representative</dt><dd>{item.representative}</dd></div>
              <div><dt>Location</dt><dd>{item.location}</dd></div>
              <div><dt>Operating Areas</dt><dd>{item.operatingAreas?.join(', ')}</dd></div>
            </>
          )}
        </dl>
        {isReceiver && (
          <div className="vq-detail__tags">
            {ASSISTANCE_TYPES.map((t) => (
              <span key={t} className={`vq-tag ${item.assistanceType === t ? 'is-active' : ''}`}>{t}</span>
            ))}
          </div>
        )}
      </section>

      <section className="vq-detail__section">
        <h3>Documents</h3>
        <DocumentCards documents={item.documents || []} onPreview={onPreview} onDownload={onDownload} />
      </section>

      <section className="vq-detail__section">
        <h3>Verification Checklist</h3>
        <ul className="vq-checklist">
          {(checklist || item.checklist || []).map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`vq-checklist__item ${c.checked ? 'is-checked' : ''}`}
                onClick={() => onToggleCheck(c.id)}
              >
                <span className="vq-checklist__box">{c.checked && <Check size={12} strokeWidth={3} />}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="vq-detail__section">
        <h3>Notes</h3>
        <p className="vq-detail__notes">{item.notes || 'No internal notes yet.'}</p>
      </section>

      <section className="vq-detail__section">
        <h3>Timeline</h3>
        <ol className="vq-timeline">
          {(item.timeline || []).map((ev) => (
            <li key={ev.date + ev.event}>
              <span className="vq-timeline__dot" />
              <div>
                <strong>{ev.event}</strong>
                <span>{formatDate(ev.date)}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ActionPanel({ item, onApprove, onReject, showToast }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState(NGO_REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [internalNote, setInternalNote] = useState('');

  if (!item) {
    return <aside className="vq-actions vq-actions--empty" aria-hidden="true" />;
  }

  const isPending = item.status === 'Pending' || item.status === 'Under Review';

  return (
    <aside className="vq-actions">
      <h3 className="vq-actions__title">Review Actions</h3>

      {isPending ? (
        <>
          <button type="button" className="vq-btn vq-btn--approve vq-btn--block" onClick={() => onApprove(item.id)}>
            <CheckCircle2 size={18} /> Approve Verification
          </button>
          <button type="button" className="vq-btn vq-btn--reject vq-btn--block" onClick={() => setShowReject(!showReject)}>
            <X size={18} /> Reject Verification
          </button>
          {showReject && (
            <div className="vq-reject-form">
              <label htmlFor="reject-reason">Rejection reason</label>
              <select id="reject-reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
                {NGO_REJECTION_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {rejectReason === CUSTOM_REJECTION_OPTION && (
                <textarea
                  placeholder="Enter custom reason…"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={2}
                />
              )}
              <button
                type="button"
                className="vq-btn vq-btn--reject vq-btn--block"
                onClick={() => {
                  const reason = rejectReason === CUSTOM_REJECTION_OPTION ? customReason.trim() : rejectReason;
                  if (!reason) { showToast('Please provide a reason.', 'error'); return; }
                  onReject(item.id, reason);
                  setShowReject(false);
                }}
              >
                Confirm Rejection
              </button>
            </div>
          )}
          <button type="button" className="vq-btn vq-btn--outline vq-btn--block" onClick={() => showToast('Document request sent (mock).', 'info')}>
            <FileText size={16} /> Request More Documents
          </button>
        </>
      ) : (
        <div className={`vq-resolved vq-resolved--${item.status === 'Verified' ? 'approved' : 'rejected'}`}>
          {item.status === 'Verified' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <strong>{item.status === 'Verified' ? 'Verified' : 'Rejected'}</strong>
          <p>{item.rejectionReason || 'This application has been processed.'}</p>
        </div>
      )}

      <div className="vq-actions__divider" />

      <label className="vq-actions__field">
        <span><MessageSquare size={14} /> Add Internal Notes</span>
        <textarea
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          placeholder="Add notes for the review team…"
          rows={3}
        />
      </label>
      <button type="button" className="vq-btn vq-btn--outline vq-btn--block" onClick={() => showToast('Note saved (mock).', 'success')}>
        Save Note
      </button>

      <label className="vq-actions__field">
        <span><UserCheck size={14} /> Assign Reviewer</span>
        <select defaultValue="unassigned">
          <option value="unassigned">Unassigned</option>
          <option value="admin">Platform Admin</option>
          <option value="reviewer1">Review Team A</option>
        </select>
      </label>
      <button type="button" className="vq-btn vq-btn--outline vq-btn--block" onClick={() => showToast('Reviewer assigned (mock).', 'info')}>
        <UserPlus size={16} /> Assign
      </button>
    </aside>
  );
}

export default function AdminVerificationQueue() {
  const { verifications, verifyEntity, rejectEntity } = useApp();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Donor');
  const [localItems, setLocalItems] = useState(() => buildVerificationMockData(verifications));
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarFilter, setSidebarFilter] = useState('Pending');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [checklists, setChecklists] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLocalItems(buildVerificationMockData(verifications));
  }, [verifications]);

  const tabItems = useMemo(() => localItems.filter((i) => i.type === activeTab), [localItems, activeTab]);

  const filtered = useMemo(() => {
    let list = tabItems.filter((i) => {
      const q = search.toLowerCase();
      const matchQ = !q || i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || i.status === statusFilter;
      const matchSidebar = sidebarFilter === 'All' || i.status === sidebarFilter;
      return matchQ && matchS && matchSidebar;
    });
    list = [...list].sort((a, b) => {
      const da = new Date(a.submitted).getTime();
      const db = new Date(b.submitted).getTime();
      return sort === 'oldest' ? da - db : db - da;
    });
    return list;
  }, [tabItems, search, statusFilter, sidebarFilter, sort]);

  const summary = getVerificationSummary(localItems, activeTab);
  const statusCounts = getStatusCounts(localItems, activeTab);

  const selected = filtered.find((i) => i.id === selectedId)
    || tabItems.find((i) => i.id === selectedId)
    || null;

  useEffect(() => {
    const first = tabItems.find((i) => i.status === 'Pending') || tabItems[0];
    setSelectedId(first?.id || null);
    setSidebarFilter('Pending');
  }, [activeTab, tabItems]);

  useEffect(() => {
    if (selectedId && !filtered.find((i) => i.id === selectedId) && filtered.length) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const handleApprove = (id) => {
    verifyEntity(id);
    setLocalItems((items) => items.map((i) => (i.id === id ? { ...i, status: 'Verified' } : i)));
    showToast('Verification approved successfully.', 'success');
    const next = filtered.find((i) => i.id !== id && (i.status === 'Pending' || i.status === 'Under Review'));
    if (next) setSelectedId(next.id);
  };

  const handleReject = (id, reason) => {
    rejectEntity(id, reason);
    setLocalItems((items) => items.map((i) => (i.id === id ? { ...i, status: 'Rejected', rejectionReason: reason } : i)));
    showToast('Application rejected.', 'info');
  };

  const toggleCheck = (checkId) => {
    if (!selected) return;
    setChecklists((prev) => {
      const base = prev[selected.id] || selected.checklist || [];
      const updated = base.map((c) => (c.id === checkId ? { ...c, checked: !c.checked } : c));
      return { ...prev, [selected.id]: updated };
    });
  };

  const selectedChecklist = selected ? (checklists[selected.id] || selected.checklist) : [];

  if (loading) {
    return (
      <div className="vq-page page-route">
        <VerifySkeleton />
      </div>
    );
  }

  return (
    <div className="vq-page page-route">
      <header className="vq-header">
        <div className="vq-header__text">
          <h1>Verification Queue</h1>
          <p>Review and manage verification requests submitted by donors, receivers, and NGOs.</p>
        </div>
        <div className="vq-header__stats">
          {[
            ['Pending', summary.pending, 'orange'],
            ['Approved Today', summary.approvedToday, 'green'],
            ['Rejected Today', summary.rejectedToday, 'red'],
            ['Total Requests', summary.total, 'blue']
          ].map(([label, val, accent]) => (
            <div key={label} className={`vq-header-stat vq-header-stat--${accent}`}>
              <span className="vq-header-stat__val">{val}</span>
              <span className="vq-header-stat__lbl">{label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="vq-tabs" role="tablist" aria-label="Verification type">
        {VERIFICATION_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`vq-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setSidebarFilter('Pending'); setSearch(''); setStatusFilter('All'); }}
          >
            <span aria-hidden="true">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="vq-toolbar">
        <div className="vq-toolbar__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status filter">
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort order">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {tabItems.length === 0 ? (
        <div className="vq-empty">
          <Inbox size={56} strokeWidth={1.25} />
          <h3>No verification requests available</h3>
          <p>There are no {activeTab.toLowerCase()} verification requests at the moment.</p>
        </div>
      ) : (
        <div className="vq-layout">
          <aside className="vq-sidebar">
            <nav className="vq-sidebar__status" aria-label="Filter by status">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  type="button"
                  className={`vq-sidebar__status-btn ${sidebarFilter === status ? 'is-active' : ''}`}
                  onClick={() => setSidebarFilter(status)}
                >
                  {status === 'Verified' ? 'Approved' : status}
                  <span>({count})</span>
                </button>
              ))}
            </nav>

            <p className="vq-sidebar__label">Recent Applications</p>
            <ul className="vq-sidebar__list">
              {filtered.length === 0 ? (
                <li className="vq-sidebar__empty">No items match filters</li>
              ) : filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`vq-sidebar__item ${selectedId === item.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="vq-sidebar__avatar">{item.logo || item.avatar}</span>
                    <span className="vq-sidebar__item-body">
                      <strong>{item.name}</strong>
                      <span>{formatDate(item.submitted)}</span>
                    </span>
                    <StatusBadge status={item.status} />
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="vq-main">
            {filtered.length === 0 ? (
              <div className="vq-empty vq-empty--inline">
                <Inbox size={40} strokeWidth={1.25} />
                <h3>No matching requests</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <DetailPanel
                item={selected}
                checklist={selectedChecklist}
                onToggleCheck={toggleCheck}
                onPreview={(f) => showToast(`Opening ${f} (mock).`, 'info')}
                onDownload={(f) => showToast(`Downloading ${f} (mock).`, 'info')}
              />
            )}
          </main>

          <ActionPanel
            item={selected}
            onApprove={handleApprove}
            onReject={handleReject}
            showToast={showToast}
          />
        </div>
      )}
    </div>
  );
}
