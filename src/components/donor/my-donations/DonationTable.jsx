import { useState } from 'react';
import { Download, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/donorHelpers';
import { downloadDonationReceipt } from '../../../api/coreClient';

function StatusBadge({ status }) {
  const s = (status || 'Pending').toLowerCase();
  const tone = s.includes('complete') || s === 'active'
    ? 'ok'
    : s.includes('fail') || s.includes('cancel')
      ? 'bad'
      : 'pending';
  return (
    <span className={`md-status md-status--${tone}`}>
      <span className="md-status__dot" aria-hidden="true" />
      {status || 'Pending'}
    </span>
  );
}

function TypeBadge({ type, kind }) {
  if (type === 'ITEM') {
    return <span className="md-type md-type--item">Items</span>;
  }
  if (kind === 'recurring') {
    return <span className="md-type md-type--recurring">Recurring</span>;
  }
  return <span className="md-type md-type--once">One-time</span>;
}

function ReceiptButton({ row }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!row?.receipt_available) {
    return <span className="md-receipt-na" title="Receipt not available">—</span>;
  }

  const onDownload = async () => {
    setBusy(true);
    setErr('');
    try {
      const { blob, filename } = await downloadDonationReceipt(row.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.message || 'Download failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="md-receipt-cell">
      <button
        type="button"
        className="md-icon-btn"
        onClick={onDownload}
        disabled={busy}
        aria-label={`Download receipt for ${row.title}`}
        title={err || 'Download receipt'}
      >
        <Download size={16} />
      </button>
    </div>
  );
}

function MobileCard({ row }) {
  return (
    <article className="md-mobile-card">
      <div className="md-mobile-card__top">
        <img src={row.image_url || '/assets/donor/Education_for_All.png'} alt="" className="md-thumb" />
        <div className="min-w-0 flex-1">
          <strong className="md-cause-title">{row.title}</strong>
          <p className="md-cause-org">{row.ngo_name || '—'}</p>
          {row.category && <span className="md-cat-badge">{row.category}</span>}
        </div>
        <ReceiptButton row={row} />
      </div>
      <div className="md-mobile-card__grid">
        <div>
          <span>Date</span>
          <strong>{row.date_label || '—'}</strong>
          {row.time_label && <em>{row.time_label}</em>}
        </div>
        <div>
          <span>Amount</span>
          <strong>
            {row.amount != null ? formatCurrency(row.amount) : row.quantity != null ? `${row.quantity} items` : '—'}
          </strong>
        </div>
        <div>
          <span>Type</span>
          <TypeBadge type={row.type} kind={row.donation_kind} />
        </div>
        <div>
          <span>Status</span>
          <StatusBadge status={row.status} />
        </div>
      </div>
    </article>
  );
}

export default function DonationTable({ items, loading }) {
  if (loading) {
    return (
      <div className="md-table-wrap" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="md-skel md-skel-row" />
        ))}
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <>
      <div className="md-table-wrap md-table-wrap--desktop">
        <table className="md-table">
          <thead>
            <tr>
              <th>Cause &amp; Organization</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="md-cause">
                    <img
                      src={row.image_url || '/assets/donor/Education_for_All.png'}
                      alt=""
                      className="md-thumb"
                    />
                    <div className="min-w-0">
                      <strong className="md-cause-title">{row.title}</strong>
                      <p className="md-cause-org">{row.ngo_name || '—'}</p>
                      {row.category && <span className="md-cat-badge">{row.category}</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="md-date">
                    <strong>{row.date_label || '—'}</strong>
                    {row.time_label && <span>{row.time_label}</span>}
                  </div>
                </td>
                <td className="md-amount">
                  {row.amount != null
                    ? formatCurrency(row.amount)
                    : row.quantity != null
                      ? `${row.quantity} items`
                      : '—'}
                </td>
                <td>
                  <TypeBadge type={row.type} kind={row.donation_kind} />
                </td>
                <td className="md-pay">
                  {row.payment_method || '—'}
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <ReceiptButton row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md-mobile-list">
        {items.map((row) => (
          <MobileCard key={row.id} row={row} />
        ))}
      </div>
    </>
  );
}

export function DonationPagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="md-pagination">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="md-pagination__actions">
        <button
          type="button"
          className="md-page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="md-page-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
