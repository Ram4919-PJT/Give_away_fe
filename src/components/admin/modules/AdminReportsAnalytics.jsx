import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import {
  BarChart3, Download, FileText, Calendar, Search, Eye,
  ArrowUpRight, TrendingUp, Clock
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { AdminBadge } from '../AdminModuleShell';
import {
  ADMIN_REPORTS_SUMMARY, ADMIN_REPORTS_TRENDS, ADMIN_REPORT_CATEGORIES,
  ADMIN_REPORT_RECENT_EXPORTS, ADMIN_REPORT_QUICK_ACTIONS, CATEGORY_DATA
} from '../../../data/adminReportsMockData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SUMMARY_KPIS = [
  { key: 'totalReports', icon: '📊', label: 'Total Reports Generated', accent: 'blue' },
  { key: 'reportsThisMonth', icon: '📅', label: 'Reports This Month', accent: 'green' },
  { key: 'scheduledReports', icon: '⏰', label: 'Scheduled Reports', accent: 'orange' },
  { key: 'totalDonations', icon: '💝', label: 'Total Donations', accent: 'purple' },
  { key: 'fundsDistributed', icon: '💰', label: 'Funds Distributed', accent: 'green', format: 'currency' },
  { key: 'activeNgos', icon: '🏢', label: 'Active NGOs', accent: 'blue' }
];

function ReportsSkeleton() {
  return (
    <div className="reports-dash reports-dash--loading" aria-hidden="true">
      <div className="reports-dash-skeleton reports-dash-skeleton--header" />
      <div className="reports-dash-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="reports-dash-skeleton reports-dash-skeleton--kpi" />)}
      </div>
      <div className="reports-dash-skeleton reports-dash-skeleton--tabs" />
      <div className="reports-dash-skeleton reports-dash-skeleton--panel" />
    </div>
  );
}

function LineChart({ data, color = '#2563EB', label = 'Trend' }) {
  const w = 520; const h = 200;
  const pad = { t: 16, r: 12, b: 28, l: 40 };
  const innerW = w - pad.l - pad.r; const innerH = h - pad.t - pad.b;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * innerW;
    const y = pad.t + innerH - (v / max) * innerH;
    return { x, y };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="reports-dash-chart reports-dash-chart--line">
      <svg viewBox={`0 0 ${w} ${h}`} className="reports-dash-chart__svg" role="img" aria-label={label}>
        {[0, 0.5, 1].map((pct) => (
          <line key={pct} x1={pad.l} y1={pad.t + innerH * (1 - pct)} x2={w - pad.r} y2={pad.t + innerH * (1 - pct)} className="reports-dash-chart__grid" />
        ))}
        <path d={path} className="reports-dash-chart__line" style={{ stroke: color }} fill="none" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />)}
        {data.map((_, i) => i % 2 === 0 && (
          <text key={i} x={pts[i].x} y={h - 6} className="reports-dash-chart__label" textAnchor="middle">{MONTHS[i]}</text>
        ))}
      </svg>
    </div>
  );
}

function BarChart({ items, color = '#2563EB' }) {
  const max = Math.max(...items.map((i) => i.amount || i.value || i.pct || 0), 1);
  return (
    <div className="reports-dash-chart reports-dash-chart--bar" role="img" aria-label="Bar chart">
      {items.map((item) => {
        const val = item.amount || item.value || item.pct || 0;
        const h = (val / max) * 100;
        return (
          <div key={item.name || item.label || item.region} className="reports-dash-bar">
            <div className="reports-dash-bar__fill" style={{ height: `${h}%`, background: item.color || color }} />
            <span className="reports-dash-bar__lbl">{(item.name || item.label || item.region || '').split(' ')[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

function DoughnutChart({ segments, centerLabel, centerValue }) {
  let cumulative = 0;
  const stops = segments.map((s) => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="reports-dash-doughnut">
      <div className="reports-dash-doughnut__visual">
        <div className="reports-dash-doughnut__ring" style={{ background: `conic-gradient(${stops})` }} />
        <div className="reports-dash-doughnut__center">
          <strong>{centerValue}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <ul className="reports-dash-doughnut__legend">
        {segments.map((s) => (
          <li key={s.label}><span style={{ background: s.color }} />{s.label} <em>{s.pct}%</em></li>
        ))}
      </ul>
    </div>
  );
}

function AreaChart({ data, color = '#22C55E' }) {
  const w = 520; const h = 160;
  const pad = { t: 12, r: 12, b: 24, l: 12 };
  const innerW = w - pad.l - pad.r; const innerH = h - pad.t - pad.b;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * innerW;
    const y = pad.t + innerH - (v / max) * innerH;
    return `${x},${y}`;
  });
  const areaPath = `M ${pts[0]} L ${pts.slice(1).join(' L ')} L ${pad.l + innerW},${pad.t + innerH} L ${pad.l},${pad.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="reports-dash-chart__svg reports-dash-chart--area" role="img" aria-label="Area chart">
      <path d={areaPath} fill={color} fillOpacity="0.15" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportFilters({ search, setSearch }) {
  return (
    <div className="reports-dash-filters">
      <div className="reports-dash-filters__search">
        <Search size={16} aria-hidden="true" />
        <input type="search" placeholder="Search reports…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search reports" />
      </div>
      <select defaultValue="all" aria-label="Date range"><option value="all">All Dates</option><option value="month">This Month</option><option value="quarter">This Quarter</option></select>
      <select defaultValue="all" aria-label="Category"><option value="all">All Categories</option><option value="medical">Medical</option><option value="education">Education</option></select>
      <select defaultValue="all" aria-label="NGO"><option value="all">All NGOs</option><option value="asha">Asha Kiran Foundation</option></select>
      <select defaultValue="all" aria-label="Status"><option value="all">All Statuses</option><option value="ready">Ready</option><option value="draft">Draft</option></select>
      <select defaultValue="newest" aria-label="Sort"><option value="newest">Newest First</option><option value="oldest">Oldest First</option></select>
    </div>
  );
}

function ExportButtons({ name, showToast }) {
  return (
    <div className="reports-dash-export-btns">
      <button type="button" className="reports-dash-btn reports-dash-btn--primary" onClick={() => showToast(`Exporting ${name} as PDF (mock).`, 'info')}>
        <Download size={14} /> Export PDF
      </button>
      <button type="button" className="reports-dash-btn reports-dash-btn--outline" onClick={() => showToast(`Exporting ${name} as Excel (mock).`, 'info')}>
        <FileText size={14} /> Export Excel
      </button>
      <button type="button" className="reports-dash-btn reports-dash-btn--ghost" onClick={() => showToast(`Opening full ${name} (mock).`, 'info')}>
        <Eye size={14} /> View Full Report
      </button>
    </div>
  );
}

function ReportTable({ rows, fields, showToast }) {
  return (
    <div className="reports-dash-table-wrap">
      <table className="reports-dash-table">
        <thead>
          <tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th aria-label="Actions" /></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {fields.map((f) => (
                <td key={f.key}>
                  {f.key === 'status'
                    ? <AdminBadge variant={row.status === 'Ready' ? 'green' : row.status === 'Draft' ? 'orange' : 'blue'}>{row.status}</AdminBadge>
                    : row[f.key]}
                </td>
              ))}
              <td>
                <button type="button" className="reports-dash-btn reports-dash-btn--ghost" onClick={() => showToast(`Download ${row.id} (mock).`, 'info')}>
                  <Download size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DonationPanel({ data, showToast }) {
  return (
    <>
      <div className="reports-dash-kpi-row">
        {data.kpis.map((k) => (
          <article key={k.label} className={`reports-dash-mini-kpi reports-dash-mini-kpi--${k.accent}`}>
            <strong>{k.value}</strong><span>{k.label}</span><em>{k.trend}</em>
          </article>
        ))}
      </div>
      <div className="reports-dash-charts-grid">
        <div className="reports-dash-card"><h3>Monthly Donation Trend</h3><LineChart data={data.monthlyTrend} color="#2563EB" /></div>
        <div className="reports-dash-card"><h3>Donation Types</h3><DoughnutChart segments={data.donationTypes} centerValue="1,248" centerLabel="Total" /></div>
        <div className="reports-dash-card"><h3>Top Donors</h3><BarChart items={data.topDonors} color="#22C55E" /></div>
      </div>
      <div className="reports-dash-card">
        <div className="reports-dash-card__head"><h3>Recent Donation Reports</h3><ExportButtons name="Donation Report" showToast={showToast} /></div>
        <ReportTable rows={data.table} fields={[
          { key: 'id', label: 'Report ID' }, { key: 'name', label: 'Name' },
          { key: 'period', label: 'Period' }, { key: 'records', label: 'Records' }, { key: 'status', label: 'Status' }
        ]} showToast={showToast} />
      </div>
    </>
  );
}

function FundPanel({ data, showToast }) {
  return (
    <>
      <div className="reports-dash-kpi-row">
        {data.kpis.map((k) => (
          <article key={k.label} className={`reports-dash-mini-kpi reports-dash-mini-kpi--${k.accent}`}>
            <strong>{k.value}</strong><span>{k.label}</span><em>{k.trend}</em>
          </article>
        ))}
      </div>
      <div className="reports-dash-charts-grid reports-dash-charts-grid--2">
        <div className="reports-dash-card"><h3>Monthly Income vs Distribution</h3><LineChart data={data.incomeVsDistribution.income} color="#2563EB" /><LineChart data={data.incomeVsDistribution.distribution} color="#22C55E" /></div>
        <div className="reports-dash-card"><h3>Category-wise Allocation</h3><DoughnutChart segments={data.categoryAllocation} centerValue="74%" centerLabel="Utilization" /></div>
      </div>
      <div className="reports-dash-card">
        <h3>Fund Utilization</h3>
        <div className="reports-dash-progress"><div className="reports-dash-progress__fill" style={{ width: `${data.utilization}%` }} /><span>{data.utilization}% utilized</span></div>
      </div>
      <div className="reports-dash-card">
        <div className="reports-dash-card__head"><h3>Recent Fund Reports</h3><ExportButtons name="Fund Report" showToast={showToast} /></div>
        <ReportTable rows={data.table} fields={[
          { key: 'id', label: 'Report ID' }, { key: 'name', label: 'Name' },
          { key: 'period', label: 'Period' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }
        ]} showToast={showToast} />
      </div>
    </>
  );
}

function NgoPanel({ data, showToast }) {
  return (
    <>
      <div className="reports-dash-kpi-row">
        {data.kpis.map((k) => (
          <article key={k.label} className={`reports-dash-mini-kpi reports-dash-mini-kpi--${k.accent}`}>
            <strong>{k.value}</strong><span>{k.label}</span><em>{k.trend}</em>
          </article>
        ))}
      </div>
      <div className="reports-dash-charts-grid">
        <div className="reports-dash-card"><h3>NGO Performance</h3><LineChart data={data.performance} color="#8B5CF6" /></div>
        <div className="reports-dash-card"><h3>Requests Completed</h3><BarChart items={data.requestsCompleted.map((v, i) => ({ name: MONTHS[i], value: v }))} color="#2563EB" /></div>
        <div className="reports-dash-card"><h3>Beneficiaries Served</h3><AreaChart data={data.beneficiariesServed} color="#22C55E" /></div>
      </div>
      <div className="reports-dash-card"><h3>Regional Distribution</h3><BarChart items={data.regional.map((r) => ({ name: r.region, value: r.pct, color: r.color }))} /></div>
      <div className="reports-dash-card">
        <div className="reports-dash-card__head"><h3>Recent NGO Activity</h3><ExportButtons name="NGO Report" showToast={showToast} /></div>
        <ReportTable rows={data.table} fields={[
          { key: 'id', label: 'Report ID' }, { key: 'name', label: 'Name' },
          { key: 'period', label: 'Period' }, { key: 'ngos', label: 'NGOs' }, { key: 'status', label: 'Status' }
        ]} showToast={showToast} />
      </div>
    </>
  );
}

function BeneficiaryPanel({ data, showToast }) {
  return (
    <>
      <div className="reports-dash-kpi-row reports-dash-kpi-row--wrap">
        {data.kpis.map((k) => (
          <article key={k.label} className={`reports-dash-mini-kpi reports-dash-mini-kpi--${k.accent}`}>
            <strong>{k.value}</strong><span>{k.label}</span><em>{k.trend}</em>
          </article>
        ))}
      </div>
      <div className="reports-dash-charts-grid">
        <div className="reports-dash-card"><h3>Category Distribution</h3><DoughnutChart segments={data.categoryDistribution} centerValue="12.4K" centerLabel="Total" /></div>
        <div className="reports-dash-card"><h3>Monthly Beneficiaries</h3><LineChart data={data.monthlyBeneficiaries} color="#2563EB" /></div>
        <div className="reports-dash-card"><h3>Aid Distribution</h3><AreaChart data={data.aidDistribution} color="#F59E0B" /></div>
      </div>
      <div className="reports-dash-card">
        <div className="reports-dash-card__head"><h3>Beneficiary Reports</h3><ExportButtons name="Beneficiary Report" showToast={showToast} /></div>
        <ReportTable rows={data.table} fields={[
          { key: 'id', label: 'Report ID' }, { key: 'name', label: 'Name' },
          { key: 'period', label: 'Period' }, { key: 'count', label: 'Count' }, { key: 'status', label: 'Status' }
        ]} showToast={showToast} />
      </div>
    </>
  );
}

function PlatformPanel({ data, showToast }) {
  return (
    <>
      <div className="reports-dash-kpi-row reports-dash-kpi-row--wrap">
        {data.kpis.map((k) => (
          <article key={k.label} className={`reports-dash-mini-kpi reports-dash-mini-kpi--${k.accent}`}>
            <strong>{k.value}</strong><span>{k.label}</span><em>{k.trend}</em>
          </article>
        ))}
      </div>
      <div className="reports-dash-charts-grid">
        <div className="reports-dash-card"><h3>User Growth</h3><LineChart data={data.userGrowth} color="#2563EB" /></div>
        <div className="reports-dash-card"><h3>Monthly Registrations</h3><BarChart items={data.monthlyRegistrations.map((v, i) => ({ name: MONTHS[i], value: v }))} color="#22C55E" /></div>
        <div className="reports-dash-card">
          <h3>Success Rates</h3>
          <div className="reports-dash-rates">
            <div><span>Verification Success</span><div className="reports-dash-progress"><div className="reports-dash-progress__fill reports-dash-progress__fill--blue" style={{ width: `${data.verificationRate}%` }} /></div><strong>{data.verificationRate}%</strong></div>
            <div><span>Donation Success</span><div className="reports-dash-progress"><div className="reports-dash-progress__fill" style={{ width: `${data.donationSuccessRate}%` }} /></div><strong>{data.donationSuccessRate}%</strong></div>
          </div>
        </div>
      </div>
      <div className="reports-dash-card">
        <h3>Platform Activity Timeline</h3>
        <ol className="reports-dash-timeline">
          {data.timeline.map((ev) => (
            <li key={ev.date + ev.event}><span className="reports-dash-timeline__dot" /><div><strong>{ev.event}</strong><span>{ev.date}</span></div></li>
          ))}
        </ol>
      </div>
      <div className="reports-dash-card">
        <div className="reports-dash-card__head"><h3>Platform Reports</h3><ExportButtons name="Platform Analytics" showToast={showToast} /></div>
        <ReportTable rows={data.table} fields={[
          { key: 'id', label: 'Report ID' }, { key: 'name', label: 'Name' },
          { key: 'period', label: 'Period' }, { key: 'metric', label: 'Metric' }, { key: 'status', label: 'Status' }
        ]} showToast={showToast} />
      </div>
    </>
  );
}

const PANELS = {
  donation: DonationPanel,
  fund: FundPanel,
  ngo: NgoPanel,
  beneficiary: BeneficiaryPanel,
  platform: PlatformPanel
};

export default function AdminReportsAnalytics() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('donation');
  const [search, setSearch] = useState('');
  const tabsRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[category];
    const container = tabsRef.current;
    if (el && container) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [category]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const fmtSummary = (key, format) => {
    const v = ADMIN_REPORTS_SUMMARY[key];
    if (format === 'currency') return `₹${(v / 100000).toFixed(1)}L`;
    return typeof v === 'number' ? v.toLocaleString('en-IN') : v;
  };

  const Panel = PANELS[category];
  const panelData = CATEGORY_DATA[category];

  if (loading) {
    return <div className="reports-dash page-route"><ReportsSkeleton /></div>;
  }

  return (
    <div className="reports-dash page-route">
      <header className="reports-dash-header">
        <div className="reports-dash-header__text">
          <h1>Reports & Analytics</h1>
          <p>Monitor platform performance, generate reports, analyze donations, and export insights.</p>
        </div>
        <div className="reports-dash-header__actions">
          <button type="button" className="reports-dash-btn reports-dash-btn--primary" onClick={() => showToast('Generating report (mock).', 'success')}>
            <BarChart3 size={16} /> Generate Report
          </button>
          <button type="button" className="reports-dash-btn reports-dash-btn--outline" onClick={() => showToast('Exporting all reports (mock).', 'info')}>
            <Download size={16} /> Export All Reports
          </button>
          <button type="button" className="reports-dash-btn reports-dash-btn--outline" onClick={() => showToast('Schedule report dialog (mock).', 'info')}>
            <Calendar size={16} /> Schedule Report
          </button>
        </div>
      </header>

      <div className="reports-dash-summary-grid">
        {SUMMARY_KPIS.map((k, i) => (
          <article key={k.key} className={`reports-dash-summary reports-dash-summary--${k.accent} reports-dash-animate reports-dash-animate--d${i + 1}`}>
            <span className="reports-dash-summary__icon" aria-hidden="true">{k.icon}</span>
            <strong>{fmtSummary(k.key, k.format)}</strong>
            <span className="reports-dash-summary__lbl">{k.label}</span>
            <em><ArrowUpRight size={11} /> {ADMIN_REPORTS_TRENDS[k.key]}</em>
          </article>
        ))}
      </div>

      <div className="reports-dash-categories">
        <div className="reports-dash-tabs" ref={tabsRef} role="tablist" aria-label="Report categories">
          <span className="reports-dash-tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }} />
          {ADMIN_REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={category === cat.id}
              ref={(el) => { tabRefs.current[cat.id] = el; }}
              className={`reports-dash-tab ${category === cat.id ? 'is-active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <span aria-hidden="true">{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      <ReportFilters search={search} setSearch={setSearch} />

      <div key={category} className="reports-dash-panel">
        {Panel && <Panel data={panelData} showToast={showToast} />}
      </div>

      <div className="reports-dash-bottom">
        <section className="reports-dash-card reports-dash-card--exports">
          <h3><Clock size={16} /> Recent Export History</h3>
          <div className="reports-dash-table-wrap">
            <table className="reports-dash-table">
              <thead>
                <tr><th>Report Name</th><th>Generated By</th><th>Date</th><th>Format</th><th>Download</th></tr>
              </thead>
              <tbody>
                {ADMIN_REPORT_RECENT_EXPORTS.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.name}</td>
                    <td>{exp.generatedBy}</td>
                    <td>{exp.date}</td>
                    <td><AdminBadge variant={exp.format === 'PDF' ? 'red' : 'green'}>{exp.format}</AdminBadge></td>
                    <td>
                      <button type="button" className="reports-dash-btn reports-dash-btn--ghost" onClick={() => showToast(`Downloading ${exp.name} (mock).`, 'info')}>
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="reports-dash-card reports-dash-card--quick">
          <h3>Quick Actions</h3>
          <div className="reports-dash-quick-grid">
            {ADMIN_REPORT_QUICK_ACTIONS.map((a) => (
              <button key={a.id} type="button" className="reports-dash-quick-card" onClick={() => showToast(`${a.label} (mock).`, 'info')}>
                <TrendingUp size={20} strokeWidth={1.5} /><span>{a.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
