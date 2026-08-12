import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useDonorDashboard } from '../../../hooks/useDonorDashboard';
import { formatCurrency } from '../../../utils/donorHelpers';
import WelcomeBanner from './WelcomeBanner';
import DonationStatCards from './DonationStatCards';
import DonationOverview from './DonationOverview';
import RecentDonations from './RecentDonations';
import NextMilestone from './NextMilestone';
import GivingStreak from './GivingStreak';
import TopCauses from './TopCauses';
import ImpactFooter from './ImpactFooter';

export default function DonorDashboardView() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { data, loading, error, period, setPeriod, reload } = useDonorDashboard('year');

  const name = data?.profile?.full_name || currentUser?.name || 'Donor';
  const stats = data?.stats;
  const empty = !loading && !error && (data?.empty || (stats && Number(stats.total_donated) <= 0 && Number(stats.items_donated) <= 0));

  if (error) {
    return (
      <div className="donor-dashboard-page">
        <div className="dd-card p-8 text-center max-w-lg mx-auto mt-6">
          <h1 className="dd-section-title text-xl">Unable to load your dashboard.</h1>
          <p className="m-0 mt-2 text-sm text-[#49638F]">{error}</p>
          <button type="button" onClick={reload} className="dd-btn mt-5 h-11 px-5 text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="donor-dashboard-page dd-stack">
        <WelcomeBanner
          name={name}
          impact={{ total_donated: 0, lives_impacted: 0, causes_supported: 0 }}
          loading={false}
        />
        <div className="dd-card p-8 sm:p-10 text-center">
          <div className="dd-hero__art mx-auto mb-4" style={{ maxWidth: 140 }}>
            <img
              src="/assets/donor/Donor_Dashboard_Heart_Hands_Hero.png"
              alt=""
              width={140}
              height={140}
              decoding="async"
            />
          </div>
          <h2 className="m-0 text-2xl font-extrabold text-[#0B245B] tracking-tight">
            Your giving journey starts here.
          </h2>
          <p className="m-0 mt-2 text-sm text-[#49638F] max-w-md mx-auto leading-relaxed">
            Make your first donation and start creating real impact.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/donor-donate-money')}
            className="dd-btn mt-6 h-11 px-6 text-sm"
          >
            Donate Now
          </button>
        </div>
      </div>
    );
  }

  const shareText = `I've contributed ${formatCurrency(stats?.total_donated || 0)} and supported ${stats?.causes_supported || 0} causes on Give Away.`;

  return (
    <div className="donor-dashboard-page dd-stack">
      <WelcomeBanner
        name={name}
        impact={{
          total_donated: stats?.total_donated,
          lives_impacted: stats?.lives_impacted,
          causes_supported: stats?.causes_supported,
        }}
        loading={loading}
      />

      <DonationStatCards stats={stats} loading={loading} />

      <section className="dd-main-grid">
        <DonationOverview
          series={data?.series}
          causeBreakdown={data?.cause_breakdown}
          periodTotal={stats?.period_total}
          growthPct={stats?.donation_growth_pct}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading}
        />
        <div className="dd-side-stack">
          <RecentDonations items={data?.recent_donations} loading={loading} />
          <div className="dd-side-pair">
            <NextMilestone milestone={data?.milestone} loading={loading} />
            <GivingStreak streak={data?.giving_streak} loading={loading} />
          </div>
        </div>
      </section>

      <TopCauses causes={data?.top_causes} loading={loading} />
      <ImpactFooter snapshot={data?.impact_snapshot} shareText={shareText} loading={loading} />
    </div>
  );
}
