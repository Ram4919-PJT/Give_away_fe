import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Search, Users } from 'lucide-react';
import { listAdminUsers, updateAdminUserStatus } from '../../api/adminUsersClient';
import { useToast } from '../ui/Toast';
import RelativeTime from '../ui/RelativeTime';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'INACTIVE', label: 'Inactive' },
  { id: 'SUSPENDED', label: 'Suspended' },
];

const ROLE_TABS = [
  { id: 'all', label: 'All roles' },
  { id: 'RECEIVER', label: 'Receivers' },
  { id: 'DONOR', label: 'Donors' },
  { id: 'NGO', label: 'NGOs' },
];

function statusClass(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'ACTIVE') return 'kyc-admin__status kyc-admin__status--ok';
  if (value === 'PENDING') return 'kyc-admin__status kyc-admin__status--warn';
  if (value === 'SUSPENDED') return 'kyc-admin__status kyc-admin__status--bad';
  return 'kyc-admin__status';
}

export default function AdminUsers() {
  const { showToast } = useToast();
  const [statusTab, setStatusTab] = useState('all');
  const [roleTab, setRoleTab] = useState('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = { limit: 200 };
    if (statusTab !== 'all') params.status = statusTab;
    if (roleTab !== 'all') params.role = roleTab;
    if (search.trim()) params.q = search.trim();
    listAdminUsers(params)
      .then((rows) => setUsers(Array.isArray(rows) ? rows : []))
      .catch(() => showToast('Could not load users.', 'error'))
      .finally(() => setLoading(false));
  }, [roleTab, search, showToast, statusTab]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const pendingCount = useMemo(
    () => users.filter((u) => String(u.status).toUpperCase() === 'PENDING').length,
    [users],
  );

  const activateUser = async (userId) => {
    setBusyId(userId);
    try {
      await updateAdminUserStatus(userId, 'ACTIVE');
      showToast('User activated.', 'success');
      loadUsers();
    } catch (err) {
      showToast(err?.message || 'Could not activate user.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="kyc-admin page-route">
      <header className="kyc-admin__header">
        <div>
          <h1>Platform Users</h1>
          <p>
            All registered accounts from IAM. KYC approval is separate under KYC Verification.
            {pendingCount > 0 ? ` ${pendingCount} pending activation.` : ''}
          </p>
        </div>
        <Users size={28} aria-hidden="true" />
      </header>

      <div className="kyc-admin__toolbar">
        <div className="kyc-admin__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') loadUsers(); }}
            placeholder="Search name, email, or mobile"
            aria-label="Search users"
          />
        </div>
        <button type="button" className="kyc-admin__refresh" onClick={loadUsers} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'kyc-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="kyc-admin__tabs" role="tablist" aria-label="Account status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`kyc-admin__tab${statusTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setStatusTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="kyc-admin__tabs kyc-admin__tabs--secondary" role="tablist" aria-label="Role">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`kyc-admin__tab${roleTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setRoleTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="kyc-admin__table-wrap">
        {loading ? (
          <p className="kyc-admin__loading"><Loader2 className="kyc-spin" size={18} /> Loading users…</p>
        ) : !users.length ? (
          <p className="kyc-admin__empty">No users match the selected filters.</p>
        ) : (
          <table className="kyc-admin__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleName = user.role?.role_name || '—';
                const isPending = String(user.status).toUpperCase() === 'PENDING';
                return (
                  <tr key={user.user_id}>
                    <td>
                      <strong>{user.full_name}</strong>
                      <span className="kyc-admin__muted">ID {user.user_id}</span>
                    </td>
                    <td>{roleName}</td>
                    <td>
                      <span>{user.email}</span>
                      <span className="kyc-admin__muted">{user.mobile}</span>
                    </td>
                    <td><span className={statusClass(user.status)}>{user.status}</span></td>
                    <td><RelativeTime value={user.created_at} /></td>
                    <td>
                      {isPending ? (
                        <button
                          type="button"
                          className="kyc-admin__btn kyc-admin__btn--approve"
                          disabled={busyId === user.user_id}
                          onClick={() => activateUser(user.user_id)}
                        >
                          {busyId === user.user_id ? 'Activating…' : 'Activate'}
                        </button>
                      ) : (
                        <span className="kyc-admin__muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
