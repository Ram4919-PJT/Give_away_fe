import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Lock, Upload, CheckCircle, Clock, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react';

import { useApp, isNgoVerified, getNgoVerificationStatus } from '../../context/AppContext';

import { useToast } from '../../components/ui/Toast';
import { PageBackLink } from '../../components/ui/FlowNav';

import { NGO_VERIFY_REQUIRED, NGO_VERIFY_OPTIONAL } from '../../data/constants';

import NotificationsCenter from '../../components/notifications/NotificationsCenter';

import NgoVerifyPage from './NgoVerifyPage';

import NgoDashboardView from '../../components/ngo/NgoDashboardView';

import RequestDonationsPage from '../../components/ngo/request-donations/RequestDonationsPage';

import FinancialAssistancePage from '../../components/ngo/financial-assistance/FinancialAssistancePage';

import InventoryPage from '../../components/ngo/inventory/InventoryPage';

import BeneficiariesPage from '../../components/ngo/beneficiaries/BeneficiariesPage';

import ReportsPage from '../../components/ngo/reports/ReportsPage';

import OrganizationProfilePage from '../../components/ngo/profile/OrganizationProfilePage';

import NgoSettingsPage from '../../components/ngo/settings/NgoSettingsPage';

import NgoCreateProgramPage from '../../components/ngo/programs/NgoCreateProgramPage';
import NgoEditProgramPage from '../../components/ngo/programs/NgoEditProgramPage';



export function NgoDashboard() {

  return <NgoDashboardView />;

}



export function NgoVerify() {
  return <NgoVerifyPage />;
}



export function NgoRequestDonations() {

  return <RequestDonationsPage />;

}



export function NgoRequestFunds() {

  return <FinancialAssistancePage />;

}



export function NgoInventory() {

  return <InventoryPage />;

}



export function NgoBeneficiaries() {

  return <BeneficiariesPage />;

}



export function NgoMyRequests() {

  const { currentUser, ngoRequests, platformLoading } = useApp();

  const reqs = (ngoRequests || []).filter((r) => r.ngoEmail === currentUser?.email);



  return (

    <div className="ngo-page ngo-module page-route">

      <h1>My Requests</h1>

      {platformLoading ? (

        <p className="text-sm text-[#49638F]">Loading requests…</p>

      ) : reqs.length ? (

        reqs.map((r) => (

          <div key={r.id} style={{ padding: '1rem', background: '#fff', borderRadius: 12, marginBottom: '0.5rem', border: '1px solid #E5E7EB' }}>

            <strong>{r.id}</strong> · {r.type} · <span className="badge status-pending">{r.status}</span>

            <p>{r.purpose}</p>

          </div>

        ))

      ) : (

        <p className="text-sm text-[#49638F]">No requests yet. Submit an item or fund request to see it here.</p>

      )}

    </div>

  );

}



export function NgoReports() {

  return <ReportsPage />;

}



export function NgoNotifications() {

  return <NotificationsCenter role="ngo" listKey="ngoNotifications" />;

}



export function NgoProfile() {

  return <OrganizationProfilePage />;

}



export function NgoCreateProgram() {
  return <NgoCreateProgramPage />;
}

export function NgoEditProgram() {
  return <NgoEditProgramPage />;
}



export function NgoSettings() {

  return <NgoSettingsPage />;

}



export function NgoPrograms() {
  const navigate = useNavigate();
  const { programs, platformLoading, currentUser } = useApp();
  const verified = isNgoVerified(currentUser);
  const allPrograms = programs || [];

  return (
    <div className="ngo-page ngo-module page-route">
      <div className="dash-page-header ngo-page-header ngo-programs-header">
        <div>
          <h1>Programs</h1>
          <p>Browse and manage programs in the catalog.</p>
        </div>
        {verified && (
          <button type="button" className="ngo-btn ngo-btn--primary" onClick={() => navigate('/dashboard/ngo-programs/create')}>
            Create Program
          </button>
        )}
      </div>

      {platformLoading ? (
        <p className="text-sm text-[#49638F]">Loading programs…</p>
      ) : allPrograms.length === 0 ? (
        <p className="text-sm text-[#49638F]">No programs in the catalog yet.</p>
      ) : (
        <div className="ngo-program-list">
          {allPrograms.map((p) => (
            <article key={p.program_id || p.id} className="ngo-program-row">
              <div>
                <h3>{p.title || p.program_name}</h3>
                <p>{p.description || 'No description provided.'}</p>
                <div className="ngo-program-row__meta">
                  <span>{p.category || 'Uncategorized'}</span>
                  <span className={`ngo-status-pill${String(p.status).toUpperCase() === 'ACTIVE' ? ' ngo-status-pill--success' : ''}`}>
                    {p.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
              <div className="ngo-program-row__actions">
                <button type="button" className="ngo-btn ngo-btn--secondary ngo-btn--sm" onClick={() => navigate(`/dashboard/ngo-program-detail/${p.program_id || p.id}`)}>
                  View Details
                </button>
                {verified && (
                  <button type="button" className="ngo-btn ngo-btn--ghost ngo-btn--sm" onClick={() => navigate(`/dashboard/ngo-programs/edit/${p.program_id || p.id}`)}>
                    Edit
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}



export function NgoProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { programs, currentUser } = useApp();
  const verified = isNgoVerified(currentUser);
  const program = (programs || []).find((p) => String(p.program_id || p.id) === String(id));

  if (!program) {
    return (
      <div className="ngo-page ngo-module page-route">
        <PageBackLink to="/dashboard/ngo-programs" label="Back to Programs" />
        <p>Program not found.</p>
      </div>
    );
  }

  return (
    <div className="ngo-page ngo-module page-route">
      <PageBackLink to="/dashboard/ngo-programs" label="Back to Programs" />
      <header className="ngo-page-header">
        <h1>{program.title || program.program_name}</h1>
        <p>{program.description || 'No description provided.'}</p>
      </header>
      <dl className="ngo-program-detail">
        <div><dt>Category</dt><dd>{program.category || '—'}</dd></div>
        <div><dt>Status</dt><dd>{program.status || '—'}</dd></div>
        <div><dt>Program ID</dt><dd>{program.program_id || program.id}</dd></div>
      </dl>
      {verified && (
        <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => navigate(`/dashboard/ngo-programs/edit/${program.program_id || program.id}`)}>
          Edit Program
        </button>
      )}
    </div>
  );
}


