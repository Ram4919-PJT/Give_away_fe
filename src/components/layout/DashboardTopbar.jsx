import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, ChevronDown, User, Settings, LogOut, BadgeCheck } from 'lucide-react';
import { getInitials } from '../../utils/receiverHelpers';
import { isNgoVerified } from '../../context/AppContext';

function HeaderLogo() {
  return (
    <div className="dash-header__logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 14c0-2.5 2-5 6-5s6 2.5 6 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1.5" fill="#86EFAC" />
      </svg>
    </div>
  );
}

function getRoleRoutes(role) {
  const map = {
    donor: { profile: 'donor-profile', settings: 'donor-settings', notifications: 'donor-notifications' },
    receiver: { profile: 'receiver-profile', settings: 'receiver-settings', notifications: 'receiver-notifications' },
    ngo: { profile: 'ngo-profile', settings: 'ngo-settings', notifications: 'ngo-notifications' },
    'super-admin': { profile: 'admin-dashboard', settings: 'admin-settings', notifications: 'admin-notifications' }
  };
  return map[role] || {};
}

function isUserVerified(user, role) {
  if (role === 'ngo') return isNgoVerified(user);
  if (role === 'donor') return user?.verified === true;
  return false;
}

function getPageTitle(navItems, pathname) {
  const match = navItems.find(
    (item) => pathname === `/dashboard/${item.id}` || pathname.startsWith(`/dashboard/${item.id}/`)
  );
  return match?.label || 'Dashboard';
}

export default function DashboardTopbar({
  user,
  role,
  roleClass,
  navItems,
  menuOpen,
  notifCount,
  onToggleMenu,
  onLogout,
  logoutLoading = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  const routes = getRoleRoutes(role);
  const pageTitle = getPageTitle(navItems, location.pathname);
  const showVerified = isUserVerified(user, role);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const onPointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [profileOpen]);

  const goTo = (path) => {
    navigate(path);
    setProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <header className="dash-header">
      <div className="dash-header__inner">
        <div className="dash-header__left">
          <button
            type="button"
            className="dash-header__menu-btn"
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
          </button>

          <div
            className="dash-header__brand"
            onClick={() => navigate('/')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
            role="button"
            tabIndex={0}
          >
            <HeaderLogo />
            <div className="dash-header__brand-text">
              <span className="dash-header__title">Give Away</span>
              <span className="dash-header__subtitle">Aja Abayahastham</span>
            </div>
          </div>
        </div>

        <div className="dash-header__center">
          <form className="dash-header__search" onSubmit={handleSearch}>
            <Search size={18} className="dash-header__search-icon" aria-hidden="true" />
            <input
              type="search"
              className="dash-header__search-input"
              placeholder="Search donations, requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search donations and requests"
            />
          </form>
          <p className="dash-header__page-title" aria-hidden="true">{pageTitle}</p>
        </div>

        <div className="dash-header__right">
          {routes.notifications && (
            <button
              type="button"
              className="dash-header__icon-btn"
              aria-label={`Notifications${notifCount ? `, ${notifCount} unread` : ''}`}
              onClick={() => goTo(`/dashboard/${routes.notifications}`)}
            >
              <Bell size={20} strokeWidth={2} />
              {notifCount > 0 && (
                <span className="dash-header__badge">{notifCount > 9 ? '9+' : notifCount}</span>
              )}
            </button>
          )}

          <div className="dash-header__profile" ref={profileRef}>
            <button
              type="button"
              className={`dash-header__profile-trigger ${profileOpen ? 'is-open' : ''}`}
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className={`dash-header__avatar dash-header__avatar--${roleClass}`}>
                {getInitials(user.name)}
              </span>
              <span className="dash-header__profile-meta">
                <span className="dash-header__profile-name">{user.name}</span>
                {showVerified && (
                  <span className="dash-header__verified">
                    <BadgeCheck size={12} strokeWidth={2.5} />
                    Verified
                  </span>
                )}
              </span>
              <ChevronDown size={16} className="dash-header__chevron" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div className="dash-header__dropdown" role="menu">
                <div className="dash-header__dropdown-head">
                  <span className={`dash-header__avatar dash-header__avatar--${roleClass} dash-header__avatar--lg`}>
                    {getInitials(user.name)}
                  </span>
                  <div>
                    <p className="dash-header__dropdown-name">{user.name}</p>
                    <p className="dash-header__dropdown-email">{user.email}</p>
                  </div>
                </div>
                <div className="dash-header__dropdown-divider" />
                {routes.profile && (
                  <button type="button" className="dash-header__dropdown-item" role="menuitem" onClick={() => goTo(`/dashboard/${routes.profile}`)}>
                    <User size={16} />
                    Profile
                  </button>
                )}
                {routes.settings && (
                  <button type="button" className="dash-header__dropdown-item" role="menuitem" onClick={() => goTo(`/dashboard/${routes.settings}`)}>
                    <Settings size={16} />
                    Settings
                  </button>
                )}
                <div className="dash-header__dropdown-divider" />
                <button
                  type="button"
                  className={`dash-header__dropdown-item dash-header__dropdown-item--danger${logoutLoading ? ' is-loading' : ''}`}
                  role="menuitem"
                  onClick={onLogout}
                  disabled={logoutLoading}
                >
                  <LogOut size={16} />
                  {logoutLoading ? 'Signing out…' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
