import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yencodeweb.octosofttechnologies.in'

export default function List() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ companyName: '', mobileNumber: '', email: '', password: '' })
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  function fetchCompanies() {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEntries(data.companies)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleAdd() {
    setError('')
    if (!form.companyName || !form.mobileNumber || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Could not add company.')
        setSaving(false)
        return
      }
      setForm({ companyName: '', mobileNumber: '', email: '', password: '' })
      setShowModal(false)
      setSaving(false)
      fetchCompanies()
    } catch (err) {
      setError('Could not reach the server.')
      setSaving(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>List</h1>
          <button onClick={() => setShowModal(true)} style={styles.addBtn}>+ Add</button>
        </div>

        {loading ? (
          <p style={styles.emptyText}>Loading...</p>
        ) : entries.length === 0 ? (
          <p style={styles.emptyText}>No entries yet. Click "+ Add" to create one.</p>
        ) : (
          <div>
            {entries.map((entry) => (
              <div key={entry._id} style={styles.entryRow}>
                <strong>{entry.companyName}</strong>
                <span style={styles.entryEmail}>{entry.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeading}>Add Company</h2>

            <div style={styles.field}>
              <label style={styles.label}>Company Name</label>
              <input name="companyName" value={form.companyName} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Mobile Number</label>
              <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.modalBtnRow}>
              <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={styles.addBtn}>{saving ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" },
  card: { width: '100%', maxWidth: 600, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontFamily: "'Poppins', sans-serif", fontSize: 22 },
  addBtn: { background: '#111827', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '40px 0' },
  entryRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  entryEmail: { color: '#6b7280', fontSize: 13 },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '90%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeading: { fontFamily: "'Poppins', sans-serif", fontSize: 20, marginBottom: 20 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' },
  modalBtnRow: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  cancelBtn: { background: '#f3f4f6', color: '#111827', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: 13, marginTop: 4 },
}