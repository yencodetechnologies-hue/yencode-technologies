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
                <th style={styles.th}>Added Date</th>
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
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeading}>Payment Receipt</h2>
            <div style={styles.receiptRow}>
              <strong>Transaction ID:</strong> <span>{receiptTransactionId}</span>
            </div>
            <div style={styles.receiptRow}>
              <strong>Date:</strong> <span>{form.paymentDetails.paymentDate ? new Date(form.paymentDetails.paymentDate).toLocaleString() : '-'}</span>
            </div>
            <div style={styles.receiptRow}>
              <strong>Company:</strong> <span>{form.companyName}</span>
            </div>
            <div style={styles.receiptRow}>
              <strong>Email:</strong> <span>{form.email}</span>
            </div>
            <div style={styles.receiptRow}>
              <strong>Mobile:</strong> <span>{form.mobileNumber}</span>
            </div>
            <div style={styles.receiptRow}>
              <strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Success</span>
            </div>
            <div style={{ ...styles.receiptRow, borderTop: '2px dashed #e5e7eb', marginTop: 15, paddingTop: 15 }}>
              <strong>Amount Paid:</strong> <span style={{ fontSize: 18, fontWeight: 'bold' }}>₹{form.paymentDetails.amount}</span>
            </div>
            <button onClick={() => setShowReceipt(false)} style={styles.closeBtn}>Close</button>
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
  logoutBtn: { background: 'none', border: '1px solid #d1d5db', color: '#6b7280', padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  tableWrapper: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 20 },
  th: { textAlign: 'left', padding: '14px 12px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#374151' },
  td: { padding: '14px 12px', borderBottom: '1px solid #f3f4f6', fontSize: 14, color: '#111827', verticalAlign: 'middle' },
  amountInput: { width: 120, padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 },
  payBtn: { background: '#111827', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  paidBtn: { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'not-allowed' },
  receiptBtn: { background: '#fff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: 13, marginTop: 12, textAlign: 'center' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 28, width: '90%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeading: { fontFamily: "'Poppins', sans-serif", fontSize: 18, marginBottom: 20, textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 15 },
  receiptRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#374151' },
  closeBtn: { width: '100%', marginTop: 20, padding: 10, background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }
}