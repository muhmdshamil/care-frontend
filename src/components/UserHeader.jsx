import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/user'

export default function UserHeader() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const notifRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Mock messages for the second section
  const mockMessages = [
    { id: 101, sender: 'Dr. Sarah', text: 'How are you feeling after today’s session?', time: '2h ago' },
    { id: 102, sender: 'Support', text: 'Welcome to MindCare! Let us know if you need help.', time: '1d ago' }
  ]

  useEffect(() => {
    if (token) {
      userService.appointmentNotifications().then(res => {
        setNotifications(res.notifications || [])
      }).catch(() => {})
    }
  }, [token])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { setOpen(false); setNotifOpen(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      if (open) setOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/user/tools', label: 'Tools' },
    { to: '/user/forum', label: 'Forum' },
    { to: '/user/professionals', label: 'Professionals' },
    { to: '/user/shops', label: 'Centers' },
    { to: '/user/content', label: 'Content' },
    { to: '/user/appointment', label: 'Booking' },
    { to: '/user/blog', label: 'Blogs' },
    { to: '/contact', label: 'Contact' },
  ]

  const totalNotifs = notifications.length + mockMessages.length

  return (
    <>
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
        }}
      >
        <div className="nav-inner" style={{ height: 80, padding: '0 5vw', maxWidth: 1400, margin: '0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', position: 'relative' }}>
          
          {/* 1. Left Section: Logo */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{display:'flex', alignItems:'center', gap:12, textDecoration:'none'}}>
              <div style={{
                width: 40, height: 40, 
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                borderRadius: 12, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{display:'flex', flexDirection:'column'}}>
                <strong style={{fontSize:'1.2rem', color:'#0f172a', fontWeight: '800', letterSpacing:'-0.03em'}}>MindCare Hub</strong>
                <span style={{fontSize:'0.75rem', color:'#64748b', fontWeight:700, letterSpacing:'0.05em', opacity: 0.8}}>USER CENTER</span>
              </span>
            </Link>
          </div>

          {/* 2. Middle Section: Navigation Links (Centered) */}
          <nav className="desktop-menu-nav" style={{display: 'none', gap: 6, alignItems:'center', flex: 2, justifyContent: 'center'}}>
            <style>{`@media(min-width: 1024px) { .desktop-menu-nav { display: flex !important; } }`}</style>
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to}
                style={{
                  padding: '10px 18px',
                  borderRadius: 14,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: location.pathname === link.to ? '#4f46e5' : '#475569',
                  background: location.pathname === link.to ? '#f5f7ff' : 'transparent',
                  textDecoration: 'none',
                  transition: '0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
            
          {/* 3. Right Section: User Portal Actions */}
          <div className="desktop-menu-actions" style={{ display: 'none', flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <style>{`@media(min-width: 1024px) { .desktop-menu-actions { display: flex !important; } }`}</style>
            {token && (
              <>
                <div style={{position:'relative'}} ref={notifRef}>
                  <button 
                    onClick={() => setNotifOpen(!notifOpen)}
                    style={{
                      width: 44, height: 44, borderRadius: 14, background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', color: '#64748b', transition: 'all 0.2s'
                    }}
                  >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    {totalNotifs > 0 && (
                      <span style={{position:'absolute', top:8, right:8, width:10, height:10, background:'#ef4444', borderRadius:'50%', border:'2px solid #fff'}}></span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="slide-up" style={{
                      position:'absolute', top:'120%', right:0, width:340, background:'#fff', borderRadius:20, 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border:'1px solid #f1f5f9', padding:'20px 0', zIndex:200
                    }}>
                      <div style={{padding:'0 24px 16px', borderBottom:'1px solid #f8fafc', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <strong style={{fontSize:'1.1rem', color:'#1e293b'}}>Notifications</strong>
                        <span style={{background:'#eef2ff', color:'#4f46e5', fontSize:'0.75rem', fontWeight:800, padding:'2px 8px', borderRadius:20}}>{totalNotifs} NEW</span>
                      </div>
                      
                      <div style={{maxHeight: 400, overflowY: 'auto'}}>
                        <div style={{padding:'16px 24px 8px'}}>
                           <span style={{fontSize:'0.7rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em'}}>Appointments</span>
                        </div>
                        {notifications.length === 0 ? (
                          <div style={{padding:'0 24px 16px', color:'#cbd5e1', fontSize:'0.9rem', fontStyle:'italic'}}>No active appointments</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} style={{padding:'12px 24px', borderBottom:'1px solid #fcfcfe', cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                              <div style={{fontSize:'0.92rem', fontWeight:700, color:'#1e293b'}}>{n.service}</div>
                              <div style={{fontSize:'0.82rem', color:'#64748b'}}>Confirmed for {n.date} at {n.time}</div>
                              <div style={{fontSize:'0.75rem', color:'#4f46e5', marginTop:4, fontWeight:600}}>Token: #{n.tokenNumber}</div>
                            </div>
                          ))
                        )}

                        <div style={{padding:'20px 24px 8px', borderTop:'1px solid #f8fafc'}}>
                           <span style={{fontSize:'0.7rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em'}}>Messages</span>
                        </div>
                        {mockMessages.map(m => (
                          <div key={m.id} style={{padding:'12px 24px', display:'flex', gap:12, cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                            <div style={{width:36, height:36, borderRadius:10, background:'#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed', flexShrink:0, fontWeight:800, fontSize:'0.8rem'}}>{m.sender[0]}</div>
                            <div>
                               <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                                  <strong style={{fontSize:'0.9rem', color:'#1e293b'}}>{m.sender}</strong>
                                  <span style={{fontSize:'0.7rem', color:'#94a3b8'}}>{m.time}</span>
                               </div>
                               <div style={{fontSize:'0.85rem', color:'#64748b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:200}}>{m.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/user/profile" style={{
                   width: 44, height: 44, borderRadius: '50%', background: '#fff', border:'1px solid #e2e8f0',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', transition:'0.2s',
                   boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>

                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '12px 24px', borderRadius: 16, 
                    background: '#1e293b', color: '#fff', 
                    border: 'none', fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: '0.2s',
                    boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)'
                  }}
                  onMouseOver={e=>e.currentTarget.style.background='#0f172a'}
                  onMouseOut={e=>e.currentTarget.style.background='#1e293b'}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="mobile-only-actions" style={{display:'flex', gap:10, alignItems:'center'}}>
             <style>{`@media(min-width: 1024px) { .mobile-only-actions { display: none !important; } }`}</style>
             {token && (
                <button onClick={() => setNotifOpen(!notifOpen)} style={{width:40, height:40, borderRadius:12, background:'#f8fafc', border:'1px solid #f1f5f9', position:'relative', display:'grid', placeItems:'center', color:'#64748b'}}>
                   <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                   {totalNotifs > 0 && <span style={{position:'absolute', top:8, right:8, width:8, height:8, background:'#ef4444', borderRadius:'50%'}}></span>}
                </button>
             )}
             <button
               onClick={() => setOpen(!open)}
               style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: 8, borderRadius: 12, color: '#334155' }}
             >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div style={{
          position: 'fixed', inset: 0, top: 80, 
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
          zIndex: 90,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s'
        }} onClick={() => setOpen(false)}>
          <div style={{
            background:'#fff', padding:'24px', borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transform: open ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'grid', gap: 10
          }} onClick={e => e.stopPropagation()}>
            {navLinks.map(link => (
              <Link 
                key={link.to} to={link.to} onClick={() => setOpen(false)}
                style={{
                  padding: '16px 20px', borderRadius: 16, fontSize: '1.05rem', fontWeight: 700,
                  color: location.pathname === link.to ? '#4f46e5' : '#1e293b',
                  background: location.pathname === link.to ? '#f5f7ff' : '#f8fafc',
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </Link>
            ))}
             <div style={{height:1, background:'#f1f5f9', margin:'8px 0'}} />
             {token && (
               <button onClick={handleLogout} style={{padding:'16px 20px', borderRadius:16, background:'#fee2e2', color:'#ef4444', border:'none', fontSize:'1.05rem', fontWeight:700, marginTop:8}}>
                  Sign Out
               </button>
             )}
          </div>
        </div>
      </header>
    </>
  )
}


