export default function SubCategorySelector({ step, value, onChange, stepNumber }) {
  return (
    <section className="donate-subsection donate-subsection--animate">
      <div className="donate-subsection__head">
        <span className="donate-subsection__step">Step {stepNumber}</span>
        <h3 className="donate-subsection__title">{step.label}</h3>
      </div>
      <div className="donate-chip-grid" role="listbox" aria-label={step.label}>
        {step.options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={selected}
              className={`donate-chip ${selected ? 'is-selected' : ''}`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
