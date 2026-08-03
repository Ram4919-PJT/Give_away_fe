import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Gift, HeartHandshake, Package, Bell, IndianRupee, BarChart3, Truck, ShieldCheck,
  Upload, CheckCircle, Clock, Sparkles, Users, Heart, ArrowLeft, ArrowRight,
  Download, FileText, Image as ImageIcon, X, Lock, Star, Wallet, ClipboardList
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useApp, isRoleVerified } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import {
  DONOR_ITEM_CATEGORIES, DONOR_MONEY_PRESETS, DONOR_PURPOSES,
  DONOR_PAYMENT_METHODS, IMPACT_STORIES
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
import {
  getDonorDonations, getDonorStats, normalizeDonorStatus, getJourneyIndex,
  getDonorInitials, statusBadgeClass, formatCurrency, maskBeneficiaryName,
  DONOR_JOURNEY_STEPS
} from '../../utils/donorHelpers';

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
  const { currentUser, donations, notifications } = useApp();
  const navigate = useNavigate();
  const stats = getDonorStats(donations, currentUser);
  const recent = getDonorDonations(donations, currentUser).slice(0, 4);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="donor-page donor-module page-route">
      <div className="donor-hero-banner donor-hero-banner--modern">
        <div className="donor-hero-content">
          <DonorStatusBadge user={currentUser} />
          <h1>Every Donation Creates Hope</h1>
          <p>
            Your generosity helps <strong>AJA Abayahastham</strong> provide support to people in need.
            Track your donations and see the impact you have created.
          </p>
          <AjaNote inline />
        </div>
        <div className="donor-hero-illus donor-hero-illus--modern" aria-hidden="true">
          <div className="donor-hero-graphic">💝</div>
        </div>
      </div>

      <div className="donor-stats-grid donor-stats-grid--4">
        {[
          [Gift, 'Total Donations', stats.totalDonations, 'green'],
          [Package, 'Items Donated', stats.itemsDonated, 'orange'],
          [IndianRupee, 'Money Donated', formatCurrency(stats.moneyDonated), 'blue'],
          [Users, 'Lives Impacted', stats.livesImpacted, 'purple']
        ].map(([Icon, label, val, color]) => (
          <article key={label} className="donor-stat-card donor-stat-card--modern">
            <div className={`donor-stat-icon donor-stat-icon--${color}`}><Icon size={20} /></div>
            <p className="donor-stat-label">{label}</p>
            <p className="donor-stat-value">{val}</p>
          </article>
        ))}
      </div>

      <div className="donor-section">
        <h2 className="donor-section-title">Quick Actions</h2>
        <div className="donor-quick-actions donor-quick-actions--4">
          <button type="button" className="donor-quick-btn donor-quick-btn--premium" onClick={() => navigate('/dashboard/donor-donate-money')}>
            <span className="donor-quick-btn-icon donor-quick-btn-icon--green">
              <Wallet size={24} strokeWidth={1.75} />
            </span>
            <span className="donor-quick-btn-label">Donate Money</span>
            <span className="donor-quick-btn-desc">Support verified campaigns</span>
          </button>
          <button type="button" className="donor-quick-btn donor-quick-btn--premium" onClick={() => navigate('/dashboard/donor-donate-item')}>
            <span className="donor-quick-btn-icon donor-quick-btn-icon--green">
              <Package size={24} strokeWidth={1.75} />
            </span>
            <span className="donor-quick-btn-label">Donate Items</span>
            <span className="donor-quick-btn-desc">Share useful items with people in need</span>
          </button>
          <button type="button" className="donor-quick-btn donor-quick-btn--premium" onClick={() => navigate('/dashboard/donor-my-donations')}>
            <span className="donor-quick-btn-icon donor-quick-btn-icon--green">
              <ClipboardList size={24} strokeWidth={1.75} />
            </span>
            <span className="donor-quick-btn-label">My Donations</span>
            <span className="donor-quick-btn-desc">Track all your donations</span>
          </button>
          <button type="button" className="donor-quick-btn donor-quick-btn--premium" onClick={() => navigate('/dashboard/donor-my-impact')}>
            <span className="donor-quick-btn-icon donor-quick-btn-icon--green">
              <HeartHandshake size={24} strokeWidth={1.75} />
            </span>
            <span className="donor-quick-btn-label">My Impact</span>
            <span className="donor-quick-btn-desc">See the difference you&apos;ve made</span>
          </button>
        </div>
      </div>

      <div className="donor-grid-2">
        <div className="donor-section">
          <div className="donor-section-head">
            <h2 className="donor-section-title">Recent Donations</h2>
            <button type="button" className="donor-section-link" onClick={() => navigate('/dashboard/donor-my-donations')}>View all</button>
          </div>
          {recent.length ? (
            <div className="donor-activity-list">
              {recent.map((d) => (
                <div key={d.id} className="donor-activity-item donor-activity-item--modern">
                  <div className="donor-activity-icon">{d.type === 'Financial' ? '💰' : '📦'}</div>
                  <div className="donor-activity-body">
                    <strong>{d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund} — {d.purpose || d.fund}</strong>
                    <span>{d.date} · <span className={`donor-status-badge ${statusBadgeClass(d.status)}`}>{normalizeDonorStatus(d.status)}</span></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DonorEmpty emoji="🎁" title="No donations yet" desc="Start your giving journey with AJA Abayahastham." actionLabel="Donate Now" onAction={() => navigate('/dashboard/donor-donate-money')} />
          )}
        </div>

        <div className="donor-section">
          <div className="donor-section-head">
            <h2 className="donor-section-title">Notifications</h2>
            <button type="button" className="donor-section-link" onClick={() => navigate('/dashboard/donor-notifications')}>
              View all {unread > 0 && `(${unread})`}
            </button>
          </div>
          {notifications.slice(0, 3).map((n) => (
            <div key={n.id} className={`donor-notif-item donor-notif-item--compact ${n.read ? '' : 'unread'}`}>
              <NotifIcon name={n.icon} />
              <div><strong>{n.title}</strong><p>{n.message}</p></div>
            </div>
          ))}
        </div>
      </div>

      {currentUser?.verified !== true && currentUser?.verified !== 'pending' && (
        <div className="donor-verify-cta">
          <div>
            <h3>Become a Verified Donor</h3>
            <p>Upload documents to unlock verified badge, faster approval, and increased transparency.</p>
          </div>
          <button type="button" className="btn-verify-cta" onClick={() => navigate('/dashboard/donor-verify')}>Verify My Account</button>
        </div>
      )}
    </div>
  );
}

export function DonorDonateMoney() {
  const { dispatch, currentUser } = useApp();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General Donation');
  const [payment, setPayment] = useState(null);

  const isCheckout = payment !== null;
  const numericAmount = Number(amount) || 0;

  const submitDonation = () => {
    if (!numericAmount || numericAmount <= 0) {
      showToast('Enter a valid amount.', 'error');
      return;
    }
    if (!payment) {
      showToast('Select a payment method.', 'error');
      return;
    }
    dispatch({
      type: 'ADD_DONATION',
      payload: {
        id: 'don-' + Date.now(),
        donor: currentUser.name,
        donorEmail: currentUser.email,
        type: 'Financial',
        amount: numericAmount,
        fund: purpose,
        purpose,
        details: `${formatCurrency(amount)} donation for ${purpose}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending Verification',
        paymentMethod: payment,
        livesImpacted: 0,
        familiesHelped: 0,
        usage: null
      }
    });
    showToast('Donation submitted! Thank you for supporting AJA Abayahastham.', 'success');
    setAmount('');
    setPayment(null);
  };

  return (
    <div className="donor-page donor-module page-route donate-money-page">
      <DonorPageHeader title="Donate Money" subtitle="Support AJA Abayahastham programs with a secure financial contribution." />
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
              onPay={submitDonation}
              disabled={!numericAmount}
            />
          </CheckoutRight>
        )}
      </CheckoutLayout>

      <TrustFooter />
    </div>
  );
}

export function DonorDonateItem() {
  const { dispatch, currentUser } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
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

  const submit = () => {
    if (!categoryComplete || !description || !pickupAddress || !pickupDate) {
      showToast('Complete all required fields.', 'error');
      return;
    }
    dispatch({
      type: 'ADD_DONATION',
      payload: {
        id: 'don-' + Date.now(),
        donor: currentUser.name,
        donorEmail: currentUser.email,
        type: 'Items',
        amount: null,
        fund: categoryLabel,
        category: categoryLabel,
        purpose: categoryConfig?.label,
        details: description,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending Pickup',
        pickupAddress,
        pickupDate,
        imageCount: images.length,
        livesImpacted: 0,
        familiesHelped: 0,
        usage: null,
        itemSelections: { categoryId, ...selections }
      }
    });
    showToast('Item donation submitted! AJA will confirm pickup.', 'success');
    setStep(1);
    setCategoryId('');
    setSelections({});
    setDescription('');
    setPickupAddress('');
    setPickupDate('');
    setImages([]);
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
            <button type="button" className="login-submit" onClick={submit}>Submit Donation</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DonorMyDonations() {
  const { donations, currentUser } = useApp();
  const navigate = useNavigate();
  const list = getDonorDonations(donations, currentUser);

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader title="My Donations" subtitle="Track every contribution to AJA Abayahastham and its journey." />
      {list.length ? (
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
  const { showToast } = useToast();

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

      <div className="donor-stats-grid donor-stats-grid--5">
        {[
          [Gift, 'Total Donations', stats.totalDonations],
          [Package, 'Items Donated', stats.itemsDonated],
          [IndianRupee, 'Money Donated', formatCurrency(stats.moneyDonated)],
          [Users, 'Lives Impacted', stats.livesImpacted],
          [Heart, 'Families Helped', stats.familiesHelped]
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

      {completed.some((d) => d.beneficiary) && (
        <div className="donor-section">
          <h2 className="donor-section-title">Beneficiary Information</h2>
          {completed.filter((d) => d.beneficiary).map((d) => (
            <div key={d.id} className="donor-beneficiary-card">
              <div className="donor-beneficiary-grid">
                <div><label>Name</label><p>{d.beneficiary.displayName}</p></div>
                <div><label>City</label><p>{d.beneficiary.city}</p></div>
                <div><label>Assistance Type</label><p>{d.beneficiary.assistanceType}</p></div>
                <div><label>Status</label><p>{d.beneficiary.status}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="donor-section">
        <h2 className="donor-section-title">Impact Stories</h2>
        <div className="donor-stories-grid">
          {IMPACT_STORIES.map((s) => (
            <article key={s.id} className="donor-story-card">
              <div className="donor-story-body">
                <span className="donor-story-emoji">{s.emoji}</span>
                <span className="donor-story-cat">{s.category}</span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </div>
              <footer className="donor-story-footer">
                <span className="donor-story-date">{s.date}</span>
                <button type="button" className="donor-story-read-more" onClick={() => showToast('Full story coming soon.', 'info')}>
                  Read More
                </button>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <div className="donor-section">
        <h2 className="donor-section-title">Delivery Confirmation</h2>
        <div className="donor-delivery-placeholder">
          <ImageIcon size={32} />
          <p>Delivery photos are shown only when consent has been provided.</p>
          <div className="donor-delivery-illus">📦 ✨ 🤝</div>
        </div>
      </div>

      <div className="donor-download-section">
        <button type="button" className="btn-outline" onClick={() => showToast('Receipt downloaded.', 'success')}><Download size={16} /> Download Donation Receipt</button>
        <button type="button" className="btn-outline" onClick={() => showToast('Impact report downloaded.', 'success')}><FileText size={16} /> Download Impact Report</button>
      </div>

      <div className="donor-thank-you-banner">
        <Star size={28} />
        <h2>Thank you for making a difference.</h2>
        <p>Because of your generosity, families have received meaningful support through AJA Abayahastham. Every contribution creates hope.</p>
      </div>
    </div>
  );
}

export function DonorNotifications() {
  const { notifications, dispatch } = useApp();
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
        <DonorEmpty icon={Bell} title="No Notifications" desc="You're all caught up! Updates about your donations will appear here." />
      ) : groups.map(({ key, label }) => {
        const items = notifications.filter((n) => n.group === key);
        if (!items.length) return null;
        return (
          <div key={key} className="donor-notif-group">
            <h3 className="donor-notif-group-label">{label}</h3>
            {items.map((n) => (
              <div key={n.id} className={`donor-notif-item ${n.read ? '' : 'unread'}`} onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey: 'notifications', id: n.id } })}>
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

export function DonorVerify() {
  const { dispatch, currentUser } = useApp();
  const { showToast } = useToast();
  const [uploaded, setUploaded] = useState({});

  const status = currentUser?.verified === true ? 'verified' : currentUser?.verified === 'pending' ? 'pending' : currentUser?.verified === 'rejected' ? 'rejected' : 'none';

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
          <p>Our team is reviewing your documents. You'll be notified once approved.</p>
        </div>
      </div>
    );
  }

  const submit = () => {
    if (!uploaded.aadhaar) { showToast('Aadhaar Card is required.', 'error'); return; }
    dispatch({ type: 'UPDATE_USER', payload: { verified: 'pending' } });
    showToast('Verification submitted for admin review.', 'success');
  };

  const DocUpload = ({ name, required }) => (
    <label className={`donor-doc-upload ${uploaded[name] ? 'uploaded' : ''}`}>
      <input type="file" accept=".pdf,.jpg,.png" onChange={() => setUploaded((u) => ({ ...u, [name]: true }))} />
      <div className="donor-doc-icon">{uploaded[name] ? <CheckCircle size={20} /> : <Upload size={20} />}</div>
      <div><strong>{name}{required ? ' *' : ' (Optional)'}</strong><span>{uploaded[name] ? 'Uploaded ✓' : 'Drag & drop or click'}</span></div>
    </label>
  );

  return (
    <div className="donor-page donor-module page-route">
      <DonorPageHeader title="Become a Verified Donor" subtitle="Optional verification after registration — unlock trust benefits." />
      <div className="donor-verify-benefits">
        <h3>Benefits</h3>
        <ul>
          <li><ShieldCheck size={16} /> Verified Badge on your profile</li>
          <li><Star size={16} /> Higher trust with AJA Abayahastham</li>
          <li><Truck size={16} /> Faster donation approval</li>
          <li><BarChart3 size={16} /> Increased transparency in impact reports</li>
        </ul>
      </div>
      <div className="donor-form-card donor-form-card--modern">
        <h3>Required Documents</h3>
        <div className="donor-doc-grid"><DocUpload name="Aadhaar Card" required /></div>
        <h3>Optional Documents</h3>
        <div className="donor-doc-grid">
          <DocUpload name="Selfie" />
          <DocUpload name="Address Proof" />
        </div>
        <div className="donor-form-actions">
          <button type="button" className="login-submit" onClick={submit}>Submit Verification</button>
        </div>
      </div>
    </div>
  );
}
