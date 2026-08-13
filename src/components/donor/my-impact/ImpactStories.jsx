export default function ImpactStories({ stories, loading }) {
  if (loading) {
    return (
      <section className="dd-card ir-panel">
        <h2 className="mp-side-title">Impact Stories</h2>
        <div className="ir-stories" aria-hidden="true">
          {[1, 2, 3].map((i) => <div key={i} className="mp-skel ir-story-skel" />)}
        </div>
      </section>
    );
  }

  const items = Array.isArray(stories) ? stories : [];

  return (
    <section className="dd-card ir-panel">
      <div className="mp-side-head">
        <h2 className="mp-side-title">Impact Stories</h2>
      </div>
      {!items.length ? (
        <p className="mp-side-empty">No impact stories available yet.</p>
      ) : (
        <div className="ir-stories">
          {items.map((story) => (
            <article key={story.id} className="ir-story">
              <img src={story.image_url || '/assets/donor/Education_for_All.png'} alt="" className="ir-story__img" />
              <div className="min-w-0">
                {story.category && <span className="mp-cat-badge">{story.category}</span>}
                <h3>{story.title}</h3>
                <p>{story.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
