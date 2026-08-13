import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||   'https://yencodeweb.octosofttechnologies.in'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
const [showPassword, setShowPassword] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      localStorage.setItem('yencode_token', data.token)
      localStorage.setItem('yencode_account', JSON.stringify(data.account))
      navigate('/list')
    } catch (err) {
      setError('Could not reach the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtitle}>Login to access your account</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="username"
              required
              style={styles.input}
            />
          </div>
       <div style={styles.field}>
  <label style={styles.label} htmlFor="password">Password</label>
  <div style={styles.passwordWrapper}>
    <input
      id="password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      autoComplete="current-password"
      required
      style={styles.passwordInput}
    />
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  style={styles.eyeBtn}
  aria-label={showPassword ? 'Hide password' : 'Show password'}
>
  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
</button>
  </div>
</div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: '36px 32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  passwordWrapper: { position: 'relative' },
passwordInput: {
  width: '100%',
  padding: '12px 44px 12px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
},
eyeBtn: {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6b7280',
},
  heading: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 28,
  },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 6 },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px 14px',
    border: 'none',
    borderRadius: 10,
    background: '#111827',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 6,
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 14,
    textAlign: 'center',
  },
}