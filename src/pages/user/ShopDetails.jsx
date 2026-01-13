import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopService } from '../../services/shop'
import Footer from '../../components/Footer'

export default function ShopDetails() {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    shopService.getShopById(id)
      .then(data => setShop(data))
      .catch(err => setError('Center not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader">Loading Center Details...</div>
    </div>
  )

  if (error || !shop) return (
     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>Center Not Found</h2>
        <Link to="/user/shops" style={{ marginTop: '20px', color: '#4f46e5', fontWeight: 800 }}>Back to all centers</Link>
     </div>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Premium Hero */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
        padding: '160px 0 120px', 
        color: '#fff', 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 80px 80px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
             <Link to="/user/shops" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>← ALL CENTERS</Link>
             <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></span>
             <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.9rem' }}>OFFICIAL PARTNER</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 950, marginBottom: '24px', letterSpacing: '-0.05em', lineHeight: 1 }}>{shop.name}</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: 800, lineHeight: 1.7 }}>
            {shop.description || "Welcome to our specialized wellness hub. We provide evidence-based mental health support through our team of highly qualified clinical experts."}
          </p>
        </div>
        
        {/* Background Decor */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 5vw' }}>
        
        {/* Statistics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', background: '#fff', borderRadius: '40px', padding: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', marginBottom: '100px' }}>
           <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4f46e5' }}>{shop.professionals?.length || 0}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Specialists</div>
           </div>
           <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>24/7</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Care Support</div>
           </div>
           <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>4.9/5</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Patient Rating</div>
           </div>
        </div>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '60px', textAlign: 'center', letterSpacing: '-0.03em' }}>Available Team at this Center</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
          {shop.professionals?.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '40px' }}>
               <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Our specialists are currently moving between hubs. Please check back later.</p>
            </div>
          ) : (
            shop.professionals.map((p) => (
              <article key={p.id} style={{ background: '#fff', borderRadius: '45px', padding: '48px', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', position: 'relative' }}>
                <div style={{ 
                  width: '140px', height: '140px', borderRadius: '45px', 
                  background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', 
                  margin: '0 auto 32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  border: '6px solid #fff',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.05)'
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                  )}
                </div>
                
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>{p.user.name}</h4>
                <p style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Mental Health Specialist</p>
                <div style={{ height: 1, background: '#f5f7ff', margin: '24px 0' }} />
                
                <Link 
                  to="/user/appointment" 
                  state={{ doctorName: p.user.name }}
                  style={{ 
                    display: 'block', padding: '16px', background: '#f8fafc', color: '#1e293b', textDecoration: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '0.95rem', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; }}
                >
                  Book Session
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
