import { ArrowUpRight } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import {
  getPriorityStyle,
  matchCategoryLabel,
  normalizeRequestStatus
} from '../../../data/ngoDonationCategories';
import CategoryIcon from './CategoryIcon';

const STATUS_CLASS = {
  Pending: 'rd-status--pending',
  Approved: 'rd-status--approved',
  'In Progress': 'rd-status--progress',
  Completed: 'rd-status--completed',
  Rejected: 'rd-status--rejected'
};

export default function RecentRequests({ requests }) {
  const { showToast } = useToast();
  const items = (requests || []).filter((r) => r.type === 'Items').slice(0, 6);

  return (
    <section className="rd-recent" aria-labelledby="rd-recent-heading">
      <div className="rd-recent__head">
        <h2 id="rd-recent-heading">Recent Requests</h2>
      </div>

      {!items.length ? (
        <div className="rd-recent-empty">
          No donation requests yet. Create your first request above.
        </div>
      ) : (
        <div className="rd-recent-list">
          {items.map((req) => {
            const cat = matchCategoryLabel(req.category);
            const statusKey = normalizeRequestStatus(req.status);
            const pri = getPriorityStyle(req.priority || 'Medium');
            const subs = Array.isArray(req.subcategories) ? req.subcategories : [];

            return (
              <article key={req.id} className="rd-recent-card">
                <div className="rd-recent-card__icon">
                  <CategoryIcon name={cat?.iconName || 'Package'} size={20} />
                </div>

                <div className="rd-recent-card__body">
                  <h3>{req.purpose || req.title || 'Untitled Request'}</h3>
                  <p className="rd-recent-card__meta">
                    <span>{req.id}</span>
                    <span>·</span>
                    <span>{req.category || 'General'}</span>
                    {subs.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{subs.slice(0, 2).join(', ')}{subs.length > 2 ? ` +${subs.length - 2}` : ''}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{req.appliedDate || '—'}</span>
                    <span>·</span>
                    <span style={{ color: pri.color, fontWeight: 600 }}>{req.priority || 'Medium'}</span>
                  </p>
                </div>

                <span className={`rd-status ${STATUS_CLASS[statusKey] || 'rd-status--pending'}`}>
                  {statusKey}
                </span>

                <div className="rd-recent-card__stats">
                  <span>{req.quantity != null ? `${req.quantity} units` : '—'}</span>
                  <span>
                    {req.beneficiaryCount != null
                      ? `${req.beneficiaryCount} people`
                      : (req.beneficiary || '—')}
                  </span>
                </div>

                <button
                  type="button"
                  className="rd-btn rd-btn--ghost rd-btn--sm"
                  onClick={() => showToast(`Opening ${req.id} (wireframe).`, 'info')}
                >
                  View Details
                  <ArrowUpRight size={14} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
