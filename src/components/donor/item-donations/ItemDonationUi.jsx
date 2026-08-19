import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  Pencil,
  XCircle,
} from 'lucide-react';
import { PageBackLink } from '../../ui/FlowNav';
import { statusBadgeClass, statusLabel } from '../../../api/itemDonationClient';
import {
  formatCondition,
  formatItemDate,
  getItemPhoto,
  getItemTabGroup,
} from './itemDonationHelpers';

/* ─── Page shell ─── */

export function IdwPage({ children, className = '' }) {
  return <div className={`idw-page ${className}`.trim()}>{children}</div>;
}

export function IdwPageHeader({ title, subtitle, action }) {
  return (
    <header className="idw-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function IdwBack({ onClick, label = 'Back', to }) {
  return (
    <PageBackLink
      to={to}
      onClick={onClick}
      label={label}
      className="idw-back"
    />
  );
}

export function IdwCard({ children, className = '' }) {
  return <div className={`idw-card idw-card--padded ${className}`.trim()}>{children}</div>;
}

export function IdwLoading({ label = 'Loading…' }) {
  return (
    <div className="idw-loading" role="status">
      <Loader2 size={20} className="idw-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function IdwEmpty({ icon: Icon = Package, title, description, action }) {
  return (
    <div className="idw-empty idw-empty--card">
      <div className="idw-empty__icon" aria-hidden="true">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function IdwMediaPlaceholder({ Icon = Package }) {
  return (
    <div className="idw-media-placeholder" aria-hidden="true">
      <Icon size={36} strokeWidth={1.5} />
    </div>
  );
}

export function IdwDetailGrid({ items }) {
  return (
    <dl className="idw-detail-grid">
      {items.map(({ label, value }) => (
        <div key={label} className="idw-detail-grid__item">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── Item donations page components ─── */

const STATUS_ICONS = {
  approved: CheckCircle2,
  pending: Clock,
  requested: AlertCircle,
  rejected: XCircle,
  draft: Pencil,
};

export function IdwStatusBadge({ status, group }) {
  const tabGroup = group || getItemTabGroup({ status });
  const Icon = STATUS_ICONS[tabGroup];
  return (
    <span className={`${statusBadgeClass(status)} idw-status-badge`}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {statusLabel(status)}
    </span>
  );
}

function ItemCardImage({ item }) {
  const [broken, setBroken] = useState(false);
  const src = getItemPhoto(item);
  const showPlaceholder = !src || broken;

  return (
    <div className="idw-item-card__media">
      {showPlaceholder ? (
        <IdwMediaPlaceholder />
      ) : (
        <img
          src={src}
          alt={item.item_name || item.category || 'Donation item'}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
      <div className="idw-item-card__badge-wrap">
        <IdwStatusBadge status={item.status} />
      </div>
    </div>
  );
}

export function IdwItemCard({ item, onView, onRequests, onContinue, onEdit }) {
  const group = getItemTabGroup(item);
  const submitted = formatItemDate(item.submitted_at);
  const reviewed = formatItemDate(item.reviewed_at);
  const canViewRequests =
    Number(item.request_count) > 0 ||
    ['AVAILABLE', 'REQUESTED', 'RESERVED', 'FULFILLMENT_IN_PROGRESS', 'UNAVAILABLE'].includes(
      (item.status || '').toUpperCase()
    );

  return (
    <article className="idw-item-card idw-item-card--v2">
      <ItemCardImage item={item} />
      <div className="idw-item-card__body">
        <h3 className="idw-item-card__title">{item.item_name || item.category}</h3>
        <p className="idw-item-card__category">
          {item.category}
          {item.subcategory ? ` · ${item.subcategory}` : ''}
        </p>

        {group === 'pending' && (
          <p className="idw-item-card__note idw-item-card__note--pending">
            <Clock size={13} aria-hidden="true" />
            Awaiting admin approval
          </p>
        )}

        {group === 'rejected' && item.rejection_reason && (
          <p className="idw-item-card__note idw-item-card__note--rejected">
            <span className="idw-item-card__note-label">Reason:</span> {item.rejection_reason}
          </p>
        )}

        {submitted && group !== 'draft' && (
          <p className="idw-item-card__meta-line">
            Submitted: <time dateTime={item.submitted_at}>{submitted}</time>
          </p>
        )}
        {reviewed && group === 'rejected' && (
          <p className="idw-item-card__meta-line">
            Rejected: <time dateTime={item.reviewed_at}>{reviewed}</time>
          </p>
        )}

        <dl className="idw-item-card__facts">
          {item.condition && (
            <div>
              <dt>Condition</dt>
              <dd>{formatCondition(item.condition)}</dd>
            </div>
          )}
          <div>
            <dt>Quantity</dt>
            <dd>{item.quantity}</dd>
          </div>
          {item.quantity_available != null && group === 'approved' && (
            <div>
              <dt>Available</dt>
              <dd>{item.quantity_available}</dd>
            </div>
          )}
          {Number(item.request_count) > 0 && (
            <div>
              <dt>Requests</dt>
              <dd>{item.request_count}</dd>
            </div>
          )}
        </dl>

        <div className="idw-item-card__actions">
          <button type="button" className="idw-btn idw-btn--primary idw-btn--sm" onClick={onView}>
            View Details
          </button>

          {group === 'draft' && onContinue && (
            <button type="button" className="idw-btn idw-btn--secondary idw-btn--sm" onClick={onContinue}>
              Continue
            </button>
          )}

          {group === 'rejected' && onEdit && (
            <button type="button" className="idw-btn idw-btn--secondary idw-btn--sm" onClick={onEdit}>
              Edit &amp; resubmit
            </button>
          )}

          {(group === 'approved' || group === 'requested') && onRequests && canViewRequests && (
            <button type="button" className="idw-btn idw-btn--secondary idw-btn--sm" onClick={onRequests}>
              {group === 'requested' ? 'View Request' : 'Requests'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function IdwSkeletonCard() {
  return (
    <div className="idw-item-card idw-item-card--v2 idw-skeleton-card" aria-hidden="true">
      <div className="idw-skeleton-card__media" />
      <div className="idw-skeleton-card__body">
        <div className="idw-skel-line idw-skel-line--title" />
        <div className="idw-skel-line idw-skel-line--sub" />
        <div className="idw-skel-line idw-skel-line--short" />
        <div className="idw-skel-actions">
          <div className="idw-skel-btn" />
          <div className="idw-skel-btn idw-skel-btn--ghost" />
        </div>
      </div>
    </div>
  );
}

export function IdwItemStats({ stats, loading }) {
  const cards = [
    { key: 'total', label: 'Total Items', value: stats?.total ?? 0, tone: 'blue' },
    { key: 'approved', label: 'Approved', value: stats?.approved ?? 0, tone: 'green' },
    { key: 'pending', label: 'Pending Review', value: stats?.pending ?? 0, tone: 'amber' },
    { key: 'requested', label: 'Requested', value: stats?.requested ?? 0, tone: 'indigo' },
    { key: 'rejected', label: 'Rejected', value: stats?.rejected ?? 0, tone: 'red' },
  ];

  if (loading) {
    return (
      <section className="idw-item-stats" aria-hidden="true">
        {cards.map((c) => (
          <div key={c.key} className="idw-item-stat idw-item-stat--skel" />
        ))}
      </section>
    );
  }

  return (
    <section className="idw-item-stats" aria-label="Item donation statistics">
      {cards.map((c) => (
        <div key={c.key} className={`idw-item-stat idw-item-stat--${c.tone}`}>
          <span className="idw-item-stat__value">{c.value}</span>
          <span className="idw-item-stat__label">{c.label}</span>
        </div>
      ))}
    </section>
  );
}

export function IdwItemTabs({ tabs, active, onChange, counts }) {
  return (
    <div className="idw-item-tabs" role="tablist" aria-label="Filter items by status">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`idw-item-tabs__btn${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {counts?.[tab.id] != null && (
            <span className="idw-item-tabs__count">{counts[tab.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function IdwItemFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  condition,
  onConditionChange,
  sort,
  onSortChange,
  categories,
  conditions,
}) {
  return (
    <div className="idw-item-filters">
      <div className="idw-item-filters__search">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items…"
          aria-label="Search items"
        />
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="idw-item-filters__select"
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        aria-label="Filter by condition"
        className="idw-item-filters__select"
      >
        <option value="all">All conditions</option>
        {conditions.map((c) => (
          <option key={c} value={c}>{formatCondition(c)}</option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort items"
        className="idw-item-filters__select"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}

export function IdwErrorState({ message, onRetry }) {
  return (
    <div className="idw-error-state" role="alert">
      <AlertCircle size={22} aria-hidden="true" />
      <div>
        <strong>{message || 'Unable to load donation items.'}</strong>
        <p>Please try again.</p>
      </div>
      {onRetry && (
        <button type="button" className="idw-btn idw-btn--primary idw-btn--sm" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function IdwSectionEmpty({ title, description, action }) {
  return (
    <div className="idw-section-empty">
      <div className="idw-section-empty__icon" aria-hidden="true">
        <Package size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
