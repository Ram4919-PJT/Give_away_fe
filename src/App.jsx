import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
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
  DonorMyDonations, DonorDonationDetail,
  DonorNotifications, DonorProfile, DonorSettings, DonorVerify,
  DonorAddItem, DonorItemDetail, DonorItemRequests,
} from './pages/donor/DonorPages';
import DonorFeaturePlaceholder from './components/donor/DonorFeaturePlaceholder';
import MyPledgesView from './components/donor/my-pledges/MyPledgesView';
import MyRecurringGiftsView from './components/donor/my-recurring-gifts/MyRecurringGiftsView';
import MyImpactView from './components/donor/my-impact/MyImpactView';
import {
  ReceiverDashboard, ReceiverApply,
  ReceiverApplications, ReceiverApplicationDetail, ReceiverNotifications,
  ReceiverProfile, ReceiverSettings, ReceiverVerify,
} from './pages/receiver/ReceiverPages';
import AdminPortalRedirect from './pages/AdminPortalRedirect';
import {
  NgoDashboard, NgoVerify, NgoPrograms, NgoProgramDetail, NgoRequestDonations,
  NgoRequestFunds, NgoInventory, NgoBeneficiaries, NgoMyRequests, NgoReports,
  NgoNotifications, NgoProfile, NgoSettings, NgoCreateProgram, NgoEditProgram
} from './pages/ngo/NgoPages';
import { NgoOperationalGuard } from './components/ngo/NgoAccessGuard';

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
  const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) => location.pathname === p)
    || location.pathname.startsWith('/register/')
    || location.pathname.startsWith('/donate');
  const isMobileMockup = false;
  const isPortalMockup = false;
  const isLanding = location.pathname === '/';

  return (
    <div className={`app-shell${isAuthPage ? ' app-shell--auth' : ''}${isDashboard ? ' app-shell--dashboard' : ''}${isMobileMockup ? ' app-shell--mobile-mockup' : ''}${isPortalMockup ? ' app-shell--portal-mockup' : ''}${isLanding ? ' app-shell--landing' : ''}`}>
      {!isDashboard && !isMobileMockup && !isPortalMockup && !isLanding && !isAuthPage && <AppHeader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portal-mockup" element={<Navigate to="/" replace />} />
        <Route path="/mobile-home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
          <Route path="donor-add-item" element={<RoleGuard allowed={['donor']}><DonorAddItem /></RoleGuard>} />
          <Route path="donor-item-donation/:id" element={<RoleGuard allowed={['donor']}><DonorItemDetail /></RoleGuard>} />
          <Route path="donor-item-requests" element={<RoleGuard allowed={['donor']}><DonorItemRequests /></RoleGuard>} />
          <Route path="donor-my-donations" element={<RoleGuard allowed={['donor']}><DonorMyDonations /></RoleGuard>} />
          <Route path="donor-donation-detail/:id" element={<RoleGuard allowed={['donor']}><DonorDonationDetail /></RoleGuard>} />
          <Route path="donor-my-impact" element={<RoleGuard allowed={['donor']}><MyImpactView /></RoleGuard>} />
          <Route path="donor-notifications" element={<RoleGuard allowed={['donor']}><DonorNotifications /></RoleGuard>} />
          <Route path="donor-profile" element={<RoleGuard allowed={['donor']}><DonorProfile /></RoleGuard>} />
          <Route path="donor-settings" element={<RoleGuard allowed={['donor']}><DonorSettings /></RoleGuard>} />
          <Route path="donor-verify" element={<RoleGuard allowed={['donor']}><DonorVerify /></RoleGuard>} />
          <Route path="donor-my-pledges" element={<RoleGuard allowed={['donor']}><MyPledgesView /></RoleGuard>} />
          <Route path="donor-recurring" element={<RoleGuard allowed={['donor']}><MyRecurringGiftsView /></RoleGuard>} />
          <Route path="donor-campaigns" element={<Navigate to="/dashboard/donor-dashboard" replace />} />
          <Route path="donor-ngo-partners" element={<Navigate to="/dashboard/donor-dashboard" replace />} />
          <Route path="donor-certificates" element={<RoleGuard allowed={['donor']}><DonorFeaturePlaceholder featureId="donor-certificates" /></RoleGuard>} />
          <Route path="donor-favorites" element={<RoleGuard allowed={['donor']}><DonorFeaturePlaceholder featureId="donor-favorites" /></RoleGuard>} />
          <Route path="donor-payment-methods" element={<RoleGuard allowed={['donor']}><DonorFeaturePlaceholder featureId="donor-payment-methods" /></RoleGuard>} />
          <Route path="donor-help" element={<RoleGuard allowed={['donor']}><DonorFeaturePlaceholder featureId="donor-help" /></RoleGuard>} />

          {/* Receiver */}
          <Route path="receiver-dashboard" element={<RoleGuard allowed={['receiver']}><ReceiverDashboard /></RoleGuard>} />
          <Route path="receiver-apply" element={<RoleGuard allowed={['receiver']}><ReceiverApply /></RoleGuard>} />
          <Route path="receiver-requests" element={<RoleGuard allowed={['receiver']}><ReceiverApplications /></RoleGuard>} />
          <Route path="receiver-requests/new" element={<Navigate to="/dashboard/receiver-apply" replace />} />
          <Route path="receiver-applications" element={<Navigate to="/dashboard/receiver-requests" replace />} />
          <Route path="receiver-browse-items" element={<Navigate to="/dashboard/receiver-dashboard" replace />} />
          <Route path="receiver-item/:id" element={<Navigate to="/dashboard/receiver-dashboard" replace />} />
          <Route path="receiver-my-item-requests" element={<Navigate to="/dashboard/receiver-requests" replace />} />
          <Route path="receiver-application-detail/:id" element={<RoleGuard allowed={['receiver']}><ReceiverApplicationDetail /></RoleGuard>} />
          <Route path="receiver-notifications" element={<RoleGuard allowed={['receiver']}><ReceiverNotifications /></RoleGuard>} />
          <Route path="receiver-verify" element={<RoleGuard allowed={['receiver']}><ReceiverVerify /></RoleGuard>} />
          <Route path="receiver-profile" element={<RoleGuard allowed={['receiver']}><ReceiverProfile /></RoleGuard>} />
          <Route path="receiver-settings" element={<RoleGuard allowed={['receiver']}><ReceiverSettings /></RoleGuard>} />

          <Route path="admin-users" element={<AdminPortalRedirect />} />
          <Route path="admin-kyc-review" element={<AdminPortalRedirect />} />
          <Route path="admin-assistance-review" element={<AdminPortalRedirect />} />
          <Route path="admin-item-verification" element={<AdminPortalRedirect />} />
          <Route path="admin" element={<AdminPortalRedirect />} />
          <Route path="admin/*" element={<AdminPortalRedirect />} />

          {/* NGO */}
          <Route path="ngo-dashboard" element={<RoleGuard allowed={['ngo']}><NgoDashboard /></RoleGuard>} />
          <Route path="ngo-verify" element={<RoleGuard allowed={['ngo']}><NgoVerify /></RoleGuard>} />
          <Route path="ngo-programs" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoPrograms /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-programs/create" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoCreateProgram /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-programs/edit/:id" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoEditProgram /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-campaigns/create" element={<Navigate to="/dashboard/ngo-programs/create" replace />} />
          <Route path="ngo-program-detail/:id" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoProgramDetail /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-request-donations" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoRequestDonations /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-request-funds" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoRequestFunds /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-inventory" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoInventory /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-beneficiaries" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoBeneficiaries /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-my-requests" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoMyRequests /></NgoOperationalGuard></RoleGuard>} />
          <Route path="ngo-reports" element={<RoleGuard allowed={['ngo']}><NgoOperationalGuard><NgoReports /></NgoOperationalGuard></RoleGuard>} />
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
