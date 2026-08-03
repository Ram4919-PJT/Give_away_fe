import { useMemo, useState } from 'react';
import {
  Bell, HeartHandshake, Shield, SlidersHorizontal, Database, AlertTriangle,
  KeyRound, ShieldCheck, MonitorSmartphone, Download, FileSpreadsheet,
  History, RotateCcw, CreditCard, Truck, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  INITIAL_DONOR_SETTINGS,
  DONOR_NOTIFICATION_TOGGLES,
  DONOR_CATEGORIES,
  DONOR_LANGUAGE_OPTIONS,
  DONOR_TIMEZONE_OPTIONS,
  DONOR_DATE_FORMAT_OPTIONS
} from '../../data/donorSettingsData';

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

export default function DonorSettingsPage() {
  const { currentUser, dispatch } = useApp();
  const { showToast } = useToast();

  const initial = useMemo(
    () => ({
      ...INITIAL_DONOR_SETTINGS,
      ...(currentUser?.settings || {})
    }),
    [currentUser]
  );

  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dirty = JSON.stringify(settings) !== baseline;

  const patch = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category) => {
    setSettings((prev) => {
      const list = prev.preferredCategories || [];
      const next = list.includes(category)
        ? list.filter((c) => c !== category)
        : [...list, category];
      return { ...prev, preferredCategories: next };
    });
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

  const selectedCount = settings.preferredCategories?.length || 0;

  return (
    <div className="ds-page donor-page donor-module page-route">
      <header className="ds-hero">
        <h1>Settings</h1>
        <p>Manage your account preferences, notifications, privacy, and donation settings.</p>
      </header>

      <div className="ds-stack">
        <section className="ds-card">
          <header className="ds-card__head">
            <Bell size={18} aria-hidden="true" />
            <div>
              <h2>Notification Preferences</h2>
              <p>Choose how you want to hear about donations and account activity.</p>
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
              <p>Set defaults for how and what you prefer to donate.</p>
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
                <strong>Default Payment Preference</strong>
                <p>Manage your preferred payment method for future contributions.</p>
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--secondary"
                onClick={() => showToast('Payment preferences opened', 'success')}
              >
                <CreditCard size={15} />
                Manage
              </button>
            </div>
            <div className="ds-pref-row">
              <div>
                <strong>Default Pickup Preference</strong>
                <p>Coming soon — set preferred pickup windows for item donations.</p>
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--ghost"
                onClick={() => showToast('Pickup preferences coming soon', 'success')}
              >
                <Truck size={15} />
                Coming soon
              </button>
            </div>
          </div>
        </section>

        <section className="ds-card">
          <header className="ds-card__head">
            <Shield size={18} aria-hidden="true" />
            <div>
              <h2>Privacy & Security</h2>
              <p>Protect your account and review recent access activity.</p>
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
                onClick={() => showToast('Password change flow opened', 'success')}
              >
                <KeyRound size={15} />
                Change Password
              </button>
            </div>

            <Toggle
              id="ds-2fa"
              title="Two-Factor Authentication"
              description="Add an extra verification step when signing in. Future-ready."
              checked={!!settings.twoFactorEnabled}
              onChange={(value) => {
                patch('twoFactorEnabled', value);
                if (value) showToast('2FA setup coming soon', 'success');
              }}
            />

            <div className="ds-security__row">
              <div>
                <strong>Active Sessions</strong>
                <p>Review devices currently signed in to your donor account.</p>
              </div>
              <div className="ds-security__actions">
                <span className="ds-badge ds-badge--info">1 active</span>
                <button
                  type="button"
                  className="ds-btn ds-btn--ghost"
                  onClick={() => showToast('Active sessions reviewed', 'success')}
                >
                  <MonitorSmartphone size={15} />
                  View
                </button>
              </div>
            </div>

            <div className="ds-security__row">
              <div>
                <strong>Last Login Information</strong>
                <p>Most recent successful sign-in to this account.</p>
              </div>
              <span className="ds-meta">Today · 09:18 AM IST</span>
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
              onClick={() => showToast('Downloading donation history…', 'success')}
            >
              <Download size={15} />
              Download Donation History
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--secondary"
              onClick={() => showToast('Exporting account data…', 'success')}
            >
              <FileSpreadsheet size={15} />
              Export Account Data
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--secondary"
              onClick={() => showToast('Opening activity log…', 'success')}
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
              <p>These actions are irreversible and may remove access to donation history.</p>
            </div>
          </header>
          <p className="ds-danger-note">
            Deactivating or deleting your account will pause donation participation. Please confirm
            carefully before continuing.
          </p>
          <div className="ds-danger-actions">
            <button
              type="button"
              className="ds-btn ds-btn--warning"
              onClick={() => confirmDanger('Deactivate Account')}
            >
              Deactivate Account
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--danger"
              onClick={() => confirmDanger('Delete Account')}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      <div className={`ds-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="ds-unsaved" role="status">
            Unsaved Changes
          </span>
        )}
        <div className="ds-actions__btns">
          <button
            type="button"
            className="ds-btn ds-btn--secondary"
            onClick={resetChanges}
            disabled={!dirty}
          >
            <RotateCcw size={15} />
            Reset Changes
          </button>
          <button
            type="button"
            className="ds-btn ds-btn--primary"
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
