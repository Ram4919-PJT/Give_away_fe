import { useMemo } from 'react';
import { useNow } from '../../hooks/useNow';
import { formatRelativeTime, toIsoDateTimeAttr } from '../../utils/time';

export default function RelativeTime({
  value,
  className,
  title,
  empty = null,
  intervalMs,
}) {
  const now = useNow(intervalMs);
  const isoAttr = useMemo(() => toIsoDateTimeAttr(value), [value]);
  const label = useMemo(() => formatRelativeTime(value, now), [value, now]);

  if (!label) return empty;

  return (
    <time className={className} dateTime={isoAttr || undefined} title={title || isoAttr || undefined}>
      {label}
    </time>
  );
}
