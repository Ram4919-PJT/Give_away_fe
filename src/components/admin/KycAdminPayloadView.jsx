const SECTION_LABELS = {
  personal: 'Personal information',
  mobile: 'Mobile',
  mobile_verification: 'Mobile verification',
  identity: 'Identity document',
  address: 'Address',
  beneficiary: 'Beneficiary',
  assistance: 'Verification purpose',
  bank: 'Bank details',
  payment_destination: 'Payment destination',
};

const FIELD_LABELS = {
  first_name: 'First name',
  last_name: 'Last name',
  full_name: 'Full legal name',
  dob: 'Date of birth',
  gender: 'Gender',
  email: 'Email',
  mobile: 'Mobile number',
  verified_at: 'Verified at',
  id_type: 'Document type',
  id_number: 'Document number',
  address_line: 'Address',
  city: 'City',
  state: 'State',
  pincode: 'Postal code',
  relationship: 'Beneficiary relationship',
  category: 'Purpose category',
  explanation: 'Explanation',
  account_holder_name: 'Account holder',
  bank_name: 'Bank name',
  account_number: 'Account number',
  ifsc: 'IFSC',
  account_type: 'Account type',
  type: 'Destination type',
  institution_name: 'Institution / vendor name',
};

function formatValue(key, value) {
  if (value == null || value === '') return '—';
  if (key === 'verified_at' && typeof value === 'string') {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }
  if (key === 'dob') return value;
  if (key.includes('account_number') || key === 'id_number') {
    const s = String(value);
    return s.length > 4 ? `••••${s.slice(-4)}` : '••••';
  }
  if (key === 'mobile') {
    const digits = String(value).replace(/\D/g, '').slice(-10);
    return digits ? `+91 ${digits}` : value;
  }
  return String(value);
}

function PayloadSection({ title, data }) {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;
  return (
    <div className="kyc-admin-payload__section">
      <h4>{title}</h4>
      <dl className="kyc-admin-payload__grid">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="kyc-admin-payload__row">
            <dt>{FIELD_LABELS[key] || key.replace(/_/g, ' ')}</dt>
            <dd>{formatValue(key, value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function KycAdminPayloadView({ payload, requestType }) {
  if (!payload || typeof payload !== 'object') {
    return <p className="kyc-admin__empty">No submitted data yet.</p>;
  }

  const sections = Object.entries(payload).filter(
    ([key, val]) => typeof val === 'object' && val && !Array.isArray(val) && SECTION_LABELS[key],
  );

  if (!sections.length) {
    return (
      <pre className="kyc-admin__json">{JSON.stringify(payload, null, 2)}</pre>
    );
  }

  return (
    <div className="kyc-admin-payload">
      {requestType && (
        <p className="kyc-admin-payload__type">
          Application type: <strong>{requestType}</strong>
        </p>
      )}
      {sections.map(([key, data]) => (
        <PayloadSection key={key} title={SECTION_LABELS[key]} data={data} />
      ))}
    </div>
  );
}
