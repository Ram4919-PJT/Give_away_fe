import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, ChevronDown, User, Settings, LogOut, BadgeCheck } from 'lucide-react';
import { getInitials } from '../../utils/receiverHelpers';
import { isNgoVerified } from '../../context/AppContext';
import { searchCausesAndNgos } from '../../api/coreClient';
import AjaBrandMark from '../branding/AjaBrandMark';

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
  };
  return map[role] || {};
}

function isUserVerified(user, role) {
  if (role === 'ngo') return isNgoVerified(user);
  if (role === 'donor' || role === 'receiver') return user?.verified === true;
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
  withSidebar = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);

  const routes = getRoleRoutes(role);
  const pageTitle = getPageTitle(navItems, location.pathname);
  const showVerified = isUserVerified(user, role);
  const isDonor = role === 'donor';
  const isReceiver = role === 'receiver';
  const isNgo = role === 'ngo';
  const compactHeader = withSidebar && (isDonor || isReceiver || isNgo);
  const roleLabel = isDonor ? 'Donor' : isReceiver ? 'Receiver' : isNgo ? 'NGO Partner' : null;

  useEffect(() => {
    setProfileOpen(false);
    setSearchResults(null);
    setSearchQuery('');
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

  useEffect(() => {
    const onPointerDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setProfileOpen(false);
  };

  const runSearch = async (value) => {
    const q = String(value || '').trim();
    if (!isDonor || q.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await searchCausesAndNgos(q);
      setSearchResults(data);
    } catch {
      setSearchResults({ programs: [], ngos: [], query: q, error: true });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(value), 280);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(searchQuery);
  };

  const openProgram = (program) => {
    setSearchResults(null);
    setSearchQuery('');
    navigate(`/dashboard/donor-donate-money?program_id=${program.program_id}`);
  };

  return (
    <header className={`dash-header${compactHeader ? ' dash-header--compact' : ''}`}>
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

          {compactHeader ? (
            <div className={`dash-header__compact-brand${isNgo ? ' dash-header__compact-brand--ngo' : ''}`}>
              {isNgo ? (
                <AjaBrandMark size="sm" className="dash-header__compact-aja-mark" />
              ) : (
                <img
                  src="/assets/donor/Aja_Abayahastham_Brand_Logo.png"
                  alt=""
                  className="dash-header__compact-logo"
                  width={32}
                  height={32}
                  decoding="async"
                />
              )}
              <h1 className="dash-header__page-title dash-header__page-title--visible">{pageTitle}</h1>
            </div>
          ) : (
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
                <span className="dash-header__subtitle">Serve · Support · Uplift</span>
              </div>
            </div>
          )}
        </div>

        <div className="dash-header__center">
          <form className="dash-header__search" onSubmit={handleSearch} ref={searchRef}>
            <Search size={18} className="dash-header__search-icon" aria-hidden="true" />
            <input
              type="search"
              className="dash-header__search-input"
              placeholder={isDonor ? 'Search causes and programs…' : 'Search donations, requests...'}
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label={isDonor ? 'Search causes and programs' : 'Search donations and requests'}
              autoComplete="off"
            />
            {isDonor && searchResults && (
              <div className="dash-search-results" role="listbox" aria-label="Search results">
                {searchLoading && (
                  <p className="px-3 py-3 text-sm text-[#49638F]">Searching…</p>
                )}
                {!searchLoading && searchResults.error && (
                  <p className="px-3 py-3 text-sm text-rose-600">Search failed. Try again.</p>
                )}
                {!searchLoading && !searchResults.error && !(searchResults.programs?.length) && (
                  <p className="px-3 py-3 text-sm text-[#49638F]">No matches for “{searchResults.query}”.</p>
                )}
                {(searchResults.programs || []).map((p) => (
                  <button key={`p-${p.program_id}`} type="button" role="option" onClick={() => openProgram(p)}>
                    <span className="dash-search-results__type">Cause</span>
                    <span className="dash-search-results__title">{p.program_name}</span>
                    <span className="dash-search-results__meta">{p.category}</span>
                  </button>
                ))}
              </div>
            )}
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
              {isDonor ? (
                <img
                  src="/assets/donor/Donor_Profile_Avatar.png"
                  alt=""
                  className="dash-header__avatar dash-header__avatar--img"
                />
              ) : (
                <span className={`dash-header__avatar dash-header__avatar--${roleClass}`}>
                  {getInitials(user.name)}
                </span>
              )}
              <span className="dash-header__profile-meta">
                <span className="dash-header__profile-name">{user.name}</span>
                {roleLabel && (
                  <span className="dash-header__role-label">{roleLabel}</span>
                )}
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
