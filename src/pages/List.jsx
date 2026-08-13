import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://yencodeweb.octosofttechnologies.in'

const EMPTY_FORM = {
  companyName: '',
  mobileNumber: '',
  email: '',
  password: '',
}

export default function List() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
const [form, setForm] = useState({ companyName: '', mobileNumber: '', email: '', password: '', amount: '' })
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      const res = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
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

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || `Request failed: ${res.status}`)
        return
      }

      // Add the returned company immediately to the UI.
      setEntries((prev) => [...prev, data.company])

      setForm(EMPTY_FORM)
      setShowModal(false)

      // Re-fetch from MongoDB so refresh/persistent data is confirmed.
      await fetchCompanies()
    } catch (err) {
      console.error('POST companies error:', err)
      setError(
        'Could not reach the server. Make sure the backend is deployed and running.'
      )
    } finally {
      setSaving(false)
    }
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
            <th style={styles.th}>Payment Status</th>
            <th style={styles.th}>Account Status</th>
            <th style={styles.th}>Receipt</th>
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
                      {entry.paymentDetails?.amount ? `₹${entry.paymentDetails.amount}` : '-'}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.statusBadge(entry.paymentStatus)}>
                        {entry.paymentStatus || 'Pending'}
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
                      {entry.paymentStatus === 'Payment Successful' ? (
                        <button style={styles.receiptBtn} onClick={() => alert('Receipt view coming next')}>
                          View Receipt
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
            <h2 style={styles.modalHeading}>Add Company</h2>

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
              <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} />
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
                {saving ? 'Adding...' : 'Add'}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: "'Inter', sans-serif",
  },

  card: {
    width: '100%',
    maxWidth: 1100,
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
      status === 'Payment Successful' ? '#dcfce7' : status === 'Payment Failed' ? '#fee2e2' : '#fef9c3',
    color:
      status === 'Payment Successful' ? '#16a34a' : status === 'Payment Failed' ? '#dc2626' : '#a16207',
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

  receiptBtn: {
    background: '#fff',
    border: '1px solid #d1d5db',
    color: '#111827',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
}