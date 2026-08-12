import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { persistNgoProfile } from '../../utils/ngoVerificationStore';
import { getDashboardPathForRole } from '../../utils/roleMap';

// ==========================================
// 1. BACKGROUND DECORATIONS COMPONENT (CLEAN BACKGROUND)
// ==========================================
function BackgroundDecorations() {
  return null;
}

// ==========================================
// 2. BACK TO HOME COMPONENT
// ==========================================
function BackToHome() {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-8 lg:px-10 pt-8 sm:pt-10 pb-2 z-10 flex justify-start">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#1268E8] hover:text-[#0B245B] font-semibold text-base sm:text-lg transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.2] group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

// ==========================================
// 3. NGO REGISTRATION CARD COMPONENT
// ==========================================
function NgoRegistrationCard({ onNavigate }) {
  const { register } = useApp();
  const { showToast } = useToast();

  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orgName.trim()) {
      setErrorMsg('Please enter your organization name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms & Conditions.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        role: 'ngo',
        full_name: orgName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
        profile: {
          verified: false,
          verificationStatus: 'registered',
          status: 'Registered NGO'
        }
      });

      persistNgoProfile(email.trim(), {
        verified: false,
        verificationStatus: 'registered',
        status: 'Registered NGO',
        name: user.name
      });

      showToast('NGO account created successfully!', 'success');
      onNavigate(getDashboardPathForRole(user.role));
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[640px] bg-white rounded-[26px] p-6 sm:p-10 md:p-12 shadow-[0_10px_40px_-10px_rgba(18,104,232,0.08)] border border-[#DCE8FA] text-left z-20 flex flex-col items-center my-auto">
      {/* Inner Form Container (Max Width 550px) */}
      <div className="w-full max-w-[550px] mx-auto flex flex-col items-center">
        {/* Main Extracted NGO Logo at Top */}
        <div className="w-[125px] h-[125px] sm:w-[140px] sm:h-[140px] flex items-center justify-center mb-6 shrink-0">
          <img
            src="/assets/ngo/ngo-logo-top.png"
            alt="NGO Partner Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header & Approved Subtitle */}
        <div className="text-center mb-7">
          <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-[32px] leading-tight tracking-tight mb-2">
            Create NGO Account
          </h1>
          <p className="text-[#49638F] text-sm sm:text-[16px] font-medium leading-relaxed max-w-md mx-auto">
            Join as a verified NGO partner and create impact together.
          </p>
        </div>

        {/* Inline Error Alert */}
        {errorMsg && (
          <div className="w-full mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form — EXACTLY 5 FIELDS + TERMS CHECKBOX */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* 1. Organization Name */}
          <div className="space-y-2">
            <label htmlFor="ngo-org-name" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Organization Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="ngo-org-name"
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* 2. Organization Email */}
          <div className="space-y-2">
            <label htmlFor="ngo-email" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Organization Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="ngo-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter official email address"
                autoComplete="email"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* 3. Mobile Number */}
          <div className="space-y-2">
            <label htmlFor="ngo-mobile" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="ngo-mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                autoComplete="tel"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* 4. Password (Full Width Stacked) */}
          <div className="space-y-2">
            <label htmlFor="ngo-password" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="ngo-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-12 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#49638F] hover:text-[#0B245B] transition bg-transparent border-none p-1 outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 5. Confirm Password (Full Width Stacked) */}
          <div className="space-y-2">
            <label htmlFor="ngo-confirm-password" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="ngo-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-12 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#49638F] hover:text-[#0B245B] transition bg-transparent border-none p-1 outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-1 text-[#1268E8] rounded focus:ring-[#1268E8] border-[#DCE8FA] cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[#0B245B] font-medium leading-relaxed">
                I accept the{' '}
                <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1268E8] font-semibold hover:underline">
                  Terms &amp; Conditions
                </a>
              </span>
            </label>
          </div>

          {/* Primary Submit Button — BLUE (#1268E8) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="lp-btn w-full"
            >
              <span>{submitting ? 'Creating account…' : 'Create NGO Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Divider & Sign-In Prompt */}
          <div className="pt-4 space-y-4 text-center">
            <div className="w-full h-[1px] bg-[#DCE8FA]" />
            <p className="text-xs sm:text-sm text-[#49638F] font-medium">
              Already have an account?{' '}
              <Link to="/login?role=ngo" className="text-[#1268E8] font-bold hover:underline ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-8 text-center text-[#49638F] text-xs sm:text-sm font-medium z-10 space-y-2">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <ShieldCheck className="w-4 h-4 text-[#1268E8]" />
        <span className="text-[#0B245B] font-semibold">Secure</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#20B878]" />
        <span>Transparent</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#20B878]" />
        <span>Verified</span>
      </div>
      <p className="text-slate-400">© 2026 Aja Abayahastham. All rights reserved.</p>
    </footer>
  );
}

// ==========================================
// MAIN NGO REGISTRATION PAGE
// ==========================================
export default function NgoRegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col items-center justify-between relative overflow-x-hidden font-sans">
      {/* Extracted NGO Background Assets */}
      <BackgroundDecorations />

      {/* Top Navigation */}
      <BackToHome />

      {/* Central NGO Registration Card */}
      <div className="w-full px-4 sm:px-6 my-auto flex justify-center py-6">
        <NgoRegistrationCard onNavigate={(path) => navigate(path)} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
