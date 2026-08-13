import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Download, Gift, HeartHandshake } from 'lucide-react';
import { useMyDonations } from '../../../hooks/useMyDonations';
import { formatCurrency } from '../../../utils/donorHelpers';
import { downloadDonationReceipt } from '../../../api/coreClient';
import DonationSummaryCards from './DonationSummaryCards';
import DonationTabs from './DonationTabs';
import DonationFilters from './DonationFilters';
import DonationTable, { DonationPagination } from './DonationTable';

function EmptyState({ tab, onDonate }) {
  if (tab === 'recurring') {
    return (
      <div className="md-empty">
        <HeartHandshake className="md-empty__icon" aria-hidden="true" />
        <h2>No recurring donations yet</h2>
        <p>Start a recurring gift to see it here, or manage existing gifts from My Recurring Gifts.</p>
        <button type="button" className="dd-btn" onClick={onDonate}>Donate Now</button>
      </div>
    );
  }
  if (tab === 'pledges') {
    return (
      <div className="md-empty">
        <Gift className="md-empty__icon" aria-hidden="true" />
        <h2>No pledges yet</h2>
        <p>Pledge tracking will appear here once pledge campaigns are enabled.</p>
        <button type="button" className="dd-btn" onClick={onDonate}>Explore Causes</button>
      </div>
    );
  }
  return (
    <div className="md-empty">
      <Gift className="md-empty__icon" aria-hidden="true" />
      <h2>No donations yet</h2>
      <p>Your donations will appear here once you make your first contribution.</p>
      <button type="button" className="dd-btn" onClick={onDonate}>Donate Now</button>
    </div>
  );
}

export default function MyDonationsView() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('year');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [bulkBusy, setBulkBusy] = useState(false);

  const { data, loading, error, reload } = useMyDonations({
    period,
    tab,
    category,
    page,
    pageSize: 10,
  });

  useEffect(() => {
    setPage(1);
  }, [tab, period, category]);

  const items = data?.items || [];
  const summary = data?.summary;
  const footer = data?.footer;
  const categories = data?.categories || [];
  const showEmpty = !loading && !error && items.length === 0;
  const firstReceipt = items.find((r) => r.receipt_available);

  const onDownloadLatest = async () => {
    if (!firstReceipt) return;
    setBulkBusy(true);
    try {
      const { blob, filename } = await downloadDonationReceipt(firstReceipt.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* row-level download still available */
    } finally {
      setBulkBusy(false);
    }
  };

  if (error) {
    return (
      <div className="donor-dashboard-page">
        <div className="dd-card p-8 text-center max-w-lg mx-auto mt-6">
          <h1 className="dd-section-title text-xl">Unable to load your donations.</h1>
          <p className="m-0 mt-2 text-sm text-[#49638F]">Please try again in a moment.</p>
          <button type="button" onClick={reload} className="dd-btn mt-5 h-11 px-5 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-dashboard-page md-page">
      <header className="md-header">
        <div>
          <h1 className="md-title">My Donations</h1>
          <p className="md-subtitle">Track your contributions and the impact you&apos;re creating.</p>
        </div>
        {firstReceipt && (
          <button
            type="button"
            className="md-outline-btn"
            onClick={onDownloadLatest}
            disabled={bulkBusy || loading}
          >
            <Download size={16} />
            Download Receipt
          </button>
        )}
      </header>

      <DonationSummaryCards summary={summary} loading={loading && !data} />

      <section className="dd-card md-panel">
        <div className="md-toolbar">
          <DonationTabs
            active={tab}
            onChange={(next) => {
              setTab(next);
            }}
          />
          <DonationFilters
            categories={categories}
            category={category}
            period={period}
            onCategoryChange={setCategory}
            onPeriodChange={setPeriod}
          />
        </div>

        {showEmpty ? (
          <EmptyState tab={tab} onDonate={() => navigate('/dashboard/donor-donate-money')} />
        ) : (
          <>
            <DonationTable items={items} loading={loading} />
            <DonationPagination
              page={data?.page || page}
              totalPages={data?.total_pages || 0}
              total={data?.total || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      {!showEmpty && (
        <footer className="dd-card md-footer-bar">
          <div className="md-footer-item">
            <CalendarDays size={18} className="text-[#1268E8]" aria-hidden="true" />
            <div>
              <strong>Recurring Donations</strong>
              <p>
                {footer?.recurring_count
                  ? `You have ${footer.recurring_count} active recurring donation(s).`
                  : 'You have no active recurring donations yet.'}
              </p>
            </div>
          </div>
          <div className="md-footer-item">
            <Gift size={18} className="text-[#9333EA]" aria-hidden="true" />
            <div>
              <strong>Pledges Made</strong>
              <p>
                {footer?.pledged_total != null
                  ? `Total Pledged ${formatCurrency(footer.pledged_total)}`
                  : 'No pledges recorded yet.'}
              </p>
            </div>
          </div>
          <div className="md-footer-item">
            <Clock3 size={18} className="text-[#EA580C]" aria-hidden="true" />
            <div>
              <strong>Last Donation</strong>
              <p>
                {footer?.last_donation
                  ? `${footer.last_donation.date_label || ''} ${
                      footer.last_donation.amount != null
                        ? formatCurrency(footer.last_donation.amount)
                        : ''
                    }`.trim()
                  : '—'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="md-outline-btn md-footer-cta"
            onClick={() => navigate('/dashboard/donor-recurring')}
          >
            Manage Recurring Donations
          </button>
        </footer>
      )}
    </div>
  );
}
