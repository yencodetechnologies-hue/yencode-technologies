import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://yencodeweb.octosofttechnologies.in'

const EMPTY_FORM = {
  companyName: '',
  mobileNumber: '',
  email: '',
  password: '',
  amount: '',
}

function normalizePaymentStatus(status) {
  if (!status) return 'Pending'
  if (['Paid', 'Payment Successful', 'Successful / Paid'].includes(status)) return 'Successful / Paid'
  if (['Payment Failed', 'Unsuccessful / Payment Failed'].includes(status)) return 'Unsuccessful / Payment Failed'
  return status
}

export default function List() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
const [form, setForm] = useState({ companyName: '', mobileNumber: '', email: '', password: '', amount: '' })
const [showReceipt, setShowReceipt] = useState(false)
const [selectedEntry, setSelectedEntry] = useState(null)
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('yencode_role')
    if (role !== 'admin') {
      navigate('/login')
      return
    }
    fetchCompanies()
  }, [navigate])

  async function fetchCompanies() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/companies`)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      if (data.success) {
        setEntries(data.companies || [])
      } else {
        setError(data.message || 'Could not load companies.')
      }
    } catch (err) {
      console.error('GET companies error:', err)
      setError('Could not load companies. Check backend/API deployment.')
    } finally {
      setLoading(false)
    }
  }


async function toggleAccountStatus(entry) {
    const newStatus = !entry.accountStatus

    // Update the UI immediately so the switch always responds to a click.
    setEntries((prev) =>
      prev.map((e) => (e._id === entry._id ? { ...e, accountStatus: newStatus } : e))
    )

    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/${entry._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountStatus: newStatus }),
      })
      const data = await res.json()
      if (!data.success) {
        console.error('Toggle status failed on server:', data.message)
        // Revert if the server rejected it.
        setEntries((prev) =>
          prev.map((e) => (e._id === entry._id ? { ...e, accountStatus: entry.accountStatus } : e))
        )
      }
    } catch (err) {
      console.error('Toggle status network error:', err)
      // Revert if the request never reached the server.
      setEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? { ...e, accountStatus: entry.accountStatus } : e))
      )
    }
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function openEditModal(entry) {
    setEditingId(entry._id)
    setForm({
      companyName: entry.companyName || '',
      mobileNumber: entry.mobileNumber || '',
      email: entry.email || '',
      password: entry.password || '',
      amount: entry.amount || entry.paymentDetails?.amount || '',
    })
    setError('')
    setShowModal(true)
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Delete ${entry.companyName}? This cannot be undone.`)) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/${entry._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e._id !== entry._id))
      } else {
        alert(data.message || 'Could not delete company.')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Could not reach the server.')
    }
  }

  async function handleAdd() {
    setError('')

    if (
      !form.companyName.trim() ||
      !form.mobileNumber.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError('All fields are required.')
      return
    }

    setSaving(true)

    try {
      const isEditing = Boolean(editingId)
      const url = isEditing
        ? `${API_BASE_URL}/api/companies/${editingId}`
        : `${API_BASE_URL}/api/companies`

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          mobileNumber: form.mobileNumber.trim(),
          email: form.email.trim(),
          password: form.password,
          amount: form.amount,
        }),
      })

      let data;
      try {
        data = await res.json()
      } catch (parseError) {
        setError(`Server error: received unexpected format (Status: ${res.status}). Endpoint may be missing.`)
        return
      }

      if (!res.ok || !data.success) {
        setError(data?.message || `Request failed: ${res.status}`)
        return
      }

      setForm(EMPTY_FORM)
      setEditingId(null)
      setShowModal(false)

      await fetchCompanies()
    } catch (err) {
      console.error('Save companies error:', err)
      setError(
        'Could not reach the server. Make sure the backend is deployed and running.'
      )
    } finally {
      setSaving(false)
    }
  }
function printReceipt(entry) {
    const receiptNode = document.getElementById('receipt-print-area')
    if (!receiptNode) return

    const clone = receiptNode.cloneNode(true)
    const closeBtn = clone.querySelector('[data-no-print]')
    if (closeBtn) closeBtn.remove()

    const printWindow = window.open('', '_blank', 'width=480,height=720')
    if (!printWindow) {
      alert('Please allow pop-ups to print the receipt.')
      return
    }

    printWindow.document.open()
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt - ${entry.companyName || ''}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 24px; background: #f3f4f6; font-family: 'Inter', sans-serif; display: flex; justify-content: center; }
          @media print { body { background: #fff; padding: 0; } }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
        <script>
          window.onload = function () { window.print(); };
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>Company List</h1>

          <button
            onClick={() => {
              setError('')
              setForm(EMPTY_FORM)
              setEditingId(null)
              setShowModal(true)
            }}
            style={styles.addBtn}
          >
            + Add
          </button>
        </div>

        {error && !showModal && (
          <div style={styles.pageError}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={styles.emptyText}>Loading...</p>
        ) : entries.length === 0 ? (
          <p style={styles.emptyText}>
            No companies yet. Click "+ Add" to create one.
          </p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
<th style={styles.th}>S.No</th>
            <th style={styles.th}>Company Name</th>
            <th style={styles.th}>Mobile Number</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Payment Status</th>
            <th style={styles.th}>Account Status</th>
            <th style={styles.th}>Receipt</th>
            <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry._id}>
                    <td style={styles.td}>{index + 1}</td>

                    <td style={styles.td}>{entry.companyName}</td>

                    <td style={styles.td}>{entry.mobileNumber}</td>

                    <td style={styles.td}>{entry.email}</td>

                    <td style={styles.td}>{entry.password}</td>

                    <td style={styles.td}>
                      {entry.amount || entry.paymentDetails?.amount ? `₹${entry.amount || entry.paymentDetails.amount}` : '-'}
                    </td>

                    <td style={styles.td}>
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }) : '-'}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.statusBadge(entry.paymentStatus)}>
                        {normalizePaymentStatus(entry.paymentStatus)}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => toggleAccountStatus(entry)}
                        style={styles.switchTrack(entry.accountStatus)}
                        aria-label={entry.accountStatus ? 'Turn account OFF' : 'Turn account ON'}
                      >
                        <span style={styles.switchThumb(entry.accountStatus)} />
                      </button>
                      <span style={styles.switchLabel(entry.accountStatus)}>
                        {entry.accountStatus ? 'ON' : 'OFF'}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {normalizePaymentStatus(entry.paymentStatus) === 'Successful / Paid' ? (
                        <button
                          onClick={() => {
                            setSelectedEntry(entry)
                            setShowReceipt(true)
                          }}
                          style={styles.receiptBtn}
                          title="View Receipt"
                          aria-label="View Receipt"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <circle cx="12" cy="15.5" r="2.2" />
                            <path d="M8.5 15.5c.9-1.6 2-2.4 3.5-2.4s2.6.8 3.5 2.4c-.9 1.6-2 2.4-3.5 2.4s-2.6-.8-3.5-2.4z" />
                          </svg>
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>-</span>
                      )}
                    </td>

                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => openEditModal(entry)} title="Edit" aria-label="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(entry)} title="Delete" aria-label="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showReceipt && selectedEntry && (
        <div style={styles.overlay} onClick={() => setShowReceipt(false)}>
          <div id="receipt-print-area" style={styles.receiptCard} onClick={(e) => e.stopPropagation()}>
            <button data-no-print="true" onClick={() => setShowReceipt(false)} style={styles.receiptCloseX} aria-label="Close">✕</button>

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
                ₹{Number(selectedEntry.paymentDetails?.amount || selectedEntry.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={styles.receiptDetails}>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Transaction ID</span>
                <span style={styles.receiptValueMono}>
                  {selectedEntry.paymentDetails?.payuId || selectedEntry.paymentDetails?.mihpayid || selectedEntry.paymentDetails?.txnid || '-'}
                </span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Date & Time</span>
                <span style={styles.receiptValue}>
                  {selectedEntry.paymentDetails?.paymentDate ? new Date(selectedEntry.paymentDetails.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Company</span>
                <span style={styles.receiptValue}>{selectedEntry.companyName}</span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Email</span>
                <span style={styles.receiptValue}>{selectedEntry.email}</span>
              </div>
              <div style={styles.receiptDetailRow}>
                <span style={styles.receiptLabel}>Mobile</span>
                <span style={styles.receiptValue}>{selectedEntry.mobileNumber}</span>
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

      {showModal && (
        <div
          style={styles.overlay}
          onClick={() => {
            if (!saving) setShowModal(false)
          }}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalHeading}>{editingId ? 'Edit Company' : 'Add Company'}</h2>

            <div style={styles.field}>
              <label style={styles.label}>Company Name</label>

              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter company name"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mobile Number</label>

              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter mobile number"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter email"
              />
            </div>
<div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={handleChange} 
                    placeholder="Enter password"
                  style={{ ...styles.input, paddingRight: '40px' }} 
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                   {showPassword ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
                </button>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Amount</label>
              <input name="amount" type="number" min="0" placeholder="Enter amount" value={form.amount} onChange={handleChange} style={styles.input} />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.modalBtnRow}>
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                style={styles.cancelBtn}
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                disabled={saving}
                style={styles.addBtn}
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '80vh',
    padding: 20,
    fontFamily: "'Inter', sans-serif",
  },

  card: {
    width: '100%',
  maxWidth: '100%',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  heading: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 22,
    margin: 0,
  },

  addBtn: {
    background: '#111827',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    padding: '40px 0',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: '14px 12px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 13,
    color: '#374151',
  },

  td: {
    padding: '14px 12px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: 14,
    color: '#111827',
  },

  pageError: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '12px 14px',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    background: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '90%',
    maxWidth: 420,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },

  modalHeading: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 20,
    marginBottom: 20,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    display: 'block',
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    boxSizing: 'border-box',
  },

  modalBtnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },

  cancelBtn: {
    background: '#f3f4f6',
    color: '#111827',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  error: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4,
  },

  statusBadge: (status) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background:
      normalizePaymentStatus(status) === 'Successful / Paid' ? '#dcfce7' : normalizePaymentStatus(status) === 'Unsuccessful / Payment Failed' ? '#fee2e2' : '#fef9c3',
    color:
      normalizePaymentStatus(status) === 'Successful / Paid' ? '#16a34a' : normalizePaymentStatus(status) === 'Unsuccessful / Payment Failed' ? '#dc2626' : '#a16207',
  }),

  switchTrack: (isOn) => ({
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    background: isOn ? '#16a34a' : '#d1d5db',
    transition: 'background 0.2s ease',
    verticalAlign: 'middle',
    marginRight: 8,
  }),

  switchThumb: (isOn) => ({
    position: 'absolute',
    top: 3,
    left: isOn ? 23 : 3,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transition: 'left 0.2s ease',
  }),

  switchLabel: (isOn) => ({
    fontSize: 12,
    fontWeight: 600,
    color: isOn ? '#16a34a' : '#6b7280',
    verticalAlign: 'middle',
  }),

  editBtn: {
    background: '#fff',
    border: '1px solid #d1d5db',
    color: '#111827',
    width: 30,
    height: 30,
    borderRadius: 8,
    cursor: 'pointer',
    marginRight: 6,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtn: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    width: 30,
    height: 30,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptBtn: { background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)', color: '#1d4ed8', border: '1px solid #93c5fd', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 6px rgba(37,99,235,0.15)', transition: 'transform 0.15s ease, box-shadow 0.15s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
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

  receiptPrintBtn: {
    flex: 1,
    background: '#111827',
    color: '#fff',
    border: 'none',
    padding: '11px 0',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
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
