import { Bell } from 'lucide-react';
import { emptyStateDescription, emptyStateMessage } from './notificationConfig';

export default function NotificationEmptyState({ filter, role, filtered }) {
  const title = filtered ? emptyStateMessage(filter, role) : 'No notifications yet';
  const description = filtered
    ? 'Try another filter or check back later.'
    : emptyStateDescription(role);

  return (
    <div className="notif-center__empty">
      <div className="notif-center__empty-icon" aria-hidden="true">
        <Bell size={32} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
