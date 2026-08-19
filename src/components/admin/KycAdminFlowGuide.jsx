export default function KycAdminFlowGuide() {
  return (
    <div className="kyc-admin-flow" role="note">
      <h2>Receiver journey on the platform</h2>
      <ol className="kyc-admin-flow__steps">
        <li><span>Register & login</span></li>
        <li className="kyc-admin-flow__steps--current"><span>Receiver KYC (you review here)</span></li>
        <li><span>KYC approved → assistance requests unlocked</span></li>
        <li><span>Receiver creates assistance request + uploads evidence</span></li>
        <li><span>Admin reviews request → approve / reject / more documents</span></li>
        <li><span>Payment verification → disbursement</span></li>
      </ol>
      <p className="kyc-admin-flow__hint">
        Approving KYC here only verifies identity and bank details. Assistance requests are reviewed separately after KYC approval.
      </p>
    </div>
  );
}
