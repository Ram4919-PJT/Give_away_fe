import {
  Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis,
} from 'recharts';
import { formatCurrency } from '../../../utils/donorHelpers';

const PIE_COLORS = ['#1268E8', '#12B76A', '#9333EA', '#F59E0B', '#64748B'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rd-tooltip">
      <p>{label}</p>
      <strong>{formatCurrency(payload[0].value)}</strong>
    </div>
  );
}

export default function ReceiverAssistanceOverview({
  series,
  causeBreakdown,
  periodTotal,
  loading,
  error,
  onRetry,
}) {
  if (loading) {
    return <div className="rd-card rd-overview rd-skeleton rd-skeleton--chart" aria-hidden="true" />;
  }

  if (error) {
    return (
      <article className="rd-card rd-overview">
        <h2 className="rd-section-title">Assistance Overview</h2>
        <div className="rd-section-error">
          <p>Unable to load this information.</p>
          <button type="button" className="rd-btn rd-btn--secondary rd-btn--sm" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </article>
    );
  }

  const hasSeries = (series || []).some((s) => Number(s.amount) > 0);
  const hasCauses = (causeBreakdown || []).length > 0;
  const donutTotal = (causeBreakdown || []).reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <article className="rd-card rd-overview">
      <header className="rd-overview__head">
        <div>
          <h2 className="rd-section-title">Assistance Overview</h2>
          <p className="rd-muted">Financial assistance received and distribution by purpose</p>
        </div>
      </header>

      <div className="rd-overview__total">
        <span>Total Received</span>
        <strong>{formatCurrency(periodTotal || 0)}</strong>
      </div>

      <div className="rd-overview__grid">
        <div className="rd-overview__chart" role="img" aria-label="Assistance history chart">
          {hasSeries ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="receiverAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1268E8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1268E8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#1268E8" strokeWidth={2} fill="url(#receiverAreaFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="rd-empty-chart">
              <p>Assistance history will appear here once you receive approved support.</p>
            </div>
          )}
        </div>

        <div className="rd-overview__donut">
          <h3>By Purpose</h3>
          {hasCauses ? (
            <>
              <div className="rd-overview__donut-chart">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={causeBreakdown}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {causeBreakdown.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="rd-overview__legend">
                {causeBreakdown.map((item, index) => {
                  const pct = donutTotal > 0 ? Math.round((item.amount / donutTotal) * 100) : 0;
                  return (
                    <li key={item.name}>
                      <span className="rd-overview__swatch" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span>{item.name}</span>
                      <strong>{pct}%</strong>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="rd-empty-chart rd-empty-chart--compact">
              <p>Purpose breakdown appears after approved assistance is recorded.</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
