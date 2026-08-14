import Hero from '../components/home/Hero'
import ServiceStrip from '../components/home/ServiceStrip'
import About from '../components/home/About'
import Services from '../components/home/Services'
import Stats from '../components/home/Stats'
import Portfolio from '../components/home/Portfolio'
import TechStack from '../components/home/TechStack'
import Testimonials from '../components/home/Testimonials'
import Clients from '../components/home/Clients'
import Newsletter from '../components/home/Newsletter'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

export default function Home() {
  useRevealOnScroll()
  return (
    <>
      <Hero/>
      <ServiceStrip/>
      <About />
      <Services />
      <Stats />
      <Portfolio />
      <TechStack />
      <Testimonials />
      <Clients />
      <Newsletter />
    </>
  )
}
