import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      nav('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center" style={{ background: 'var(--surface-2)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--ink)', display: 'block', marginBottom: 28 }}>
          Will<span style={{ color: 'var(--accent)' }}>It</span>
        </Link>

        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Welcome back</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24 }}>Sign in to access your letters</p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--ink)', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
