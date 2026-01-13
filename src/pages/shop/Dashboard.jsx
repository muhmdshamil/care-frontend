import { useEffect, useState } from 'react'
import { shopService } from '../../services/shop'

export default function ShopOwnerDashboard() {
  const [shop, setShop] = useState(null)
  const [messages, setMessages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [opMessage, setOpMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('team') // team, appointments, inquiries
  
  // New professional states
  const [proName, setProName] = useState('')
  const [proEmail, setProEmail] = useState('')
  const [proPass, setProPass] = useState('')
  const [proBio, setProBio] = useState('')
  const [proImage, setProImage] = useState('')
  
  // Edit professional states
  const [editingPro, setEditingPro] = useState(null)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editImage, setEditImage] = useState('')

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isEditUpload, setIsEditUpload] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [shopData, msgData, appData] = await Promise.all([
        shopService.myShop(),
        shopService.listMessages(),
        shopService.listAppointments()
      ])
      setShop(shopData)
      setMessages(msgData)
      setAppointments(appData)
    } catch (err) {
      setOpMessage({ text: 'Unable to reach the server. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 2MB.")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (isEditUpload) {
        setEditImage(reader.result)
      } else {
        setProImage(reader.result)
      }
      setShowUploadModal(false)
    }
    reader.readAsDataURL(file)
  }

  const addProfessional = async (e) => {
    e.preventDefault()
    setLoading(true)
    setOpMessage(null)
    try {
      await shopService.addProfessional({
        name: proName,
        email: proEmail,
        password: proPass,
        bio: proBio,
        image: proImage
      })
      
      setProName('')
      setProEmail('')
      setProPass('')
      setProBio('')
      setProImage('')
      setOpMessage({ text: 'Specialist onboarded successfully!', type: 'success' })
      loadData() 
      setTimeout(() => setOpMessage(null), 6000)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Validation failed.'
      setOpMessage({ text: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const updateProfessional = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await shopService.updateProfessional(editingPro.id, {
        name: editName,
        bio: editBio,
        image: editImage
      })
      setOpMessage({ text: 'Specialist updated successfully!', type: 'success' })
      setEditingPro(null)
      loadData()
      setTimeout(() => setOpMessage(null), 6000)
    } catch (err) {
      setOpMessage({ text: 'Update failed.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleWA = (phone, name) => {
    if (!phone) return alert('No phone number provided')
    const cleanPhone = phone.replace(/\D/g, '')
    const msg = encodeURIComponent(`Hello ${name}, this is MindCare Hub. We received your inquiry and would like to help.`)
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
  }

  const startEdit = (p) => {
    setEditingPro(p)
    setEditName(p.user.name)
    setEditBio(p.bio)
    setEditImage(p.image)
  }

  if (loading && !shop) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.05em' }}>PREPARING WORKSPACE...</div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 4vw' }}>
        
        {/* Modern Header Section */}
        <section style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          borderRadius: '48px', 
          padding: '80px 60px', 
          color: '#fff',
          marginBottom: '48px',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
               <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, border: '1px solid rgba(129, 140, 248, 0.3)' }}>HUB OPERATOR</span>
               <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>ID: {shop?.id}</span>
             </div>
             <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '20px', letterSpacing: '-0.04em', lineHeight: 1 }}>{shop?.name}</h1>
             <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.6, fontWeight: 500, maxWidth: '800px' }}>{shop?.description || "Manage your medical collective and patient services through our integrated ecosystem."}</p>
          </div>

          {/* Quick Metrics Overlay */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '48px', position: 'relative', zIndex: 10 }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#6366f1' }}>{shop?.professionals?.length || 0}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Specialists</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>{appointments?.length || 0}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Appointments</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>{messages?.length || 0}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Inquiries</span>
             </div>
          </div>
          
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        </section>

        {opMessage && (
          <div style={{ 
            padding: '24px 32px', 
            background: opMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', 
            color: opMessage.type === 'error' ? '#991b1b' : '#166534', 
            borderRadius: '28px', 
            marginBottom: '48px',
            border: `1px solid ${opMessage.type === 'error' ? '#fee2e2' : '#dcfce7'}`,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'slideDown 0.4s ease-out'
          }}>
            <style>{`@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
            <span>{opMessage.type === 'error' ? '🚫' : '✨'}</span>
            {opMessage.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', background: '#fff', padding: '8px', borderRadius: '24px', width: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
           {['team', 'appointments', 'inquiries'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               style={{ 
                 padding: '14px 28px', borderRadius: '18px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: '0.2s',
                 background: activeTab === tab ? '#1e293b' : 'transparent',
                 color: activeTab === tab ? '#fff' : '#64748b'
               }}
             >
               {tab.toUpperCase()}
             </button>
           ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'team' ? '1.1fr 0.9fr' : '1fr', gap: '48px' }}>
          
          <div style={{ display: 'grid', gap: '48px' }}>
            {activeTab === 'team' && (
              <div style={{ background: '#fff', borderRadius: '40px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '40px' }}>Clinical Team</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                  {shop?.professionals?.map((p) => (
                    <div key={p.id} style={{ padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9', background: '#f8fafc', position: 'relative' }}>
                       <div style={{ width: 100, height: 100, borderRadius: 30, overflow: 'hidden', background: '#e2e8f0', marginBottom: 20 }}>
                          {p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍⚕️</div>}
                       </div>
                       <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{p.user.name}</h4>
                       <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 16 }}>{p.user.email}</p>
                       <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.bio || "No bio available."}</p>
                       <button 
                         onClick={() => startEdit(p)}
                         style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', color: '#6366f1', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                       >
                         Edit Specialist
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div style={{ background: '#fff', borderRadius: '40px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '40px' }}>System Appointments</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '20px', borderRadius: '16px 0 0 16px', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Patient</th>
                        <th style={{ padding: '20px', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Service</th>
                        <th style={{ padding: '20px', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Specialist</th>
                        <th style={{ padding: '20px', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Date/Time</th>
                        <th style={{ padding: '20px', borderRadius: '0 16px 16px 0', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '24px 20px' }}>
                             <div style={{ fontWeight: 800, color: '#0f172a' }}>{a.name}</div>
                             <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.email}</div>
                          </td>
                          <td style={{ padding: '24px 20px', color: '#6366f1', fontWeight: 700 }}>{a.service}</td>
                          <td style={{ padding: '24px 20px', color: '#4b5563', fontWeight: 600 }}>
                            {shop?.professionals?.find(p => p.userId === a.professionalId)?.user?.name || "Unassigned"}
                          </td>
                          <td style={{ padding: '24px 20px' }}>
                             <div style={{ fontWeight: 700 }}>{a.date}</div>
                             <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{a.time}</div>
                          </td>
                          <td style={{ padding: '24px 20px' }}>
                             <span style={{ 
                               padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900,
                               background: a.status === 'CONFIRMED' ? '#f0fdf4' : a.status === 'PENDING' ? '#fffbeb' : '#fef2f2',
                               color: a.status === 'CONFIRMED' ? '#16a34a' : a.status === 'PENDING' ? '#d97706' : '#dc2626'
                             }}>
                               {a.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>No appointments yet.</div>}
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div style={{ background: '#fff', borderRadius: '40px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '40px' }}>Support Inquiries</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ padding: '32px', borderRadius: '32px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>{m.subject}</div>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                             <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</span>
                             <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>•</span>
                             <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{m.email}</span>
                          </div>
                          <p style={{ color: '#4b5563', lineHeight: 1.6, maxWidth: 800 }}>{m.message}</p>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleWA(m.phone, m.name)}
                            style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 16, padding: '12px 24px', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}
                          >
                            WhatsApp Reply
                          </button>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeTab === 'team' && (
            <div style={{ background: '#fff', borderRadius: '40px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', position: 'sticky', top: '40px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '32px' }}>Authorize New Specialist</h2>
              <form onSubmit={addProfessional} style={{ display: 'grid', gap: '24px' }}>
                <div onClick={() => { setIsEditUpload(false); setShowUploadModal(true); }} style={{ width: 120, height: 120, borderRadius: 40, background: '#f8fafc', border: '2px dashed #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {proImage ? <img src={proImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>⊕</span>}
                </div>
                <input value={proName} onChange={e => setProName(e.target.value)} placeholder="Full Name" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600 }} required />
                <input type="email" value={proEmail} onChange={e => setProEmail(e.target.value)} placeholder="Email Address" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600 }} required />
                <input type="password" value={proPass} onChange={e => setProPass(e.target.value)} placeholder="Initial Password" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600 }} required />
                <textarea value={proBio} onChange={e => setProBio(e.target.value)} placeholder="Background & Bio" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600, minHeight: 120 }} />
                <button type="submit" style={{ padding: '18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)' }}>ONBOARD SPECIALIST</button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Edit Specialist Modal */}
      {editingPro && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '40px', padding: '48px', position: 'relative' }}>
              <button onClick={() => setEditingPro(null)} style={{ position: 'absolute', top: 24, right: 24, background: '#f1f5f9', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer' }}>×</button>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '32px' }}>Edit Specialist</h2>
              <form onSubmit={updateProfessional} style={{ display: 'grid', gap: '24px' }}>
                 <div onClick={() => { setIsEditUpload(true); setShowUploadModal(true); }} style={{ width: 120, height: 120, borderRadius: 40, background: '#f8fafc', border: '2px dashed #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {editImage ? <img src={editImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>⊕</span>}
                 </div>
                 <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full Name" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600 }} required />
                 <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Background & Bio" style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontWeight: 600, minHeight: 120 }} />
                 <button type="submit" style={{ padding: '18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 900, cursor: 'pointer' }}>SAVE CHANGES</button>
              </form>
           </div>
        </div>
      )}

      {/* Shared Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '40px', padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px' }}>Upload Photo</h3>
            <label style={{ display: 'block', padding: '60px 40px', border: '3px dashed #e2e8f0', borderRadius: '32px', cursor: 'pointer' }}>
               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
               <span style={{ fontWeight: 800, color: '#0f172a' }}>Browse Device</span>
               <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <button onClick={() => setShowUploadModal(false)} style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '20px', border: 'none', background: '#f1f5f9', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  )
}
