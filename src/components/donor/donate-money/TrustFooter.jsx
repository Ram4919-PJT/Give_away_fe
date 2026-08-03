import { Lock, ShieldCheck } from 'lucide-react';

export default function TrustFooter() {
  return (
    <footer className="money-trust-footer">
      <div className="money-trust-badge">
        <Lock size={16} />
        <span>Secure Payment powered by AJA Abayahastham</span>
      </div>
      <p className="money-trust-message">
        100% of your donation goes toward helping beneficiaries.
      </p>
      <ul className="money-trust-list">
        <li><ShieldCheck size={14} /> Secure</li>
        <li><ShieldCheck size={14} /> Encrypted</li>
        <li><ShieldCheck size={14} /> Trusted</li>
      </ul>
    </footer>
  );
}
