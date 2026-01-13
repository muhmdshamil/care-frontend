import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { token, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close menu when route (path or hash) changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])
  const handleClose = () => setOpen(false)

  // Close on scroll/resize in mobile view and lock body scroll when open
  useEffect(() => {
    const onScroll = () => setOpen(false)
    const onResize = () => {
      if (window.innerWidth > 700) setOpen(false)
    }
    if (open) {
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <header className="nav ">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="MindCare Doc Home">
          <span className="logo" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 3l5 5 5-5 4 4-5 5 5 5-4 4-5-5-5 5-4-4 5-5-5-5 4-4z" stroke="#3b2a78" strokeWidth="1.5" fill="none"/>
            </svg>
          </span>
          <span className="brand-text">
            <strong>MindCare Doc</strong>
            <span className="tagline">FOR A HAPPIER LIFE AHEAD</span>
          </span>
        </Link>

        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <nav className={`menu ${open ? 'open' : ''}`} aria-label="Primary">
          <Link to="/" onClick={handleClose}>Home</Link>
          <Link to="/user/dashboard#about" onClick={handleClose}>About</Link>
          <Link to="/user/tools" onClick={handleClose}>Tools</Link>
          <Link to="/user/content" onClick={handleClose}>Content</Link>
          <Link to="/user/forum" onClick={handleClose}>Forum</Link>
          <Link to="/user/profile" onClick={handleClose}>Profile</Link>
          <Link to="/user/appointment" onClick={handleClose}>Appointment</Link>
          <a href="/contact" onClick={handleClose}>Contact</a>
          {token && (
            <Link
              to="/login"
              className="btn pill purple"
              onClick={() => {
                logout()
                handleClose()
              }}
            >
              Logout
            </Link>
          )}
        </nav>
        {open && <button className=" menu-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
      </div>

      {token && (
        <div className="nav-auth">
          {role === 'ADMIN' && <Link to="/admin/dashboard">Admin</Link>}
          {role === 'ADMIN' && <Link to="/admin/content">Content</Link>}
          {role === 'PROFESSIONAL' && <Link to="/professional/dashboard">Pro</Link>}
        </div>
      )}
    </header>
  )
}
