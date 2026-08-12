import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PhoneCall, UserPlus, Zap, ShieldCheck, Clock, Gift, Award, ArrowRight } from 'lucide-react';
import { CharityPromoPanel, BackToHomeLink, FooterTrustStrip } from './CharityPromoPanel';

export default function DonationEntryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between font-sans text-[#0B245B] relative overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src="/assets/donor/Aja_Abayahastham_Brand_Logo.png"
            alt="Aja Abayahastham Logo"
            className="w-10 h-10 object-contain"
          />
          <div className="text-left">
            <div className="text-lg font-extrabold text-[#0B245B] leading-tight">Aja Abayahastham</div>
            <div className="text-xs font-medium text-[#49638F] leading-tight">Trust &amp; Transparency in Every Gift</div>
          </div>
        </Link>
        <BackToHomeLink />
      </header>

      {/* Main Content Split Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 my-auto py-6 z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-12">
        {/* Left Charity Promotional Section */}
        <CharityPromoPanel
          privacyMessage="You can donate as a guest using your phone number or create an account for a better experience."
        />

        {/* Right Selection Card (Matches REFERENCE 1) */}
        <div className="w-full lg:flex-1 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#DCE8FA] shadow-[0_10px_40px_-10px_rgba(18,104,232,0.06)] flex flex-col justify-between space-y-6 text-left">
          {/* Card Title Header */}
          <div className="text-center space-y-1.5 border-b border-[#DCE8FA] pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">
              Welcome to Aja Abayahastham
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#49638F]">
              Sign in to donate quickly or create an account for a personalized experience.
            </p>
          </div>

          {/* Options Grid (Side-by-side on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative my-auto">
            {/* Divider Badge (Desktop Center OR) */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#DCE8FA] text-[11px] font-bold text-[#49638F] items-center justify-center shadow-xs z-10">
              OR
            </div>

            {/* OPTION A: Sign In with Mobile Number */}
            <div className="bg-[#FAFCFF] border border-[#DCE8FA] hover:border-[#1268E8]/50 rounded-2xl p-6 flex flex-col justify-between space-y-5 transition shadow-xs group">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] flex items-center justify-center">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B245B]">Sign In with Mobile Number</h3>
                  <p className="text-xs text-[#49638F] font-medium mt-0.5">
                    Quick and secure access using your mobile number
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 text-xs text-[#0B245B] pt-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">Quick Sign In</span>
                    <span className="text-[#49638F] block text-[11px]">Get secure access in seconds</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">Secure &amp; Private</span>
                    <span className="text-[#49638F] block text-[11px]">Your data is safe with us</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">Instant Access</span>
                    <span className="text-[#49638F] block text-[11px]">Start donating right away</span>
                  </div>
                </div>
              </div>

              {/* Primary Blue Action Button */}
              <button
                type="button"
                onClick={() => navigate('/donate/mobile')}
                style={{ backgroundColor: '#1268E8' }}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm hover:bg-[#0f54be] transition border-none cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Sign In with Mobile Number</span>
              </button>
            </div>

            {/* OPTION B: Create an Account */}
            <div className="bg-[#FAFCFF] border border-[#DCE8FA] hover:border-[#1268E8]/50 rounded-2xl p-6 flex flex-col justify-between space-y-5 transition shadow-xs group">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] flex items-center justify-center">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B245B]">Create an Account</h3>
                  <p className="text-xs text-[#49638F] font-medium mt-0.5">
                    Create an account to manage your donations and track your impact
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 text-xs text-[#0B245B] pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">Track Your Impact</span>
                    <span className="text-[#49638F] block text-[11px]">See the change you create</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">Manage Easily</span>
                    <span className="text-[#49638F] block text-[11px]">View and manage all your donations</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1268E8] shrink-0" />
                  <div>
                    <span className="font-bold">More Features</span>
                    <span className="text-[#49638F] block text-[11px]">Access exclusive features and reports</span>
                  </div>
                </div>
              </div>

              {/* Blue Action Button */}
              <button
                type="button"
                onClick={() => navigate('/register/donor')}
                style={{ backgroundColor: '#1268E8' }}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm hover:bg-[#0f54be] transition border-none cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Trust Strip */}
      <FooterTrustStrip />
    </div>
  );
}
