import { useState, useMemo, useEffect } from 'react';
import {
  Wallet, Send, Clock, TrendingUp,
  Download, FileText, BarChart3, Search, Eye, IndianRupee,
  ArrowUpRight, WalletCards, List, PieChart as PieChartIcon
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { formatFunds } from '../../../utils/adminHelpers';
import {
  ADMIN_FUND_SUMMARY, ADMIN_FUND_KPI_TRENDS, ADMIN_FUND_MONTHLY_TREND,
  ADMIN_FUND_TRANSACTIONS, ADMIN_FUND_ALLOCATIONS, ADMIN_FUND_PENDING_RELEASES,
  ADMIN_FUND_INSIGHTS, ADMIN_FUND_QUICK_ACTIONS
} from '../../../data/adminMockData';
import { AdminBadge } from '../AdminModuleShell';

const KPI_CARDS = [
  { key: 'totalReceived', icon: '💰', label: 'Total Funds Received', accent: 'blue', trendKey: 'totalReceived' },
  { key: 'availableBalance', icon: '🏦', label: 'Available Balance', accent: 'green', trendKey: 'availableBalance' },
  { key: 'allocated', icon: '📤', label: 'Funds Allocated', accent: 'purple', trendKey: 'allocated' },
  { key: 'distributed', icon: '✅', label: 'Funds Distributed', accent: 'green', trendKey: 'distributed' },
  { key: 'pendingAllocation', icon: '⏳', label: 'Pending Disbursements', accent: 'orange', trendKey: 'pendingAllocation' },
  { key: 'monthlyDonations', icon: '📈', label: 'This Month Donations', accent: 'blue', trendKey: 'monthlyDonations' }
];

const TXN_STATUS = { Distributed: 'green', Allocated: 'blue', Pending: 'orange' };
const RELEASE_STATUS = { 'Pending Approval': 'orange', 'Under Review': 'blue', Approved: 'green' };

const QUICK_ICONS = {
  wallet: Wallet, file: FileText, list: List, download: Download, chart: BarChart3
};

function FundSkeleton() {
  return (
    <div className="fund-dash fund-dash--loading" aria-hidden="true">
      <div className="fund-dash-skeleton fund-dash-skeleton--hero" />
      <div className="fund-dash-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="fund-dash-skeleton fund-dash-skeleton--kpi" />
        ))}
      </div>
      <div className="fund-dash-skeleton-row">
        <div className="fund-dash-skeleton fund-dash-skeleton--chart" />
        <div className="fund-dash-skeleton fund-dash-skeleton--chart" />
      </div>
    </div>
  );
}

function FundLineChart({ data }) {
  const w = 560;
  const h = 220;
  const pad = { t: 20, r: 16, b: 32, l: 48 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const maxVal = Math.max(...data.flatMap((d) => [d.donations, d.distributed]), 1);

  const toPoint = (val, i, total) => {
    const x = pad.l + (i / (total - 1)) * innerW;
    const y = pad.t + innerH - (val / maxVal) * innerH;
    return { x, y };
  };

  const donationPts = data.map((d, i) => toPoint(d.donations, i, data.length));
  const distribPts = data.map((d, i) => toPoint(d.distributed, i, data.length));
  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="fund-dash-line-chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="fund-dash-line-chart__svg" role="img" aria-label="Monthly donation trend chart">
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = pad.t + innerH * (1 - pct);
          return (
            <g key={pct}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} className="fund-dash-line-chart__grid" />
              <text x={pad.l - 8} y={y + 4} className="fund-dash-line-chart__ylabel" textAnchor="end">
                {Math.round(maxVal * pct / 100000)}L
              </text>
            </g>
          );
        })}
        <path d={toPath(donationPts)} className="fund-dash-line-chart__line fund-dash-line-chart__line--donations" fill="none" />
        <path d={toPath(distribPts)} className="fund-dash-line-chart__line fund-dash-line-chart__line--distributed" fill="none" />
        {donationPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" className="fund-dash-line-chart__dot fund-dash-line-chart__dot--donations" />
        ))}
        {data.map((d, i) => {
          const x = pad.l + (i / (data.length - 1)) * innerW;
          if (i % 2 !== 0 && i !== data.length - 1) return null;
          return (
            <text key={d.month} x={x} y={h - 8} className="fund-dash-line-chart__xlabel" textAnchor="middle">{d.month}</text>
          );
        })}
      </svg>
      <div className="fund-dash-line-chart__legend">
        <span><i className="fund-dash-line-chart__swatch fund-dash-line-chart__swatch--donations" /> Donations</span>
        <span><i className="fund-dash-line-chart__swatch fund-dash-line-chart__swatch--distributed" /> Distributed</span>
      </div>
    </div>
  );
}

function FundDoughnutChart({ segments }) {
  let cumulative = 0;
  const gradientStops = segments.map((s) => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="fund-dash-doughnut">
      <div className="fund-dash-doughnut__visual">
        <div
          className="fund-dash-doughnut__ring"
          style={{ background: `conic-gradient(${gradientStops})` }}
          aria-hidden="true"
        />
        <div className="fund-dash-doughnut__center">
          <strong>{formatFunds(ADMIN_FUND_SUMMARY.allocated)}</strong>
          <span>Total Allocated</span>
        </div>
      </div>
      <ul className="fund-dash-doughnut__legend">
        {segments.map((s) => (
          <li key={s.id}>
            <span className="fund-dash-doughnut__dot" style={{ background: s.color }} />
            {s.label} <em>{s.pct}%</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminFundManagement() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ngoFilter, setNgoFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const s = ADMIN_FUND_SUMMARY;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 480);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(ADMIN_FUND_TRANSACTIONS.map((t) => t.category))], []);
  const ngos = useMemo(() => ['All', ...new Set(ADMIN_FUND_TRANSACTIONS.map((t) => t.ngo))], []);

  const filteredTxns = useMemo(() => {
    const q = search.toLowerCase();
    return ADMIN_FUND_TRANSACTIONS.filter((tx) => {
      const matchQ = !q || tx.donor.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q) || tx.purpose.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || tx.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || tx.status === statusFilter;
      const matchNgo = ngoFilter === 'All' || tx.ngo === ngoFilter;
      const matchDate = dateFilter === 'All' || tx.date.startsWith('2026-07');
      return matchQ && matchCat && matchStatus && matchNgo && matchDate;
    }).slice(0, 8);
  }, [search, categoryFilter, statusFilter, ngoFilter, dateFilter]);

  if (loading) {
    return (
      <div className="fund-dash page-route">
        <FundSkeleton />
      </div>
    );
  }

  return (
    <div className="fund-dash page-route">
      <header className="fund-dash-header">
        <div className="fund-dash-header__text">
          <h1>Fund Management</h1>
          <p>Monitor donations, fund allocations, distributions, and financial performance across the platform.</p>
        </div>
        <div className="fund-dash-header__actions">
          <button type="button" className="fund-dash-btn fund-dash-btn--outline" onClick={() => showToast('Exporting fund report (mock).', 'info')}>
            <Download size={16} /> Export Report
          </button>
          <button type="button" className="fund-dash-btn fund-dash-btn--outline" onClick={() => showToast('Downloading statement (mock).', 'info')}>
            <FileText size={16} /> Download Statement
          </button>
          <button type="button" className="fund-dash-btn fund-dash-btn--primary" onClick={() => showToast('Generating monthly report (mock).', 'success')}>
            <BarChart3 size={16} /> Generate Monthly Report
          </button>
        </div>
      </header>

      <section className="fund-dash-hero">
        <div className="fund-dash-hero__content">
          <span className="fund-dash-hero__eyebrow"><IndianRupee size={14} /> Platform Financial Overview</span>
          <h2>{formatFunds(s.totalReceived)}</h2>
          <p>Total funds received across all donation channels since platform launch.</p>
          <div className="fund-dash-hero__stats">
            <div><strong>{formatFunds(s.availableBalance)}</strong><span>Available</span></div>
            <div><strong>{formatFunds(s.distributed)}</strong><span>Distributed</span></div>
            <div><strong>{formatFunds(s.pendingAllocation)}</strong><span>Pending</span></div>
          </div>
        </div>
        <div className="fund-dash-hero__visual" aria-hidden="true">
          <TrendingUp size={48} strokeWidth={1.25} />
        </div>
      </section>

      <div className="fund-dash-kpi-grid">
        {KPI_CARDS.map((card, i) => (
          <article key={card.key} className={`fund-dash-kpi fund-dash-kpi--${card.accent} fund-dash-animate fund-dash-animate--d${i + 1}`}>
            <span className="fund-dash-kpi__icon" aria-hidden="true">{card.icon}</span>
            <strong className="fund-dash-kpi__val">{formatFunds(s[card.key])}</strong>
            <span className="fund-dash-kpi__lbl">{card.label}</span>
            <span className="fund-dash-kpi__trend"><ArrowUpRight size={12} /> {ADMIN_FUND_KPI_TRENDS[card.trendKey]}</span>
          </article>
        ))}
      </div>

      <div className="fund-dash-charts-row">
        <section className="fund-dash-card fund-dash-card--chart">
          <h2 className="fund-dash-card__title"><TrendingUp size={18} /> Monthly Donation Trend</h2>
          <FundLineChart data={ADMIN_FUND_MONTHLY_TREND} />
        </section>
        <section className="fund-dash-card fund-dash-card--chart">
          <h2 className="fund-dash-card__title"><PieChartIcon size={18} /> Fund Allocation by Category</h2>
          <FundDoughnutChart segments={ADMIN_FUND_ALLOCATIONS} />
        </section>
      </div>

      <div className="fund-dash-split-row">
        <section className="fund-dash-card fund-dash-card--table">
          <div className="fund-dash-card__head">
            <h2 className="fund-dash-card__title"><List size={18} /> Recent Transactions</h2>
            <span className="fund-dash-card__meta">Latest 8 transactions</span>
          </div>

          <div className="fund-dash-filters">
            <div className="fund-dash-filters__search">
              <Search size={16} aria-hidden="true" />
              <input type="search" placeholder="Search transactions…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search transactions" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Category filter">
              {categories.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} aria-label="Date filter">
              <option value="All">All Dates</option>
              <option value="Jul">July 2026</option>
            </select>
            <select value={ngoFilter} onChange={(e) => setNgoFilter(e.target.value)} aria-label="NGO filter">
              {ngos.map((n) => <option key={n} value={n}>{n === 'All' ? 'All NGOs' : n}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status filter">
              <option value="All">All Statuses</option>
              <option value="Distributed">Distributed</option>
              <option value="Allocated">Allocated</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {filteredTxns.length ? (
            <div className="fund-dash-txn-table-wrap">
              <table className="fund-dash-txn-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Donor</th>
                    <th>Purpose</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Assigned NGO</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map((tx) => (
                    <tr key={tx.id}>
                      <td className="fund-dash-txn-table__id">{tx.id}</td>
                      <td>{tx.donor}</td>
                      <td>{tx.purpose}</td>
                      <td className="fund-dash-txn-table__amount">{formatFunds(tx.amount)}</td>
                      <td className="fund-dash-txn-table__date">{tx.date}</td>
                      <td><AdminBadge variant={TXN_STATUS[tx.status] || 'muted'}>{tx.status}</AdminBadge></td>
                      <td>{tx.category}</td>
                      <td>{tx.ngo}</td>
                      <td>
                        <div className="fund-dash-txn-table__actions">
                          <button type="button" className="fund-dash-btn fund-dash-btn--ghost" onClick={() => showToast(`View ${tx.id} (mock).`, 'info')}>
                            <Eye size={14} /> View
                          </button>
                          <button type="button" className="fund-dash-btn fund-dash-btn--ghost" onClick={() => showToast(`Receipt for ${tx.id} (mock).`, 'info')}>
                            <Download size={14} /> Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="fund-dash-empty">
              <Wallet size={48} strokeWidth={1.25} />
              <h3>No transactions found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        <section className="fund-dash-card fund-dash-card--releases">
          <h2 className="fund-dash-card__title"><Clock size={18} /> Pending Fund Releases</h2>
          <ul className="fund-dash-releases">
            {ADMIN_FUND_PENDING_RELEASES.map((rel) => (
              <li key={rel.id} className="fund-dash-release">
                <div className="fund-dash-release__head">
                  <strong>{rel.receiver}</strong>
                  <AdminBadge variant={RELEASE_STATUS[rel.status] || 'muted'}>{rel.status}</AdminBadge>
                </div>
                <dl className="fund-dash-release__meta">
                  <div><dt>NGO</dt><dd>{rel.ngo}</dd></div>
                  <div><dt>Purpose</dt><dd>{rel.purpose}</dd></div>
                  <div><dt>Amount</dt><dd>{formatFunds(rel.amount)}</dd></div>
                  <div><dt>Expected Release</dt><dd>{rel.expectedDate}</dd></div>
                </dl>
                <button type="button" className="fund-dash-btn fund-dash-btn--green fund-dash-btn--block" onClick={() => showToast(`Release funds for ${rel.receiver} (mock).`, 'success')}>
                  <Send size={14} /> Release Funds
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="fund-dash-card">
        <h2 className="fund-dash-card__title"><WalletCards size={18} /> Category-wise Allocation</h2>
        <div className="fund-dash-category-grid">
          {ADMIN_FUND_ALLOCATIONS.map((cat) => (
            <article key={cat.id} className="fund-dash-category-card">
              <div className="fund-dash-category-card__head">
                <span className="fund-dash-category-card__icon" aria-hidden="true">{cat.icon}</span>
                <div>
                  <h3>{cat.label}</h3>
                  <strong>{formatFunds(cat.allocated)}</strong>
                </div>
                <span className="fund-dash-category-card__pct">{cat.pct}%</span>
              </div>
              <div className="fund-dash-category-card__bar">
                <div className="fund-dash-category-card__fill" style={{ width: `${cat.pct}%`, background: cat.color }} />
              </div>
              <p className="fund-dash-category-card__remaining">Remaining budget: {formatFunds(cat.remaining)}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="fund-dash-bottom-row">
        <section className="fund-dash-card fund-dash-card--insights">
          <h2 className="fund-dash-card__title"><TrendingUp size={18} /> Financial Insights</h2>
          <ul className="fund-dash-insights">
            {ADMIN_FUND_INSIGHTS.map((ins) => (
              <li key={ins.text}>
                <span aria-hidden="true">{ins.icon}</span>
                <p>{ins.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="fund-dash-card fund-dash-card--quick">
          <h2 className="fund-dash-card__title">Quick Actions</h2>
          <div className="fund-dash-quick-grid">
            {ADMIN_FUND_QUICK_ACTIONS.map((action) => {
              const Icon = QUICK_ICONS[action.icon] || Wallet;
              return (
                <button
                  key={action.id}
                  type="button"
                  className="fund-dash-quick-card"
                  onClick={() => showToast(`${action.label} (mock).`, 'info')}
                >
                  <Icon size={22} strokeWidth={1.5} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
