import { useEffect, useState } from 'react';

const TICK_MS = 60_000;

/**
 * Current time in ms, refreshed on an interval and when the tab becomes visible.
 * Use with formatRelativeTime so "5 min ago" updates without refetching data.
 */
export function useNow(intervalMs = TICK_MS) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, intervalMs);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs]);

  return now;
}
