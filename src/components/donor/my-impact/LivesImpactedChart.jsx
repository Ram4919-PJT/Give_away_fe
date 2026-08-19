import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PERIODS = [
  { id: 'year', label: 'This Year' },
  { id: 'last_year', label: 'Last Year' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return (
    <div className="dd-tooltip">
      <p>{label}</p>
      <strong>{Number(row.cumulative_lives || row.lives || 0).toLocaleString('en-IN')} lives</strong>
      {row.amount ? <span>₹{Number(row.amount).toLocaleString('en-IN')}</span> : null}
    </div>
  );
}

export default function LivesImpactedChart({
  series,
  summary,
  period,
  onPeriodChange,
  loading,
}) {
  if (loading) {
    return <div className="dd-card ir-chart-card mp-skel" aria-hidden="true" />;
  }

  const data = Array.isArray(series) ? series : [];
  const hasData = data.some((row) => Number(row.lives || 0) > 0 || Number(row.cumulative_lives || 0) > 0);
  const lives = Number(summary?.lives_impacted || 0);
  const growth = summary?.lives_growth_pct;

  return (
    <article className="dd-card ir-chart-card">
      <header className="ir-chart-head">
        <div>
          <h2 className="mp-side-title">Lives Impacted Over Time</h2>
          <p className="ir-chart-metric">
            Total Lives Impacted:{' '}
            <strong>
              {lives.toLocaleString('en-IN')}
              {lives >= 1000 ? '+' : ''}
            </strong>
            {growth != null && (
              <em style={{ color: growth >= 0 ? '#12B76A' : '#F04438' }}>
                {' '}{growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}% vs last period
              </em>
            )}
          </p>
        </div>
        <label className="mp-filter">
          <span className="sr-only">Period</span>
          <select
            value={period || 'year'}
            onChange={(e) => onPeriodChange(e.target.value)}
            aria-label="Filter impact period"
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
      </header>

      <div className="ir-chart-plot" role="img" aria-label="Lives impacted over time">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="impactAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1268E8" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#1268E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative_lives"
                stroke="#1268E8"
                strokeWidth={2.5}
                fill="url(#impactAreaFill)"
                dot={{ r: 3, fill: '#1268E8', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="dd-empty-panel">No impact trend for this period yet.</div>
        )}
      </div>

      {hasData && (
        <ul className="ir-series-legend">
          {data.filter((row) => Number(row.lives) > 0).slice(-6).map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <strong>{Number(row.lives).toLocaleString('en-IN')}</strong>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
