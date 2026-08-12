import { Link } from 'react-router-dom'
import { aboutPoints } from '../../data/content'

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrap">
            <div className="about-image-grid">
              <div
                className="about-img-box big"
                style={{ background: 'linear-gradient(135deg,#0A1628,#112244)' }}
              >
                <img src="/images/about_team.png" alt="Yencode Technologies Team" className="about-img" />
              </div>
              <div
                className="about-img-box"
                style={{ background: 'linear-gradient(135deg,#112244,#001833)' }}
              >
                <img src="/images/about_tech.png" alt="Software Development" className="about-img" />
              </div>
              <div
                className="about-img-box"
                style={{ background: 'linear-gradient(135deg,#001833,#0A1628)' }}
              >
                <img src="/images/about_global.png" alt="Global IT Solutions" className="about-img" />
              </div>
            </div>
            <div className="about-badge">
              <div className="num">10+</div>
              <div className="lbl">Years of Excellence</div>
            </div>
          </div>
          <div className="about-text">
            <div className="section-label">About Us</div>
            <h2 className="section-title">We Turn Ideas Into Powerful Digital Solutions</h2>
            <div className="title-underline" />
            <p style={{ fontSize: '14.5px', color: 'var(--gray-text)', lineHeight: 1.8, marginBottom: 12 }}>
              Yencode Technologies is a Chennai-based IT software company delivering end-to-end digital solutions to
              businesses across the globe. We specialize in building robust, scalable, and user-centric products that
              drive real results.
            </p>
            <ul className="about-list">
              {aboutPoints.map((point) => (
                <li key={point}>
                  <i className="fas fa-check-circle" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="about-btns">
              <Link to={{ pathname: '/', hash: '#services' }} className="btn-primary">
                Our Services
              </Link>
              <Link to="/contact" className="btn-dark">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
