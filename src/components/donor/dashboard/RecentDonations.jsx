import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/donorHelpers';

const STATUS_CLASS = {
  Completed: 'dd-badge dd-badge--ok',
  Pending: 'dd-badge dd-badge--pending',
  Failed: 'dd-badge dd-badge--fail',
  Refunded: 'dd-badge dd-badge--refund',
  Cancelled: 'dd-badge dd-badge--cancel',
};

export default function RecentDonations({ items, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="dd-card h-[360px] animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  return (
    <article className="dd-card p-5 sm:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[#EAF0FA]">
        <h2 className="dd-section-title">Recent Donations</h2>
        <button
          type="button"
          onClick={() => navigate('/dashboard/donor-my-donations')}
          className="dd-btn-ghost text-xs inline-flex items-center gap-1"
        >
          View All <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {(items || []).length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[#49638F] text-center px-4 py-8">
          No donations yet. Your recent gifts will appear here.
        </div>
      ) : (
        <ul className="dd-recent-list flex-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/donor-donation-detail/${item.donation_id}`)}
                className="dd-row dd-recent-row"
              >
                <div className="dd-recent-main">
                  <img
                    src={item.image_url || '/assets/donor/Education_for_All.png'}
                    alt=""
                    className="dd-thumb"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="min-w-0">
                    <h3>{item.title}</h3>
                    <p>{item.ngo_name}</p>
                  </div>
                </div>
                <div className="dd-recent-meta">
                  <p className="date">{item.date_label}</p>
                  <p className="amount">
                    {item.amount != null
                      ? formatCurrency(item.amount)
                      : (item.quantity ? `${item.quantity} items` : '—')}
                  </p>
                  <span className={STATUS_CLASS[item.status] || STATUS_CLASS.Pending}>
                    {item.status}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
