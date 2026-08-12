import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const subject = encodeURIComponent('Newsletter Subscription')
    const body = encodeURIComponent(`Please subscribe this email to the newsletter:\n\n${email}`)
    window.location.href = `mailto:info@yencodetechnologies.com?subject=${subject}&body=${body}`
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Stay updated with the latest technology trends, company news, and service announcements.</p>
          </div>
          <form className="newsletter-form" onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              Subscribe <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
