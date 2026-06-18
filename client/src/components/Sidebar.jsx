import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ICONS = {
  home: '◈',
  letters: '✉',
  settings: '⊙',
  logout: '→',
}

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/')
    toast.success('Signed out')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Will<span>It</span></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { id: 'dashboard', label: 'Overview', icon: ICONS.home },
          { id: 'letters', label: 'My letters', icon: ICONS.letters },
          { id: 'settings', label: 'Settings', icon: ICONS.settings },
        ].map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ padding: '8px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 2 }}>{user?.email}</div>
        </div>
        <button className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">{ICONS.logout}</span>
          Sign out
        </button>
      </div>
    </div>
  )
}
