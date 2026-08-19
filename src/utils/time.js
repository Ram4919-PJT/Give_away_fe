const LOCALE = 'en-IN';

export function parseIsoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function toIsoDateTimeAttr(value) {
  const date = parseIsoDate(value);
  return date ? date.toISOString() : null;
}

/**
 * Human-readable relative time from an ISO timestamp.
 * Pass `now` (ms) from useNow() so labels stay fresh without refetching.
 */
export function formatRelativeTime(value, now = Date.now()) {
  const date = parseIsoDate(value);
  if (!date) return null;

  const diff = now - date.getTime();
  if (diff < 0) {
    return date.toLocaleString(LOCALE, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const nowDate = new Date(now);
  const yesterday = new Date(nowDate);
  yesterday.setDate(nowDate.getDate() - 1);
  const timePart = date.toLocaleTimeString(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${timePart}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAbsoluteDate(value) {
  const date = parseIsoDate(value);
  if (!date) return null;
  return date.toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
