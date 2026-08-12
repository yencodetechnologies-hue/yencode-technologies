import QuoteForm from '../components/forms/QuoteForm'

export default function Quote() {
  return (
    <section
      className="contact-page-wrap"
      style={{ minHeight: 'calc(100vh - 120px)', paddingTop: 50, paddingBottom: 80, position: 'relative' }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div className="contact-header" style={{ textAlign: 'center', marginBottom: 50 }}>
          <span
            className="contact-eyebrow"
            style={{
              background: 'rgba(0, 189, 212, 0.1)',
              color: 'var(--cyan-dark)',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: 15,
              border: '1px solid rgba(0, 189, 212, 0.3)',
            }}
          >
            Get a Quote
          </span>
          <h2 style={{ fontSize: 38, color: '#0f172a', fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
            Request a{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--cyan-light), var(--cyan-dark))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quote
            </span>
          </h2>
          <p
            style={{
              color: '#475569',
              marginTop: 10,
              fontSize: 16,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Please provide details for your project quote. Our technical estimators will evaluate your requirements
            shortly.
          </p>
        </div>

        <div className="bento-container">
          <div className="bento-card form-card glass-morphic">
            <div
              className="glowing-orb"
              style={{ top: -50, right: -50, left: 'auto', background: 'rgba(55, 242, 248, 0.12)' }}
            />
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  )
}
