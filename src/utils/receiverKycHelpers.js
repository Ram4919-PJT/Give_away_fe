/** Receiver KYC progress helpers — shared between dashboard and wizard. */

export const RECEIVER_PROGRESS_STEPS = [
  { id: 'CONTACT', label: 'Contact' },
  { id: 'IDENTITY', label: 'Identity' },
  { id: 'ADDRESS', label: 'Address' },
  { id: 'BENEFICIARY', label: 'Beneficiary' },
  { id: 'SUPPORTING_DOCUMENTS', label: 'Supporting Documents' },
  { id: 'BANK', label: 'Bank' },
  { id: 'ADMIN_REVIEW', label: 'Admin Review' },
];

export function buildProgressFromEligibility(eligibility) {
  const progress = eligibility?.progress;
  if (!progress) {
    return { percent: 0, completed: [], pending: RECEIVER_PROGRESS_STEPS.map((s) => s.id), labels: {} };
  }
  return {
    percent: progress.percent ?? 0,
    completed: progress.completed ?? [],
    pending: progress.pending ?? [],
    labels: progress.labels ?? Object.fromEntries(RECEIVER_PROGRESS_STEPS.map((s) => [s.id, s.label])),
    steps: progress.steps ?? {},
  };
}

export function formatStepLabel(stepId, labels = {}) {
  return labels[stepId] || stepId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function hasActionRequired(eligibility) {
  const status = String(eligibility?.request_status || eligibility?.profile_status || '').toUpperCase();
  return status === 'MORE_DOCUMENTS_REQUIRED' || (eligibility?.reasons || []).some((r) =>
    /additional documents/i.test(r)
  );
}
