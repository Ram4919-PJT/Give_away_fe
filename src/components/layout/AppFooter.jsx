import { useNavigate } from 'react-router-dom';

export default function AppFooter() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    navigate('/');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">Give Away</div>
          <p className="footer-tagline">Transparent charity · Verified partners · Real community impact.</p>
        </div>
        <div>
          <h4 className="footer-heading">For Donors</h4>
          <ul className="footer-links">
            <li><button type="button" className="footer-link" onClick={() => navigate('/register/donor')}>Donor Registration</button></li>
            <li><button type="button" className="footer-link" onClick={() => navigate('/login?role=donor')}>Donor Login</button></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">For Partners</h4>
          <ul className="footer-links">
            <li><button type="button" className="footer-link" onClick={() => navigate('/register/ngo')}>NGO Registration</button></li>
            <li><button type="button" className="footer-link" onClick={() => navigate('/register/receiver')}>Request Support</button></li>
            <li><button type="button" className="footer-link" onClick={() => scrollTo('ngos')}>Our NGOs</button></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><button type="button" className="footer-link" onClick={() => scrollTo('about')}>About</button></li>
            <li><button type="button" className="footer-link" onClick={() => scrollTo('contact')}>Contact</button></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Aja Abayahastham · Give Away Platform</span>
        <span>Built with trust &amp; transparency</span>
      </div>
    </footer>
  );
}
