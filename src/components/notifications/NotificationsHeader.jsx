import { CheckCheck, Settings } from 'lucide-react';

export default function NotificationsHeader({
  subtitle,
  onMarkAllRead,
  onSettings,
  markAllDisabled,
  actionLoading,
}) {
  return (
    <header className="notif-center__header">
      <div>
        <h1 className="notif-center__title">Notifications</h1>
        <p className="notif-center__subtitle">{subtitle}</p>
      </div>
      <div className="notif-center__actions">
        <button
          type="button"
          className="notif-action-btn"
          onClick={onMarkAllRead}
          disabled={markAllDisabled || actionLoading}
          aria-label="Mark all notifications as read"
        >
          <CheckCheck size={16} aria-hidden="true" />
          Mark all as read
        </button>
        <button
          type="button"
          className="notif-action-btn notif-action-btn--secondary"
          onClick={onSettings}
          aria-label="Notification settings"
        >
          <Settings size={16} aria-hidden="true" />
          Settings
        </button>
      </div>
    </header>
  );
}
