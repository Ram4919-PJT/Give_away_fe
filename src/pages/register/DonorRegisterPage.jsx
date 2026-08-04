import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { getDashboardPathForRole } from '../../utils/roleMap';

export default function DonorRegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get('password');
    const confirm = fd.get('confirmPassword');
    if (password.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!fd.get('terms')) {
      showToast('Accept Terms & Conditions.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        role: 'donor',
        full_name: String(fd.get('fullName') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        mobile: String(fd.get('mobile') || ''),
        password
      });
      showToast('Donor account created!', 'success');
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-view active-view page-route">
      <div className="login-page donor-reg-page">
        <Link to="/" className="auth-back-home auth-back-home--centered">← Back to Home</Link>
        <div className="login-card donor-reg-card">
          <div className="login-card-header">
            <h1 className="login-title">Create Donor Account</h1>
            <p className="login-subtitle">Join AJA Abayahastham and start giving.</p>
          </div>
          <form className="login-form donor-reg-form donor-reg-modern" onSubmit={handleSubmit}>
            <span className="donor-reg-step-badge">Create Account</span>
            <div className="form-group"><label>Full Name</label><input name="fullName" required placeholder="Your full name" /></div>
            <div className="form-group"><label>Email</label><input name="email" type="email" required placeholder="you@example.com" /></div>
            <div className="form-group"><label>Mobile</label><input name="mobile" type="tel" required placeholder="9876543210" /></div>
            <div className="form-row">
              <div className="form-group"><label>Password</label><input name="password" type="password" required placeholder="Min. 8 characters" /></div>
              <div className="form-group"><label>Confirm Password</label><input name="confirmPassword" type="password" required /></div>
            </div>
            <label className="donor-terms-check" style={{ margin: '1rem 0' }}>
              <input type="checkbox" name="terms" /> <span>I accept the Terms &amp; Conditions</span>
            </label>
            <div className="ngo-reg-actions donor-reg-actions">
              <Link to="/register" className="btn-outline">Back</Link>
              <button type="submit" className="login-submit" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Create Donor Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
