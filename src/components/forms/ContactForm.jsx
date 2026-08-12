import { useState } from 'react'

const initial = { name: '', phone: '', email: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(initial)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`New Contact Form Submission from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nMore Info:\n${form.message}`,
    )
    window.location.href = `mailto:info@yencodetechnologies.com?subject=${subject}&body=${body}`
  }

  return (
    <form id="contactForm" onSubmit={onSubmit}>
      <div className="form-bento-grid">
        <div className="form-field-card name-field">
          <label htmlFor="nameInput">
            Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="far fa-user" />
            <input
              type="text"
              id="nameInput"
              name="name"
              placeholder="John Doe"
              required
              value={form.name}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-field-card phone-field">
          <label htmlFor="phoneInput">
            Phone <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-mobile-alt" />
            <input
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder="+91 89250 33533"
              required
              value={form.phone}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-field-card email-field">
          <label htmlFor="emailInput">Email Address</label>
          <div className="input-wrapper">
            <i className="far fa-envelope" />
            <input
              type="email"
              id="emailInput"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-field-card message-field">
          <label htmlFor="messageInput">Project Details / Message</label>
          <div className="input-wrapper">
            <textarea
              id="messageInput"
              name="message"
              placeholder="Tell us about your project or support needs..."
              rows={5}
              value={form.message}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="bento-submit-btn">
            <span>Send Message</span>
            <i className="far fa-paper-plane" />
          </button>
        </div>
      </div>
    </form>
  )
}
