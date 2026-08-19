import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getReceiverApps } from '../utils/receiverHelpers';
import {
  buildActiveRequests,
  buildAssistanceSeries,
  buildCauseBreakdown,
  buildImpactSnapshot,
  buildRecentReceived,
  computeReceiverDashboardStats,
} from '../utils/receiverDashboardHelpers';

export function useReceiverDashboard() {
  const { currentUser, receiverApplications, receiverNotifications, platformLoading } = useApp();

  const applications = useMemo(
    () => getReceiverApps(receiverApplications, currentUser),
    [receiverApplications, currentUser]
  );

  const data = useMemo(() => {
    if (platformLoading) return null;
    return {
      stats: computeReceiverDashboardStats(applications),
      series: buildAssistanceSeries(applications),
      causeBreakdown: buildCauseBreakdown(applications),
      recentReceived: buildRecentReceived(applications),
      activeRequests: buildActiveRequests(applications),
      impactSnapshot: buildImpactSnapshot(applications),
      notifications: (receiverNotifications || []).slice(0, 4),
      applications,
      periodTotal: applications
        .filter((a) => ['Completed', 'Approved', 'Funds Released', 'Assigned'].includes(a.status))
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    };
  }, [applications, receiverNotifications, platformLoading]);

  return {
    data,
    loading: platformLoading,
    platformLoading,
    error: null,
    reload: () => {},
    applications,
  };
}
