import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import {
  getNotificationRoleConfig,
  resolveNotificationActionUrl,
} from './notificationConfig';
import NotificationsHeader from './NotificationsHeader';
import NotificationFilters from './NotificationFilters';
import NotificationList from './NotificationList';

export default function NotificationsCenter({ role = 'donor', listKey: listKeyProp }) {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const config = getNotificationRoleConfig(role);
  const listKey = listKeyProp || config.listKey;

  const handleFetched = useCallback(({ items, summary: fetchedSummary }) => {
    dispatch({
      type: 'SET_NOTIFICATION_LIST',
      payload: {
        listKey,
        items,
        unreadCount: fetchedSummary?.unread ?? 0,
      },
    });
  }, [dispatch, listKey]);

  const {
    filter,
    setFilter,
    page,
    setPage,
    items,
    summary,
    totalPages,
    loading,
    error,
    actionLoading,
    refresh,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotifications({ listKey, onFetched: handleFetched });

  const syncContextRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey, id } });
  };

  const syncContextAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: { listKey } });
  };

  const handleOpen = async (notification) => {
    if (!notification.read) {
      await markRead(notification.id);
      syncContextRead(notification.id);
    }
    const url = resolveNotificationActionUrl(notification, role);
    if (url) navigate(url);
  };

  const handleMarkRead = async (id) => {
    await markRead(id);
    syncContextRead(id);
  };

  const handleMarkAll = async () => {
    await markAllRead();
    syncContextAllRead();
  };

  return (
    <div className="page-route notif-center-shell">
      <div className="notif-center">
        <NotificationsHeader
          subtitle={config.subtitle}
          onMarkAllRead={handleMarkAll}
          onSettings={() => navigate(config.settingsPath)}
          markAllDisabled={!summary.unread}
          actionLoading={actionLoading}
        />

        <NotificationFilters
          filters={config.filters}
          activeFilter={filter}
          summary={summary}
          onChange={setFilter}
        />

        {error && (
          <div className="notif-center__error" role="alert">
            <div>
              <strong>Unable to load notifications</strong>
              <p>Please try again.</p>
            </div>
            <button type="button" className="notif-action-btn" onClick={refresh}>
              <RefreshCw size={14} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!error && (
          <NotificationList
            role={role}
            filter={filter}
            items={items}
            loading={loading}
            onOpen={handleOpen}
            onMarkRead={handleMarkRead}
            onDelete={removeNotification}
          />
        )}

        {!loading && !error && totalPages > 1 && (
          <nav className="notif-center__pagination" aria-label="Notifications pagination">
            <button
              type="button"
              className="notif-action-btn notif-action-btn--secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="notif-action-btn notif-action-btn--secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
