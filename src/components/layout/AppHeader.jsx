import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp, getRoleDisplayName } from '../../context/AppContext';
import { useState } from 'react';
import RoleAuthModal from '../ui/RoleAuthModal';
import { ROLE_AUTH_CONFIG } from '../../data/constants';
import { useLogoutAction } from '../../hooks/useLogoutAction';

export default function AppHeader() {
  const { currentUser, setTab, logoutLoading } = useApp();
  const { requestLogout, LogoutDialog } = useLogoutAction({ redirectTo: '/' });
  const navigate = useNavigate();
  const location = useLocation();
  const [roleModal, setRoleModal] = useState(null);

  const isAuthPage = ['/login', '/register', '/register/donor', '/register/receiver', '/register/ngo'].some((p) =>
    location.pathname.startsWith(p)
  );
  const showPublicNav = !currentUser && (location.pathname === '/' || isAuthPage);

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('giveaway-theme', next);
  };

  const openRole = (key) => {
    if (currentUser) {
      const config = ROLE_AUTH_CONFIG[key];
      if (currentUser.role === config.requiredRole) {
        setTab(config.dashboardTab);
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }
    setRoleModal(key);
  };

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {LogoutDialog}
      <header className="main-header">
        <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} role="button" tabIndex={0}>
          <div className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="url(#navLogoGrad)" stroke="#fff" strokeWidth="1" />
              <path d="M10 19c0-2.5 2-5 6-5s6 2.5 6 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="10" r="1.5" fill="#86EFAC" />
              <defs>
                <linearGradient id="navLogoGrad" x1="4" y1="4" x2="28" y2="28">
                  <stop stopColor="#22C55E" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <span className="logo-text">Give Away</span>
            <span className="logo-subtext">Aja Abayahastham</span>
          </div>
        </div>

        <nav className="main-nav">
          {showPublicNav && (
            <ul className="nav-center-links" id="public-nav-links">
              <li><button type="button" className={`nav-link nav-link--center${location.pathname === '/' ? ' active' : ''}`} onClick={() => scrollTo('home')}>Home</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => openRole('donor')}>Donate</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => openRole('receiver')}>Request</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => openRole('ngo')}>NGOs</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => scrollTo('stories')}>Success Stories</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => scrollTo('about')}>About</button></li>
              <li><button type="button" className="nav-link nav-link--center" onClick={() => scrollTo('contact')}>Contact</button></li>
            </ul>
          )}

          <div className="nav-actions">
            <button type="button" className="nav-icon-btn theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          </div>

          {!currentUser ? (
            <ul className="nav-links nav-links--auth" id="logged-out-nav">
              <li><Link to="/login" className="nav-link nav-link--auth">Login</Link></li>
              <li><Link to="/register" className="nav-link nav-link--register">Register</Link></li>
            </ul>
          ) : (
            <ul className="nav-links" id="logged-in-nav">
              <li>
                <button type="button" className="nav-link" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
              </li>
              <li className="nav-user-block">
                <div className="nav-user-meta">
                  <div className="nav-user-name">{currentUser.name}</div>
                  <div className="nav-user-role">{getRoleDisplayName(currentUser.role)}</div>
                </div>
                <button type="button" className="btn-ghost btn-sm" onClick={requestLogout} disabled={logoutLoading}>
                  {logoutLoading ? 'Signing out…' : 'Logout'}
                </button>
              </li>
            </ul>
          )}
        </nav>
      </header>

      <RoleAuthModal
        roleKey={roleModal}
        onClose={() => setRoleModal(null)}
        onRegister={() => {
          setRoleModal(null);
          navigate(`/register/${roleModal}`);
        }}
        onLogin={() => {
          setRoleModal(null);
          navigate(`/login?role=${roleModal}`);
        }}
      />
    </>
  );
}
