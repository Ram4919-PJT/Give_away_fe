import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, UserPlus } from 'lucide-react';
import BrandLogo from '../brand/BrandLogo';

const NAV_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About Us', target: 'about' },
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'Impact', target: 'impact' },
  { label: 'Donate', target: 'donate' },
  { label: 'Contact Us', target: 'contact' },
];

export default function GiveAwayHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState('hero');

  // Track active section on scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        if (item.target === 'donate') continue;
        const el = document.getElementById(item.target);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTarget(item.target);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (target) => {
    setMobileOpen(false);
    if (target === 'donate') {
      navigate('/donate');
      return;
    }
    setActiveTarget(target);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target } });
      return;
    }
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setMobileOpen(false);
    navigate('/login');
  };

  const handleCreateAccount = () => {
    setMobileOpen(false);
    navigate('/register');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#DCE8FA] shadow-xs">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Left: Brand Logo (Clean Text & Icon on Light Background) */}
        <BrandLogo onClick={() => handleNavClick('hero')} />

        {/* Center: Desktop Navigation Links (Home, About Us, How It Works, Impact, Donate, Contact Us - All Transparent Text Items) */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map(({ label, target }) => {
            const isActive = activeTarget === target;
            return (
              <button
                key={target}
                type="button"
                onClick={() => handleNavClick(target)}
                className={`text-sm sm:text-[15px] font-semibold transition-all bg-transparent border-none cursor-pointer outline-none relative py-1 ${
                  isActive
                    ? 'text-[#0B57D0] font-bold border-b-2 border-[#0B57D0]'
                    : 'text-[#475569] hover:text-[#0B245B]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right: Desktop Auth Buttons (Login: Outline Blue | Create Account: Solid Blue - Exact as Picture) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#0B57D0] bg-white text-[#0B57D0] hover:bg-[#EEF5FF] font-semibold text-sm transition-all cursor-pointer outline-none shadow-2xs"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={handleCreateAccount}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0052FF] hover:bg-[#0B57D0] text-white font-semibold text-sm shadow-xs transition-all border-none cursor-pointer outline-none"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-lg text-[#0B245B] hover:bg-[#EEF5FF] lg:hidden border-none bg-transparent cursor-pointer outline-none"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#DCE8FA] px-4 py-5 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map(({ label, target }) => (
              <button
                key={target}
                type="button"
                onClick={() => handleNavClick(target)}
                className={`py-2 text-left text-base font-semibold transition-colors bg-transparent border-none cursor-pointer ${
                  activeTarget === target ? 'text-[#0B57D0] font-bold border-l-4 border-[#0B57D0] pl-3' : 'text-[#475569] pl-1'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#DCE8FA] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleLogin}
                className="w-full h-11 rounded-xl border border-[#0B57D0] text-[#0B57D0] font-semibold text-base flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-[#EEF5FF]"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full h-11 rounded-xl border border-[#0B57D0] text-[#0B57D0] font-semibold text-base flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-[#EEF5FF]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
