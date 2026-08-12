import { useState } from 'react'
import { quoteServices } from '../../data/content'

const initial = { name: '', phone: '', email: '', service: '', message: '', fileName: '' }

export default function QuoteForm() {
  const [form, setForm] = useState(initial)

  const onChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'file') {
      setForm((f) => ({ ...f, fileName: files?.[0]?.name || '' }))
      return
    }
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`New Quote Request from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service}\nAttached File (Please check email if attached): ${form.fileName || 'No file attached'}\n\nMore Info:\n${form.message}`,
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

        <div className="form-field-card service-field">
          <label htmlFor="serviceSelect">
            Required Service <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-tools" />
            <select id="serviceSelect" name="service" required value={form.service} onChange={onChange}>
              <option value="" disabled>
                Select Service *
              </option>
              {quoteServices.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field-card upload-field">
          <label htmlFor="pdfUpload">Upload Document (PDF)</label>
          <div className="input-wrapper">
            <i className="far fa-file-pdf" />
            <input type="file" id="pdfUpload" name="file" accept=".pdf" onChange={onChange} />
          </div>
        </div>

        <div className="form-field-card message-field">
          <label htmlFor="messageInput">Project Details / Requirements</label>
          <div className="input-wrapper">
            <textarea
              id="messageInput"
              name="message"
              placeholder="Tell us about your project or features needed..."
              rows={4}
              value={form.message}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="bento-submit-btn">
            <span>Submit Request</span>
            <i className="far fa-paper-plane" />
          </button>
        </div>
      </div>
    </form>
  )
}
