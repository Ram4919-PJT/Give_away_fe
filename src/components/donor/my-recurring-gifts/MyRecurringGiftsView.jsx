import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useMyRecurringGifts } from '../../../hooks/useMyRecurringGifts';
import {
  cancelRecurringGift,
  pauseRecurringGift,
  resumeRecurringGift,
  updateRecurringGift,
} from '../../../api/coreClient';
import { useToast } from '../../ui/Toast';
import RecurringGiftSummaryCards from './RecurringGiftSummaryCards';
import RecurringGiftTabs from './RecurringGiftTabs';
import RecurringGiftFilters from './RecurringGiftFilters';
import RecurringGiftTable, { RecurringGiftPagination } from './RecurringGiftTable';
import { MonthlyImpactSummary, UpcomingPayments, WhyRecurringMatters } from './RecurringGiftSidePanels';
import {
  RecurringGiftConfirmModal,
  RecurringGiftDetailsModal,
  RecurringGiftEditModal,
} from './RecurringGiftModals';

function EmptyState({ onExplore, onStart }) {
  return (
    <div className="mp-empty">
      <RefreshCw className="mp-empty__icon" aria-hidden="true" />
      <h2>No recurring gifts yet</h2>
      <p>Start a recurring gift and create a lasting impact.</p>
      <div className="rg-empty-actions">
        <button type="button" className="dd-btn" onClick={onStart}>Start a Recurring Gift</button>
        <button type="button" className="mp-page-btn" onClick={onExplore}>Explore Causes</button>
      </div>
    </div>
  );
}

export default function MyRecurringGiftsView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const tableRef = useRef(null);
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('next_payment');
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const { data, loading, error, reload } = useMyRecurringGifts({
    period,
    tab,
    category,
    sort,
    page,
    pageSize: 8,
  });

  useEffect(() => {
    setPage(1);
  }, [tab, period, category, sort]);

  const items = data?.items || [];
  const noGiftsAtAll = Boolean(data?.empty);
  const noFilteredResults = !loading && !error && !noGiftsAtAll && items.length === 0;
  const showEmpty = !loading && !error && noGiftsAtAll;
  const frequencies = data?.meta?.frequencies || [];
  const paymentMethods = data?.meta?.payment_methods || [];

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const runMutation = async (action, successMessage) => {
    setBusy(true);
    try {
      await action();
      showToast(successMessage, 'success');
      setEditing(null);
      setConfirm(null);
      await reload();
    } catch (err) {
      showToast(err?.message || 'Unable to update this recurring gift.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="donor-dashboard-page">
        <div className="dd-card p-8 text-center max-w-lg mx-auto mt-6">
          <h1 className="dd-section-title text-xl">Unable to load your recurring gifts.</h1>
          <p className="m-0 mt-2 text-sm text-[#49638F]">Please try again in a moment.</p>
          <button type="button" onClick={reload} className="dd-btn mt-5 h-11 px-5 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-dashboard-page mp-page rg-page">
      <header className="mp-header">
        <div>
          <h1 className="mp-title">My Recurring Gifts</h1>
          <p className="mp-subtitle">Your ongoing support helps create a lasting impact.</p>
        </div>
        {!showEmpty && (
          <button type="button" className="mp-outline-btn" onClick={scrollToTable} disabled={loading}>
            Manage All Recurring Gifts
          </button>
        )}
      </header>

      <RecurringGiftSummaryCards summary={data?.summary} loading={loading && !data} />

      <div className="mp-layout">
        <section className="dd-card mp-panel" ref={tableRef}>
          <div className="mp-toolbar">
            <RecurringGiftTabs active={tab} onChange={setTab} />
            <RecurringGiftFilters
              categories={data?.categories || []}
              category={category}
              period={period}
              sort={sort}
              sortOptions={data?.meta?.sort_options}
              onCategoryChange={setCategory}
              onPeriodChange={setPeriod}
              onSortChange={setSort}
            />
          </div>

          {showEmpty ? (
            <EmptyState
              onExplore={() => navigate('/dashboard/donor-donate-money')}
              onStart={() => navigate('/dashboard/donor-donate-money?recurring=1')}
            />
          ) : noFilteredResults ? (
            <div className="mp-empty">
              <h2>No matching recurring gifts</h2>
              <p>Try another tab, cause, or date filter.</p>
            </div>
          ) : (
            <>
              <RecurringGiftTable
                items={items}
                loading={loading}
                onEdit={setEditing}
                onPause={(row) => setConfirm({ type: 'pause', row })}
                onResume={(row) => setConfirm({ type: 'resume', row })}
                onCancel={(row) => setConfirm({ type: 'cancel', row })}
                onView={setDetails}
              />
              <RecurringGiftPagination
                page={data?.page || page}
                totalPages={data?.total_pages || 0}
                total={data?.total || 0}
                onPageChange={setPage}
              />
            </>
          )}
        </section>

        <aside className="mp-aside">
          <MonthlyImpactSummary impact={data?.impact} loading={loading && !data} />
          <UpcomingPayments items={data?.upcoming_payments} loading={loading && !data} />
          <WhyRecurringMatters />
        </aside>
      </div>

      {!showEmpty && (
        <section className="rg-banner">
          <div>
            <h2>Your Consistent Support is Powerful!</h2>
            <p>Need to make changes? Update amount, pause, or cancel any gift below.</p>
          </div>
          <button type="button" className="dd-btn" onClick={scrollToTable}>
            Manage Recurring Gifts
          </button>
        </section>
      )}

      <RecurringGiftDetailsModal row={details} onClose={() => setDetails(null)} />
      <RecurringGiftEditModal
        row={editing}
        frequencies={frequencies}
        paymentMethods={paymentMethods}
        submitting={busy}
        onClose={() => setEditing(null)}
        onSubmit={(payload) => runMutation(
          () => updateRecurringGift(editing.gift_id, payload),
          'Recurring gift updated.',
        )}
      />
      <RecurringGiftConfirmModal
        row={confirm?.row}
        type={confirm?.type}
        submitting={busy}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          const row = confirm?.row;
          if (!row) return;
          if (confirm.type === 'pause') {
            runMutation(() => pauseRecurringGift(row.gift_id), 'Recurring gift paused.');
          } else if (confirm.type === 'resume') {
            runMutation(() => resumeRecurringGift(row.gift_id), 'Recurring gift resumed.');
          } else if (confirm.type === 'cancel') {
            runMutation(() => cancelRecurringGift(row.gift_id), 'Recurring gift cancelled.');
          }
        }}
      />
    </div>
  );
}
