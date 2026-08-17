import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||   'https://yencodeweb.octosofttechnologies.in'

function normalizePaymentStatus(status) {
  if (!status) return 'Pending'
  if (['Paid', 'Payment Successful', 'Successful / Paid'].includes(status)) return 'Successful / Paid'
  if (['Payment Failed', 'Unsuccessful / Payment Failed'].includes(status)) return 'Unsuccessful / Payment Failed'
  return status
}

export default function Account() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ companyName: '', email: '', mobileNumber: '', paymentStatus: 'Pending' })
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)

  const receiptTransactionId = form.paymentDetails?.payuId || form.paymentDetails?.mihpayid || form.paymentDetails?.txnid || '-'
  const isPaid = normalizePaymentStatus(form.paymentStatus) === 'Successful / Paid' || normalizePaymentStatus(form.paymentStatus) === 'Paid'

  useEffect(() => {
    const token = localStorage.getItem('yencode_token')

    if (!token) {
      navigate('/login')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const justPaid = sessionStorage.getItem('yencode_payment_success') === 'true' || params.get('paid') === '1'

    const applyCachedPaidState = () => {
      const savedAccount = JSON.parse(localStorage.getItem('yencode_account') || '{}')
      const normalizedSavedStatus = normalizePaymentStatus(savedAccount.paymentStatus)
      const shouldKeepPaid = normalizedSavedStatus === 'Successful / Paid' || normalizedSavedStatus === 'Paid'

      const nextForm = {
        ...savedAccount,
        paymentStatus: shouldKeepPaid ? 'Successful / Paid' : savedAccount.paymentStatus || 'Pending',
        paymentDetails: {
          ...(savedAccount.paymentDetails || {}),
          amount: savedAccount.paymentDetails?.amount || savedAccount.amount || 0,
        },
      }

      setForm(nextForm)
      setAmount(nextForm.paymentDetails?.amount || '')
      sessionStorage.removeItem('yencode_payment_success')
      if (params.get('paid') === '1') {
        window.history.replaceState({}, '', window.location.pathname)
      }
    }

    if (justPaid || normalizePaymentStatus(JSON.parse(localStorage.getItem('yencode_account') || '{}').paymentStatus) === 'Successful / Paid') {
      applyCachedPaidState()
    }

    async function loadAccount() {
      try {
        setLoading(true)

        const res = await fetch(`${API_BASE_URL}/api/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 401) {
          localStorage.clear()
          navigate('/login')
          return
        }
        if (res.status === 403) {
          // Account has been disabled server-side. Force logout so user cannot use the portal.
          localStorage.clear()
          navigate('/login')
          return
        }

        const data = await res.json()

        if (data?.success && data.account) {
          const normalizedStatus = normalizePaymentStatus(data.account.paymentStatus)
          const normalizedAccount = {
            ...data.account,
            paymentStatus: normalizedStatus,
          }

          const finalStatus = normalizedStatus === 'Successful / Paid' || normalizedStatus === 'Paid' || justPaid ? 'Successful / Paid' : normalizedStatus
          const merged = {
            ...normalizedAccount,
            paymentStatus: finalStatus,
          }

          setForm(merged)
          localStorage.setItem('yencode_account', JSON.stringify(merged))
          setAmount(merged.paymentDetails?.amount || merged.amount || '')
        }
      } catch (err) {
        console.error('Account loading error:', err)
        setError('Could not load account details.')
      } finally {
        setLoading(false)
      }
    }

    loadAccount()

    // Poll account status periodically to detect server-side deactivation
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('yencode_token')
        if (!token) return
        const res = await fetch(`${API_BASE_URL}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401 || res.status === 403) {
          localStorage.clear()
          navigate('/login')
        }
      } catch (err) {
        // network errors ignored for polling
      }
    }, 10000)

    return () => clearInterval(interval)
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
          <h1 style={styles.heading}>Payment Portal</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Company Name</th>
                <th style={styles.th}>Mobile Number</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>1</td>
                <td style={styles.td}>{form.companyName}</td>
                <td style={styles.td}>{form.mobileNumber}</td>
                <td style={styles.td}>{form.email}</td>
                <td style={styles.td}>
                  ₹{amount || 0}
                </td>
                <td style={styles.td}>
                  {form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }) : '-'}
                </td>
                <td style={styles.td}>
                  {isPaid ? (
                    <span style={styles.paidBtn}>Paid</span>
                  ) : (
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      style={styles.payBtn}
                    >
                      {paying ? '...' : 'Pay'}
                    </button>
                  )}
                </td>
                <td style={styles.td}>
                  {isPaid ? (
                    <button onClick={() => setShowReceipt(true)} style={styles.receiptBtn}>
                      View Receipt
                    </button>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>-</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showReceipt && form.paymentDetails && (
        <div style={styles.overlay} onClick={() => setShowReceipt(false)}>
          <div style={styles.receiptCard} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowReceipt(false)} style={styles.receiptCloseX} aria-label="Close">✕</button>

            <div style={styles.receiptHeader}>
              <div style={styles.receiptIconCircle}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={styles.receiptTitle}>Payment Successful</h2>
              <p style={styles.receiptSubtitle}>Thank you, your payment has been received</p>
            </div>

            <div style={styles.receiptAmountBox}>
              <span style={styles.receiptAmountLabel}>Amount Paid</span>
              <span style={styles.receiptAmountValue}>
                ₹{Number(form.paymentDetails.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={styles.receiptDetails}>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Transaction ID</span>
                <span style={styles.receiptValueMono}>{receiptTransactionId}</span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Date & Time</span>
                <span style={styles.receiptValue}>
                  {form.paymentDetails.paymentDate ? new Date(form.paymentDetails.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Company</span>
                <span style={styles.receiptValue}>{form.companyName}</span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Email</span>
                <span style={styles.receiptValue}>{form.email}</span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Mobile</span>
                <span style={styles.receiptValue}>{form.mobileNumber}</span>
              </div>
              <div style={{ ...styles.receiptDetailRow, marginBottom: 0 }}>
                <span style={styles.receiptLabel}>Status</span>
                <span style={styles.receiptStatusPill}>● Success</span>
              </div>
            </div>

            <div style={styles.receiptPerforation}>
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} style={styles.receiptDot} />
              ))}
            </div>

            <div style={styles.receiptFooterRow}>
              <button onClick={() => setShowReceipt(false)} style={styles.receiptCloseBtnFancy}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
 wrapper: { minHeight: '80vh', padding: 20, fontFamily: "'Inter', sans-serif" },
card: { width: '100%', maxWidth: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontFamily: "'Poppins', sans-serif", fontSize: 22, margin: 0 },
  logoutBtn: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: 0.3, cursor: 'pointer', boxShadow: '0 2px 8px rgba(220,38,38,0.12)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' },
  tableWrapper: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 20 },
  th: { textAlign: 'left', padding: '14px 12px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#374151' },
  td: { padding: '14px 12px', borderBottom: '1px solid #f3f4f6', fontSize: 14, color: '#111827', verticalAlign: 'middle' },
  amountInput: { width: 120, padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 },
  payBtn: { background: '#111827', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  paidBtn: { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'not-allowed' },
  receiptBtn: { background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: 0.2, cursor: 'pointer', boxShadow: '0 2px 6px rgba(37,99,235,0.15)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' },
  error: { color: '#ef4444', fontSize: 13, marginTop: 12, textAlign: 'center' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 28, width: '90%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeading: { fontFamily: "'Poppins', sans-serif", fontSize: 18, marginBottom: 20, textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 15 },
  receiptRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#374151' },
  closeBtn: { width: '100%', marginTop: 20, padding: 10, background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' },

  receiptCard: {
    position: 'relative',
    background: '#fff',
    borderRadius: 20,
    width: '92%',
    maxWidth: 380,
    boxShadow: '0 25px 70px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  receiptCloseX: {
    position: 'absolute',
    top: 14,
    right: 14,
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: 28,
    height: 28,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: '28px',
    zIndex: 2,
  },
  receiptHeader: {
    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    padding: '32px 24px 26px',
    textAlign: 'center',
    color: '#fff',
  },
  receiptIconCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  receiptTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  receiptSubtitle: {
    fontSize: 13,
    opacity: 0.9,
    margin: '6px 0 0',
  },
  receiptAmountBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '22px 24px 18px',
    borderBottom: '1px solid #f3f4f6',
  },
  receiptAmountLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  receiptAmountValue: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 32,
    fontWeight: 700,
    color: '#111827',
  },
  receiptDetails: {
    padding: '20px 24px 4px',
  },
  receiptDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#6b7280',
    flexShrink: 0,
  },
  receiptValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: 600,
    textAlign: 'right',
  },
  receiptValueMono: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 600,
    fontFamily: "'Courier New', monospace",
    textAlign: 'right',
    wordBreak: 'break-all',
  },
  receiptStatusPill: {
    background: '#dcfce7',
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 999,
  },
  receiptPerforation: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 8px',
    margin: '4px 0 0',
  },
  receiptDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#f3f4f6',
    flexShrink: 0,
  },
  receiptFooterRow: {
    display: 'flex',
    gap: 10,
    padding: '18px 24px 24px',
  },
  receiptCloseBtnFancy: {
    flex: 1,
    background: '#111827',
    color: '#fff',
    border: 'none',
    padding: '13px 0',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.3,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(17,24,39,0.25)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
}