import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { Users, MoreHorizontal, Search } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { ADMIN_PLATFORM_USERS, ADMIN_USER_TAB_COUNTS } from '../../../data/adminMockData';
import { AdminModuleShell, AdminBadge, AdminEmpty } from '../AdminModuleShell';

const TABS = [
  { id: 'donors', label: 'Donors' },
  { id: 'receivers', label: 'Receivers' },
  { id: 'ngos', label: 'NGOs' },
  { id: 'admins', label: 'Admins' }
];

const STATUS_VARIANT = { Verified: 'green', Pending: 'orange', Active: 'blue', 'Under Review': 'orange' };

export default function AdminUserManagement() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('donors');
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

  const users = ADMIN_PLATFORM_USERS[tab] || [];
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <AdminModuleShell title="User Management" subtitle="Manage donors, receivers, NGOs, and platform administrators.">
      <div className="admin-user-nav">
        <div className="admin-user-tabs" ref={tabsRef} role="tablist" aria-label="User type">
          <span
            className="admin-user-tabs__indicator"
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
              className={`admin-user-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className="admin-user-tab__badge">{ADMIN_USER_TAB_COUNTS[t.id]}</span>
            </button>
          ))}
        </div>
        <div className="admin-user-nav__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className="admin-user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            aria-label="Search users"
          />
        </div>
      </div>

      <div key={tab} className="admin-user-panel">
        {filtered.length ? (
          <div className="admin-mod-user-grid">
            {filtered.map((u) => (
              <article key={u.id} className="admin-mod-user-card">
                <div className="admin-mod-user-card__avatar">{typeof u.avatar === 'string' && u.avatar.length <= 2 ? u.avatar : u.avatar}</div>
                <div className="admin-mod-user-card__body">
                  <h3>{u.name}</h3>
                  <p>{u.email}</p>
                  <div className="admin-mod-user-card__badges">
                    <AdminBadge variant="blue">{u.role}</AdminBadge>
                    <AdminBadge variant={STATUS_VARIANT[u.verificationStatus] || 'muted'}>{u.verificationStatus}</AdminBadge>
                    <AdminBadge variant={STATUS_VARIANT[u.status] || 'green'}>{u.status}</AdminBadge>
                  </div>
                  <span className="admin-mod-user-card__date">Joined {u.joinedDate}</span>
                </div>
                <div className="admin-mod-user-card__actions">
                  <button type="button" className="admin-mod-btn admin-mod-btn--outline admin-mod-btn--icon" onClick={() => showToast(`Actions for ${u.name}`, 'info')} aria-label="Actions">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmpty icon={Users} title="No users found" desc="Try adjusting your search." />
        )}
      </div>
    </AdminModuleShell>
  );
}
