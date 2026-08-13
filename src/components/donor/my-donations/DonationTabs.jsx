const TABS = [
  { id: 'all', label: 'All Donations' },
  { id: 'one_time', label: 'One-time Donations' },
  { id: 'recurring', label: 'Recurring Donations' },
  { id: 'pledges', label: 'Pledges' },
];

export default function DonationTabs({ active, onChange }) {
  return (
    <div className="md-tabs" role="tablist" aria-label="Donation type">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`md-tab${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
