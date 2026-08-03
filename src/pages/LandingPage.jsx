import { Link, useNavigate } from 'react-router-dom';
import { useApp, getRoleDisplayName } from '../context/AppContext';

export default function LandingPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  return (
    <main className="page-view active-view page-route" id="landing-view">
      <section className="hero-section" id="home">
        <div className="container hero-grid">
          <div className="hero-info">
            <p className="hero-eyebrow">Community Donation Platform</p>
            <h1 className="hero-title">Share More. Waste Less.<br />Help Someone Today.</h1>
            <p className="hero-tagline">
              Give Away connects generous donors with verified NGOs and families in need. Donate items or funds, request help, and track every delivery with full transparency.
            </p>
            <div className="hero-cta">
              {!currentUser ? (
                <div className="hero-cta-row">
                  <button type="button" className="btn-hero-primary" onClick={() => navigate('/register/donor')}>Donate Now</button>
                  <button type="button" className="btn-hero-secondary" onClick={() => navigate('/register/receiver')}>Request Help</button>
                </div>
              ) : (
                <div>
                  <span className="badge badge-success">Signed in</span>
                  <p className="hero-welcome-text">
                    Welcome back, {currentUser.name}! You are logged in as {getRoleDisplayName(currentUser.role)}.
                  </p>
                  <div className="hero-cta-row">
                    <button type="button" className="btn-hero-primary" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="hero-mockup">
            <div className="hero-illustration">
              <div className="hero-illustration-icon" aria-hidden="true">🤝</div>
              <p className="hero-panel-title">People helping people</p>
              <p className="hero-panel-subtitle">Trusted relief · Verified partners · Real impact</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section" aria-label="Platform impact statistics">
        <div className="container">
          <div className="stats-grid-modern">
            {[
              ['12,400+', 'Total Donations'],
              ['3,200', 'Families Helped'],
              ['300+', 'Active NGOs'],
              ['98%', 'Successful Deliveries']
            ].map(([num, label]) => (
              <article key={label} className="stat-card-modern">
                <p className="stat-number">{num}</p>
                <p className="stat-label">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section" id="donate">
        <div className="container">
          <div className="section-heading">
            <h2>Donation Categories</h2>
            <p>Browse what you can give — every item finds a verified home.</p>
          </div>
          <div className="category-grid">
            {['👕 Clothes', '📚 Books', '🍲 Food', '🛋️ Furniture', '💻 Electronics', '🏥 Medical Supplies'].map((c) => (
              <div key={c} className="category-card">
                <div className="category-card-icon">{c.split(' ')[0]}</div>
                <h3>{c.split(' ').slice(1).join(' ')}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="ngos">
        <div className="container">
          <div className="section-heading">
            <h2>Who uses Give Away</h2>
            <p>Four clear roles keep donations, requests, and approvals organized.</p>
          </div>
          <div className="features-grid">
            {[
              ['D', 'Donors', 'Give items or funds, then track where your support goes.'],
              ['N', 'NGO Partners', 'Request warehouse stock or program funding for local distribution.'],
              ['R', 'Receivers', 'Request financial support or items with supporting documents.'],
              ['A', 'Admins', 'Verify users, manage inventory, and approve relief requests.']
            ].map(([icon, title, desc]) => (
              <div key={title} className="feature-card" id={title === 'Receivers' ? 'request' : undefined}>
                <div className="feature-icon-box">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stories-section" id="stories">
        <div className="container">
          <div className="section-heading">
            <h2>Success Stories</h2>
            <p>Real impact from our community of donors and partners.</p>
          </div>
          <div className="testimonial-grid">
            {[
              ['RK', '"I donated winter blankets and could see exactly which NGO received them."', 'Rajesh Kumar', 'Donor · Pune'],
              ['SK', '"Our foundation received medical kits within 48 hours."', 'Sunita Deshmukh', 'NGO Partner'],
              ['AM', '"I requested rent assistance and received support after verification."', 'Amit Mehta', 'Receiver']
            ].map(([av, quote, author, role]) => (
              <article key={author} className="testimonial-card">
                <div className="testimonial-avatar">{av}</div>
                <p className="testimonial-quote">{quote}</p>
                <p className="testimonial-author">{author}</p>
                <p className="testimonial-role">{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container about-grid">
          <div>
            <h2>About Aja Abayahastham</h2>
            <p>We bridge donors, verified NGOs, and receivers through a transparent platform built on trust, dignity, and accountability.</p>
            <ul className="about-list">
              <li>Verified partner network</li>
              <li>End-to-end donation tracking</li>
              <li>Secure document verification</li>
              <li>Community-first relief coordination</li>
            </ul>
          </div>
          <div className="about-visual" aria-hidden="true">💚</div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-grid">
          <div>
            <h2>Contact Us</h2>
            <p>Questions about donations, partnerships, or support requests?</p>
            <p><strong>Email:</strong> support@abhayahastam.org</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={4} placeholder="How can we help?" />
            </div>
            <button type="submit" className="login-submit">Send Message</button>
          </form>
        </div>
      </section>

      {!currentUser && (
        <section className="cta-banner-section">
          <div className="container cta-banner">
            <h2>Ready to make a difference?</h2>
            <p>Join thousands of donors and partners on Give Away.</p>
            <div className="hero-cta-row" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn-hero-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
              <Link to="/login" className="btn-hero-secondary" style={{ textDecoration: 'none' }}>Sign In</Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
