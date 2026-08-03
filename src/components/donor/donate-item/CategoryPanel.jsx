import Breadcrumb from './Breadcrumb';
import SubCategorySelector from './SubCategorySelector';
import ConditionSelector from './ConditionSelector';
import SelectionSummary from './SelectionSummary';
import {
  getVisibleSteps,
  isCategorySelectionComplete,
  buildSelectionBreadcrumb
} from '../../../data/donateItemCategories';

export default function CategoryPanel({
  category,
  selections,
  onSelectionChange,
  onConditionChange
}) {
  if (!category) {
    return (
      <div className="donate-item-panel donate-item-panel--empty">
        <div className="donate-item-panel__placeholder">
          <span className="donate-item-panel__placeholder-icon" aria-hidden="true">📦</span>
          <h2>Select a category</h2>
          <p>Choose a donation category on the left to configure item details here.</p>
        </div>
      </div>
    );
  }

  const visibleSteps = getVisibleSteps(category, selections);
  const crumbs = buildSelectionBreadcrumb(category.id, selections);
  const complete = isCategorySelectionComplete(category.id, selections);
  const showCondition = category.steps.length === 0
    || visibleSteps.every((step) => selections[step.key]);

  return (
    <div className="donate-item-panel" key={category.id}>
      <div className="donate-item-panel__inner donate-item-panel__inner--animate">
        <header className="donate-item-panel__header">
          <div className="donate-item-panel__title-row">
            <span className="donate-item-panel__emoji" aria-hidden="true">{category.icon}</span>
            <h2>{category.label}</h2>
          </div>
          <Breadcrumb crumbs={crumbs} />
        </header>

        <div className="donate-item-panel__body">
          <div className="donate-item-panel__steps">
            {category.steps.length === 0 && (
              <div className="donate-item-panel__hint-card">
                <p>{category.emptyHint || 'Describe your items in the next step.'}</p>
              </div>
            )}

            {visibleSteps.map((step, index) => (
              <SubCategorySelector
                key={step.key}
                step={step}
                stepNumber={index + 1}
                value={selections[step.key] || ''}
                onChange={(val) => onSelectionChange(step.key, val)}
              />
            ))}

            {showCondition && (
              <ConditionSelector
                value={selections.condition || ''}
                onChange={onConditionChange}
                disabled={false}
              />
            )}
          </div>

          <SelectionSummary
            category={category}
            selections={selections}
            visibleSteps={visibleSteps}
            complete={complete}
          />
        </div>
      </div>
    </div>
  );
}
