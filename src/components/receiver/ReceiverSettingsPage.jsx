import { useMemo, useState } from 'react';
import {
  Bell, ClipboardList, Lock, SlidersHorizontal, Shield, Database,
  HelpCircle, AlertTriangle, KeyRound, MonitorSmartphone, ShieldCheck,
  Download, FileSpreadsheet, History, RotateCcw, BookOpen,
  Flag, LifeBuoy, FileText
} from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  getReceiverApps,
  getReceiverStats,
  getInitials
} from '../../utils/receiverHelpers';
import {
  INITIAL_RECEIVER_SETTINGS,
  RECEIVER_NOTIFICATION_TOGGLES,
  RECEIVER_PRIVACY_TOGGLES,
  RECEIVER_CONTACT_OPTIONS,
  RECEIVER_CATEGORY_OPTIONS,
  RECEIVER_LANGUAGE_OPTIONS,
  RECEIVER_TIMEZONE_OPTIONS,
  RECEIVER_DATE_FORMAT_OPTIONS
} from '../../data/receiverSettingsData';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function Toggle({ id, checked, onChange, title, description }) {
  return (
    <div className="rs-toggle-row">
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
        className={`rs-switch${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
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

export default function ReceiverSettingsPage() {
  const { currentUser, receiverApplications, dispatch } = useApp();
  const { showToast } = useToast();

  const apps = useMemo(
    () => getReceiverApps(receiverApplications, currentUser),
    [receiverApplications, currentUser]
  );
  const stats = useMemo(() => getReceiverStats(apps), [apps]);
  const verified = isRoleVerified(currentUser);

  const initial = useMemo(
    () => ({
      ...INITIAL_RECEIVER_SETTINGS,
      ...(currentUser?.settings || {})
    }),
    [currentUser]
  );

  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(settings) !== baseline;

  const patch = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

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

  const notifOn =
    settings.emailNotifications || settings.smsNotifications || settings.reminderNotifications;

  return (
    <div className="rs-page receiver-page receiver-module page-route">
      <header className="rs-hero">
        <h1>Settings</h1>
        <p>Manage your account preferences, notifications, privacy, and request settings.</p>
      </header>

      <section className="rs-overview" aria-label="Account overview">
        <div className="rs-overview__avatar" aria-hidden="true">
          {getInitials(currentUser?.name)}
        </div>
        <div className="rs-overview__meta">
          <h2>{currentUser?.name || 'Receiver'}</h2>
          <div className="rs-overview__badges">
            <span className={`rs-pill ${verified ? 'rs-pill--success' : 'rs-pill--warning'}`}>
              {verified ? 'Verified' : 'Registered'}
            </span>
            <span className="rs-overview__muted">
              Member since {formatDate(currentUser?.memberSince)}
            </span>
          </div>
        </div>
        <div className="rs-overview__stats">
          <div>
            <strong>{stats.underReview}</strong>
            <span>Active Requests</span>
          </div>
          <div>
            <strong>{stats.approved}</strong>
            <span>Completed Requests</span>
          </div>
          <div>
            <strong>{notifOn ? 'On' : 'Off'}</strong>
            <span>Notifications</span>
          </div>
        </div>
      </section>

      <div className="rs-stack">
        <section className="rs-card">
          <header className="rs-card__head">
            <Bell size={18} aria-hidden="true" />
            <div>
              <h2>Notification Preferences</h2>
              <p>Choose how you want to hear about request updates and reminders.</p>
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
              <h2>Request Preferences</h2>
              <p>Defaults that help NGOs support your assistance needs.</p>
            </div>
          </header>

          <div className="rs-grid">
            <SettingSelect
              id="rs-contact"
              label="Preferred Contact Method"
              value={settings.preferredContactMethod}
              onChange={(v) => patch('preferredContactMethod', v)}
              options={RECEIVER_CONTACT_OPTIONS}
            />
            <SettingSelect
              id="rs-category"
              label="Default Request Category"
              value={settings.defaultRequestCategory}
              onChange={(v) => patch('defaultRequestCategory', v)}
              options={RECEIVER_CATEGORY_OPTIONS}
            />
          </div>

          <div className="rs-list">
            <Toggle
              id="rs-alt"
              title="Receive Alternative Item Suggestions"
              description="Allow the platform to suggest similar available items for your requests."
              checked={!!settings.alternativeSuggestions}
              onChange={(v) => patch('alternativeSuggestions', v)}
            />
            <Toggle
              id="rs-recommend"
              title="Allow NGOs to Recommend Similar Items"
              description="Let verified NGOs propose comparable support options."
              checked={!!settings.allowNgoRecommendations}
              onChange={(v) => patch('allowNgoRecommendations', v)}
            />
            <Toggle
              id="rs-draft"
              title="Auto-save Draft Requests"
              description="Automatically save unfinished request drafts as you type."
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
              <p>Control what NGOs and the public can see about your account.</p>
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
              <h2>Account Preferences</h2>
              <p>Language, regional formats, and appearance.</p>
            </div>
          </header>
          <div className="rs-grid rs-grid--3">
            <SettingSelect
              id="rs-language"
              label="Preferred Language"
              value={settings.language}
              onChange={(v) => patch('language', v)}
              options={RECEIVER_LANGUAGE_OPTIONS}
            />
            <SettingSelect
              id="rs-timezone"
              label="Time Zone"
              value={settings.timezone}
              onChange={(v) => patch('timezone', v)}
              options={RECEIVER_TIMEZONE_OPTIONS}
            />
            <SettingSelect
              id="rs-date"
              label="Date Format"
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
                Light Mode
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={settings.theme === 'dark'}
                className={`rs-theme-card${settings.theme === 'dark' ? ' is-selected' : ''}`}
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

        <section className="rs-card">
          <header className="rs-card__head">
            <Shield size={18} aria-hidden="true" />
            <div>
              <h2>Security</h2>
              <p>Protect your account and review recent access activity.</p>
            </div>
          </header>
          <div className="rs-security">
            <div className="rs-security__row">
              <div>
                <strong>Change Password</strong>
                <p>Update your password regularly for better security.</p>
              </div>
              <button
                type="button"
                className="rs-btn rs-btn--secondary"
                onClick={() => showToast('Password change flow opened', 'success')}
              >
                <KeyRound size={15} /> Change Password
              </button>
            </div>
            <div className="rs-security__row">
              <div>
                <strong>Last Login</strong>
                <p>Most recent successful sign-in to this account.</p>
              </div>
              <span className="rs-meta">Today · 11:05 AM IST</span>
            </div>
            <div className="rs-security__row">
              <div>
                <strong>Active Sessions</strong>
                <p>Devices currently signed in to your receiver account.</p>
              </div>
              <div className="rs-security__actions">
                <span className="rs-pill rs-pill--info">1 active</span>
                <button
                  type="button"
                  className="rs-btn rs-btn--ghost"
                  onClick={() => showToast('Active sessions reviewed', 'success')}
                >
                  <MonitorSmartphone size={15} /> Manage
                </button>
              </div>
            </div>
            <div className="rs-security__row">
              <div>
                <strong>Two-Factor Authentication</strong>
                <p>Future-ready extra protection for sensitive actions.</p>
              </div>
              <div className="rs-security__actions">
                <span className="rs-pill rs-pill--warning">Not enabled</span>
                <button
                  type="button"
                  className="rs-btn rs-btn--secondary"
                  onClick={() => showToast('2FA setup coming soon', 'success')}
                >
                  <ShieldCheck size={15} /> Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <Database size={18} aria-hidden="true" />
            <div>
              <h2>Data & History</h2>
              <p>Download your request history and account activity.</p>
            </div>
          </header>
          <div className="rs-data-actions">
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => showToast('Downloading request history…', 'success')}
            >
              <Download size={15} /> Download Request History
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => showToast('Exporting account data…', 'success')}
            >
              <FileSpreadsheet size={15} /> Export Account Data
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => showToast('Opening activity log…', 'success')}
            >
              <History size={15} /> View Activity Log
            </button>
          </div>
        </section>

        <section className="rs-card">
          <header className="rs-card__head">
            <HelpCircle size={18} aria-hidden="true" />
            <div>
              <h2>Help & Support</h2>
              <p>Get help with requests, verification, and account issues.</p>
            </div>
          </header>
          <div className="rs-data-actions">
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => showToast('Opening support chat…', 'success')}
            >
              <LifeBuoy size={15} /> Contact Support
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--secondary"
              onClick={() => showToast('Issue report form opened', 'success')}
            >
              <Flag size={15} /> Report an Issue
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--ghost"
              onClick={() => showToast('FAQs opened', 'success')}
            >
              <BookOpen size={15} /> FAQs
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--ghost"
              onClick={() => showToast('Community guidelines opened', 'success')}
            >
              <FileText size={15} /> Community Guidelines
            </button>
          </div>
        </section>

        <section className="rs-card rs-card--danger">
          <header className="rs-card__head">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <h2>Danger Zone</h2>
              <p>These actions are irreversible and may pause assistance access.</p>
            </div>
          </header>
          <p className="rs-danger-note">
            Deactivating or deleting your account will pause request matching and may remove access
            to application history. Please confirm carefully before continuing.
          </p>
          <div className="rs-danger-actions">
            <button
              type="button"
              className="rs-btn rs-btn--warning"
              onClick={() => confirmDanger('Deactivate Account')}
            >
              Deactivate Account
            </button>
            <button
              type="button"
              className="rs-btn rs-btn--danger"
              onClick={() => confirmDanger('Delete Account')}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      <div className={`rs-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="rs-unsaved" role="status">
            Unsaved Changes
          </span>
        )}
        <div className="rs-actions__btns">
          <button
            type="button"
            className="rs-btn rs-btn--secondary"
            onClick={resetChanges}
            disabled={!dirty}
          >
            <RotateCcw size={15} /> Reset Changes
          </button>
          <button
            type="button"
            className="rs-btn rs-btn--primary"
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
