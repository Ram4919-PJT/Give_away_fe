import { useNavigate } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';

const COPY = {
  'donor-my-pledges': {
    title: 'My Pledges',
    emptyTitle: 'No pledges yet',
    emptyDesc: 'Pledge campaigns will appear here when available on the platform.',
    cta: 'Browse causes',
    to: '/dashboard/donor-donate-money',
  },
  'donor-certificates': {
    title: 'Certificates',
    emptyDesc: 'Impact certificates unlock as you reach giving milestones.',
    cta: 'View dashboard',
    to: '/dashboard/donor-dashboard',
  },
  'donor-favorites': {
    title: 'Favorites',
    emptyDesc: 'Save favorite causes here once favorites are enabled.',
  },
  'donor-payment-methods': {
    title: 'Payment Methods',
    emptyDesc: 'Saved payment methods will appear here after you complete a donation.',
    cta: 'Make a donation',
    to: '/dashboard/donor-donate-money',
  },
  'donor-help': {
    title: 'Help & Support',
    emptyDesc: 'Email support@giveaway.org or check notifications for donation updates.',
  },
};

export default function DonorFeaturePlaceholder({ featureId }) {
  const navigate = useNavigate();
  const copy = COPY[featureId] || {
    title: 'Coming soon',
    emptyDesc: 'This donor feature is not available yet.',
  };

  const Icon = copy.icon || HeartHandshake;

  return (
    <div className="donor-dashboard-page">
      <div className="dd-card p-8 sm:p-10 max-w-xl mx-auto text-center mt-6">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0B245B]">{copy.title}</h1>
        <p className="text-sm text-[#49638F] mt-2 leading-relaxed">{copy.emptyDesc}</p>
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
