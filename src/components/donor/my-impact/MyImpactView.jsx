import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, HeartHandshake } from 'lucide-react';
import { useMyImpact } from '../../../hooks/useMyImpact';
import { downloadImpactReport } from '../../../api/coreClient';
import ImpactSummaryCards from './ImpactSummaryCards';
import LivesImpactedChart from './LivesImpactedChart';
import ImpactByCauseChart from './ImpactByCauseChart';
import ImpactHighlights from './ImpactHighlights';
import ImpactStories from './ImpactStories';
import ImpactJourney from './ImpactJourney';
import ImpactCta from './ImpactCta';

export default function MyImpactView() {
  const navigate = useNavigate();
  const { data, loading, error, period, setPeriod, reload } = useMyImpact('year');
  const [downloading, setDownloading] = useState(false);

  const summary = data?.summary;
  const empty = !loading && !error && Boolean(data?.empty);
  const canDownload = Boolean(data?.download_available);

  const onDownload = async () => {
    if (!canDownload) return;
    setDownloading(true);
    try {
      const { blob, filename } = await downloadImpactReport();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* keep UI quiet; retry remains available */
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <div className="donor-dashboard-page">
        <div className="dd-card p-8 text-center max-w-lg mx-auto mt-6">
          <h1 className="dd-section-title text-xl">Unable to load your impact report.</h1>
          <p className="m-0 mt-2 text-sm text-[#49638F]">Please try again in a moment.</p>
          <button type="button" onClick={reload} className="dd-btn mt-5 h-11 px-5 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="donor-dashboard-page mp-page ir-page">
        <header className="mp-header">
          <div>
            <h1 className="mp-title">Impact &amp; Reports</h1>
            <p className="mp-subtitle">See the real change you&apos;re creating through your generosity.</p>
          </div>
        </header>
        <div className="dd-card mp-empty">
          <HeartHandshake className="mp-empty__icon" aria-hidden="true" />
          <h2>No impact data yet</h2>
          <p>Make your first contribution to start creating an impact.</p>
          <button type="button" className="dd-btn" onClick={() => navigate('/dashboard/donor-donate-money')}>
            Explore Causes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-dashboard-page mp-page ir-page">
      <header className="mp-header">
        <div>
          <h1 className="mp-title">Impact &amp; Reports</h1>
          <p className="mp-subtitle">See the real change you&apos;re creating through your generosity.</p>
        </div>
        {canDownload && (
          <button
            type="button"
            className="mp-outline-btn"
            onClick={onDownload}
            disabled={downloading || loading}
          >
            <Download size={16} aria-hidden="true" />
            {downloading ? 'Preparing…' : 'Download Impact Report'}
          </button>
        )}
      </header>

      <ImpactSummaryCards summary={summary} loading={loading && !data} />

      <div className="ir-charts">
        <LivesImpactedChart
          series={data?.series}
          summary={summary}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading && !data}
        />
        <ImpactByCauseChart
          breakdown={data?.cause_breakdown}
          totalLives={summary?.lives_impacted}
          loading={loading && !data}
        />
      </div>

      <div className="ir-mid">
        <ImpactStories stories={data?.stories} loading={loading && !data} />
        <ImpactHighlights highlights={data?.highlights} loading={loading && !data} />
      </div>

      <ImpactJourney journey={data?.journey} loading={loading && !data} />
      <ImpactCta shareText={data?.share_text} loading={loading && !data} />
    </div>
  );
}
