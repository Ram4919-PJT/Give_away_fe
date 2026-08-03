import AdminVerificationQueue from '../../components/admin/AdminVerificationQueue';

import AdminDashboardView from '../../components/admin/AdminDashboardView';

import AdminNgoManagement from '../../components/admin/modules/AdminNgoManagement';

import AdminItemInventory from '../../components/admin/modules/AdminItemInventory';

import AdminFundManagement from '../../components/admin/modules/AdminFundManagement';

import AdminNotificationsPage from '../../components/admin/modules/AdminNotificationsPage';

import AdminDonationManagement from '../../components/admin/modules/AdminDonationManagement';

import AdminUserManagement from '../../components/admin/modules/AdminUserManagement';

import AdminReportsAnalytics from '../../components/admin/modules/AdminReportsAnalytics';

import AdminPriorityQueue from '../../components/admin/modules/AdminPriorityQueue';

import AdminFinancialAssistance from '../../components/admin/modules/AdminFinancialAssistance';

import AdminSettingsPage from '../../components/admin/modules/AdminSettingsPage';

import AdminSystemLogs from '../../components/admin/modules/AdminSystemLogs';



export function AdminDashboard() {

  return <AdminDashboardView />;

}



export function AdminPriorityQueuePage() {

  return <AdminPriorityQueue />;

}



export function AdminVerifications() {
  return <AdminVerificationQueue />;
}



export function AdminDonations() {

  return <AdminDonationManagement />;

}



export function AdminFinancialAssistancePage() {

  return <AdminFinancialAssistance />;

}



export function AdminNgos() {

  return <AdminNgoManagement />;

}



export function AdminInventory() {

  return <AdminItemInventory />;

}



export function AdminFunds() {

  return <AdminFundManagement />;

}



export function AdminUsers() {

  return <AdminUserManagement />;

}



export function AdminNotifications() {

  return <AdminNotificationsPage />;

}



export function AdminReports() {

  return <AdminReportsAnalytics />;

}



export function AdminSettings() {

  return <AdminSettingsPage />;

}



/* Legacy route aliases — preserve existing navigation paths */

export function AdminLedger() {

  return <AdminDonationManagement />;

}



export function AdminDonationUsage() {

  return <AdminFundManagement />;

}



export function AdminRequests() {

  return <AdminPriorityQueue />;

}



export function AdminLogs() {
  return <AdminSystemLogs />;
}


