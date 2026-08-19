import { cn } from '../../lib/utils';

export default function NotificationFilters({
  filters,
  activeFilter,
  summary,
  onChange,
}) {
  return (
    <section className="notif-center__summary" aria-label="Notification filters">
      {filters.map(({ id, label, summaryKey }) => {
        const count = summaryKey ? summary[summaryKey] : undefined;
        return (
          <button
            key={id}
            type="button"
            className={cn('notif-summary-chip', activeFilter === id && 'notif-summary-chip--active')}
            onClick={() => onChange(id)}
            aria-pressed={activeFilter === id}
          >
            <span className="notif-summary-chip__label">
              {label}
              {count !== undefined && <span className="notif-summary-chip__count">{count}</span>}
            </span>
          </button>
        );
      })}
    </section>
  );
}
