import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/donorHelpers';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return (
    <div className="dd-tooltip">
      <p>{row.name}</p>
      <strong>{formatCurrency(row.amount)}</strong>
    </div>
  );
}

export function MonthlyImpactSummary({ impact, loading }) {
  const breakdown = Array.isArray(impact?.by_category) ? impact.by_category : [];
  const total = Number(impact?.monthly_total || 0);

  return (
    <section className="dd-card mp-side-card">
      <h2 className="mp-side-title">Monthly Impact Summary</h2>
      {loading ? (
        <div className="rg-donut-skel mp-skel" aria-hidden="true" />
      ) : !breakdown.length ? (
        <p className="mp-side-empty">No active monthly impact to chart yet.</p>
      ) : (
        <>
          <div className="rg-donut" role="img" aria-label="Monthly giving by cause">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={60}
                  paddingAngle={2}
                  stroke="none"
                >
                  {breakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="rg-donut__center">
              <strong>{formatCurrency(total)}</strong>
              <span>/ month</span>
            </div>
          </div>
          <ul className="rg-legend">
            {breakdown.map((item) => (
              <li key={item.name}>
                <span className="rg-legend__swatch" style={{ background: item.color || '#94A3B8' }} />
                <span className="rg-legend__name">{item.name}</span>
                <span className="rg-legend__amt">{formatCurrency(item.amount)}</span>
                <span className="rg-legend__pct">{item.percent}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function UpcomingPayments({ items, loading }) {
  return (
    <section className="dd-card mp-side-card">
      <div className="mp-side-head">
        <h2 className="mp-side-title">Upcoming Payments</h2>
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
                <p>{row.ngo_name}</p>
              </div>
              <span className="mp-up-amt">{formatCurrency(row.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function WhyRecurringMatters() {
  const items = [
    { id: 'steady', title: 'Steady Impact', description: 'Regular giving helps programs plan with confidence.' },
    { id: 'plan', title: 'Plan Better', description: 'Automated gifts keep your support consistent.' },
    { id: 'lives', title: 'More Lives', description: 'Small recurring amounts create lasting change.' },
  ];

  return (
    <section className="dd-card mp-side-card">
      <h2 className="mp-side-title">Why Recurring Gifts Matter</h2>
      <ul className="mp-benefits">
        {items.map((item) => (
          <li key={item.id} className="mp-benefit">
            <span className="mp-benefit__icon" aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
