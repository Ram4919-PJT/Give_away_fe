function line(label, value) {
  if (!value) return null;
  return (
    <div className="kyc-admin-applicant__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function KycAdminApplicantCard({ applicant, payload, requestType }) {
  const personal = payload?.personal || {};
  const mobile = payload?.mobile?.mobile || payload?.mobile_verification?.mobile || applicant?.mobile;
  const name = [
    personal.first_name,
    personal.last_name,
  ].filter(Boolean).join(' ').trim() || personal.full_name || applicant?.name;

  const mobileDisplay = mobile
    ? `+91 ${String(mobile).replace(/\D/g, '').slice(-10)}`
    : null;

  return (
    <div className="kyc-admin-applicant">
      <div className="kyc-admin-applicant__head">
        <div>
          <strong>{name || 'Applicant'}</strong>
          <span>{requestType} verification</span>
        </div>
      </div>
      <dl className="kyc-admin-applicant__grid">
        {line('Email', personal.email || applicant?.email)}
        {line('Mobile', mobileDisplay)}
        {line('Date of birth', personal.dob)}
        {line('Gender', personal.gender?.replace(/_/g, ' '))}
        {applicant?.registration_number && line('Registration', applicant.registration_number)}
        {applicant?.contact_person && line('Contact person', applicant.contact_person)}
      </dl>
    </div>
  );
}
