import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import WillModal from '../components/WillModal'

function Overview({ status, onCheckin, onCheckinLoading }) {
  if (!status) return <div style={{ color: 'var(--ink-muted)', fontSize: 14 }}>Loading status...</div>

  const pct = status.dangerPercent
  const barColor = pct < 50 ? 'var(--green)' : pct < 80 ? '#d97706' : 'var(--accent)'

  return (
    <div>
      <h1 className="page-title">Overview</h1>
      <p className="page-sub">Your dead man's switch status</p>

      {status.triggerFired && (
        <div style={{ background: 'var(--accent-light)', border: '1px solid #f0c4bb', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 20, fontSize: 14, color: 'var(--accent)' }}>
          Your letter has been sent to your nominee. Check in to reactivate your account.
        </div>
      )}

      <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 4 }}>Days until delivery</div>
            <div style={{ fontSize: 36, fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
              {status.daysLeft}
              <span style={{ fontSize: 16, color: 'var(--ink-muted)', marginLeft: 6 }}>days</span>
            </div>
          </div>
          <span className={`badge ${pct < 50 ? 'badge-green' : pct < 80 ? 'badge-amber' : 'badge-red'}`}>
            {pct < 50 ? 'Safe' : pct < 80 ? 'Check in soon' : 'Urgent'}
          </span>
        </div>

        <div className="status-bar">
          <div className="status-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-faint)', marginTop: 8, marginBottom: 20 }}>
          <span>Last check-in: {new Date(status.lastCheckin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>{status.daysSince} days ago</span>
        </div>

        <button className="btn btn-primary" onClick={onCheckin} disabled={onCheckinLoading}>
          {onCheckinLoading ? 'Checking in...' : "I'm okay — check in now"}
        </button>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6 }}>Check-in window</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>Every {status.checkinInterval} days</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6 }}>Reminder sent at</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{Math.floor(status.checkinInterval * 0.8)} days</div>
        </div>
      </div>
    </div>
  )
}

function Letters({ wills, onNew, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My letters</h1>
          <p className="page-sub">{wills.length} {wills.length === 1 ? 'letter' : 'letters'} — all encrypted</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onNew}>+ New letter</button>
      </div>

      {wills.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✉</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No letters yet</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>Write something for the people who matter.</div>
          <button className="btn btn-primary btn-sm" onClick={onNew}>Write your first letter</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {wills.map(w => (
            <div key={w._id} className="will-card" onClick={() => onEdit(w)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="will-card-title">{w.title}</div>
                  <div className="will-card-meta" style={{ marginTop: 4 }}>
                    For {w.nomineeName} · {w.nomineeEmail}
                  </div>
                  <div className="will-card-meta" style={{ marginTop: 2 }}>
                    Last updated {new Date(w.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {w.isDelivered && <span style={{ color: 'var(--accent)', marginLeft: 8 }}>· Delivered</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 12 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(w)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(w._id)}>Delete</button>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>🔒 AES-256 encrypted</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Settings({ user, setUser }) {
  const [interval, setInterval] = useState(user?.checkinInterval || 30)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.patch('/auth/settings', { checkinInterval: interval })
      setUser(res.data.user)
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Adjust your check-in preferences</p>

      <div className="card" style={{ padding: '24px', maxWidth: 480 }}>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Check-in interval</label>
          <select value={interval} onChange={e => setInterval(parseInt(e.target.value))}>
            <option value={7}>Every 7 days</option>
            <option value={14}>Every 14 days</option>
            <option value={30}>Every 30 days</option>
            <option value={60}>Every 60 days</option>
            <option value={90}>Every 90 days</option>
          </select>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            You'll get a reminder at {Math.floor(interval * 0.8)} days. Miss {interval} days and your letter gets delivered.
          </span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="card" style={{ padding: '20px', maxWidth: 480, marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Account</div>
        <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{user?.name} · {user?.email}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [wills, setWills] = useState([])
  const [status, setStatus] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingWill, setEditingWill] = useState(null)
  const [checkinLoading, setCheckinLoading] = useState(false)

  const fetchWills = useCallback(async () => {
    const res = await api.get('/will')
    setWills(res.data.wills)
  }, [])

  const fetchStatus = useCallback(async () => {
    const res = await api.get('/checkin/status')
    setStatus(res.data)
  }, [])

  useEffect(() => {
    fetchWills()
    fetchStatus()
  }, [])

  const checkin = async () => {
    setCheckinLoading(true)
    try {
      await api.post('/checkin/now')
      await fetchStatus()
      toast.success("Checked in. You're all good.")
    } catch {
      toast.error('Check-in failed')
    } finally {
      setCheckinLoading(false)
    }
  }

  const deleteWill = async (id) => {
    if (!confirm('Delete this letter? This cannot be undone.')) return
    await api.delete(`/will/${id}`)
    toast.success('Letter deleted')
    fetchWills()
  }

  const openNew = () => { setEditingWill(null); setShowModal(true) }
  const openEdit = (w) => { setEditingWill(w); setShowModal(true) }
  const onSaved = () => { setShowModal(false); fetchWills() }

  return (
    <div className="layout">
      <Sidebar active={active} setActive={setActive} />
      <div className="main-content">
        {active === 'dashboard' && (
          <Overview status={status} onCheckin={checkin} onCheckinLoading={checkinLoading} />
        )}
        {active === 'letters' && (
          <Letters wills={wills} onNew={openNew} onEdit={openEdit} onDelete={deleteWill} />
        )}
        {active === 'settings' && (
          <Settings user={user} setUser={setUser} />
        )}
      </div>

      {showModal && (
        <WillModal will={editingWill} onClose={() => setShowModal(false)} onSaved={onSaved} />
      )}
    </div>
  )
}
