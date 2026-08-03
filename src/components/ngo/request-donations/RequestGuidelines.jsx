import { Check } from 'lucide-react';
import { GUIDELINE_ITEMS, FREQUENT_CATEGORIES } from '../../../data/ngoDonationCategories';

export default function RequestGuidelines() {
  return (
    <aside className="rd-sidebar">
      <div className="rd-guidelines">
        <h3>Request Guidelines</h3>
        <ul className="rd-guidelines__list">
          {GUIDELINE_ITEMS.map((item) => (
            <li key={item}>
              <span className="rd-guidelines__check" aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="rd-guidelines__chips-label">Frequently Requested Categories</p>
        <div className="rd-guidelines__chips">
          {FREQUENT_CATEGORIES.map((cat) => (
            <span key={cat} className="rd-guidelines__chip">{cat}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
