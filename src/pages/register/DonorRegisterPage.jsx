import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import OtpBlock from '../../components/ui/OtpBlock';

export default function DonorRegisterPage() {
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
        role: 'donor',
        verified: false,
        memberSince: new Date().toISOString().split('T')[0]
      }
    });
    showToast('Donor account created!', 'success');
    navigate('/dashboard');
  };

  return (
    <main className="page-view active-view page-route">
      <div className="login-page donor-reg-page">
        <Link to="/" className="auth-back-home auth-back-home--centered">← Back to Home</Link>
        <div className="login-card donor-reg-card">
          <div className="login-card-header">
            <h1 className="login-title">Create Donor Account</h1>
            <p className="login-subtitle">Join AJA Abayahastham — verify email &amp; mobile, then start giving.</p>
          </div>
          <form className="login-form donor-reg-form donor-reg-modern" onSubmit={handleSubmit}>
            <span className="donor-reg-step-badge">Step 1 — Create Account</span>
            <div className="form-group"><label>Full Name</label><input name="fullName" required placeholder="Your full name" /></div>
            <div className="form-group"><label>Email</label><input name="email" type="email" required placeholder="you@example.com" /></div>
            <div className="form-group"><label>Mobile</label><input name="mobile" type="tel" required placeholder="+91 98765 43210" /></div>
            <div className="form-row">
              <div className="form-group"><label>Password</label><input name="password" type="password" required placeholder="Min. 8 characters" /></div>
              <div className="form-group"><label>Confirm Password</label><input name="confirmPassword" type="password" required /></div>
            </div>
            <OtpBlock type="email" prefix="donor" onVerified={setEmailOk} />
            <OtpBlock type="mobile" prefix="donor" onVerified={setMobileOk} />
            <label className="donor-terms-check" style={{ margin: '1rem 0' }}>
              <input type="checkbox" name="terms" /> <span>I accept the Terms &amp; Conditions</span>
            </label>
            <div className="ngo-reg-actions donor-reg-actions">
              <Link to="/register" className="btn-outline">Back</Link>
              <button type="submit" className="login-submit">Create Donor Account</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
