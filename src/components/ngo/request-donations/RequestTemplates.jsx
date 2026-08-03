import { REQUEST_TEMPLATES } from '../../../data/ngoDonationCategories';

export default function RequestTemplates({ activeId, onSelect }) {
  return (
    <section className="rd-templates" aria-labelledby="rd-templates-heading">
      <div className="rd-templates__head">
        <h3 id="rd-templates-heading">Quick Request Templates</h3>
        <p>Start faster with a pre-filled category and suggested items.</p>
      </div>

      <div className="rd-templates__grid">
        {REQUEST_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className={`rd-template-card${activeId === tpl.id ? ' is-selected' : ''}`}
            onClick={() => onSelect(tpl)}
          >
            <span className="rd-template-card__emoji" aria-hidden="true">{tpl.emoji}</span>
            <span className="rd-template-card__title">{tpl.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
