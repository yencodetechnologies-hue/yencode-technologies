import { clients } from '../../data/testimonials'
export default function Clients() {
  const track = [...clients, ...clients]
  return (
    <div className="clients-section">
      <div className="container">
        <div className="clients-heading">
          <h3>Our Valuable Clients</h3>
          <p>Trusted by companies across India and internationally</p>
        </div>
      </div>
      <div className="clients-track-wrap">
        <div className="clients-track">
          {track.map((name, i) => (
            <div className="client-logo" key={`${name}-${i}`}>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}