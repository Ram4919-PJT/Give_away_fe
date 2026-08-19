import { useEffect, useMemo, useState } from 'react';
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
import { PageBackLink } from '../../components/ui/FlowNav';
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
import PaymentCheckoutExperience from '../../components/payment/PaymentCheckoutExperience';
import TrustFooter from '../../components/donor/donate-money/TrustFooter';
import DonorSettingsPage from '../../components/donor/DonorSettingsPage';
import DonorProfilePage from '../../components/donor/DonorProfilePage';
import DonorDashboardView from '../../components/donor/dashboard/DonorDashboardView';
import NotificationsCenter from '../../components/notifications/NotificationsCenter';
import MyDonationsView from '../../components/donor/my-donations/MyDonationsView';
import {
  getDonorDonations, getDonorStats, normalizeDonorStatus, getJourneyIndex,
  getDonorInitials, statusBadgeClass, formatCurrency, maskBeneficiaryName,
  DONOR_JOURNEY_STEPS
} from '../../utils/donorHelpers';
import { buildItemDonationNotes } from '../../api/mappers';

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

function DonorPageHeader({ title, subtitle, backTo = '/dashboard/donor-dashboard', backLabel = 'Back to Dashboard', children }) {
  return (
    <header className="donor-page-header dash-page-header">
      <PageBackLink to={backTo} label={backLabel} className="donor-page-header__back" />
      <div className="donor-page-header__content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}

export function DonorDashboard() {
  return <DonorDashboardView />;
}

export function DonorDonateMoney() {
  const { currentUser, programs } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activePrograms = (programs || []).filter((p) => String(p.status || '').toUpperCase() === 'ACTIVE');
  const urlProgramId = Number(searchParams.get('program_id')) || undefined;
  const isRecurringIntent = searchParams.get('recurring') === '1';
  const selectedProgram = activePrograms.find(
    (p) => Number(p.id || p.program_id) === Number(urlProgramId || activePrograms[0]?.program_id)
  );

  const handleSuccess = (donation) => {
    const receipt = {
      donation_id: donation?.donation_id,
      amount: donation?.amount,
      cause: donation?.program_name || selectedProgram?.program_name || 'Charitable donation',
      mobile: currentUser?.mobile,
      donorName: currentUser?.name,
      status: donation?.payment_status || 'CONFIRMED',
      transactionId: donation?.razorpay_payment_id,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    localStorage.setItem('giveaway_last_donation_receipt', JSON.stringify(receipt));
    showToast('Payment successful! Thank you for supporting AJA Abayahastham.', 'success');
    navigate(`/donate/success?donation_id=${donation?.donation_id || ''}`);
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
              : 'Support AJA Abayahastham programs with a secure Razorpay checkout.'
        }
      />
      <AjaNote inline />

      <div className="pay-flow-card pay-flow-card--checkout">
        <PaymentCheckoutExperience
          programs={activePrograms}
          mobile={currentUser?.mobile}
          donorName={currentUser?.name}
          authenticated
          initialProgramId={urlProgramId}
          showHeader={false}
          onSuccess={handleSuccess}
        />
      </div>

      <TrustFooter />
    </div>
  );
}

export function DonorDonateItem() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard/donor-add-item', { replace: true });
  }, [navigate]);
  return null;
}

export function DonorMyDonations() {
  return <MyDonationsView />;
}

export function DonorDonationDetail() {
  const { id } = useParams();
  const { donations, currentUser } = useApp();
  const navigate = useNavigate();
  const d = getDonorDonations(donations, currentUser).find((x) => x.id === id);
  if (!d) return <DonorEmpty title="Donation not found" desc="This donation could not be located." />;

  return (
    <div className="donor-page donor-module page-route">
      <PageBackLink
        to="/dashboard/donor-my-donations"
        label="Back to My Donations"
      />
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

export { default as DonorMyImpact } from '../../components/donor/my-impact/MyImpactView';

export function DonorNotifications() {
  return <NotificationsCenter role="donor" listKey="notifications" />;
}

export { default as DonorAddItem } from '../../components/donor/item-donations/AddDonationItemWizard';
export { DonorItemDetailView as DonorItemDetail, DonorItemRequestsView as DonorItemRequests } from '../../components/donor/item-donations/DonorItemViews';

export function DonorProfile() {
  return <DonorProfilePage />;
}

export function DonorSettings() {
  return <DonorSettingsPage />;
}

export { default as DonorVerify } from '../../components/donor/DonorVerifyPage';
