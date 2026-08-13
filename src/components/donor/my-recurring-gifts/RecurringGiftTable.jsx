import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pause, Pencil, Play, Eye } from 'lucide-react';

export function RecurringGiftStatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  if (s === 'paused') return <span className="rg-badge rg-badge--paused">Paused</span>;
  if (s === 'cancelled' || s === 'canceled') return <span className="rg-badge rg-badge--cancel">Cancelled</span>;
  if (s === 'completed') return <span className="rg-badge rg-badge--done">Completed</span>;
  return <span className="rg-badge rg-badge--active">Active</span>;
}

function ActionMenu({ row, onEdit, onPause, onResume, onCancel, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="rg-menu" ref={ref}>
      <button
        type="button"
        className="mp-icon-btn"
        aria-label={`More options for ${row.title}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="rg-menu__panel" role="menu">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onView(row); }}>
            View details
          </button>
          {row.can_edit && (
            <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(row); }}>
              Edit gift
            </button>
          )}
          {row.can_cancel && (
            <button type="button" role="menuitem" className="rg-menu__danger" onClick={() => { setOpen(false); onCancel(row); }}>
              Cancel gift
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RowActions({ row, onEdit, onPause, onResume, onCancel, onView }) {
  return (
    <div className="rg-actions">
      {row.can_edit && (
        <button type="button" className="mp-icon-btn" aria-label={`Edit ${row.title}`} onClick={() => onEdit(row)}>
          <Pencil size={15} />
        </button>
      )}
      {row.can_pause && (
        <button type="button" className="mp-icon-btn" aria-label={`Pause ${row.title}`} onClick={() => onPause(row)}>
          <Pause size={15} />
        </button>
      )}
      {row.can_resume && (
        <button type="button" className="mp-icon-btn" aria-label={`Resume ${row.title}`} onClick={() => onResume(row)}>
          <Play size={15} />
        </button>
      )}
      {!row.can_edit && !row.can_pause && !row.can_resume && (
        <button type="button" className="mp-icon-btn" aria-label={`View ${row.title}`} onClick={() => onView(row)}>
          <Eye size={15} />
        </button>
      )}
      <ActionMenu
        row={row}
        onEdit={onEdit}
        onPause={onPause}
        onResume={onResume}
        onCancel={onCancel}
        onView={onView}
      />
    </div>
  );
}

function MobileCard({ row, onEdit, onPause, onResume, onCancel, onView }) {
  return (
    <article className="mp-mobile-card">
      <div className="mp-mobile-card__top">
        <img src={row.image_url || '/assets/donor/Education_for_All.png'} alt="" className="mp-thumb" />
        <div className="min-w-0 flex-1">
          <strong className="mp-cause-title">{row.title}</strong>
          <p className="mp-cause-org">{row.ngo_name}</p>
          {row.category && <span className="mp-cat-badge">{row.category}</span>}
        </div>
      </div>
      <div className="mp-mobile-card__grid">
        <div>
          <span>Amount</span>
          <strong>{row.amount_label}</strong>
          <em>{row.frequency_label}</em>
        </div>
        <div>
          <span>Next Payment</span>
          <strong>{row.next_payment_label || '—'}</strong>
          <em>{row.next_payment_relative || ''}</em>
        </div>
        <div>
          <span>Start Date</span>
          <strong>{row.start_label}</strong>
          <em>{row.start_relative || ''}</em>
        </div>
        <div>
          <span>Status</span>
          <RecurringGiftStatusBadge status={row.status} />
        </div>
      </div>
      <div className="rg-mobile-actions">
        <RowActions
          row={row}
          onEdit={onEdit}
          onPause={onPause}
          onResume={onResume}
          onCancel={onCancel}
          onView={onView}
        />
      </div>
    </article>
  );
}

export default function RecurringGiftTable({
  items,
  loading,
  onEdit,
  onPause,
  onResume,
  onCancel,
  onView,
}) {
  if (loading) {
    return (
      <div className="mp-table-wrap" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mp-skel mp-skel-row" />
        ))}
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <>
      <div className="mp-table-wrap mp-table-wrap--desktop" id="rg-table">
        <table className="mp-table rg-table">
          <thead>
            <tr>
              <th>Cause &amp; Organization</th>
              <th>Amount &amp; Frequency</th>
              <th>Next Payment</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Actions</th>
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
                    <strong>{row.amount_label}</strong>
                    <span>{row.frequency_label}</span>
                  </div>
                </td>
                <td>
                  <div className="mp-detail">
                    <strong>{row.next_payment_label || '—'}</strong>
                    <span>{row.next_payment_relative || ''}</span>
                  </div>
                </td>
                <td>
                  <div className="mp-detail">
                    <strong>{row.start_label}</strong>
                    <span>{row.start_relative || ''}</span>
                  </div>
                </td>
                <td>
                  <RecurringGiftStatusBadge status={row.status} />
                </td>
                <td>
                  <RowActions
                    row={row}
                    onEdit={onEdit}
                    onPause={onPause}
                    onResume={onResume}
                    onCancel={onCancel}
                    onView={onView}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mp-mobile-list">
        {items.map((row) => (
          <MobileCard
            key={row.id}
            row={row}
            onEdit={onEdit}
            onPause={onPause}
            onResume={onResume}
            onCancel={onCancel}
            onView={onView}
          />
        ))}
      </div>
    </>
  );
}

export function RecurringGiftPagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mp-pagination">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="mp-pagination__actions">
        <button type="button" className="mp-page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button type="button" className="mp-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
