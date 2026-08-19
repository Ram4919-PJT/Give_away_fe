import { formatCurrency } from '../../../utils/donorHelpers';

function Icon({ type }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true };
  if (type === 'lives') {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
      </svg>
    );
  }
  if (type === 'gift') {
    return (
      <svg {...common}>
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8v13M3 12h18M12 8c-2-3-5-3-5-1s2 2 5 1c3 1 5 0 5-1s-3-2-5 1z" />
      </svg>
    );
  }
  if (type === 'amount') {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
      </svg>
    );
  }
  if (type === 'causes') {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Growth({ value }) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return (
    <p className="mp-stat__meta" style={{ color: n >= 0 ? '#12B76A' : '#F04438' }}>
      {n >= 0 ? '↑' : '↓'} {Math.abs(n).toFixed(1)}% vs last period
    </p>
  );
}

export default function ImpactSummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <section className="ir-stats" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="dd-card mp-stat mp-skel" />
        ))}
      </section>
    );
  }

  const lives = Number(summary?.lives_impacted || 0);
  const cards = [
    {
      key: 'lives',
      label: 'Total Lives Impacted',
      value: lives > 0 ? `${lives.toLocaleString('en-IN')}${lives >= 1000 ? '+' : ''}` : '0',
      growth: summary?.lives_growth_pct,
      icon: 'lives',
      bg: '#E8F8F0',
      color: '#12B76A',
    },
    {
      key: 'donations',
      label: 'Total Donations',
      value: String(summary?.donations_count ?? 0),
      growth: summary?.donations_growth_pct,
      icon: 'gift',
      bg: '#EEF5FF',
      color: '#1268E8',
    },
    {
      key: 'amount',
      label: 'Total Amount Donated',
      value: formatCurrency(summary?.total_donated ?? 0),
      growth: summary?.amount_growth_pct,
      icon: 'amount',
      bg: '#F3E8FF',
      color: '#9333EA',
    },
    {
      key: 'causes',
      label: 'Causes Supported',
      value: String(summary?.causes_supported ?? 0),
      growth: summary?.causes_growth_pct,
      icon: 'causes',
      bg: '#FFF7ED',
      color: '#EA580C',
    },
    {
      key: 'ngos',
      label: 'NGOs Supported',
      value: String(summary?.ngos_supported ?? 0),
      growth: summary?.ngos_growth_pct,
      icon: 'ngos',
      bg: '#EEF5FF',
      color: '#1268E8',
    },
  ];

  return (
    <section className="ir-stats" aria-label="Impact summary">
      {cards.map((card) => (
        <article key={card.key} className="dd-card mp-stat">
          <div className="mp-stat__icon" style={{ background: card.bg, color: card.color }}>
            <Icon type={card.icon} />
          </div>
          <div className="min-w-0">
            <p className="mp-stat__label">{card.label}</p>
            <p className="mp-stat__value">{card.value}</p>
            <Growth value={card.growth} />
          </div>
        </article>
      ))}
    </section>
  );
}
