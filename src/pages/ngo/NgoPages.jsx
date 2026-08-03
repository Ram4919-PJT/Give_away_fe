import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Upload, CheckCircle, Clock, ShieldCheck, Package } from 'lucide-react';
import { useApp, isNgoVerified, getNgoVerificationStatus, isNgoVerificationSubmitted } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { NGO_PROGRAMS, NGO_VERIFY_REQUIRED, NGO_VERIFY_OPTIONAL, NGO_LOCKED_TABS } from '../../data/constants';
import NgoDashboardView from '../../components/ngo/NgoDashboardView';
import RequestDonationsPage from '../../components/ngo/request-donations/RequestDonationsPage';
import FinancialAssistancePage from '../../components/ngo/financial-assistance/FinancialAssistancePage';
import InventoryPage from '../../components/ngo/inventory/InventoryPage';
import BeneficiariesPage from '../../components/ngo/beneficiaries/BeneficiariesPage';
import ReportsPage from '../../components/ngo/reports/ReportsPage';
import OrganizationProfilePage from '../../components/ngo/profile/OrganizationProfilePage';
import NgoSettingsPage from '../../components/ngo/settings/NgoSettingsPage';

function LockedFeature({ title }) {
  const navigate = useNavigate();
  return (
    <div className="ngo-page ngo-module page-route">
      <div className="ngo-locked-overlay">
        <Lock size={48} />
        <h2>{title} Locked</h2>
        <p>Complete NGO verification to access this feature.</p>
        <button type="button" className="login-submit" onClick={() => navigate('/dashboard/ngo-verify')}>Complete Verification</button>
      </div>
    </div>
  );
}

export function NgoDashboard() {
  return <NgoDashboardView />;
}

export function NgoVerify() {
  const { currentUser, dispatch } = useApp();
  const { showToast } = useToast();
  const [uploaded, setUploaded] = useState({});
  const status = getNgoVerificationStatus(currentUser);

  if (status === 'verified') return <div className="ngo-page ngo-module"><div className="ngo-verify-status-card ngo-verify-status-card--verified"><ShieldCheck size={28} /><div><strong>Verified NGO Partner</strong><p>Your organization is fully verified.</p></div></div></div>;
  if (status === 'pending') {
    return (
      <div className="ngo-page ngo-module ngo-verify-page page-route">
        <Link to="/dashboard/ngo-dashboard" className="ngo-back-btn">← Back to Dashboard</Link>
        <div className="ngo-verify-review-banner" role="status">
          <div className="ngo-verify-review-banner__content">
            <h3>Verification Under Review</h3>
            <p>
              Thank you for submitting your documentation. The verification process typically takes 24–48 hours.
              We will notify you via email as soon as your account is fully verified.
            </p>
          </div>
          <div className="ngo-verify-review-banner__status" aria-disabled="true">
            <Clock size={18} aria-hidden="true" />
            <span>Documents Under Review</span>
          </div>
        </div>
      </div>
    );
  }

  const submit = () => {
    const missing = NGO_VERIFY_REQUIRED.filter((d) => !uploaded[d]);
    if (missing.length) { showToast(`Required: ${missing.join(', ')}`, 'error'); return; }
    dispatch({
      type: 'ADD_VERIFICATION',
      payload: {
        id: 'v-ngo-' + Date.now(),
        name: currentUser.name,
        email: currentUser.email,
        type: 'NGO',
        registrationId: currentUser.regNumber || 'Pending Registration ID',
        doc: 'ngo_bundle.pdf',
        status: 'Pending',
        submitted: new Date().toISOString().split('T')[0],
        documents: [
          ...NGO_VERIFY_REQUIRED.filter((d) => uploaded[d]).map((label) => ({
            label,
            filename: label.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.pdf'
          })),
          ...NGO_VERIFY_OPTIONAL.filter((d) => uploaded[d]).map((label) => ({
            label,
            filename: label.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.pdf'
          }))
        ]
      }
    });
    dispatch({ type: 'UPDATE_USER', payload: { verified: 'pending', verificationStatus: 'submitted' } });
    showToast('Verification submitted!', 'success');
  };

  const DocUpload = ({ name, required }) => (
    <label className={`ngo-doc-upload ${uploaded[name] ? 'uploaded' : ''}`}>
      <input type="file" accept=".pdf,.jpg,.png" onChange={() => setUploaded((u) => ({ ...u, [name]: true }))} />
      <div className="ngo-doc-icon">{uploaded[name] ? <CheckCircle size={20} /> : <Upload size={20} />}</div>
      <div className="ngo-doc-info"><strong>{name}{required ? ' *' : ''}</strong><span>{uploaded[name] ? 'Uploaded ✓' : 'Drag & drop or click'}</span></div>
    </label>
  );

  return (
    <div className="ngo-page ngo-module ngo-verify-page page-route">
      <Link to="/dashboard/ngo-dashboard" className="ngo-back-btn">← Back</Link>
      <div className="ngo-page-header"><h1>Complete NGO Verification</h1><p>Upload official documents for admin review.</p></div>
      <div className="ngo-form-card">
        <h3>Required Documents</h3>
        <div className="ngo-doc-grid">{NGO_VERIFY_REQUIRED.map((d) => <DocUpload key={d} name={d} required />)}</div>
        <h3 style={{ marginTop: '1.5rem' }}>Optional Documents</h3>
        <div className="ngo-doc-grid">{NGO_VERIFY_OPTIONAL.map((d) => <DocUpload key={d} name={d} />)}</div>
        <div className="ngo-form-actions">
          <button type="button" className="btn-ghost" onClick={() => showToast('Draft saved.', 'info')}>Save as Draft</button>
          <button type="button" className="login-submit" onClick={submit}>Submit Verification</button>
        </div>
      </div>
    </div>
  );
}

export function NgoPrograms() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const verified = isNgoVerified(currentUser);

  return (
    <div className="ngo-page ngo-module page-route">
      <div className="dash-page-header ngo-page-header">
        <h1>Browse Programs</h1>
        <p>Explore support programs from AJA Abayahastham available to verified NGO partners.</p>
      </div>

      {!verified && (
        <div className="dash-info-banner">
          <Lock size={16} />
          <span>Complete NGO verification to apply for programs and request donations.</span>
        </div>
      )}

      <div className="ngo-program-grid">
        {NGO_PROGRAMS.map((p) => (
          <article key={p.id} className="ngo-program-card">
            <div className="ngo-program-icon-wrap">{p.icon}</div>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="ngo-program-tags">
              {p.categories.map((c) => <span key={c} className="ngo-program-tag">{c}</span>)}
            </div>
            <button type="button" className="btn-secondary-blue btn-block" onClick={() => navigate(`/dashboard/ngo-program-detail/${p.id}`)}>
              View Details
            </button>
            {!verified && (
              <p className="ngo-verify-required">
                <Lock size={12} /> Verification required to apply
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export function NgoProgramDetail() {
  const { id } = useParams();
  const program = NGO_PROGRAMS.find((p) => p.id === id);
  if (!program) return null;
  return (
    <div className="ngo-page ngo-module page-route">
      <Link to="/dashboard/ngo-programs">← Back</Link>
      <h1>{program.icon} {program.name}</h1>
      <p>{program.desc}</p>
      <p><strong>Eligibility:</strong> {program.eligibility}</p>
    </div>
  );
}

export function NgoRequestDonations() {
  const { currentUser } = useApp();
  if (!isNgoVerified(currentUser)) return <LockedFeature title="Request Donations" />;
  return <RequestDonationsPage />;
}

export function NgoRequestFunds() {
  const { currentUser } = useApp();
  if (!isNgoVerified(currentUser)) return <LockedFeature title="Request Financial Assistance" />;
  return <FinancialAssistancePage />;
}

export function NgoInventory() {
  const { currentUser } = useApp();
  if (!isNgoVerified(currentUser)) return <LockedFeature title="Inventory" />;
  return <InventoryPage />;
}

export function NgoBeneficiaries() {
  const { currentUser } = useApp();
  if (!isNgoVerified(currentUser)) return <LockedFeature title="Beneficiaries" />;
  return <BeneficiariesPage />;
}

export function NgoMyRequests() {
  const { currentUser, ngoRequests } = useApp();
  const reqs = (ngoRequests || []).filter((r) => r.ngoEmail === currentUser.email);
  return (
    <div className="ngo-page ngo-module page-route">
      <h1>My Requests</h1>
      {reqs.length ? reqs.map((r) => (
        <div key={r.id} style={{ padding: '1rem', background: '#fff', borderRadius: 12, marginBottom: '0.5rem', border: '1px solid #E5E7EB' }}>
          <strong>{r.id}</strong> · {r.type} · <span className="badge status-pending">{r.status}</span>
          <p>{r.purpose}</p>
        </div>
      )) : <div className="ngo-empty"><Package size={48} /><p>No requests yet</p></div>}
    </div>
  );
}

export function NgoReports() {
  const { currentUser } = useApp();
  if (!isNgoVerified(currentUser)) return <LockedFeature title="Reports" />;
  return <ReportsPage />;
}

export function NgoNotifications() {
  const { ngoNotifications, dispatch } = useApp();
  return (
    <div className="ngo-page ngo-module page-route">
      <h1>Notifications</h1>
      {ngoNotifications?.map((n) => (
        <div key={n.id} className={`ngo-notif-item ${n.read ? '' : 'unread'}`} onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey: 'ngoNotifications', id: n.id } })}>
          <strong>{n.title}</strong><p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export function NgoProfile() {
  return <OrganizationProfilePage />;
}

export function NgoSettings() {
  return <NgoSettingsPage />;
}

export function NgoLockedRoute({ tab }) {
  const titles = {
    'ngo-request-donations': 'Request Donations',
    'ngo-request-funds': 'Request Financial Assistance',
    'ngo-inventory': 'Inventory',
    'ngo-beneficiaries': 'Beneficiaries',
    'ngo-reports': 'Reports'
  };
  return <LockedFeature title={titles[tab] || 'Feature'} />;
}
