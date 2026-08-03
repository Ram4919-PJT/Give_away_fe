import { useMemo, useState } from 'react';
import {
  Gift, Users, Package, Banknote, BarChart3, TrendingUp, HandHeart,
  Clock, RotateCcw, FileText, Download, Printer, CalendarClock,
  FileSpreadsheet, Sparkles
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import {
  DATE_RANGES,
  REPORT_TYPES,
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  REPORT_TEMPLATES,
  RECENT_REPORTS,
  INITIAL_REPORT_FILTERS,
  getFilteredAnalytics
} from '../../../data/ngoReportsData';
import {
  DonationTrendChart,
  DonationDistributionChart,
  MonthlyDonationsChart,
  BeneficiaryStatusChart
} from './ReportCharts';

const ICONS = {
  Gift,
  Users,
  Package,
  Banknote,
  BarChart3,
  TrendingUp,
  HandHeart,
  Clock
};

function ReportIcon({ name, size = 20 }) {
  const Icon = ICONS[name] || FileText;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

export default function ReportsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState({ ...INITIAL_REPORT_FILTERS });
  const [generatedAt, setGeneratedAt] = useState({});

  const analytics = useMemo(() => getFilteredAnalytics(filters), [filters]);

  const patchFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...INITIAL_REPORT_FILTERS });
    showToast('Filters reset', 'success');
  };

  const exportAction = (format) => {
    showToast(`${format} export started`, 'success');
  };

  const generateReport = (report) => {
    const stamp = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setGeneratedAt((prev) => ({ ...prev, [report.id]: stamp }));
    showToast(`${report.name} generated successfully`, 'success');
  };

  const downloadReport = (row) => {
    if (row.status !== 'Ready') {
      showToast('Report is still processing', 'error');
      return;
    }
    showToast(`Downloading ${row.name} (${row.format})`, 'success');
  };

  return (
    <div className="nr-page ngo-page ngo-module page-route">
      <header className="nr-hero">
        <h1>Reports</h1>
        <p>Analyze donations, beneficiaries, inventory, and financial assistance with real-time insights.</p>
      </header>

      <section className="nr-kpis" aria-label="Summary metrics">
        <article className="nr-kpi">
          <span className="nr-kpi__icon"><Gift size={20} /></span>
          <div>
            <strong>{analytics.kpis.totalDonations.toLocaleString('en-IN')}</strong>
            <span>Total Donations</span>
            <em className="nr-kpi__delta nr-kpi__delta--up">{analytics.kpis.donationsDelta}</em>
          </div>
        </article>
        <article className="nr-kpi">
          <span className="nr-kpi__icon"><Package size={20} /></span>
          <div>
            <strong>{analytics.kpis.itemsDistributed.toLocaleString('en-IN')}</strong>
            <span>Items Distributed</span>
            <em className="nr-kpi__delta nr-kpi__delta--up">{analytics.kpis.itemsDelta}</em>
          </div>
        </article>
        <article className="nr-kpi">
          <span className="nr-kpi__icon"><Users size={20} /></span>
          <div>
            <strong>{analytics.kpis.activeBeneficiaries.toLocaleString('en-IN')}</strong>
            <span>Active Beneficiaries</span>
            <em className="nr-kpi__delta nr-kpi__delta--up">{analytics.kpis.beneficiariesDelta}</em>
          </div>
        </article>
        <article className="nr-kpi">
          <span className="nr-kpi__icon"><Clock size={20} /></span>
          <div>
            <strong>{analytics.kpis.pendingRequests.toLocaleString('en-IN')}</strong>
            <span>Pending Requests</span>
            <em className="nr-kpi__delta nr-kpi__delta--down">{analytics.kpis.pendingDelta}</em>
          </div>
        </article>
      </section>

      <section className="nr-filters" aria-label="Report filters">
        <label className="nr-filter">
          <span>Date Range</span>
          <select
            value={filters.dateRange}
            onChange={(e) => patchFilter('dateRange', e.target.value)}
          >
            {DATE_RANGES.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </label>

        <label className="nr-filter">
          <span>Report Type</span>
          <select
            value={filters.reportType}
            onChange={(e) => patchFilter('reportType', e.target.value)}
          >
            {REPORT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="nr-filter">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(e) => patchFilter('category', e.target.value)}
          >
            {REPORT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="nr-filter">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => patchFilter('status', e.target.value)}
          >
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <button type="button" className="nr-btn nr-btn--secondary" onClick={resetFilters}>
          <RotateCcw size={15} />
          Reset Filters
        </button>
      </section>

      {!analytics.hasData ? (
        <div className="nr-empty">
          <div className="nr-empty__art" aria-hidden="true">
            <BarChart3 size={40} strokeWidth={1.5} />
          </div>
          <h2>No report data available.</h2>
          <p>Analytics will appear after donations and beneficiary activities are recorded.</p>
        </div>
      ) : (
        <>
          <section className="nr-charts" aria-label="Analytics charts">
            <article className="nr-chart-card">
              <header>
                <h2>Donation Trend</h2>
                <p>Donations over time</p>
              </header>
              <DonationTrendChart data={analytics.trend} />
            </article>

            <article className="nr-chart-card">
              <header>
                <h2>Donation Distribution</h2>
                <p>Share by category</p>
              </header>
              <DonationDistributionChart data={analytics.distribution} />
            </article>

            <article className="nr-chart-card">
              <header>
                <h2>Monthly Donations</h2>
                <p>Value totals by month</p>
              </header>
              <MonthlyDonationsChart data={analytics.monthly} />
            </article>

            <article className="nr-chart-card">
              <header>
                <h2>Beneficiary Status</h2>
                <p>Case status breakdown</p>
              </header>
              <BeneficiaryStatusChart data={analytics.beneficiaryStatus} />
            </article>
          </section>

          <section className="nr-insights" aria-label="Impact insights">
            <div className="nr-section-head">
              <Sparkles size={18} aria-hidden="true" />
              <div>
                <h2>Impact Insights</h2>
                <p>Key signals from the current filter set</p>
              </div>
            </div>
            <div className="nr-insights__grid">
              {analytics.insights.map((item) => (
                <article key={item.id} className="nr-insight-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="nr-generate" aria-label="Report generation">
        <div className="nr-section-head">
          <FileText size={18} aria-hidden="true" />
          <div>
            <h2>Generate Reports</h2>
            <p>Create detailed reports for donations, beneficiaries, inventory, and funds</p>
          </div>
        </div>

        <div className="nr-report-grid">
          {REPORT_TEMPLATES.map((report) => (
            <article key={report.id} className="nr-report-card">
              <div className="nr-report-card__icon">
                <ReportIcon name={report.icon} />
              </div>
              <h3>{report.name}</h3>
              <p>{report.description}</p>
              <time>
                Last generated: {generatedAt[report.id] || report.lastGenerated}
              </time>
              <button
                type="button"
                className="nr-btn nr-btn--primary"
                onClick={() => generateReport(report)}
              >
                Generate Report
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="nr-export" aria-label="Export actions">
        <div className="nr-section-head">
          <Download size={18} aria-hidden="true" />
          <div>
            <h2>Export</h2>
            <p>Download or share the current analytics view</p>
          </div>
        </div>
        <div className="nr-export__toolbar">
          <button type="button" className="nr-btn nr-btn--secondary" onClick={() => exportAction('PDF')}>
            <FileText size={15} /> Export PDF
          </button>
          <button type="button" className="nr-btn nr-btn--secondary" onClick={() => exportAction('Excel')}>
            <FileSpreadsheet size={15} /> Export Excel
          </button>
          <button type="button" className="nr-btn nr-btn--secondary" onClick={() => window.print()}>
            <Printer size={15} /> Print Report
          </button>
          <button
            type="button"
            className="nr-btn nr-btn--ghost"
            onClick={() => showToast('Schedule Report coming soon', 'success')}
          >
            <CalendarClock size={15} /> Schedule Report
          </button>
        </div>
      </section>

      <section className="nr-recent" aria-label="Recent reports">
        <div className="nr-section-head">
          <TrendingUp size={18} aria-hidden="true" />
          <div>
            <h2>Recent Reports</h2>
            <p>Previously generated files ready for download</p>
          </div>
        </div>

        <div className="nr-table-wrap">
          <table className="nr-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Generated By</th>
                <th>Date</th>
                <th>Format</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((row) => (
                <tr key={row.id}>
                  <td data-label="Report Name">{row.name}</td>
                  <td data-label="Generated By">{row.generatedBy}</td>
                  <td data-label="Date">{row.date}</td>
                  <td data-label="Format">
                    <span className="nr-format">{row.format}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`nr-status nr-status--${row.status === 'Ready' ? 'ready' : 'processing'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td data-label="Download">
                    <button
                      type="button"
                      className="nr-btn nr-btn--link"
                      onClick={() => downloadReport(row)}
                      disabled={row.status !== 'Ready'}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
