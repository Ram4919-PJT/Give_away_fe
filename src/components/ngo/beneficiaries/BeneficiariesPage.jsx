import { useMemo, useState } from 'react';
import {
  Users, UserCheck, CircleCheck, Clock, Search, Eye, History,
  MapPin, Building2, Hash, Package, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';

const STATUS_OPTIONS = ['All', 'Active', 'In Progress', 'Completed', 'Pending', 'On Hold'];
const SORT_OPTIONS = [
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' }
];

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function statusTone(status) {
  const map = {
    Active: 'success',
    'In Progress': 'info',
    Completed: 'neutral',
    Pending: 'warning',
    'On Hold': 'danger'
  };
  return map[status] || 'neutral';
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function BeneficiaryModal({ title, beneficiary, onClose, mode }) {
  if (!beneficiary) return null;

  return (
    <div className="ben-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="ben-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ben-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ben-modal__head">
          <div className="ben-avatar ben-avatar--lg" aria-hidden="true">
            {getInitials(beneficiary.name)}
          </div>
          <div>
            <h2 id="ben-modal-title">{title}</h2>
            <p>{beneficiary.name}</p>
          </div>
          <button type="button" className="ben-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {mode === 'profile' ? (
          <dl className="ben-modal__meta">
            <div><dt>Beneficiary ID</dt><dd>{beneficiary.id}</dd></div>
            <div><dt>Assistance Category</dt><dd>{beneficiary.type}</dd></div>
            <div><dt>Status</dt><dd><span className={`ben-badge ben-badge--${statusTone(beneficiary.status)}`}>{beneficiary.status}</span></dd></div>
            {beneficiary.resources && <div><dt>Support Provided</dt><dd>{beneficiary.resources}</dd></div>}
            {beneficiary.amount && <div><dt>Quantity / Amount</dt><dd>{beneficiary.amount}</dd></div>}
            {beneficiary.location && <div><dt>Location</dt><dd>{beneficiary.location}</dd></div>}
            {beneficiary.ngo && <div><dt>Assigned NGO</dt><dd>{beneficiary.ngo}</dd></div>}
            {beneficiary.completedDonations != null && (
              <div><dt>Completed Donations</dt><dd>{beneficiary.completedDonations}</dd></div>
            )}
            {beneficiary.lastUpdated && (
              <div><dt>Last Updated</dt><dd>{formatDate(beneficiary.lastUpdated)}</dd></div>
            )}
            {beneficiary.completion && <div><dt>Progress</dt><dd>{beneficiary.completion}</dd></div>}
          </dl>
        ) : (
          <div className="ben-history">
            <div className="ben-history__item">
              <span className="ben-history__dot" />
              <div>
                <strong>Case opened</strong>
                <p>{beneficiary.type} assistance initiated for {beneficiary.name}.</p>
                <time>{formatDate(beneficiary.lastUpdated) || 'Recently'}</time>
              </div>
            </div>
            {beneficiary.resources && (
              <div className="ben-history__item">
                <span className="ben-history__dot" />
                <div>
                  <strong>Support allocated</strong>
                  <p>{beneficiary.resources}{beneficiary.amount ? ` · ${beneficiary.amount}` : ''}</p>
                  <time>Recorded in platform ledger</time>
                </div>
              </div>
            )}
            <div className="ben-history__item">
              <span className="ben-history__dot" />
              <div>
                <strong>Current status</strong>
                <p>
                  <span className={`ben-badge ben-badge--${statusTone(beneficiary.status)}`}>
                    {beneficiary.status}
                  </span>
                  {beneficiary.completion ? ` · ${beneficiary.completion}` : ''}
                </p>
                <time>Live</time>
              </div>
            </div>
          </div>
        )}

        <button type="button" className="ben-btn ben-btn--primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function BeneficiariesPage() {
  const { ngoBeneficiaries } = useApp();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [modal, setModal] = useState({ open: false, mode: 'profile', beneficiary: null });

  const list = useMemo(() => ngoBeneficiaries || [], [ngoBeneficiaries]);

  const assistanceTypes = useMemo(() => {
    const types = [...new Set(list.map((b) => b.type).filter(Boolean))];
    return ['All', ...types];
  }, [list]);

  const stats = useMemo(() => {
    const total = list.length;
    const active = list.filter((b) => b.status === 'Active' || b.status === 'In Progress').length;
    const completed = list.filter((b) => b.status === 'Completed').length;
    const pending = list.filter((b) => b.status === 'Pending' || b.status === 'On Hold').length;
    return { total, active, completed, pending };
  }, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = list.filter((b) => {
      const matchesQuery = !q || [b.name, b.type, b.resources, b.id, b.location]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesType = typeFilter === 'All' || b.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });

    next = [...next].sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      const da = new Date(a.lastUpdated || 0).getTime();
      const db = new Date(b.lastUpdated || 0).getTime();
      return db - da;
    });

    return next;
  }, [list, query, statusFilter, typeFilter, sortBy]);

  const openModal = (beneficiary, mode) => {
    setModal({ open: true, mode, beneficiary });
  };

  const closeModal = () => setModal({ open: false, mode: 'profile', beneficiary: null });

  return (
    <div className="ben-page ngo-page ngo-module page-route">
      <header className="ben-hero">
        <h1>Beneficiaries</h1>
        <p>Monitor and manage beneficiaries receiving assistance through the Give Away platform.</p>
      </header>

      <section className="ben-stats" aria-label="Beneficiary summary">
        <article className="ben-stat-card">
          <span className="ben-stat-card__icon"><Users size={20} /></span>
          <div>
            <strong>{stats.total}</strong>
            <span>Total Beneficiaries</span>
          </div>
        </article>
        <article className="ben-stat-card">
          <span className="ben-stat-card__icon"><UserCheck size={20} /></span>
          <div>
            <strong>{stats.active}</strong>
            <span>Active Cases</span>
          </div>
        </article>
        <article className="ben-stat-card">
          <span className="ben-stat-card__icon"><CircleCheck size={20} /></span>
          <div>
            <strong>{stats.completed}</strong>
            <span>Completed Assistance</span>
          </div>
        </article>
        <article className="ben-stat-card">
          <span className="ben-stat-card__icon"><Clock size={20} /></span>
          <div>
            <strong>{stats.pending}</strong>
            <span>Pending Requests</span>
          </div>
        </article>
      </section>

      <section className="ben-toolbar" aria-label="Search and filters">
        <div className="ben-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search beneficiaries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search beneficiaries"
          />
        </div>

        <label className="ben-filter">
          <span>Status</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="ben-filter">
          <span>Assistance Type</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            {assistanceTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="ben-filter">
          <span>Sort By</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </section>

      {filtered.length === 0 ? (
        <div className="ben-empty">
          <div className="ben-empty__art" aria-hidden="true">
            <Users size={40} strokeWidth={1.5} />
          </div>
          <h2>No beneficiaries found.</h2>
          <p>Approved beneficiaries will appear here.</p>
          {(query || statusFilter !== 'All' || typeFilter !== 'All') && (
            <button
              type="button"
              className="ben-btn ben-btn--secondary"
              onClick={() => {
                setQuery('');
                setStatusFilter('All');
                setTypeFilter('All');
                showToast('Filters cleared', 'success');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="ben-list">
          {filtered.map((b) => (
            <article key={b.id} className="ben-card">
              <div className="ben-card__main">
                <div className="ben-avatar" aria-hidden="true">{getInitials(b.name)}</div>

                <div className="ben-card__body">
                  <div className="ben-card__title-row">
                    <h3>{b.name}</h3>
                    <span className={`ben-badge ben-badge--${statusTone(b.status)}`}>{b.status}</span>
                  </div>

                  <p className="ben-card__type">{b.type}</p>

                  <div className="ben-card__meta">
                    {b.resources && (
                      <span>
                        <Package size={14} aria-hidden="true" />
                        {b.resources}
                      </span>
                    )}
                    {b.amount && (
                      <span className="ben-card__amount">{b.amount}</span>
                    )}
                    {b.lastUpdated && (
                      <span>Updated {formatDate(b.lastUpdated)}</span>
                    )}
                  </div>

                  <div className="ben-card__optional">
                    {b.id && (
                      <span>
                        <Hash size={12} aria-hidden="true" />
                        {b.id}
                      </span>
                    )}
                    {b.location && (
                      <span>
                        <MapPin size={12} aria-hidden="true" />
                        {b.location}
                      </span>
                    )}
                    {b.ngo && (
                      <span>
                        <Building2 size={12} aria-hidden="true" />
                        {b.ngo}
                      </span>
                    )}
                    {b.completedDonations != null && b.completedDonations > 0 && (
                      <span>{b.completedDonations} completed donation{b.completedDonations > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="ben-card__actions">
                <button
                  type="button"
                  className="ben-btn ben-btn--ghost"
                  onClick={() => openModal(b, 'profile')}
                >
                  <Eye size={15} />
                  View Profile
                </button>
                <button
                  type="button"
                  className="ben-btn ben-btn--ghost"
                  onClick={() => openModal(b, 'history')}
                >
                  <History size={15} />
                  View History
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal.open && (
        <BeneficiaryModal
          title={modal.mode === 'profile' ? 'Beneficiary Profile' : 'Assistance History'}
          beneficiary={modal.beneficiary}
          mode={modal.mode}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
