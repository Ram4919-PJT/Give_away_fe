import { useState, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import { Gift, Search } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  AdminModuleShell, AdminStatStrip, AdminBadge, AdminEmpty
} from '../AdminModuleShell';

const TABS = [
  { id: 'all', label: 'All Donations' },
  { id: 'money', label: 'Money Donations' },
  { id: 'items', label: 'Item Donations' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
];

function donationTabMatch(d, tab) {
  if (tab === 'all') return true;
  if (tab === 'money') return d.type === 'Financial';
  if (tab === 'items') return d.type === 'Items';
  if (tab === 'pending') return ['Pending', 'Pending Pickup', 'Assigned'].includes(d.status);
  if (tab === 'completed') return ['Fully Deployed', 'Completed', 'Delivered'].includes(d.status);
  if (tab === 'cancelled') return d.status === 'Cancelled';
  return true;
}

const STATUS_VARIANT = {
  'Fully Deployed': 'green', Completed: 'green', Delivered: 'green',
  Assigned: 'blue', 'Pending Pickup': 'orange', Pending: 'orange', Cancelled: 'red'
};

export default function AdminDonationManagement() {
  const { donations } = useApp();
  const { showToast } = useToast();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const tabsRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[tab];
    const container = tabsRef.current;
    if (el && container) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [tab]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const stats = useMemo(() => ({
    money: donations.filter((d) => d.type === 'Financial').length,
    items: donations.filter((d) => d.type === 'Items').length,
    pending: donations.filter((d) => ['Pending', 'Pending Pickup', 'Assigned'].includes(d.status)).length,
    completed: donations.filter((d) => ['Fully Deployed', 'Completed'].includes(d.status)).length
  }), [donations]);

  const filtered = useMemo(() => donations.filter((d) => {
    const q = search.toLowerCase();
    const matchQ = !q || d.donor.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
    return matchQ && donationTabMatch(d, tab);
  }), [donations, tab, search]);

  return (
    <AdminModuleShell title="Donation Management" subtitle="Track money and item donations across the platform.">
      <AdminStatStrip items={[
        ['Money Donations', stats.money, 'blue'],
        ['Item Donations', stats.items, 'green'],
        ['Pending', stats.pending, 'orange'],
        ['Completed', stats.completed, 'purple']
      ]} />

      <div className="admin-don-nav">
        <div className="admin-don-tabs" ref={tabsRef} role="tablist" aria-label="Donation filters">
          <span
            className="admin-don-tabs__indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }}
          />
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              className={`admin-don-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="admin-don-nav__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className="admin-don-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by donor or ID…"
            aria-label="Search donations"
          />
        </div>
      </div>

      <div key={tab} className="admin-don-panel">
      {filtered.length ? (
        <div className="admin-mod-donation-grid">
          {filtered.map((d) => (
            <article key={d.id} className="admin-mod-donation-card">
              <div className="admin-mod-donation-card__head">
                <span className="admin-mod-donation-card__type">{d.type === 'Financial' ? '💰' : '📦'}</span>
                <div>
                  <h3>{d.donor}</h3>
                  <span>{d.id}</span>
                </div>
                <AdminBadge variant={STATUS_VARIANT[d.status] || 'muted'}>{d.status}</AdminBadge>
              </div>
              <dl className="admin-mod-donation-card__meta">
                <div><dt>Type</dt><dd>{d.type}</dd></div>
                <div><dt>{d.type === 'Financial' ? 'Amount' : 'Item'}</dt>
                  <dd>{d.amount ? `₹${d.amount.toLocaleString('en-IN')}` : d.details?.slice(0, 40) + '…'}</dd></div>
                <div><dt>Date</dt><dd>{d.date}</dd></div>
                <div><dt>Assigned NGO</dt><dd>{d.beneficiary?.displayName ? 'Asha Kiran Foundation' : 'Pending'}</dd></div>
                <div><dt>Beneficiary</dt><dd>{d.beneficiary?.displayName || '—'}</dd></div>
              </dl>
              <button type="button" className="admin-mod-btn admin-mod-btn--outline" onClick={() => showToast(`View ${d.id} — wireframe.`, 'info')}>
                View Details
              </button>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty icon={Gift} title="No donations found" desc="Try a different filter or search term." />
      )}
      </div>
    </AdminModuleShell>
  );
}
