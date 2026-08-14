import { stats } from '../../data/testimonials'
import { useCountUp, useInView } from '../../hooks/useCountUp'

function StatItem({ target, suffix, label }) {
  const [ref, inView] = useInView(0.5)
  const value = useCountUp(target, inView)

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">
        {value}
        <span>{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
