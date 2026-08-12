import { services } from '../../data/services'

export default function Services() {
  return (
    <section id="services" style={{ background: '#fff' }}>
      <div className="container">
        <div className="text-center">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Our Core Services</h2>
          <div className="title-underline center" />
          <p className="section-sub">
            From mobile apps to AI-powered ERP systems, we deliver tailored IT solutions that help your business grow
            and succeed in a competitive market.
          </p>
        </div>
        <div className="services-grid">
          {services.map((svc) => (
            <div className="service-card" key={svc.title}>
              <div className="svc-icon">
                <i className={svc.icon} />
              </div>
              <h4>{svc.title}</h4>
              <p>{svc.text}</p>
              <a href="#services" className="svc-link">
                Learn More <i className="fas fa-arrow-right" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
