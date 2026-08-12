import { useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>✓</div>
        <h1 style={styles.heading}>Payment Completed</h1>
        <p style={styles.subtitle}>Successful</p>
        <p style={styles.detail}>Your payment has been received and processed successfully.</p>
        <button onClick={() => navigate('/list')} style={styles.button}>Back to List</button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" },
  card: { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  iconCircle: {
    width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a',
    fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  heading: { fontFamily: "'Poppins', sans-serif", fontSize: 22, marginBottom: 6, color: '#16a34a' },
  subtitle: { fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 },
  detail: { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  button: { padding: '12px 24px', border: 'none', borderRadius: 10, background: '#111827', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
}