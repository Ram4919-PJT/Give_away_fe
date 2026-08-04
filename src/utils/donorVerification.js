/**
 * Derive donor verification UI state from Core verification requests.
 * Returns a patch for currentUser or null if no donor requests exist.
 */
export function deriveDonorVerificationFromRequests(verifications = []) {
  return deriveRoleVerificationFromRequests(verifications, 'Donor');
}

export function deriveReceiverVerificationFromRequests(verifications = []) {
  return deriveRoleVerificationFromRequests(verifications, 'Receiver');
}

export function deriveRoleVerificationFromRequests(verifications = [], roleType) {
  const roleReqs = verifications.filter((v) => v.type === roleType);
  if (!roleReqs.length) return null;

  const latest = roleReqs[0];
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
