import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import OtpBlock from '../../components/ui/OtpBlock';

export default function ReceiverRegisterPage() {
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
    if (password.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    if (password !== confirm) { showToast('Passwords do not match.', 'error'); return; }
    if (!emailOk || !mobileOk) { showToast('Verify email and mobile OTP.', 'error'); return; }
    if (!fd.get('terms')) { showToast('Accept Terms & Conditions.', 'error'); return; }

    dispatch({
      type: 'LOGIN',
      payload: {
        name: fd.get('fullName'),
        email: fd.get('email'),
        mobile: fd.get('mobile'),
        role: 'receiver',
        city: fd.get('city'),
        state: fd.get('state'),
        address: fd.get('address') || '',
        dob: fd.get('dob'),
        gender: fd.get('gender'),
        verified: false,
        status: 'Registered Receiver',
        memberSince: new Date().toISOString().split('T')[0]
      }
    });
    showToast('Receiver account created! Welcome to Give Away.', 'success');
    navigate('/dashboard');
  };

  return (
    <main className="page-view active-view page-route">
      <div className="login-page receiver-reg-page">
        <Link to="/" className="auth-back-home auth-back-home--centered">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
        <div className="login-card receiver-reg-card">
          <div className="login-card-header">
            <div className="login-mark" aria-hidden="true" />
            <h1 className="login-title">Create Receiver Account</h1>
            <p className="login-subtitle">
              Quick signup — no documents needed now. Apply for financial assistance from AJA Abayahastham after registration.
            </p>
          </div>

          <div className="reg-role-summary">
            <span className="reg-role-summary-label">Registering as</span>
            <span className="badge badge-warning">Receiver</span>
            <Link to="/register" className="btn-text btn-sm reg-role-change">Change role</Link>
          </div>

          <div className="receiver-reg-trust">
            <span>✓ No documents at signup</span>
            <span>✓ AJA-reviewed applications</span>
            <span>✓ Dignified support process</span>
          </div>

          <form className="login-form receiver-reg-form receiver-reg-modern" onSubmit={handleSubmit}>
            <span className="receiver-reg-step-badge">Step 1 — Create Account</span>

            <div className="form-group">
              <label htmlFor="receiver-full-name">Full Name</label>
              <input id="receiver-full-name" name="fullName" placeholder="Enter your full name" autoComplete="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="receiver-email">Email Address</label>
              <input id="receiver-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="receiver-mobile">Mobile Number</label>
              <input id="receiver-mobile" name="mobile" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="receiver-password">Password</label>
                <input id="receiver-password" name="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" required />
              </div>
              <div className="form-group">
                <label htmlFor="receiver-confirm-password">Confirm Password</label>
                <input id="receiver-confirm-password" name="confirmPassword" type="password" placeholder="Re-enter password" autoComplete="new-password" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="receiver-dob">Date of Birth</label>
                <input id="receiver-dob" name="dob" type="date" required />
              </div>
              <div className="form-group">
                <label htmlFor="receiver-gender">Gender</label>
                <select id="receiver-gender" name="gender" required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="receiver-city">City</label>
                <input id="receiver-city" name="city" placeholder="City" required />
              </div>
              <div className="form-group">
                <label htmlFor="receiver-state">State</label>
                <input id="receiver-state" name="state" placeholder="State" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="receiver-address">Address <span className="label-optional">(Optional)</span></label>
              <textarea id="receiver-address" name="address" rows={2} placeholder="Street address, landmark" />
            </div>

            <OtpBlock type="email" prefix="receiver" onVerified={setEmailOk} />
            <OtpBlock type="mobile" prefix="receiver" onVerified={setMobileOk} />

            <label className="receiver-terms-check">
              <input type="checkbox" name="terms" />
              <span>I accept the <a href="#" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a> of AJA Abayahastham</span>
            </label>

            <div className="ngo-reg-actions receiver-reg-actions">
              <Link to="/register" className="btn-outline">Back</Link>
              <button type="submit" className="login-submit">Create Receiver Account</button>
            </div>
          </form>

          <p className="login-footer-text">
            Already have an account? <Link to="/login?role=receiver" className="auth-switch-link">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
