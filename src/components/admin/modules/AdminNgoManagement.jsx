import { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import { getAdminNgoList, NGO_CATEGORY_TAGS } from '../../../data/adminMockData';
import {
  AdminModuleShell, AdminToolbar, AdminSearchInput, AdminSelect, AdminBadge, AdminEmpty
} from '../AdminModuleShell';
import AdminNgoDetailModal from './AdminNgoDetailModal';

export default function AdminNgoManagement() {
  const { ngos } = useApp();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    const enriched = getAdminNgoList(ngos || []);
    return enriched.filter((n) => {
      const q = search.toLowerCase();
      const matchQ = !q || n.name.toLowerCase().includes(q) || n.city.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || n.verificationStatus === statusFilter;
      return matchQ && matchS;
    });
  }, [ngos, search, statusFilter]);

  const detail = selected ? list.find((n) => n.id === selected) || getAdminNgoList(ngos).find((n) => n.id === selected) : null;

  return (
    <AdminModuleShell
      title="NGO Management"
      subtitle="Manage verified partners, review applications, and monitor NGO performance across the platform."
    >
      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search NGOs…" />
        <AdminSelect
          value={statusFilter}
          onChange={setStatusFilter}
          label="Status"
          options={['All', 'Verified', 'Pending Verification']}
        />
      </AdminToolbar>

      {list.length ? (
        <div className="admin-mod-ngo-grid">
          {list.map((ngo) => (
            <article key={ngo.id} className="admin-mod-ngo-card">
              <div className="admin-mod-ngo-card__head">
                <span className="admin-mod-ngo-card__logo" aria-hidden="true">{ngo.logo}</span>
                <div>
                  <h3>{ngo.name}</h3>
                  <span className="admin-mod-ngo-card__reg">{ngo.regNumber}</span>
                </div>
                <AdminBadge variant={ngo.verified ? 'green' : 'orange'}>{ngo.verificationStatus}</AdminBadge>
              </div>
              <dl className="admin-mod-ngo-card__meta">
                <div><dt>Contact</dt><dd>{ngo.contactPerson}</dd></div>
                <div><dt>Email</dt><dd>{ngo.email}</dd></div>
                <div><dt>Phone</dt><dd>{ngo.phone}</dd></div>
                <div><dt>Location</dt><dd>{ngo.city}, {ngo.state}</dd></div>
              </dl>
              <div className="admin-mod-ngo-card__areas">
                <span>Operating Areas</span>
                <div>{ngo.operatingAreas.map((a) => <AdminBadge key={a} variant="muted">{a}</AdminBadge>)}</div>
              </div>
              <div className="admin-mod-ngo-card__cats">
                <span>Categories</span>
                <div>{NGO_CATEGORY_TAGS.slice(0, 4).map((c) => <AdminBadge key={c} variant="blue">{c}</AdminBadge>)}</div>
              </div>
              <div className="admin-mod-ngo-card__stats">
                <div><strong>{ngo.totalBeneficiaries.toLocaleString()}</strong><span>Beneficiaries</span></div>
                <div><strong>{ngo.requestsCompleted}</strong><span>Completed</span></div>
                <div><strong>{ngo.activeRequests}</strong><span>Active</span></div>
                <div><strong>{ngo.dateJoined}</strong><span>Joined</span></div>
              </div>
              <div className="admin-mod-ngo-card__actions">
                <button type="button" className="admin-mod-btn admin-mod-btn--primary" onClick={() => setSelected(ngo.id)}>View Details</button>
                <button type="button" className="admin-mod-btn admin-mod-btn--outline" onClick={() => showToast('Edit NGO — wireframe preview.', 'info')}>Edit</button>
                {!ngo.verified && (
                  <button type="button" className="admin-mod-btn admin-mod-btn--green" onClick={() => showToast(`${ngo.name} approved.`, 'success')}>Approve</button>
                )}
                <button type="button" className="admin-mod-btn admin-mod-btn--danger" onClick={() => showToast(`${ngo.name} suspended (mock).`, 'info')}>Suspend</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty title="No NGOs found" desc="Try adjusting your search or filters." />
      )}

      {detail && (
        <AdminNgoDetailModal
          ngo={detail}
          onClose={() => setSelected(null)}
          showToast={showToast}
        />
      )}
    </AdminModuleShell>
  );
}
