import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { getAdminPortalRedirectUrl, getAdminPortalUrl } from '../utils/adminPortal';

export default function AdminPortalRedirect() {
  const location = useLocation();

  useEffect(() => {
    window.location.replace(getAdminPortalRedirectUrl(location.pathname));
  }, [location.pathname]);

  const portalUrl = getAdminPortalRedirectUrl(location.pathname);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#DCE8FA] p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EEF5FF] flex items-center justify-center text-[#1268E8]">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#0B245B] mb-2">Admin Portal</h1>
        <p className="text-sm text-[#49638F] mb-6">
          Administration is handled in the separate Admin Portal. You are being redirected…
        </p>
        <a
          href={portalUrl}
          className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-[#1268E8] text-white font-semibold text-sm hover:bg-[#0B57D0] transition"
        >
          Go to Admin Portal
        </a>
        <p className="mt-4 text-xs text-slate-400">
          <Link to="/login" className="text-[#1268E8] hover:underline">Back to user login</Link>
        </p>
      </div>
    </div>
  );
}
