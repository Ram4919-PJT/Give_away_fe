import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Gift, HeartHandshake, Package, Bell, IndianRupee, BarChart3, Truck, ShieldCheck,
  Upload, CheckCircle, Clock, Sparkles, Users, Heart, ArrowLeft, ArrowRight,
  Download, FileText, Image as ImageIcon, X, Lock, Star, Wallet, ClipboardList,
  BookOpen, Stethoscope, Utensils, Send,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import {
  DONOR_ITEM_CATEGORIES, DONOR_MONEY_PRESETS, DONOR_PURPOSES,
  DONOR_PAYMENT_METHODS
} from '../../data/donorConstants';
import {
  DONATE_ITEM_CATEGORY_CONFIG,
  getDonateCategoryConfig,
  isCategorySelectionComplete,
  formatDonationCategoryLabel,
  clearDependentSelections
} from '../../data/donateItemCategories';
import CategoryCard from '../../components/donor/donate-item/CategoryCard';
import CategoryPanel from '../../components/donor/donate-item/CategoryPanel';
import CheckoutLayout, { CheckoutLeft, CheckoutRight } from '../../components/donor/donate-money/CheckoutLayout';
import DonationForm from '../../components/donor/donate-money/DonationForm';
import PaymentModule from '../../components/donor/donate-money/PaymentModule';
import TrustFooter from '../../components/donor/donate-money/TrustFooter';
import DonorSettingsPage from '../../components/donor/DonorSettingsPage';
import DonorProfilePage from '../../components/donor/DonorProfilePage';
import DonorDashboardView from '../../components/donor/dashboard/DonorDashboardView';
import {
  getDonorDonations, getDonorStats, normalizeDonorStatus, getJourneyIndex,
  getDonorInitials, statusBadgeClass, formatCurrency, maskBeneficiaryName,
  DONOR_JOURNEY_STEPS
} from '../../utils/donorHelpers';
import { buildMoneyDonationNotes, buildItemDonationNotes } from '../../api/mappers';
import { buildDonorVerificationNotes } from '../../utils/donorVerification';

function NotifIcon({ name, size = 18 }) {
  const key = name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const Cmp = LucideIcons[key] || Bell;
  return <Cmp size={size} />;
}

function DonorStatusBadge({ user }) {
  const verified = user?.verified === true;
  const pending = user?.verified === 'pending';
  if (verified) return <span className="donor-badge donor-badge--verified"><ShieldCheck size={14} /> Verified Donor</span>;
  if (pending) return <span className="donor-badge donor-badge--pending"><Clock size={14} /> Verification Pending</span>;
  return <span className="donor-badge donor-badge--basic">Basic Donor</span>;
}

function DonorEmpty({ icon: Icon, emoji, title, desc, actionLabel, onAction }) {
  return (
    <div className="donor-empty-state">
      <div className="donor-empty-state-icon">{emoji ? <span>{emoji}</span> : Icon ? <Icon size={40} /> : null}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {actionLabel && onAction && (
        <div className="empty-state-actions">
          <button type="button" className="login-submit" onClick={onAction}>{actionLabel}</button>
        </div>
      )}
    </div>
  );
}

function AjaNote({ children, inline }) {
  return (
    <div className={`donor-aja-note ${inline ? 'donor-aja-note--inline' : ''}`}>
      <Heart size={16} />
      <span>{children || 'All donations go directly to AJA Abayahastham — never to individual NGOs.'}</span>
    </div>
  );
}

function DonationTimeline({ status, compact }) {
  const idx = getJourneyIndex(status);
  if (compact) {
    return (
      <div className="donor-timeline donor-timeline--compact">
        {DONOR_JOURNEY_STEPS.map((step, i) => (
          <div key={step} className={`donor-timeline-step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
            <div className="donor-timeline-dot">{i < idx ? <CheckCircle size={10} /> : null}</div>
            <span>{step.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="donor-timeline-detail">
      {DONOR_JOURNEY_STEPS.map((step, i) => (
        <div key={step} className={`donor-timeline-row ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
          <div className="donor-timeline-row-dot">{i < idx ? <CheckCircle size={14} /> : <Clock size={14} />}</div>
          <div><strong>{step}</strong>{i <= idx && <span> — {i < idx ? 'Completed' : 'In progress'}</span>}</div>
        </div>
      ))}
    </div>
  );
}

function DonorPageHeader({ title, subtitle, children }) {
  return (
    <div className="donor-page-header dash-page-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
}

export function DonorDashboard() {
  return <DonorDashboardView />;
}

export function DonorDonateMoney() {
  const { submitDonation, currentUser, programs } = useApp();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General Donation');
  const [payment, setPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const programId = Number(searchParams.get('program_id')) || undefined;
  const isRecurringIntent = searchParams.get('recurring') === '1';
  const selectedProgram = (programs || []).find((p) => Number(p.id || p.program_id) === programId);

  const isCheckout = payment !== null;
  const numericAmount = Number(amount) || 0;

  const submitDonationHandler = async () => {
    if (!numericAmount || numericAmount <= 0) {
      showToast('Enter a valid amount.', 'error');
      return;
    }
    if (!payment) {
      showToast('Select a payment method.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const purposeLabel = selectedProgram?.title || selectedProgram?.program_name || purpose;
      await submitDonation({
        donation_type: 'MONEY',
        amount: numericAmount,
        currency: 'INR',
        program_id: programId,
        notes: buildMoneyDonationNotes({
          purpose: isRecurringIntent ? `${purposeLabel} (Recurring intent)` : purposeLabel,
          amount: numericAmount,
        }),
      });
      showToast(
        isRecurringIntent
          ? 'Donation submitted! Recurring schedules will be available soon — thank you for giving.'
          : 'Donation submitted! Thank you for supporting AJA Abayahastham.',
        'success'
      );
      setAmount('');
      setPayment(null);
    } catch (err) {
      showToast(err.message || 'Could not submit donation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donor-page donor-module page-route donate-money-page">
      <DonorPageHeader
        title={isRecurringIntent ? 'Set Up Recurring Gift' : 'Donate Money'}
        subtitle={
          selectedProgram
            ? `Supporting: ${selectedProgram.title || selectedProgram.program_name}`
            : isRecurringIntent
              ? 'Start with a gift today. Full recurring billing will connect when payment schedules are enabled.'
              : 'Support AJA Abayahastham programs with a secure financial contribution.'
        }
      />
      <AjaNote inline />

      <CheckoutLayout isCheckout={isCheckout}>
        <CheckoutLeft isCheckout={isCheckout}>
          <DonationForm
            checkout={isCheckout}
            amount={amount}
            purpose={purpose}
            payment={payment}
            onAmountChange={setAmount}
            onPurposeChange={setPurpose}
            onPaymentSelect={setPayment}
          />
        </CheckoutLeft>

        {isCheckout && (
          <CheckoutRight paymentKey={payment}>
            <PaymentModule
              payment={payment}
              amount={numericAmount}
              onPay={submitDonationHandler}
              disabled={!numericAmount || submitting}
            />
          </CheckoutRight>
        )}
      </CheckoutLayout>

      <TrustFooter />
    </div>
  );
}

export function DonorDonateItem() {
  const { submitDonation, currentUser } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [selections, setSelections] = useState({});
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [images, setImages] = useState([]);

  const categoryConfig = getDonateCategoryConfig(categoryId);
  const categoryComplete = categoryId && isCategorySelectionComplete(categoryId, selections);
  const categoryLabel = formatDonationCategoryLabel(categoryId, selections);

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    setSelections({});
  };

  const handleSelectionChange = (key, value) => {
    const config = getDonateCategoryConfig(categoryId);
    setSelections((prev) => {
      const cleared = config ? clearDependentSelections(config, key, prev) : prev;
      return { ...cleared, [key]: value };
    });
  };

  const handleConditionChange = (condition) => {
    setSelections((prev) => ({ ...prev, condition }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, { name: file.name, url: reader.result }]);
      reader.readAsDataURL(file);
    });
  };

  const submit = async () => {
    if (!categoryComplete || !description || !pickupAddress || !pickupDate) {
      showToast('Complete all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitDonation({
        donation_type: 'ITEM',
        notes: buildItemDonationNotes({
          category: categoryLabel,
          description,
          pickupAddress,
          pickupDate,
        }),
      });
      showToast('Item donation submitted! AJA will confirm pickup.', 'success');
      setStep(1);
      setCategoryId('');
      setSelections({});
      setDescription('');
      setPickupAddress('');
      setPickupDate('');
      setImages([]);
    } catch (err) {
      showToast(err.message || 'Could not submit donation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donor-page donor-module page-route donate-item-page">
      <DonorPageHeader title="Donate Item" subtitle="Give physical items — AJA Abayahastham coordinates pickup and delivery." />

      <div className="donor-step-indicator donor-step-indicator--donate-item">
        {['Category', 'Details', 'Pickup'].map((s, i) => (
          <div key={s} className={`donor-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <span>{i + 1}</span> {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="donate-item-shell">
          <aside className="donate-item-sidebar" aria-label="Donation categories">
            <div className="donate-item-sidebar__head">
              <h2>Categories</h2>
              <p>Select what you would like to donate</p>
            </div>
            <div className="donate-item-sidebar__list">
              {DONATE_ITEM_CATEGORY_CONFIG.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  selected={categoryId === cat.id}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>
          </aside>

          <CategoryPanel
            category={categoryConfig}
            selections={selections}
            onSelectionChange={handleSelectionChange}
            onConditionChange={handleConditionChange}
          />
        </div>
      )}

      {step > 1 && (
        <div className="donor-form-card donor-form-card--modern donate-item-form-card">
          {step === 2 && (
            <>
              {categoryLabel && (
                <div className="donate-item-selected-banner">
                  <strong>Selected:</strong> {categoryLabel}
                </div>
              )}
              <div className="form-group">
                <label>Item Description</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe items, quantity, size, brand, and any special notes..." />
              </div>
              <label className="donor-doc-upload donor-doc-upload--drag">
                <input type="file" accept="image/*" multiple onChange={handleImages} />
                <Upload size={24} />
                <div><strong>Drag & drop images</strong><span>or click to upload photos of items</span></div>
              </label>
              {images.length > 0 && (
                <div className="donor-image-preview-grid">
                  {images.map((img, i) => (
                    <div key={i} className="donor-image-preview">
                      <img src={img.url} alt={img.name} />
                      <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div className="form-group"><label>Pickup Address</label><textarea rows={2} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Full address for item pickup" /></div>
              <div className="form-group"><label>Preferred Pickup Date</label><input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></div>
              <div className="donor-review-box">
                <strong>{categoryLabel}</strong>
                <p>{description}</p>
                <p className="donor-review-meta">{images.length} photo(s) · Pickup {pickupDate || '—'}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="donor-form-actions donate-item-form-actions">
        {step > 1 && (
          <button type="button" className="btn-outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <div className="btn-group">
          {step < 3 ? (
            <button
              type="button"
              className="login-submit"
              disabled={step === 1 && !categoryComplete}
              onClick={() => setStep(step + 1)}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="login-submit" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Donation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DonorMyDonations() {
  const { donations, currentUser, platformLoading } = useApp();
  const navigate = useNavigate();
  const list = getDonorDonations(donations, currentUser);

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader title="My Donations" subtitle="Track every contribution to AJA Abayahastham and its journey." />
      {platformLoading && !list.length ? (
        <DonorEmpty icon={Gift} title="Loading donations…" desc="Fetching your contribution history." />
      ) : list.length ? (
        <div className="donor-donation-list">
          {list.map((d) => (
            <article key={d.id} className="donor-donation-card donor-donation-card--modern">
              <div className="donor-donation-card-visual">
                {d.type === 'Financial' ? '💰' : '📦'}
              </div>
              <div className="donor-donation-card-body">
                <div className="donor-donation-card-head">
                  <div>
                    <strong>{d.id}</strong>
                    <span>{d.type} · {d.date}</span>
                  </div>
                  <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>{normalizeDonorStatus(d.status)}</span>
                </div>
                <p>{d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund} — {d.details}</p>
                <DonationTimeline status={d.status} compact />
                <button type="button" className="btn-sm-card" onClick={() => navigate(`/dashboard/donor-donation-detail/${d.id}`)}>View Details</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <DonorEmpty icon={Gift} title="No Donations Yet" desc="Your giving journey with AJA Abayahastham starts here." actionLabel="Make Your First Donation" onAction={() => navigate('/dashboard/donor-donate-money')} />
      )}
    </div>
  );
}

export function DonorDonationDetail() {
  const { id } = useParams();
  const { donations, currentUser } = useApp();
  const navigate = useNavigate();
  const d = getDonorDonations(donations, currentUser).find((x) => x.id === id);
  if (!d) return <DonorEmpty title="Donation not found" desc="This donation could not be located." />;

  return (
    <div className="donor-page donor-module page-route">
      <button type="button" className="donor-back-btn" onClick={() => navigate('/dashboard/donor-my-donations')}>
        <ArrowLeft size={16} /> Back to My Donations
      </button>
      <div className="donor-detail-card">
        <div className="donor-detail-head">
          <div>
            <span className="donor-detail-id">{d.id}</span>
            <h1>{d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund}</h1>
            <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>{normalizeDonorStatus(d.status)}</span>
          </div>
          <div className="donor-detail-date">{d.date}</div>
        </div>
        <p>{d.details}</p>
        {d.pickupAddress && <p><strong>Pickup:</strong> {d.pickupAddress} · {d.pickupDate}</p>}
        <h3>Donation Journey</h3>
        <DonationTimeline status={d.status} />
        {d.beneficiary && normalizeDonorStatus(d.status) === 'Completed' && (
          <div className="donor-beneficiary-card">
            <h3>Beneficiary (Privacy Protected)</h3>
            <div className="donor-beneficiary-grid">
              <div><label>Name</label><p>{d.beneficiary.displayName}</p></div>
              <div><label>City</label><p>{d.beneficiary.city}</p></div>
              <div><label>Assistance</label><p>{d.beneficiary.assistanceType}</p></div>
              <div><label>Date Received</label><p>{d.beneficiary.dateReceived}</p></div>
            </div>
            <p className="donor-privacy-note"><Lock size={14} /> Personal documents and contact details are never shown.</p>
          </div>
        )}
        {d.usage && (
          <div className="donor-impact-card donor-impact-card--detail">
            <strong>Impact Summary</strong>
            <p>{d.usage.summary}</p>
            <div className="donor-util-bar"><div style={{ width: `${d.usage.utilizationPercent}%` }} /></div>
            <span>{d.usage.utilizationPercent}% utilized</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DonorMyImpact() {
  const { donations, currentUser } = useApp();
  const navigate = useNavigate();

  if (!isRoleVerified(currentUser)) {
    return (
      <div className="donor-page donor-module page-route">
        <div className="ngo-locked-overlay">
          <Lock size={48} />
          <h2>My Impact Locked</h2>
          <p>Complete donor verification to unlock premium impact analytics and your verified badge.</p>
          <button type="button" className="login-submit" onClick={() => navigate('/dashboard/donor-verify')}>
            Complete Verification
          </button>
        </div>
      </div>
    );
  }

  const stats = getDonorStats(donations, currentUser);
  const list = getDonorDonations(donations, currentUser);
  const completed = list.filter((d) => normalizeDonorStatus(d.status) === 'Completed');

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader title="My Impact" subtitle="See how your generosity through AJA Abayahastham creates real change." />

      <div className="donor-stats-grid donor-stats-grid--4">
        {[
          [Gift, 'Total Donations', stats.totalDonations],
          [Package, 'Items Donated', stats.itemsDonated],
          [IndianRupee, 'Money Donated', formatCurrency(stats.moneyDonated)],
          [CheckCircle, 'Completed', stats.completedDonations]
        ].map(([Icon, label, val]) => (
          <article key={label} className="donor-stat-card donor-stat-card--impact">
            <Icon size={18} />
            <p className="donor-stat-label">{label}</p>
            <p className="donor-stat-value">{val}</p>
          </article>
        ))}
      </div>

      <div className="donor-section">
        <h2 className="donor-section-title">Donation History</h2>
        {list.length ? list.map((d) => (
          <article key={d.id} className="donor-impact-history-card">
            <div className="donor-impact-history-head">
              <strong>{d.id}</strong>
              <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>{normalizeDonorStatus(d.status)}</span>
            </div>
            <p>{d.type} · {d.type === 'Financial' ? formatCurrency(d.amount) : d.category} · {d.date}</p>
            <DonationTimeline status={d.status} compact />
            <button type="button" className="btn-outline btn-sm" onClick={() => navigate(`/dashboard/donor-donation-detail/${d.id}`)}>View Details</button>
          </article>
        )) : (
          <DonorEmpty emoji="✨" title="No Impact Yet" desc="Complete a donation to see your impact journey here." actionLabel="Donate Now" onAction={() => navigate('/dashboard/donor-donate-money')} />
        )}
      </div>

      {completed.length > 0 && (
        <div className="donor-section">
          <h2 className="donor-section-title">Completed Donations</h2>
          <p className="donor-section-subtitle">Donations that reached beneficiaries through AJA Abayahastham.</p>
          {completed.map((d) => (
            <article key={d.id} className="donor-impact-history-card">
              <div className="donor-impact-history-head">
                <strong>{d.id}</strong>
                <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>{normalizeDonorStatus(d.status)}</span>
              </div>
              <p>{d.type} · {d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund} · {d.date}</p>
            </article>
          ))}
        </div>
      )}

      {completed.length === 0 && (
        <DonorEmpty emoji="✨" title="No completed donations yet" desc="When your donations are delivered, they will appear here." actionLabel="Donate Now" onAction={() => navigate('/dashboard/donor-donate-money')} />
      )}

      <div className="donor-thank-you-banner">
        <Star size={28} />
        <h2>Thank you for making a difference.</h2>
        <p>Because of your generosity, families have received meaningful support through AJA Abayahastham. Every contribution creates hope.</p>
      </div>
    </div>
  );
}

export function DonorNotifications() {
  const { notifications, markNotificationReadRemote, platformLoading } = useApp();
  const groups = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'earlier', label: 'Earlier' }
  ];
  const hasAny = notifications.length > 0;

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader title="Notifications" subtitle="Stay updated on your donations and verification status." />
      {!hasAny ? (
        <DonorEmpty icon={Bell} title="No Notifications" desc={platformLoading ? 'Loading notifications…' : "You're all caught up! Updates about your donations will appear here."} />
      ) : groups.map(({ key, label }) => {
        const items = notifications.filter((n) => n.group === key);
        if (!items.length) return null;
        return (
          <div key={key} className="donor-notif-group">
            <h3 className="donor-notif-group-label">{label}</h3>
            {items.map((n) => (
              <div key={n.id} className={`donor-notif-item ${n.read ? '' : 'unread'}`} onClick={() => markNotificationReadRemote('notifications', n.id)}>
                <NotifIcon name={n.icon} />
                <div><strong>{n.title}</strong><p>{n.message}</p><span>{n.time}</span></div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function DonorProfile() {
  return <DonorProfilePage />;
}

export function DonorSettings() {
  return <DonorSettingsPage />;
}

function DonorDocUpload({ name, required, uploaded, setUploaded }) {
  const key = name.toLowerCase().replace(/\s+/g, '');
  return (
    <label className={`donor-doc-upload ${uploaded[key] ? 'uploaded' : ''}`}>
      <input type="file" accept=".pdf,.jpg,.png" onChange={() => setUploaded((u) => ({ ...u, [key]: true }))} />
      <div className="donor-doc-icon">{uploaded[key] ? <CheckCircle size={20} /> : <Upload size={20} />}</div>
      <div><strong>{name}{required ? ' *' : ' (Optional)'}</strong><span>{uploaded[key] ? 'Uploaded ✓' : 'Drag & drop or click'}</span></div>
    </label>
  );
}

function DonorVerifyForm({ onSubmit, submitting, submitLabel = 'Submit Verification' }) {
  const [uploaded, setUploaded] = useState({});

  return (
    <div className="donor-form-card donor-form-card--modern">
      <h3>Required Documents</h3>
      <div className="donor-doc-grid"><DonorDocUpload name="Aadhaar Card" required uploaded={uploaded} setUploaded={setUploaded} /></div>
      <h3>Optional Documents</h3>
      <div className="donor-doc-grid">
        <DonorDocUpload name="Selfie" uploaded={uploaded} setUploaded={setUploaded} />
        <DonorDocUpload name="Address Proof" uploaded={uploaded} setUploaded={setUploaded} />
      </div>
      <div className="donor-form-actions">
        <button
          type="button"
          className="login-submit"
          disabled={submitting}
          onClick={() => onSubmit(uploaded)}
        >
          {submitting ? 'Submitting…' : submitLabel}
        </button>
      </div>
    </div>
  );
}

export function DonorVerify() {
  const { currentUser, submitDonorVerification } = useApp();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const status = currentUser?.verified === true ? 'verified' : currentUser?.verified === 'pending' ? 'pending' : currentUser?.verified === 'rejected' ? 'rejected' : 'none';

  const handleSubmit = async (uploaded) => {
    if (!uploaded.aadhaarcard) {
      showToast('Aadhaar Card is required.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitDonorVerification({
        notes: buildDonorVerificationNotes({
          'Aadhaar Card': uploaded.aadhaarcard,
          Selfie: uploaded.selfie,
          'Address Proof': uploaded.addressproof,
        }),
      });
      showToast('Verification submitted for admin review.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not submit verification.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'verified') {
    return (
      <div className="donor-page donor-module page-route">
        <div className="donor-verify-status donor-verify-status--verified">
          <ShieldCheck size={32} />
          <h2>Verified Donor</h2>
          <p>Your account is verified. Thank you for building trust with AJA Abayahastham.</p>
        </div>
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div className="donor-page donor-module page-route">
        <div className="donor-verify-status donor-verify-status--pending">
          <Clock size={32} />
          <h2>Verification Pending</h2>
          <p>Our team is reviewing your documents. You&apos;ll be notified once approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader
        title={status === 'rejected' ? 'Resubmit Verification' : 'Become a Verified Donor'}
        subtitle={status === 'rejected'
          ? (currentUser?.rejectionReason || 'Please upload your documents again.')
          : 'Optional verification after registration — unlock trust benefits.'}
      />
      {status === 'rejected' && (
        <div className="donor-verify-status donor-verify-status--rejected" style={{ marginBottom: '1rem' }}>
          <X size={24} />
          <p>Previous submission was rejected. You can resubmit below.</p>
        </div>
      )}
      {status !== 'rejected' && (
        <div className="donor-verify-benefits">
          <h3>Benefits</h3>
          <ul>
            <li><ShieldCheck size={16} /> Verified Badge on your profile</li>
            <li><Star size={16} /> Higher trust with AJA Abayahastham</li>
            <li><Truck size={16} /> Faster donation approval</li>
            <li><BarChart3 size={16} /> Increased transparency in impact reports</li>
          </ul>
        </div>
      )}
      <DonorVerifyForm onSubmit={handleSubmit} submitting={submitting} submitLabel={status === 'rejected' ? 'Resubmit Verification' : 'Submit Verification'} />
    </div>
  );
}
