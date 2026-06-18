import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Checkin() {
  const { token } = useParams()
  const [state, setState] = useState('loading')
  const [name, setName] = useState('')

  useEffect(() => {
    api.get(`/checkin/token/${token}`)
      .then(res => { setState('success'); setName(res.data.name) })
      .catch(() => setState('error'))
  }, [token])

  return (
    <div className="page-center" style={{ background: 'var(--surface-2)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '40px 32px', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--ink)', display: 'block', marginBottom: 32 }}>
          Will<span style={{ color: 'var(--accent)' }}>It</span>
        </Link>

        {state === 'loading' && (
          <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>Verifying your check-in...</p>
        )}

        {state === 'success' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>You're good, {name}.</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 24 }}>
              Check-in recorded. Your letter stays locked. The clock resets now.
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ justifyContent: 'center', display: 'flex' }}>
              Go to dashboard
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✗</div>
            <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Link invalid or expired</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 24 }}>
              This check-in link has already been used or doesn't exist.
            </p>
            <Link to="/login" className="btn btn-ghost" style={{ justifyContent: 'center', display: 'flex' }}>
              Sign in instead
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
