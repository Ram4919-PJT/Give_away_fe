import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2, ShieldCheck, BadgeCheck, Calendar, Camera, User, Mail, Phone,
  Globe, Hash, MapPin, Target, FileText, Eye, RefreshCw, Check, X
} from 'lucide-react';
import {
  useApp,
  isNgoVerified,
  getNgoVerificationStatus
} from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import { getNgoRequests } from '../../../utils/ngoHelpers';
import {
  NGO_FOCUS_AREAS,
  NGO_DOC_TYPES,
  buildProfileForm,
  computeProfileCompletion,
  getVerificationDocs
} from '../../../data/ngoProfileData';
import NgoLocationPicker from '../../location/NgoLocationPicker';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'NGO';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatMemberSince(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function statusTone(status) {
  const map = {
    Verified: 'success',
    Pending: 'warning',
    Rejected: 'danger'
  };
  return map[status] || 'neutral';
}

function Field({ id, label, icon: Icon, children }) {
  return (
    <div className="op-field">
      <label htmlFor={id}>
        {Icon && <Icon size={14} aria-hidden="true" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function OrganizationProfilePage() {
  const { currentUser, dispatch, ngoRequests, ngoBeneficiaries } = useApp();
  const { showToast } = useToast();
  const logoRef = useRef(null);
  const [form, setForm] = useState(() => buildProfileForm(currentUser));
  const [baseline, setBaseline] = useState(() => JSON.stringify(buildProfileForm(currentUser)));
  const [docReplacements, setDocReplacements] = useState({});

  useEffect(() => {
    const next = buildProfileForm(currentUser);
    setForm(next);
    setBaseline(JSON.stringify(next));
  }, [currentUser?.email]);

  const verified = isNgoVerified(currentUser);
  const verifyStatus = getNgoVerificationStatus(currentUser);
  const completion = computeProfileCompletion(form);
  const dirty = JSON.stringify(form) !== baseline;
  const verificationDocs = getVerificationDocs(verified);
  const reqs = getNgoRequests(ngoRequests, currentUser);

  const summary = useMemo(() => {
    const approved = reqs.filter((r) => r.status === 'Approved' || r.status === 'Completed').length;
    return {
      status: verified ? 'Verified Partner' : verifyStatus === 'pending' ? 'Pending Verification' : 'Registered NGO',
      memberSince: formatMemberSince(currentUser?.memberSince),
      completion,
      donationsReceived: Math.max(approved * 12, reqs.length ? 24 : 0),
      beneficiaries: ngoBeneficiaries?.length || 0,
      activeRequests: reqs.filter((r) => ['Submitted', 'Under Review', 'Approved'].includes(r.status)).length,
      partnerDonors: verified ? 18 : 3
    };
  }, [reqs, ngoBeneficiaries, verified, verifyStatus, completion, currentUser?.memberSince]);

  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const toggleFocus = (area) => {
    setForm((prev) => {
      const list = prev.focusAreas || [];
      const next = list.includes(area)
        ? list.filter((a) => a !== area)
        : [...list, area];
      return { ...prev, focusAreas: next };
    });
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      patch({ logoUrl: String(reader.result || ''), logoName: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCancel = () => {
    const restored = JSON.parse(baseline);
    setForm(restored);
    showToast('Changes discarded', 'success');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!dirty) return;

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        name: form.name.trim() || currentUser.name,
        repName: form.repName.trim(),
        email: form.email.trim() || currentUser.email,
        mobile: form.mobile.trim(),
        website: form.website.trim(),
        regNumber: form.regNumber.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        mission: form.mission.trim(),
        about: form.about.trim(),
        focusAreas: form.focusAreas,
        logoUrl: form.logoUrl,
        logoName: form.logoName
      }
    });

    const nextBaseline = JSON.stringify(form);
    setBaseline(nextBaseline);
    showToast('Profile saved.', 'success');
  };

  const replaceDoc = (docId, fileName) => {
    setDocReplacements((prev) => ({ ...prev, [docId]: fileName }));
    showToast(`${fileName} ready to upload`, 'success');
  };

  return (
    <div className="op-page ngo-page ngo-module page-route">
      <header className="op-hero">
        <h1>Organization Profile</h1>
        <p>Manage your NGO identity, contact details, mission, and verification documents.</p>
      </header>

      <div className="op-layout">
        <div className="op-main">
          <section className="op-card op-profile-header">
            <div className="op-profile-header__avatar-wrap">
              <div className="op-avatar" aria-hidden="true">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="" />
                ) : (
                  <span>{getInitials(form.name || currentUser?.name)}</span>
                )}
              </div>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogo}
              />
              <button
                type="button"
                className="op-avatar__edit"
                onClick={() => logoRef.current?.click()}
                aria-label="Change organization logo"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="op-profile-header__meta">
              <div className="op-profile-header__title-row">
                <h2>{form.name || currentUser?.name || 'Organization'}</h2>
                {verified && (
                  <span className="op-verified-badge">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                )}
              </div>
              <div className="op-profile-header__details">
                <span>
                  <Hash size={14} aria-hidden="true" />
                  {form.regNumber || 'Registration pending'}
                </span>
                <span>
                  <Calendar size={14} aria-hidden="true" />
                  Member since {summary.memberSince}
                </span>
              </div>
              <div className="op-progress">
                <div className="op-progress__labels">
                  <span>Profile Completion</span>
                  <strong>{completion}%</strong>
                </div>
                <div
                  className="op-progress__track"
                  role="progressbar"
                  aria-valuenow={completion}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Profile completion"
                >
                  <div className="op-progress__fill" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>
          </section>

          <form id="op-profile-form" className="op-form" onSubmit={handleSave} noValidate>
            <section className="op-card">
              <header className="op-card__head">
                <Building2 size={18} aria-hidden="true" />
                <div>
                  <h3>Organization Information</h3>
                  <p>Core identity and contact details</p>
                </div>
              </header>

              <div className="op-grid">
                <Field id="op-name" label="Organization Name" icon={Building2}>
                  <input
                    id="op-name"
                    value={form.name}
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </Field>
                <Field id="op-rep" label="Representative Name" icon={User}>
                  <input
                    id="op-rep"
                    name="repName"
                    value={form.repName}
                    onChange={(e) => patch({ repName: e.target.value })}
                  />
                </Field>
                <Field id="op-email" label="Email" icon={Mail}>
                  <input
                    id="op-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => patch({ email: e.target.value })}
                  />
                </Field>
                <Field id="op-phone" label="Phone Number" icon={Phone}>
                  <input
                    id="op-phone"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => patch({ mobile: e.target.value })}
                  />
                </Field>
                <Field id="op-web" label="Website" icon={Globe}>
                  <input
                    id="op-web"
                    type="url"
                    placeholder="https://"
                    value={form.website}
                    onChange={(e) => patch({ website: e.target.value })}
                  />
                </Field>
                <Field id="op-reg" label="Registration Number" icon={Hash}>
                  <input
                    id="op-reg"
                    value={form.regNumber}
                    readOnly={verified}
                    onChange={(e) => patch({ regNumber: e.target.value })}
                    className={verified ? 'is-readonly' : undefined}
                    aria-readonly={verified}
                  />
                </Field>
              </div>
            </section>

            <section className="op-card">
              <header className="op-card__head">
                <MapPin size={18} aria-hidden="true" />
                <div>
                  <h3>Address</h3>
                  <p>Primary operating location</p>
                </div>
              </header>

              <div className="op-grid">
                <div className="op-span-2">
                  <Field id="op-address" label="Address" icon={MapPin}>
                    <input
                      id="op-address"
                      value={form.address}
                      onChange={(e) => patch({ address: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="op-span-2 op-grid op-grid--3">
                  <Field id="op-city" label="City">
                    <input
                      id="op-city"
                      value={form.city}
                      onChange={(e) => patch({ city: e.target.value })}
                    />
                  </Field>
                  <Field id="op-state" label="State">
                    <input
                      id="op-state"
                      value={form.state}
                      onChange={(e) => patch({ state: e.target.value })}
                    />
                  </Field>
                  <Field id="op-pin" label="Pincode">
                    <input
                      id="op-pin"
                      value={form.pincode}
                      onChange={(e) => patch({ pincode: e.target.value })}
                    />
                  </Field>
                </div>
              </div>

              <NgoLocationPicker form={form} onPatch={patch} />
            </section>

            <section className="op-card">
              <header className="op-card__head">
                <Target size={18} aria-hidden="true" />
                <div>
                  <h3>Mission & About</h3>
                  <p>Tell donors what your organization stands for</p>
                </div>
              </header>

              <div className="op-stack">
                <Field id="op-mission" label="Mission">
                  <textarea
                    id="op-mission"
                    name="mission"
                    rows={5}
                    value={form.mission}
                    onChange={(e) => patch({ mission: e.target.value })}
                    placeholder="Describe your mission…"
                  />
                </Field>
                <Field id="op-about" label="About Organization">
                  <textarea
                    id="op-about"
                    rows={6}
                    value={form.about}
                    onChange={(e) => patch({ about: e.target.value })}
                    placeholder="Share your story, programs, and communities you serve…"
                  />
                </Field>
              </div>
            </section>

            <section className="op-card">
              <header className="op-card__head">
                <BadgeCheck size={18} aria-hidden="true" />
                <div>
                  <h3>Focus Areas</h3>
                  <p>Select all areas your organization works in</p>
                </div>
              </header>

              <div className="op-chips" role="group" aria-label="Focus areas">
                {NGO_FOCUS_AREAS.map((area) => {
                  const active = form.focusAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      className={`op-chip${active ? ' is-selected' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleFocus(area)}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                      {area}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="op-card">
              <header className="op-card__head">
                <FileText size={18} aria-hidden="true" />
                <div>
                  <h3>Documents</h3>
                  <p>View or replace uploaded verification documents</p>
                </div>
              </header>

              <ul className="op-docs">
                {NGO_DOC_TYPES.map((doc) => (
                  <li key={doc.id} className="op-doc-row">
                    <div>
                      <strong>{doc.label}</strong>
                      <span>{docReplacements[doc.id] || doc.file}</span>
                    </div>
                    <div className="op-doc-row__actions">
                      <button
                        type="button"
                        className="op-btn op-btn--ghost"
                        onClick={() => showToast(`Opening ${doc.label}`, 'success')}
                      >
                        <Eye size={14} /> View
                      </button>
                      <label className="op-btn op-btn--ghost op-btn--file">
                        <RefreshCw size={14} /> Replace
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) replaceDoc(doc.id, file.name);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </form>
        </div>

        <aside className="op-sidebar">
          <section className="op-card">
            <header className="op-card__head">
              <Building2 size={18} aria-hidden="true" />
              <div>
                <h3>Organization Summary</h3>
                <p>Live snapshot of your profile</p>
              </div>
            </header>
            <dl className="op-summary">
              <div>
                <dt>Organization Status</dt>
                <dd>
                  <span className={`op-pill op-pill--${verified ? 'success' : 'warning'}`}>
                    {summary.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Member Since</dt>
                <dd>{summary.memberSince}</dd>
              </div>
              <div>
                <dt>Profile Completion</dt>
                <dd>{summary.completion}%</dd>
              </div>
              <div>
                <dt>Total Donations Received</dt>
                <dd>{summary.donationsReceived}</dd>
              </div>
              <div>
                <dt>Beneficiaries Supported</dt>
                <dd>{summary.beneficiaries}</dd>
              </div>
              <div>
                <dt>Active Requests</dt>
                <dd>{summary.activeRequests}</dd>
              </div>
              <div>
                <dt>Partner Donors</dt>
                <dd>{summary.partnerDonors}</dd>
              </div>
            </dl>
          </section>

          <section className="op-card">
            <header className="op-card__head">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <h3>Verification</h3>
                <p>Document review status</p>
              </div>
            </header>
            <ul className="op-verify-list">
              {verificationDocs.map((doc) => (
                <li key={doc.id}>
                  <span>{doc.label}</span>
                  <span className={`op-badge op-badge--${statusTone(doc.status)}`}>
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <div className={`op-actions${dirty ? ' is-dirty' : ''}`}>
        {dirty && (
          <span className="op-unsaved" role="status">
            Unsaved Changes
          </span>
        )}
        <div className="op-actions__btns">
          <button
            type="button"
            className="op-btn op-btn--secondary"
            onClick={handleCancel}
            disabled={!dirty}
          >
            <X size={15} />
            Cancel
          </button>
          <button
            type="submit"
            form="op-profile-form"
            className="op-btn op-btn--primary"
            disabled={!dirty}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
