import { useEffect, useState } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'

export default function Professionals() {
  const [pros, setPros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    userService.listProfessionalsPublic()
      .then(data => {
        if (!mounted) return
        setPros(data || [])
      })
      .catch(e => {
        if (!mounted) return
        setError('Failed to load professional profiles')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  // Professional Icon
  const ProIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #2a1763 0%, #1e1250 100%), url("/images/banner/4.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '160px 0', 
        color: '#fff',
        textAlign: 'center',
        borderRadius: '0 0 80px 80px',
        overflow: 'hidden',
        marginBottom: '80px'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '0 5vw' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em', lineHeight: 1 }}>Meet Our Expert Doctors</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
            Our world-class team of psychiatrists and psychologists are dedicated to providing evidence-based, empathetic care for your mental well-being.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 5vw' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="muted" style={{ fontSize: '1.25rem' }}>Loading specialist profiles...</div>
          </div>
        )}

        {error && (
          <div className="premium-card text-center" style={{ padding: '60px', background: '#fff', borderRadius: 32 }}>
            <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.2rem' }}>{error}</div>
            <button onClick={() => window.location.reload()} className="btn purple pill" style={{ marginTop: 24 }}>Try Again</button>
          </div>
        )}

        {!loading && !error && pros.length === 0 && (
          <div className="premium-card text-center" style={{ padding: '80px', background: '#fff', borderRadius: '40px' }}>
             <div style={{ fontSize: '4rem', marginBottom: '24px' }}>👨‍⚕️</div>
             <h3 style={{ color: '#111827', fontSize: '2rem', fontWeight: 800 }}>Specialists Onboarding</h3>
             <p className="muted" style={{ fontSize: '1.1rem' }}>We are currently verifying new clinical experts to join our hub. Please check back shortly.</p>
          </div>
        )}

        {!loading && !error && pros.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
            {pros.map((p) => (
              <article key={p.id} className="premium-card slide-up" style={{ 
                background: '#fff', 
                borderRadius: '40px', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <div style={{ 
                  width: '160px', 
                  height: '160px', 
                  borderRadius: '45px', 
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)'
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ProIcon />
                  )}
                </div>

                <div style={{ background: '#f5f3ff', color: '#6366f1', padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {p.shopName ? p.shopName.toUpperCase() : 'CLINICAL EXPERT'}
                </div>

                <h3 style={{ fontSize: '1.75rem', color: '#111827', marginBottom: '16px', fontWeight: 900 }}>{p.name}</h3>
                
                <p className="muted" style={{ 
                  fontSize: '1rem', 
                  lineHeight: 1.7, 
                  marginBottom: '32px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {p.bio || "Specializing in holistic mental health care and personalized therapy sessions to help you find balance and clarity."}
                </p>

                <div style={{ width: '100%', paddingTop: '32px', borderTop: '1px solid #f1f5f9' }}>
                   <Link 
                     to="/user/appointment" 
                     state={{ doctorName: p.name }}
                     className="btn pill purple" 
                     style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '16px 0', fontSize: '1rem', fontWeight: 800 }}
                   >
                      Book Consultation
                   </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
