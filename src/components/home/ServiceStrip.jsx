import { stripItems } from '../../data/services'

export default function ServiceStrip() {
  return (
    <div className="service-strip">
      <div className="container">
        <div className="service-strip-inner">
          {stripItems.map((item) => (
            <div className="strip-item" key={item.label}>
              <div className="strip-icon">
                <i className={item.icon} />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
