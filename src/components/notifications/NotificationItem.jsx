import {
  Bell,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gift,
  Package,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  categoryBadgeLabel,
  notificationBadgeTone,
  resolveNotificationActionUrl,
} from './notificationConfig';
import RelativeTime from '../ui/RelativeTime';
import NotificationMenu from './NotificationMenu';

function typeIcon(type, relatedEntityType, title = '') {
  const entity = (relatedEntityType || '').toUpperCase();
  const titleLower = (title || '').toLowerCase();

  if (titleLower.includes('pickup')) return Truck;
  if (titleLower.includes('completed') || titleLower.includes('approved')) return CheckCircle2;
  if (titleLower.includes('request')) return Package;
  if (entity.includes('VERIFICATION')) return ShieldCheck;
  if (entity.includes('DISBURSEMENT') || entity.includes('PAYMENT')) return CheckCircle2;
  if (entity.includes('ITEM') || entity.includes('INVENTORY')) return Package;
  if (entity.includes('PICKUP') || entity.includes('DELIVERY')) return Truck;

  const map = {
    DONATION: Gift,
    APPLICATION: ClipboardList,
    ACCOUNT: User,
    SYSTEM: Bell,
    CAMPAIGN: FileText,
  };
  return map[type] || Bell;
}

function iconTone(notification) {
  const badge = notificationBadgeTone(notification);
  const map = {
    money: 'donation',
    item: 'item',
    request: 'request',
    pickup: 'pickup',
    verification: 'verification',
    application: 'application',
    account: 'account',
    default: 'system',
  };
  return map[badge] || 'system';
}

export default function NotificationItem({
  notification,
  role,
  onOpen,
  onMarkRead,
  onDelete,
}) {
  const Icon = typeIcon(notification.type, notification.relatedEntityType, notification.title);
  const tone = iconTone(notification);
  const badge = categoryBadgeLabel(notification);
  const badgeTone = notificationBadgeTone(notification);
  const canView = Boolean(resolveNotificationActionUrl(notification, role));

  return (
    <article className={cn('notif-item', !notification.read && 'notif-item--unread')}>
      <button
        type="button"
        className="notif-item__main"
        onClick={onOpen}
        aria-label={`${notification.read ? '' : 'Unread: '}${notification.title}`}
      >
        <div className={cn('notif-item__icon', `notif-item__icon--${tone}`)}>
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="notif-item__content">
          <div className="notif-item__title-row">
            <h3 className="notif-item__title">{notification.title}</h3>
            {!notification.read && <span className="notif-item__dot" aria-label="Unread" />}
          </div>
          <p className="notif-item__message">{notification.message}</p>
          <span className={cn('notif-item__badge', `notif-item__badge--${badgeTone}`)}>
            {badge}
          </span>
        </div>
      </button>

      <div className="notif-item__aside">
        <RelativeTime
          value={notification.created_at}
          className="notif-item__time"
        />
        <NotificationMenu
          notification={notification}
          showView={canView}
          onMarkRead={() => onMarkRead(notification.id)}
          onView={onOpen}
          onDelete={() => onDelete(notification.id)}
        />
      </div>
    </article>
  );
}
