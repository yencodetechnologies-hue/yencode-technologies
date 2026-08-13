import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||   'https://yencodeweb.octosofttechnologies.in'

export default function Account() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ companyName: '', email: '', mobileNumber: '' })
const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('yencode_token')
    if (!token) { navigate('/login'); return }

    const cached = localStorage.getItem('yencode_account')
    if (cached) setForm(JSON.parse(cached))

    fetch(`${API_BASE_URL}/api/account`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) { localStorage.clear(); navigate('/login'); return null }
        return res.json()
      })
      .then((data) => {
        if (data?.success) {
          localStorage.setItem('yencode_account', JSON.stringify(data.account))
          setForm(data.account)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [navigate])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

async function handlePay() {
    setError('')
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setPaying(true)
    const token = localStorage.getItem('yencode_token')

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/payu-initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: Number(amount),
          firstname: form.companyName,
          email: form.email,
          phone: form.mobileNumber,
        }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Could not start payment.')
        setPaying(false)
        return
      }

      // Build and auto-submit a form to PayU (PayU requires a POST redirect, not a normal link)
      const payuForm = document.createElement('form')
      payuForm.method = 'POST'
      payuForm.action = data.payuUrl

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        payuForm.appendChild(input)
      })

      document.body.appendChild(payuForm)
      payuForm.submit()
    } catch (err) {
      setError('Could not reach the server.')
      setPaying(false)
    }
  }

  if (loading) return <div style={styles.wrapper}><p>Loading account...</p></div>

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>My Account</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Company Name</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Mobile Number</label>
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} style={styles.input} />
        </div>

     <div style={styles.field}>
          <label style={styles.label}>Amount</label>
          <input
            name="amount"
            type="number"
            min="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handlePay} disabled={paying} style={styles.payBtn}>
          {paying ? 'Redirecting to PayU...' : 'Pay'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" },
  card: { width: '100%', maxWidth: 460, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontFamily: "'Poppins', sans-serif", fontSize: 22 },
  logoutBtn: { background: 'none', border: '1px solid #d1d5db', color: '#6b7280', padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' },
  section: { marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, background: '#f9fafb' },
  sectionTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 15, marginBottom: 8 },
  sectionText: { fontSize: 13, color: '#6b7280' },
  payBtn: { width: '100%', marginTop: 24, padding: 13, border: 'none', borderRadius: 10, background: '#111827', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: 13, marginTop: 12, textAlign: 'center' },
}