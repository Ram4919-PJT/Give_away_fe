import { useState, useMemo } from 'react';
import { FileHeart } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  AdminModuleShell, AdminStatStrip, AdminToolbar, AdminSearchInput, AdminSelect, AdminBadge, AdminEmpty
} from '../AdminModuleShell';

const STATUS_VARIANT = {
  'Under Review': 'orange', Submitted: 'blue', Approved: 'green',
  Rejected: 'red', Completed: 'green', Draft: 'muted'
};

export default function AdminFinancialAssistance() {
  const { receiverApplications, requests } = useApp();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const apps = useMemo(() => {
    const fromApps = (receiverApplications || []).map((a) => ({
      id: a.id,
      receiverName: a.receiverName,
      category: a.assistanceType,
      amount: a.amount,
      priority: a.status === 'Under Review' ? 'High' : 'Normal',
      assignedNgo: 'Asha Kiran Foundation',
      status: a.status,
      date: a.appliedDate,
      description: a.description
    }));
    return fromApps;
  }, [receiverApplications]);

  const filtered = apps.filter((a) => {
    const q = search.toLowerCase();
    const matchQ = !q || a.receiverName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchS = status === 'All' || a.status === status;
    return matchQ && matchS;
  });

  const pending = apps.filter((a) => !['Completed', 'Rejected'].includes(a.status)).length;

  return (
    <AdminModuleShell title="Financial Assistance" subtitle="Review and manage receiver financial assistance applications.">
      <AdminStatStrip items={[
        ['Total Applications', apps.length, 'blue'],
        ['Under Review', apps.filter((a) => a.status === 'Under Review').length, 'orange'],
        ['Approved', apps.filter((a) => a.status === 'Approved').length, 'green'],
        ['Open Requests', (requests || []).filter((r) => r.status === 'Pending').length, 'red']
      ]} />

      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search by name or ID…" />
        <AdminSelect value={status} onChange={setStatus} label="Status" options={['All', 'Under Review', 'Submitted', 'Approved', 'Completed', 'Rejected']} />
      </AdminToolbar>

      {filtered.length ? (
        <div className="admin-mod-assist-grid">
          {filtered.map((app) => (
            <article key={app.id} className="admin-mod-assist-card-lg">
              <div className="admin-mod-assist-card-lg__head">
                <span className="admin-mod-assist-card-lg__id">{app.id}</span>
                <AdminBadge variant={STATUS_VARIANT[app.status] || 'muted'}>{app.status}</AdminBadge>
              </div>
              <h3>{app.receiverName}</h3>
              <dl className="admin-mod-assist-card-lg__grid">
                <div><dt>Category</dt><dd>{app.category}</dd></div>
                <div><dt>Amount</dt><dd>₹{Number(app.amount).toLocaleString('en-IN')}</dd></div>
                <div><dt>Priority</dt><dd><AdminBadge variant={app.priority === 'High' ? 'orange' : 'muted'}>{app.priority}</AdminBadge></dd></div>
                <div><dt>Assigned NGO</dt><dd>{app.assignedNgo}</dd></div>
                <div><dt>Date</dt><dd>{app.date}</dd></div>
              </dl>
              <p className="admin-mod-assist-card-lg__desc">{app.description}</p>
              <button type="button" className="admin-mod-btn admin-mod-btn--primary" onClick={() => showToast(`Reviewing ${app.id}…`, 'info')}>
                View Details
              </button>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty icon={FileHeart} title="No applications" desc="Financial assistance requests will appear here." />
      )}
    </AdminModuleShell>
  );
}
