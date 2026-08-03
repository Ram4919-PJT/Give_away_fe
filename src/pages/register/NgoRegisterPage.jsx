import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, ArrowLeft, CheckCircle2, Lock, Mail, Phone, MapPin, User, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import OtpBlock from '../../components/ui/OtpBlock';
import { persistNgoProfile } from '../../utils/ngoVerificationStore';

const UNLOCK_FEATURES = [
  'Request Donations',
  'Manage Beneficiaries',
  'Financial Assistance Requests',
  'Reports & Analytics',
  'Verified NGO Badge'
];

export default function NgoRegisterPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { showToast } = useToast();
  const [emailOk, setEmailOk] = useState(false);
  const [mobileOk, setMobileOk] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get('password');
    const confirm = fd.get('confirmPassword');
    const email = String(fd.get('email') || '').trim();

    if (password.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!emailOk || !mobileOk) {
      showToast('Verify email and mobile OTP first (use any 6 digits).', 'error');
      return;
    }
    if (!fd.get('terms')) {
      showToast('Please accept the Terms & Conditions.', 'error');
      return;
    }

    const user = {
      name: fd.get('orgName'),
      email,
      mobile: fd.get('mobile'),
      role: 'ngo',
      repName: fd.get('repName'),
      orgType: fd.get('orgType'),
      city: fd.get('city'),
      state: fd.get('state'),
      address: fd.get('address'),
      verified: false,
      verificationStatus: 'registered',
      status: 'Registered NGO',
      memberSince: new Date().toISOString().split('T')[0]
    };

    persistNgoProfile(email, {
      verified: false,
      verificationStatus: 'registered',
      status: 'Registered NGO',
      name: user.name,
      repName: user.repName,
      orgType: user.orgType,
      city: user.city,
      state: user.state
    });

    dispatch({ type: 'LOGIN', payload: user });
    showToast('NGO account created! Complete verification to unlock features.', 'success');
    navigate('/dashboard');
  };

  return (
    <main className="page-view active-view page-route" id="ngo-register-view">
      <div className="ngo-reg-shell">
        <Link to="/" className="ngo-reg-back">
          <ArrowLeft size={16} strokeWidth={2.25} />
          Back to Home
        </Link>

        <div className="ngo-reg-layout">
          <aside className="ngo-reg-aside" aria-label="NGO registration benefits">
            <div className="ngo-reg-aside__icon">
              <Building2 size={28} strokeWidth={1.75} />
            </div>
            <p className="ngo-reg-aside__eyebrow">NGO Partner Onboarding</p>
            <h2 className="ngo-reg-aside__title">Join as a verified NGO partner</h2>
            <p className="ngo-reg-aside__desc">
              Create your account in minutes. Upload documents later from your dashboard to unlock full platform features.
            </p>

            <div className="ngo-reg-aside__card">
              <h3>
                <Lock size={15} strokeWidth={2.25} />
                Features after verification
              </h3>
              <ul>
                {UNLOCK_FEATURES.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} strokeWidth={2.25} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="ngo-reg-aside__note">
              No documents required at signup. Verification keeps the platform trusted for donors and receivers.
            </p>
          </aside>

          <div className="ngo-reg-main">
            <div className="ngo-reg-card">
              <header className="ngo-reg-card__head">
                <span className="ngo-reg-step">Step 1 of 2 · Create Account</span>
                <h1>Create NGO Account</h1>
                <p>Organization details only — verification happens from your dashboard.</p>
              </header>

              <form className="ngo-reg-form" onSubmit={handleSubmit}>
                <section className="ngo-reg-section">
                  <h3 className="ngo-reg-section__title">
                    <Building2 size={16} strokeWidth={2.25} />
                    Organization
                  </h3>
                  <div className="ngo-reg-fields">
                    <div className="form-group">
                      <label htmlFor="ngo-org-name">Organization Name</label>
                      <input id="ngo-org-name" name="orgName" required placeholder="e.g. Asha Kiran Foundation" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ngo-org-type">Organization Type</label>
                      <select id="ngo-org-type" name="orgType" required defaultValue="">
                        <option value="" disabled>Select type</option>
                        <option>Registered Trust</option>
                        <option>Society</option>
                        <option>Section 8 Company</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ngo-rep-name">Authorized Representative</label>
                      <div className="ngo-reg-input-icon">
                        <User size={16} strokeWidth={2} />
                        <input id="ngo-rep-name" name="repName" required placeholder="Full name of representative" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="ngo-reg-section">
                  <h3 className="ngo-reg-section__title">
                    <Mail size={16} strokeWidth={2.25} />
                    Contact
                  </h3>
                  <div className="ngo-reg-fields">
                    <div className="form-group">
                      <label htmlFor="ngo-email">Organization Email</label>
                      <div className="ngo-reg-input-icon">
                        <Mail size={16} strokeWidth={2} />
                        <input id="ngo-email" name="email" type="email" required placeholder="org@example.org" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ngo-mobile">Mobile</label>
                      <div className="ngo-reg-input-icon">
                        <Phone size={16} strokeWidth={2} />
                        <input id="ngo-mobile" name="mobile" type="tel" required placeholder="+91 98765 43210" />
                      </div>
                    </div>
                    <div className="ngo-reg-row">
                      <div className="form-group">
                        <label htmlFor="ngo-city">City</label>
                        <input id="ngo-city" name="city" required placeholder="City" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ngo-state">State</label>
                        <input id="ngo-state" name="state" required placeholder="State" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ngo-address">Office Address</label>
                      <div className="ngo-reg-input-icon ngo-reg-input-icon--top">
                        <MapPin size={16} strokeWidth={2} />
                        <textarea id="ngo-address" name="address" rows={2} required placeholder="Street, area, landmark" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="ngo-reg-section">
                  <h3 className="ngo-reg-section__title">
                    <Shield size={16} strokeWidth={2.25} />
                    Security &amp; verification
                  </h3>
                  <div className="ngo-reg-fields">
                    <div className="ngo-reg-row">
                      <div className="form-group">
                        <label htmlFor="ngo-password">Password</label>
                        <input id="ngo-password" name="password" type="password" required placeholder="Min. 8 characters" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ngo-confirm">Confirm Password</label>
                        <input id="ngo-confirm" name="confirmPassword" type="password" required placeholder="Re-enter password" />
                      </div>
                    </div>

                    <p className="ngo-reg-otp-hint">Demo OTP: enter any 6 digits, then click Verify.</p>
                    <OtpBlock type="email" prefix="ngo" onVerified={setEmailOk} />
                    <OtpBlock type="mobile" prefix="ngo" onVerified={setMobileOk} />
                  </div>
                </section>

                <label className="ngo-terms-check">
                  <input type="checkbox" name="terms" />
                  <span>I accept the Terms &amp; Conditions and confirm organization details are accurate.</span>
                </label>

                <div className="ngo-reg-actions">
                  <Link to="/register" className="ngo-reg-btn ngo-reg-btn--ghost">Back</Link>
                  <button type="submit" className="ngo-reg-btn ngo-reg-btn--primary">
                    Create NGO Account
                  </button>
                </div>

                <p className="ngo-reg-signin">
                  Already registered?{' '}
                  <Link to="/login?role=ngo">Sign in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
