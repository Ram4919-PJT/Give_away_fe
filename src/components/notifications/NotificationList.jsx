import NotificationItem from './NotificationItem';
import NotificationEmptyState from './NotificationEmptyState';
import { NotificationSkeletonList } from './NotificationSkeleton';

export default function NotificationList({
  role,
  filter,
  items,
  loading,
  onOpen,
  onMarkRead,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="notif-center__panel" aria-busy="true" aria-label="Loading notifications">
        <NotificationSkeletonList count={6} />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="notif-center__panel notif-center__panel--empty">
        <NotificationEmptyState filter={filter} role={role} filtered={filter !== 'all'} />
      </div>
    );
  }

  return (
    <div className="notif-center__panel" aria-live="polite" aria-label="Notifications">
      {items.map((notification, index) => (
        <div key={notification.id} className="notif-center__row-wrap">
          <NotificationItem
            notification={notification}
            role={role}
            onOpen={() => onOpen(notification)}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
          {index < items.length - 1 && <div className="notif-center__divider" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
