import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import MobileHomeMockup from './pages/MobileHomeMockup';
import LoginPage from './pages/LoginPage';
import RegisterRolePage from './pages/RegisterRolePage';
import DonorRegisterPage from './pages/register/DonorRegisterPage';
import ReceiverRegisterPage from './pages/register/ReceiverRegisterPage';
import NgoRegisterPage from './pages/register/NgoRegisterPage';
import { useApp } from './context/AppContext';
import {
  DonorDashboard, DonorDonateMoney, DonorDonateItem,
  DonorMyDonations, DonorDonationDetail, DonorMyImpact,
  DonorNotifications, DonorProfile, DonorSettings, DonorVerify
} from './pages/donor/DonorPages';
import {
  ReceiverDashboard, ReceiverApply,
  ReceiverApplications, ReceiverApplicationDetail, ReceiverNotifications,
  ReceiverProfile, ReceiverSettings
} from './pages/receiver/ReceiverPages';
import {
  NgoDashboard, NgoVerify, NgoPrograms, NgoProgramDetail, NgoRequestDonations,
  NgoRequestFunds, NgoInventory, NgoBeneficiaries, NgoMyRequests, NgoReports,
  NgoNotifications, NgoProfile, NgoSettings
} from './pages/ngo/NgoPages';
import {
  AdminDashboard, AdminVerifications, AdminLedger, AdminDonationUsage,
  AdminLogs, AdminUsers, AdminInventory, AdminRequests,
  AdminPriorityQueuePage, AdminDonations, AdminFinancialAssistancePage,
  AdminNgos, AdminFunds, AdminNotifications, AdminReports, AdminSettings
} from './pages/admin/AdminPages';

function DashboardHome() {
  const { currentUser } = useApp();
  const role = currentUser?.role;
  const map = {
    donor: '/dashboard/donor-dashboard',
    receiver: '/dashboard/receiver-dashboard',
    ngo: '/dashboard/ngo-dashboard',
    'super-admin': '/dashboard/admin-dashboard'
  };
  return <Navigate to={map[role] || '/login'} replace />;
}

function RoleGuard({ allowed, children }) {
  const { currentUser } = useApp();
  if (!currentUser || !allowed.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = ['/login', '/register'].some((p) => location.pathname === p)
    || location.pathname.startsWith('/register/');
  const isMobileMockup = location.pathname === '/mobile-home';

  return (
    <div className={`app-shell${isAuthPage ? ' app-shell--auth' : ''}${isDashboard ? ' app-shell--dashboard' : ''}${isMobileMockup ? ' app-shell--mobile-mockup' : ''}`}>
      {!isDashboard && !isMobileMockup && <AppHeader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mobile-home" element={<MobileHomeMockup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterRolePage />} />
        <Route path="/register/donor" element={<DonorRegisterPage />} />
        <Route path="/register/receiver" element={<ReceiverRegisterPage />} />
        <Route path="/register/ngo" element={<NgoRegisterPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* Donor */}
          <Route path="donor-dashboard" element={<RoleGuard allowed={['donor']}><DonorDashboard /></RoleGuard>} />
          <Route path="donor-donate-money" element={<RoleGuard allowed={['donor']}><DonorDonateMoney /></RoleGuard>} />
          <Route path="donor-donate-item" element={<RoleGuard allowed={['donor']}><DonorDonateItem /></RoleGuard>} />
          <Route path="donor-my-donations" element={<RoleGuard allowed={['donor']}><DonorMyDonations /></RoleGuard>} />
          <Route path="donor-donation-detail/:id" element={<RoleGuard allowed={['donor']}><DonorDonationDetail /></RoleGuard>} />
          <Route path="donor-my-impact" element={<RoleGuard allowed={['donor']}><DonorMyImpact /></RoleGuard>} />
          <Route path="donor-notifications" element={<RoleGuard allowed={['donor']}><DonorNotifications /></RoleGuard>} />
          <Route path="donor-profile" element={<RoleGuard allowed={['donor']}><DonorProfile /></RoleGuard>} />
          <Route path="donor-settings" element={<RoleGuard allowed={['donor']}><DonorSettings /></RoleGuard>} />
          <Route path="donor-verify" element={<RoleGuard allowed={['donor']}><DonorVerify /></RoleGuard>} />

          {/* Receiver */}
          <Route path="receiver-dashboard" element={<RoleGuard allowed={['receiver']}><ReceiverDashboard /></RoleGuard>} />
          <Route path="receiver-apply" element={<RoleGuard allowed={['receiver']}><ReceiverApply /></RoleGuard>} />
          <Route path="receiver-applications" element={<RoleGuard allowed={['receiver']}><ReceiverApplications /></RoleGuard>} />
          <Route path="receiver-application-detail/:id" element={<RoleGuard allowed={['receiver']}><ReceiverApplicationDetail /></RoleGuard>} />
          <Route path="receiver-notifications" element={<RoleGuard allowed={['receiver']}><ReceiverNotifications /></RoleGuard>} />
          <Route path="receiver-profile" element={<RoleGuard allowed={['receiver']}><ReceiverProfile /></RoleGuard>} />
          <Route path="receiver-settings" element={<RoleGuard allowed={['receiver']}><ReceiverSettings /></RoleGuard>} />

          {/* NGO */}
          <Route path="ngo-dashboard" element={<RoleGuard allowed={['ngo']}><NgoDashboard /></RoleGuard>} />
          <Route path="ngo-verify" element={<RoleGuard allowed={['ngo']}><NgoVerify /></RoleGuard>} />
          <Route path="ngo-programs" element={<RoleGuard allowed={['ngo']}><NgoPrograms /></RoleGuard>} />
          <Route path="ngo-program-detail/:id" element={<RoleGuard allowed={['ngo']}><NgoProgramDetail /></RoleGuard>} />
          <Route path="ngo-request-donations" element={<RoleGuard allowed={['ngo']}><NgoRequestDonations /></RoleGuard>} />
          <Route path="ngo-request-funds" element={<RoleGuard allowed={['ngo']}><NgoRequestFunds /></RoleGuard>} />
          <Route path="ngo-inventory" element={<RoleGuard allowed={['ngo']}><NgoInventory /></RoleGuard>} />
          <Route path="ngo-beneficiaries" element={<RoleGuard allowed={['ngo']}><NgoBeneficiaries /></RoleGuard>} />
          <Route path="ngo-my-requests" element={<RoleGuard allowed={['ngo']}><NgoMyRequests /></RoleGuard>} />
          <Route path="ngo-reports" element={<RoleGuard allowed={['ngo']}><NgoReports /></RoleGuard>} />
          <Route path="ngo-notifications" element={<RoleGuard allowed={['ngo']}><NgoNotifications /></RoleGuard>} />
          <Route path="ngo-profile" element={<RoleGuard allowed={['ngo']}><NgoProfile /></RoleGuard>} />
          <Route path="ngo-settings" element={<RoleGuard allowed={['ngo']}><NgoSettings /></RoleGuard>} />

          {/* Admin */}
          <Route path="admin-dashboard" element={<RoleGuard allowed={['super-admin']}><AdminDashboard /></RoleGuard>} />
          <Route path="admin-priority-queue" element={<RoleGuard allowed={['super-admin']}><AdminPriorityQueuePage /></RoleGuard>} />
          <Route path="admin-verifications" element={<RoleGuard allowed={['super-admin']}><AdminVerifications /></RoleGuard>} />
          <Route path="admin-donations" element={<RoleGuard allowed={['super-admin']}><AdminDonations /></RoleGuard>} />
          <Route path="admin-financial-assistance" element={<RoleGuard allowed={['super-admin']}><AdminFinancialAssistancePage /></RoleGuard>} />
          <Route path="admin-ngos" element={<RoleGuard allowed={['super-admin']}><AdminNgos /></RoleGuard>} />
          <Route path="admin-inventory" element={<RoleGuard allowed={['super-admin']}><AdminInventory /></RoleGuard>} />
          <Route path="admin-funds" element={<RoleGuard allowed={['super-admin']}><AdminFunds /></RoleGuard>} />
          <Route path="admin-users" element={<RoleGuard allowed={['super-admin']}><AdminUsers /></RoleGuard>} />
          <Route path="admin-notifications" element={<RoleGuard allowed={['super-admin']}><AdminNotifications /></RoleGuard>} />
          <Route path="admin-reports" element={<RoleGuard allowed={['super-admin']}><AdminReports /></RoleGuard>} />
          <Route path="admin-logs" element={<RoleGuard allowed={['super-admin']}><AdminLogs /></RoleGuard>} />
          <Route path="admin-settings" element={<RoleGuard allowed={['super-admin']}><AdminSettings /></RoleGuard>} />
          {/* Legacy admin paths */}
          <Route path="admin-ledger" element={<RoleGuard allowed={['super-admin']}><AdminLedger /></RoleGuard>} />
          <Route path="admin-donation-usage" element={<RoleGuard allowed={['super-admin']}><AdminDonationUsage /></RoleGuard>} />
          <Route path="admin-requests" element={<RoleGuard allowed={['super-admin']}><AdminRequests /></RoleGuard>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && !isMobileMockup && <AppFooter />}
    </div>
  );
}
