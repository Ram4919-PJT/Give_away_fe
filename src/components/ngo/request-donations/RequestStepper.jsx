import { REQUEST_WIZARD_STEPS } from '../../../data/ngoDonationCategories';

export default function RequestStepper({ step }) {
  return (
    <nav className="rd-stepper" aria-label="Request progress">
      <ol className="rd-stepper__track">
        {REQUEST_WIZARD_STEPS.map((s, index) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <li
              key={s.id}
              className={`rd-stepper__item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
            >
              {index > 0 && <span className="rd-stepper__line" aria-hidden="true" />}
              <span className="rd-stepper__dot" aria-current={isActive ? 'step' : undefined}>
                {isDone ? '✓' : s.id}
              </span>
              <span className="rd-stepper__label">{s.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
