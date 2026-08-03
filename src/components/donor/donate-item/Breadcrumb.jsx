import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ crumbs }) {
  if (!crumbs?.length) return null;

  return (
    <nav className="donate-breadcrumb" aria-label="Selection path">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const display = crumb.value ?? crumb.label;

        return (
          <span key={`${crumb.label}-${index}`} className="donate-breadcrumb__segment">
            {index > 0 && (
              <ChevronRight size={14} className="donate-breadcrumb__sep" aria-hidden="true" />
            )}
            <span className={`donate-breadcrumb__item ${isLast ? 'is-active' : ''}`}>
              {display}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
