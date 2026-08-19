import { useNavigate } from 'react-router-dom';
import { IndianRupee, Package, ShieldCheck, Clock } from 'lucide-react';
import { useApp, isRoleVerified } from '../../../context/AppContext';
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

function DonorGiveActions({ verified, onMoney, onItems, onVerify }) {
  const isVerified = verified === true;
  const isPending = verified === 'pending';

  return (
    <div className="dd-give-actions">
      {isVerified ? (
        <>
          <button type="button" className="dd-btn dd-give-actions__primary" onClick={onMoney}>
            <IndianRupee size={18} aria-hidden="true" />
            Donate Money
          </button>
          <button type="button" className="dd-btn dd-btn-outline dd-give-actions__secondary" onClick={onItems}>
            <Package size={18} aria-hidden="true" />
            Donate Items
          </button>
        </>
      ) : isPending ? (
        <>
          <div className="dd-give-actions__notice dd-give-actions__notice--pending">
            <Clock size={18} aria-hidden="true" />
            <span>Verification is under review. You can donate money now; item donations unlock after approval.</span>
          </div>
          <button type="button" className="dd-btn dd-give-actions__primary" onClick={onMoney}>
            <IndianRupee size={18} aria-hidden="true" />
            Donate Money
          </button>
        </>
      ) : (
        <>
          <div className="dd-give-actions__notice">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Verify your account to list donation items. Money donations are available immediately.</span>
          </div>
          <button type="button" className="dd-btn dd-give-actions__primary" onClick={onVerify}>
            <ShieldCheck size={18} aria-hidden="true" />
            Complete Verification
          </button>
          <button type="button" className="dd-btn dd-btn-outline dd-give-actions__secondary" onClick={onMoney}>
            <IndianRupee size={18} aria-hidden="true" />
            Donate Money
          </button>
        </>
      )}
    </div>
  );
}

export default function DonorDashboardView() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { data, loading, error, period, setPeriod, reload } = useDonorDashboard('year');

  const verified = currentUser?.verified;
  const canDonateItems = isRoleVerified(currentUser);
  const name = data?.profile?.full_name || currentUser?.name || 'Donor';
  const stats = data?.stats;
  const empty = !loading && !error && (data?.empty || (stats && Number(stats.total_donated) <= 0 && Number(stats.items_donated) <= 0));

  const goMoney = () => navigate('/dashboard/donor-donate-money');
  const goItems = () => {
    if (!canDonateItems) {
      navigate('/dashboard/donor-verify');
      return;
    }
    navigate('/dashboard/donor-add-item');
  };
  const goVerify = () => navigate('/dashboard/donor-verify');

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
        <div className="dd-card dd-empty-welcome">
          <div className="dd-empty-welcome__art dd-hero-image-frame dd-hero-image-frame--lg">
            <img
              src="/assets/donor/Donor_Dashboard_Heart_Hands_Hero.png"
              alt=""
              width={140}
              height={140}
              decoding="async"
              className="dd-hero-image"
            />
          </div>
          <div className="dd-empty-welcome__body">
            <h2>Your giving journey starts here</h2>
            <p>Support AJA Abayahastham with a financial gift or list items for those in need.</p>
            <DonorGiveActions
              verified={verified}
              onMoney={goMoney}
              onItems={goItems}
              onVerify={goVerify}
            />
          </div>
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

      <section className="dd-card dd-quick-give" aria-label="Quick give">
        <div className="dd-quick-give__text">
          <h2 className="dd-section-title">Give today</h2>
          <p className="m-0 text-sm text-[#49638F]">Choose how you want to make an impact.</p>
        </div>
        <DonorGiveActions
          verified={verified}
          onMoney={goMoney}
          onItems={goItems}
          onVerify={goVerify}
        />
      </section>

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
