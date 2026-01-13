import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProHeader() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      if (open) setOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const navLinks = [
    { to: '/professional/dashboard', label: 'Dashboard' }
  ]

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled || open ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.05)' : 'none',
        height: 80,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="nav-inner" style={{ width: '100%', padding: '0 5vw', maxWidth: 1400, margin: '0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', position: 'relative' }}>
        
        {/* Left: Logo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{display:'flex', alignItems:'center', gap:12, textDecoration:'none'}}>
            <div style={{
              width: 40, height: 40, 
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
              borderRadius: 12, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 16px rgba(124, 58, 237, 0.25)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span style={{display:'flex', flexDirection:'column'}}>
              <strong style={{fontSize:'1.2rem', color:'#0f172a', fontWeight: '800', letterSpacing:'-0.03em'}}>MindCare Hub</strong>
              <span style={{fontSize:'0.75rem', color:'#6b7280', fontWeight:700, letterSpacing:'0.05em', opacity: 0.8}}>PRO PORTAL</span>
            </span>
          </Link>
        </div>

        {/* Middle: Navigation */}
        <nav style={{display: 'flex', gap: 6, alignItems:'center', flex: 2, justifyContent: 'center'}}>
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to}
              style={{
                padding: '10px 18px',
                borderRadius: 14,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: location.pathname === link.to ? '#7c3aed' : '#475569',
                background: location.pathname === link.to ? '#f5f3ff' : 'transparent',
                textDecoration: 'none',
                transition: '0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          {token && (
            <button 
              onClick={handleLogout}
              style={{
                padding: '12px 24px', borderRadius: 16, 
                background: '#1e293b', color: '#fff', 
                border: 'none', fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', transition: '0.2s',
                boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)'
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
