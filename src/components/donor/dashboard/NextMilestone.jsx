import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/donorHelpers';

export default function NextMilestone({ milestone, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="dd-card h-52 animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  const m = milestone || {};
  const pct = Math.min(Math.max(Number(m.progress_pct || 0), 0), 100);

  return (
    <article className="dd-milestone">
      <div className="dd-milestone__top">
        <div>
          <h2>Next Milestone</h2>
          <p>{m.message}</p>
        </div>
        <div className="dd-milestone__art">
          <img
            src="/assets/donor/Give_More_Impact_More.png"
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-2 opacity-95">
          <span>{formatCurrency(m.current || 0)}</span>
          <span>{formatCurrency(m.target || 0)}</span>
        </div>
        <div
          className="dd-progress"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Milestone progress"
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div>
          <p className="m-0 text-[10px] uppercase tracking-wide text-blue-100 font-semibold">Milestone Reward</p>
          <p className="m-0 mt-0.5 text-sm font-bold">{m.reward_label || 'Certificate of Impact'}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/donor-certificates')}
          className="dd-btn-soft h-9 px-3.5 text-xs"
        >
          View
        </button>
      </div>
    </article>
  );
}
