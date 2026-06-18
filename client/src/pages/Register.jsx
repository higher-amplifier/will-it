import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', checkinInterval: 30 })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.token, res.data.user)
      nav('/dashboard')
      toast.success('Account created. Write your first letter.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center" style={{ background: 'var(--surface-2)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '36px 32px' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--ink)', display: 'block', marginBottom: 28 }}>
          Will<span style={{ color: 'var(--accent)' }}>It</span>
        </Link>

        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Create your account</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24 }}>Takes 2 minutes. No card required.</p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>Your name</label>
            <input placeholder="Bharat" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Check-in every</label>
            <select value={form.checkinInterval} onChange={e => setForm(p => ({ ...p, checkinInterval: parseInt(e.target.value) }))}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
            <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>You'll get a reminder before the deadline</span>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
