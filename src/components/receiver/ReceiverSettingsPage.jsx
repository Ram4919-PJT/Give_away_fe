import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, ClipboardList, Lock, SlidersHorizontal, Shield, Database,
  HelpCircle, AlertTriangle, KeyRound, MonitorSmartphone,
  Download, RotateCcw, Loader2, X, LogOut, ExternalLink,
} from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { useReceiverSettings } from '../../hooks/useReceiverSettings';
import {
  changePassword,
  deactivateAccount,
  deleteAccount,
  logoutAllSessions,
  getMe,
} from '../../api/iamClient';
import { listAssistanceRequests } from '../../api/coreClient';
import {
  getReceiverApps,
  getReceiverStats,
  getInitials,
} from '../../utils/receiverHelpers';
import { downloadJson, formatLastLogin } from '../../utils/receiverSettings';
import {
  RECEIVER_NOTIFICATION_TOGGLES,
  RECEIVER_PRIVACY_TOGGLES,
  RECEIVER_CONTACT_OPTIONS,
  RECEIVER_CATEGORY_OPTIONS,
  RECEIVER_LANGUAGE_OPTIONS,
  RECEIVER_TIMEZONE_OPTIONS,
  RECEIVER_DATE_FORMAT_OPTIONS,
} from '../../data/receiverSettingsData';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function Toggle({ id, checked, onChange, title, description, disabled = false }) {
  return (
    <div className={`rs-toggle-row${disabled ? ' is-disabled' : ''}`}>
      <div className="rs-toggle-row__text">
        <label htmlFor={id}>{title}</label>
        <p>{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        className={`rs-switch${checked ? ' is-on' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="rs-switch__thumb" />
      </button>
    </div>
  );
}

function SettingSelect({ id, label, value, onChange, options }) {
  return (
    <label className="rs-select" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function SettingsModal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="rs-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="rs-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rs-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="rs-modal__head">
          <div>
            <h2 id="rs-modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="rs-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="rs-modal__body">{children}</div>
        {footer && <footer className="rs-modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete }) {
  return (
    <label className="rs-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder="••••••••"
      />
    </label>
  );
}

export default function ReceiverSettingsPage() {
  const navigate = useNavigate();
  const { currentUser, receiverApplications, dispatch, logout } = useApp();
  const { showToast } = useToast();

  const apps = useMemo(
    () => getReceiverApps(receiverApplications, currentUser),
    [receiverApplications, currentUser]
  );
  const stats = useMemo(() => getReceiverStats(apps), [apps]);
  const verified = isRoleVerified(currentUser);

  const {
    settings,
    security,
    loading,
    saving,
    error,
    dirty,
    patch,
    resetChanges,
    saveSettings,
    refreshSecurity,
  } = useReceiverSettings({
    userId: currentUser?.userId || currentUser?.id,
    userSettings: currentUser?.settings,
    onSaved: (merged) => {
      dispatch({ type: 'UPDATE_USER', payload: { settings: merged } });
      showToast('Settings saved successfully.', 'success');
    },
  });

  const [passwordModal, setPasswordModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const lastLoginLabel = useMemo(
    () => formatLastLogin(security?.last_login_at, settings?.timezone),
    [security, settings?.timezone]
  );

  const notifOn = settings
    ? settings.emailNotifications || settings.smsNotifications || settings.assistanceUpdates
    : false;

  const handleSave = async () => {
    try {
      await saveSettings();
    } catch {
      showToast('Could not save settings. Please try again.', 'error');
    }
  };

  const handleReset = () => {
    resetChanges();
    showToast('Changes discarded.', 'success');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not change password.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await deactivateAccount(deactivatePassword);
      setDeactivateModal(false);
      showToast('Account deactivated. Signing you out…', 'success');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      showToast(err.message || 'Could not deactivate account.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await deleteAccount({ password: deletePassword, confirmation: deleteConfirmation });
      setDeleteModal(false);
      showToast('Account deleted. Signing you out…', 'success');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      showToast(err.message || 'Could not delete account.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setActionLoading(true);
    try {
      await logoutAllSessions();
      await refreshSecurity();
      showToast('All other sessions have been signed out.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not sign out other sessions.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadRequests = async () => {
    setActionLoading(true);
    try {
      const rows = await listAssistanceRequests();
      downloadJson('giveaway-assistance-requests.json', {
        exported_at: new Date().toISOString(),
        requests: rows,
      });
      showToast('Request history downloaded.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not download request history.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportAccount = async () => {
    setActionLoading(true);
    try {
      const [profile, requests] = await Promise.all([
        getMe(),
        listAssistanceRequests().catch(() => []),
      ]);
      downloadJson('giveaway-receiver-account.json', {
        exported_at: new Date().toISOString(),
        profile,
        settings,
        assistance_requests: requests,
      });
      showToast('Account data exported.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not export account data.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="rs-page receiver-page receiver-module page-route">
        <div className="rs-loading" role="status">
          <Loader2 size={28} className="rs-spin" aria-hidden="true" />
          <p>Loading your settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rs-page receiver-page receiver-module page-route">
      <header className="rs-hero">
        <p className="rs-hero__eyebrow">Account</p>
        <h1>Settings</h1>
        <p>Manage notifications, request defaults, privacy, and account security.</p>
        {error && <p className="rs-error-banner" role="alert">{error}</p>}
      </header>

      <section className="rs-overview" aria-label="Account overview">
        <div className="rs-overview__avatar" aria-hidden="true">
          {getInitials(currentUser?.name)}
        </div>
        <div className="rs-overview__meta">
          <h2>{currentUser?.name || 'Receiver'}</h2>
          <div className="rs-overview__badges">
            <span className={`rs-pill ${verified ? 'rs-pill--success' : 'rs-pill--warning'}`}>
              {verified ? 'Verified' : 'Verification pending'}
            </span>
            <span className="rs-overview__muted">
              Member since {formatDate(currentUser?.memberSince)}
            </span>
          </div>
        </div>
        <div className="rs-overview__stats">
          <div>
            <strong>{stats.underReview}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{stats.approved}</strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>{notifOn ? 'On' : 'Off'}</strong>
            <span>Alerts</span>
          </div>
        </div>
      </section>

      <div className="rs-stack">
        <section className="rs-card">
          <header className="rs-card__head">
            <Bell size={18} aria-hidden="true" />
            <div>
              <h2>Notifications</h2>
              <p>Choose how you receive assistance and account updates.</p>
            </div>
          </header>
          <div className="rs-list">
            {RECEIVER_NOTIFICATION_TOGGLES.map((item) => (
              <Toggle
                key={item.key}
                id={`rs-${item.key}`}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => patch(item.key, value)}
              />
            ))}
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <ClipboardList size={18} aria-hidden="true" />
            <div>
              <h2>Request Defaults</h2>
              <p>Preferences used when you submit financial assistance requests.</p>
            </div>
          </header>
          <div className="rs-grid">
            <SettingSelect
              id="rs-contact"
              label="Preferred contact method"
              value={settings.preferredContactMethod}
              onChange={(v) => patch('preferredContactMethod', v)}
              options={RECEIVER_CONTACT_OPTIONS}
            />
            <SettingSelect
              id="rs-category"
              label="Default request category"
              value={settings.defaultRequestCategory}
              onChange={(v) => patch('defaultRequestCategory', v)}
              options={RECEIVER_CATEGORY_OPTIONS}
            />
          </div>
          <div className="rs-list">
            <Toggle
              id="rs-draft"
              title="Auto-save draft requests"
              description="Save unfinished assistance applications locally as you type."
              checked={!!settings.autoSaveDrafts}
              onChange={(v) => patch('autoSaveDrafts', v)}
            />
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <Lock size={18} aria-hidden="true" />
            <div>
              <h2>Privacy</h2>
              <p>Control what reviewers can see about your profile.</p>
            </div>
          </header>
          <div className="rs-list">
            {RECEIVER_PRIVACY_TOGGLES.map((item) => (
              <Toggle
                key={item.key}
                id={`rs-${item.key}`}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => patch(item.key, value)}
              />
            ))}
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <div>
              <h2>Regional & Display</h2>
              <p>Language, date format, and appearance.</p>
            </div>
          </header>
          <div className="rs-grid rs-grid--3">
            <SettingSelect
              id="rs-language"
              label="Language"
              value={settings.language}
              onChange={(v) => patch('language', v)}
              options={RECEIVER_LANGUAGE_OPTIONS}
            />
            <SettingSelect
              id="rs-timezone"
              label="Time zone"
              value={settings.timezone}
              onChange={(v) => patch('timezone', v)}
              options={RECEIVER_TIMEZONE_OPTIONS}
            />
            <SettingSelect
              id="rs-date"
              label="Date format"
              value={settings.dateFormat}
              onChange={(v) => patch('dateFormat', v)}
              options={RECEIVER_DATE_FORMAT_OPTIONS}
            />
          </div>
          <div className="rs-theme">
            <span className="rs-theme__label">Theme</span>
            <div className="rs-theme__options" role="radiogroup" aria-label="Theme">
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'light'}
                className={`rs-theme-card${settings.theme === 'light' ? ' is-selected' : ''}`}
                onClick={() => patch('theme', 'light')}
              >
                Light mode
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'dark'}
                className="rs-theme-card is-disabled"
                disabled
                title="Coming soon"
              >
                Dark mode
                <em>Coming soon</em>
              </button>
            </div>
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <Shield size={18} aria-hidden="true" />
            <div>
              <h2>Security</h2>
              <p>Protect your account and manage active sessions.</p>
            </div>
          </header>
          <div className="rs-security">
            <div className="rs-security__row">
              <div>
                <strong>Change password</strong>
                <p>Update your password regularly for better security.</p>
              </div>
              <button
                type="button"
                className="rs-btn rs-btn--secondary"
                onClick={() => setPasswordModal(true)}
              >
                <KeyRound size={15} /> Change
              </button>
            </div>
            <div className="rs-security__row">
              <div>
                <strong>Last login</strong>
                <p>Most recent successful sign-in.</p>
              </div>
              <span className="rs-meta">{lastLoginLabel}</span>
            </div>
            <div className="rs-security__row">
              <div>
                <strong>Active sessions</strong>
                <p>Sign out from other devices using your account.</p>
              </div>
              <div className="rs-security__actions">
                <span className="rs-pill rs-pill--info">
                  {security?.active_sessions ?? 1} active
                </span>
                <button
                  type="button"
                  className="rs-btn rs-btn--ghost"
                  onClick={handleLogoutAll}
                  disabled={actionLoading}
                >
                  <LogOut size={15} /> Sign out others
                </button>
              </div>
            </div>
            {!verified && (
              <div className="rs-security__row">
                <div>
                  <strong>Profile verification</strong>
                  <p>Complete verification to submit financial assistance requests.</p>
                </div>
                <button
                  type="button"
                  className="rs-btn rs-btn--secondary"
                  onClick={() => navigate('/dashboard/receiver-profile')}
                >
                  <ExternalLink size={15} /> Verify profile
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <Database size={18} aria-hidden="true" />
            <div>
              <h2>Your Data</h2>
              <p>Download your assistance request history and account data.</p>
            </div>
          </header>
          <div className="rs-data-actions">
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={handleDownloadRequests}
              disabled={actionLoading}
            >
              <Download size={15} /> Download requests
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={handleExportAccount}
              disabled={actionLoading}
            >
              <Download size={15} /> Export account data
            </button>
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <HelpCircle size={18} aria-hidden="true" />
            <div>
              <h2>Help & Support</h2>
              <p>Quick links for assistance and account help.</p>
            </div>
          </header>
          <div className="rs-data-actions">
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => navigate('/dashboard/receiver-notifications')}
            >
              <Bell size={15} /> View notifications
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => navigate('/dashboard/receiver-requests')}
            >
              <ClipboardList size={15} /> My requests
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--ghost"
              onClick={() => navigate('/dashboard/receiver-profile')}
            >
              <MonitorSmartphone size={15} /> Edit profile
            </button>
          </div>
        </section>

        <section className="rs-card rs-card--danger">
          <header className="rs-card__head">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <h2>Danger zone</h2>
              <p>These actions affect your access to assistance features.</p>
            </div>
          </header>
          <p className="rs-danger-note">
            Deactivating or deleting your account will pause request access and may remove
            your application history. Please confirm carefully.
          </p>
          <div className="rs-danger-actions">
            <button
              type="button"
              className="rs-btn rs-btn--warning"
              onClick={() => setDeactivateModal(true)}
            >
              Deactivate account
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--danger"
              onClick={() => setDeleteModal(true)}
            >
              Delete account
            </button>
          </div>
        </section>
      </div>

      <div className={`rs-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="rs-unsaved" role="status">Unsaved changes</span>
        )}
        <div className="rs-actions__btns">
          <button
            type="button"
            className="rs-btn rs-btn--secondary"
            onClick={handleReset}
            disabled={!dirty || saving}
          >
            <RotateCcw size={15} /> Discard
          </button>
          <button
            type="button"
            className="rs-btn rs-btn--primary"
            onClick={handleSave}
            disabled={!dirty || saving}
          >
            {saving ? (
              <>
                <Loader2 size={15} className="rs-spin" /> Saving…
              </>
            ) : (
              'Save settings'
            )}
          </button>
        </div>
      </div>

      {passwordModal && (
        <SettingsModal
          title="Change password"
          subtitle="Enter your current password and choose a new one."
          onClose={() => setPasswordModal(false)}
          footer={(
            <>
              <button type="button" className="rs-btn rs-btn--secondary" onClick={() => setPasswordModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="rs-password-form"
                className="rs-btn rs-btn--primary"
                disabled={actionLoading}
              >
                Update password
              </button>
            </>
          )}
        >
          <form id="rs-password-form" className="rs-form" onSubmit={handleChangePassword}>
            <PasswordField
              id="rs-current-pw"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
            <PasswordField
              id="rs-new-pw"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
            />
            <PasswordField
              id="rs-confirm-pw"
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />
          </form>
        </SettingsModal>
      )}

      {deactivateModal && (
        <SettingsModal
          title="Deactivate account"
          subtitle="Your account will be paused. You can contact support to reactivate."
          onClose={() => setDeactivateModal(false)}
          footer={(
            <>
              <button type="button" className="rs-btn rs-btn--secondary" onClick={() => setDeactivateModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="rs-deactivate-form"
                className="rs-btn rs-btn--warning"
                disabled={actionLoading}
              >
                Deactivate
              </button>
            </>
          )}
        >
          <form id="rs-deactivate-form" className="rs-form" onSubmit={handleDeactivate}>
            <PasswordField
              id="rs-deactivate-pw"
              label="Confirm your password"
              value={deactivatePassword}
              onChange={setDeactivatePassword}
              autoComplete="current-password"
            />
          </form>
        </SettingsModal>
      )}

      {deleteModal && (
        <SettingsModal
          title="Delete account"
          subtitle="This permanently removes your account. Type DELETE to confirm."
          onClose={() => setDeleteModal(false)}
          footer={(
            <>
              <button type="button" className="rs-btn rs-btn--secondary" onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="rs-delete-form"
                className="rs-btn rs-btn--danger"
                disabled={actionLoading}
              >
                Delete permanently
              </button>
            </>
          )}
        >
          <form id="rs-delete-form" className="rs-form" onSubmit={handleDelete}>
            <PasswordField
              id="rs-delete-pw"
              label="Password"
              value={deletePassword}
              onChange={setDeletePassword}
              autoComplete="current-password"
            />
            <label className="rs-field" htmlFor="rs-delete-confirm">
              <span>Type DELETE to confirm</span>
              <input
                id="rs-delete-confirm"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </label>
          </form>
        </SettingsModal>
      )}
    </div>
  );
}
