import { useEffect, useState } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'

export default function UserContent() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    userService.listContent()
      .then((data) => {
        if (!mounted) return
        setItems(data || [])
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.response?.data?.error || 'Failed to load content')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  // Icon components (matching Profile.jsx style)
  const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )

  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 5vw 0' }}>
          {/* Header Section (Matching Profile.jsx) */}
          <div className="profile-header fade-in" style={{ padding: 0, marginBottom: 48, background: 'none', border: 'none', boxShadow: 'none' }}>
             <div className="avatar-xl" style={{
               background:'linear-gradient(135deg, #10b981, #3b82f6)', 
               color:'#fff', 
               boxShadow:'0 10px 25px rgba(16, 185, 129, 0.3)',
               width: 80, height: 80, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
               <BookIcon />
             </div>
             <div>
               <div className="row" style={{gap:12, justifyContent:'flex-start', alignItems: 'center'}}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Wellness Library</h1>
                  <span className="kicker" style={{fontSize:'0.75rem', padding:'4px 12px', borderRadius:20, background:'#eef2ff', color:'#4f46e5', fontWeight: 800}}>RESOURCE CENTER</span>
               </div>
               <p className="muted" style={{ fontSize: '1.2rem' }}>
                  Curated clinical expertise and mental health resources at your fingertips.
               </p>
             </div>
          </div>

          <div className="fade-in">
            {loading && (
              <div style={{textAlign:'center', padding: '100px 0'}}>
                <div className="muted" style={{fontSize:'1.1rem'}}>Loading your library...</div>
              </div>
            )}
            
            {error && (
              <div className="premium-card text-center" style={{padding: '40px', border: '1px solid #fee2e2', background: '#fffafb'}}>
                 <div style={{color: '#ef4444', fontWeight: 600}}>{error}</div>
              </div>
            )}
            
            {!loading && !error && items.length === 0 && (
              <div className="premium-card text-center" style={{padding:60, background: '#fff', borderRadius: 32}}>
                 <div style={{fontSize: '3.5rem', marginBottom: 20}}>📚</div>
                 <h3 style={{color: '#1f2937'}}>No resources found yet</h3>
                 <p className="muted">Our clinical team is currently preparing new wellness content for you. Check back soon!</p>
              </div>
            )}
  
            {!loading && !error && items.length > 0 && (
              <div className="grid-2" style={{gap: 40}}>
                {items.map((it) => (
                  <article key={it.id} className="premium-card slide-up" style={{ 
                    display:'flex', 
                    flexDirection:'column', 
                    padding: 0, 
                    overflow: 'hidden',
                    background: '#fff',
                    borderRadius: 32,
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.4s ease'
                  }}>
                    {it.image && (
                      <div style={{width:'100%', height:260, overflow: 'hidden'}}>
                        <img src={it.image} alt={it.title} style={{
                          width:'100%', height:'100%', objectFit:'cover',
                          transition: 'transform 0.5s ease'
                        }} />
                      </div>
                    )}
                    
                    <div style={{padding: 40, display: 'flex', flexDirection: 'column', flex: 1}}>
                      <div style={{display: 'flex', gap: 8, marginBottom: 20}}>
                        <span className="kicker" style={{fontSize:'0.75rem', padding:'6px 14px', borderRadius:20, background:'#f5f3ff', color:'#7c3aed', fontWeight: 800}}>ARTICLE</span>
                        <span className="kicker" style={{fontSize:'0.75rem', padding:'6px 14px', borderRadius:20, background:'#ecfdf5', color:'#10b981', fontWeight: 800}}>WELLNESS</span>
                      </div>
  
                      <h3 style={{ marginBottom: 16, fontSize:'1.75rem', lineHeight: 1.2, color: '#111827', fontWeight: 800 }}>{it.title}</h3>
                      
                      <p className="muted" style={{ 
                        fontSize: '1rem', 
                        lineHeight: 1.7,
                        flex: 1, 
                        whiteSpace: 'pre-line', 
                        overflow:'hidden', 
                        display:'-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient:'vertical',
                        marginBottom: 32
                      }}>
                        {it.body}
                      </p>
  
                      <div style={{
                        marginTop: 'auto', 
                        paddingTop: 32, 
                        borderTop:'1px solid #f1f5f9', 
                        display:'flex', 
                        justifyContent:'space-between', 
                        alignItems:'center'
                      }}>
                         <div style={{display:'flex', alignItems:'center', gap: 12}}>
                           <div style={{width: 40, height: 40, borderRadius: '14px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eef2f6'}}>
                              <UserIcon />
                           </div>
                           <div style={{display: 'flex', flexDirection: 'column'}}>
                              <span style={{fontSize:'0.9rem', fontWeight: 700, color: '#1e293b'}}>MindCare Team</span>
                              <span style={{fontSize:'0.8rem', color: '#94a3b8', display:'flex', alignItems:'center', gap:4}}>
                                 <CalendarIcon /> Resource
                              </span>
                           </div>
                         </div>
                         <button className="btn pill purple" style={{padding:'12px 24px', fontSize:'0.9rem', fontWeight: 700}}>Read Article</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
