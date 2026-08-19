import { useCallback, useEffect, useMemo, useState } from 'react';
import * as notificationsClient from '../api/notificationsClient';
import { mapNotificationFromApi } from '../api/mappers';

const EMPTY_SUMMARY = {
  all: 0,
  unread: 0,
  donations: 0,
  campaigns: 0,
  account: 0,
  applications: 0,
  verification: 0,
};

const FILTER_MAP = {
  all: {},
  unread: { status: 'UNREAD' },
  donations: { type: 'DONATION' },
  campaigns: { type: 'CAMPAIGN' },
  account: { type: 'ACCOUNT' },
  applications: { type: 'APPLICATION' },
  verification: { type: 'ACCOUNT' },
};

function isVerificationNotification(notification) {
  const entity = (notification.relatedEntityType || '').toUpperCase();
  if (entity === 'VERIFICATION') return true;
  return /verification/i.test(notification.title || '');
}

function augmentSummary(summary, items) {
  const verification = items.filter(isVerificationNotification).length;
  return { ...EMPTY_SUMMARY, ...summary, verification };
}

export function useNotifications({ pageSize = 20, listKey, onFetched } = {}) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...FILTER_MAP[filter],
      };
      const response = await notificationsClient.listNotifications(params);
      const rows = Array.isArray(response) ? response : response?.items || [];
      let mapped = rows.map(mapNotificationFromApi);

      if (filter === 'verification') {
        mapped = mapped.filter(isVerificationNotification);
      } else if (filter === 'account') {
        mapped = mapped.filter((n) => !isVerificationNotification(n));
      }

      const nextSummary = augmentSummary(response?.summary || EMPTY_SUMMARY, mapped);
      setItems(mapped);
      setSummary(nextSummary);
      setTotal(filter === 'verification' || filter === 'account'
        ? mapped.length
        : (response?.total ?? rows.length));
      onFetched?.({
        items: mapped,
        summary: nextSummary,
        listKey,
      });
    } catch (err) {
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [filter, page, pageSize, listKey, onFetched]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await notificationsClient.listNotifications({
          page: 1,
          page_size: 100,
          type: 'ACCOUNT',
        });
        const rows = Array.isArray(response) ? response : response?.items || [];
        const verificationCount = rows
          .map(mapNotificationFromApi)
          .filter(isVerificationNotification).length;
        if (!cancelled) {
          setSummary((prev) => ({ ...prev, verification: verificationCount }));
        }
      } catch {
        /* optional enrichment */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const markRead = useCallback(async (id) => {
    setItems((prev) => {
      if (filter === 'unread') {
        return prev.filter((n) => n.id !== id);
      }
      return prev.map((n) => (n.id === id ? { ...n, read: true } : n));
    });
    setSummary((prev) => ({
      ...prev,
      unread: Math.max(0, (prev.unread ?? 0) - 1),
    }));
    try {
      await notificationsClient.markNotificationRead(id);
    } catch {
      fetchNotifications();
    }
  }, [filter, fetchNotifications]);

  const markAllRead = useCallback(async () => {
    setActionLoading(true);
    try {
      await notificationsClient.markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setSummary((prev) => ({ ...prev, unread: 0 }));
    } catch (err) {
      setError(err?.message || 'Failed to mark all as read');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeNotification = useCallback(async (id) => {
    const previous = items;
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationsClient.deleteNotification(id);
      await fetchNotifications();
    } catch {
      setItems(previous);
      setError('Failed to delete notification');
    }
  }, [items, fetchNotifications]);

  const changeFilter = useCallback((next) => {
    setFilter(next);
    setPage(1);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  return {
    filter,
    setFilter: changeFilter,
    page,
    setPage,
    items,
    summary,
    total,
    totalPages,
    loading,
    error,
    actionLoading,
    refresh: fetchNotifications,
    markRead,
    markAllRead,
    removeNotification,
  };
}
