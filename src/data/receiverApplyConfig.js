/** Financial assistance request flow configuration */

import { buildCategoriesFromConfig } from './assistanceCategoryUi';

export const APPLY_FLOW_STEPS = [
  { id: 1, label: 'Purpose' },
  { id: 2, label: 'Amount & Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Submit' },
];

/**
 * Static fallback — prefer useReceiverAssistanceConfig() for live API data.
 */
export const PURPOSE_CATEGORIES = buildCategoriesFromConfig(null);

export const APPLY_FLOW_HIGHLIGHTS = [
  { step: '01', title: 'State your purpose', desc: 'Choose a category and explain exactly what funds are needed for.' },
  { step: '02', title: 'Add amount details', desc: 'Provide a clear breakdown so reviewers can verify your request.' },
  { step: '03', title: 'Upload documents', desc: 'Attach bills, receipts, or proof relevant to your category.' },
  { step: '04', title: 'Admin review & payout', desc: 'After approval, add bank details in My Requests to receive funds.' },
];

export const MAX_PURPOSE_LENGTH = 2000;
export const MIN_PURPOSE_LENGTH = 20;

export const VAGUE_PURPOSE_PATTERNS = [
  /^i need money$/i,
  /^financial help$/i,
  /^please help me$/i,
  /^help me$/i,
  /^need help$/i,
  /^financial assistance$/i,
];

export const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_DOC_BYTES = 5 * 1024 * 1024;

/** @deprecated use canonical category document requirements from API */
export const APPLY_UPLOAD_SLOTS = [
  { key: 'primary', label: 'Primary Supporting Document', requiredFor: [] },
  { key: 'secondary', label: 'Additional Document', requiredFor: [] },
  { key: 'optional', label: 'Other Supporting Evidence', requiredFor: [] },
];

/** @deprecated */
export const CATEGORY_DOCUMENT_HINTS = {};

/** @deprecated */
export const APPLY_ASSISTANCE_CATEGORIES = PURPOSE_CATEGORIES;

export const APPLY_UPLOAD_PLACEHOLDERS = [
  { label: 'Supporting Document', hint: 'PDF, JPG, PNG up to 5MB' },
];

export const ALLOWED_UPLOAD_HINT = 'PDF, JPG, JPEG, PNG — max 5 MB';
