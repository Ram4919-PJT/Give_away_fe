import { formatCurrency } from '../../../utils/donorHelpers';

export function ImpactSummary({ impact, loading }) {
  const items = [
    { key: 'lives', label: 'Lives Impacted', value: impact?.lives_impacted, color: '#12B76A', bg: '#E8F8F0' },
    { key: 'children', label: 'Children Educated', value: impact?.children_educated, color: '#EA580C', bg: '#FFF7ED' },
    { key: 'patients', label: 'Patients Supported', value: impact?.patients_supported, color: '#9333EA', bg: '#F3E8FF' },
    { key: 'trees', label: 'Trees Planted', value: impact?.trees_planted, color: '#1268E8', bg: '#EEF5FF' },
  ];

  return (
    <section className="dd-card mp-side-card">
      <h2 className="mp-side-title">Impact You&apos;re Creating</h2>
      {loading ? (
        <div className="mp-impact-grid" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => <div key={i} className="mp-skel mp-impact-skel" />)}
        </div>
      ) : (
        <div className="mp-impact-grid">
          {items.map((item) => (
            <article key={item.key} className="mp-impact-item" style={{ background: item.bg }}>
              <strong style={{ color: item.color }}>
                {item.value == null ? '—' : Number(item.value).toLocaleString('en-IN')}
              </strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function UpcomingPayments({ items, loading, onViewAll }) {
  return (
    <section className="dd-card mp-side-card">
      <div className="mp-side-head">
        <h2 className="mp-side-title">Upcoming Payments</h2>
        {items?.length > 0 && (
          <button type="button" className="mp-text-link" onClick={onViewAll}>View All</button>
        )}
      </div>
      {loading ? (
        <div className="mp-up-list" aria-hidden="true">
          {[1, 2, 3].map((i) => <div key={i} className="mp-skel mp-up-skel" />)}
        </div>
      ) : !items?.length ? (
        <p className="mp-side-empty">No upcoming payments.</p>
      ) : (
        <ul className="mp-up-list">
          {items.map((row) => (
            <li key={row.id} className="mp-up-item">
              <div className="mp-up-date" aria-hidden="true">
                <strong>{row.day_label}</strong>
                <span>{row.month_label}</span>
              </div>
              <div className="min-w-0 flex-1">
                <strong className="mp-up-title">{row.title}</strong>
                <p>{row.type_label} · {row.payment_method || '—'}</p>
              </div>
              <span className="mp-up-amt">{formatCurrency(row.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PledgeBenefits({ benefits }) {
  const list = Array.isArray(benefits) && benefits.length
    ? benefits
    : [
        { id: 'tax', title: 'Tax Benefits', description: '80G certified donations' },
        { id: 'updates', title: 'Priority Updates', description: 'Get regular impact updates' },
        { id: 'badge', title: 'Exclusive Badge', description: 'Earn badges for your pledges' },
      ];

  return (
    <section className="dd-card mp-side-card">
      <h2 className="mp-side-title">Pledge Benefits</h2>
      <ul className="mp-benefits">
        {list.map((b) => (
          <li key={b.id} className="mp-benefit">
            <span className="mp-benefit__icon" aria-hidden="true" />
            <div>
              <strong>{b.title}</strong>
              <p>{b.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
