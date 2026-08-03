import { useMemo, useState } from 'react';
import {
  Bell, SlidersHorizontal, Shield, Lock, Database, AlertTriangle,
  KeyRound, MonitorSmartphone, ShieldCheck, Download, FileSpreadsheet,
  History, RotateCcw
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  INITIAL_NGO_SETTINGS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  NOTIFICATION_TOGGLES,
  PRIVACY_TOGGLES
} from '../../../data/ngoSettingsData';

function Toggle({ id, checked, onChange, title, description }) {
  return (
    <div className="ns-toggle-row">
      <div className="ns-toggle-row__text">
        <label htmlFor={id}>{title}</label>
        <p>{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`ns-switch${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="ns-switch__thumb" />
      </button>
    </div>
  );
}

function SettingSelect({ id, label, value, onChange, options }) {
  return (
    <label className="ns-select" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function NgoSettingsPage() {
  const { currentUser, dispatch } = useApp();
  const { showToast } = useToast();

  const initial = useMemo(
    () => ({
      ...INITIAL_NGO_SETTINGS,
      ...(currentUser?.settings || {}),
      emailNotifications:
        currentUser?.settings?.emailNotifications ??
        INITIAL_NGO_SETTINGS.emailNotifications
    }),
    [currentUser]
  );

  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(settings) !== baseline;

  const patch = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetChanges = () => {
    setSettings(JSON.parse(baseline));
    showToast('Changes discarded', 'success');
  };

  const saveSettings = () => {
    if (!dirty) return;
    dispatch({
      type: 'UPDATE_USER',
      payload: { settings: { ...settings } }
    });
    setBaseline(JSON.stringify(settings));
    showToast('Settings saved.', 'success');
  };

  const confirmDanger = (actionLabel) => {
    const ok = window.confirm(
      `${actionLabel}\n\nThis is a sensitive action. Are you sure you want to continue?`
    );
    if (ok) showToast(`${actionLabel} request submitted for review`, 'success');
  };

  return (
    <div className="ns-page ngo-page ngo-module page-route">
      <header className="ns-hero">
        <h1>Settings</h1>
        <p>Manage your organization preferences, notifications, privacy, and security.</p>
      </header>

      <div className="ns-stack">
        <section className="ns-card">
          <header className="ns-card__head">
            <Bell size={18} aria-hidden="true" />
            <div>
              <h2>Notification Preferences</h2>
              <p>Choose how your organization receives updates and alerts.</p>
            </div>
          </header>
          <div className="ns-list">
            {NOTIFICATION_TOGGLES.map((item) => (
              <Toggle
                key={item.key}
                id={`ns-${item.key}`}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => patch(item.key, value)}
              />
            ))}
          </div>
        </section>

        <section className="ns-card">
          <header className="ns-card__head">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <div>
              <h2>Account Preferences</h2>
              <p>Set language, regional formats, and appearance preferences.</p>
            </div>
          </header>
          <div className="ns-grid">
            <SettingSelect
              id="ns-language"
              label="Preferred Language"
              value={settings.language}
              onChange={(v) => patch('language', v)}
              options={LANGUAGE_OPTIONS}
            />
            <SettingSelect
              id="ns-timezone"
              label="Time Zone"
              value={settings.timezone}
              onChange={(v) => patch('timezone', v)}
              options={TIMEZONE_OPTIONS}
            />
            <SettingSelect
              id="ns-date"
              label="Date Format"
              value={settings.dateFormat}
              onChange={(v) => patch('dateFormat', v)}
              options={DATE_FORMAT_OPTIONS}
            />
          </div>

          <div className="ns-theme">
            <span className="ns-theme__label">Theme</span>
            <div className="ns-theme__options" role="radiogroup" aria-label="Theme">
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'light'}
                className={`ns-theme-card${settings.theme === 'light' ? ' is-selected' : ''}`}
                onClick={() => patch('theme', 'light')}
              >
                Light Mode
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'dark'}
                className={`ns-theme-card${settings.theme === 'dark' ? ' is-selected' : ''}`}
                onClick={() => {
                  patch('theme', 'dark');
                  showToast('Dark Mode coming soon', 'success');
                }}
              >
                Dark Mode
                <em>Coming soon</em>
              </button>
            </div>
          </div>
        </section>

        <section className="ns-card">
          <header className="ns-card__head">
            <Shield size={18} aria-hidden="true" />
            <div>
              <h2>Security</h2>
              <p>Protect your organization account and review access activity.</p>
            </div>
          </header>
          <div className="ns-security">
            <div className="ns-security__row">
              <div>
                <strong>Change Password</strong>
                <p>Update your account password regularly for better security.</p>
              </div>
              <button
                type="button"
                className="ns-btn ns-btn--secondary"
                onClick={() => showToast('Password change flow opened', 'success')}
              >
                <KeyRound size={15} />
                Change Password
              </button>
            </div>

            <div className="ns-security__row">
              <div>
                <strong>Last Login</strong>
                <p>Most recent successful sign-in to this account.</p>
              </div>
              <span className="ns-meta">Today · 10:42 AM IST</span>
            </div>

            <div className="ns-security__row">
              <div>
                <strong>Active Sessions</strong>
                <p>Devices currently signed in to your organization account.</p>
              </div>
              <div className="ns-security__actions">
                <span className="ns-badge ns-badge--info">2 active</span>
                <button
                  type="button"
                  className="ns-btn ns-btn--ghost"
                  onClick={() => showToast('Active sessions reviewed', 'success')}
                >
                  <MonitorSmartphone size={15} />
                  Manage
                </button>
              </div>
            </div>

            <div className="ns-security__row">
              <div>
                <strong>Two-Factor Authentication</strong>
                <p>Add an extra layer of protection to sensitive NGO actions.</p>
              </div>
              <div className="ns-security__actions">
                <span className="ns-badge ns-badge--warning">Not enabled</span>
                <button
                  type="button"
                  className="ns-btn ns-btn--secondary"
                  onClick={() => showToast('2FA setup coming soon', 'success')}
                >
                  <ShieldCheck size={15} />
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="ns-card">
          <header className="ns-card__head">
            <Lock size={18} aria-hidden="true" />
            <div>
              <h2>Privacy</h2>
              <p>Control what donors and the public can see about your organization.</p>
            </div>
          </header>
          <div className="ns-list">
            {PRIVACY_TOGGLES.map((item) => (
              <Toggle
                key={item.key}
                id={`ns-${item.key}`}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => patch(item.key, value)}
              />
            ))}
          </div>
        </section>

        <section className="ns-card">
          <header className="ns-card__head">
            <Database size={18} aria-hidden="true" />
            <div>
              <h2>Data & Reports</h2>
              <p>Download logs and export organization records.</p>
            </div>
          </header>
          <div className="ns-data-actions">
            <button
              type="button"
              className="ns-btn ns-btn--secondary"
              onClick={() => showToast('Downloading activity log…', 'success')}
            >
              <History size={15} />
              Download Activity Log
            </button>
            <button
              type="button"
              className="ns-btn ns-btn--secondary"
              onClick={() => showToast('Exporting organization data…', 'success')}
            >
              <FileSpreadsheet size={15} />
              Export Organization Data
            </button>
            <button
              type="button"
              className="ns-btn ns-btn--secondary"
              onClick={() => showToast('Downloading donation history…', 'success')}
            >
              <Download size={15} />
              Download Donation History
            </button>
          </div>
        </section>

        <section className="ns-card ns-card--danger">
          <header className="ns-card__head">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <h2>Danger Zone</h2>
              <p>These actions are irreversible and may suspend platform access.</p>
            </div>
          </header>
          <p className="ns-danger-note">
            Deactivating or deleting your organization will pause donation matching and lock
            beneficiary workflows. Please confirm carefully before proceeding.
          </p>
          <div className="ns-danger-actions">
            <button
              type="button"
              className="ns-btn ns-btn--warning"
              onClick={() => confirmDanger('Deactivate Organization')}
            >
              Deactivate Organization
            </button>
            <button
              type="button"
              className="ns-btn ns-btn--danger"
              onClick={() => confirmDanger('Delete Organization Account')}
            >
              Delete Organization Account
            </button>
          </div>
        </section>
      </div>

      <div className={`ns-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="ns-unsaved" role="status">
            Unsaved Changes
          </span>
        )}
        <div className="ns-actions__btns">
          <button
            type="button"
            className="ns-btn ns-btn--secondary"
            onClick={resetChanges}
            disabled={!dirty}
          >
            <RotateCcw size={15} />
            Reset Changes
          </button>
          <button
            type="button"
            className="ns-btn ns-btn--primary"
            onClick={saveSettings}
            disabled={!dirty}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
