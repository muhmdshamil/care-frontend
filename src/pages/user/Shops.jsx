import { useEffect, useState } from 'react'
import { shopService } from '../../services/shop'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'

export default function Shops() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    shopService.listShops()
      .then(data => setShops(data))
      .catch(err => setError('Could not load wellness centers'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div className="loader">Loading Wellness Centers...</div>
     </div>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', 
        padding: '120px 0 100px', 
        color: '#fff', 
        textAlign: 'center',
        borderRadius: '0 0 60px 60px',
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.1)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5vw' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em' }}>Wellness Centers</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
            Discover our partner hospitals and clinics dedicated to providing world-class mental health care and therapy services.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 5vw' }}>
        {error && <div style={{ textAlign: 'center', padding: '40px', background: '#fee2e2', color: '#b91c1c', borderRadius: 24 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {shops.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
               <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🏥</div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>No Centers Available Yet</h3>
               <p style={{ color: '#64748b' }}>Check back soon as we onboard more clinical partners.</p>
            </div>
          ) : (
            shops.map((shop) => (
              <Link 
                key={shop.id} 
                to={`/user/shops/${shop.id}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{ 
                  background: '#fff', 
                  borderRadius: '40px', 
                  padding: '40px', 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(0,0,0,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.02)'; }}
                >
                  <div style={{ 
                    width: '70px', height: '70px', borderRadius: '20px', 
                    background: '#e0e7ff', color: '#4f46e5', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '32px'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18M3 7v1a3 3 0 006 0V4m0 4h6m0-4v4a3 3 0 006 0V4M9 21h6M9 7V4m0 4v13m6-13V4m0 4v13"/></svg>
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', marginBottom: '16px', letterSpacing: '-0.02em' }}>{shop.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px', flex: 1 }}>
                    {shop.description || "A dedicated mental health facility offering comprehensive care and expert consultations."}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '32px', borderTop: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>👨‍⚕️</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{shop.professionals?.length || 0} Specialists</span>
                    </div>
                    <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.9rem' }}>VIEW CENTER →</span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
