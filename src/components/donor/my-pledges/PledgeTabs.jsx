const TABS = [
  { id: 'all', label: 'All Pledges' },
  { id: 'active', label: 'Active Pledges' },
  { id: 'completed', label: 'Completed Pledges' },
  { id: 'cancelled', label: 'Cancelled Pledges' },
];

export default function PledgeTabs({ active, onChange }) {
  return (
    <div className="mp-tabs" role="tablist" aria-label="Pledge status">
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
