import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../../data/hero'

function toLink(href) {
  if (href.includes('#')) {
    const [pathname, hash] = href.split('#')
    return { pathname: pathname || '/', hash: `#${hash}` }
  }
  return href
}

function Cube() {
  return (
    <div className="hero-image">
      <svg className="cube-svg hero-cube" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="100,20 180,65 180,135 100,180 20,135 20,65"
          stroke="#00BDD4"
          strokeWidth="1.5"
          fill="rgba(0,189,212,0.05)"
        />
        <polygon points="100,20 180,65 100,110 20,65" stroke="#37F2F8" strokeWidth="1" fill="rgba(55,242,248,0.05)" />
        <polygon
          points="100,110 180,65 180,135 100,180"
          stroke="#00BDD4"
          strokeWidth="1"
          fill="rgba(0,189,212,0.03)"
        />
        <polygon
          points="100,110 20,65 20,135 100,180"
          stroke="#37F2F8"
          strokeWidth="1"
          fill="rgba(55,242,248,0.03)"
        />
        <circle cx="100" cy="100" r="60" stroke="rgba(0,189,212,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="80" stroke="rgba(55,242,248,0.1)" strokeWidth="1" strokeDasharray="2 6" />
      </svg>
    </div>
  )
}

export default function Hero() {
  const [index, setIndex] = useState(0)
  const count = heroSlides.length

  const go = (n) => setIndex(((n % count) + count) % count)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <section className="hero" id="hero">
      <div className="hero-slides" style={{ transform: `translateX(-${index * 100}%)` }}>
        {heroSlides.map((slide) => (
          <div className="hero-slide" key={slide.eyebrow}>
            <div className="container">
              <div className="hero-content">
                <div className="hero-eyebrow">{slide.eyebrow}</div>
                <h1>
                  {slide.titleBefore}
                  <span>{slide.titleHighlight}</span>
                  {slide.titleAfter}
                </h1>
                <p>{slide.text}</p>
                <div className="hero-btns">
                  <Link to={toLink(slide.primary.href)} className="btn-primary">
                    {slide.primary.icon && <i className={slide.primary.icon} />}
                    {slide.primary.label}
                  </Link>
                  <Link to={toLink(slide.secondary.href)} className="btn-outline">
                    {slide.secondary.label}
                  </Link>
                </div>
              </div>
            </div>
            {slide.showCube && <Cube />}
          </div>
        ))}
      </div>
      <div className="hero-controls">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.eyebrow}
            type="button"
            className={`hero-dot${i === index ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="hero-arrows">
        <button type="button" className="hero-arr" onClick={() => go(index - 1)} aria-label="Previous slide">
          <i className="fas fa-chevron-left" />
        </button>
        <button type="button" className="hero-arr" onClick={() => go(index + 1)} aria-label="Next slide">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </section>
  )
}
