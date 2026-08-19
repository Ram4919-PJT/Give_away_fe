import { formatCurrency } from '../../../utils/donorHelpers';

function Growth({ value, label = 'from last period' }) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  const up = n >= 0;
  return (
    <p className="md-stat__meta" style={{ color: up ? '#12B76A' : '#F04438' }}>
      {up ? '↑' : '↓'} {Math.abs(n).toFixed(1)}% <span>{label}</span>
    </p>
  );
}

function Icon({ type }) {
  if (type === 'gift') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8v13M3 12h18M12 8c-2-3-5-3-5-1s2 2 5 1c3 1 5 0 5-1s-3-2-5 1z" />
      </svg>
    );
  }
  if (type === 'lives') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
      </svg>
    );
  }
  if (type === 'count') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.3 7L12 16.8 5.7 21 8 14 2 9.2h7.6L12 2z" />
    </svg>
  );
}

export default function DonationSummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <section className="md-stats" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dd-card md-stat md-skel" />
        ))}
      </section>
    );
  }

  const top = summary?.top_cause;
  const cards = [
    {
      key: 'total',
      label: 'Total Donated',
      value: formatCurrency(summary?.total_donated ?? 0),
      icon: 'gift',
      bg: '#EEF5FF',
      color: '#1268E8',
      growth: summary?.donation_growth_pct,
    },
    {
      key: 'lives',
      label: 'Lives Impacted',
      value: `${Number(summary?.lives_impacted || 0).toLocaleString('en-IN')}${Number(summary?.lives_impacted || 0) >= 1000 ? '+' : ''}`,
      icon: 'lives',
      bg: '#E8F8F0',
      color: '#12B76A',
      growth: summary?.impact_growth_pct,
    },
    {
      key: 'count',
      label: 'Total Donations',
      value: String(summary?.donations_count ?? 0),
      icon: 'count',
      bg: '#F3E8FF',
      color: '#9333EA',
      growth: null,
    },
    {
      key: 'cause',
      label: 'Top Cause',
      value: top?.name || '—',
      icon: 'star',
      bg: '#FFF7ED',
      color: '#EA580C',
      sub: top
        ? `${formatCurrency(top.amount)} (${Number(top.percent).toFixed(0)}%)`
        : 'No cause data yet',
    },
  ];

  return (
    <section className="md-stats" aria-label="Donation summary">
      {cards.map((card) => (
        <article key={card.key} className="dd-card md-stat">
          <div className="md-stat__icon" style={{ background: card.bg, color: card.color }}>
            <Icon type={card.icon} />
          </div>
          <div className="min-w-0">
            <p className="md-stat__label">{card.label}</p>
            <p className="md-stat__value">{card.value}</p>
            {card.sub ? (
              <p className="md-stat__meta" style={{ color: '#49638F' }}>{card.sub}</p>
            ) : (
              <Growth value={card.growth} />
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
