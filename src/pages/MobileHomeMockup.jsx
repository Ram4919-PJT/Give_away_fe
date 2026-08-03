import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, getRoleDisplayName } from '../context/AppContext';
import { ROLE_AUTH_CONFIG } from '../data/constants';

const CATEGORIES = [
  ['👕', 'Clothes'],
  ['📚', 'Books'],
  ['🍲', 'Food'],
  ['🛋️', 'Furniture'],
  ['💻', 'Electronics'],
  ['🏥', 'Medical Supplies']
];

const ROLES = [
  ['D', 'Donors', 'Give items or funds, then track where your support goes.'],
  ['N', 'NGO Partners', 'Request warehouse stock or program funding for local distribution.'],
  ['R', 'Receivers', 'Request financial support or items with supporting documents.'],
  ['A', 'Admins', 'Verify users, manage inventory, and approve relief requests.']
];

const STORIES = [
  ['RK', '"I donated winter blankets and could see exactly which NGO received them."', 'Rajesh Kumar', 'Donor · Pune'],
  ['SK', '"Our foundation received medical kits within 48 hours."', 'Sunita Deshmukh', 'NGO Partner'],
  ['AM', '"I requested rent assistance and received support after verification."', 'Amit Mehta', 'Receiver']
];

const ABOUT_POINTS = [
  'Verified partner network',
  'End-to-end donation tracking',
  'Secure document verification',
  'Community-first relief coordination'
];

const FOOTER_SECTIONS = [
  {
    id: 'donors',
    title: 'For Donors',
    links: [
      { label: 'Donor Registration', action: 'nav', to: '/register/donor' },
      { label: 'Donor Login', action: 'nav', to: '/login?role=donor' }
    ]
  },
  {
    id: 'partners',
    title: 'For Partners',
    links: [
      { label: 'NGO Registration', action: 'nav', to: '/register/ngo' },
      { label: 'Request Support', action: 'nav', to: '/register/receiver' },
      { label: 'Our NGOs', action: 'scroll', to: 'ngos' }
    ]
  },
  {
    id: 'platform',
    title: 'Platform',
    links: [
      { label: 'About', action: 'scroll', to: 'about' },
      { label: 'Contact', action: 'scroll', to: 'contact' }
    ]
  }
];

function scrollInside(container, id) {
  const scroll = container?.querySelector('.mhm-scroll');
  const el = container?.querySelector(`#${id}`);
  if (!scroll || !el) return;
  const scrollRect = scroll.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const nextTop = scroll.scrollTop + (elRect.top - scrollRect.top) - 8;
  scroll.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
}

export default function MobileHomeMockup() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleSheet, setRoleSheet] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [footerOpen, setFooterOpen] = useState({ donors: true, partners: false, platform: false });
  const [storyIndex, setStoryIndex] = useState(0);
  const screenRef = useRef(null);

  const roleConfig = useMemo(
    () => (roleSheet ? ROLE_AUTH_CONFIG[roleSheet] : null),
    [roleSheet]
  );

  const openRole = (key) => {
    setMenuOpen(false);
    if (currentUser) {
      navigate('/dashboard');
      return;
    }
    setRoleSheet(key);
  };

  const goSection = (id) => {
    setMenuOpen(false);
    scrollInside(screenRef.current, id);
  };

  const handleFooterLink = (link) => {
    if (link.action === 'nav') navigate(link.to);
    else goSection(link.to);
  };

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('giveaway-theme', next);
  };

  return (
    <main className="mhm-page" id="mobile-home-mockup">
      <header className="mhm-stage-header">
        <div>
          <p className="mhm-stage-eyebrow">Mobile UI wireframe · iPhone 15 Pro</p>
          <h1 className="mhm-stage-title">Give Away — Home</h1>
          <p className="mhm-stage-sub">
            Premium mobile redesign preserving desktop branding, features, and user flow.
          </p>
        </div>
        <Link to="/" className="mhm-stage-link">View desktop Home →</Link>
      </header>

      <div className="mhm-stage">
        <div className="mhm-device" aria-label="iPhone 15 Pro mockup frame">
          <div className="mhm-device-frame">
            <div className="mhm-dynamic-island" aria-hidden="true" />
            <div className="mhm-screen" ref={screenRef}>
              {/* Status bar */}
              <div className="mhm-status-bar" aria-hidden="true">
                <span>9:41</span>
                <div className="mhm-status-icons">
                  <span className="mhm-signal" />
                  <span className="mhm-wifi" />
                  <span className="mhm-battery" />
                </div>
              </div>

              {/* App top bar */}
              <header className="mhm-topbar">
                <button
                  type="button"
                  className="mhm-brand"
                  onClick={() => goSection('home')}
                  aria-label="Give Away Home"
                >
                  <span className="mhm-logo-mark" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" fill="url(#mhmLogoGrad)" stroke="#fff" strokeWidth="1" />
                      <path d="M10 19c0-2.5 2-5 6-5s6 2.5 6 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="16" cy="10" r="1.5" fill="#86EFAC" />
                      <defs>
                        <linearGradient id="mhmLogoGrad" x1="4" y1="4" x2="28" y2="28">
                          <stop stopColor="#22C55E" />
                          <stop offset="1" stopColor="#2563EB" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="mhm-brand-text">
                    <span className="mhm-brand-name">Give Away</span>
                    <span className="mhm-brand-sub">Aja Abayahastham</span>
                  </span>
                </button>

                <div className="mhm-topbar-actions">
                  <button type="button" className="mhm-icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="mhm-icon-btn"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </header>

              <div className="mhm-scroll">
                {/* Hero */}
                <section className="mhm-hero" id="home">
                  <div className="mhm-hero-bg" aria-hidden="true" />
                  <p className="mhm-eyebrow">Community Donation Platform</p>
                  <h2 className="mhm-hero-title">
                    Share More. Waste Less.
                    <span>Help Someone Today.</span>
                  </h2>
                  <p className="mhm-hero-tagline">
                    Give Away connects generous donors with verified NGOs and families in need. Donate items or funds, request help, and track every delivery with full transparency.
                  </p>

                  {!currentUser ? (
                    <div className="mhm-cta-stack">
                      <button type="button" className="mhm-btn mhm-btn--primary" onClick={() => navigate('/register/donor')}>
                        Donate Now
                      </button>
                      <button type="button" className="mhm-btn mhm-btn--secondary" onClick={() => navigate('/register/receiver')}>
                        Request Help
                      </button>
                    </div>
                  ) : (
                    <div className="mhm-signed-in">
                      <span className="mhm-badge">Signed in</span>
                      <p className="mhm-welcome">
                        Welcome back, {currentUser.name}! You are logged in as {getRoleDisplayName(currentUser.role)}.
                      </p>
                      <button type="button" className="mhm-btn mhm-btn--primary" onClick={() => navigate('/dashboard')}>
                        Open Dashboard
                      </button>
                    </div>
                  )}

                  <div className="mhm-hero-panel" aria-hidden="true">
                    <div className="mhm-hero-icon">🤝</div>
                    <p className="mhm-hero-panel-title">People helping people</p>
                    <p className="mhm-hero-panel-sub">Trusted relief · Verified partners · Real impact</p>
                  </div>
                </section>

                {/* Stats — 2×2 stacked from desktop 4-col */}
                <section className="mhm-section mhm-stats" aria-label="Platform impact statistics">
                  <div className="mhm-stats-grid">
                    {[
                      ['12,400+', 'Total Donations'],
                      ['3,200', 'Families Helped'],
                      ['300+', 'Active NGOs'],
                      ['98%', 'Successful Deliveries']
                    ].map(([num, label]) => (
                      <article key={label} className="mhm-stat-card">
                        <p className="mhm-stat-num">{num}</p>
                        <p className="mhm-stat-label">{label}</p>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Categories — horizontal scroll */}
                <section className="mhm-section" id="donate">
                  <div className="mhm-section-head">
                    <h3>Donation Categories</h3>
                    <p>Browse what you can give — every item finds a verified home.</p>
                  </div>
                  <div className="mhm-h-scroll" role="list">
                    {CATEGORIES.map(([icon, name]) => (
                      <div key={name} className="mhm-category-card" role="listitem">
                        <div className="mhm-category-icon">{icon}</div>
                        <h4>{name}</h4>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Roles — stacked cards */}
                <section className="mhm-section" id="ngos">
                  <div className="mhm-section-head">
                    <h3>Who uses Give Away</h3>
                    <p>Four clear roles keep donations, requests, and approvals organized.</p>
                  </div>
                  <div className="mhm-role-stack">
                    {ROLES.map(([icon, title, desc]) => (
                      <article
                        key={title}
                        className="mhm-role-card"
                        id={title === 'Receivers' ? 'request' : undefined}
                      >
                        <div className="mhm-role-icon">{icon}</div>
                        <div>
                          <h4>{title}</h4>
                          <p>{desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Stories — pager */}
                <section className="mhm-section" id="stories">
                  <div className="mhm-section-head">
                    <h3>Success Stories</h3>
                    <p>Real impact from our community of donors and partners.</p>
                  </div>
                  <div className="mhm-story-card">
                    <div className="mhm-story-avatar">{STORIES[storyIndex][0]}</div>
                    <p className="mhm-story-quote">{STORIES[storyIndex][1]}</p>
                    <p className="mhm-story-author">{STORIES[storyIndex][2]}</p>
                    <p className="mhm-story-role">{STORIES[storyIndex][3]}</p>
                  </div>
                  <div className="mhm-pager" role="tablist" aria-label="Success story pages">
                    {STORIES.map((s, i) => (
                      <button
                        key={s[2]}
                        type="button"
                        className={`mhm-dot${i === storyIndex ? ' is-active' : ''}`}
                        aria-label={`Story ${i + 1}`}
                        aria-selected={i === storyIndex}
                        onClick={() => setStoryIndex(i)}
                      />
                    ))}
                  </div>
                </section>

                {/* About — accordion bullets */}
                <section className="mhm-section" id="about">
                  <div className="mhm-section-head">
                    <h3>About Aja Abayahastham</h3>
                    <p>We bridge donors, verified NGOs, and receivers through a transparent platform built on trust, dignity, and accountability.</p>
                  </div>
                  <div className="mhm-about-visual" aria-hidden="true">💚</div>
                  <button
                    type="button"
                    className="mhm-accordion-trigger"
                    aria-expanded={aboutOpen}
                    onClick={() => setAboutOpen((v) => !v)}
                  >
                    <span>What we stand for</span>
                    <span className={`mhm-chevron${aboutOpen ? ' is-open' : ''}`} aria-hidden="true" />
                  </button>
                  {aboutOpen && (
                    <ul className="mhm-about-list">
                      {ABOUT_POINTS.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Contact — stacked */}
                <section className="mhm-section" id="contact">
                  <div className="mhm-section-head">
                    <h3>Contact Us</h3>
                    <p>Questions about donations, partnerships, or support requests?</p>
                  </div>
                  <div className="mhm-contact-info">
                    <a className="mhm-contact-row" href="mailto:support@abhayahastam.org">
                      <span className="mhm-contact-label">Email</span>
                      <span>support@abhayahastam.org</span>
                    </a>
                    <a className="mhm-contact-row" href="tel:+919876543210">
                      <span className="mhm-contact-label">Phone</span>
                      <span>+91 98765 43210</span>
                    </a>
                  </div>
                  <form className="mhm-form" onSubmit={(e) => e.preventDefault()}>
                    <label className="mhm-field">
                      <span>Name</span>
                      <input type="text" placeholder="Your name" />
                    </label>
                    <label className="mhm-field">
                      <span>Email</span>
                      <input type="email" placeholder="you@example.com" />
                    </label>
                    <label className="mhm-field">
                      <span>Message</span>
                      <textarea rows={4} placeholder="How can we help?" />
                    </label>
                    <button type="submit" className="mhm-btn mhm-btn--primary">Send Message</button>
                  </form>
                </section>

                {/* CTA banner */}
                {!currentUser && (
                  <section className="mhm-cta-banner">
                    <h3>Ready to make a difference?</h3>
                    <p>Join thousands of donors and partners on Give Away.</p>
                    <div className="mhm-cta-stack">
                      <Link to="/register" className="mhm-btn mhm-btn--primary">Get Started</Link>
                      <Link to="/login" className="mhm-btn mhm-btn--secondary">Sign In</Link>
                    </div>
                  </section>
                )}

                {/* Footer — accordion columns */}
                <footer className="mhm-footer">
                  <div className="mhm-footer-brand">
                    <p className="mhm-footer-logo">Give Away</p>
                    <p className="mhm-footer-tagline">Transparent charity · Verified partners · Real community impact.</p>
                  </div>

                  {FOOTER_SECTIONS.map((section) => (
                    <div key={section.id} className="mhm-footer-acc">
                      <button
                        type="button"
                        className="mhm-accordion-trigger mhm-accordion-trigger--dark"
                        aria-expanded={!!footerOpen[section.id]}
                        onClick={() =>
                          setFooterOpen((prev) => ({ ...prev, [section.id]: !prev[section.id] }))
                        }
                      >
                        <span>{section.title}</span>
                        <span
                          className={`mhm-chevron mhm-chevron--light${footerOpen[section.id] ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {footerOpen[section.id] && (
                        <ul className="mhm-footer-links">
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <button type="button" onClick={() => handleFooterLink(link)}>
                                {link.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div className="mhm-footer-bottom">
                    <span>© 2026 Aja Abayahastham · Give Away Platform</span>
                    <span>Built with trust &amp; transparency</span>
                  </div>
                </footer>

                <div className="mhm-scroll-spacer" aria-hidden="true" />
              </div>

              {/* Bottom navigation */}
              <nav className="mhm-bottom-nav" aria-label="Primary">
                <button type="button" className="mhm-tab is-active" onClick={() => goSection('home')}>
                  <span className="mhm-tab-icon" aria-hidden="true">⌂</span>
                  <span>Home</span>
                </button>
                <button type="button" className="mhm-tab" onClick={() => openRole('donor')}>
                  <span className="mhm-tab-icon" aria-hidden="true">♥</span>
                  <span>Donate</span>
                </button>
                <button type="button" className="mhm-tab" onClick={() => openRole('receiver')}>
                  <span className="mhm-tab-icon" aria-hidden="true">✦</span>
                  <span>Request</span>
                </button>
                <button type="button" className="mhm-tab" onClick={() => setMenuOpen(true)}>
                  <span className="mhm-tab-icon" aria-hidden="true">☰</span>
                  <span>More</span>
                </button>
              </nav>

              <div className="mhm-home-indicator" aria-hidden="true" />

              {/* Menu bottom sheet — desktop center nav */}
              {menuOpen && (
                <div className="mhm-sheet" role="dialog" aria-modal="true" aria-label="Navigation menu">
                  <button type="button" className="mhm-sheet-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
                  <div className="mhm-sheet-panel">
                    <div className="mhm-sheet-handle" aria-hidden="true" />
                    <h3 className="mhm-sheet-title">Menu</h3>
                    <ul className="mhm-sheet-list">
                      <li><button type="button" onClick={() => goSection('home')}>Home</button></li>
                      <li><button type="button" onClick={() => openRole('donor')}>Donate</button></li>
                      <li><button type="button" onClick={() => openRole('receiver')}>Request</button></li>
                      <li><button type="button" onClick={() => openRole('ngo')}>NGOs</button></li>
                      <li><button type="button" onClick={() => goSection('stories')}>Success Stories</button></li>
                      <li><button type="button" onClick={() => goSection('about')}>About</button></li>
                      <li><button type="button" onClick={() => goSection('contact')}>Contact</button></li>
                    </ul>
                    {!currentUser ? (
                      <div className="mhm-sheet-auth">
                        <Link to="/login" className="mhm-btn mhm-btn--secondary" onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="mhm-btn mhm-btn--primary" onClick={() => setMenuOpen(false)}>Register</Link>
                      </div>
                    ) : (
                      <div className="mhm-sheet-auth">
                        <button type="button" className="mhm-btn mhm-btn--primary" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>
                          Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Role auth bottom sheet */}
              {roleConfig && (
                <div className="mhm-sheet" role="dialog" aria-modal="true" aria-label={roleConfig.title}>
                  <button type="button" className="mhm-sheet-backdrop" aria-label="Close" onClick={() => setRoleSheet(null)} />
                  <div className="mhm-sheet-panel mhm-sheet-panel--role">
                    <div className="mhm-sheet-handle" aria-hidden="true" />
                    <button type="button" className="mhm-sheet-close" onClick={() => setRoleSheet(null)} aria-label="Close">×</button>
                    <div className="mhm-role-sheet-icon" aria-hidden="true">{roleConfig.icon}</div>
                    <h3 className="mhm-sheet-title">{roleConfig.title}</h3>
                    <p className="mhm-role-sheet-desc">{roleConfig.desc}</p>
                    <div className="mhm-cta-stack">
                      <button
                        type="button"
                        className="mhm-btn mhm-btn--primary"
                        onClick={() => {
                          setRoleSheet(null);
                          navigate(`/register/${roleSheet}`);
                        }}
                      >
                        {roleConfig.registerLabel}
                      </button>
                      <button
                        type="button"
                        className="mhm-btn mhm-btn--secondary"
                        onClick={() => {
                          setRoleSheet(null);
                          navigate(`/login?role=${roleSheet}`);
                        }}
                      >
                        Sign In
                      </button>
                    </div>
                    <p className="mhm-role-sheet-note">{roleConfig.footnote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="mhm-annotations" aria-label="Design notes">
          <h2>Mobile adaptations</h2>
          <ul>
            <li><strong>Nav</strong> → hamburger + bottom sheet + 4-tab bar</li>
            <li><strong>Role modal</strong> → Material bottom sheet</li>
            <li><strong>Categories</strong> → horizontal scroll rail</li>
            <li><strong>Stories</strong> → single-card pager</li>
            <li><strong>About / Footer</strong> → accordions</li>
            <li><strong>Frame</strong> → iPhone 15 Pro 393×852</li>
            <li><strong>Spacing</strong> → 8px system · 44px targets</li>
          </ul>
          <p className="mhm-annotations-note">Wireframe only — interactions navigate existing routes; no new APIs.</p>
        </aside>
      </div>
    </main>
  );
}
