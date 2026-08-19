import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Heart, Users, Gift, Lock, Headphones } from 'lucide-react';

export function BackToHomeLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-[#1268E8] hover:text-[#0B245B] font-semibold text-sm sm:text-base transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 stroke-[2.2] group-hover:-translate-x-1 transition-transform" />
      <span>Back to Home</span>
    </Link>
  );
}

export function CharityPromoPanel({ privacyMessage }) {
  return (
    <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col justify-between space-y-6 text-left shrink-0">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] text-xs font-semibold self-start">
        <Heart className="w-3.5 h-3.5 fill-[#1268E8] text-[#1268E8]" />
        <span>Every Gift Makes a Difference</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0B245B] leading-[1.15] tracking-tight">
          Together, we can<br />
          create <span className="text-[#1268E8]">real impact</span>
        </h1>
        <p className="text-sm sm:text-base text-[#49638F] font-medium leading-relaxed">
          Your kindness can bring hope, change lives, and build a better tomorrow.
        </p>
      </div>

      {/* Hands Holding Heart Illustration */}
      <div className="relative w-full max-w-[320px] mx-auto py-2 flex justify-center">
        <img
          src="/assets/donor/Donor_Dashboard_Heart_Hands_Hero.png"
          alt="Hands holding heart illustration"
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </div>

      {/* 3 Trust Points */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0B245B]">100% Transparent</h3>
            <p className="text-xs text-[#49638F]">Every donation is tracked and verified.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0B245B]">Secure &amp; Trusted</h3>
            <p className="text-xs text-[#49638F]">Your information and donations are safe.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EEF5FF] border border-[#DCE8FA] text-[#1268E8] flex items-center justify-center shrink-0 mt-0.5">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0B245B]">Real Impact</h3>
            <p className="text-xs text-[#49638F]">We ensure your support reaches those in need.</p>
          </div>
        </div>
      </div>

      {/* Bottom Privacy Card */}
      <div className="w-full bg-[#EEF5FF]/80 border border-[#DCE8FA] rounded-2xl p-4 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-white text-[#1268E8] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs space-y-0.5">
          <h4 className="font-bold text-[#0B245B]">We respect your privacy.</h4>
          <p className="text-[#49638F] font-medium leading-normal">
            {privacyMessage || 'Your data is safe with us and will only be used for verification.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FooterTrustStrip() {
  return (
    <footer className="w-full border-t border-[#DCE8FA] py-4 px-4 sm:px-8 mt-8 bg-white/70 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#49638F]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1268E8]" />
          <span className="text-[#0B245B]">100% Secure</span>
          <span className="text-slate-400 font-normal hidden sm:inline">— Your data is encrypted</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-[#1268E8]" />
          <span className="text-[#0B245B]">Trusted by Thousands</span>
          <span className="text-slate-400 font-normal hidden sm:inline">— Join donors making a difference</span>
        </div>

        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#20B878]" />
          <span className="text-[#0B245B]">Verified Platform</span>
          <span className="text-slate-400 font-normal hidden sm:inline">— Transparent &amp; audited</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Headphones className="w-4 h-4 text-[#1268E8]" />
          <span className="text-[#0B245B]">Need Help?</span>
          <span className="text-slate-400 font-normal hidden sm:inline">— Contact support anytime</span>
        </div>
      </div>
    </footer>
  );
}
