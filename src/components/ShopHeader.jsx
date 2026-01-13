import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { shopService } from '../services/shop'

export default function ShopHeader() {
  const { token, logout, role } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [shopName, setShopName] = useState('Shop Management')
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    if (token && role === 'SHOP_OWNER') {
      shopService.myShop()
        .then(data => setShopName(data.name))
        .catch(() => {})
    }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [token, role])

  const navLinks = [
    { name: 'Shop Dashboard', path: '/shop/dashboard' },
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
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1 }}>{shopName}</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Owner Portal</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === link.path ? '#10b981' : '#64748b', 
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
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
