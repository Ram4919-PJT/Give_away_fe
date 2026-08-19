import { formatCurrency } from '../../../utils/donorHelpers';

const CARD_META = [
  { key: 'donations', label: 'Total Donations', iconBg: '#EEF5FF', iconColor: '#1268E8', growthKey: 'donation_growth_pct' },
  { key: 'lives', label: 'Lives Impacted', iconBg: '#E8F8F0', iconColor: '#12B76A', growthKey: 'impact_growth_pct' },
  { key: 'ngos', label: 'NGOs Supported', iconBg: '#F3E8FF', iconColor: '#9333EA', growthKey: 'ngo_growth_pct' },
  { key: 'years', label: 'Years of Giving', iconBg: '#FEF3C7', iconColor: '#D97706' },
];

function StatIcon({ type }) {
  if (type === 'donations') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
        <path d="M12 2v14" />
        <path d="m8 10 4 4 4-4" />
      </svg>
    );
  }
  if (type === 'lives') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
      </svg>
    );
  }
  if (type === 'ngos') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.3 7L12 16.8 5.7 21 8 14 2 9.2h7.6L12 2z" />
    </svg>
  );
}

export default function DonationStatCards({ stats, loading }) {
  if (loading) {
    return (
      <section className="dd-stats" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dd-card h-[108px] animate-pulse bg-slate-100" />
        ))}
      </section>
    );
  }

  const values = {
    donations: formatCurrency(stats?.total_donated || 0),
    lives: `${Number(stats?.lives_impacted || 0).toLocaleString('en-IN')}${stats?.lives_impacted >= 1000 ? '+' : ''}`,
    ngos: String(stats?.ngos_supported || 0),
    years: stats?.years_of_giving ? `${stats.years_of_giving} Years` : '—',
  };

  return (
    <section className="dd-stats" aria-label="Donation summary">
      {CARD_META.map((card) => {
        const growth = card.growthKey != null ? Number(stats?.[card.growthKey] || 0) : null;
        return (
          <article key={card.key} className="dd-card dd-stat">
            <div className="dd-stat__icon" style={{ background: card.iconBg, color: card.iconColor }}>
              <StatIcon type={card.key} />
            </div>
            <div className="min-w-0">
              <p className="dd-stat__label">{card.label}</p>
              <p className="dd-stat__value">{values[card.key]}</p>
              {card.key === 'years' ? (
                <p className="dd-stat__meta" style={{ color: '#1268E8' }}>Thank you! 💙</p>
              ) : (
                <p className="dd-stat__meta" style={{ color: growth >= 0 ? '#12B76A' : '#F04438' }}>
                  {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%{' '}
                  <span>from last period</span>
                </p>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
