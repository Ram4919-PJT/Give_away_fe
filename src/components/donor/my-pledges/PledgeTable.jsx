import { ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/donorHelpers';

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') {
    return <span className="mp-badge mp-badge--done">Completed</span>;
  }
  if (s === 'cancelled' || s === 'canceled') {
    return <span className="mp-badge mp-badge--cancel">Cancelled</span>;
  }
  return (
    <span className="mp-status">
      <span className="mp-status__dot" aria-hidden="true" />
      Active
    </span>
  );
}

function MobileCard({ row, onOpen }) {
  return (
    <article className="mp-mobile-card">
      <div className="mp-mobile-card__top">
        <img src={row.image_url || '/assets/donor/Education_for_All.png'} alt="" className="mp-thumb" />
        <div className="min-w-0 flex-1">
          <strong className="mp-cause-title">{row.title}</strong>
          <p className="mp-cause-org">{row.ngo_name}</p>
          {row.category && <span className="mp-cat-badge">{row.category}</span>}
        </div>
        <button type="button" className="mp-icon-btn" onClick={() => onOpen(row)} aria-label="View pledge">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="mp-mobile-card__grid">
        <div>
          <span>Details</span>
          <strong>{row.monthly_label}</strong>
          <em>Started {row.start_label}</em>
        </div>
        <div>
          <span>Duration</span>
          <strong>{row.duration_label}</strong>
          <em>{row.date_range_label}</em>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatCurrency(row.total_pledged)}</strong>
        </div>
        <div>
          <span>Paid</span>
          <strong>{formatCurrency(row.paid_so_far)}</strong>
          <em>{row.payments_label}</em>
        </div>
        <div>
          <span>Status</span>
          <StatusBadge status={row.status} />
        </div>
      </div>
    </article>
  );
}

export default function PledgeTable({ items, loading, onOpen }) {
  if (loading) {
    return (
      <div className="mp-table-wrap" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mp-skel mp-skel-row" />
        ))}
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <>
      <div className="mp-table-wrap mp-table-wrap--desktop">
        <table className="mp-table">
          <thead>
            <tr>
              <th>Cause &amp; Organization</th>
              <th>Pledge Details</th>
              <th>Duration</th>
              <th>Total Pledged</th>
              <th>Paid So Far</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="mp-cause">
                    <img src={row.image_url || '/assets/donor/Education_for_All.png'} alt="" className="mp-thumb" />
                    <div className="min-w-0">
                      <strong className="mp-cause-title">{row.title}</strong>
                      <p className="mp-cause-org">{row.ngo_name}</p>
                      {row.category && <span className="mp-cat-badge">{row.category}</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="mp-detail">
                    <strong>{row.monthly_label}</strong>
                    <span>Started {row.start_label}</span>
                  </div>
                </td>
                <td>
                  <div className="mp-detail">
                    <strong>{row.duration_label}</strong>
                    <span>{row.date_range_label}</span>
                  </div>
                </td>
                <td className="mp-amount">{formatCurrency(row.total_pledged)}</td>
                <td>
                  <div className="mp-detail">
                    <strong>{formatCurrency(row.paid_so_far)}</strong>
                    <span>{row.payments_label}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <button
                    type="button"
                    className="mp-icon-btn"
                    onClick={() => onOpen(row)}
                    aria-label={`View ${row.title}`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mp-mobile-list">
        {items.map((row) => (
          <MobileCard key={row.id} row={row} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}

export function PledgePagination({ page, totalPages, total, onPageChange, onLoadMore }) {
  if (!totalPages || totalPages <= 1) return null;
  const hasMore = page < totalPages;
  return (
    <div className="mp-pagination">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="mp-pagination__actions">
        <button type="button" className="mp-page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        {hasMore && onLoadMore ? (
          <button type="button" className="mp-page-btn" onClick={onLoadMore}>
            Load More
          </button>
        ) : (
          <button type="button" className="mp-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
