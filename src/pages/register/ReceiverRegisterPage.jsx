import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { getDashboardPathForRole } from '../../utils/roleMap';

// ==========================================
// 1. BACKGROUND DECORATIONS COMPONENT
// ==========================================
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none aria-hidden z-0">
      {/* Soft Flowing Pale-Blue Waves */}
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

      {/* Faint Floating Icons */}
      <div className="absolute top-32 left-1/4 opacity-25 text-blue-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-16 opacity-20 text-blue-300 hidden lg:block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* Large Pale Receiver / Hand / Heart Illustration (Right Side) */}
      <div className="absolute top-1/3 right-6 opacity-20 hidden lg:block text-blue-500">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-72">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100 45c-20 0-35 15-35 35 0 30 35 65 35 65s35-35 35-65c0-20-15-35-35-35z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
          <path d="M60 145c15-10 30-12 40-12s25 2 40 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 2. BACK TO HOME COMPONENT
// ==========================================
function BackToHome() {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-10 pt-6 sm:pt-10 pb-2 z-10 flex justify-start">
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
// 3. RECEIVER REGISTRATION CARD COMPONENT
// ==========================================
function ReceiverRegistrationCard({ onNavigate }) {
  const { register } = useApp();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms & Conditions.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        role: 'receiver',
        full_name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password
      });
      showToast('Receiver account created! Welcome to Give Away.', 'success');
      onNavigate(getDashboardPathForRole(user.role));
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-white rounded-[26px] p-6 sm:p-10 md:p-12 shadow-[0_10px_40px_-10px_rgba(18,104,232,0.08)] border border-[#DCE8FA] text-left z-10 flex flex-col items-center my-auto">
      {/* Form Container (Inner Max Width 475px) */}
      <div className="w-full max-w-[475px] mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] rounded-full bg-[#EEF5FF] border border-[#DCE8FA] shadow-inner flex items-center justify-center mb-6 shrink-0 overflow-hidden p-2">
          <img
            src="/assets/images/aja_logo.png"
            alt="Aja Abayahastham Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-[30px] leading-tight tracking-tight mb-2">
            Create Receiver Account
          </h1>
          <p className="text-[#49638F] text-sm sm:text-[17px] font-medium leading-relaxed max-w-sm mx-auto">
            Sign up to apply for financial assistance from Aja Abayahastham.
          </p>
        </div>

        {/* Validation Error Alert */}
        {errorMsg && (
          <div className="w-full mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="receiver-full-name" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="receiver-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="receiver-email" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="receiver-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label htmlFor="receiver-mobile" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="receiver-mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                autoComplete="tel"
                className="w-full h-[50px] sm:h-[52px] bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-[10px] pl-12 pr-4 text-sm sm:text-base text-[#0B245B] placeholder-[#94A3B8] outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="receiver-password" className="text-sm sm:text-[15px] font-semibold text-[#0B245B] block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49638F]" />
              <input
                id="receiver-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
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
                </a>{' '}
                of Aja Abayahastham
              </span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="lp-btn w-full"
            >
              <span>{submitting ? 'Creating account…' : 'Create Receiver Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Divider & Sign-In Prompt */}
          <div className="pt-4 space-y-4 text-center">
            <div className="w-full h-[1px] bg-[#DCE8FA]" />
            <p className="text-xs sm:text-sm text-[#49638F] font-medium">
              Already have an account?{' '}
              <Link to="/login?role=receiver" className="text-[#1268E8] font-bold hover:underline ml-1">
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
// MAIN RECEIVER REGISTRATION PAGE
// ==========================================
export default function ReceiverRegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col items-center justify-between relative overflow-x-hidden font-sans">
      {/* Background Subtle Artwork */}
      <BackgroundDecorations />

      {/* Top Navigation */}
      <BackToHome />

      {/* Central Registration Card */}
      <div className="w-full px-4 sm:px-6 my-auto flex justify-center py-6">
        <ReceiverRegistrationCard onNavigate={(path) => navigate(path)} />
      </div>

      {/* Footer Bar */}
      <Footer />
    </div>
  );
}
