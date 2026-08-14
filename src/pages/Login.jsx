import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yencodeweb.octosofttechnologies.in'

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
    if (email === 'yencodetechnologies@gmail.com' && password === '123456') {
      localStorage.setItem('yencode_token', 'demo-token')
      localStorage.setItem('yencode_role', 'admin')
      localStorage.setItem('yencode_account', JSON.stringify({ companyName: 'Yencode Technologies', email, mobileNumber: '' }))
      navigate('/list')
      setLoading(false)
      return
    }

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
      localStorage.setItem('yencode_role', 'company')
      localStorage.setItem('yencode_account', JSON.stringify(data.account))
      navigate('/account')
    } catch (err) {
      setError('Could not reach the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.shell}>
        {/* Brand panel */}
        <div style={styles.brandPanel}>
          <div style={styles.glow} aria-hidden="true" />
          <div style={styles.grid} aria-hidden="true" />
          <div style={styles.brandContent}>
            <div style={styles.logoRow}>
              <div style={styles.logoMark}>Y</div>
              <div>
                <div style={styles.logoWordmark}>YENCODE</div>
                <div style={styles.logoSub}>TECHNOLOGIES</div>
              </div>
            </div>
            <div>
              <h2 style={styles.brandHeadline}>Build. Deploy. Scale.</h2>
              <p style={styles.brandBody}>
                Sign in to manage your projects, track delivery, and stay
                connected with your engineering team — all in one place.
              </p>
            </div>
            <div style={styles.brandFooter}>
              <div style={styles.dot} />
              <span>Secure company access</span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div style={styles.formPanel}>
          <div style={styles.formInner}>
            <h1 style={styles.heading}>Welcome back</h1>
            <p style={styles.subtitle}>Sign in to access your account</p>

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
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>

              <div style={styles.field}>
                <div style={styles.labelRow}>
                  <label style={styles.label} htmlFor="password">Password</label>
                  <a href="#" style={styles.forgotLink}>Forgot password?</a>
                </div>
                <div style={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    style={styles.passwordInput}
                    onFocus={(e) => Object.assign(e.target.style, { ...styles.passwordInput, ...styles.inputFocus })}
                    onBlur={(e) => Object.assign(e.target.style, styles.passwordInput)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p role="alert" style={styles.error}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              >
                {loading ? 'Signing in…' : (
                  <>
                    Login <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </>
                )}
              </button>
            </form>

            <p style={styles.footerText}>
              Need access? <a href="/contact" style={styles.footerLink}>Contact your admin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CYAN = '#00BDD4'
const CYAN_LIGHT = '#37F2F8'
const NAVY = '#0A1628'
const NAVY2 = '#0d1e38'

const styles = {
  wrapper: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    fontFamily: "'Inter', sans-serif",
    background: '#f5f8fa',
  },
  shell: {
    width: '100%',
    maxWidth: 920,
    minHeight: 560,
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
    background: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 24px 70px rgba(10,22,40,0.14)',
    border: '1px solid #e8edf2',
  },

  // brand panel
  brandPanel: {
    position: 'relative',
    background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY2} 100%)`,
    padding: '44px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 400,
  },
  glow: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${CYAN} 0%, transparent 70%)`,
    opacity: 0.25,
    filter: 'blur(10px)',
    pointerEvents: 'none',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    pointerEvents: 'none',
  },
  brandContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: 40,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${CYAN}, ${CYAN_LIGHT})`,
    color: NAVY,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoWordmark: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: '#fff',
    letterSpacing: 1,
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  brandHeadline: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 28,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 14,
    lineHeight: 1.25,
  },
  brandBody: {
    fontSize: 14.5,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.65)',
    maxWidth: 320,
  },
  brandFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.55)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: CYAN_LIGHT,
    boxShadow: `0 0 8px ${CYAN_LIGHT}`,
  },

  // form panel
  formPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 36px',
  },
  formInner: { width: '100%', maxWidth: 340 },
  heading: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 24,
    color: '#1a2840',
    marginBottom: 6,
  },
  subtitle: {
    color: '#6b7a8d',
    fontSize: 14,
    marginBottom: 30,
  },
  field: { marginBottom: 18 },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 },
  forgotLink: {
    fontSize: 12.5,
    color: CYAN,
    textDecoration: 'none',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #d9dee5',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .15s, box-shadow .15s',
    background: '#fbfcfd',
  },
  inputFocus: {
    borderColor: CYAN,
    boxShadow: `0 0 0 3px rgba(0,189,212,0.15)`,
    background: '#fff',
  },
  passwordWrapper: { position: 'relative' },
  passwordInput: {
    width: '100%',
    padding: '12px 44px 12px 14px',
    borderRadius: 10,
    border: '1px solid #d9dee5',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .15s, box-shadow .15s',
    background: '#fbfcfd',
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
    color: '#6b7a8d',
  },
  button: {
    width: '100%',
    padding: '13px 14px',
    border: 'none',
    borderRadius: 10,
    background: `linear-gradient(135deg, ${CYAN}, ${CYAN_LIGHT})`,
    color: NAVY,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,189,212,0.3)',
    transition: 'transform .15s, box-shadow .15s',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 14,
    marginTop: -6,
    textAlign: 'left',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7a8d',
    marginTop: 26,
  },
  footerLink: {
    color: CYAN,
    fontWeight: 600,
    textDecoration: 'none',
  },
}
