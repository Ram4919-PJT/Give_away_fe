import { useNavigate } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';

const COPY = {
  'donor-my-pledges': {
    title: 'My Pledges',
    desc: 'Pledge tracking will appear here once pledge campaigns are enabled on the platform.',
  },
  'donor-recurring': {
    title: 'My Recurring Gifts',
    desc: 'Recurring gift management is coming soon. You can still donate anytime from Donate Now.',
    cta: 'Donate Now',
    to: '/dashboard/donor-donate-money?recurring=1',
  },
  'donor-campaigns': {
    title: 'Campaigns',
    desc: 'Browse active campaigns from Donate Money — campaign discovery is expanding soon.',
    cta: 'Browse causes',
    to: '/dashboard/donor-donate-money',
  },
  'donor-ngo-partners': {
    title: 'NGO Partners',
    desc: 'Partner NGO directory is being connected. Search for NGOs from the header search in the meantime.',
  },
  'donor-certificates': {
    title: 'Certificates',
    desc: 'Impact certificates unlock as you reach giving milestones. Keep donating to earn yours.',
    cta: 'View dashboard',
    to: '/dashboard/donor-dashboard',
  },
  'donor-favorites': {
    title: 'Favorites',
    desc: 'Save favorite causes here once favorites are enabled.',
  },
  'donor-payment-methods': {
    title: 'Payment Methods',
    desc: 'Saved payment methods will appear here. Checkout still supports UPI, cards, net banking, and wallets.',
    cta: 'Make a donation',
    to: '/dashboard/donor-donate-money',
  },
  'donor-help': {
    title: 'Help & Support',
    desc: 'Need help? Email support@giveaway.org or use in-app notifications for donation updates.',
  },
};

export default function DonorFeaturePlaceholder({ featureId }) {
  const navigate = useNavigate();
  const copy = COPY[featureId] || {
    title: 'Coming soon',
    desc: 'This donor feature is not available yet.',
  };

  return (
    <div className="donor-dashboard-page">
      <div className="dd-card p-8 sm:p-10 max-w-xl mx-auto text-center mt-6">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center mx-auto mb-4">
          <HeartHandshake className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0B245B]">{copy.title}</h1>
        <p className="text-sm text-[#49638F] mt-2 leading-relaxed">{copy.desc}</p>
        {copy.cta && copy.to && (
          <button
            type="button"
            onClick={() => navigate(copy.to)}
            className="mt-6 h-11 px-5 rounded-xl bg-[#1268E8] text-white font-bold border-none cursor-pointer"
          >
            {copy.cta}
          </button>
        )}
      </div>
    </div>
  );
}
