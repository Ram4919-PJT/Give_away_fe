import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';

// ==========================================
// 1. BACKGROUND DECORATIONS COMPONENT
// ==========================================
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none aria-hidden z-0">
      {/* Curved Soft Blue Waves */}
      <svg className="absolute -top-24 -left-24 w-[600px] h-[600px] opacity-40 text-blue-100" viewBox="0 0 600 600" fill="none">
        <path d="M0 200C150 150 250 350 400 250C550 150 600 0 600 0V600H0V200Z" fill="currentColor" />
      </svg>
      <svg className="absolute -bottom-32 -right-32 w-[700px] h-[700px] opacity-30 text-blue-100" viewBox="0 0 700 700" fill="none">
        <circle cx="350" cy="350" r="350" fill="url(#blueGradBg)" />
        <defs>
          <radialGradient id="blueGradBg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(350 350) rotate(90) scale(350)">
            <stop stopColor="#DCE8FA" stopOpacity="0.8" />
            <stop offset="1" stopColor="#F7FAFF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Dotted Grid Top-Right */}
      <div className="absolute top-12 right-12 hidden lg:grid grid-cols-6 gap-3 opacity-25 text-blue-400">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
        ))}
      </div>

      {/* Dotted Grid Left */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:grid grid-cols-4 gap-3 opacity-20 text-blue-400">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
        ))}
      </div>

      {/* Faint Outline Heart Icons */}
      <Heart className="absolute top-28 left-1/4 w-10 h-10 text-blue-200/40 stroke-[1.2]" />
      <Heart className="absolute top-40 right-1/4 w-8 h-8 text-blue-200/35 stroke-[1.5]" />

      {/* Large Pale Illustration: Hands Holding Heart (Lower Right) */}
      <div className="absolute bottom-6 right-8 opacity-15 hidden xl:block text-blue-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-64 h-64">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          <path d="M4 18c2-2 5-3 8-3s6 1 8 3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 2. BACK TO HOME NAVIGATION COMPONENT
// ==========================================
function BackToHome() {
  return (
    <div className="w-full max-w-7xl px-6 sm:px-10 pt-6 sm:pt-10 pb-2 z-10 flex justify-start">
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 text-[#1268E8] hover:text-[#0B245B] font-semibold text-base sm:text-lg transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.2] group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

// ==========================================
// 3. MAIN REGISTRATION CARD COMPONENT
// ==========================================
function RegistrationCard({ onNavigate }) {
  const { register } = useApp();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
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

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
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
      await register({
        role: 'donor',
        full_name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password
      });
      showToast('Account created. Please wait for admin approval before signing in.', 'success');
      onNavigate('/login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[640px] bg-white rounded-[24px] p-6 sm:p-10 shadow-[0_10px_40px_-10px_rgba(18,104,232,0.08)] border border-[#DCE8FA] text-left z-10 flex flex-col items-center my-auto">
      {/* Logo */}
      <div className="w-[68px] h-[68px] rounded-full bg-[#EEF5FF] border border-[#DCE8FA] shadow-inner flex items-center justify-center mb-5 shrink-0 overflow-hidden p-1.5">
        <img
          src="/assets/images/aja_logo.png"
          alt="Give Away Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-[32px] leading-tight tracking-tight mb-1.5">
          Create Donor Account
        </h1>
        <p className="text-[#49638F] text-xs sm:text-[15px] font-medium">
          Join Aja Abayahastham and start giving.
        </p>
      </div>

      {/* Account Role Indicator Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] text-xs font-semibold mb-6">
        <Heart className="w-3.5 h-3.5 fill-[#1268E8] text-[#1268E8]" />
        <span>Create Account</span>
      </div>

      {/* Inline Validation Alert */}
      {errorMsg && (
        <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Donor Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="donor-name" className="text-xs sm:text-sm font-bold text-[#0B245B] block">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49638F]" />
            <input
              id="donor-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-[#FAFCFF] border border-[#DCE8FA] focus:border-[#1268E8] focus:bg-white focus:ring-1 focus:ring-[#1268E8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="donor-email" className="text-xs sm:text-sm font-bold text-[#0B245B] block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49638F]" />
            <input
              id="donor-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#FAFCFF] border border-[#DCE8FA] focus:border-[#1268E8] focus:bg-white focus:ring-1 focus:ring-[#1268E8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-1.5">
          <label htmlFor="donor-mobile" className="text-xs sm:text-sm font-bold text-[#0B245B] block">
            Mobile
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49638F]" />
            <input
              id="donor-mobile"
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-[#FAFCFF] border border-[#DCE8FA] focus:border-[#1268E8] focus:bg-white focus:ring-1 focus:ring-[#1268E8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
            />
          </div>
        </div>

        {/* Password Row (Desktop Side-by-Side 2 Columns, Mobile Stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="donor-password" className="text-xs sm:text-sm font-bold text-[#0B245B] block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49638F]" />
              <input
                id="donor-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-[#FAFCFF] border border-[#DCE8FA] focus:border-[#1268E8] focus:bg-white focus:ring-1 focus:ring-[#1268E8] rounded-xl pl-10 pr-10 py-3 text-sm text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#49638F] hover:text-[#0B245B] transition bg-transparent border-none p-0 outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="donor-confirm-password" className="text-xs sm:text-sm font-bold text-[#0B245B] block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49638F]" />
              <input
                id="donor-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-[#FAFCFF] border border-[#DCE8FA] focus:border-[#1268E8] focus:bg-white focus:ring-1 focus:ring-[#1268E8] rounded-xl pl-10 pr-10 py-3 text-sm text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#49638F] hover:text-[#0B245B] transition bg-transparent border-none p-0 outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="pt-2">
          <label className="w-full bg-[#FAFCFF] border border-[#DCE8FA] rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-[#1268E8]/50 transition">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 text-[#1268E8] rounded focus:ring-[#1268E8] border-[#DCE8FA] cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-[#0B245B] font-medium">
              I accept the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1268E8] font-bold hover:underline">
                Terms &amp; Conditions
              </a>
            </span>
          </label>
        </div>

        {/* Form Actions Row */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <Link
            to="/register"
            className="lp-btn-outline w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="lp-btn w-full sm:flex-1"
          >
            <span>{submitting ? 'Creating account…' : 'Create Donor Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 4. FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer className="w-full border-t border-[#DCE8FA] py-5 px-6 mt-10 bg-white/50 backdrop-blur-xs z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-[#49638F] text-xs sm:text-[15px] font-medium text-center">
        <span>© 2026 Give Away. All rights reserved.</span>
        <span className="hidden md:inline text-[#DCE8FA]">|</span>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1268E8]" />
          <span className="text-[#0B245B] font-semibold">Secure</span>
          <span className="w-2 h-2 rounded-full bg-[#20B878]" />
          <span>Transparent</span>
          <span className="w-2 h-2 rounded-full bg-[#20B878]" />
          <span>Verified</span>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN DONOR REGISTRATION PAGE
// ==========================================
export default function DonorRegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col items-center justify-between relative overflow-x-hidden font-sans">
      {/* Background Artwork */}
      <BackgroundDecorations />

      {/* Top Navigation */}
      <BackToHome />

      {/* Main Registration Card */}
      <div className="w-full px-4 sm:px-6 my-auto flex justify-center py-6">
        <RegistrationCard onNavigate={(path) => navigate(path)} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
