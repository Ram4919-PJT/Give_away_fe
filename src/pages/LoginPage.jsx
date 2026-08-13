import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, ShieldCheck, UserCheck, Quote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { useLogoutAction } from '../hooks/useLogoutAction';
import { getDashboardPathForRole } from '../utils/roleMap';

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gentle floating wave graphics */}
      <svg
        className="absolute -left-20 -bottom-20 w-[600px] h-[600px] opacity-40 text-[#E2EDFF]"
        fill="currentColor"
        viewBox="0 0 600 600"
      >
        <path d="M0,300 C150,200 350,400 600,300 L600,600 L0,600 Z" />
      </svg>
      <svg
        className="absolute -right-20 -top-20 w-[700px] h-[700px] opacity-30 text-[#E8EEF5]"
        fill="currentColor"
        viewBox="0 0 700 700"
      >
        <path d="M700,350 C550,450 350,250 0,350 L0,0 L700,0 Z" />
      </svg>

      {/* Faint dot grid top right */}
      <div className="absolute top-12 right-12 opacity-20 hidden md:block">
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0B57D0]" />
          ))}
        </div>
      </div>

      {/* Faint dot grid bottom left */}
      <div className="absolute bottom-12 left-12 opacity-20 hidden md:block">
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0B57D0]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, currentUser, authLoading, logoutLoading } = useApp();
  const { requestLogout, LogoutDialog } = useLogoutAction({ redirectTo: '/login', skipConfirm: true });
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(getDashboardPathForRole(currentUser.role), { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Enter email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name || 'User'}!`, 'success');
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      showToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0F4F9] flex items-center justify-center text-[#0B245B] font-sans">
        <p className="text-sm font-semibold tracking-wide animate-pulse">Loading session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F8FE] via-[#EEF5FF] to-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 lg:p-10 relative overflow-hidden font-sans">
      {LogoutDialog}
      <BackgroundDecorations />

      {/* Top Bar Navigation */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 mb-4 sm:mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#0B57D0] font-semibold text-xs sm:text-sm border border-[#DCE8FA] shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Dual-Column Container */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto z-10 py-4">
        {/* Left Column: Branding & Info Section */}
        <section className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-6">
          {/* Logo & Brand Heading */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBF3FE] border border-[#DCE8FA] shadow-sm flex items-center justify-center p-3 shrink-0">
              <img
                src="/assets/images/aja_logo.png"
                alt="Aja Abayahastham Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight">
                Aja Abayahastham
              </h1>
              <p className="text-[#475569] font-medium text-xs sm:text-sm mt-0.5">
                Trust &amp; Transparency in Every Gift
              </p>
            </div>
          </div>

          {/* Intro Description */}
          <p className="text-[#475569] text-xs sm:text-sm leading-relaxed max-w-lg mb-6 sm:mb-8 font-normal">
            A secure platform connecting generous donors, verified NGOs, and communities in need — with full accountability at every step.
          </p>

          {/* Feature Bullet Points */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#0B57D0] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[#0F172A] font-semibold text-xs sm:text-sm">
                End-to-end donation tracking
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#0B57D0] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[#0F172A] font-semibold text-xs sm:text-sm">
                Verified NGO &amp; receiver onboarding
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#0B57D0] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[#0F172A] font-semibold text-xs sm:text-sm">
                Secure IAM authentication
              </span>
            </div>
          </div>

          {/* Quote Card (Bottom Left) */}
          <div className="bg-[#EBF3FE]/90 border border-[#DCE8FA] rounded-2xl p-4 sm:p-5 max-w-md shadow-xs flex items-start gap-3.5 mt-2">
            <Quote className="w-5 h-5 text-[#0B57D0] shrink-0 rotate-180 fill-[#0B57D0]/20 mt-0.5" />
            <div>
              <p className="text-[#0F172A] font-bold text-xs sm:text-sm leading-snug">
                Small acts of kindness, create big change.
              </p>
              <div className="w-10 h-0.5 bg-[#0B57D0] rounded-full mt-2" />
            </div>
          </div>
        </section>

        {/* Right Column: Sign-In Form Card */}
        <section className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl sm:rounded-[28px] p-6 sm:p-10 lg:p-11 shadow-[0_16px_50px_-10px_rgba(11,87,208,0.1)] border border-[#DCE8FA] max-w-lg w-full">
            {/* Top Shield Badge Header */}
            <div className="w-14 h-14 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#0B57D0] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>

            <h2 className="text-[#0B245B] font-extrabold text-2xl sm:text-3xl text-center mb-1.5">
              Sign in to your account
            </h2>
            <p className="text-[#475569] text-xs sm:text-sm font-medium text-center leading-relaxed max-w-sm mx-auto mb-6 sm:mb-8">
              Use the email and password registered with the platform. New accounts can sign in only after admin approval.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0B57D0] focus:bg-white focus:ring-4 focus:ring-[#0B57D0]/10 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={submitting}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0B57D0] focus:bg-white focus:ring-4 focus:ring-[#0B57D0]/10 rounded-xl pl-11 pr-11 py-3 sm:py-3.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-icon-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password', { state: { email } })}
                  className="auth-text-link"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary CTA Sign-In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="lp-btn w-full"
                >
                  <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Divider & Signup Prompt */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-[#E2E8F0]" />
                <span className="absolute bg-white px-3 text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">
                  or
                </span>
              </div>

              <div className="text-center text-xs sm:text-sm font-medium text-[#475569]">
                New here?{' '}
                <Link to="/register" className="text-[#0B57D0] font-bold hover:underline ml-1">
                  Create an account
                </Link>
              </div>

              {/* Notice Banner (Bottom of Card) */}
              <div className="bg-[#EEF5FF] border border-[#DCE8FA] rounded-2xl p-3 sm:p-3.5 text-[11px] sm:text-xs text-[#0B245B] flex items-center justify-center gap-2 font-semibold text-center mt-5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0B57D0] shrink-0" />
                <span>All access attempts are tracked and audited.</span>
              </div>
            </form>

            {currentUser && (
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-center">
                <p className="text-xs text-[#475569]">
                  Currently signed in as <span className="font-bold text-[#0B245B]">{currentUser.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={requestLogout}
                  disabled={logoutLoading}
                  className="text-xs text-[#0B57D0] hover:underline font-bold mt-1 bg-transparent border-none cursor-pointer"
                >
                  {logoutLoading ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Clean Footer Row */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 z-10 pt-4 text-xs text-[#64748B] font-medium border-t border-[#E2E8F0]/60 mt-4">
        <div>© 2026 Aja Abayahastham. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0B57D0] transition">
            Privacy Policy
          </a>
          <span>|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0B57D0] transition">
            Terms &amp; Conditions
          </a>
        </div>
      </footer>
    </div>
  );
}
