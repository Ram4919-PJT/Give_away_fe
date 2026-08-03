import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, Building2, ArrowRight, ChevronRight } from 'lucide-react';

const ROLES = [
  {
    key: 'donor',
    icon: Heart,
    title: 'I want to donate',
    desc: 'Give items or money and track your impact.',
    path: '/register/donor',
    loginPath: '/login?role=donor'
  },
  {
    key: 'receiver',
    icon: Users,
    title: 'I need support',
    desc: 'Apply for financial assistance when you need help.',
    path: '/register/receiver',
    loginPath: '/login?role=receiver'
  },
  {
    key: 'ngo',
    icon: Building2,
    title: 'I represent an NGO',
    desc: 'Partner with us to coordinate relief programs.',
    path: '/register/ngo',
    loginPath: '/login?role=ngo'
  }
];

export default function RegisterRolePage() {
  const navigate = useNavigate();

  return (
    <main className="page-view active-view page-route register-role-page" id="register-role-view">
      <div className="register-role-shell">
        <Link to="/" className="auth-back-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="register-role-card">
          <div className="register-role-header">
            <div className="register-role-logo" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="url(#regLogoGrad)" />
                <path d="M10 19c0-2.5 2-5 6-5s6 2.5 6 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="10" r="1.5" fill="#86EFAC" />
                <defs>
                  <linearGradient id="regLogoGrad" x1="4" y1="4" x2="28" y2="28">
                    <stop stopColor="#22C55E" />
                    <stop offset="1" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>Create Your Account</h1>
            <p>Choose how you want to use Give Away</p>
          </div>

          <div className="register-role-options" role="list">
            {ROLES.map(({ key, icon: Icon, title, desc, path }) => (
              <button
                key={key}
                type="button"
                className={`register-role-option register-role-option--${key}`}
                onClick={() => navigate(path)}
              >
                <span className="register-role-option-icon">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <span className="register-role-option-body">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </span>
                <ChevronRight className="register-role-option-arrow" size={20} strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="register-role-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-role-signin">
                Sign in <ArrowRight size={14} />
              </Link>
            </p>
            <div className="register-role-quick-links">
              {ROLES.map(({ key, loginPath }) => (
                <Link key={key} to={loginPath} className={`register-role-quick-link register-role-quick-link--${key}`}>
                  {key === 'ngo' ? 'NGO' : key.charAt(0).toUpperCase() + key.slice(1)} login
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
