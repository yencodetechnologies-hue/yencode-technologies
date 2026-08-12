import { Link } from 'react-router-dom'
import { socialLinks } from '../../data/content'

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="logo" style={{ display: 'inline-flex' }}>
              <img src="/images/lg.png" alt="Yencode Technologies" className="logo-img" />
            </Link>
            <p>
              We are a Chennai-based IT software company delivering end-to-end web, mobile, and enterprise solutions to
              clients across the globe. Quality, integrity, and innovation — at every step.
            </p>
            <div className="footer-social">
              {socialLinks.map((s) => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <i className="fas fa-chevron-right" />
                  Home
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#about' }}>
                  <i className="fas fa-chevron-right" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#services' }}>
                  <i className="fas fa-chevron-right" />
                  Services
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#portfolio' }}>
                  <i className="fas fa-chevron-right" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#tech' }}>
                  <i className="fas fa-chevron-right" />
                  Technologies
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#testimonials' }}>
                  <i className="fas fa-chevron-right" />
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <i className="fas fa-chevron-right" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              {[
                'Mobile App Development',
                'Website Development',
                'Software Development',
                'ERP & CRM Solutions',
                'AI & Automation',
                'E-Commerce',
                'SEO & Marketing',
              ].map((label) => (
                <li key={label}>
                  <Link to={{ pathname: '/', hash: '#services' }}>
                    <i className="fas fa-chevron-right" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <i className="fas fa-map-marker-alt" />
                <span>Chennai, Tamil Nadu, India — Serving clients globally</span>
              </li>
              <li>
                <i className="fas fa-phone-alt" />
                <a href="tel:+918925033533">+91 89250 33533</a>
              </li>
              <li>
                <i className="fas fa-envelope" />
                <a href="mailto:info@yencodetechnologies.com">info@yencodetechnologies.com</a>
              </li>
              <li>
                <i className="fas fa-globe" />
                <a href="https://www.yencodetechnologies.com" target="_blank" rel="noopener noreferrer">
                  www.yencodetechnologies.com
                </a>
              </li>
              <li>
                <i className="fas fa-clock" />
                <span>Mon–Sat: 9am–6pm IST</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} <Link to="/">Yencode Technologies</Link>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
