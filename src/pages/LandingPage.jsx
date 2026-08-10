import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Facebook,
  Globe,
  Instagram,
  Mail,
  Package,
  Phone,
  Star,
  Twitter,
  Users,
} from 'lucide-react';
import GiveAwayHeader from '../components/layout/GiveAwayHeader';

const SARAH_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop';

const REG_CARDS = [
  {
    key: 'donor',
    title: 'Donors',
    desc: 'Register to manage contributions, track every donation, and see the real impact of your generosity.',
    cta: 'Register as Donor',
    to: '/register/donor',
    icon: 'donor-hands',
  },
  {
    key: 'receiver',
    title: 'Receivers',
    desc: 'Apply to request essential items and assistance through our verified community network.',
    cta: 'Apply as Receiver',
    to: '/register/receiver',
    icon: 'receiver-face',
  },
  {
    key: 'ngo',
    title: 'NGOs',
    desc: 'Onboard your organization to partner with Give Away and coordinate relief distribution.',
    cta: 'Register as NGO',
    to: '/register/ngo',
    icon: 'ngo-building',
  },
];

const STORIES = [
  {
    title: "Sarah's Books Open New Worlds",
    summary: 'Donated books opened new learning pathways for children in underserved communities.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=420&fit=crop',
  },
  {
    title: 'Family Receiving a Couch',
    summary: 'A family received comfortable seating and household furniture through verified NGO partners.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=640&h=420&fit=crop',
  },
  {
    title: 'NGO Team Inspiring Change',
    summary: 'Volunteer teams coordinated essential supply packages and delivered hope across neighborhoods.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=640&h=420&fit=crop',
  },
];

const METRICS = [
  { label: 'Total Donated Value', value: '$4,250,000+', icon: DollarSign },
  { label: 'Total Items Donated', value: '1,200,000+ Items', icon: Package },
  { label: 'Total Families Helped', value: '850,000+ Receivers', icon: Users },
  { label: 'Total NGO Partners', value: '250+ NGOs', icon: Building2 },
];

const REVIEWS = [
  {
    name: 'Sarah M.',
    role: 'Donor',
    avatar: SARAH_AVATAR,
    quote: 'Receiving the sofa made a huge difference to our small apartment.',
  },
  {
    name: 'Receiver',
    role: 'Community Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop',
    quote: 'Receiving the sofa made a huge difference to our small apartment.',
  },
  {
    name: 'NGO Director',
    role: 'NGO Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=88&h=88&fit=crop',
    quote: 'Receiving the sofa made a huge difference to our small apartment.',
  },
];

function HeroWaves() {
  return (
    <div className="ga-hero__waves" aria-hidden="true">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="rgba(59,130,246,0.08)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        <path
          fill="rgba(37,99,235,0.06)"
          d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,261.3C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </div>
  );
}

function DonorHandsHeartIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M6 42C6 42 11 34 18 31C13 26 8 21 8 16C8 11 12 7 17 7C21 7 24 9 26 12C28 9 31 7 35 7C40 7 44 11 44 16C44 21 39 26 34 31C41 34 46 42 46 42"
        stroke="#1E293B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 42C14 42 19 37 24 34C29 37 34 42 34 42"
        stroke="#1E293B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 24C26 20.5 28.5 18 31.5 18C34.5 18 37 20.5 37 24C37 27 34.5 29.5 31.5 31.5C28.5 29.5 26 27 26 24Z"
        fill="#10B981"
      />
      <path
        d="M29 22.5C29 21.5 30 20.5 31.5 20.5C33 20.5 34 21.5 34 22.5"
        stroke="#059669"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReceiverFaceHandsIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="20" r="9" stroke="#2563EB" strokeWidth="2" />
      <path d="M25 18C26.5 15.5 29 14 32 14C35 14 37.5 15.5 39 18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28.5" cy="19" r="1" fill="#2563EB" />
      <circle cx="35.5" cy="19" r="1" fill="#2563EB" />
      <path d="M28 23C29 24.5 31 25 32 25C33 25 35 24.5 36 23" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8 46C8 46 13 38 20 35C15 30 10 25 10 20C10 16 13 13 17 13C20 13 22.5 14.5 24 17"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M56 46C56 46 51 38 44 35C49 30 54 25 54 20C54 16 51 13 47 13C44 13 41.5 14.5 40 17"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NgoBuildingIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 48V26L32 12L54 26V48H10Z" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 12V48" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="20" y="32" width="7" height="10" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="37" y="32" width="7" height="10" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="27" y="38" width="10" height="10" stroke="#2563EB" strokeWidth="1.5" />
      <path d="M8 48H56" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 12L22 18L32 14L42 18L32 12Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1" />
    </svg>
  );
}

function RegIcon({ type }) {
  if (type === 'donor-hands') return <DonorHandsHeartIcon />;
  if (type === 'receiver-face') return <ReceiverFaceHandsIcon />;
  return <NgoBuildingIcon />;
}

function TrendChart() {
  return (
    <div className="ga-metric-card__chart" aria-hidden="true">
      <svg viewBox="0 0 120 36" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="0,28 18,22 36,24 54,16 72,12 90,14 120,4"
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  return (
    <div className="ga-page">
      <GiveAwayHeader />

      <main className="ga-main" id="top">
        <div className="ga-container">
          {/* Hero & Registration */}
          <section className="ga-section ga-section--hero" id="how-it-works">
            <HeroWaves />
            <div className="ga-hero">
              <h1 className="ga-hero__title">Join Our Movement</h1>
              <p className="ga-hero__subtitle">Impact the world, one donation at a time.</p>
            </div>
            <div className="ga-reg-grid">
              {REG_CARDS.map((card) => (
                <article key={card.key} className="ga-reg-card">
                  <div className="ga-reg-card__icon">
                    <RegIcon type={card.icon} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <button type="button" className="ga-cta-btn" onClick={() => navigate(card.to)}>
                    {card.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Success Stories */}
          <section className="ga-section">
            <h2 className="ga-section__title">Your Impact: Successful Stories</h2>
            <div className="ga-stories-grid">
              {STORIES.map((story) => (
                <article key={story.title} className="ga-story-card">
                  <img src={story.image} alt="" loading="lazy" />
                  <div className="ga-story-card__body">
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                    <button type="button" className="ga-read-more">Read More</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Global Impact — stats only */}
          <section className="ga-section">
            <h2 className="ga-section__title">Our Global Impact</h2>
            <div className="ga-metrics-row">
              {METRICS.map(({ label, value, icon: Icon }) => (
                <article key={label} className="ga-metric-card">
                  <div className="ga-metric-card__icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <p className="ga-metric-card__label">{label}</p>
                  <p className="ga-metric-card__value">{value}</p>
                  <TrendChart />
                </article>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="ga-section" id="testimonials">
            <h2 className="ga-section__title">What Our Community Says</h2>
            <div className="ga-reviews-grid">
              {REVIEWS.map((r) => (
                <article key={r.name} className="ga-review-card">
                  <span className="ga-review-card__quote" aria-hidden="true">&ldquo;</span>
                  <div className="ga-review-card__head">
                    <img src={r.avatar} alt="" className="ga-review-card__avatar" />
                    <div>
                      <p className="ga-review-card__name">{r.name}</p>
                      <p className="ga-review-card__role">{r.role}</p>
                    </div>
                  </div>
                  <div className="ga-stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                </article>
              ))}
            </div>
          </section>

          {/* Contact & Footer */}
          <section className="ga-section ga-section--contact" id="contact">
            <h2 className="ga-section__title">Connect With Us</h2>
            <div className="ga-contact-panel">
              <form
                className="ga-contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast('Message sent successfully.');
                  setTimeout(() => setToast(''), 3000);
                  e.currentTarget.reset();
                }}
              >
                <div className="ga-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="ga-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="ga-field">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required defaultValue="">
                    <option value="" disabled>Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="donation">Donation Question</option>
                    <option value="partnership">NGO Partnership</option>
                    <option value="support">Support Request</option>
                  </select>
                </div>
                <div className="ga-field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Your message..." required />
                </div>
                <div className="ga-contact-form__actions">
                  <button type="submit" className="ga-cta-btn">Send Message</button>
                </div>
              </form>

              <div className="ga-contact-info">
                <h4>Contact Info</h4>
                <ul className="ga-contact-list">
                  <li><Phone size={16} /> +123 456 7829</li>
                  <li><Mail size={16} /> info@giveaway.com</li>
                </ul>
                <h4>Social With Us</h4>
                <div className="ga-social-row">
                  <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                  <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                  <a href="#" aria-label="Website"><Globe size={18} /></a>
                </div>
              </div>

              <footer className="ga-footer">
                <ul className="ga-footer__links">
                  <li><Link to="/">Legal</Link></li>
                  <li><Link to="/">Privacy Policy</Link></li>
                  <li><Link to="/">About Us</Link></li>
                  <li><Link to="/">Terms of Use</Link></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
                <p className="ga-footer__copy">Give Away Charity Foundation © 2026</p>
              </footer>
            </div>
          </section>
        </div>
      </main>

      {toast && <div className="ga-toast" role="status">{toast}</div>}
    </div>
  );
}
