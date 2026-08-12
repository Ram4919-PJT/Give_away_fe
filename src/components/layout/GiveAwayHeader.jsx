import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, UserPlus } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About Us', target: 'about' },
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'Impact', target: 'impact' },
  { label: 'Contact Us', target: 'contact' },
];

export default function GiveAwayHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState('hero');

  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.target);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTarget(item.target);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (target) => {
    setMobileOpen(false);
    setActiveTarget(target);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target } });
      return;
    }
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setMobileOpen(false);
    navigate('/login');
  };

  const handleCreateAccount = () => {
    setMobileOpen(false);
    navigate('/register');
  };

  return (
    <header className="landing-header sticky top-0 z-50 w-full">
      <div className="landing-header__inner">
        <button
          type="button"
          className="nav-link lp-brand"
          onClick={() => handleNavClick('hero')}
          aria-label="Aja Abayahastham Home"
        >
          <img
            className="lp-brand__logo"
            src="/assets/images/aja_logo.png"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/GiveAway_Aja_Abayahastham_Logo.png';
            }}
            alt=""
          />
          <span className="lp-brand__text">
            <span className="lp-brand__name">Aja Abayahastham</span>
            <span className="lp-brand__tag">Trust &amp; Transparency in Every Gift</span>
          </span>
        </button>

        <nav aria-label="Primary navigation" className="lp-nav">
          {NAV_ITEMS.map(({ label, target }) => (
            <button
              key={target}
              type="button"
              onClick={() => handleNavClick(target)}
              className={`nav-link lp-nav-link${activeTarget === target ? ' is-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="lp-auth">
          <button type="button" onClick={handleLogin} className="nav-link lp-auth-btn lp-auth-btn--ghost">
            <User className="w-4 h-4" strokeWidth={2} />
            <span>Login</span>
          </button>
          <button type="button" onClick={handleCreateAccount} className="nav-link lp-auth-btn lp-auth-btn--solid">
            <UserPlus className="w-4 h-4" strokeWidth={2} />
            <span>Create Account</span>
          </button>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle lp-menu-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lp-mobile-drawer">
          <nav className="lp-mobile-nav">
            {NAV_ITEMS.map(({ label, target }) => (
              <button
                key={target}
                type="button"
                onClick={() => handleNavClick(target)}
                className={`nav-link lp-nav-link lp-nav-link--mobile${activeTarget === target ? ' is-active' : ''}`}
              >
                {label}
              </button>
            ))}
            <div className="lp-mobile-auth">
              <button type="button" onClick={handleLogin} className="nav-link lp-auth-btn lp-auth-btn--ghost">
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button type="button" onClick={handleCreateAccount} className="nav-link lp-auth-btn lp-auth-btn--solid">
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
