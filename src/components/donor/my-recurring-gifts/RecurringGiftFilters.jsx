const PERIODS = [
  { id: 'all', label: 'All Time' },
  { id: 'year', label: 'This Year' },
  { id: 'last_year', label: 'Last Year' },
  { id: 'month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
];

const DEFAULT_SORTS = [
  { id: 'next_payment', label: 'Next Payment' },
  { id: 'amount', label: 'Amount' },
  { id: 'start_date', label: 'Start Date' },
  { id: 'status', label: 'Status' },
];

export default function RecurringGiftFilters({
  categories = [],
  category,
  period,
  sort,
  sortOptions,
  onCategoryChange,
  onPeriodChange,
  onSortChange,
}) {
  const sorts = Array.isArray(sortOptions) && sortOptions.length ? sortOptions : DEFAULT_SORTS;

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
        <span className="sr-only">Sort</span>
        <select
          value={sort || 'next_payment'}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort recurring gifts"
        >
          {sorts.map((s) => (
            <option key={s.id} value={s.id}>Sort by: {s.label}</option>
          ))}
        </select>
      </label>
      <label className="mp-filter">
        <span className="sr-only">Period</span>
        <select
          value={period || 'all'}
          onChange={(e) => onPeriodChange(e.target.value)}
          aria-label="Filter by start date"
        >
          {PERIODS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
