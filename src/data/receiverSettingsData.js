export const INITIAL_RECEIVER_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  assistanceUpdates: true,
  approvalAlerts: true,
  disbursementAlerts: true,
  reminderNotifications: true,
  preferredContactMethod: 'phone',
  defaultRequestCategory: 'MEDICAL_HEALTHCARE',
  autoSaveDrafts: true,
  showContactToAdmin: true,
  showAddressAfterApproval: true,
  hideFromPublicSearch: true,
  language: 'en-IN',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
};

export const RECEIVER_NOTIFICATION_TOGGLES = [
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive assistance updates and account alerts by email.',
  },
  {
    key: 'smsNotifications',
    title: 'SMS Notifications',
    description: 'Get important reminders and status alerts on your phone.',
  },
  {
    key: 'assistanceUpdates',
    title: 'Assistance Request Updates',
    description: 'Notify when your financial assistance request status changes.',
  },
  {
    key: 'approvalAlerts',
    title: 'Approval Alerts',
    description: 'Get notified when an admin approves or reviews your request.',
  },
  {
    key: 'disbursementAlerts',
    title: 'Disbursement Alerts',
    description: 'Alerts when funds are approved and bank details are required.',
  },
  {
    key: 'reminderNotifications',
    title: 'Reminder Notifications',
    description: 'Reminders for pending actions such as verification or bank details.',
  },
];

export const RECEIVER_PRIVACY_TOGGLES = [
  {
    key: 'showContactToAdmin',
    title: 'Share Contact with Admin Team',
    description: 'Allow AJA Abayahastham reviewers to contact you about your requests.',
  },
  {
    key: 'showAddressAfterApproval',
    title: 'Share Address Only After Approval',
    description: 'Keep your address private until a request is approved.',
  },
  {
    key: 'hideFromPublicSearch',
    title: 'Hide Profile from Public Search',
    description: 'Prevent your receiver profile from appearing in public listings.',
  },
];

export const RECEIVER_CONTACT_OPTIONS = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];

export const RECEIVER_CATEGORY_OPTIONS = [
  { id: 'MEDICAL_HEALTHCARE', label: 'Medical & Healthcare' },
  { id: 'EDUCATION', label: 'Education' },
  { id: 'FOOD_BASIC_NEEDS', label: 'Food & Basic Needs' },
  { id: 'HOUSING_SHELTER', label: 'Housing & Shelter' },
  { id: 'EMERGENCY', label: 'Emergency' },
  { id: 'DISABILITY_SUPPORT', label: 'Disability Support' },
  { id: 'FAMILY_SUPPORT', label: 'Family Support' },
  { id: 'DISASTER_RELIEF', label: 'Disaster Relief' },
  { id: 'OTHER', label: 'Other' },
];

export const RECEIVER_LANGUAGE_OPTIONS = [
  { id: 'en-IN', label: 'English (India)' },
  { id: 'hi-IN', label: 'Hindi' },
  { id: 'en-US', label: 'English (US)' },
];

export const RECEIVER_TIMEZONE_OPTIONS = [
  { id: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
  { id: 'Asia/Dubai', label: 'GST (Asia/Dubai)' },
  { id: 'UTC', label: 'UTC' },
];

export const RECEIVER_DATE_FORMAT_OPTIONS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];
