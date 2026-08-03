import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Pencil, Ban, Trash2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import {
  ADMIN_SETTINGS_CATEGORIES, ADMIN_ASSISTANCE_CATEGORIES, ADMIN_SETTINGS_DEFAULTS,
  ADMIN_EMAIL_TEMPLATES, ADMIN_LOGIN_HISTORY, ADMIN_ROLE_PERMISSIONS
} from '../../../data/adminSettingsMockData';

function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <label className="settings-dash-toggle">
      <div className="settings-dash-toggle__text">
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="settings-dash-toggle__track" aria-hidden="true" />
    </label>
  );
}

function SettingsField({ label, description, children }) {
  return (
    <div className="settings-dash-field">
      <div className="settings-dash-field__label">
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </div>
      <div className="settings-dash-field__control">{children}</div>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <section className="settings-dash-section">
      <header className="settings-dash-section__head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      <div className="settings-dash-section__body">{children}</div>
    </section>
  );
}

function SecurityPanel({ settings, update, showToast }) {
  return (
    <>
      <SettingsSection title="Authentication" description="Manage administrator authentication and session security.">
        <SettingsField label="Change Password" description="Update your administrator account password.">
          <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Change password dialog (mock).', 'info')}>Change Password</button>
        </SettingsField>
        <SettingsToggle label="Two-Factor Authentication (2FA)" description="Require a verification code at login." checked={settings.twoFactor} onChange={(v) => update('twoFactor', v)} />
        <SettingsField label="Session Timeout" description="Automatically log out inactive administrators.">
          <select className="settings-dash-input" value={settings.sessionTimeout} onChange={(e) => update('sessionTimeout', e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </SettingsField>
        <SettingsToggle label="IP Whitelist" description="Restrict admin access to approved IP addresses." checked={settings.ipWhitelist} onChange={(v) => update('ipWhitelist', v)} />
      </SettingsSection>
      <SettingsSection title="Role Permissions" description="Overview of platform roles and access levels.">
        <div className="settings-dash-table-wrap">
          <table className="settings-dash-table">
            <thead><tr><th>Role</th><th>Users</th><th>Access Level</th><th>Actions</th></tr></thead>
            <tbody>
              {ADMIN_ROLE_PERMISSIONS.map((r) => (
                <tr key={r.role}>
                  <td><strong>{r.role}</strong></td>
                  <td>{r.users}</td>
                  <td>{r.access}</td>
                  <td><button type="button" className="settings-dash-btn settings-dash-btn--ghost" onClick={() => showToast(`Edit ${r.role} permissions (mock).`, 'info')}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
      <SettingsSection title="Login History" description="Recent administrator login attempts.">
        <div className="settings-dash-table-wrap">
          <table className="settings-dash-table">
            <thead><tr><th>Date & Time</th><th>IP Address</th><th>Device</th><th>Status</th></tr></thead>
            <tbody>
              {ADMIN_LOGIN_HISTORY.map((h) => (
                <tr key={h.time}>
                  <td>{h.time}</td>
                  <td className="settings-dash-table__mono">{h.ip}</td>
                  <td>{h.device}</td>
                  <td><span className={`settings-dash-status settings-dash-status--${h.status === 'Success' ? 'ok' : 'fail'}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </>
  );
}

function NotificationsPanel({ settings, update }) {
  return (
    <SettingsSection title="Notification Preferences" description="Configure how administrators receive platform alerts.">
      <SettingsToggle label="Email Alerts" description="Send email notifications for important events." checked={settings.emailAlerts} onChange={(v) => update('emailAlerts', v)} />
      <SettingsToggle label="Push Notifications" description="Browser push notifications for urgent items." checked={settings.pushAlerts} onChange={(v) => update('pushAlerts', v)} />
      <SettingsToggle label="Urgent Only Mode" description="Only notify for high-priority events." checked={settings.urgentOnly} onChange={(v) => update('urgentOnly', v)} />
      <SettingsField label="Digest Frequency" description="How often to send summary emails.">
        <select className="settings-dash-input" value={settings.digestFrequency} onChange={(e) => update('digestFrequency', e.target.value)}>
          <option value="realtime">Real-time</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Summary</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function AppearancePanel({ settings, update, showToast }) {
  return (
    <SettingsSection title="Platform Appearance" description="Customize branding and visual defaults for the platform.">
      <SettingsField label="Theme" description="Default color scheme for the admin panel.">
        <select className="settings-dash-input" value={settings.theme} onChange={(e) => update('theme', e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </SettingsField>
      <SettingsField label="Platform Logo" description="Upload or replace the platform logo.">
        <div className="settings-dash-logo-placeholder">Logo Placeholder — Wireframe UI</div>
        <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Upload logo (mock).', 'info')}>Upload Logo</button>
      </SettingsField>
      <SettingsField label="Platform Name" description="Displayed across the application header.">
        <input type="text" className="settings-dash-input" value={settings.platformName} onChange={(e) => update('platformName', e.target.value)} />
      </SettingsField>
      <SettingsField label="Primary Color" description="Main accent color for buttons and highlights.">
        <div className="settings-dash-color-row">
          <input type="color" value={settings.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} aria-label="Primary color" />
          <input type="text" className="settings-dash-input settings-dash-input--sm" value={settings.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} />
        </div>
      </SettingsField>
      <SettingsField label="Dashboard Layout" description="Default admin dashboard layout style.">
        <select className="settings-dash-input" value={settings.layout} onChange={(e) => update('layout', e.target.value)}>
          <option value="default">Default Grid</option>
          <option value="compact">Compact View</option>
          <option value="expanded">Expanded Analytics</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function SystemPanel({ settings, update }) {
  return (
    <SettingsSection title="System Configuration" description="General platform and maintenance settings.">
      <SettingsToggle label="Maintenance Mode" description="Temporarily disable public access for maintenance." checked={settings.maintenanceMode} onChange={(v) => update('maintenanceMode', v)} />
      <SettingsToggle label="Debug Mode" description="Enable verbose logging for troubleshooting." checked={settings.debugMode} onChange={(v) => update('debugMode', v)} />
      <SettingsField label="Default Language" description="Platform default language.">
        <select className="settings-dash-input" value={settings.defaultLanguage} onChange={(e) => update('defaultLanguage', e.target.value)}>
          <option value="en-IN">English (India)</option>
          <option value="hi">Hindi</option>
        </select>
      </SettingsField>
      <SettingsField label="Timezone" description="Default timezone for reports and timestamps.">
        <select className="settings-dash-input" value={settings.timezone} onChange={(e) => update('timezone', e.target.value)}>
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="UTC">UTC</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function VerificationPanel({ settings, update }) {
  return (
    <SettingsSection title="Verification Settings" description="Configure identity verification rules across user types.">
      <SettingsToggle label="Donor Badge Rules" description="Enable verified donor badge after document review." checked={settings.donorBadgeRules} onChange={(v) => update('donorBadgeRules', v)} />
      <SettingsToggle label="Receiver Verification" description="Require document verification for receivers." checked={settings.receiverVerification} onChange={(v) => update('receiverVerification', v)} />
      <SettingsToggle label="NGO Verification" description="Require NGO registration document review." checked={settings.ngoVerification} onChange={(v) => update('ngoVerification', v)} />
      <SettingsToggle label="Manual Review" description="All verifications require administrator approval." checked={settings.manualReview} onChange={(v) => update('manualReview', v)} />
      <SettingsField label="Required Documents" description="Document set required for verification.">
        <select className="settings-dash-input" value={settings.requiredDocs} onChange={(e) => update('requiredDocs', e.target.value)}>
          <option value="standard">Standard (ID + Address Proof)</option>
          <option value="enhanced">Enhanced (ID + Income + References)</option>
          <option value="ngo-full">NGO Full (Registration + PAN + Bank)</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function DonationPanel({ settings, update }) {
  return (
    <SettingsSection title="Donation Settings" description="Configure donation types and limits.">
      <SettingsToggle label="Enable Item Donations" description="Allow donors to contribute physical items." checked={settings.itemDonations} onChange={(v) => update('itemDonations', v)} />
      <SettingsToggle label="Enable Money Donations" description="Allow financial contributions." checked={settings.moneyDonations} onChange={(v) => update('moneyDonations', v)} />
      <SettingsToggle label="Anonymous Donations" description="Allow donors to donate without public attribution." checked={settings.anonymous} onChange={(v) => update('anonymous', v)} />
      <SettingsField label="Minimum Donation (₹)" description="Lowest allowed donation amount.">
        <input type="number" className="settings-dash-input" value={settings.minDonation} onChange={(e) => update('minDonation', e.target.value)} />
      </SettingsField>
      <SettingsField label="Maximum Donation (₹)" description="Highest single donation amount.">
        <input type="number" className="settings-dash-input" value={settings.maxDonation} onChange={(e) => update('maxDonation', e.target.value)} />
      </SettingsField>
    </SettingsSection>
  );
}

function FinancialPanel({ settings, update }) {
  return (
    <SettingsSection title="Financial Settings" description="Fund limits, budgets, and allocation rules.">
      <SettingsField label="Emergency Fund Limit (₹)" description="Maximum emergency disbursement per case.">
        <input type="number" className="settings-dash-input" value={settings.emergencyLimit} onChange={(e) => update('emergencyLimit', e.target.value)} />
      </SettingsField>
      <SettingsField label="Monthly Budget (₹)" description="Platform-wide monthly fund budget cap.">
        <input type="number" className="settings-dash-input" value={settings.monthlyBudget} onChange={(e) => update('monthlyBudget', e.target.value)} />
      </SettingsField>
      <SettingsField label="Maximum Aid Amount (₹)" description="Maximum assistance per beneficiary request.">
        <input type="number" className="settings-dash-input" value={settings.maxAid} onChange={(e) => update('maxAid', e.target.value)} />
      </SettingsField>
      <SettingsToggle label="Auto-Allocate Funds" description="Automatically allocate verified donations to categories." checked={settings.autoAllocate} onChange={(v) => update('autoAllocate', v)} />
      <SettingsField label="Fund Allocation Rules" description="Default allocation strategy.">
        <select className="settings-dash-input">
          <option>Priority-based (Emergency first)</option>
          <option>Proportional by category</option>
          <option>Manual approval required</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function CategoriesPanel({ showToast }) {
  const [categories] = useState(ADMIN_ASSISTANCE_CATEGORIES);
  return (
    <SettingsSection title="Category Management" description="Manage assistance categories available on the platform.">
      <div className="settings-dash-cat-actions">
        <button type="button" className="settings-dash-btn settings-dash-btn--primary" onClick={() => showToast('Add category (mock).', 'info')}><Plus size={14} /> Add Category</button>
      </div>
      <div className="settings-dash-table-wrap">
        <table className="settings-dash-table">
          <thead><tr><th>Category</th><th>Status</th><th>Requests</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><span className={`settings-dash-status settings-dash-status--${c.status === 'Active' ? 'ok' : 'muted'}`}>{c.status}</span></td>
                <td>{c.requests}</td>
                <td>
                  <div className="settings-dash-table__actions">
                    <button type="button" className="settings-dash-btn settings-dash-btn--ghost" onClick={() => showToast(`Edit ${c.name} (mock).`, 'info')}><Pencil size={14} /></button>
                    <button type="button" className="settings-dash-btn settings-dash-btn--ghost" onClick={() => showToast(`Toggle ${c.name} (mock).`, 'info')}><Ban size={14} /></button>
                    <button type="button" className="settings-dash-btn settings-dash-btn--ghost" onClick={() => showToast(`Delete ${c.name} (mock).`, 'info')}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsSection>
  );
}

function EmailPanel({ showToast }) {
  return (
    <SettingsSection title="Email Templates" description="Manage automated email templates sent by the platform.">
      <div className="settings-dash-email-grid">
        {ADMIN_EMAIL_TEMPLATES.map((t) => (
          <article key={t.id} className="settings-dash-email-card">
            <h4>{t.name}</h4>
            <p>{t.subject}</p>
            <span>Updated {t.updated}</span>
            <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast(`Edit ${t.name} (mock).`, 'info')}>Edit Template</button>
          </article>
        ))}
      </div>
    </SettingsSection>
  );
}

function AuditPanel({ settings, update, showToast }) {
  return (
    <SettingsSection title="Audit & Logs" description="Activity logging and audit trail configuration.">
      <SettingsToggle label="Enable Activity Logs" description="Record all platform and admin activities." checked={settings.activityLogs} onChange={(v) => update('activityLogs', v)} />
      <SettingsField label="Retention Period" description="How long to keep log entries.">
        <select className="settings-dash-input" value={settings.retentionDays} onChange={(e) => update('retentionDays', e.target.value)}>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="180">180 days</option>
          <option value="365">1 year</option>
        </select>
      </SettingsField>
      <SettingsToggle label="Auto-Export Logs" description="Automatically export logs monthly." checked={settings.autoExport} onChange={(v) => update('autoExport', v)} />
      <div className="settings-dash-inline-actions">
        <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Exporting logs (mock).', 'info')}><Download size={14} /> Export Logs</button>
        <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Downloading audit report (mock).', 'info')}>Download Audit Report</button>
      </div>
    </SettingsSection>
  );
}

function ApiPanel({ settings, update, showToast }) {
  return (
    <SettingsSection title="API & Integrations" description="Manage external integrations and API access.">
      <SettingsToggle label="Webhooks Enabled" description="Allow external systems to receive event notifications." checked={settings.webhooksEnabled} onChange={(v) => update('webhooksEnabled', v)} />
      <SettingsField label="Active API Keys" description={`${settings.apiKeysActive} keys configured.`}>
        <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Manage API keys (mock).', 'info')}>Manage API Keys</button>
      </SettingsField>
      <SettingsField label="Payment Gateway" description="Razorpay integration (mock).">
        <span className="settings-dash-status settings-dash-status--ok">Connected</span>
      </SettingsField>
      <SettingsField label="SMS Provider" description="Twilio integration (mock).">
        <span className="settings-dash-status settings-dash-status--ok">Connected</span>
      </SettingsField>
    </SettingsSection>
  );
}

function BackupPanel({ settings, update, showToast }) {
  return (
    <SettingsSection title="Backup & Recovery" description="Platform data backup and restore options.">
      <SettingsField label="Last Backup" description="Most recent successful backup.">
        <span className="settings-dash-backup-date">{settings.lastBackup}</span>
      </SettingsField>
      <SettingsToggle label="Automatic Backup" description="Schedule regular platform backups." checked={settings.autoBackup} onChange={(v) => update('autoBackup', v)} />
      <SettingsField label="Backup Frequency" description="How often backups are created.">
        <select className="settings-dash-input" value={settings.backupFrequency} onChange={(e) => update('backupFrequency', e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </SettingsField>
      <div className="settings-dash-inline-actions">
        <button type="button" className="settings-dash-btn settings-dash-btn--primary" onClick={() => showToast('Backup started (mock).', 'success')}><RefreshCw size={14} /> Backup Now</button>
        <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={() => showToast('Restore backup dialog (mock).', 'info')}>Restore Backup</button>
      </div>
    </SettingsSection>
  );
}

const PANEL_META = {
  security: { title: 'Security & Access', desc: 'Authentication, roles, and login security.' },
  notifications: { title: 'Notification Settings', desc: 'Email and push notification preferences.' },
  appearance: { title: 'Platform Appearance', desc: 'Branding, theme, and visual customization.' },
  system: { title: 'System Configuration', desc: 'General platform and maintenance options.' },
  verification: { title: 'Verification Settings', desc: 'Identity verification rules and document requirements.' },
  donation: { title: 'Donation Settings', desc: 'Donation types, limits, and privacy options.' },
  financial: { title: 'Financial Settings', desc: 'Fund limits, budgets, and allocation rules.' },
  categories: { title: 'Category Management', desc: 'Assistance categories and request types.' },
  email: { title: 'Email Templates', desc: 'Automated email content and templates.' },
  audit: { title: 'Audit & Logs', desc: 'Activity logging and audit trail settings.' },
  api: { title: 'API & Integrations', desc: 'External services and API configuration.' },
  backup: { title: 'Backup & Recovery', desc: 'Data backup schedules and restore options.' }
};

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [active, setActive] = useState('security');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(() => JSON.parse(JSON.stringify(ADMIN_SETTINGS_DEFAULTS)));

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const handleSave = () => showToast('Settings saved successfully (mock).', 'success');
  const handleReset = () => {
    setSettings(JSON.parse(JSON.stringify(ADMIN_SETTINGS_DEFAULTS)));
    showToast('Settings reset to defaults (mock).', 'info');
  };

  const renderPanel = () => {
    const s = settings;
    const upd = (key, val) => updateSetting(active, key, val);
    switch (active) {
      case 'security': return <SecurityPanel settings={s.security} update={upd} showToast={showToast} />;
      case 'notifications': return <NotificationsPanel settings={s.notifications} update={upd} />;
      case 'appearance': return <AppearancePanel settings={s.appearance} update={upd} showToast={showToast} />;
      case 'system': return <SystemPanel settings={s.system} update={upd} />;
      case 'verification': return <VerificationPanel settings={s.verification} update={upd} />;
      case 'donation': return <DonationPanel settings={s.donation} update={upd} />;
      case 'financial': return <FinancialPanel settings={s.financial} update={upd} />;
      case 'categories': return <CategoriesPanel showToast={showToast} />;
      case 'email': return <EmailPanel showToast={showToast} />;
      case 'audit': return <AuditPanel settings={s.audit} update={upd} showToast={showToast} />;
      case 'api': return <ApiPanel settings={s.api} update={upd} showToast={showToast} />;
      case 'backup': return <BackupPanel settings={s.backup} update={upd} showToast={showToast} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="settings-dash page-route settings-dash--loading" aria-hidden="true">
        <div className="settings-dash-skeleton settings-dash-skeleton--header" />
        <div className="settings-dash-skeleton-layout">
          <div className="settings-dash-skeleton settings-dash-skeleton--nav" />
          <div className="settings-dash-skeleton settings-dash-skeleton--panel" />
        </div>
      </div>
    );
  }

  const meta = PANEL_META[active];

  return (
    <div className="settings-dash page-route">
      <header className="settings-dash-header">
        <div className="settings-dash-header__text">
          <h1>Settings</h1>
          <p>Manage platform configuration, security, verification rules, donation settings, financial preferences, notifications, and system options.</p>
        </div>
        <div className="settings-dash-header__actions">
          <button type="button" className="settings-dash-btn settings-dash-btn--outline" onClick={handleReset}>
            <RotateCcw size={16} /> Reset Defaults
          </button>
          <button type="button" className="settings-dash-btn settings-dash-btn--primary" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </header>

      <div className="settings-dash-layout">
        <nav className="settings-dash-nav" aria-label="Settings categories">
          {ADMIN_SETTINGS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`settings-dash-nav__item ${active === cat.id ? 'is-active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              <span className="settings-dash-nav__icon" aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </nav>

        <main className="settings-dash-panel" key={active}>
          <header className="settings-dash-panel__head">
            <h2>{meta.title}</h2>
            <p>{meta.desc}</p>
          </header>
          <div className="settings-dash-panel__body">{renderPanel()}</div>
          <footer className="settings-dash-panel__footer">
            <button type="button" className="settings-dash-btn settings-dash-btn--primary" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
