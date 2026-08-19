import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { formatCurrency } from '../../../utils/donorHelpers';

const PERIODS = [
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dd-tooltip">
      <p>{label}</p>
      <strong>{formatCurrency(payload[0].value)}</strong>
    </div>
  );
}

export default function DonationOverview({
  series,
  causeBreakdown,
  periodTotal,
  growthPct,
  period,
  onPeriodChange,
  loading,
}) {
  if (loading) {
    return <div className="dd-card h-[420px] animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  const hasSeries = (series || []).some((s) => Number(s.amount) > 0);
  const hasCauses = (causeBreakdown || []).length > 0;
  const donutTotal = (causeBreakdown || []).reduce((s, c) => s + Number(c.amount || 0), 0);
  const growth = Number(growthPct || 0);

  return (
    <article className="dd-card dd-overview">
      <header className="dd-overview__head">
        <div>
          <h2 className="dd-section-title">Donation Overview</h2>
          <p className="dd-overview__sub">Track your giving trend and cause mix</p>
        </div>
        <label className="sr-only" htmlFor="donation-period">Period</label>
        <select
          id="donation-period"
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="dd-select"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </header>

      <div className="dd-overview__total">
        <span>Total Donated</span>
        <strong>{formatCurrency(periodTotal || 0)}</strong>
        <em style={{ color: growth >= 0 ? '#12B76A' : '#F04438' }}>
          {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}% vs previous period
        </em>
      </div>

      <div className="dd-overview__chart" role="img" aria-label="Donation history chart">
        {hasSeries ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="donorAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1268E8" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#1268E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#1268E8"
                strokeWidth={2.5}
                fill="url(#donorAreaFill)"
                dot={{ r: 3, fill: '#1268E8', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="dd-empty-panel">No donations in this period yet.</div>
        )}
      </div>

      <div className="dd-overview__breakdown">
        <div className="dd-overview__donut" role="img" aria-label="Donations by cause">
          {hasCauses ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={causeBreakdown}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={58}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {causeBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [formatCurrency(value), name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="dd-overview__donut-center">
                <strong>{formatCurrency(donutTotal)}</strong>
                <span>By Cause</span>
              </div>
            </>
          ) : (
            <div className="dd-empty-panel">No cause data</div>
          )}
        </div>

        <ul className="dd-overview__legend">
          {(causeBreakdown || []).slice(0, 5).map((c) => (
            <li key={c.name}>
              <span className="dd-overview__legend-name">
                <i style={{ background: c.color }} />
                {c.name}
              </span>
              <span className="dd-overview__legend-val">
                {formatCurrency(c.amount)}
                <small>{c.percent}%</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
