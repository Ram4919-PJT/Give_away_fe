import { formatCurrency } from '../../../utils/donorHelpers';

function Icon({ type }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true };
  if (type === 'refresh') {
    return (
      <svg {...common}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    );
  }
  if (type === 'wallet') {
    return (
      <svg {...common}>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20M16 14h.01" />
      </svg>
    );
  }
  if (type === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="currentColor" stroke="none">
      <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
    </svg>
  );
}

export default function RecurringGiftSummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <section className="mp-stats" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dd-card mp-stat mp-skel" />
        ))}
      </section>
    );
  }

  const lives = summary?.lives_impacted;
  const causes = summary?.causes_supported;
  const nextAmount = summary?.next_payment_amount;
  const nextLabel = summary?.next_payment_label;

  const cards = [
    {
      key: 'active',
      label: 'Active Gifts',
      value: summary ? String(summary.active_count ?? 0) : '—',
      meta: summary ? `${formatCurrency(summary.monthly_commitment ?? 0)} / month` : '—',
      icon: 'refresh',
      bg: '#E8F8F0',
      color: '#12B76A',
    },
    {
      key: 'contributed',
      label: 'Total Contributed',
      value: summary ? formatCurrency(summary.total_contributed ?? 0) : '—',
      meta: summary?.donations_count != null ? `${summary.donations_count} Donations` : '—',
      icon: 'wallet',
      bg: '#F3E8FF',
      color: '#9333EA',
    },
    {
      key: 'next',
      label: 'Next Payment',
      value: nextLabel || '—',
      meta: nextAmount ? formatCurrency(nextAmount) : 'No upcoming payment',
      icon: 'calendar',
      bg: '#FFF7ED',
      color: '#EA580C',
    },
    {
      key: 'impact',
      label: 'Lives You Impact',
      value: lives == null ? '—' : lives > 0 ? `${Number(lives).toLocaleString('en-IN')}+` : '0',
      meta: causes == null ? 'Data unavailable' : `${causes} causes supported`,
      icon: 'heart',
      bg: '#EEF5FF',
      color: '#1268E8',
    },
  ];

  return (
    <section className="mp-stats" aria-label="Recurring gifts summary">
      {cards.map((card) => (
        <article key={card.key} className="dd-card mp-stat">
          <div className="mp-stat__icon" style={{ background: card.bg, color: card.color }}>
            <Icon type={card.icon} />
          </div>
          <div className="min-w-0">
            <p className="mp-stat__label">{card.label}</p>
            <p className="mp-stat__value">{card.value}</p>
            <p className="mp-stat__meta">{card.meta}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
