import { Package } from 'lucide-react';
import { computeRequestStats } from '../../../data/ngoDonationCategories';

const STAT_ITEMS = [
  { key: 'open', label: 'Open Requests', className: 'rd-stat--open' },
  { key: 'approved', label: 'Approved', className: 'rd-stat--approved' },
  { key: 'delivered', label: 'Delivered', className: 'rd-stat--delivered' },
  { key: 'pending', label: 'Pending', className: 'rd-stat--pending' },
  { key: 'rejected', label: 'Rejected', className: 'rd-stat--rejected' }
];

export default function RequestHero({ requests }) {
  const stats = computeRequestStats(requests);

  return (
    <header className="rd-hero">
      <div className="rd-hero__top">
        <div>
          <span className="rd-hero__badge">
            <Package size={12} strokeWidth={2.5} />
            Resource Requests
          </span>
          <h1>Request Donations</h1>
          <p className="rd-hero__desc">
            Create requests for resources needed by your beneficiaries.
          </p>
        </div>
        <div className="rd-hero__icon" aria-hidden="true">
          <Package size={30} strokeWidth={1.5} />
        </div>
      </div>

      <div className="rd-stats">
        {STAT_ITEMS.map(({ key, label, className }) => (
          <div key={key} className={`rd-stat ${className}`}>
            <span className="rd-stat__val">{stats[key]}</span>
            <span className="rd-stat__label">{label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
