import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/donorHelpers';

export default function TopCauses({ causes, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="dd-card h-44 animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  const list = causes || [];

  return (
    <section className="dd-card dd-causes">
      <header className="dd-causes__head">
        <div>
          <h2 className="dd-section-title">Your Top Causes</h2>
          <p className="dd-causes__sub">Where your contributions are going</p>
        </div>
      </header>

      {list.length === 0 ? (
        <p className="dd-causes__empty">Donate to a cause to see your top categories here.</p>
      ) : (
        <div className="dd-causes-grid">
          {list.map((cause) => (
            <button
              key={cause.name}
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              className="dd-cause"
            >
              <div className="dd-cause__top">
                <img
                  src={cause.image_url}
                  alt=""
                  className="dd-thumb dd-thumb--cause"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <p className="dd-cause__name">{cause.name}</p>
                  <p className="dd-cause__pct">{cause.percent}% of giving</p>
                </div>
              </div>
              <p className="dd-cause__amount">{formatCurrency(cause.amount)}</p>
              <div className="dd-cause__bar">
                <span
                  style={{
                    width: `${Math.min(cause.percent, 100)}%`,
                    background: cause.color || '#1268E8',
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
