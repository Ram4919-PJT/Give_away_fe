/**
 * Role-aware notification page configuration.
 * Filter keys map to useNotifications FILTER_MAP entries where possible.
 */

export const NOTIFICATION_ROLE_CONFIG = {
  donor: {
    subtitle: 'Stay updated on your donations and account activity.',
    settingsPath: '/dashboard/donor-settings',
    listKey: 'notifications',
    pageClass: 'donor-page donor-module',
    filters: [
      { id: 'all', label: 'All', summaryKey: 'all' },
      { id: 'unread', label: 'Unread', summaryKey: 'unread' },
      { id: 'donations', label: 'Donations', summaryKey: 'donations' },
      { id: 'account', label: 'Account', summaryKey: 'account' },
    ],
  },
  ngo: {
    subtitle: 'Stay updated on your requests, verification and account activity.',
    settingsPath: '/dashboard/ngo-settings',
    listKey: 'ngoNotifications',
    pageClass: 'ngo-page ngo-module',
    filters: [
      { id: 'all', label: 'All', summaryKey: 'all' },
      { id: 'unread', label: 'Unread', summaryKey: 'unread' },
      { id: 'verification', label: 'Verification', summaryKey: 'verification' },
      { id: 'applications', label: 'Requests', summaryKey: 'applications' },
      { id: 'account', label: 'Account', summaryKey: 'account' },
    ],
  },
  receiver: {
    subtitle: 'Stay updated on your assistance applications and account activity.',
    settingsPath: '/dashboard/receiver-settings',
    listKey: 'receiverNotifications',
    pageClass: 'receiver-page receiver-module',
    filters: [
      { id: 'all', label: 'All', summaryKey: 'all' },
      { id: 'unread', label: 'Unread', summaryKey: 'unread' },
      { id: 'applications', label: 'Applications', summaryKey: 'applications' },
      { id: 'account', label: 'Account', summaryKey: 'account' },
    ],
  },
};

export function getNotificationRoleConfig(role) {
  return NOTIFICATION_ROLE_CONFIG[role] || NOTIFICATION_ROLE_CONFIG.donor;
}

export function entityCategoryLabel(notification) {
  if (notification.relatedEntityType) {
    const map = {
      ASSISTANCE_APPLICATION: 'Application',
      DISBURSEMENT: 'Disbursement',
      VERIFICATION: 'Verification',
      NGO_FUND_REQUEST: 'Fund Request',
      ITEM_REQUEST: 'Item Request',
      ITEM_DONATION: 'Item Donation',
      MONEY_DONATION: 'Money Donation',
      PAYMENT: 'Payment',
      INVENTORY: 'Inventory',
    };
    return map[notification.relatedEntityType] || notification.relatedEntityType.replace(/_/g, ' ');
  }
  const typeMap = {
    DONATION: 'Donation',
    APPLICATION: 'Application',
    ACCOUNT: 'Account',
    SYSTEM: 'System',
    CAMPAIGN: 'Program',
  };
  return typeMap[notification.type] || 'Notification';
}

export function categoryBadgeLabel(notification) {
  const label = entityCategoryLabel(notification);
  if (/item donation request/i.test(notification.title || '')) return 'ITEM DONATION REQUEST';
  if (/pickup/i.test(notification.title || '')) return 'PICKUP';
  return label.toUpperCase();
}

export function notificationBadgeTone(notification) {
  const badge = categoryBadgeLabel(notification);
  if (badge.includes('MONEY')) return 'money';
  if (badge.includes('ITEM DONATION REQUEST')) return 'request';
  if (badge.includes('ITEM')) return 'item';
  if (badge.includes('PICKUP')) return 'pickup';
  if (badge.includes('VERIFICATION')) return 'verification';
  if (badge.includes('APPLICATION') || badge.includes('REQUEST')) return 'request';
  if (badge.includes('ACCOUNT')) return 'account';
  return 'default';
}

export function emptyStateMessage(filter, role) {
  if (filter === 'unread') return 'No unread notifications';
  if (filter === 'donations') return 'No donation notifications';
  if (filter === 'applications') {
    return role === 'receiver' ? 'No application notifications' : 'No request notifications';
  }
  if (filter === 'verification') return 'No verification notifications';
  if (filter === 'account') return 'No account notifications';
  return 'No notifications yet';
}

export function emptyStateDescription(role) {
  if (role === 'receiver') {
    return "We'll let you know when your applications are reviewed or funds are disbursed.";
  }
  if (role === 'ngo') {
    return "We'll let you know when something important happens for your organization.";
  }
  return "We'll let you know when something important happens.";
}

/**
 * Ensure action URLs work inside the dashboard router.
 */
export function resolveNotificationActionUrl(notification, role) {
  const raw = notification?.actionUrl;
  if (!raw) return null;

  if (raw.startsWith('/dashboard/')) return raw;
  if (raw.startsWith('/')) {
    const path = raw.replace(/^\//, '');
    if (path.startsWith('dashboard/')) return `/${path}`;
    return `/dashboard/${path}`;
  }

  const entity = (notification.relatedEntityType || '').toUpperCase();
  const id = notification.relatedEntityId;

  const roleRoutes = {
    donor: {
      DONATION: '/dashboard/donor-my-donations',
      ITEM_DONATION: id ? `/dashboard/donor-item-donation/${id}` : '/dashboard/donor-my-donations',
      PAYMENT: '/dashboard/donor-my-donations',
      VERIFICATION: '/dashboard/donor-verify',
    },
    ngo: {
      VERIFICATION: '/dashboard/ngo-verify',
      NGO_FUND_REQUEST: '/dashboard/ngo-request-funds',
      ITEM_REQUEST: '/dashboard/ngo-request-donations',
      INVENTORY: '/dashboard/ngo-inventory',
      ASSISTANCE_APPLICATION: '/dashboard/ngo-my-requests',
    },
    receiver: {
      VERIFICATION: '/dashboard/receiver-verify',
      ASSISTANCE_APPLICATION: id
        ? `/dashboard/receiver-application-detail/${id}`
        : '/dashboard/receiver-applications',
      DISBURSEMENT: '/dashboard/receiver-applications',
    },
  };

  return roleRoutes[role]?.[entity] || (raw.startsWith('http') ? raw : null);
}
