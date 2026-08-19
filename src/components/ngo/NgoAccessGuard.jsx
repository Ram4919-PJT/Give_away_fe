import { Navigate, useLocation } from 'react-router-dom';
import { Lock, ShieldOff } from 'lucide-react';
import { useApp, isNgoVerified, isNgoSuspended } from '../../context/AppContext';

export const NGO_VERIFIED_ONLY_ROUTE_IDS = [
  'ngo-request-donations',
  'ngo-request-funds',
  'ngo-inventory',
  'ngo-beneficiaries',
  'ngo-reports',
  'ngo-programs',
  'ngo-program-detail',
  'ngo-my-requests',
];

export function isNgoVerifiedOnlyPath(pathname = '') {
  return NGO_VERIFIED_ONLY_ROUTE_IDS.some(
    (id) => pathname === `/dashboard/${id}` || pathname.startsWith(`/dashboard/${id}/`)
  );
}

function AccessBlocked({ title, message, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <div className="ngo-page ngo-module page-route">
      <div className="ngo-locked-overlay ngo-access-blocked">
        <Lock size={48} aria-hidden="true" />
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="ngo-access-blocked__actions">
          {primaryTo && (
            <a href={primaryTo} className="login-submit">
              {primaryLabel}
            </a>
          )}
          {secondaryTo && (
            <a href={secondaryTo} className="btn-ghost">
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function NgoSuspendedGuard({ children }) {
  const { currentUser } = useApp();
  if (!isNgoSuspended(currentUser)) return children;

  return (
    <div className="ngo-page ngo-module page-route">
      <div className="ngo-locked-overlay ngo-access-blocked ngo-access-blocked--suspended">
        <ShieldOff size={48} aria-hidden="true" />
        <h2>Account Suspended</h2>
        <p>
          Your NGO account has been suspended. Operational features are unavailable.
          Contact platform support for assistance.
        </p>
        <div className="ngo-access-blocked__actions">
          <a href="/dashboard/ngo-dashboard" className="login-submit">Back to Dashboard</a>
          <a href="/dashboard/ngo-profile" className="btn-ghost">View Profile</a>
        </div>
      </div>
    </div>
  );
}

export function NgoVerifiedGuard({ children }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (isNgoSuspended(currentUser)) {
    return <Navigate to="/dashboard/ngo-dashboard" replace state={{ suspended: true, from: location.pathname }} />;
  }

  if (!isNgoVerified(currentUser)) {
    return (
      <AccessBlocked
        title="Verification Required"
        message="This feature is available only after your NGO is verified."
        primaryLabel="Complete Verification"
        primaryTo="/dashboard/ngo-verify"
        secondaryLabel="Back to Dashboard"
        secondaryTo="/dashboard/ngo-dashboard"
      />
    );
  }

  return children;
}

export function NgoOperationalGuard({ children }) {
  return (
    <NgoSuspendedGuard>
      <NgoVerifiedGuard>{children}</NgoVerifiedGuard>
    </NgoSuspendedGuard>
  );
}
