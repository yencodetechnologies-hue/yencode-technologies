import { portfolio } from '../../data/portfolio'

export default function Portfolio() {
  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        <div className="text-center">
          <div className="section-label">Our Work</div>
          <h2 className="section-title">Recent Projects</h2>
          <div className="title-underline center" />
          <p className="section-sub">
            A selection of our recent work delivered to clients across India and internationally.
          </p>
        </div>
        <div className="portfolio-grid">
          {portfolio.map((item) => (
            <div className="portfolio-card" key={item.title}>
              <div className="portfolio-thumb">
                <img src={item.image} alt={item.alt} className="portfolio-img" />
                <div className="portfolio-thumb-overlay">
                  <a href="#portfolio" className="portfolio-btn">
                    View Project <i className="fas fa-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="portfolio-info">
                <div className="portfolio-tag">{item.tag}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
