import * as coreClient from './coreClient';
import * as notificationsClient from './notificationsClient';
import { getMyVerification } from './verificationClient';
import {
  mapDonationFromApi,
  mapNotificationFromApi,
  mapVerificationFromApi,
  mapProgramFromApi,
  mapAssistanceRequestFromApi,
  mapInventoryFromApi,
  mapBeneficiaryFromApi,
  mapNgoItemRequestFromApi,
  mapNgoFundRequestFromApi,
} from './mappers';

function notificationKeyForRole(role) {
  const map = {
    donor: 'notifications',
    receiver: 'receiverNotifications',
    ngo: 'ngoNotifications',
  };
  return map[role] || 'notifications';
}

export async function fetchPlatformData(role, userEmail = '') {
  const result = {
    donations: [],
    notifications: [],
    receiverNotifications: [],
    ngoNotifications: [],
    verifications: [],
    programs: [],
    receiverApplications: [],
    inventory: [],
    ngoBeneficiaries: [],
    ngoRequests: [],
    ngoProfile: null,
    receiverProfile: null,
    kycVerification: null,
  };

  const tasks = [];

  if (role === 'donor') {
    tasks.push(
      coreClient.listDonations().then((rows) => {
        result.donations = rows.map(mapDonationFromApi);
      })
    );
  }

  tasks.push(
    notificationsClient.listNotifications({ page: 1, page_size: 50 }).then((response) => {
      const rows = Array.isArray(response) ? response : response?.items || [];
      const mapped = rows.map(mapNotificationFromApi);
      const key = notificationKeyForRole(role);
      result[key] = mapped;
      result.notificationSummary = response?.summary || null;
      result.unreadNotificationCount = response?.summary?.unread ?? mapped.filter((n) => !n.read).length;
    })
  );

  if (role === 'ngo' || role === 'receiver' || role === 'donor') {
    tasks.push(
      getMyVerification().then((me) => {
        result.kycVerification = me;
      }).catch(() => {
        result.kycVerification = null;
      })
    );
  }

  if (role === 'ngo' || role === 'donor' || role === 'receiver') {
    tasks.push(
      coreClient.listPrograms().then((rows) => {
        result.programs = rows.map(mapProgramFromApi);
      }).catch(() => {
        result.programs = [];
      })
    );
  }

  if (role === 'receiver') {
    tasks.push(
      coreClient.listAssistanceRequests().then((rows) => {
        result.receiverApplications = rows.map(mapAssistanceRequestFromApi);
      }).catch(() => {
        result.receiverApplications = [];
      })
    );
    tasks.push(
      coreClient.getMyReceiverProfile().then((profile) => {
        result.receiverProfile = profile;
      }).catch(() => {
        result.receiverProfile = null;
      })
    );
  }

  if (role === 'ngo') {
    tasks.push(
      coreClient.getMyNgoProfile().then(async (profile) => {
        result.ngoProfile = profile;
        const profileVerified = String(profile?.verification_status || '').toUpperCase() === 'VERIFIED'
          || String(profile?.verification_status || '').toUpperCase() === 'APPROVED'
          || profile?.verified === true;
        if (!profile?.ngo_id || !profileVerified) return;
        const email = userEmail || profile.email || '';
        const [inv, beneficiaries, itemReqs, fundReqs] = await Promise.allSettled([
          coreClient.listInventory(),
          coreClient.listBeneficiaries(profile.ngo_id),
          coreClient.listNgoItemRequests(profile.ngo_id),
          coreClient.listNgoFundRequests(profile.ngo_id),
        ]);
        if (inv.status === 'fulfilled' && Array.isArray(inv.value)) {
          result.inventory = inv.value.map(mapInventoryFromApi);
        }
        if (beneficiaries.status === 'fulfilled' && Array.isArray(beneficiaries.value)) {
          result.ngoBeneficiaries = beneficiaries.value.map(mapBeneficiaryFromApi);
        }
        const requests = [];
        if (itemReqs.status === 'fulfilled' && Array.isArray(itemReqs.value)) {
          requests.push(...itemReqs.value.map((r) => mapNgoItemRequestFromApi(r, email)));
        }
        if (fundReqs.status === 'fulfilled' && Array.isArray(fundReqs.value)) {
          requests.push(...fundReqs.value.map((r) => mapNgoFundRequestFromApi(r, email)));
        }
        result.ngoRequests = requests;
      })
    );
  }

  await Promise.allSettled(tasks);
  return result;
}

export { coreClient, notificationsClient };
