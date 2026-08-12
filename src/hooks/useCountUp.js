import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, enabled) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) return undefined
    let count = 0
    const step = Math.ceil(target / 60) || 1
    const timer = setInterval(() => {
      count = Math.min(count + step, target)
      setValue(count)
      if (count >= target) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [enabled, target])

  return value
}

export function useInView(threshold = 0.5) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
