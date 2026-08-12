import { useNavigate } from 'react-router-dom'

export default function List() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>List</h1>
          <button onClick={() => navigate('/account')} style={styles.addBtn}>+ Add</button>
        </div>

        <p style={styles.emptyText}>No entries yet. Click "+ Add" to create one.</p>
      </div>
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
}