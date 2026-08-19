/**
 * Derive donor verification UI state from Core verification requests.
 * Returns a patch for currentUser or null if no donor requests exist.
 */
export function deriveDonorVerificationFromRequests(verifications = [], userId = null) {
  return deriveRoleVerificationFromRequests(verifications, 'Donor', userId);
}

export function deriveReceiverVerificationFromRequests(verifications = [], userId = null) {
  return deriveRoleVerificationFromRequests(verifications, 'Receiver', userId);
}

export function deriveReceiverVerificationFromProfile(profile) {
  return deriveProfileVerificationStatus(profile);
}

export function deriveNgoVerificationFromRequests(verifications = [], userId = null) {
  return deriveRoleVerificationFromRequests(verifications, 'NGO', userId);
}

export function deriveNgoVerificationFromProfile(profile) {
  return deriveProfileVerificationStatus(profile);
}

export function deriveProfileVerificationStatus(profile) {
  if (!profile) return null;
  const status = String(profile.verification_status || '').toUpperCase();
  if (status === 'VERIFIED' || status === 'APPROVED') {
    return { verified: true, verificationStatus: 'approved', rejectionReason: undefined };
  }
  if (status === 'SUSPENDED') {
    return {
      verified: 'suspended',
      verificationStatus: 'suspended',
      rejectionReason: 'Your NGO account has been suspended.',
    };
  }
  if (status === 'REJECTED') {
    return {
      verified: 'rejected',
      verificationStatus: 'rejected',
      rejectionReason: 'Verification was rejected. Please resubmit documents.',
    };
  }
  if (['DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'SUBMITTED', 'PENDING'].includes(status)) {
    return { verified: 'pending', verificationStatus: 'under_review', rejectionReason: undefined };
  }
  return null;
}

export function deriveProfileVerificationFromStatus(profileStatus, request = null) {
  const patch = deriveProfileVerificationStatus({ verification_status: profileStatus });
  if (!patch) return null;
  const reason = request?.rejection_reasons?.[0];
  if (reason && patch.verified === 'rejected') {
    return { ...patch, rejectionReason: reason };
  }
  if (request?.reference_code) {
    return { ...patch, verificationReference: request.reference_code };
  }
  return patch;
}

export function mergeVerificationPatches(...patches) {
  const valid = patches.filter(Boolean);
  if (!valid.length) return null;
  const verified = valid.find((p) => p.verified === true);
  if (verified) return verified;
  return valid[0];
}

export function deriveRoleVerificationFromRequests(verifications = [], roleType, userId = null) {
  let roleReqs = verifications.filter((v) => v.type === roleType);
  if (userId != null) {
    roleReqs = roleReqs.filter((v) => {
      const vid = v.user_id ?? v.entity_id;
      return Number(vid) === Number(userId);
    });
  }
  if (!roleReqs.length) return null;

  const latest = [...roleReqs].sort((a, b) => {
    const aTime = new Date(a.submitted || a.created_at || 0).getTime();
    const bTime = new Date(b.submitted || b.created_at || 0).getTime();
    return bTime - aTime;
  })[0];
  const status = latest.status;

  if (status === 'Verified') {
    return { verified: true, verificationStatus: 'approved', rejectionReason: undefined };
  }
  if (status === 'Rejected') {
    return {
      verified: 'rejected',
      verificationStatus: 'rejected',
      rejectionReason: latest.notes || 'Documents could not be verified. Please resubmit.',
    };
  }
  if (status === 'Pending' || status === 'Under Review') {
    return { verified: 'pending', verificationStatus: 'submitted', rejectionReason: undefined };
  }
  return null;
}

export function buildDonorVerificationNotes(documents) {
  const uploaded = Object.entries(documents || {})
    .filter(([, v]) => v)
    .map(([name]) => name);
  return uploaded.length ? `Documents submitted: ${uploaded.join(', ')}` : 'Donor verification request';
}

export function buildNgoVerificationNotes(documents) {
  const uploaded = Object.entries(documents || {})
    .filter(([, v]) => v)
    .map(([name]) => name);
  return uploaded.length ? `NGO documents submitted: ${uploaded.join(', ')}` : 'NGO verification request';
}
