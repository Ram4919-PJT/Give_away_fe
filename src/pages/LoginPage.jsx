import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { getDashboardPathForRole } from '../utils/roleMap';

function BrandLogo() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
      <circle cx="28" cy="28" r="27" fill="url(#brandGrad)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <path d="M16 33c0-5 5-10 12-10s12 5 12 10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M28 16v5" stroke="#86EFAC" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="28" cy="13" r="3" fill="#16A34A" />
      <defs>
        <linearGradient id="brandGrad" x1="8" y1="8" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, logout, currentUser, authLoading } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(getDashboardPathForRole(currentUser.role), { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Enter email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      showToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="page-view active-view page-route auth-loading-screen">
        <p>Loading session…</p>
      </main>
    );
  }

  return (
    <main className="page-view active-view page-route" id="login-view">
      <div className="auth-unified-page">
        <Link to="/" className="auth-back-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="auth-bg-decor" aria-hidden="true">
          <div className="auth-bg-blob auth-bg-blob--1" />
          <div className="auth-bg-blob auth-bg-blob--2" />
          <div className="auth-bg-grid" />
        </div>

        <div className="auth-layout">
          <aside className="auth-hero-panel" aria-label="About Aja Abayahastham">
            <div className="auth-hero-inner">
              <div className="auth-brand-logo auth-brand-logo--hero">
                <BrandLogo />
              </div>
              <p className="auth-hero-eyebrow">Non-Profit Relief Network</p>
              <h2 className="auth-hero-title">Aja Abayahastham</h2>
              <p className="auth-hero-tagline">Trust &amp; Transparency in Every Gift</p>
              <p className="auth-hero-desc">
                One secure portal connecting generous donors, verified NGOs, and communities in need — with full accountability at every step.
              </p>
              <ul className="auth-trust-list">
                <li><span className="auth-trust-icon">✓</span> End-to-end donation tracking</li>
                <li><span className="auth-trust-icon">✓</span> Verified NGO &amp; receiver onboarding</li>
                <li><span className="auth-trust-icon">✓</span> Secure IAM authentication</li>
              </ul>
            </div>
          </aside>

          <div className="auth-main-column">
            <div className="auth-unified-card login-card auth-card--donor">
              <div className="auth-card-accent auth-accent-donor" aria-hidden="true" />

              <div className="login-card-header auth-card-header">
                <h1 className="login-title">Sign in to your account</h1>
                <p className="login-subtitle">
                  Use the email and password registered with the platform. Your role is determined automatically after login.
                </p>
              </div>

              <form className="login-form auth-login-form" onSubmit={handleSubmit}>
                <div className="auth-form-fields">
                  <div className="form-group">
                    <label htmlFor="auth-email">Email address</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon"><Mail size={18} strokeWidth={2} /></span>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="username"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="auth-password">Password</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon"><Lock size={18} strokeWidth={2} /></span>
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="login-submit auth-submit-btn auth-btn-donor" disabled={submitting}>
                  <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
                  <ArrowRight className="auth-submit-arrow" size={18} strokeWidth={2.5} aria-hidden="true" />
                </button>

                <p className="auth-admin-notice">
                  <AlertTriangle size={16} />
                  All access attempts are tracked and audited.
                </p>

                <nav className="auth-footer-links" aria-label="Login help links">
                  <button
                    type="button"
                    className="auth-footer-link"
                    onClick={() => showToast('Password reset will be available soon.', 'info')}
                  >
                    Forgot Password?
                  </button>
                  <Link to="/register" className="auth-footer-link">
                    Create an account
                  </Link>
                </nav>
              </form>

              {currentUser && (
                <div className="login-demo-access">
                  <p className="login-demo-access__hint">
                    Already signed in as {currentUser.email}.
                  </p>
                  <button
                    type="button"
                    className="login-demo-trigger"
                    onClick={async () => {
                      await logout();
                      showToast('Signed out.', 'info');
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
