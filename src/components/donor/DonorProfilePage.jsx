import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Clock, Pencil, Settings, KeyRound, Gift, IndianRupee,
  Heart, Target, MapPin, Phone, Mail, User, Briefcase, Calendar,
  BadgeCheck, Star, Users, Award, Sparkles, MonitorSmartphone,
  Shield, Eye, CheckCircle, Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
  getDonorDonations,
  getDonorStats,
  getDonorInitials,
  formatCurrency,
  normalizeDonorStatus,
  statusBadgeClass
} from '../../utils/donorHelpers';

const ACHIEVEMENT_DEFS = [
  { id: 'first', title: 'First Donation', icon: Sparkles, min: 1 },
  { id: 'helper', title: 'Community Helper', icon: Users, min: 2 },
  { id: 'supporter', title: 'Top Supporter', icon: Star, min: 3 },
  { id: 'milestone', title: '25 Donations', icon: Award, min: 25 }
];

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ user }) {
  const verified = user?.verified === true;
  const pending = user?.verified === 'pending';
  if (verified) {
    return (
      <span className="dp-badge dp-badge--verified">
        <ShieldCheck size={14} /> Verified Donor
      </span>
    );
  }
  if (pending) {
    return (
      <span className="dp-badge dp-badge--pending">
        <Clock size={14} /> Verification Pending
      </span>
    );
  }
  return <span className="dp-badge dp-badge--basic">Basic Donor</span>;
}

function computeCompletion(user, form) {
  const checks = [
    form.name || user?.name,
    user?.email,
    form.mobile || user?.mobile,
    form.address || user?.address,
    form.dob || user?.dob,
    form.occupation || user?.occupation,
    user?.city,
    user?.verified === true
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function DonorProfilePage() {
  const { currentUser, donations, dispatch, loadDonorProfile } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadDonorProfile()
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => { cancelled = true; };
  }, [loadDonorProfile]);

  const list = useMemo(
    () => getDonorDonations(donations, currentUser),
    [donations, currentUser]
  );
  const stats = useMemo(
    () => getDonorStats(donations, currentUser),
    [donations, currentUser]
  );

  const settings = currentUser?.settings || {};
  const preferredCategories = settings.preferredCategories?.length
    ? settings.preferredCategories
    : ['Clothes', 'Food'];

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    address: currentUser?.address || '',
    dob: currentUser?.dob || '',
    occupation: currentUser?.occupation || ''
  });
  const [baseline, setBaseline] = useState(() =>
    JSON.stringify({
      name: currentUser?.name || '',
      mobile: currentUser?.mobile || '',
      address: currentUser?.address || '',
      dob: currentUser?.dob || '',
      occupation: currentUser?.occupation || ''
    })
  );

  const dirty = editing && JSON.stringify(form) !== baseline;
  const completion = computeCompletion(currentUser, form);
  const verified = currentUser?.verified === true;
  const successRate = list.length
    ? Math.round(
      (list.filter((d) => normalizeDonorStatus(d.status) === 'Completed').length / list.length) * 100
    )
    : 0;

  const lastDonation = useMemo(() => {
    if (!list.length) return null;
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [list]);

  const recent = useMemo(
    () => [...list].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [list]
  );

  const favoriteCategory = useMemo(() => {
    const counts = {};
    list.forEach((d) => {
      const key = d.category || d.fund || d.purpose || d.type;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top?.[0] || preferredCategories[0] || '—';
  }, [list, preferredCategories]);

  const achievements = ACHIEVEMENT_DEFS.filter((a) => stats.totalDonations >= a.min);

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const startEdit = () => {
    const next = {
      name: currentUser?.name || '',
      mobile: currentUser?.mobile || '',
      address: currentUser?.address || form.address || '',
      dob: currentUser?.dob || form.dob || '',
      occupation: currentUser?.occupation || form.occupation || ''
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
        address: form.address.trim(),
        dob: form.dob,
        occupation: form.occupation.trim()
      }
    });
    setBaseline(JSON.stringify(form));
    setEditing(false);
    showToast('Profile updated.', 'success');
  };

  const savePassword = (e) => {
    e.preventDefault();
    showToast('Password updated.', 'success');
    setShowPassword(false);
  };

  const donationTitle = (d) =>
    d.purpose || d.fund || d.category || (d.type === 'Financial' ? 'Money Donation' : 'Item Donation');

  return (
    <div className="dp-page donor-page donor-module page-route">
      <section className="dp-hero">
        <div className="dp-hero__left">
          <div className="dp-avatar" aria-hidden="true">
            {getDonorInitials(currentUser?.name)}
          </div>
          <div className="dp-hero__meta">
            <div className="dp-hero__title-row">
              <h1>{currentUser?.name}</h1>
              <StatusBadge user={currentUser} />
            </div>
            <p className="dp-hero__email">
              <Mail size={14} aria-hidden="true" />
              {currentUser?.email}
            </p>
            <div className="dp-hero__facts">
              <span>
                <Calendar size={14} aria-hidden="true" />
                Member since {formatDate(currentUser?.memberSince)}
              </span>
              {profileLoading ? (
                <span><Clock size={14} aria-hidden="true" /> Loading profile…</span>
              ) : currentUser?.profileStatus ? (
                <span>
                  <BadgeCheck size={14} aria-hidden="true" />
                  Profile {String(currentUser.profileStatus).toLowerCase()}
                </span>
              ) : null}
              {currentUser?.panNumber ? (
                <span>
                  <Briefcase size={14} aria-hidden="true" />
                  PAN {currentUser.panNumber}
                </span>
              ) : null}
              <span>
                <Gift size={14} aria-hidden="true" />
                Last donation {lastDonation ? formatDate(lastDonation.date) : '—'}
              </span>
              <span>
                <Target size={14} aria-hidden="true" />
                Prefers {favoriteCategory}
              </span>
            </div>
          </div>
        </div>

        <div className="dp-hero__actions">
          {!verified && currentUser?.verified !== 'pending' && (
            <button
              type="button"
              className="dp-btn dp-btn--primary"
              onClick={() => navigate('/dashboard/donor-verify')}
            >
              <ShieldCheck size={15} />
              Verify My Account
            </button>
          )}
          <button type="button" className="dp-btn dp-btn--secondary" onClick={startEdit}>
            <Pencil size={15} />
            Edit Profile
          </button>
          <button
            type="button"
            className="dp-btn dp-btn--ghost"
            onClick={() => navigate('/dashboard/donor-settings')}
          >
            <Settings size={15} />
            Account Settings
          </button>
          <button
            type="button"
            className="dp-btn dp-btn--ghost"
            onClick={() => {
              setShowPassword(true);
              setEditing(false);
            }}
          >
            <KeyRound size={15} />
            Change Password
          </button>
        </div>
      </section>

      <section className="dp-stats" aria-label="Donation statistics">
        <article className="dp-stat">
          <span className="dp-stat__icon"><Gift size={18} /></span>
          <div>
            <strong>{stats.totalDonations}</strong>
            <span>Total Donations</span>
          </div>
        </article>
        <article className="dp-stat">
          <span className="dp-stat__icon"><IndianRupee size={18} /></span>
          <div>
            <strong>{formatCurrency(stats.moneyDonated)}</strong>
            <span>Total Amount Donated</span>
          </div>
        </article>
        <article className="dp-stat">
          <span className="dp-stat__icon"><Heart size={18} /></span>
          <div>
            <strong>{stats.livesImpacted}</strong>
            <span>Lives Impacted</span>
          </div>
        </article>
        <article className="dp-stat">
          <span className="dp-stat__icon"><CheckCircle size={18} /></span>
          <div>
            <strong>{successRate}%</strong>
            <span>Donation Success Rate</span>
          </div>
        </article>
      </section>

      <div className="dp-layout">
        <div className="dp-main">
          <section className="dp-card">
            <header className="dp-card__head">
              <User size={18} aria-hidden="true" />
              <div>
                <h2>Personal Information</h2>
                <p>{editing ? 'Update your details below' : 'Your account details on Give Away'}</p>
              </div>
              {!editing && (
                <button type="button" className="dp-btn dp-btn--ghost" onClick={startEdit}>
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </header>

            {editing ? (
              <form id="dp-profile-form" className="dp-form" onSubmit={saveProfile} noValidate>
                <label className="dp-field">
                  <span>Full Name</span>
                  <input value={form.name} onChange={(e) => patch('name', e.target.value)} name="name" />
                </label>
                <label className="dp-field">
                  <span>Email</span>
                  <input value={currentUser?.email || ''} disabled />
                </label>
                <label className="dp-field">
                  <span>Phone Number</span>
                  <input value={form.mobile} onChange={(e) => patch('mobile', e.target.value)} name="mobile" />
                </label>
                <label className="dp-field">
                  <span>Date of Birth (optional)</span>
                  <input type="date" value={form.dob} onChange={(e) => patch('dob', e.target.value)} />
                </label>
                <label className="dp-field dp-field--wide">
                  <span>Address</span>
                  <input value={form.address} onChange={(e) => patch('address', e.target.value)} />
                </label>
                <label className="dp-field">
                  <span>Occupation (optional)</span>
                  <input value={form.occupation} onChange={(e) => patch('occupation', e.target.value)} />
                </label>
              </form>
            ) : (
              <dl className="dp-info-grid">
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
                  <dd>{currentUser?.mobile || form.mobile || '—'}</dd>
                </div>
                <div>
                  <dt><Calendar size={13} /> Date of Birth</dt>
                  <dd>{form.dob ? formatDate(form.dob) : '—'}</dd>
                </div>
                <div className="dp-info-grid__wide">
                  <dt><MapPin size={13} /> Address</dt>
                  <dd>
                    {[form.address || currentUser?.address, currentUser?.city, currentUser?.state]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </dd>
                </div>
                <div>
                  <dt><Briefcase size={13} /> Occupation</dt>
                  <dd>{form.occupation || currentUser?.occupation || '—'}</dd>
                </div>
              </dl>
            )}
          </section>

          <section className="dp-card">
            <header className="dp-card__head">
              <Target size={18} aria-hidden="true" />
              <div>
                <h2>Donation Preferences</h2>
                <p>Defaults used across your donation flows</p>
              </div>
            </header>
            <div className="dp-prefs">
              <div>
                <span className="dp-prefs__label">Preferred Donation Categories</span>
                <div className="dp-chips">
                  {preferredCategories.map((c) => (
                    <span key={c} className="dp-chip">{c}</span>
                  ))}
                </div>
              </div>
              <dl className="dp-prefs__meta">
                <div>
                  <dt>Preferred Donation Method</dt>
                  <dd>{settings.paymentPreference || 'UPI / Online'}</dd>
                </div>
                <div>
                  <dt>Anonymous Donation Preference</dt>
                  <dd>{settings.anonymousDonations ? 'Enabled' : 'Disabled'}</dd>
                </div>
                <div>
                  <dt>Preferred Pickup Method</dt>
                  <dd>{settings.pickupPreference || 'Scheduled home pickup'}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="dp-card">
            <header className="dp-card__head">
              <Award size={18} aria-hidden="true" />
              <div>
                <h2>Achievements</h2>
                <p>Milestones earned through your giving</p>
              </div>
            </header>
            {achievements.length ? (
              <div className="dp-achievements">
                {achievements.map((a) => {
                  const Icon = a.icon;
                  return (
                    <article key={a.id} className="dp-achievement">
                      <span className="dp-achievement__icon"><Icon size={18} /></span>
                      <strong>{a.title}</strong>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="dp-empty-note">
                Make your first donation to unlock achievement badges and celebrate your impact.
              </p>
            )}
          </section>

          <section className="dp-card">
            <header className="dp-card__head">
              <Gift size={18} aria-hidden="true" />
              <div>
                <h2>Recent Donations</h2>
                <p>Your latest contributions</p>
              </div>
              <button
                type="button"
                className="dp-btn dp-btn--ghost"
                onClick={() => navigate('/dashboard/donor-my-donations')}
              >
                View all
              </button>
            </header>

            {recent.length ? (
              <div className="dp-recent">
                {recent.map((d) => (
                  <article key={d.id} className="dp-recent-card">
                    <div>
                      <h3>{donationTitle(d)}</h3>
                      <p>
                        {d.category || d.fund || d.type}
                        {' · '}
                        {formatDate(d.date)}
                      </p>
                    </div>
                    <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>
                      {normalizeDonorStatus(d.status)}
                    </span>
                    <button
                      type="button"
                      className="dp-btn dp-btn--ghost"
                      onClick={() => navigate(`/dashboard/donor-donation/${d.id}`)}
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="dp-empty-note">No donations yet. Start giving to see activity here.</p>
            )}
          </section>

          {showPassword && (
            <section className="dp-card">
              <header className="dp-card__head">
                <KeyRound size={18} aria-hidden="true" />
                <div>
                  <h2>Change Password</h2>
                  <p>Update your account password</p>
                </div>
              </header>
              <form className="dp-form" onSubmit={savePassword}>
                <label className="dp-field">
                  <span>Current Password</span>
                  <input type="password" required />
                </label>
                <label className="dp-field">
                  <span>New Password</span>
                  <input type="password" required minLength={8} />
                </label>
                <label className="dp-field">
                  <span>Confirm Password</span>
                  <input type="password" required minLength={8} />
                </label>
                <div className="dp-form__actions">
                  <button
                    type="button"
                    className="dp-btn dp-btn--secondary"
                    onClick={() => setShowPassword(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="dp-btn dp-btn--primary">
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="dp-card">
            <header className="dp-card__head">
              <Shield size={18} aria-hidden="true" />
              <div>
                <h2>Account Security</h2>
                <p>Password, sessions, and login activity</p>
              </div>
            </header>
            <div className="dp-security">
              <div className="dp-security__row">
                <div>
                  <strong>Change Password</strong>
                  <p>Keep your account secure with a strong password.</p>
                </div>
                <button
                  type="button"
                  className="dp-btn dp-btn--secondary"
                  onClick={() => {
                    setShowPassword(true);
                    setEditing(false);
                  }}
                >
                  <KeyRound size={15} /> Change Password
                </button>
              </div>
              <div className="dp-security__row">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Future-ready extra protection for sensitive actions.</p>
                </div>
                <span className="dp-pill dp-pill--warning">Coming soon</span>
              </div>
              <div className="dp-security__row">
                <div>
                  <strong>Last Login</strong>
                  <p>Most recent successful sign-in.</p>
                </div>
                <span className="dp-meta">Today · 09:18 AM IST</span>
              </div>
              <div className="dp-security__row">
                <div>
                  <strong>Active Devices</strong>
                  <p>Devices currently signed in to your donor account.</p>
                </div>
                <div className="dp-security__actions">
                  <span className="dp-pill dp-pill--info">1 device</span>
                  <button
                    type="button"
                    className="dp-btn dp-btn--ghost"
                    onClick={() => showToast('Active devices reviewed', 'success')}
                  >
                    <MonitorSmartphone size={15} /> Manage
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="dp-sidebar">
          <section className="dp-card">
            <header className="dp-card__head">
              <BadgeCheck size={18} aria-hidden="true" />
              <div>
                <h2>Profile Summary</h2>
                <p>Quick snapshot of your account</p>
              </div>
            </header>

            <div className="dp-progress">
              <div className="dp-progress__labels">
                <span>Profile Completion</span>
                <strong>{completion}%</strong>
              </div>
              <div
                className="dp-progress__track"
                role="progressbar"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="dp-progress__fill" style={{ width: `${completion}%` }} />
              </div>
            </div>

            <dl className="dp-summary">
              <div>
                <dt>Verification Status</dt>
                <dd><StatusBadge user={currentUser} /></dd>
              </div>
              <div>
                <dt>Member Since</dt>
                <dd>{formatDate(currentUser?.memberSince)}</dd>
              </div>
              <div>
                <dt>Favorite Donation Category</dt>
                <dd>{favoriteCategory}</dd>
              </div>
              <div>
                <dt>Notification Status</dt>
                <dd>
                  {settings.emailNotifications === false ? 'Email off' : 'Email on'}
                  {' · '}
                  {settings.smsNotifications === false ? 'SMS off' : 'SMS on'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="dp-card">
            <header className="dp-card__head">
              <Truck size={18} aria-hidden="true" />
              <div>
                <h2>Quick Actions</h2>
                <p>Jump to common tasks</p>
              </div>
            </header>
            <div className="dp-quick">
              <button
                type="button"
                className="dp-btn dp-btn--primary"
                onClick={() => navigate('/dashboard/donor-donate-money')}
              >
                Donate Money
              </button>
              <button
                type="button"
                className="dp-btn dp-btn--secondary"
                onClick={() => navigate('/dashboard/donor-donate-item')}
              >
                Donate Items
              </button>
              <button
                type="button"
                className="dp-btn dp-btn--ghost"
                onClick={() => navigate('/dashboard/donor-my-impact')}
              >
                View My Impact
              </button>
            </div>
          </section>
        </aside>
      </div>

      {editing && (
        <div className={`dp-actions${dirty ? ' is-dirty' : ''}`}>
          {dirty && (
            <span className="dp-unsaved" role="status">
              Unsaved Changes
            </span>
          )}
          <div className="dp-actions__btns">
            <button type="button" className="dp-btn dp-btn--secondary" onClick={cancelEdit}>
              Cancel
            </button>
            <button
              type="submit"
              form="dp-profile-form"
              className="dp-btn dp-btn--primary"
              disabled={!dirty}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
