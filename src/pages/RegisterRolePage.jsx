import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, Building2, ChevronRight, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

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

      {/* Dotted Grid Left-Middle */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:grid grid-cols-4 gap-3 opacity-20 text-blue-400">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
        ))}
      </div>

      {/* Faint Outline Floating Icons */}
      <Heart className="absolute top-28 left-1/4 w-12 h-12 text-blue-200/40 stroke-[1.2]" />
      <Users className="absolute top-20 right-1/4 w-14 h-14 text-blue-200/35 stroke-[1.2]" />
      <Heart className="absolute bottom-40 left-1/3 w-8 h-8 text-blue-200/30 stroke-[1.5]" />

      {/* Large Pale Illustration: Hands Holding Heart (Lower Right) */}
      <div className="absolute bottom-6 right-8 opacity-15 hidden xl:block text-blue-600">
        <svg w="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-60 h-60">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          <path d="M4 18c2-2 5-3 8-3s6 1 8 3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Small Faint Person Illustration (Lower Left) */}
      <div className="absolute bottom-12 left-10 opacity-15 hidden lg:block text-blue-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-36 h-36">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
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
    <div className="w-full max-w-7xl px-6 sm:px-10 pt-8 sm:pt-11 pb-2 z-10 flex justify-start">
      <Link
        to="/"
        className="inline-flex items-center gap-3 text-[#1268E8] hover:text-[#0B245B] font-semibold text-lg sm:text-xl transition-colors group"
      >
        <ArrowLeft className="w-6 h-6 stroke-[2.2] group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

// ==========================================
// 3. ROLE CARD ITEM COMPONENT
// ==========================================
function RoleCard({ role, isSelected, onSelect, onNavigate }) {
  const { icon: Icon, title, desc } = role;

  return (
    <div
      onClick={() => {
        onSelect(role.key);
        onNavigate(role.path);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(role.key);
          onNavigate(role.path);
        }
      }}
      className={`w-full max-w-[560px] min-h-[108px] rounded-[14px] p-4 sm:px-6 sm:py-4 flex items-center justify-between cursor-pointer border transition-all duration-200 select-none ${
        isSelected
          ? 'bg-[#EEF5FF] border-[#1268E8] shadow-[0_4px_20px_rgba(18,104,232,0.14)] ring-1 ring-[#1268E8]'
          : 'bg-white border-[#DCE8FA] hover:border-[#1268E8]/50 hover:bg-[#F7FAFF] shadow-sm'
      }`}
    >
      {/* Left Icon Container */}
      <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-[14px] bg-white border border-[#DCE8FA] shadow-sm flex items-center justify-center shrink-0 mr-4 sm:mr-5">
        <Icon className={`w-7 h-7 sm:w-8 sm:h-8 stroke-[2] ${isSelected ? 'text-[#1268E8]' : 'text-[#1268E8]'}`} />
      </div>

      {/* Middle Text Details */}
      <div className="flex-1 text-left min-w-0 pr-2">
        <h3 className="text-[#0B245B] font-bold text-lg sm:text-[19px] leading-snug truncate">
          {title}
        </h3>
        <p className="text-[#49638F] text-sm sm:text-[16px] leading-relaxed mt-0.5 sm:truncate">
          {desc}
        </p>
      </div>

      {/* Right Chevron */}
      <div className="shrink-0 ml-2">
        <ChevronRight className="w-6 h-6 text-[#1268E8] stroke-[2.2]" />
      </div>
    </div>
  );
}

// ==========================================
// 4. CENTRAL CARD COMPONENT
// ==========================================
function CreateAccountCard({ selectedRole, setSelectedRole, onNavigate }) {
  const roles = [
    {
      key: 'donor',
      icon: Heart,
      title: 'I want to donate',
      desc: 'Give items or money and track your impact.',
      path: '/register/donor',
      loginPath: '/login?role=donor'
    },
    {
      key: 'receiver',
      icon: Users,
      title: 'I need support',
      desc: 'Apply for financial assistance when you need help.',
      path: '/register/receiver',
      loginPath: '/login?role=receiver'
    },
    {
      key: 'ngo',
      icon: Building2,
      title: 'I represent an NGO',
      desc: 'Partner with us to coordinate relief programs.',
      path: '/register/ngo',
      loginPath: '/login?role=ngo'
    }
  ];

  return (
    <div className="w-full max-w-[640px] bg-white rounded-[28px] p-6 sm:p-10 md:p-12 shadow-[0_12px_45px_-10px_rgba(18,104,232,0.08)] border border-[#DCE8FA] text-center z-10 flex flex-col items-center my-auto">
      {/* 1. Circular Logo Area */}
      <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full bg-[#EEF5FF] border border-[#DCE8FA] shadow-inner flex items-center justify-center mb-6 shrink-0 overflow-hidden p-2">
        <img
          src="/assets/images/aja_logo.png"
          alt="Give Away Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 2. Heading & Subtitle */}
      <h1 className="text-[#0B245B] font-extrabold text-3xl sm:text-[38px] leading-tight tracking-tight mb-2">
        Create Your Account
      </h1>
      <p className="text-[#49638F] text-base sm:text-[19px] font-medium mb-8">
        Choose how you want to use Give Away
      </p>

      {/* 3. Role Selection Cards */}
      <div className="w-full space-y-5 sm:space-y-6 flex flex-col items-center mb-9">
        {roles.map((role) => (
          <RoleCard
            key={role.key}
            role={role}
            isSelected={selectedRole === role.key}
            onSelect={setSelectedRole}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* 4. Sign-in Section (Horizontal Divider & Prompt) */}
      <div className="w-full max-w-[560px] flex items-center gap-4 mb-7">
        <div className="flex-1 h-[1px] bg-[#DCE8FA]" />
        <p className="text-[#49638F] text-sm sm:text-[17px] font-medium whitespace-nowrap">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#1268E8] font-bold hover:underline inline-flex items-center gap-1 group ml-1"
          >
            <span>Sign in</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
        <div className="flex-1 h-[1px] bg-[#DCE8FA]" />
      </div>

      {/* 5. Login Buttons Row */}
      <div className="w-full max-w-[560px] flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {roles.map((role) => (
          <button
            key={role.key}
            onClick={() => onNavigate(role.loginPath)}
            className="w-[125px] sm:w-[135px] h-[42px] bg-white hover:bg-[#EEF5FF] border border-[#DCE8FA] hover:border-[#1268E8] rounded-full text-[#1268E8] font-semibold text-sm transition-all duration-150 flex items-center justify-center shadow-xs"
          >
            {role.key === 'ngo' ? 'NGO login' : `${role.key.charAt(0).toUpperCase() + role.key.slice(1)} login`}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer className="w-full border-t border-[#DCE8FA] py-5 px-6 mt-12 bg-white/50 backdrop-blur-xs z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-[#49638F] text-xs sm:text-[16px] font-medium text-center">
        <span>© 2026 Give Away. All rights reserved.</span>
        <span className="hidden md:inline text-[#DCE8FA]">|</span>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1268E8]" />
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
// MAIN PAGE COMPONENT
// ==========================================
export default function RegisterRolePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('donor');

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col items-center justify-between relative overflow-x-hidden font-sans">
      {/* Background Subtle Artwork */}
      <BackgroundDecorations />

      {/* Top Left Navigation */}
      <BackToHome />

      {/* Central Role Selection Card */}
      <div className="w-full px-4 sm:px-6 my-auto flex justify-center py-6">
        <CreateAccountCard
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      {/* Footer Bar */}
      <Footer />
    </div>
  );
}
