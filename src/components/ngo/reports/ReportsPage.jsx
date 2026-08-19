import {
  Gift, Users, Package, Banknote, BarChart3,
} from 'lucide-react';
import ApiEmptyState from '../../ui/ApiEmptyState';
import { useNgoReportData } from '../../../hooks/useNgoReportData';
import { DonationDistributionChart } from './ReportCharts';

export default function ReportsPage() {
  const { kpis, distribution, requests, beneficiaries, inventory, empty } = useNgoReportData();

  if (empty) {
    return (
      <div className="ngo-page ngo-module page-route">
        <header className="nfa-hero">
          <h1>Reports &amp; Analytics</h1>
          <p>Insights from your NGO activity on the platform.</p>
        </header>
        <ApiEmptyState
          icon={BarChart3}
          title="No report data yet"
          description="Submit requests, manage beneficiaries, or receive inventory allocations to see analytics here."
        />
      </div>
    );
  }

  return (
    <div className="ngo-page ngo-module page-route">
      <header className="nfa-hero">
        <h1>Reports &amp; Analytics</h1>
        <p>Live summary from your platform data — inventory, beneficiaries, and requests.</p>
      </header>

      <div className="ngo-dash-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          [Gift, 'Total Requests', kpis.totalDonations],
          [Package, 'Inventory Units', kpis.itemsDistributed],
          [Users, 'Beneficiaries', kpis.activeBeneficiaries],
          [Banknote, 'Pending', kpis.pendingRequests],
        ].map(([Icon, label, val]) => (
          <article key={label} className="ngo-dash-stat-card">
            <Icon size={20} aria-hidden="true" />
            <p>{label}</p>
            <strong>{val}</strong>
          </article>
        ))}
      </div>

      {distribution.length > 0 && (
        <section className="dd-card p-6 mb-6">
          <h2 className="text-lg font-bold text-[#0B245B] mb-4">Inventory by Category</h2>
          <DonationDistributionChart data={distribution} />
        </section>
      )}

      <section className="dd-card p-6">
        <h2 className="text-lg font-bold text-[#0B245B] mb-4">Recent Requests</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-[#49638F] m-0">No requests submitted yet.</p>
        ) : (
          <ul className="space-y-2 m-0 p-0 list-none">
            {requests.slice(0, 10).map((r) => (
              <li key={r.id} className="text-sm border border-[#DCE8FA] rounded-xl p-3">
                <strong>{r.id}</strong> · {r.type} · {r.status}
                <p className="m-0 mt-1 text-[#49638F]">{r.purpose}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {beneficiaries.length > 0 && (
        <section className="dd-card p-6 mt-6">
          <h2 className="text-lg font-bold text-[#0B245B] mb-2">Beneficiaries ({beneficiaries.length})</h2>
          <p className="text-sm text-[#49638F] m-0">Managed through your NGO profile on the platform.</p>
        </section>
      )}

      {inventory.length > 0 && (
        <section className="dd-card p-6 mt-6">
          <h2 className="text-lg font-bold text-[#0B245B] mb-2">Platform Inventory ({inventory.length} items)</h2>
          <p className="text-sm text-[#49638F] m-0">Stock levels reflect live warehouse data.</p>
        </section>
      )}
    </div>
  );
}
