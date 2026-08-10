import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../brand/BrandLogo';

const NAV_LINKS = [
  { label: 'How it Works', target: 'how-it-works' },
  { label: 'FAQ', target: 'testimonials' },
  { label: 'Contact', target: 'contact' },
];

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const navBtnReset =
  'min-h-0 border-0 bg-transparent shadow-none hover:shadow-none';

const linkClass =
  `${navBtnReset} text-[15px] font-medium text-black transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`;

const donateClass =
  `${navBtnReset} text-[15px] font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`;

export default function GiveAwayHeader() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const goHome = () => {
    document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleDonate = () => {
    navigate(currentUser ? '/dashboard' : '/register/donor');
    setMobileOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <header className="giveaway-header sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <BrandLogo onClick={goHome} />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={handleDonate}
            className={`giveaway-nav-btn rounded-sm px-0 py-0 ${donateClass}`}
          >
            Donate Now
          </button>

          <nav aria-label="Primary navigation" className="flex items-center gap-7">
            {NAV_LINKS.map(({ label, target }) => (
              <button key={target} type="button" onClick={() => scrollTo(target)} className={`giveaway-nav-btn ${linkClass}`}>
                {label}
              </button>
            ))}
          </nav>

          <span className="h-5 w-px bg-gray-300" aria-hidden="true" />

          <button
            type="button"
            onClick={handleLogin}
            className={`giveaway-nav-btn inline-flex items-center gap-2.5 rounded-sm ${linkClass}`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
              <GoogleIcon />
            </span>
            Log in / Sign up
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="giveaway-header__menu-btn giveaway-nav-btn inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-black md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="giveaway-mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="giveaway-mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-gray-100 bg-white px-4 py-4 md:hidden sm:px-6"
        >
          <div className="mx-auto flex max-w-[960px] flex-col gap-3">
            <button
              type="button"
              onClick={handleDonate}
              className={`giveaway-nav-btn py-1.5 text-left ${donateClass}`}
            >
              Donate Now
            </button>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={target}
                type="button"
                onClick={() => scrollTo(target)}
                className={`giveaway-nav-btn py-1.5 text-left ${linkClass}`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogin}
              className={`giveaway-nav-btn inline-flex items-center gap-2.5 py-1.5 ${linkClass}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                <GoogleIcon />
              </span>
              Log in / Sign up
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
