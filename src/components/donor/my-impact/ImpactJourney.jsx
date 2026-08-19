export default function ImpactJourney({ journey, loading }) {
  if (loading) {
    return (
      <section className="dd-card ir-panel">
        <h2 className="mp-side-title">Your Impact Journey</h2>
        <div className="ir-journey ir-journey--skel" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => <div key={i} className="mp-skel ir-journey-skel" />)}
        </div>
      </section>
    );
  }

  const items = Array.isArray(journey) ? journey : [];
  if (!items.length) return null;

  return (
    <section className="dd-card ir-panel">
      <h2 className="mp-side-title">Your Impact Journey</h2>
      <ol className="ir-journey">
        {items.map((step, index) => (
          <li
            key={step.id}
            className={`ir-journey__step${step.achieved ? ' is-done' : ' is-next'}`}
          >
            <span className="ir-journey__dot" aria-hidden="true">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.date_label || '—'}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
