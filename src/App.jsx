import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import PortalMockupPage from './pages/PortalMockupPage';
import MobileHomeMockup from './pages/MobileHomeMockup';
import LoginPage from './pages/LoginPage';
import RegisterRolePage from './pages/RegisterRolePage';
import DonorRegisterPage from './pages/register/DonorRegisterPage';
import ReceiverRegisterPage from './pages/register/ReceiverRegisterPage';
import NgoRegisterPage from './pages/register/NgoRegisterPage';
import DonationEntryPage from './pages/donate/DonationEntryPage';
import DonateMobilePage from './pages/donate/DonateMobilePage';
import DonatePaymentPage from './pages/donate/DonatePaymentPage';
import DonateSuccessPage from './pages/donate/DonateSuccessPage';
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

function DashboardHome() {
  const { currentUser } = useApp();
  const role = currentUser?.role;
  const map = {
    donor: '/dashboard/donor-dashboard',
    receiver: '/dashboard/receiver-dashboard',
    ngo: '/dashboard/ngo-dashboard',
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
    || location.pathname.startsWith('/register/')
    || location.pathname.startsWith('/donate');
  const isMobileMockup = location.pathname === '/mobile-home';
  const isPortalMockup = location.pathname === '/portal-mockup';
  const isLanding = location.pathname === '/';

  return (
    <div className={`app-shell${isAuthPage ? ' app-shell--auth' : ''}${isDashboard ? ' app-shell--dashboard' : ''}${isMobileMockup ? ' app-shell--mobile-mockup' : ''}${isPortalMockup ? ' app-shell--portal-mockup' : ''}${isLanding ? ' app-shell--landing' : ''}`}>
      {!isDashboard && !isMobileMockup && !isPortalMockup && !isLanding && !isAuthPage && <AppHeader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portal-mockup" element={<PortalMockupPage />} />
        <Route path="/mobile-home" element={<MobileHomeMockup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterRolePage />} />
        <Route path="/register/donor" element={<DonorRegisterPage />} />
        <Route path="/register/receiver" element={<ReceiverRegisterPage />} />
        <Route path="/register/ngo" element={<NgoRegisterPage />} />

        {/* Donation Flow */}
        <Route path="/donate" element={<DonationEntryPage />} />
        <Route path="/donate/mobile" element={<DonateMobilePage />} />
        <Route path="/donate/payment" element={<DonatePaymentPage />} />
        <Route path="/donate/success" element={<DonateSuccessPage />} />

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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && !isMobileMockup && !isPortalMockup && !isLanding && !isAuthPage && <AppFooter />}
    </div>
  );
}
