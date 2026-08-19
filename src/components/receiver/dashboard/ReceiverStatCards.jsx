import {
  IndianRupee, ClipboardList, Clock, CheckCircle2, FileText,
} from 'lucide-react';

const STAT_ICONS = {
  received: { Icon: IndianRupee, bg: '#EEF5FF', color: '#1268E8' },
  pending: { Icon: Clock, bg: '#FEF3C7', color: '#D97706' },
  approved: { Icon: CheckCircle2, bg: '#E8F8F0', color: '#12B76A' },
  active: { Icon: ClipboardList, bg: '#F3E8FF', color: '#9333EA' },
  applications: { Icon: FileText, bg: '#EEF2FF', color: '#4F46E5' },
};

export default function ReceiverStatCards({ stats, loading }) {
  if (loading) {
    return (
      <section className="rd-stats" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rd-card rd-stat rd-skeleton rd-skeleton--stat" />
        ))}
      </section>
    );
  }

  if (!stats?.length) {
    return (
      <section className="rd-card rd-empty-inline">
        <p>Your financial assistance statistics will appear once you submit a request.</p>
      </section>
    );
  }

  return (
    <section className="rd-stats" aria-label="Summary statistics">
      {stats.map((stat) => {
        const meta = STAT_ICONS[stat.key] || STAT_ICONS.applications;
        const { Icon } = meta;
        return (
          <article key={stat.key} className="rd-card rd-stat">
            <div className="rd-stat__icon" style={{ background: meta.bg, color: meta.color }}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="rd-stat__body">
              <p className="rd-stat__label">{stat.label}</p>
              <p className="rd-stat__value">{stat.value}</p>
              {stat.hint && <p className="rd-stat__hint">{stat.hint}</p>}
            </div>
          </article>
        );
      })}
    </section>
  );
}
