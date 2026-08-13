const PERIODS = [
  { id: 'all', label: 'All Time' },
  { id: 'year', label: 'This Year' },
  { id: 'last_year', label: 'Last Year' },
  { id: 'month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
];

export default function PledgeFilters({
  categories = [],
  category,
  period,
  onCategoryChange,
  onPeriodChange,
}) {
  return (
    <div className="mp-filters">
      <label className="mp-filter">
        <span className="sr-only">Cause</span>
        <select
          value={category || 'all'}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by cause"
        >
          <option value="all">All Causes</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="mp-filter">
        <span className="sr-only">Period</span>
        <select
          value={period || 'all'}
          onChange={(e) => onPeriodChange(e.target.value)}
          aria-label="Filter by period"
        >
          {PERIODS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
