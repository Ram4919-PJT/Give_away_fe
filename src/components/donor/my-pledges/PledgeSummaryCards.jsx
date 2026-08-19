import { formatCurrency } from '../../../utils/donorHelpers';

function Icon({ type }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true };
  if (type === 'heart') {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.1 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
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
  if (type === 'check') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function PledgeSummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <section className="mp-stats" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dd-card mp-stat mp-skel" />
        ))}
      </section>
    );
  }

  const cards = [
    {
      key: 'total',
      label: 'Total Pledged',
      value: summary ? formatCurrency(summary.total_pledged ?? 0) : '—',
      meta: summary?.causes_count != null ? `Across ${summary.causes_count} causes` : '—',
      icon: 'heart',
      bg: '#EEF5FF',
      color: '#1268E8',
    },
    {
      key: 'active',
      label: 'Active Pledges',
      value: summary ? String(summary.active_count ?? 0) : '—',
      meta: summary ? `${formatCurrency(summary.active_remaining ?? 0)} remaining` : '—',
      icon: 'calendar',
      bg: '#E8F8F0',
      color: '#12B76A',
    },
    {
      key: 'done',
      label: 'Completed Pledges',
      value: summary ? String(summary.completed_count ?? 0) : '—',
      meta: summary ? `${formatCurrency(summary.completed_fulfilled ?? 0)} fulfilled` : '—',
      icon: 'check',
      bg: '#F3E8FF',
      color: '#9333EA',
    },
    {
      key: 'upcoming',
      label: 'Upcoming Payments',
      value: summary?.upcoming_amount ? formatCurrency(summary.upcoming_amount) : '—',
      meta: summary?.upcoming_date_label ? `Next on ${summary.upcoming_date_label}` : 'No upcoming payments',
      icon: 'clock',
      bg: '#FFF7ED',
      color: '#EA580C',
    },
  ];

  return (
    <section className="mp-stats" aria-label="Pledge summary">
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
