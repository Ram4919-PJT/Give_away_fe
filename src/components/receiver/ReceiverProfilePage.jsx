import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Clock, Pencil, KeyRound, Mail, Phone, User, MapPin,
  Calendar, Briefcase, Users, FileHeart, ClipboardList, CheckCircle,
  AlertCircle, Send, Eye, Shield, MonitorSmartphone, Lightbulb,
  BadgeCheck, Home, FileText, HelpCircle, HeartHandshake
} from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  getReceiverApps,
  getReceiverStats,
  getInitials,
  statusBadgeClass
} from '../../utils/receiverHelpers';
import { formatCurrency } from '../../utils/donorHelpers';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function VerificationBadge({ user }) {
  const verified = isRoleVerified(user);
  const pending = user?.verified === 'pending' || user?.verificationStatus === 'submitted';
  if (verified) {
    return (
      <span className="rp-badge rp-badge--verified">
        <ShieldCheck size={14} /> Verified Receiver
      </span>
    );
  }
  if (pending) {
    return (
      <span className="rp-badge rp-badge--pending">
        <Clock size={14} /> Verification Pending
      </span>
    );
  }
  return (
    <span className="rp-badge rp-badge--basic">
      <BadgeCheck size={14} /> Registered Receiver
    </span>
  );
}

function computeCompletion(user, form) {
  const checks = [
    form.name || user?.name,
    user?.email,
    form.mobile || user?.mobile,
    form.address || user?.address,
    form.city || user?.city,
    form.state || user?.state,
    form.dob,
    form.occupation,
    form.householdSize,
    isRoleVerified(user)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function ReceiverProfilePage() {
  const { currentUser, receiverApplications, dispatch } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const apps = useMemo(
    () => getReceiverApps(receiverApplications, currentUser),
    [receiverApplications, currentUser]
  );
  const stats = useMemo(() => getReceiverStats(apps), [apps]);

  const pending = stats.underReview;
  const completed = apps.filter((a) => a.status === 'Completed' || a.status === 'Funds Released').length;
  const assistanceReceived = completed;

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    address: currentUser?.address || '',
    dob: currentUser?.dob || '',
    occupation: currentUser?.occupation || '',
    householdSize: currentUser?.householdSize || ''
  });
  const [baseline, setBaseline] = useState(() => JSON.stringify({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    address: currentUser?.address || '',
    dob: currentUser?.dob || '',
    occupation: currentUser?.occupation || '',
    householdSize: currentUser?.householdSize || ''
  }));

  const dirty = editing && JSON.stringify(form) !== baseline;
  const completion = computeCompletion(currentUser, form);
  const verified = isRoleVerified(currentUser);

  const lastRequest = useMemo(() => {
    if (!apps.length) return null;
    return [...apps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))[0];
  }, [apps]);

  const recent = useMemo(
    () => [...apps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5),
    [apps]
  );

  const received = useMemo(
    () => apps.filter((a) => ['Completed', 'Funds Released', 'Assigned', 'Approved'].includes(a.status)).slice(0, 5),
    [apps]
  );

  const preferredCategory = useMemo(() => {
    const counts = {};
    apps.forEach((a) => {
      const key = a.assistanceType || a.purpose;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [apps]);

  const activityCounts = {
    submitted: stats.submitted,
    approved: stats.approved,
    pending: pending,
    rejected: stats.rejected,
    completed
  };

  const verificationSteps = [
    { id: 'reg', label: 'Registration Status', done: true },
    { id: 'id', label: 'Identity Verification', done: verified },
    { id: 'addr', label: 'Address Verification', done: verified || !!(form.address || currentUser?.address) },
    { id: 'docs', label: 'Required Documents', done: verified }
  ];

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const startEdit = () => {
    const next = {
      name: currentUser?.name || '',
      mobile: currentUser?.mobile || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      address: currentUser?.address || '',
      dob: currentUser?.dob || form.dob || '',
      occupation: currentUser?.occupation || form.occupation || '',
      householdSize: currentUser?.householdSize || form.householdSize || ''
    };
    setForm(next);
    setBaseline(JSON.stringify(next));
    setEditing(true);
    setShowPassword(false);
  };

  const cancelEdit = () => {
    setForm(JSON.parse(baseline));
    setEditing(false);
    showToast('Changes discarded', 'success');
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (!dirty) return;
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        name: form.name.trim() || currentUser.name,
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        address: form.address.trim(),
        dob: form.dob,
        occupation: form.occupation.trim(),
        householdSize: form.householdSize
      }
    });
    setBaseline(JSON.stringify(form));
    setEditing(false);
    showToast('Profile updated successfully.', 'success');
  };

  const savePassword = (e) => {
    e.preventDefault();
    showToast('Password updated.', 'success');
    setShowPassword(false);
  };

  return (
    <div className="rp-page receiver-page receiver-module page-route">
      <section className="rp-hero">
        <div className="rp-hero__left">
          <div className="rp-avatar" aria-hidden="true">
            {getInitials(currentUser?.name)}
          </div>
          <div>
            <div className="rp-hero__title-row">
              <h1>{currentUser?.name}</h1>
              <VerificationBadge user={currentUser} />
            </div>
            <p className="rp-hero__email">
              <Mail size={14} aria-hidden="true" />
              {currentUser?.email}
            </p>
            <div className="rp-hero__facts">
              <span>
                <Calendar size={14} aria-hidden="true" />
                Member since {formatDate(currentUser?.memberSince)}
              </span>
              <span>
                <FileHeart size={14} aria-hidden="true" />
                Last request {lastRequest ? formatDate(lastRequest.appliedDate) : '—'}
              </span>
              <span>
                <Home size={14} aria-hidden="true" />
                Prefers {preferredCategory}
              </span>
            </div>
          </div>
        </div>
        <div className="rp-hero__actions">
          <button type="button" className="rp-btn rp-btn--secondary" onClick={startEdit}>
            <Pencil size={15} /> Edit Profile
          </button>
          <button
            type="button"
            className="rp-btn rp-btn--ghost"
            onClick={() => {
              setShowPassword(true);
              setEditing(false);
            }}
          >
            <KeyRound size={15} /> Change Password
          </button>
        </div>
      </section>

      <section className="rp-stats" aria-label="Request statistics">
        <article className="rp-stat">
          <span className="rp-stat__icon"><Send size={18} /></span>
          <div>
            <strong>{stats.submitted}</strong>
            <span>Total Requests Submitted</span>
          </div>
        </article>
        <article className="rp-stat">
          <span className="rp-stat__icon"><CheckCircle size={18} /></span>
          <div>
            <strong>{stats.approved}</strong>
            <span>Approved Requests</span>
          </div>
        </article>
        <article className="rp-stat">
          <span className="rp-stat__icon"><Clock size={18} /></span>
          <div>
            <strong>{pending}</strong>
            <span>Pending Requests</span>
          </div>
        </article>
        <article className="rp-stat">
          <span className="rp-stat__icon"><BadgeCheck size={18} /></span>
          <div>
            <strong>{assistanceReceived}</strong>
            <span>Assistance Received</span>
          </div>
        </article>
      </section>

      <div className="rp-layout">
        <div className="rp-main">
          <section className="rp-card">
            <header className="rp-card__head">
              <User size={18} aria-hidden="true" />
              <div>
                <h2>Personal Information</h2>
                <p>{editing ? 'Update your details below' : 'Your account details on Give Away'}</p>
              </div>
              {!editing && (
                <button type="button" className="rp-btn rp-btn--ghost" onClick={startEdit}>
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </header>

            {editing ? (
              <form id="rp-profile-form" className="rp-form" onSubmit={saveProfile} noValidate>
                <label className="rp-field">
                  <span>Full Name</span>
                  <input name="name" value={form.name} onChange={(e) => patch('name', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>Email</span>
                  <input value={currentUser?.email || ''} disabled />
                </label>
                <label className="rp-field">
                  <span>Phone Number</span>
                  <input name="mobile" value={form.mobile} onChange={(e) => patch('mobile', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>Date of Birth (optional)</span>
                  <input type="date" value={form.dob} onChange={(e) => patch('dob', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>City</span>
                  <input name="city" value={form.city} onChange={(e) => patch('city', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>State</span>
                  <input name="state" value={form.state} onChange={(e) => patch('state', e.target.value)} />
                </label>
                <label className="rp-field rp-field--wide">
                  <span>Address</span>
                  <textarea name="address" rows={2} value={form.address} onChange={(e) => patch('address', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>Occupation (optional)</span>
                  <input value={form.occupation} onChange={(e) => patch('occupation', e.target.value)} />
                </label>
                <label className="rp-field">
                  <span>Household Size (optional)</span>
                  <input
                    type="number"
                    min="1"
                    value={form.householdSize}
                    onChange={(e) => patch('householdSize', e.target.value)}
                  />
                </label>
              </form>
            ) : (
              <dl className="rp-info-grid">
                <div>
                  <dt><User size={13} /> Full Name</dt>
                  <dd>{currentUser?.name || '—'}</dd>
                </div>
                <div>
                  <dt><Mail size={13} /> Email</dt>
                  <dd>{currentUser?.email || '—'}</dd>
                </div>
                <div>
                  <dt><Phone size={13} /> Phone Number</dt>
                  <dd>{currentUser?.mobile || '—'}</dd>
                </div>
                <div>
                  <dt><Calendar size={13} /> Date of Birth</dt>
                  <dd>{form.dob ? formatDate(form.dob) : '—'}</dd>
                </div>
                <div className="rp-info-grid__wide">
                  <dt><MapPin size={13} /> Address</dt>
                  <dd>
                    {[currentUser?.address || form.address, currentUser?.city || form.city, currentUser?.state || form.state]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </dd>
                </div>
                <div>
                  <dt><Briefcase size={13} /> Occupation</dt>
                  <dd>{form.occupation || currentUser?.occupation || '—'}</dd>
                </div>
                <div>
                  <dt><Users size={13} /> Household Size</dt>
                  <dd>{form.householdSize || currentUser?.householdSize || '—'}</dd>
                </div>
              </dl>
            )}
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <ClipboardList size={18} aria-hidden="true" />
              <div>
                <h2>Request Activity</h2>
                <p>Overview of your assistance applications</p>
              </div>
            </header>
            {apps.length ? (
              <div className="rp-activity">
                {[
                  { key: 'submitted', label: 'Submitted', tone: 'info' },
                  { key: 'approved', label: 'Approved', tone: 'success' },
                  { key: 'pending', label: 'Pending', tone: 'warning' },
                  { key: 'rejected', label: 'Rejected', tone: 'danger' },
                  { key: 'completed', label: 'Completed', tone: 'neutral' }
                ].map((item) => (
                  <div key={item.key} className="rp-activity__item">
                    <span className={`rp-pill rp-pill--${item.tone}`}>{item.label}</span>
                    <strong>{activityCounts[item.key]}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rp-empty">
                <ClipboardList size={28} strokeWidth={1.5} />
                <p>No requests submitted yet. Complete your profile and apply for assistance when ready.</p>
              </div>
            )}
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <FileHeart size={18} aria-hidden="true" />
              <div>
                <h2>Recent Requests</h2>
                <p>Your latest assistance applications</p>
              </div>
              {apps.length > 0 && (
                <button
                  type="button"
                  className="rp-btn rp-btn--ghost"
                  onClick={() => navigate('/dashboard/receiver-applications')}
                >
                  View all
                </button>
              )}
            </header>

            {recent.length ? (
              <div className="rp-recent">
                {recent.map((a) => (
                  <article key={a.id} className="rp-recent-card">
                    <div>
                      <h3>{a.purpose || a.assistanceType || a.id}</h3>
                      <p>
                        {a.assistanceType || 'Assistance'}
                        {' · '}
                        {formatDate(a.appliedDate)}
                        {a.amount != null ? ` · ${formatCurrency(a.amount)}` : ''}
                      </p>
                    </div>
                    <span className={`receiver-status-badge ${statusBadgeClass(a.status)}`}>
                      {a.status}
                    </span>
                    <button
                      type="button"
                      className="rp-btn rp-btn--ghost"
                      onClick={() => navigate(`/dashboard/receiver-application/${a.id}`)}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rp-empty">
                <Send size={28} strokeWidth={1.5} />
                <p>No requests submitted yet.</p>
                <button
                  type="button"
                  className="rp-btn rp-btn--primary"
                  onClick={() => navigate('/dashboard/receiver-apply')}
                >
                  Browse Available Donations
                </button>
              </div>
            )}
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <BadgeCheck size={18} aria-hidden="true" />
              <div>
                <h2>Received Assistance</h2>
                <p>Support approved or released to you</p>
              </div>
            </header>
            {received.length ? (
              <div className="rp-recent">
                {received.map((a) => (
                  <article key={a.id} className="rp-recent-card">
                    <div>
                      <h3>{a.purpose || a.assistanceType || a.id}</h3>
                      <p>
                        {a.assistanceType || 'Assistance'}
                        {' · '}
                        Received {formatDate(a.appliedDate)}
                      </p>
                    </div>
                    <span className={`receiver-status-badge ${statusBadgeClass(a.status)}`}>
                      {a.status}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rp-empty">
                <HeartHandshake size={28} strokeWidth={1.5} />
                <p>No assistance received yet. Approved requests will appear here.</p>
              </div>
            )}
          </section>

          {showPassword && (
            <section className="rp-card">
              <header className="rp-card__head">
                <KeyRound size={18} aria-hidden="true" />
                <div>
                  <h2>Change Password</h2>
                  <p>Update your account password</p>
                </div>
              </header>
              <form className="rp-form" onSubmit={savePassword}>
                <label className="rp-field">
                  <span>Current Password</span>
                  <input type="password" required />
                </label>
                <label className="rp-field">
                  <span>New Password</span>
                  <input type="password" required minLength={8} />
                </label>
                <label className="rp-field">
                  <span>Confirm Password</span>
                  <input type="password" required minLength={8} />
                </label>
                <div className="rp-form__actions">
                  <button type="button" className="rp-btn rp-btn--secondary" onClick={() => setShowPassword(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="rp-btn rp-btn--primary">
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rp-card">
            <header className="rp-card__head">
              <Shield size={18} aria-hidden="true" />
              <div>
                <h2>Account Security</h2>
                <p>Password, login activity, and device access</p>
              </div>
            </header>
            <div className="rp-security">
              <div className="rp-security__row">
                <div>
                  <strong>Change Password</strong>
                  <p>Keep your account secure with a strong password.</p>
                </div>
                <button
                  type="button"
                  className="rp-btn rp-btn--secondary"
                  onClick={() => {
                    setShowPassword(true);
                    setEditing(false);
                  }}
                >
                  <KeyRound size={15} /> Change Password
                </button>
              </div>
              <div className="rp-security__row">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Future-ready extra protection for sensitive actions.</p>
                </div>
                <span className="rp-pill rp-pill--warning">Coming soon</span>
              </div>
              <div className="rp-security__row">
                <div>
                  <strong>Last Login</strong>
                  <p>Most recent successful sign-in.</p>
                </div>
                <span className="rp-meta">Today · 11:05 AM IST</span>
              </div>
              <div className="rp-security__row">
                <div>
                  <strong>Active Devices</strong>
                  <p>Future-ready device session management.</p>
                </div>
                <div className="rp-security__actions">
                  <span className="rp-pill rp-pill--info">1 device</span>
                  <button
                    type="button"
                    className="rp-btn rp-btn--ghost"
                    onClick={() => showToast('Device management coming soon', 'success')}
                  >
                    <MonitorSmartphone size={15} /> Manage
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="rp-sidebar">
          <section className="rp-card">
            <header className="rp-card__head">
              <BadgeCheck size={18} aria-hidden="true" />
              <div>
                <h2>Profile Summary</h2>
                <p>Quick snapshot of your account</p>
              </div>
            </header>
            <div className="rp-progress">
              <div className="rp-progress__labels">
                <span>Profile Completion</span>
                <strong>{completion}%</strong>
              </div>
              <div className="rp-progress__track" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
                <div className="rp-progress__fill" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <dl className="rp-summary">
              <div>
                <dt>Verification Status</dt>
                <dd><VerificationBadge user={currentUser} /></dd>
              </div>
              <div>
                <dt>Member Since</dt>
                <dd>{formatDate(currentUser?.memberSince)}</dd>
              </div>
              <div>
                <dt>Preferred Assistance Category</dt>
                <dd>{preferredCategory}</dd>
              </div>
              <div>
                <dt>Account Status</dt>
                <dd>{verified ? 'Active · Verified' : 'Registered'}</dd>
              </div>
            </dl>
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <h2>Verification Status</h2>
                <p>Steps needed for full access</p>
              </div>
            </header>
            <ul className="rp-verify">
              {verificationSteps.map((step) => (
                <li key={step.id}>
                  <span className={`rp-verify__icon${step.done ? ' is-done' : ''}`}>
                    {step.done ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </span>
                  <span>{step.label}</span>
                  <em className={`rp-pill rp-pill--${step.done ? 'success' : 'warning'}`}>
                    {step.done ? 'Done' : 'Pending'}
                  </em>
                </li>
              ))}
            </ul>
            {!verified && (
              <p className="rp-verify__note">
                Complete remaining verification steps to unlock all assistance features.
              </p>
            )}
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <Send size={18} aria-hidden="true" />
              <div>
                <h2>Quick Actions</h2>
                <p>Jump to common tasks</p>
              </div>
            </header>
            <div className="rp-quick">
              <button type="button" className="rp-btn rp-btn--secondary" onClick={startEdit}>
                <Pencil size={15} /> Edit Profile
              </button>
              <button
                type="button"
                className="rp-btn rp-btn--ghost"
                onClick={() => {
                  setShowPassword(true);
                  setEditing(false);
                }}
              >
                <KeyRound size={15} /> Change Password
              </button>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => navigate('/dashboard/receiver-apply')}
              >
                <FileHeart size={15} /> Submit New Request
              </button>
              <button
                type="button"
                className="rp-btn rp-btn--ghost"
                onClick={() => navigate('/dashboard/receiver-applications')}
              >
                <ClipboardList size={15} /> View Request History
              </button>
              <button
                type="button"
                className="rp-btn rp-btn--ghost"
                onClick={() => showToast('Support request opened', 'success')}
              >
                <HelpCircle size={15} /> Contact Support
              </button>
            </div>
          </section>

          <section className="rp-card">
            <header className="rp-card__head">
              <Lightbulb size={18} aria-hidden="true" />
              <div>
                <h2>Helpful Tips</h2>
                <p>Improve approval readiness</p>
              </div>
            </header>
            <ul className="rp-tips">
              <li>
                <FileText size={15} aria-hidden="true" />
                Complete your profile for faster approvals.
              </li>
              <li>
                <Phone size={15} aria-hidden="true" />
                Keep your contact information updated.
              </li>
              <li>
                <ShieldCheck size={15} aria-hidden="true" />
                Upload required verification documents.
              </li>
              <li>
                <ClipboardList size={15} aria-hidden="true" />
                Review request guidelines before submitting a new request.
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {editing && (
        <div className={`rp-actions${dirty ? ' is-dirty' : ''}`}>
          {dirty && (
            <span className="rp-unsaved" role="status">
              Unsaved Changes
            </span>
          )}
          <div className="rp-actions__btns">
            <button type="button" className="rp-btn rp-btn--secondary" onClick={cancelEdit}>
              Cancel
            </button>
            <button type="submit" form="rp-profile-form" className="rp-btn rp-btn--primary" disabled={!dirty}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
