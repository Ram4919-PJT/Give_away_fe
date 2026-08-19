import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useApp, isNgoVerified, isRoleVerified, isNgoSuspended, getRoleDisplayName } from '../../context/AppContext';
import {
  DONOR_NAV, DONOR_NAV_GROUP_LABELS, RECEIVER_NAV, RECEIVER_NAV_GROUP_LABELS,
  NGO_NAV, NGO_NAV_GROUP_LABELS,
} from '../../data/constants';
import { useToast } from '../ui/Toast';
import { getInitials } from '../../utils/receiverHelpers';
import DashboardTopbar from './DashboardTopbar';
import { useLogoutAction } from '../../hooks/useLogoutAction';
import AjaBrandMark from '../branding/AjaBrandMark';

function SidebarIcon({ name, size = 18 }) {
  const key = name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const Cmp = LucideIcons[key] || LucideIcons.Circle;
  return <Cmp size={size} />;
}

function getNavForRole(role) {
  if (role === 'donor') return DONOR_NAV;
  if (role === 'receiver') return RECEIVER_NAV;
  if (role === 'ngo') return NGO_NAV;
  return [];
}

function getLayoutClass(role) {
  const map = {
    donor: 'dashboard-layout--donor',
    receiver: 'dashboard-layout--receiver',
    ngo: 'dashboard-layout--ngo',
  };
  return map[role] || '';
}

function SidebarBrand({ onHome, compact, role }) {
  const isNgo = role === 'ngo';

  return (
    <button
      type="button"
      onClick={onHome}
      className={`dashboard-sidebar-brand dd-brand${compact ? ' dd-brand--compact' : ''}${isNgo ? ' dd-brand--ngo' : ''}`}
      aria-label={isNgo ? 'AJA Abayahastham Home' : 'Give Away Home'}
    >
      <span className={isNgo ? 'dd-brand__aja-wrap' : 'dd-brand__mark'}>
        {isNgo ? (
          <AjaBrandMark size="sm" />
        ) : (
          <img
            src="/assets/donor/Aja_Abayahastham_Brand_Logo.png"
            alt=""
            width={36}
            height={36}
            decoding="async"
          />
        )}
      </span>
      {!compact && (
        <span className="dd-brand__text">
          <span className="dd-brand__name">{isNgo ? 'AJA Abayahastham' : 'Give Away'}</span>
          <span className="dd-brand__tag">
            {isNgo ? 'NGO Partner Portal' : 'Serve · Support · Uplift'}
          </span>
        </span>
      )}
    </button>
  );
}

function SidebarUserCard({ user }) {
  const roleClass = user.role;
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

function DonorSidebarCta({ verified, onDonateMoney, onDonateItems, onVerify }) {
  const isPending = verified === 'pending';

  if (verified === true) {
    return (
      <div className="donor-sidebar-cta donor-sidebar-cta--verified">
        <div className="donor-sidebar-cta__icon" aria-hidden="true">
          <LucideIcons.ShieldCheck size={20} />
        </div>
        <h3>Ready to give</h3>
        <p>Donate money or list items for those in need.</p>
        <div className="donor-sidebar-cta__actions">
          <button type="button" className="dd-btn dd-btn-sm" onClick={onDonateMoney}>
            <LucideIcons.IndianRupee size={16} aria-hidden="true" />
            Donate Money
          </button>
          <button type="button" className="dd-btn dd-btn-outline dd-btn-sm" onClick={onDonateItems}>
            <LucideIcons.Package size={16} aria-hidden="true" />
            Donate Items
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="donor-sidebar-cta donor-sidebar-cta--pending">
        <div className="donor-sidebar-cta__icon" aria-hidden="true">
          <LucideIcons.Clock size={20} />
        </div>
        <h3>Verification in review</h3>
        <p>We&apos;re reviewing your documents. You can donate money while we finish.</p>
        <button type="button" className="dd-btn dd-btn-sm" onClick={onDonateMoney}>
          Donate Money
        </button>
      </div>
    );
  }

  return (
    <div className="donor-sidebar-cta">
      <div className="donor-sidebar-cta__icon" aria-hidden="true">
        <LucideIcons.Shield size={20} />
      </div>
      <h3>Verify to donate items</h3>
      <p>Complete a quick identity check to list donation items. Money donations are available now.</p>
      <div className="donor-sidebar-cta__actions">
        <button type="button" className="dd-btn dd-btn-sm" onClick={onVerify}>
          Complete Verification
        </button>
        <button type="button" className="dd-btn dd-btn-outline dd-btn-sm" onClick={onDonateMoney}>
          Donate Money
        </button>
      </div>
    </div>
  );
}

function NgoSidebarCta({ onVerify, verified, suspended, ngoName }) {
  if (suspended) {
    return (
      <div className="ngo-sidebar-cta ngo-sidebar-cta--suspended">
        <div className="ngo-sidebar-cta__icon" aria-hidden="true">
          <LucideIcons.ShieldOff size={20} />
        </div>
        <h3>Account Suspended</h3>
        <p>Operational features are unavailable until suspension is lifted.</p>
      </div>
    );
  }
  if (verified) {
    return (
      <div className="ngo-sidebar-cta ngo-sidebar-cta--verified">
        <div className="ngo-sidebar-cta__icon" aria-hidden="true">
          <LucideIcons.ShieldCheck size={20} />
        </div>
        <h3>Verified NGO</h3>
        <p>{ngoName || 'Your organization'} is verified on Give Away.</p>
      </div>
    );
  }
  return (
    <div className="ngo-sidebar-cta">
      <div className="ngo-sidebar-cta__icon" aria-hidden="true">
        <LucideIcons.Shield size={20} />
      </div>
      <h3>Complete verification</h3>
      <p>Unlock fund requests, item requests, and beneficiary management.</p>
      <button type="button" className="ngo-btn ngo-btn--primary ngo-btn--sm" onClick={onVerify}>
        Complete Verification
      </button>
    </div>
  );
}

function ReceiverSidebarCta({ onVerify, verified }) {
  if (verified) {
    return (
      <div className="receiver-sidebar-cta receiver-sidebar-cta--verified">
        <div className="receiver-sidebar-cta__icon" aria-hidden="true">
          <LucideIcons.ShieldCheck size={20} />
        </div>
        <h3>Your profile is verified</h3>
        <p>Request and track financial assistance from your dashboard.</p>
      </div>
    );
  }
  return (
    <div className="receiver-sidebar-cta">
      <div className="receiver-sidebar-cta__icon" aria-hidden="true">
        <LucideIcons.Shield size={20} />
      </div>
        <h3>Unlock financial assistance</h3>
        <p>Complete verification to submit financial assistance requests.</p>
      <button type="button" className="rd-btn rd-btn--primary rd-btn--sm" onClick={onVerify}>
        Complete Verification
      </button>
    </div>
  );
}

function isDonorNavActive(itemId, pathname) {
  const base = `/dashboard/${itemId}`;
  if (itemId === 'donor-my-donations') {
    return pathname === base
      || pathname.startsWith(`${base}/`)
      || pathname.includes('/donor-item-donation/');
  }
  if (itemId === 'donor-add-item' || itemId === 'donor-donate-item') {
    return pathname.includes('/donor-add-item') || pathname.includes('/donor-donate-item');
  }
  if (itemId === 'donor-item-requests') {
    return pathname === base || pathname.startsWith(`${base}/`) || pathname.includes('/donor-item-requests');
  }
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isReceiverNavActive(itemId, pathname) {
  const base = `/dashboard/${itemId}`;
  if (itemId === 'receiver-requests' || itemId === 'receiver-applications') {
    return pathname === '/dashboard/receiver-requests'
      || pathname === '/dashboard/receiver-applications'
      || pathname.startsWith('/dashboard/receiver-application-detail/');
  }
  return pathname === base || pathname.startsWith(`${base}/`);
}

function renderNavLink(item, props) {
  const { role, verified, notifCount, location, onNavClick, onClose } = props;
  const isLocked = (role === 'ngo' || role === 'receiver' || role === 'donor') && item.locked && !verified;
  const isNotif = item.id.includes('notifications');
  const path = `/dashboard/${item.id}`;
  const isActive = role === 'donor'
    ? isDonorNavActive(item.id, location.pathname)
    : role === 'receiver'
      ? isReceiverNavActive(item.id, location.pathname)
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (isLocked) {
    return (
      <a href="#" className="sidebar-link" onClick={(e) => onNavClick(item, e)}>
        <span className="sidebar-icon"><SidebarIcon name={item.icon} /></span>
        <span className="sidebar-link-label">{item.label}</span>
        <span className="sidebar-lock-icon"><LucideIcons.Lock size={14} /></span>
      </a>
    );
  }

  return (
    <NavLink
      to={path}
      className={() => `sidebar-link${isActive ? ' is-active' : ''}`}
      onClick={() => onClose?.()}
    >
      <span className="sidebar-icon"><SidebarIcon name={item.icon} /></span>
      <span className="sidebar-link-label">{item.label}</span>
      {isNotif && notifCount > 0 && (
        <span className="sidebar-badge">{notifCount > 99 ? '99+' : notifCount}</span>
      )}
    </NavLink>
  );
}

function SidebarNavList({ items, ...linkProps }) {
  const { role, verified } = linkProps;
  return (
    <ul className="sidebar-nav">
      {items.map((item) => (
        <li key={item.id} className={`sidebar-item${(role === 'ngo' || role === 'receiver' || role === 'donor') && item.locked && !verified ? ' locked' : ''}`}>
          {renderNavLink(item, linkProps)}
        </li>
      ))}
    </ul>
  );
}

function ReceiverGroupedNav({ navItems, linkProps }) {
  const groups = ['main', 'community', 'management', 'account'];
  return (
    <>
      {groups.map((groupKey) => {
        const items = navItems.filter((item) => item.group === groupKey);
        if (!items.length) return null;
        return (
          <div key={groupKey} className="sidebar-nav-group">
            <p className="sidebar-nav-label">{RECEIVER_NAV_GROUP_LABELS[groupKey]}</p>
            <SidebarNavList items={items} {...linkProps} />
          </div>
        );
      })}
    </>
  );
}

function NgoGroupedNav({ navItems, linkProps }) {
  const groups = ['main', 'donations', 'support', 'management', 'account'];
  return (
    <>
      {groups.map((groupKey) => {
        const items = navItems.filter((item) => item.group === groupKey);
        if (!items.length) return null;
        return (
          <div key={groupKey} className="sidebar-nav-group">
            <p className="sidebar-nav-label">{NGO_NAV_GROUP_LABELS[groupKey]}</p>
            <SidebarNavList items={items} {...linkProps} />
          </div>
        );
      })}
    </>
  );
}

function DonorGroupedNav({ navItems, linkProps }) {
  const groups = ['main', 'give', 'giving', 'account'];
  return (
    <>
      {groups.map((groupKey) => {
        const items = navItems.filter((item) => item.group === groupKey);
        if (!items.length) return null;
        return (
          <div key={groupKey} className="sidebar-nav-group">
            <p className="sidebar-nav-label">{DONOR_NAV_GROUP_LABELS[groupKey]}</p>
            <SidebarNavList items={items} {...linkProps} />
          </div>
        );
      })}
    </>
  );
}

function SidebarNavBody({
  currentUser,
  role,
  verified,
  navItems,
  notifCount,
  location,
  onNavClick,
  onHome,
  onDonate,
  onDonateMoney,
  onDonateItems,
  onVerifyProfile,
  showClose,
  onClose,
  showUserCard = true,
  hideDonorCta = false,
}) {
  return (
    <>
      <div className="dashboard-sidebar-drawer-head dd-sidebar-head">
        <SidebarBrand onHome={onHome} role={role} />
        {showClose && (
          <button type="button" className="dashboard-drawer-close" onClick={onClose} aria-label="Close menu">
            <LucideIcons.X size={20} />
          </button>
        )}
      </div>

      {showUserCard && <SidebarUserCard user={currentUser} />}

      <nav className="dashboard-sidebar-nav" aria-label="Dashboard navigation">
        {role === 'donor' ? (
          <DonorGroupedNav
            navItems={navItems}
            linkProps={{ role, verified, notifCount, location, onNavClick, onClose }}
          />
        ) : role === 'receiver' ? (
          <ReceiverGroupedNav
            navItems={navItems}
            linkProps={{ role, verified, notifCount, location, onNavClick, onClose }}
          />
        ) : role === 'ngo' ? (
          <NgoGroupedNav
            navItems={navItems}
            linkProps={{ role, verified, notifCount, location, onNavClick, onClose }}
          />
        ) : (
          <>
            <p className="sidebar-nav-label">Menu</p>
            <SidebarNavList
              items={navItems}
              role={role}
              verified={verified}
              notifCount={notifCount}
              location={location}
              onNavClick={onNavClick}
              onClose={onClose}
            />
          </>
        )}
      </nav>

      {role === 'donor' && !hideDonorCta && (
        <DonorSidebarCta
          verified={verified}
          onDonateMoney={onDonateMoney || onDonate}
          onDonateItems={onDonateItems}
          onVerify={onVerifyProfile}
        />
      )}
      {role === 'receiver' && (
        <ReceiverSidebarCta
          verified={verified}
          onVerify={onVerifyProfile}
        />
      )}
      {role === 'ngo' && (
        <NgoSidebarCta
          verified={verified}
          suspended={isNgoSuspended(currentUser)}
          onVerify={onVerifyProfile}
          ngoName={currentUser?.name}
        />
      )}
    </>
  );
}

export default function DashboardLayout() {
  const { currentUser, authLoading, notifications, receiverNotifications, ngoNotifications, logoutLoading } = useApp();
  const { requestLogout, LogoutDialog } = useLogoutAction({ redirectTo: '/' });
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
  const verified = role === 'ngo'
    ? isNgoVerified(currentUser)
    : isRoleVerified(currentUser);
  let navItems = getNavForRole(role);

  if (role === 'ngo') {
    navItems = navItems.filter((item) => !(item.locked && !verified));
  }

  const unread = (list) => (list || []).filter((n) => !n.read).length;
  const notifCount =
    role === 'donor' ? unread(notifications)
    : role === 'receiver' ? unread(receiverNotifications)
    : role === 'ngo' ? unread(ngoNotifications)
    : 0;

  const handleNavClick = (item, e) => {
    if ((role === 'ngo' || role === 'receiver' || role === 'donor') && item.locked && !verified) {
      e.preventDefault();
      if (role === 'donor') {
        showToast('Complete verification to donate items.', 'info');
        navigate('/dashboard/donor-verify');
      } else if (role === 'receiver') {
        showToast('This feature is available only after your profile is verified.', 'error');
        navigate('/dashboard/receiver-verify');
      } else if (role === 'ngo') {
        showToast('This feature is available only after your NGO is verified.', 'error');
        navigate('/dashboard/ngo-verify');
      }
      setMenuOpen(false);
      return;
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    requestLogout();
  };

  const goDonateMoney = () => {
    setMenuOpen(false);
    navigate('/dashboard/donor-donate-money');
  };

  const goDonateItems = () => {
    setMenuOpen(false);
    if (!isRoleVerified(currentUser)) {
      showToast('Complete verification to donate items.', 'info');
      navigate('/dashboard/donor-verify');
      return;
    }
    navigate('/dashboard/donor-add-item');
  };

  const goDonorVerify = () => {
    setMenuOpen(false);
    navigate('/dashboard/donor-verify');
  };

  const goReceiverVerify = () => {
    setMenuOpen(false);
    navigate('/dashboard/receiver-verify');
  };

  const goNgoVerify = () => {
    setMenuOpen(false);
    navigate('/dashboard/ngo-verify');
  };

  const roleClass = role;
  const withSidebar = role === 'donor' || role === 'receiver' || role === 'ngo';
  const layoutClass = [
    'dashboard-layout',
    'dashboard-layout-react',
    'dashboard-layout--hamburger',
    getLayoutClass(role),
    withSidebar ? 'dashboard-layout--with-sidebar' : '',
  ].filter(Boolean).join(' ');

  const sharedSidebarProps = {
    currentUser,
    role,
    verified,
    navItems,
    notifCount,
    location,
    onNavClick: handleNavClick,
    onHome: () => { navigate('/'); setMenuOpen(false); },
    onDonate: goDonateMoney,
    onDonateMoney: goDonateMoney,
    onDonateItems: goDonateItems,
    onVerifyProfile: role === 'ngo' ? goNgoVerify : role === 'donor' ? goDonorVerify : goReceiverVerify,
    hideDonorCta: role === 'donor' && location.pathname.includes('donor-verify'),
  };

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
        <SidebarNavBody
          {...sharedSidebarProps}
          showClose
          onClose={() => setMenuOpen(false)}
        />
      </aside>
    </>,
    document.body
  );

  return (
    <div className={layoutClass}>
      {LogoutDialog}

      {withSidebar && (
        <aside className={`dashboard-sidebar dashboard-sidebar--desktop${role === 'receiver' ? ' dashboard-sidebar--receiver' : ''}${role === 'ngo' ? ' dashboard-sidebar--ngo' : ''}`} aria-label={`${role} sidebar`}>
          <SidebarNavBody
            {...sharedSidebarProps}
            showClose={false}
            showUserCard={false}
            onClose={() => {}}
          />
        </aside>
      )}

      <div className="dashboard-main-wrap">
        <DashboardTopbar
          user={currentUser}
          role={role}
          roleClass={roleClass}
          navItems={navItems}
          menuOpen={menuOpen}
          notifCount={notifCount}
          onToggleMenu={() => setMenuOpen((o) => !o)}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
          withSidebar={withSidebar}
        />

        <main className="dashboard-content" id="dashboard-dynamic-content">
          <Outlet />
        </main>
      </div>

      {drawerLayer}
    </div>
  );
}
