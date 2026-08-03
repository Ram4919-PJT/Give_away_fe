export const INITIAL_NGO_SETTINGS = {
  emailNotifications: true,
  donationRequestAlerts: true,
  beneficiaryUpdates: true,
  inventoryNotifications: true,
  weeklySummaryEmail: false,
  monthlyAnalyticsReport: true,
  language: 'en-IN',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  publicProfile: true,
  allowDonorContact: true,
  showContactDetails: false,
  showImpactStats: true
};

export const LANGUAGE_OPTIONS = [
  { id: 'en-IN', label: 'English (India)' },
  { id: 'hi-IN', label: 'Hindi' },
  { id: 'en-US', label: 'English (US)' }
];

export const TIMEZONE_OPTIONS = [
  { id: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
  { id: 'Asia/Dubai', label: 'GST (Asia/Dubai)' },
  { id: 'UTC', label: 'UTC' }
];

export const DATE_FORMAT_OPTIONS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
];

export const NOTIFICATION_TOGGLES = [
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive important updates through email.'
  },
  {
    key: 'donationRequestAlerts',
    title: 'Donation Request Alerts',
    description: 'Notify when new donation requests are available.'
  },
  {
    key: 'beneficiaryUpdates',
    title: 'Beneficiary Updates',
    description: 'Receive updates about beneficiary requests.'
  },
  {
    key: 'inventoryNotifications',
    title: 'Inventory Notifications',
    description: 'Notify when inventory becomes low or new stock is added.'
  },
  {
    key: 'weeklySummaryEmail',
    title: 'Weekly Summary Email',
    description: 'Receive a weekly summary of organization activity.'
  },
  {
    key: 'monthlyAnalyticsReport',
    title: 'Monthly Analytics Report',
    description: 'Receive monthly performance reports.'
  }
];

export const PRIVACY_TOGGLES = [
  {
    key: 'publicProfile',
    title: 'Display Organization Profile Publicly',
    description: 'Allow your organization profile to appear in public directories.'
  },
  {
    key: 'allowDonorContact',
    title: 'Allow Donors to Contact Organization',
    description: 'Let verified donors send messages to your organization.'
  },
  {
    key: 'showContactDetails',
    title: 'Show Contact Details',
    description: 'Display phone and email on your public profile.'
  },
  {
    key: 'showImpactStats',
    title: 'Display Organization Impact Statistics',
    description: 'Share aggregate impact metrics with donors and partners.'
  }
];
