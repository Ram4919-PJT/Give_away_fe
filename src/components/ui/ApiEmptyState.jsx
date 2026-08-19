import { Inbox } from 'lucide-react';

/**
 * Standard empty state when API returns no rows.
 */
export default function ApiEmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'Information will appear here once it has been added to the platform.',
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div className={`api-empty${compact ? ' api-empty--compact' : ''}`}>
      <div className="api-empty__icon" aria-hidden="true">
        <Icon size={compact ? 32 : 40} strokeWidth={1.5} />
      </div>
      <h3 className="api-empty__title">{title}</h3>
      {description && <p className="api-empty__desc">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="dd-btn api-empty__btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
