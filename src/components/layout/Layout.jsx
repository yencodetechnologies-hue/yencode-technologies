import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <>
      <TopBar />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
