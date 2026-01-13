import { useEffect, useState } from 'react'
import { professionalService } from '../../services/professional'
import Footer from '../../components/Footer'

export default function ProDashboard() {
  const [me, setMe] = useState(null)
  const [availForm, setAvailForm] = useState({})
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAvailModal, setShowAvailModal] = useState(false)
  const days = ['mon','tue','wed','thu','fri','sat','sun']

  // Derived metrics
  const totalAppointments = requests.length
  const confirmedCount = requests.filter(r => r.status === 'CONFIRMED').length
  const pendingCount = requests.filter(r => r.status === 'PENDING').length

  useEffect(() => {
    professionalService.me().then((data) => {
      setMe(data)
      const avail = data.professionalProfile?.availability || {}
      const mapped = {}
      days.forEach(d => { mapped[d] = Array.isArray(avail[d]) ? avail[d].join(', ') : '' })
      setAvailForm(mapped)
    })
    professionalService.listRequests().then((data) => setRequests(data))
  }, [])

  const saveAvailability = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const payload = {}
      days.forEach(d => {
        const raw = availForm[d] || ''
        const arr = raw.split(',').map(x => x.trim()).filter(Boolean)
        if (arr.length) payload[d] = arr
      })
      await professionalService.updateAvailability(Object.keys(payload).length ? payload : null)
      const refreshedMe = await professionalService.me()
      setMe(refreshedMe)
      setMsg('Availability updated successfully')
      setTimeout(() => setMsg(''), 3000)
      setShowAvailModal(false)
    } catch (e) {
      setMsg('Failed to save availability')
    }
  }

  const confirm = async (id) => {
    await professionalService.confirmSession(id)
    const refreshed = await professionalService.listRequests()
    setRequests(refreshed)
  }

  const reject = async (id) => {
    await professionalService.rejectSession(id)
    const refreshed = await professionalService.listRequests()
    setRequests(refreshed)
  }

  const sanitizePhone = (p) => String(p || '').replace(/\D+/g, '')

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header / Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        padding: '100px 0 140px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }}></div>
        
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, color: '#a5b4fc', display: 'inline-block', marginBottom: '16px', letterSpacing: '0.1em' }}>PRO COMMAND CENTER</div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.03em' }}>Welcome, {me?.name?.split(' ')[0]}</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Manage your clinical appointments and patient interactions.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setShowAvailModal(true)} className="btn pill purple" style={{ padding: '16px 32px' }}>Update Availability</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div style={{ maxWidth: 1400, margin: '-60px auto 0', padding: '0 5vw', position: 'relative', zIndex: 10 }}>
        
        {/* Glassmorphic Navigation */}
        <div style={{ 
          background: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(20px)',
          padding: '8px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid #fff',
          display: 'flex',
          gap: '8px',
          marginBottom: '40px',
          width: 'fit-content'
        }}>
          {['overview', 'appointments', 'availability'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none',
                background: activeTab === tab ? '#6366f1' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="fade-in">
            {/* Metric Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {[
                { label: 'Total Requests', val: totalAppointments, color: '#6366f1', icon: '📝' },
                { label: 'Confirmed Sessions', val: confirmedCount, color: '#10b981', icon: '✅' },
                { label: 'Pending Approval', val: pendingCount, color: '#f59e0b', icon: '⏳' },
              ].map((m, i) => (
                <div key={i} className="premium-card" style={{ background: '#fff', padding: '32px', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>{m.label}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e1b4b' }}>{m.val}</div>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>{m.icon}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
              {/* Identity & Bio */}
              <div className="premium-card" style={{ background: '#fff', padding: '40px', borderRadius: '40px', display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{ 
                  width: '160px', height: '160px', borderRadius: '45px', 
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '3.5rem', fontWeight: 900,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)'
                }}>
                  {me?.professionalProfile?.image ? (
                    <img src={me.professionalProfile.image} alt={me.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : me?.name?.[0]}
                </div>
                <div>
                   <h2 style={{ fontSize: '2.25rem', color: '#111827', margin: '0 0 8px', fontWeight: 900 }}>{me?.name}</h2>
                   <p className="muted" style={{ marginBottom: '16px', fontWeight: 500 }}>{me?.email}</p>
                   <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '500px' }}>
                     {me?.professionalProfile?.bio || "Expert in psychiatric care and clinical psychological interventions."}
                   </p>
                </div>
              </div>

              {/* Sidebar Quick Look */}
              <div className="premium-card" style={{ background: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Recent Activity</h3>
                 <div style={{ display: 'grid', gap: '16px' }}>
                   {requests.slice(0, 3).map((r, i) => (
                     <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.status === 'CONFIRMED' ? '#10b981' : '#f59e0b' }}></div>
                        <div style={{ fontSize: '0.9rem' }}>
                          <span style={{ fontWeight: 700 }}>{r.name}</span> requested <span style={{ color: '#6366f1', fontWeight: 600 }}>{r.service}</span>
                        </div>
                     </div>
                   ))}
                   {requests.length === 0 && <p className="muted" style={{ fontSize: '0.9rem' }}>No recent activity to show.</p>}
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: '#1e1b4b' }}>Clinical Appointments</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
               {requests.length === 0 ? (
                 <div className="premium-card center" style={{ background: '#fff', padding: '60px', color: '#64748b' }}>No active appointment requests found.</div>
               ) : (
                 requests.map(r => (
                   <div key={r.id} className="premium-card" style={{ background: '#fff', padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
                      <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: r.user?.results?.length ? '1px solid #f1f5f9' : 'none' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, auto))', gap: '40px', alignItems: 'center' }}>
                            <div>
                               <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Patient</div>
                               <div style={{ fontWeight: 800, color: '#111827' }}>{r.name}</div>
                            </div>
                            <div>
                               <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Service</div>
                               <div style={{ fontWeight: 700, color: '#6366f1' }}>{r.service}</div>
                            </div>
                            <div>
                               <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
                               <div style={{ fontWeight: 600 }}>{r.date} <span style={{ opacity: 0.5 }}>•</span> {r.time}</div>
                            </div>
                            <div>
                               <span style={{ 
                                 padding: '6px 14px', 
                                 borderRadius: '10px', 
                                 background: r.status === 'CONFIRMED' ? '#ecfdf5' : r.status === 'REJECTED' ? '#fef2f2' : '#f3f4f6',
                                 color: r.status === 'CONFIRMED' ? '#059669' : r.status === 'REJECTED' ? '#dc2626' : '#64748b',
                                 fontSize: '0.75rem',
                                 fontWeight: 900
                               }}>
                                 {r.status}
                               </span>
                            </div>
                         </div>
                         <div style={{ display: 'flex', gap: '10px' }}>
                           {r.status === 'PENDING' && (
                             <>
                               <button onClick={() => reject(r.id)} className="btn outline" style={{ padding: '10px 20px', fontSize: '0.8rem', borderColor: '#f1f5f9' }}>Decline</button>
                               <button onClick={() => confirm(r.id)} className="btn pill purple" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>Accept</button>
                             </>
                           )}
                         </div>
                      </div>

                      {/* Clinical Medical Footprint Section */}
                      {r.user?.results?.length > 0 && (
                        <div style={{ padding: '24px 32px', background: '#fcfcfd' }}>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.1rem' }}>🧬</span> Patient Clinical Assessment History
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {r.user.results.map((tr, idx) => (
                              <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #eef2f6' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{tr.type}</div>
                                    <div style={{ background: '#f5f3ff', color: '#6366f1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>Score: {tr.score}</div>
                                 </div>
                                 <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>Completed {new Date(tr.createdAt).toLocaleDateString()}</div>
                                 
                                 {/* Answer Details */}
                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {tr.data?.answers?.map((ans, i) => (
                                      <span key={i} title={`Question ${i+1}`} style={{ padding: '4px 8px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.7rem', color: '#4b5563', border: '1px solid #f1f5f9' }}>
                                        A{i+1}: {ans}
                                      </span>
                                    ))}
                                 </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>
                 ))
               )}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="fade-in premium-card" style={{ background: '#fff', padding: '40px', borderRadius: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <div>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Manage Schedule</h2>
                 <p className="muted">Set the specific slots where you are available for clinical consultations.</p>
               </div>
               <button onClick={() => setShowAvailModal(true)} className="btn pill purple" style={{ padding: '14px 28px' }}>Edit Time Slots</button>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
               {days.map(d => (
                 <div key={d} style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6366f1', marginBottom: '12px' }}>{d}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(me?.professionalProfile?.availability?.[d] || []).map((slot, i) => (
                        <div key={i} style={{ background: 'white', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #eef2f6' }}>{slot}</div>
                      ))}
                      {(me?.professionalProfile?.availability?.[d] || []).length === 0 && <span className="muted" style={{ fontSize: '0.75rem' }}>No slots set</span>}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>

      {showAvailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '20px' }}>
           <div className="premium-card fade-in" style={{ width: 'min(700px, 100%)', background: '#fff', padding: '40px', borderRadius: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <h2 style={{ margin: 0, fontWeight: 900 }}>Edit Availability</h2>
                 <button onClick={() => setShowAvailModal(false)} className="btn" style={{ background: '#f1f5f9', border: 'none', color: '#64748b' }}>Close</button>
              </div>
              <p className="muted" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>Enter comma-separated time slots for each day (e.g., 09:00, 10:30, 14:00).</p>
              <form onSubmit={saveAvailability} style={{ display: 'grid', gap: '16px' }}>
                 {days.map(d => (
                   <div key={d} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '20px' }}>
                      <label style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', color: '#1e1b4b' }}>{d}</label>
                      <input 
                        value={availForm[d]} 
                        onChange={(e) => setAvailForm({...availForm, [d]: e.target.value})}
                        style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid #eef2f6', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
                        placeholder="e.g. 09:00, 14:00"
                      />
                   </div>
                 ))}
                 <button type="submit" className="btn pill purple" style={{ marginTop: '20px', height: '60px', fontSize: '1rem' }}>Save Availability Schedule</button>
              </form>
           </div>
        </div>
      )}

      {msg && <div style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#10b981', color: 'white', padding: '16px 32px', borderRadius: '20px', fontWeight: 800, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)', zIndex: 1100 }}>{msg}</div>}
      
      <Footer />
    </div>
  )
}