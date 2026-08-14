import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PaymentFailed() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('yencode_account')
    const timer = setTimeout(() => navigate('/account'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icon}>✕</div>
        <h1 style={styles.heading}>Payment Unsuccessful</h1>
        <p style={styles.text}>Something went wrong with your payment. Please try again.</p>
        <p style={styles.subtext}>Redirecting to your account...</p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" },
  card: { textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', maxWidth: 420 },
  icon: { width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  heading: { fontFamily: "'Poppins', sans-serif", fontSize: 22, margin: '0 0 12px', color: '#111827' },
  text: { color: '#4b5563', fontSize: 14, marginBottom: 8 },
  subtext: { color: '#9ca3af', fontSize: 13 },
}