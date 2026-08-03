import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useApp, isNgoVerified, getRoleDisplayName } from '../../context/AppContext';
import {
  ADMIN_NAV, DONOR_NAV, RECEIVER_NAV, NGO_NAV
} from '../../data/constants';
import { useToast } from '../ui/Toast';
import { getInitials } from '../../utils/receiverHelpers';
import DashboardTopbar from './DashboardTopbar';

function SidebarIcon({ name, size = 18 }) {
  const key = name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const Cmp = LucideIcons[key] || LucideIcons.Circle;
  return <Cmp size={size} />;
}

function getNavForRole(role) {
  if (role === 'super-admin') return ADMIN_NAV;
  if (role === 'donor') return DONOR_NAV;
  if (role === 'receiver') return RECEIVER_NAV;
  if (role === 'ngo') return NGO_NAV;
  return [];
}

function getLayoutClass(role) {
  const map = {
    'super-admin': 'dashboard-layout--admin',
    donor: 'dashboard-layout--donor',
    receiver: 'dashboard-layout--receiver',
    ngo: 'dashboard-layout--ngo'
  };
  return map[role] || '';
}

function SidebarBrand({ onHome, compact }) {
  return (
    <button type="button" className={`dashboard-sidebar-brand ${compact ? 'dashboard-sidebar-brand--compact' : ''}`} onClick={onHome}>
      <div className="dashboard-sidebar-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 14c0-2.5 2-5 6-5s6 2.5 6 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1.5" fill="#86EFAC" />
        </svg>
      </div>
      {!compact && (
        <div className="dashboard-sidebar-brand-text">
          <span className="dashboard-sidebar-brand-name">Give Away</span>
          <span className="dashboard-sidebar-brand-sub">Aja Abayahastham</span>
        </div>
      )}
    </button>
  );
}

function SidebarUserCard({ user }) {
  const roleClass = user.role === 'super-admin' ? 'admin' : user.role;
  return (
    <div className={`sidebar-user-card sidebar-user-card--${roleClass}`}>
      <div className="sidebar-user-avatar">{getInitials(user.name)}</div>
      <div className="sidebar-user-info">
        <span className="sidebar-user-name">{user.name}</span>
        <span className="sidebar-user-email">{user.email}</span>
        <span className="sidebar-user-role">{getRoleDisplayName(user.role)}</span>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { currentUser, logout, authLoading, notifications, receiverNotifications, ngoNotifications, adminNotifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('dashboard-menu-open', menuOpen);
    return () => document.body.classList.remove('dashboard-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  if (authLoading) {
    return (
      <main className="dashboard-content auth-loading-screen">
        <p>Loading session…</p>
      </main>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  const role = currentUser.role;
  const verified = role === 'ngo' ? isNgoVerified(currentUser) : true;
  let navItems = getNavForRole(role);

  if (role === 'ngo') {
    navItems = navItems.filter((item) => !(item.hideWhenVerified && verified));
  }

  const unread = (list) => (list || []).filter((n) => !n.read).length;
  const notifCount =
    role === 'donor' ? unread(notifications)
    : role === 'receiver' ? unread(receiverNotifications)
    : role === 'ngo' ? unread(ngoNotifications)
    : role === 'super-admin' ? unread(adminNotifications) : 0;

  const handleNavClick = (item, e) => {
    if (role === 'ngo' && item.locked && !verified) {
      e.preventDefault();
      showToast('Complete verification to unlock this feature.', 'error');
      return;
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('giveaway-theme', next);
  };

  const roleClass = role === 'super-admin' ? 'admin' : role;
  const layoutClass = `dashboard-layout dashboard-layout-react dashboard-layout--hamburger ${getLayoutClass(role)}`;

  const drawerLayer = createPortal(
    <>
      <div
        className={`dashboard-menu-backdrop ${menuOpen ? 'is-visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(false); }}
        role="button"
        tabIndex={menuOpen ? 0 : -1}
        aria-label="Close menu"
        aria-hidden={!menuOpen}
      />

      <aside
        className={`dashboard-sidebar dashboard-sidebar--drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="dashboard-sidebar-drawer-head">
          <SidebarBrand onHome={() => { navigate('/'); setMenuOpen(false); }} />
          <button type="button" className="dashboard-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <LucideIcons.X size={20} />
          </button>
        </div>

        <SidebarUserCard user={currentUser} />

        <nav className="dashboard-sidebar-nav" aria-label="Dashboard navigation">
          <p className="sidebar-nav-label">Menu</p>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const isLocked = role === 'ngo' && item.locked && !verified;
              const isNotif = item.id.includes('notifications');
              const path = `/dashboard/${item.id}`;
              const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

              return (
                <li key={item.id} className={`sidebar-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
                  {isLocked ? (
                    <a
                      href="#"
                      className="sidebar-link"
                      onClick={(e) => handleNavClick(item, e)}
                    >
                      <span className="sidebar-icon"><SidebarIcon name={item.icon} /></span>
                      <span className="sidebar-link-label">{item.label}</span>
                      <span className="sidebar-lock-icon"><LucideIcons.Lock size={14} /></span>
                    </a>
                  ) : (
                    <NavLink to={path} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                      <span className="sidebar-icon"><SidebarIcon name={item.icon} /></span>
                      <span className="sidebar-link-label">{item.label}</span>
                      {isNotif && notifCount > 0 && (
                        <span className="sidebar-badge">{notifCount}</span>
                      )}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="dashboard-sidebar-footer">
          <button type="button" className="sidebar-link sidebar-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="sidebar-icon"><LucideIcons.Sun size={18} /></span>
            Toggle theme
          </button>
          <button
            type="button"
            className="sidebar-link sidebar-logout-btn"
            onClick={handleLogout}
          >
            <span className="sidebar-icon"><LucideIcons.LogOut size={18} /></span>
            Logout
          </button>
        </div>
      </aside>
    </>,
    document.body
  );

  return (
    <div className={layoutClass}>
      <DashboardTopbar
        user={currentUser}
        role={role}
        roleClass={roleClass}
        navItems={navItems}
        menuOpen={menuOpen}
        notifCount={notifCount}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        onLogout={handleLogout}
      />

      {drawerLayer}

      <main className="dashboard-content" id="dashboard-dynamic-content">
        <Outlet />
      </main>
    </div>
  );
}
