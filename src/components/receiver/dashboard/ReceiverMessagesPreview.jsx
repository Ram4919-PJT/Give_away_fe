import { useNavigate } from 'react-router-dom';
import { Bell, FileText, Gift, Megaphone, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { cn } from '../../../lib/utils';
import RelativeTime from '../../ui/RelativeTime';

const TYPE_ICONS = {
  APPLICATION: FileText,
  DONATION: Gift,
  CAMPAIGN: Megaphone,
  ACCOUNT: ShieldCheck,
  SYSTEM: Bell,
};

const TYPE_ICON_CLASS = {
  APPLICATION: 'rd-notif-item__icon--application',
  DONATION: 'rd-notif-item__icon--donation',
  CAMPAIGN: 'rd-notif-item__icon--campaign',
  ACCOUNT: 'rd-notif-item__icon--account',
};

export default function ReceiverMessagesPreview({ notifications, loading }) {
  const navigate = useNavigate();
  const { markNotificationReadRemote } = useApp();

  const handleOpen = async (notification) => {
    if (!notification.read) {
      await markNotificationReadRemote('receiverNotifications', notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      return;
    }
    navigate('/dashboard/receiver-notifications');
  };

  if (loading) {
    return <div className="rd-card rd-panel rd-skeleton rd-skeleton--list" aria-hidden="true" />;
  }

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <article className="rd-card rd-panel rd-notif-panel">
      <header className="rd-panel__head">
        <div className="rd-notif-panel__title-row">
          <h2 className="rd-section-title">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rd-notif-panel__badge" aria-label={`${unreadCount} unread`}>
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          type="button"
          className="rd-link-btn"
          onClick={() => navigate('/dashboard/receiver-notifications')}
        >
          View all →
        </button>
      </header>

      {!notifications?.length ? (
        <div className="rd-empty-state rd-empty-state--compact rd-notif-panel__empty">
          <Bell size={22} aria-hidden="true" />
          <p>No notifications yet. Submit a request to get started.</p>
        </div>
      ) : (
        <ul className="rd-notif-list">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || Bell;
            const iconClass = TYPE_ICON_CLASS[n.type] || '';
            return (
              <li key={n.id}>
                <button
                  type="button"
                  className={cn('rd-notif-item', !n.read && 'rd-notif-item--unread')}
                  onClick={() => handleOpen(n)}
                  aria-label={`${n.read ? '' : 'Unread: '}${n.title}`}
                >
                  <div className={cn('rd-notif-item__icon', iconClass)}>
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <div className="rd-notif-item__body">
                    <div className="rd-notif-item__title-row">
                      <strong>{n.title}</strong>
                      {!n.read && <span className="rd-notif-item__dot" aria-hidden="true" />}
                    </div>
                    <span className="rd-notif-item__message">{n.message}</span>
                  </div>
                  <RelativeTime value={n.created_at} className="rd-notif-item__time" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

export function ReceiverImpactSnapshot({ tiles, loading }) {
  if (loading) {
    return <div className="rd-card rd-panel rd-skeleton rd-skeleton--impact" aria-hidden="true" />;
  }

  return (
    <article className="rd-card rd-panel">
      <header className="rd-panel__head">
        <h2 className="rd-section-title">Impact Snapshot</h2>
      </header>

      {!tiles?.length ? (
        <div className="rd-empty-state rd-empty-state--compact">
          <p>No impact data available yet.</p>
        </div>
      ) : (
        <div className="rd-impact-grid">
          {tiles.map((tile) => (
            <div key={tile.key} className="rd-impact-tile">
              <strong>{tile.value}</strong>
              <span>{tile.label}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
