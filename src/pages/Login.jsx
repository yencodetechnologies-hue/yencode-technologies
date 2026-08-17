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
          <div style={styles.diagonal} aria-hidden="true" />
          <div style={styles.cornerLine} aria-hidden="true" />
          <div style={styles.cornerLine2} aria-hidden="true" />

          <div style={styles.brandContent}>
            <div style={styles.brandIconMark}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CYAN_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4l-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
              </svg>
            </div>
            <div>
              <div style={styles.hexGrid} aria-hidden="true">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} style={styles.hexDot} />
                ))}
              </div>
              <h2 style={styles.brandHeadline}>Your work,<br />organized.</h2>
              <p style={styles.brandBody}>
                One dashboard for projects, invoices, and client
                communication — built for teams that move fast.
              </p>
            </div>
            <div style={styles.brandFooter}>
              <div style={styles.dot} />
              <span>Encrypted • Trusted • Reliable</span>
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

 brandPanel: {
    position: 'relative',
    background: `radial-gradient(circle at 15% 15%, ${NAVY2} 0%, ${NAVY} 55%)`,
    padding: '48px 42px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 400,
  },
  brandIconMark: {
    position: 'relative',
    zIndex: 1,
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    background: `linear-gradient(135deg, rgba(55,242,248,0.14), rgba(0,189,212,0.05))`,
    border: `1px solid rgba(55,242,248,0.3)`,
    boxShadow: `0 0 16px rgba(55,242,248,0.15)`,
  },
  hexGrid: {
    display: 'flex',
    gap: 6,
    marginBottom: 16,
  },
  hexDot: {
    width: 5,
    height: 5,
    borderRadius: 1,
    background: 'rgba(55,242,248,0.4)',
    transform: 'rotate(45deg)',
  },
  diagonal: {
    position: 'absolute',
    top: 0,
    right: '-15%',
    width: '60%',
    height: '140%',
    background: `linear-gradient(180deg, ${CYAN} 0%, ${CYAN_LIGHT} 100%)`,
    opacity: 0.12,
    transform: 'rotate(12deg)',
    pointerEvents: 'none',
  },
  cornerLine: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 36,
    height: 36,
    borderTop: `2px solid ${CYAN_LIGHT}`,
    borderLeft: `2px solid ${CYAN_LIGHT}`,
    opacity: 0.5,
    pointerEvents: 'none',
  },
  cornerLine2: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 36,
    height: 36,
    borderBottom: `2px solid ${CYAN_LIGHT}`,
    borderRight: `2px solid ${CYAN_LIGHT}`,
    opacity: 0.5,
    pointerEvents: 'none',
  },
  brandContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: 40,
    zIndex: 1,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 14 },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'transparent',
    border: `2px solid ${CYAN_LIGHT}`,
    color: CYAN_LIGHT,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 800,
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
    letterSpacing: 2,
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
  },
  brandHeadline: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 1.2,
    letterSpacing: -0.4,
  },
  brandBody: {
    fontSize: 13,
    lineHeight: 1.75,
    color: 'rgba(255,255,255,0.5)',
    maxWidth: 260,
    borderLeft: `2px solid ${CYAN}`,
    paddingLeft: 16,
  },
  brandFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  dot: {
    width: 6,
    height: 6,
    background: CYAN_LIGHT,
    transform: 'rotate(45deg)',
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
