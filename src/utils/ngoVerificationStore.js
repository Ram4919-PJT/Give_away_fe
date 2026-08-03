/** Shared mock persistence + helpers for the NGO verification workflow */

export const VERIFICATIONS_STORAGE_KEY = 'giveaway-verifications';
export const NGO_PROFILES_STORAGE_KEY = 'giveaway-ngo-profiles';

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return fallback;
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadVerifications(defaultVerifications) {
  return readJson(VERIFICATIONS_STORAGE_KEY, defaultVerifications);
}

export function persistVerifications(verifications) {
  writeJson(VERIFICATIONS_STORAGE_KEY, verifications);
}

export function loadNgoProfiles() {
  return readJson(NGO_PROFILES_STORAGE_KEY, {});
}

export function persistNgoProfile(email, patch) {
  const key = (email || '').toLowerCase();
  if (!key) return;
  const profiles = loadNgoProfiles();
  profiles[key] = { ...(profiles[key] || {}), ...patch, email: key };
  writeJson(NGO_PROFILES_STORAGE_KEY, profiles);
}

export function getLatestNgoVerification(email, verifications = []) {
  const normalized = (email || '').toLowerCase();
  return verifications
    .filter((v) => v.type === 'NGO' && (v.email || '').toLowerCase() === normalized)
    .sort((a, b) => new Date(b.submitted || 0).getTime() - new Date(a.submitted || 0).getTime())[0];
}

export function deriveNgoUserFields(email, verifications = [], savedProfile = {}) {
  const latest = getLatestNgoVerification(email, verifications);

  if (savedProfile.verified === true || latest?.status === 'Verified') {
    return {
      verified: true,
      verificationStatus: 'approved',
      status: 'Verified NGO',
      rejectionReason: undefined,
      verifiedAt: latest?.reviewedAt || savedProfile.verifiedAt
    };
  }

  if (latest?.status === 'Rejected' || savedProfile.verificationStatus === 'rejected') {
    return {
      verified: 'rejected',
      verificationStatus: 'rejected',
      status: 'Verification Rejected',
      rejectionReason: latest?.rejectionReason || savedProfile.rejectionReason || 'Documents could not be verified. Please resubmit.'
    };
  }

  if (latest?.status === 'Pending' || latest?.status === 'Under Review' || savedProfile.verificationStatus === 'submitted') {
    return {
      verified: 'pending',
      verificationStatus: 'submitted',
      status: 'Registered NGO',
      rejectionReason: undefined
    };
  }

  return {
    verified: false,
    verificationStatus: 'registered',
    status: 'Registered NGO',
    rejectionReason: undefined
  };
}

/** Progress steps: 0 Registered → 1 Documents → 2 Under Review → 3 Verified */
export function getNgoVerificationProgress(user) {
  if (!user) return { step: 0, label: 'Registered', steps: ['Registered', 'Documents Submitted', 'Under Review', 'Verified'] };

  const status =
    user.verified === true || user.verificationStatus === 'approved'
      ? 'verified'
      : user.verificationStatus === 'submitted' || user.verified === 'pending'
        ? 'pending'
        : user.verificationStatus === 'rejected' || user.verified === 'rejected'
          ? 'rejected'
          : 'registered';

  const steps = ['Registered', 'Documents Submitted', 'Under Review', 'Verified'];
  const map = { registered: 0, pending: 2, verified: 3, rejected: 1 };
  return { step: map[status] ?? 0, label: steps[map[status] ?? 0], steps, status };
}

export function ngoEmailMatches(ngo, email) {
  const normalized = (email || '').toLowerCase();
  return (
    (ngo.contact?.email || '').toLowerCase() === normalized
    || (ngo.email || '').toLowerCase() === normalized
    || (ngo.loginEmail || '').toLowerCase() === normalized
  );
}
