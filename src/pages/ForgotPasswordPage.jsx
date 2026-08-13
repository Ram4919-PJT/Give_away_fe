import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { forgotPassword, resetPassword } from '../api/iamClient';
import { useToast } from '../components/ui/Toast';

const RESEND_SECONDS = 45;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const prefillEmail = location.state?.email || '';
  const [step, setStep] = useState('email'); // email | reset | done
  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const maskedEmail = useMemo(() => {
    const value = String(email || '').trim();
    const [user, domain] = value.split('@');
    if (!user || !domain) return value;
    const visible = user.slice(0, Math.min(2, user.length));
    return `${visible}${'•'.repeat(Math.max(user.length - visible.length, 2))}@${domain}`;
  }, [email]);

  const sendOtp = async () => {
    const cleaned = String(email || '').trim().toLowerCase();
    if (!cleaned || !cleaned.includes('@')) {
      showToast('Enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await forgotPassword(cleaned);
      setEmail(cleaned);
      setStep('reset');
      setResendIn(RESEND_SECONDS);
      showToast('If an account exists for that email, an OTP has been sent.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not send OTP. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const code = String(otp || '').trim();
    if (!/^\d{4,6}$/.test(code)) {
      showToast('Enter the 4–6 digit OTP from your email.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        email,
        otp_code: code,
        new_password: password,
      });
      setStep('done');
      showToast('Password updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Invalid OTP or reset failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F8FE] via-[#EEF5FF] to-[#F8FAFC] flex flex-col p-4 sm:p-8 font-sans">
      <header className="w-full max-w-lg mx-auto mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#0B57D0] font-semibold text-xs sm:text-sm border border-[#DCE8FA] transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          Back to Sign in
        </Link>
      </header>

      <main className="w-full max-w-lg mx-auto my-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-[0_16px_50px_-10px_rgba(11,87,208,0.1)] border border-[#DCE8FA]">
          <div className="w-14 h-14 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#0B57D0] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 stroke-[2.2]" />
          </div>

          {step === 'email' && (
            <>
              <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-3xl text-center mb-1.5">
                Forgot password
              </h1>
              <p className="text-[#475569] text-xs sm:text-sm font-medium text-center leading-relaxed mb-6">
                Enter your registered email. We’ll send a one-time code to reset your password.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendOtp();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="fp-email">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={submitting}
                      className="auth-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="lp-btn w-full mt-2">
                  <span>{submitting ? 'Sending…' : 'Send OTP'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-3xl text-center mb-1.5">
                Reset password
              </h1>
              <p className="text-[#475569] text-xs sm:text-sm font-medium text-center leading-relaxed mb-6">
                Enter the OTP sent to <span className="font-bold text-[#0B245B]">{maskedEmail}</span>, then choose a new password.
              </p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="fp-otp">
                    OTP code
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="fp-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code"
                      autoComplete="one-time-code"
                      required
                      disabled={submitting}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="fp-pass">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="fp-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      disabled={submitting}
                      className="auth-input auth-input--with-toggle"
                    />
                    <button
                      type="button"
                      className="auth-icon-btn"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="fp-confirm">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="fp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      disabled={submitting}
                      className="auth-input auth-input--with-toggle"
                    />
                    <button
                      type="button"
                      className="auth-icon-btn"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="lp-btn w-full mt-1">
                  <span>{submitting ? 'Updating…' : 'Update password'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    className="auth-text-link"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setPassword('');
                      setConfirm('');
                    }}
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    className="auth-text-link"
                    disabled={submitting || resendIn > 0}
                    onClick={sendOtp}
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4 py-2">
              <h1 className="text-[#0B245B] font-extrabold text-2xl sm:text-3xl">
                Password updated
              </h1>
              <p className="text-[#475569] text-sm font-medium leading-relaxed">
                Your password was reset successfully. Sign in with your new password.
              </p>
              <button
                type="button"
                className="lp-btn w-full"
                onClick={() => navigate('/login', { replace: true, state: { email } })}
              >
                <span>Go to Sign in</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-[#64748B] mt-4 font-medium">
          For security, we never confirm whether an email is registered.
        </p>
      </main>
    </div>
  );
}
