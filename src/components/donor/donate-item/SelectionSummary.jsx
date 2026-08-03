import { CheckCircle2 } from 'lucide-react';

export default function SelectionSummary({ category, selections, visibleSteps, complete }) {
  if (!category) return null;

  const filledSteps = visibleSteps.filter((step) => selections[step.key]);

  return (
    <aside className="donate-selection-summary">
      <div className="donate-selection-summary__head">
        <CheckCircle2 size={18} className={complete ? 'is-complete' : ''} />
        <strong>Selection Summary</strong>
      </div>
      <ul className="donate-selection-summary__list">
        <li>
          <span>Category</span>
          <strong>{category.icon} {category.label}</strong>
        </li>
        {filledSteps.map((step) => (
          <li key={step.key}>
            <span>{step.label}</span>
            <strong>{selections[step.key]}</strong>
          </li>
        ))}
        {selections.condition && (
          <li>
            <span>Condition</span>
            <strong>{selections.condition}</strong>
          </li>
        )}
      </ul>
      {!complete && (
        <p className="donate-selection-summary__note">Complete all steps to continue.</p>
      )}
    </aside>
  );
}
