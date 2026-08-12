export default function GivingStreak({ streak, loading }) {
  if (loading) {
    return <div className="dd-card h-40 animate-pulse bg-slate-100" aria-hidden="true" />;
  }

  const weeks = Number(streak?.weeks || 0);
  const dots = streak?.active_weeks?.length ? streak.active_weeks : Array(12).fill(false);
  const empty = weeks <= 0;

  return (
    <article className="dd-card p-5 sm:p-6 h-full flex flex-col">
      <h2 className="dd-section-title">Giving Streak</h2>
      {empty ? (
        <div className="mt-3 space-y-1.5">
          <p className="m-0 text-xl font-extrabold text-[#0B245B] tracking-tight">Start your giving journey</p>
          <p className="m-0 text-sm text-[#49638F] leading-relaxed">
            Make a donation this week to begin your streak.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          <p className="m-0 text-xl font-extrabold text-[#0B245B] tracking-tight">
            <span aria-hidden="true">🔥</span> {weeks} Week{weeks === 1 ? '' : 's'}
          </p>
          <p className="m-0 text-sm text-[#49638F] leading-relaxed">{streak?.message}</p>
        </div>
      )}

      <div className="dd-streak-dots mt-auto" aria-label="Weekly giving activity">
        {dots.map((on, i) => (
          <span
            key={`week-${i}`}
            className={on ? 'is-on' : undefined}
            title={on ? 'Donated this week' : 'No donation'}
          />
        ))}
      </div>
    </article>
  );
}
