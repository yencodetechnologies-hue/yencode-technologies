import { useEffect, useState } from 'react'
import { testimonialSlides } from '../../data/testimonials'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = testimonialSlides.length

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <section className="testi-section" id="testimonials">
      <div className="container">
        <div className="text-center">
          <div className="section-label">Client Feedback</div>
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="title-underline center" />
        </div>
        <div className="testi-slider-wrap">
          <div className="testi-slides" style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonialSlides.map((slide, si) => (
              <div className="testi-slide" key={si}>
                {slide.map((card) => (
                  <div className="testi-card" key={card.name}>
                    <div className="testi-stars">★★★★★</div>
                    <p>&ldquo;{card.quote}&rdquo;</p>
                    <div className="testi-author">
                      <div className="testi-avatar">{card.initial}</div>
                      <div className="testi-author-info">
                        <strong>{card.name}</strong>
                        <span>{card.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="testi-nav">
          {testimonialSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testi-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Testimonials page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
