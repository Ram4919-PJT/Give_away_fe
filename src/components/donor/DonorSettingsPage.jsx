import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, HeartHandshake, Shield, SlidersHorizontal, Database, AlertTriangle,
  KeyRound, MonitorSmartphone, Download, FileSpreadsheet,
  History, RotateCcw, CreditCard, Check, X, Loader2, LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { useDonorSettings } from '../../hooks/useDonorSettings';
import {
  changePassword,
  deactivateAccount,
  deleteAccount,
  logoutAllSessions,
  getMe,
} from '../../api/iamClient';
import { getMyDonations } from '../../api/coreClient';
import {
  DONOR_NOTIFICATION_TOGGLES,
  DONOR_CATEGORIES,
  DONOR_LANGUAGE_OPTIONS,
  DONOR_TIMEZONE_OPTIONS,
  DONOR_DATE_FORMAT_OPTIONS,
} from '../../data/donorSettingsData';
import { downloadJson, formatLastLogin } from '../../utils/donorSettings';

function Toggle({ id, checked, onChange, title, description, disabled = false }) {
  return (
    <div className={`ds-toggle-row${disabled ? ' is-disabled' : ''}`}>
      <div className="ds-toggle-row__text">
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
        className={`ds-switch${checked ? ' is-on' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="ds-switch__thumb" />
      </button>
    </div>
  );
}

function SettingSelect({ id, label, value, onChange, options }) {
  return (
    <label className="ds-select" htmlFor={id}>
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
    <div className="ds-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="ds-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ds-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ds-modal__head">
          <div>
            <h2 id="ds-modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="ds-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="ds-modal__body">{children}</div>
        {footer && <footer className="ds-modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete }) {
  return (
    <label className="ds-field" htmlFor={id}>
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

export default function DonorSettingsPage() {
  const navigate = useNavigate();
  const { dispatch, logout } = useApp();
  const { showToast } = useToast();

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
  } = useDonorSettings({
    onSaved: (merged) => {
      dispatch({ type: 'UPDATE_USER', payload: { settings: merged } });
      showToast('Settings saved successfully.', 'success');
    },
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const selectedCount = settings?.preferredCategories?.length || 0;

  const lastLoginLabel = useMemo(
    () => formatLastLogin(security?.last_login_at, settings?.timezone),
    [security, settings?.timezone]
  );

  const toggleCategory = (category) => {
    if (!settings) return;
    const list = settings.preferredCategories || [];
    const next = list.includes(category)
      ? list.filter((c) => c !== category)
      : [...list, category];
    patch('preferredCategories', next);
  };

  const handleSave = async () => {
    try {
      await saveSettings();
    } catch {
      showToast('Could not save settings. Please try again.', 'error');
    }
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

  const handleDownloadHistory = async () => {
    setActionLoading(true);
    try {
      const data = await getMyDonations({ period: 'all', page: 1, pageSize: 100 });
      downloadJson('giveaway-donation-history.json', data);
      showToast('Donation history downloaded.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not download donation history.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportAccount = async () => {
    setActionLoading(true);
    try {
      const [profile, donations] = await Promise.all([
        getMe(),
        getMyDonations({ period: 'all', page: 1, pageSize: 50 }).catch(() => null),
      ]);
      downloadJson('giveaway-account-export.json', {
        exported_at: new Date().toISOString(),
        profile,
        settings,
        donations_summary: donations?.summary || donations,
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
      <div className="ds-page donor-page donor-module page-route">
        <div className="ds-loading" role="status">
          <Loader2 size={28} className="ds-spin" aria-hidden="true" />
          <p>Loading your settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-page donor-page donor-module page-route">
      <header className="ds-hero">
        <h1>Settings</h1>
        <p>Manage notifications, donation preferences, security, and account options.</p>
        {error && <p className="ds-error-banner" role="alert">{error}</p>}
      </header>

      <div className="ds-stack">
        <section className="ds-card">
          <header className="ds-card__head">
            <Bell size={18} aria-hidden="true" />
            <div>
              <h2>Notification Preferences</h2>
              <p>Control email, SMS, and in-app update preferences.</p>
            </div>
          </header>
          <div className="ds-list">
            {DONOR_NOTIFICATION_TOGGLES.map((item) => (
              <Toggle
                key={item.key}
                id={`ds-${item.key}`}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => patch(item.key, value)}
              />
            ))}
          </div>
        </section>

        <section className="ds-card">
          <header className="ds-card__head">
            <HeartHandshake size={18} aria-hidden="true" />
            <div>
              <h2>Donation Preferences</h2>
              <p>Defaults used when you donate items or funds.</p>
            </div>
          </header>

          <Toggle
            id="ds-anonymous"
            title="Anonymous Donations"
            description="Hide your name from public donation activity when possible."
            checked={!!settings.anonymousDonations}
            onChange={(value) => patch('anonymousDonations', value)}
          />

          <div className="ds-multi">
            <div className="ds-multi__label-row">
              <span>Preferred Donation Categories</span>
              <em>{selectedCount} selected</em>
            </div>
            <button
              type="button"
              className="ds-multi__trigger"
              aria-expanded={categoryOpen}
              onClick={() => setCategoryOpen((o) => !o)}
            >
              {selectedCount
                ? settings.preferredCategories.join(', ')
                : 'Select preferred categories'}
            </button>
            {categoryOpen && (
              <div className="ds-multi__panel" role="group" aria-label="Preferred donation categories">
                {DONOR_CATEGORIES.map((cat) => {
                  const active = settings.preferredCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`ds-chip${active ? ' is-selected' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleCategory(cat)}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="ds-pref-actions">
            <div className="ds-pref-row">
              <div>
                <strong>Payment Methods</strong>
                <p>Manage saved payment options for donations.</p>
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--secondary"
                onClick={() => navigate('/dashboard/donor-payment-methods')}
              >
                <CreditCard size={15} />
                Manage
              </button>
            </div>
          </div>
        </section>

        <section className="ds-card">
          <header className="ds-card__head">
            <Shield size={18} aria-hidden="true" />
            <div>
              <h2>Privacy & Security</h2>
              <p>Password, sessions, and recent sign-in activity.</p>
            </div>
          </header>

          <div className="ds-security">
            <div className="ds-security__row">
              <div>
                <strong>Change Password</strong>
                <p>Update your password to keep your account secure.</p>
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--secondary"
                onClick={() => setPasswordModal(true)}
              >
                <KeyRound size={15} />
                Change Password
              </button>
            </div>

            <div className="ds-security__row">
              <div>
                <strong>Active Sessions</strong>
                <p>Devices currently signed in to your donor account.</p>
              </div>
              <div className="ds-security__actions">
                <span className="ds-badge ds-badge--info">
                  {security?.active_sessions ?? 0} active
                </span>
                <button
                  type="button"
                  className="ds-btn ds-btn--ghost"
                  disabled={actionLoading}
                  onClick={handleLogoutAll}
                >
                  <LogOut size={15} />
                  Sign out others
                </button>
              </div>
            </div>

            <div className="ds-security__row">
              <div>
                <strong>Last Login</strong>
                <p>Most recent successful sign-in to this account.</p>
              </div>
              <span className="ds-meta">{lastLoginLabel}</span>
            </div>
          </div>
        </section>

        <section className="ds-card">
          <header className="ds-card__head">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <div>
              <h2>Account Preferences</h2>
              <p>Language, regional formats, and appearance.</p>
            </div>
          </header>

          <div className="ds-grid">
            <SettingSelect
              id="ds-language"
              label="Preferred Language"
              value={settings.language}
              onChange={(v) => patch('language', v)}
              options={DONOR_LANGUAGE_OPTIONS}
            />
            <SettingSelect
              id="ds-timezone"
              label="Time Zone"
              value={settings.timezone}
              onChange={(v) => patch('timezone', v)}
              options={DONOR_TIMEZONE_OPTIONS}
            />
            <SettingSelect
              id="ds-date"
              label="Date Format"
              value={settings.dateFormat}
              onChange={(v) => patch('dateFormat', v)}
              options={DONOR_DATE_FORMAT_OPTIONS}
            />
          </div>

          <div className="ds-theme">
            <span className="ds-theme__label">Theme</span>
            <div className="ds-theme__options" role="radiogroup" aria-label="Theme">
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'light'}
                className={`ds-theme-card${settings.theme === 'light' ? ' is-selected' : ''}`}
                onClick={() => patch('theme', 'light')}
              >
                Light Mode
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'dark'}
                className={`ds-theme-card${settings.theme === 'dark' ? ' is-selected' : ''}`}
                onClick={() => patch('theme', 'dark')}
              >
                Dark Mode
              </button>
            </div>
          </div>
        </section>

        <section className="ds-card">
          <header className="ds-card__head">
            <Database size={18} aria-hidden="true" />
            <div>
              <h2>Data Management</h2>
              <p>Download your donation history and account activity.</p>
            </div>
          </header>
          <div className="ds-data-actions">
            <button
              type="button"
              className="ds-btn ds-btn--secondary"
              disabled={actionLoading}
              onClick={handleDownloadHistory}
            >
              <Download size={15} />
              Download Donation History
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--secondary"
              disabled={actionLoading}
              onClick={handleExportAccount}
            >
              <FileSpreadsheet size={15} />
              Export Account Data
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--secondary"
              onClick={() => setActivityModal(true)}
            >
              <History size={15} />
              View Activity Log
            </button>
          </div>
        </section>

        <section className="ds-card ds-card--danger">
          <header className="ds-card__head">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <h2>Danger Zone</h2>
              <p>Deactivate or permanently remove your donor account.</p>
            </div>
          </header>
          <p className="ds-danger-note">
            Deactivating pauses your access. Deleting anonymizes your profile and signs you out
            permanently. Both actions require your password.
          </p>
          <div className="ds-danger-actions">
            <button
              type="button"
              className="ds-btn ds-btn--warning"
              onClick={() => setDeactivateModal(true)}
            >
              Deactivate Account
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--danger"
              onClick={() => setDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      <div className={`ds-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="ds-unsaved" role="status">
            Unsaved changes
          </span>
        )}
        <div className="ds-actions__btns">
          <button
            type="button"
            className="ds-btn ds-btn--secondary"
            onClick={resetChanges}
            disabled={!dirty || saving}
          >
            <RotateCcw size={15} />
            Reset Changes
          </button>
          <button
            type="button"
            className="ds-btn ds-btn--primary"
            onClick={handleSave}
            disabled={!dirty || saving}
          >
            {saving ? <Loader2 size={15} className="ds-spin" /> : null}
            {saving ? 'Saving…' : 'Save Settings'}
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
              <button type="button" className="ds-btn ds-btn--secondary" onClick={() => setPasswordModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="ds-change-password-form"
                className="ds-btn ds-btn--primary"
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating…' : 'Update Password'}
              </button>
            </>
          )}
        >
          <form id="ds-change-password-form" onSubmit={handleChangePassword} className="ds-form">
            <PasswordField
              id="ds-current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
            <PasswordField
              id="ds-new-password"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
            />
            <PasswordField
              id="ds-confirm-password"
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
          subtitle="Your account will be paused and you will be signed out."
          onClose={() => setDeactivateModal(false)}
          footer={(
            <>
              <button type="button" className="ds-btn ds-btn--secondary" onClick={() => setDeactivateModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="ds-deactivate-form"
                className="ds-btn ds-btn--warning"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deactivating…' : 'Deactivate'}
              </button>
            </>
          )}
        >
          <form id="ds-deactivate-form" onSubmit={handleDeactivate} className="ds-form">
            <p className="ds-modal-note">Enter your password to confirm deactivation.</p>
            <PasswordField
              id="ds-deactivate-password"
              label="Password"
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
          subtitle="This permanently removes access to your donor account."
          onClose={() => setDeleteModal(false)}
          footer={(
            <>
              <button type="button" className="ds-btn ds-btn--secondary" onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                form="ds-delete-form"
                className="ds-btn ds-btn--danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting…' : 'Delete Account'}
              </button>
            </>
          )}
        >
          <form id="ds-delete-form" onSubmit={handleDelete} className="ds-form">
            <p className="ds-modal-note">
              Type <strong>DELETE</strong> and enter your password to confirm.
            </p>
            <label className="ds-field" htmlFor="ds-delete-confirm">
              <span>Confirmation</span>
              <input
                id="ds-delete-confirm"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </label>
            <PasswordField
              id="ds-delete-password"
              label="Password"
              value={deletePassword}
              onChange={setDeletePassword}
              autoComplete="current-password"
            />
          </form>
        </SettingsModal>
      )}

      {activityModal && (
        <SettingsModal
          title="Activity log"
          subtitle="Recent sign-in attempts for your account."
          onClose={() => setActivityModal(false)}
          footer={(
            <button type="button" className="ds-btn ds-btn--primary" onClick={() => setActivityModal(false)}>
              Close
            </button>
          )}
        >
          <div className="ds-activity-list">
            {(security?.recent_logins || []).length === 0 ? (
              <p className="ds-modal-note">No login activity recorded yet.</p>
            ) : (
              security.recent_logins.map((row, index) => (
                <div key={`${row.login_time}-${index}`} className="ds-activity-row">
                  <div>
                    <strong>{row.status === 'SUCCESS' ? 'Successful sign-in' : 'Failed attempt'}</strong>
                    <p>{formatLastLogin(row.login_time, settings.timezone)}</p>
                  </div>
                  <span className={`ds-activity-badge${row.status === 'SUCCESS' ? ' is-success' : ' is-failed'}`}>
                    {row.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </SettingsModal>
      )}
    </div>
  );
}
