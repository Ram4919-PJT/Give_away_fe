import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/donorHelpers';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return (
    <div className="dd-tooltip">
      <p>{row.name}</p>
      <strong>{Number(row.lives || 0).toLocaleString('en-IN')} lives</strong>
      <span>{formatCurrency(row.amount)} · {row.percent}%</span>
    </div>
  );
}

export default function ImpactByCauseChart({ breakdown, totalLives, loading }) {
  if (loading) {
    return <div className="dd-card ir-chart-card mp-skel" aria-hidden="true" />;
  }

  const data = Array.isArray(breakdown) ? breakdown : [];
  const lives = Number(totalLives || 0);

  return (
    <article className="dd-card ir-chart-card">
      <h2 className="mp-side-title">Impact by Cause</h2>
      {!data.length ? (
        <p className="mp-side-empty">No cause breakdown available yet.</p>
      ) : (
        <div className="ir-donut-wrap">
          <div className="ir-donut" role="img" aria-label="Impact by cause">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="ir-donut__center">
              <strong>{lives.toLocaleString('en-IN')}{lives >= 1000 ? '+' : ''}</strong>
              <span>Total Lives Impacted</span>
            </div>
          </div>
          <ul className="ir-cause-legend">
            {data.map((item) => (
              <li key={item.name}>
                <span className="ir-cause-legend__swatch" style={{ background: item.color || '#94A3B8' }} />
                <span className="ir-cause-legend__name">{item.name}</span>
                <span className="ir-cause-legend__val">
                  {Number(item.lives || 0).toLocaleString('en-IN')}
                  <small>{item.percent}%</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
