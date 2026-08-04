/** Placeholder app state — dashboards populate when backend services are connected. */

export const initialNgos = [];

export function createInitialState() {
  return {
    verifications: [],
    requests: [],
    inventory: [],
    donations: [],
    ngos: [],
    notifications: [],
    receiverApplications: [],
    receiverNotifications: [],
    ngoRequests: [],
    ngoNotifications: [],
    ngoBeneficiaries: [],
    adminNotifications: []
  };
}
