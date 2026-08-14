import { socialLinks } from '../../data/content'

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-left">
          <span>
            <i className="fas fa-phone" />
            <a href="tel:+918925033533">+91 89250 33533</a>
          </span>
          <span>
            <i className="fas fa-envelope" />
            <a href="mailto:info@yencodetechnologies.com">info@yencodetechnologies.com</a>
          </span>
          <span>
            <i className="fas fa-clock" />
            Mon–Sat: 9am–6pm IST
          </span>
        </div>
        <div className="top-right">
          <div className="social-icons">
            {socialLinks.map((s) => (
              <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer">
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
