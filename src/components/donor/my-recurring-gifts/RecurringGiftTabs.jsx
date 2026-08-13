const TABS = [
  { id: 'all', label: 'All Recurring Gifts' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'completed', label: 'Completed' },
];

export default function RecurringGiftTabs({ active, onChange }) {
  return (
    <div className="mp-tabs rg-tabs" role="tablist" aria-label="Recurring gift status">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`mp-tab${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
