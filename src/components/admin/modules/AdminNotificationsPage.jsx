import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Bell, CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  AdminModuleShell, AdminToolbar, AdminSearchInput, AdminSelect, AdminBadge, AdminEmpty
} from '../AdminModuleShell';

const GROUP_LABELS = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };
const PRIO_VARIANT = { Urgent: 'red', High: 'orange', Normal: 'muted' };

function NotifIcon({ name, size = 18 }) {
  const key = (name || 'bell').split('-').map((p, i) =>
    i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)
  ).join('');
  const Cmp = LucideIcons[key] || Bell;
  return <Cmp size={size} />;
}

export default function AdminNotificationsPage() {
  const { adminNotifications, dispatch } = useApp();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [localNotifs, setLocalNotifs] = useState(adminNotifications || []);

  const filtered = useMemo(() => {
    return localNotifs.filter((n) => {
      const q = search.toLowerCase();
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      const matchP = priority === 'All' || n.priority === priority;
      return matchQ && matchP;
    });
  }, [localNotifs, search, priority]);

  const groups = ['today', 'yesterday', 'earlier'].map((g) => ({
    key: g,
    label: GROUP_LABELS[g],
    items: filtered.filter((n) => n.group === g)
  })).filter((g) => g.items.length);

  const markAllRead = () => {
    setLocalNotifs((list) => list.map((n) => ({ ...n, read: true, status: 'Read' })));
    dispatch({ type: 'PATCH_DATA', payload: { adminNotifications: localNotifs.map((n) => ({ ...n, read: true, status: 'Read' })) } });
    showToast('All notifications marked as read.', 'success');
  };

  const markRead = (id) => {
    setLocalNotifs((list) => list.map((n) => n.id === id ? { ...n, read: true, status: 'Read' } : n));
  };

  return (
    <AdminModuleShell
      title="Notifications"
      subtitle="Platform alerts, verification updates, and priority case notifications."
      actions={
        <button type="button" className="admin-mod-btn admin-mod-btn--outline" onClick={markAllRead}>
          <CheckCheck size={16} /> Mark All as Read
        </button>
      }
    >
      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search notifications…" />
        <AdminSelect
          value={priority}
          onChange={setPriority}
          label="Priority"
          options={['All', 'Urgent', 'High', 'Normal']}
        />
      </AdminToolbar>

      {groups.length ? groups.map((group) => (
        <section key={group.key} className="admin-mod-notif-group">
          <h2 className="admin-mod-notif-group__title">{group.label}</h2>
          <div className="admin-mod-notif-list">
            {group.items.map((n) => (
              <article
                key={n.id}
                className={`admin-mod-notif-card ${n.read ? '' : 'is-unread'}`}
                onClick={() => markRead(n.id)}
                onKeyDown={(e) => e.key === 'Enter' && markRead(n.id)}
                role="button"
                tabIndex={0}
              >
                <div className={`admin-mod-notif-card__icon admin-mod-notif-card__icon--${n.type || 'info'}`}>
                  <NotifIcon name={n.icon} size={20} />
                </div>
                <div className="admin-mod-notif-card__body">
                  <div className="admin-mod-notif-card__head">
                    <strong>{n.title}</strong>
                    <AdminBadge variant={PRIO_VARIANT[n.priority] || 'muted'}>{n.priority}</AdminBadge>
                  </div>
                  <p>{n.message}</p>
                  <span className="admin-mod-notif-card__time">{n.time}</span>
                </div>
                <AdminBadge variant={n.read ? 'muted' : 'blue'}>{n.status}</AdminBadge>
              </article>
            ))}
          </div>
        </section>
      )) : (
        <AdminEmpty icon={Bell} title="No notifications" desc="You're all caught up." />
      )}
    </AdminModuleShell>
  );
}
