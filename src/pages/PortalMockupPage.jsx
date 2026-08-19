import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Facebook,
  Heart,
  Instagram,
  Menu,
  Plus,
  Star,
  Twitter,
  X,
  Mail,
  Phone,
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'donate-items', label: 'Donate Items' },
  { id: 'my-donations', label: 'My Donations' },
  { id: 'messages', label: 'Messages' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

const REGISTRATION_CARDS = [
  {
    key: 'donor',
    image: '/assets/images/donor-movement.jpg',
    tone: 'donor',
    title: 'Donor Registration',
    desc: 'Share items or funds and track every gift from pickup to delivery with full transparency.',
    cta: 'Register as Donor',
    to: '/register/donor',
  },
  {
    key: 'receiver',
    image: '/assets/images/receiver-movement.jpg',
    tone: 'receiver',
    title: 'Receiver Registration',
    desc: 'Apply for essential items and financial assistance when your family needs support.',
    cta: 'Apply as Receiver',
    to: '/register/receiver',
  },
  {
    key: 'ngo',
    image: '/assets/images/ngo-movement.jpg',
    tone: 'ngo',
    title: 'NGO Registration',
    desc: 'Partner with Give Away to coordinate relief programs and reach verified beneficiaries.',
    cta: 'Register as NGO',
    to: '/register/ngo',
  },
];

const STAT_CARDS = [
  {
    label: 'Total Donated Value',
    value: '$4,250,000+',
    data: [
      { v: 12 }, { v: 18 }, { v: 15 }, { v: 22 }, { v: 28 }, { v: 26 }, { v: 34 },
    ],
    color: '#0284c7',
  },
  {
    label: 'Total Items Donated',
    value: '1,200,000+ Items',
    data: [
      { v: 8 }, { v: 14 }, { v: 20 }, { v: 18 }, { v: 24 }, { v: 30 }, { v: 36 },
    ],
    color: '#0284c7',
  },
  {
    label: 'Total Families Helped',
    value: '850,000+ Receivers',
    data: [
      { v: 10 }, { v: 12 }, { v: 16 }, { v: 22 }, { v: 20 }, { v: 28 }, { v: 32 },
    ],
    color: '#0284c7',
  },
  {
    label: 'Active NGO Partners',
    value: '250+ NGOs',
    data: [
      { v: 6 }, { v: 9 }, { v: 11 }, { v: 14 }, { v: 18 }, { v: 17 }, { v: 22 },
    ],
    color: '#0284c7',
  },
];

const CATEGORIES = ['Clothes', 'Books', 'Furniture', 'Electronics', 'Food', 'Toys'];

const DONATION_LISTINGS = [
  {
    id: 1,
    name: 'Children Story Books Bundle',
    category: 'Books',
    condition: 'Good',
    quantity: 45,
    value: '$320',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Family Living Room Sofa',
    category: 'Furniture',
    condition: 'Like New',
    quantity: 1,
    value: '$850',
    status: 'Reserved',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Winter Jackets Collection',
    category: 'Clothes',
    condition: 'Excellent',
    quantity: 28,
    value: '$560',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce267804?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Educational Tablet Set',
    category: 'Electronics',
    condition: 'Good',
    quantity: 6,
    value: '$1,200',
    status: 'Collected',
    image: 'https://images.unsplash.com/photo-1587613864522-928663838a78?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Non-Perishable Food Packs',
    category: 'Food',
    condition: 'New',
    quantity: 120,
    value: '$480',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Building Blocks & Toys',
    category: 'Toys',
    condition: 'Good',
    quantity: 35,
    value: '$210',
    status: 'Reserved',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e945ddd1?w=600&h=400&fit=crop',
  },
];

const SUCCESS_STORIES = [
  {
    title: '500 Books Reached Rural Classrooms',
    summary: 'Sarah donated her library collection — today 200 children read every week in three village schools.',
    image: 'https://images.unsplash.com/photo-1497633762303-6f679fb9666?w=600&h=400&fit=crop',
  },
  {
    title: 'Warm Coats for 80 Families',
    summary: 'A community winter drive delivered jackets before the cold snap, coordinated through verified NGO partners.',
    image: 'https://images.unsplash.com/photo-1488526537941-10aaa8aed446?w=600&h=400&fit=crop',
  },
  {
    title: 'Furniture That Rebuilt a Home',
    summary: 'After a flood, donated sofas and beds helped the Mehta family settle into temporary housing with dignity.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
  },
];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1593113597272-32a443785f00?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1488526537941-10aaa8aed446?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1532629345422-7515f986d451?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469571480202-5b3932273fb8?w=400&h=400&fit=crop',
];

const REVIEWS = [
  {
    name: 'Sarah M.',
    role: 'Donor · Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    quote: 'Give Away made it effortless to donate items I no longer needed. I loved seeing photos when families received them.',
    rating: 5,
  },
  {
    name: 'James Okonkwo',
    role: 'Receiver · Lagos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    quote: 'When we needed school supplies, the platform connected us with a donor within days. The process was respectful and fast.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'NGO Director · HopeBridge Foundation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    quote: 'As an NGO partner, Give Away helps us verify needs, track inventory, and report impact to our donors with confidence.',
    rating: 5,
  },
];

function statusClass(status) {
  if (status === 'Available') return 'portal-donation-card__badge--available';
  if (status === 'Reserved') return 'portal-donation-card__badge--reserved';
  return 'portal-donation-card__badge--collected';
}

function Sparkline({ data, color }) {
  return (
    <div className="portal-stat-card__chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PortalNav({ activeSection, onNavClick }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [profileOpen]);

  const handleAuth = () => {
    navigate(authMode === 'login' ? '/login' : '/register');
  };

  return (
    <header className="portal-nav">
      <div className="portal-container portal-nav__inner">
        <button type="button" className="portal-nav__brand" onClick={() => onNavClick('home')}>
          <span className="portal-nav__logo-icon" aria-hidden="true">
            <Heart size={22} fill="currentColor" />
          </span>
          <span className="portal-nav__logo-text">Give Away</span>
        </button>

        <ul className="portal-nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                className={`portal-nav__link${activeSection === link.id ? ' is-active' : ''}`}
                onClick={() => onNavClick(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="portal-nav__actions">
          <button type="button" className="portal-nav__icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="portal-nav__badge">3</span>
          </button>

          <div className="portal-nav__profile" ref={profileRef}>
            <button
              type="button"
              className="portal-nav__profile-trigger"
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
            >
              <span className="portal-nav__avatar">SM</span>
              <span>Sarah M.</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen && (
              <div className="portal-nav__dropdown">
                <button type="button" className="portal-nav__dropdown-item">My Profile</button>
                <button type="button" className="portal-nav__dropdown-item">Account Settings</button>
                <button type="button" className="portal-nav__dropdown-item" onClick={() => navigate('/dashboard')}>
                  Open Dashboard
                </button>
              </div>
            )}
          </div>

          <div className="portal-nav__auth-toggle" role="group" aria-label="Authentication">
            <button
              type="button"
              className={`portal-nav__auth-btn${authMode === 'login' ? ' is-active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={`portal-nav__auth-btn${authMode === 'signup' ? ' is-active' : ''}`}
              onClick={() => setAuthMode('signup')}
            >
              Sign up
            </button>
          </div>
          <button type="button" className="portal-btn portal-btn--primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleAuth}>
            {authMode === 'login' ? 'Log in' : 'Sign up'}
          </button>

          <button
            type="button"
            className="portal-nav__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`portal-container portal-nav__mobile-drawer${menuOpen ? ' is-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className="portal-nav__link"
            onClick={() => {
              onNavClick(link.id);
              setMenuOpen(false);
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}

export default function PortalMockupPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategories, setSelectedCategories] = useState(['Books', 'Clothes']);
  const [condition, setCondition] = useState('all');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toast, setToast] = useState('');

  const filteredListings = useMemo(() => {
    return DONATION_LISTINGS.filter((item) => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const condMatch = condition === 'all' || item.condition.toLowerCase().includes(condition);
      return catMatch && condMatch;
    });
  }, [selectedCategories, condition]);

  const visibleReviews = useMemo(() => {
    const start = carouselIndex;
    return [0, 1, 2].map((offset) => REVIEWS[(start + offset) % REVIEWS.length]);
  }, [carouselIndex]);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  return (
    <div className="portal-mockup">
      <PortalNav activeSection={activeSection} onNavClick={scrollTo} />

      {/* Hero & Registration */}
      <section className="portal-hero" id="home">
        <div className="portal-container">
          <div className="portal-hero__banner">
            <p className="portal-hero__eyebrow">
              <Heart size={14} fill="currentColor" /> Give Away Charity Portal
            </p>
            <h1 className="portal-hero__title">
              Join Our Movement — Impact the world, one donation at a time.
            </h1>
            <p className="portal-hero__subtitle">
              Connect with verified NGOs and families in need. Donate items, track deliveries, and see the difference you make — all in one trusted platform.
            </p>
          </div>

          <div className="portal-reg-grid">
            {REGISTRATION_CARDS.map((card) => (
              <article key={card.key} className="portal-reg-card">
                <div className={`portal-reg-card__icon portal-reg-card__icon--${card.tone}`}>
                  <img src={card.image} alt={card.title} style={{ maxHeight: '90px', maxWidth: '110px', objectFit: 'contain' }} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <button
                  type="button"
                  className="portal-btn portal-btn--outline"
                  onClick={() => navigate(card.to)}
                >
                  {card.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works anchor */}
      <section className="portal-dashboard" id="how-it-works">
        <div className="portal-container">
          <div className="portal-section-head">
            <div>
              <h2>Donor Dashboard Overview</h2>
              <p>Platform-wide impact at a glance — your generosity powers real change.</p>
            </div>
          </div>

          <div className="portal-stats-grid">
            {STAT_CARDS.map((stat) => (
              <article key={stat.label} className="portal-stat-card">
                <p className="portal-stat-card__label">{stat.label}</p>
                <p className="portal-stat-card__value">{stat.value}</p>
                <Sparkline data={stat.data} color={stat.color} />
              </article>
            ))}
          </div>

          <div className="portal-dashboard__cta-row">
            <button
              type="button"
              className="portal-btn portal-btn--primary portal-btn--lg"
              onClick={() => scrollTo('donate-items')}
            >
              <Plus size={20} />
              Donate New Item
            </button>
          </div>
        </div>
      </section>

      {/* Donation Listings */}
      <section className="portal-listings" id="donate-items">
        <div className="portal-container">
          <div className="portal-section-head">
            <div>
              <h2 id="my-donations">Your Donation Listings</h2>
              <p>Manage, filter, and track every item you&apos;ve shared with the community.</p>
            </div>
          </div>

          <div className="portal-listings__layout">
            <aside className="portal-filters" aria-label="Filter donations">
              <h3>Filters</h3>
              <div className="portal-filters__group">
                <label>Category</label>
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="portal-check">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
              <div className="portal-filters__group">
                <label htmlFor="condition-filter">Condition</label>
                <select
                  id="condition-filter"
                  className="portal-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="like">Like New</option>
                </select>
              </div>
              <div className="portal-filters__group">
                <label htmlFor="date-filter">Date Listed</label>
                <select id="date-filter" className="portal-select" defaultValue="30">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </aside>

            <div className="portal-donation-grid">
              {filteredListings.map((item) => (
                <article key={item.id} className="portal-donation-card">
                  <div className="portal-donation-card__img-wrap">
                    <img src={item.image} alt={item.name} className="portal-donation-card__img" loading="lazy" />
                    <span className={`portal-donation-card__badge ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="portal-donation-card__body">
                    <h4>{item.name}</h4>
                    <dl className="portal-donation-card__meta">
                      <div><span>Category</span> <strong>{item.category}</strong></div>
                      <div><span>Condition</span> <strong>{item.condition}</strong></div>
                      <div><span>Quantity</span> <strong>{item.quantity}</strong></div>
                      <div><span>Est. Value</span> <strong>{item.value}</strong></div>
                    </dl>
                    <p className="portal-donation-card__value">Estimated Value: {item.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Messages / FAQ anchors */}
      <section className="portal-stories" id="messages">
        <div className="portal-container">
          <div className="portal-section-head">
            <div>
              <h2>Your Impact: Successful Stories</h2>
              <p>Real families, real NGOs, real outcomes — powered by your generosity.</p>
            </div>
          </div>

          <div className="portal-stories-grid">
            {SUCCESS_STORIES.map((story) => (
              <article key={story.title} className="portal-story-card">
                <img src={story.image} alt="" className="portal-story-card__img" loading="lazy" />
                <div className="portal-story-card__body">
                  <h3>{story.title}</h3>
                  <p>{story.summary}</p>
                  <button type="button" className="portal-story-card__link">Read More →</button>
                </div>
              </article>
            ))}
          </div>

          <div className="portal-gallery" id="faq">
            {GALLERY_IMAGES.map((src, i) => (
              <img key={src} src={src} alt={`Distribution moment ${i + 1}`} className="portal-gallery__img" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="portal-testimonials">
        <div className="portal-container">
          <div className="portal-section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2>What Our Community Says</h2>
              <p>Donors, receivers, and NGO partners share their Give Away experience.</p>
            </div>
          </div>

          <div className="portal-carousel">
            <div className="portal-carousel__track">
              {visibleReviews.map((review) => (
                <article key={review.name} className="portal-review-card">
                  <div className="portal-review-card__header">
                    <img src={review.avatar} alt="" className="portal-review-card__avatar" />
                    <div>
                      <p className="portal-review-card__name">{review.name}</p>
                      <p className="portal-review-card__role">{review.role}</p>
                    </div>
                  </div>
                  <div className="portal-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
                </article>
              ))}
            </div>
            <div className="portal-carousel__controls">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`portal-carousel__dot${carouselIndex === i ? ' is-active' : ''}`}
                  aria-label={`Show review set ${i + 1}`}
                  onClick={() => setCarouselIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Contact */}
      <footer className="portal-footer" id="contact">
        <div className="portal-container">
          <div className="portal-footer__grid">
            <div>
              <h2>Connect With Us</h2>
              <p style={{ margin: '0 0 1rem', opacity: 0.85 }}>
                Have a question for our team? Send us a message and we&apos;ll get back within 24 hours.
              </p>
              <form
                className="portal-footer__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Message sent! Our team will respond shortly.');
                  e.target.reset();
                }}
              >
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Email Address" required />
                <input type="text" name="subject" placeholder="Subject" required />
                <textarea name="message" rows={4} placeholder="Your Message" required />
                <button type="submit" className="portal-btn portal-btn--primary portal-btn--lg">
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <h2>Direct Contact</h2>
              <ul className="portal-footer__contact-list">
                <li><Phone size={18} /> +123 456 7829</li>
                <li><Mail size={18} /> info@giveaway.com</li>
              </ul>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Follow us on social media</p>
              <div className="portal-footer__social">
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              </div>
            </div>
          </div>

          <div className="portal-footer__bottom">
            <p style={{ margin: 0 }}>Give Away Charity Foundation © 2026</p>
            <ul className="portal-footer__links">
              <li><Link to="/">Legal</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Terms of Use</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {toast && <div className="portal-toast" role="status">{toast}</div>}
    </div>
  );
}
