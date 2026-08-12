import { techStack } from '../../data/tech'

export default function TechStack() {
  return (
    <section className="tech-section" id="tech">
      <div className="container">
        <div className="text-center">
          <div className="section-label">Our Stack</div>
          <h2 className="section-title">Technologies We Work With</h2>
          <div className="title-underline center" />
        </div>
        <div className="tech-grid">
          {techStack.map((item) => (
            <div className="tech-item" key={item.label}>
              <i className={item.icon} style={{ color: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
