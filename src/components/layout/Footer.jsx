import { Link } from 'react-router-dom'
import { socialLinks } from '../../data/content'

export default function Footer() {
  return (
    <footer id="contact" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="container" style={{ margin: '0 auto' }}>
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="logo" style={{ display: 'inline-flex' }}>
              <img src="/images/lg.png" alt="Yencode Technologies" className="logo-img" />
            </Link>
            <p>
             We are a global IT software company delivering end-to-end web, mobile, and enterprise solutions to clients worldwide. Driven by quality, integrity, and innovation, we transform ideas into scalable digital solutions that create lasting business value.
            </p>
            <div className="footer-social">
              {socialLinks.map((s) => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
            <a href="/contact" className="footer-cta-box" style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, textDecoration: 'none', maxWidth: 320 }}>
              <span style={{ width: 40, height: 40, minWidth: 40, borderRadius: '50%', background: '#2f6fed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-rocket" style={{ color: '#fff' }} />
              </span>
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: '#fff', fontSize: 14 }}>Let's Build Something Great</strong>
                <span style={{ display: 'block', color: '#9aa4b2', fontSize: 12.5 }}>Have an idea? We're ready to turn it into reality.</span>
              </span>
              <i className="fas fa-arrow-right" style={{ color: '#9aa4b2' }} />
            </a>
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
              <li>
                <i className="fas fa-map-marker-alt" />
                <span>15/3 Lancaster Street, Ingleburn NSW 2565</span>
              </li>
                <li>
                <i className="fas fa-phone-alt" />
                <a href="tel:+61481399977">0481 399 977</a>
              </li>
              <li>
                <i className="fas fa-envelope" />
                <a href="mailto:info@safeticks.com">info@safeticks.com</a>
              </li>
            </ul>
          </div>  
             </div>
        <div className="footer-features" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '24px 28px', margin: '30px 0' }}>
          {[
            { icon: 'fa-gem', color: '#4f6df5', title: 'Quality First', text: 'We deliver solutions with the highest quality standards.' },
            { icon: 'fa-shield-alt', color: '#22c55e', title: 'Trusted Partner', text: 'We build long-term relationships based on trust and transparency.' },
            { icon: 'fa-lightbulb', color: '#c94fed', title: 'Innovative Solutions', text: 'We leverage the latest technologies to drive innovation.' },
            { icon: 'fa-headset', color: '#f5a623', title: '24/7 Support', text: "We're here to support your business, anytime, anywhere." },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: '1 1 220px', textAlign: 'left' }}>
              <span style={{ width: 44, height: 44, minWidth: 44, borderRadius: '50%', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${f.icon}`} style={{ color: '#fff' }} />
              </span>
              <span>
                <strong style={{ display: 'block', color: '#fff', fontSize: 14.5 }}>{f.title}</strong>
                <span style={{ display: 'block', color: '#9aa4b2', fontSize: 12.5 }}>{f.text}</span>
              </span>
            </div>
          ))}
        </div>
   <div className="footer-bottom" style={{ textAlign: 'center', width: '100%' }}>
  <p style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
    <i className="fas fa-heart" style={{ color: '#2fd4c4' }} />
    © {new Date().getFullYear()} <Link to="/">Yencode Technologies</Link>. All Rights Reserved.
    <span>|</span>
    <Link to="/privacy-policy">Privacy Policy</Link>
    <span>|</span>
    <Link to="/terms-and-conditions">Terms & Conditions</Link>
  </p>
</div>
      </div>
    </footer>
  )
}
