export default function ImpactHighlights({ highlights, loading }) {
  if (loading) {
    return (
      <section className="dd-card ir-panel">
        <h2 className="mp-side-title">Impact Highlights</h2>
        <div className="ir-highlights" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => <div key={i} className="mp-skel ir-highlight-skel" />)}
        </div>
      </section>
    );
  }

  const items = Array.isArray(highlights) ? highlights : [];

  return (
    <section className="dd-card ir-panel">
      <h2 className="mp-side-title">Impact Highlights</h2>
      {!items.length ? (
        <p className="mp-side-empty">No highlight metrics available yet.</p>
      ) : (
        <div className="ir-highlights">
          {items.map((item) => (
            <article key={item.id} className="ir-highlight" style={{ background: item.bg || '#F7FAFF' }}>
              <strong style={{ color: item.color || '#0B245B' }}>
                {Number(item.value || 0).toLocaleString('en-IN')}
                {Number(item.value || 0) >= 1000 ? '+' : ''}
              </strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
