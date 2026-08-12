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
  const { currentUser, donations, notifications, platformLoading, markNotificationReadRemote } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const stats = getDonorStats(donations, currentUser);
  const userDonations = getDonorDonations(donations, currentUser);
  const recent = userDonations.slice(0, 4);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const loading = platformLoading && !donations.length;

  const [dateRange, setDateRange] = useState('May 12, 2024 - Jun 12, 2024');
  const [overviewFilter, setOverviewFilter] = useState('this-month');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fallback Recent Donations matching screenshot thumbnails if user has no data yet
  const defaultRecentDonations = [
    {
      id: 'd1',
      title: 'Education for All',
      ngo: 'Asha Kiran Foundation',
      date: 'Jun 10, 2024',
      amount: 2500,
      status: 'Completed',
      thumbnail: '/assets/donor/Education_for_All.png'
    },
    {
      id: 'd2',
      title: 'Food for Hunger',
      ngo: 'Smile Foundation',
      date: 'Jun 08, 2024',
      amount: 1000,
      status: 'Completed',
      thumbnail: '/assets/donor/Food_for_Hunger.png'
    },
    {
      id: 'd3',
      title: 'Healthcare Support',
      ngo: 'HealthCare For All',
      date: 'Jun 05, 2024',
      amount: 2000,
      status: 'Completed',
      thumbnail: '/assets/donor/Healthcare_Support.png'
    },
    {
      id: 'd4',
      title: 'Save Environment',
      ngo: 'Green Earth Initiative',
      date: 'Jun 01, 2024',
      amount: 1500,
      status: 'Completed',
      thumbnail: '/assets/donor/Save_Environment.png'
    }
  ];

  const displayRecent = recent.length > 0
    ? recent.map((d, i) => ({
        id: d.id || `rec-${i}`,
        title: d.purpose || d.fund || d.category || 'General Support',
        ngo: d.ngoName || d.foundation || 'Aja Abayahastham Foundation',
        date: d.date || 'Recently',
        amount: d.amount || 1000,
        status: normalizeDonorStatus(d.status) || 'Completed',
        thumbnail: i % 4 === 0 ? '/assets/donor/Education_for_All.png'
                 : i % 4 === 1 ? '/assets/donor/Food_for_Hunger.png'
                 : i % 4 === 2 ? '/assets/donor/Healthcare_Support.png'
                 : '/assets/donor/Save_Environment.png'
      }))
    : defaultRecentDonations;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aja Abayahastham — My Giving Journey',
          text: `I've supported ${stats.totalDonations || 4} causes on Aja Abayahastham! Join me in making an impact.`,
          url: window.location.origin
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      showToast('Link copied to clipboard! Share it with your friends.', 'success');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFF] p-4 sm:p-6 lg:p-8 space-y-6 text-[#0B245B] font-sans">
      {/* 1. TOP HEADER */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-transparent pb-2">
        <div>
          <span className="text-xs sm:text-sm font-medium text-[#49638F] block">Welcome back,</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B245B] flex items-center gap-2">
            <span>{currentUser?.name || 'Rahul Kumar'}</span>
            <span className="text-2xl">👋</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => navigate('/dashboard/donor-notifications')}
            className="relative p-2.5 rounded-xl bg-white border border-[#DCE8FA] text-[#0B245B] hover:bg-[#EEF5FF] transition cursor-pointer outline-none shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1268E8] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile User Area */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-white border border-[#DCE8FA] hover:bg-[#EEF5FF] transition cursor-pointer outline-none shadow-sm"
            >
              <img
                src="/assets/donor/Donor_Profile_Avatar.png"
                alt="Donor Avatar"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#DCE8FA]"
              />
              <div className="text-left hidden sm:block">
                <div className="text-sm font-bold text-[#0B245B] leading-tight">
                  {currentUser?.name || 'Rahul Kumar'}
                </div>
                <div className="text-xs font-semibold text-[#1268E8] leading-tight">
                  Donor
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#DCE8FA] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={() => { setShowProfileMenu(false); navigate('/dashboard/donor-settings'); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#0B245B] hover:bg-[#EEF5FF] flex items-center gap-2 border-none bg-transparent cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#1268E8]" />
                  <span>Profile Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowProfileMenu(false); navigate('/dashboard/donor-my-donations'); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#0B245B] hover:bg-[#EEF5FF] flex items-center gap-2 border-none bg-transparent cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#1268E8]" />
                  <span>My Donations</span>
                </button>
                <div className="my-1 border-t border-[#DCE8FA]" />
                <button
                  type="button"
                  onClick={() => { setShowProfileMenu(false); navigate('/login'); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative w-full rounded-2xl bg-gradient-to-r from-[#EEF5FF] via-[#F4F8FF] to-[#EBF3FF] p-6 sm:p-8 lg:p-10 border border-[#DCE8FA] shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Date Selector Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DCE8FA] text-xs font-semibold text-[#0B245B] shadow-sm">
            <span>{dateRange}</span>
            <Clock className="w-3.5 h-3.5 text-[#1268E8]" />
          </div>
        </div>

        {/* Hero Left Text */}
        <div className="space-y-3 max-w-xl text-left z-10 pt-4 md:pt-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B245B] leading-tight tracking-tight">
            Thank you for being<br />
            <span className="text-[#1268E8]">a force for good!</span>
          </h2>
          <p className="text-sm sm:text-base text-[#49638F] font-medium leading-relaxed">
            Your generosity is creating a better tomorrow for countless lives.
          </p>
        </div>

        {/* Hero Right Image / Illustration */}
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] shrink-0 flex justify-center z-10">
          <img
            src="/assets/donor/Donor_Dashboard_Heart_Hands_Hero.png"
            alt="Force for Good Illustration"
            className="w-full h-auto object-contain drop-shadow-md"
          />
        </div>
      </section>

      {/* 3. STATISTICS CARDS (4 COLUMNS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Donations */}
        <div className="bg-white rounded-2xl p-5 border border-[#DCE8FA] shadow-sm flex items-center gap-4 hover:border-[#1268E8]/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-xs font-semibold text-[#49638F] block">Total Donations</span>
            <div className="text-2xl font-extrabold text-[#0B245B]">
              ₹{stats.moneyDonated ? stats.moneyDonated.toLocaleString() : '25,780'}
            </div>
            <div className="text-xs font-bold text-[#20B878] flex items-center gap-1">
              <span>↑ 18.6%</span>
              <span className="font-medium text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        {/* Lives Impacted */}
        <div className="bg-white rounded-2xl p-5 border border-[#DCE8FA] shadow-sm flex items-center gap-4 hover:border-[#1268E8]/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#20B878] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-xs font-semibold text-[#49638F] block">Lives Impacted</span>
            <div className="text-2xl font-extrabold text-[#0B245B]">18,600+</div>
            <div className="text-xs font-bold text-[#20B878] flex items-center gap-1">
              <span>↑ 22.4%</span>
              <span className="font-medium text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        {/* NGOs Supported */}
        <div className="bg-white rounded-2xl p-5 border border-[#DCE8FA] shadow-sm flex items-center gap-4 hover:border-[#1268E8]/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-xs font-semibold text-[#49638F] block">NGOs Supported</span>
            <div className="text-2xl font-extrabold text-[#0B245B]">32</div>
            <div className="text-xs font-bold text-[#20B878] flex items-center gap-1">
              <span>↑ 14.3%</span>
              <span className="font-medium text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        {/* Years of Giving */}
        <div className="bg-white rounded-2xl p-5 border border-[#DCE8FA] shadow-sm flex items-center gap-4 hover:border-[#1268E8]/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-xs font-semibold text-[#49638F] block">Years of Giving</span>
            <div className="text-2xl font-extrabold text-[#0B245B]">3.2 Years</div>
            <div className="text-xs font-semibold text-[#1268E8]">Thank you! 💙</div>
          </div>
        </div>
      </section>

      {/* 4. MAIN DASHBOARD CONTENT GRID (3 CARDS ROW) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CARD 1: RECENT DONATIONS */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-5 h-full">
          <div className="flex items-center justify-between border-b border-[#DCE8FA] pb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#1268E8]" />
              <h2 className="text-lg font-bold text-[#0B245B]">Recent Donations</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-my-donations')}
              className="text-xs font-bold text-[#1268E8] hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {displayRecent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#F7FAFF] transition border border-transparent hover:border-[#DCE8FA]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#DCE8FA]"
                  />
                  <div className="text-left truncate">
                    <h3 className="text-sm font-bold text-[#0B245B] truncate">{item.title}</h3>
                    <p className="text-xs text-[#49638F] truncate">{item.ngo}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <div className="text-xs text-slate-400 font-medium">{item.date}</div>
                  <div className="text-sm font-extrabold text-[#0B245B]">₹{item.amount.toLocaleString()}</div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E8F8F0] text-[#20B878]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: DONATION OVERVIEW (LINE CHART) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-5 h-full">
          <div className="flex items-center justify-between border-b border-[#DCE8FA] pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1268E8]" />
              <h2 className="text-lg font-bold text-[#0B245B]">Donation Overview</h2>
            </div>
            <select
              value={overviewFilter}
              onChange={(e) => setOverviewFilter(e.target.value)}
              className="text-xs font-semibold bg-[#EEF5FF] text-[#1268E8] border border-[#DCE8FA] rounded-lg px-2.5 py-1 outline-none cursor-pointer"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          <div className="text-left space-y-1">
            <div className="text-2xl font-extrabold text-[#0B245B]">₹7,000</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#49638F] font-medium">Total this month</span>
              <span className="font-bold text-[#20B878]">↑ 12.5% vs last month</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full pt-4">
            <svg className="w-full h-36 overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1268E8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1268E8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />

              {/* Area Fill */}
              <polygon
                points="0,100 0,90 60,60 120,85 180,35 240,65 300,50 300,100"
                fill="url(#chartGradient)"
              />

              {/* Line Curve */}
              <polyline
                fill="none"
                stroke="#1268E8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,90 60,60 120,85 180,35 240,65 300,50"
              />

              {/* Data Points */}
              <circle cx="0" cy="90" r="4" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="60" cy="60" r="4" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="120" cy="85" r="4" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="180" cy="35" r="5" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="240" cy="65" r="4" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="300" cy="50" r="4" fill="#1268E8" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* X-Axis Date Labels */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#49638F] pt-2">
              <span>May 12</span>
              <span>May 19</span>
              <span>May 26</span>
              <span>Jun 02</span>
              <span>Jun 09</span>
            </div>
          </div>
        </div>

        {/* CARD 3: TOP CAUSES SUPPORTED (DONUT CHART) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-5 h-full">
          <div className="flex items-center justify-between border-b border-[#DCE8FA] pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1268E8]" />
              <h2 className="text-lg font-bold text-[#0B245B]">Top Causes Supported</h2>
            </div>
          </div>

          {/* SVG Donut Chart with Center Text */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Ring */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="3.8"
              />

              {/* Segment 1: Education (Blue 39%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1268E8"
                strokeWidth="4"
                strokeDasharray="39, 100"
              />

              {/* Segment 2: Healthcare (Green 25%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#20B878"
                strokeWidth="4"
                strokeDasharray="25, 100"
                strokeDashoffset="-39"
              />

              {/* Segment 3: Food & Shelter (Orange 21%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F97316"
                strokeWidth="4"
                strokeDasharray="21, 100"
                strokeDashoffset="-64"
              />

              {/* Segment 4: Environment (Purple 15%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#A855F7"
                strokeWidth="4"
                strokeDasharray="15, 100"
                strokeDashoffset="-85"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-extrabold text-[#0B245B]">₹25,780</span>
              <span className="text-[10px] font-semibold text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs font-semibold text-[#49638F] pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1268E8]" />
                <span>Education</span>
              </div>
              <span className="text-[#0B245B] font-bold">₹10,200 (39%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20B878]" />
                <span>Healthcare</span>
              </div>
              <span className="text-[#0B245B] font-bold">₹6,500 (25%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                <span>Food &amp; Shelter</span>
              </div>
              <span className="text-[#0B245B] font-bold">₹5,300 (21%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                <span>Environment</span>
              </div>
              <span className="text-[#0B245B] font-bold">₹3,780 (15%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CARDS ROW (CONTINUE IMPACT & SHARE IMPACT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CONTINUE YOUR IMPACT */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#1268E8]" />
              <h2 className="text-lg font-bold text-[#0B245B]">Continue Your Impact</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#49638F] font-medium leading-relaxed">
              Make a recurring donation and help create a lasting change.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              style={{ backgroundColor: '#1268E8' }}
              className="h-11 px-6 rounded-xl text-white font-bold text-xs sm:text-sm hover:bg-[#0f54be] transition border-none cursor-pointer shadow-md shadow-blue-500/20"
            >
              Set Up Recurring Donation
            </button>
          </div>

          {/* Cause Category Shortcuts */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              className="p-3 rounded-xl bg-[#F7FAFF] border border-[#DCE8FA] hover:border-[#1268E8] transition flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#0B245B]">Education</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              className="p-3 rounded-xl bg-[#F7FAFF] border border-[#DCE8FA] hover:border-[#1268E8] transition flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8F8F0] text-[#20B878] flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#0B245B]">Healthcare</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              className="p-3 rounded-xl bg-[#F7FAFF] border border-[#DCE8FA] hover:border-[#1268E8] transition flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#0B245B]">Food &amp; Shelter</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/donor-donate-money')}
              className="p-3 rounded-xl bg-[#F7FAFF] border border-[#DCE8FA] hover:border-[#1268E8] transition flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#A855F7] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#0B245B]">Women Empowerment</span>
            </button>
          </div>
        </div>

        {/* SHARE YOUR IMPACT */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-4 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1268E8]" />
              <h2 className="text-lg font-bold text-[#0B245B]">Share Your Impact</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#49638F] font-medium leading-relaxed">
              Inspire others by sharing your journey of giving.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleShare}
              className="h-10 px-5 rounded-xl border border-[#1268E8] text-[#1268E8] hover:bg-[#EEF5FF] font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer bg-white"
            >
              <Send className="w-4 h-4" />
              <span>Share Now</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DonorDonateMoney() {
  const { submitDonation, currentUser } = useApp();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General Donation');
  const [payment, setPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      await submitDonation({
        donation_type: 'MONEY',
        amount: numericAmount,
        currency: 'INR',
        notes: buildMoneyDonationNotes({ purpose, amount: numericAmount }),
      });
      showToast('Donation submitted! Thank you for supporting AJA Abayahastham.', 'success');
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
