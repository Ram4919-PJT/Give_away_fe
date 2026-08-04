import * as coreClient from './coreClient';
import * as notificationsClient from './notificationsClient';
import {
  mapDonationFromApi,
  mapNotificationFromApi,
  mapVerificationFromApi,
  mapProgramFromApi,
  mapAssistanceRequestFromApi,
} from './mappers';

function notificationKeyForRole(role) {
  const map = {
    donor: 'notifications',
    receiver: 'receiverNotifications',
    ngo: 'ngoNotifications',
    'super-admin': 'adminNotifications',
  };
  return map[role] || 'notifications';
}

export async function fetchPlatformData(role) {
  const result = {
    donations: [],
    notifications: [],
    receiverNotifications: [],
    ngoNotifications: [],
    adminNotifications: [],
    verifications: [],
    programs: [],
    receiverApplications: [],
  };

  const tasks = [];

  if (role === 'donor' || role === 'super-admin') {
    tasks.push(
      coreClient.listDonations().then((rows) => {
        result.donations = rows.map(mapDonationFromApi);
      })
    );
  }

  tasks.push(
    notificationsClient.listNotifications().then((rows) => {
      const mapped = rows.map(mapNotificationFromApi);
      const key = notificationKeyForRole(role);
      result[key] = mapped;
      if (role === 'super-admin') result.adminNotifications = mapped;
    })
  );

  if (role === 'super-admin' || role === 'ngo' || role === 'donor' || role === 'receiver') {
    tasks.push(
      coreClient.listVerificationRequests().then((rows) => {
        result.verifications = rows.map(mapVerificationFromApi);
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

  if (role === 'receiver' || role === 'super-admin') {
    tasks.push(
      coreClient.listAssistanceRequests().then((rows) => {
        result.receiverApplications = rows.map(mapAssistanceRequestFromApi);
      })
    );
  }

  await Promise.allSettled(tasks);
  return result;
}

export { coreClient, notificationsClient };
