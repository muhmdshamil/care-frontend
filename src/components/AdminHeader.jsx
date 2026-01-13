import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminHeader() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Content Manager', path: '/admin/content' },
  ]

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      background: scrolled ? 'rgba(255, 255, 255, 0.8)' : '#fff', 
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '1px solid #f1f5f9',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw', height: '84px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1 }}>MindCare Admin</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Management Suite</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === link.path ? '#6366f1' : '#64748b', 
                fontSize: '0.95rem', 
                fontWeight: 700,
                transition: 'color 0.2s'
              }}
            >
              {link.name}
            </Link>
          ))}
          {token && (
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '10px 24px', 
                background: '#f8fafc', 
                color: '#ef4444', 
                border: '1px solid #f1f5f9', 
                borderRadius: '12px', 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fee2e2'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
