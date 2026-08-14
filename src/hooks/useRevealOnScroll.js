import { useEffect } from 'react'

export function useRevealOnScroll(selector = '.service-card, .portfolio-card, .testi-card, .tech-item') {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    els.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1'
            e.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}
