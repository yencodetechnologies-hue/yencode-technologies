import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mobileLinks, navLinks } from '../../data/nav'
import { useNavbarScroll } from '../../hooks/useNavbarScroll'

function hashPath(to) {
  if (!to.includes('#')) return { pathname: to, hash: '' }
  const [pathname, hash] = to.split('#')
  return { pathname: pathname || '/', hash: hash ? `#${hash}` : '' }
}

export default function Navbar() {
  const scrolled = useNavbarScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/' && !location.hash
    if (to === '/contact') return location.pathname === '/contact'
    if (to.startsWith('/#')) {
      return location.pathname === '/' && location.hash === to.slice(1)
    }
    return false
  }

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <div className="nav-inner">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src="/images/lg.png" alt="Yencode Technologies" className="logo-img" />
          </Link>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.label} className={isActive(link.to) ? 'active' : ''}>
                {link.dropdown ? (
                  <>
                    <Link to={hashPath(link.to)}>
                      {link.label} <i className="fas fa-chevron-down" style={{ fontSize: 10 }} />
                    </Link>
                    <div className="dropdown">
                      {link.dropdown.map((item) => (
                        <Link key={item.label} to={hashPath(item.href)} onClick={closeMenu}>
                          <i className={item.icon} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link to={hashPath(link.to)}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <Link to="/quote" className="nav-quote-btn">
            Get a Quote
          </Link>
          <div
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {mobileLinks.map((link) => (
          <Link key={link.label} to={hashPath(link.to)} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
