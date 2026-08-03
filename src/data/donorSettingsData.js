export const INITIAL_DONOR_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  donationUpdates: true,
  impactReports: true,
  marketingEmails: false,
  anonymousDonations: false,
  preferredCategories: ['Clothes', 'Food'],
  twoFactorEnabled: false,
  language: 'en-IN',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light'
};

export const DONOR_NOTIFICATION_TOGGLES = [
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive donation confirmations and important account updates.'
  },
  {
    key: 'smsNotifications',
    title: 'SMS Notifications',
    description: 'Receive reminders and important alerts.'
  },
  {
    key: 'donationUpdates',
    title: 'Donation Updates',
    description: 'Receive updates when your donated items are accepted, delivered, or completed.'
  },
  {
    key: 'impactReports',
    title: 'Impact Reports',
    description: 'Receive periodic reports showing the impact of your donations.'
  },
  {
    key: 'marketingEmails',
    title: 'Marketing & Newsletter Emails',
    description: 'Receive platform announcements and campaigns.'
  }
];

export const DONOR_CATEGORIES = [
  'Clothes',
  'Food',
  'Books',
  'Medical Supplies',
  'Financial Assistance',
  'Education',
  'Shelter'
];

export const DONOR_LANGUAGE_OPTIONS = [
  { id: 'en-IN', label: 'English (India)' },
  { id: 'hi-IN', label: 'Hindi' },
  { id: 'en-US', label: 'English (US)' }
];

export const DONOR_TIMEZONE_OPTIONS = [
  { id: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
  { id: 'Asia/Dubai', label: 'GST (Asia/Dubai)' },
  { id: 'UTC', label: 'UTC' }
];

export const DONOR_DATE_FORMAT_OPTIONS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
];
