export const INITIAL_RECEIVER_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  donationRequestUpdates: true,
  pickupDeliveryNotifications: true,
  ngoMessages: true,
  reminderNotifications: true,
  preferredContactMethod: 'phone',
  alternativeSuggestions: true,
  allowNgoRecommendations: true,
  autoSaveDrafts: true,
  defaultRequestCategory: 'Food',
  showContactToNgos: true,
  showAddressAfterApproval: true,
  allowNgoDirectContact: true,
  hideFromPublicSearch: true,
  shareProgressWithFamily: false,
  language: 'en-IN',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  twoFactorEnabled: false
};

export const RECEIVER_NOTIFICATION_TOGGLES = [
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive updates about requests.'
  },
  {
    key: 'smsNotifications',
    title: 'SMS Notifications',
    description: 'Receive important reminders.'
  },
  {
    key: 'donationRequestUpdates',
    title: 'Donation Request Updates',
    description: 'Notify when a donor or NGO accepts or updates your request.'
  },
  {
    key: 'pickupDeliveryNotifications',
    title: 'Pickup / Delivery Notifications',
    description: 'Receive reminders for scheduled deliveries or pickups.'
  },
  {
    key: 'ngoMessages',
    title: 'NGO Messages',
    description: 'Notify when NGOs send messages regarding your requests.'
  },
  {
    key: 'reminderNotifications',
    title: 'Reminder Notifications',
    description: 'Receive reminders for upcoming request deadlines.'
  }
];

export const RECEIVER_PRIVACY_TOGGLES = [
  {
    key: 'showContactToNgos',
    title: 'Show Contact Number to Verified NGOs',
    description: 'Allow verified NGOs to see your phone number for coordination.'
  },
  {
    key: 'showAddressAfterApproval',
    title: 'Show Address Only After Request Approval',
    description: 'Keep your address private until a request is approved.'
  },
  {
    key: 'allowNgoDirectContact',
    title: 'Allow NGOs to Contact Me Directly',
    description: 'Let verified NGOs reach out about active requests.'
  },
  {
    key: 'hideFromPublicSearch',
    title: 'Hide Profile from Public Search',
    description: 'Prevent your receiver profile from appearing in public search.'
  },
  {
    key: 'shareProgressWithFamily',
    title: 'Share Request Progress with Family',
    description: 'Future-ready option to share status updates with family members.'
  }
];

export const RECEIVER_CONTACT_OPTIONS = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' }
];

export const RECEIVER_CATEGORY_OPTIONS = [
  { id: 'Clothes', label: 'Clothes' },
  { id: 'Food', label: 'Food' },
  { id: 'Medical', label: 'Medical' },
  { id: 'Education', label: 'Education' },
  { id: 'Financial Assistance', label: 'Financial Assistance' }
];

export const RECEIVER_LANGUAGE_OPTIONS = [
  { id: 'en-IN', label: 'English (India)' },
  { id: 'hi-IN', label: 'Hindi' },
  { id: 'en-US', label: 'English (US)' }
];

export const RECEIVER_TIMEZONE_OPTIONS = [
  { id: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
  { id: 'Asia/Dubai', label: 'GST (Asia/Dubai)' },
  { id: 'UTC', label: 'UTC' }
];

export const RECEIVER_DATE_FORMAT_OPTIONS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
];
