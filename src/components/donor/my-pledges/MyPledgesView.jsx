import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Handshake } from 'lucide-react';
import { useMyPledges } from '../../../hooks/useMyPledges';
import { downloadPledgesSummary } from '../../../api/coreClient';
import { formatCurrency } from '../../../utils/donorHelpers';
import PledgeSummaryCards from './PledgeSummaryCards';
import PledgeTabs from './PledgeTabs';
import PledgeFilters from './PledgeFilters';
import PledgeTable, { PledgePagination } from './PledgeTable';
import { ImpactSummary, UpcomingPayments, PledgeBenefits } from './PledgeSidePanels';

function EmptyState({ onDonate }) {
  return (
    <div className="mp-empty">
      <Handshake className="mp-empty__icon" aria-hidden="true" />
      <h2>No pledges yet</h2>
      <p>Your pledges will appear here once you make one.</p>
      <button type="button" className="dd-btn" onClick={onDonate}>Donate Now</button>
    </div>
  );
}

function DetailModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="mp-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dd-card mp-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Pledge details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mp-modal__head">
          <div>
            <h2>{row.title}</h2>
            <p>{row.ngo_name} · {row.category}</p>
          </div>
          <button type="button" className="mp-page-btn" onClick={onClose}>Close</button>
        </div>
        <dl className="mp-modal__grid">
          <div><dt>Monthly</dt><dd>{row.monthly_label}</dd></div>
          <div><dt>Duration</dt><dd>{row.duration_label}</dd></div>
          <div><dt>Total pledged</dt><dd>{formatCurrency(row.total_pledged)}</dd></div>
          <div><dt>Paid so far</dt><dd>{formatCurrency(row.paid_so_far)}</dd></div>
          <div><dt>Progress</dt><dd>{row.payments_label}</dd></div>
          <div><dt>Status</dt><dd>{row.status}</dd></div>
          <div><dt>Payment method</dt><dd>{row.payment_method || '—'}</dd></div>
          <div><dt>Next payment</dt><dd>{row.next_payment_label || '—'}</dd></div>
        </dl>
      </div>
    </div>
  );
}

export default function MyPledgesView() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const { data, loading, error, reload } = useMyPledges({
    period,
    tab,
    category,
    page,
    pageSize: 8,
  });

  useEffect(() => {
    setPage(1);
  }, [tab, period, category]);

  const items = data?.items || [];
  const showEmpty = !loading && !error && (data?.empty || items.length === 0);
  const canDownload = Boolean(data?.download_available);

  const onDownload = async () => {
    if (!canDownload) return;
    setDownloading(true);
    try {
      const { blob, filename } = await downloadPledgesSummary();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* keep UI quiet; row actions still work */
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <div className="donor-dashboard-page">
        <div className="dd-card p-8 text-center max-w-lg mx-auto mt-6">
          <h1 className="dd-section-title text-xl">Unable to load your pledges.</h1>
          <p className="m-0 mt-2 text-sm text-[#49638F]">Please try again in a moment.</p>
          <button type="button" onClick={reload} className="dd-btn mt-5 h-11 px-5 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-dashboard-page mp-page">
      <header className="mp-header">
        <div>
          <h1 className="mp-title">My Pledges</h1>
          <p className="mp-subtitle">Track the promises you&apos;ve made to create lasting change.</p>
        </div>
        {canDownload && (
          <button
            type="button"
            className="mp-outline-btn"
            onClick={onDownload}
            disabled={downloading || loading}
          >
            <Download size={16} />
            Download Pledge Summary
          </button>
        )}
      </header>

      <PledgeSummaryCards summary={data?.summary} loading={loading && !data} />

      <div className="mp-layout">
        <section className="dd-card mp-panel">
          <div className="mp-toolbar">
            <PledgeTabs active={tab} onChange={setTab} />
            <PledgeFilters
              categories={data?.categories || []}
              category={category}
              period={period}
              onCategoryChange={setCategory}
              onPeriodChange={setPeriod}
            />
          </div>

          <div className="mp-panel-title-row">
            <h2>Your Pledges</h2>
          </div>

          {showEmpty ? (
            <EmptyState onDonate={() => navigate('/dashboard/donor-donate-money')} />
          ) : (
            <>
              <PledgeTable items={items} loading={loading} onOpen={setSelected} />
              <PledgePagination
                page={data?.page || page}
                totalPages={data?.total_pages || 0}
                total={data?.total || 0}
                onPageChange={setPage}
                onLoadMore={() => setPage((p) => p + 1)}
              />
            </>
          )}
        </section>

        <aside className="mp-aside">
          <ImpactSummary impact={data?.impact} loading={loading && !data} />
          <UpcomingPayments
            items={data?.upcoming_payments}
            loading={loading && !data}
            onViewAll={() => {
              setTab('active');
              setPage(1);
            }}
          />
          <PledgeBenefits benefits={data?.benefits} />
        </aside>
      </div>

      <DetailModal row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
