import { useEffect, useState } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'

export default function UserProfile() {
  const [me, setMe] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('') // 'success' or 'error'
  
  const initials = (name || 'U').split(' ').filter(Boolean).map(s => s[0]).join('').slice(0,2).toUpperCase()

  useEffect(() => {
    userService.me().then((m) => {
      setMe(m)
      setName(m?.name || '')
      setEmail(m?.email || '')
    })
  }, [])

  const setMessage = (text, type = 'success') => {
    setMsg(text)
    setType(type)
    setTimeout(() => {
      setMsg('')
      setType('')
    }, 4000)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      setLoading(true)
      const updated = await userService.updateMe({ name, email })
      setMe(updated)
      setMessage('Profile updated effectively')
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to update', 'error')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!p1 || !p2) return setMessage('Enter both current and new password', 'error')
    try {
      setLoading(true)
      await userService.changePassword({ currentPassword: p1, newPassword: p2 })
      setP1(''); setP2('')
      setMessage('Security credentials updated')
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to change password', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Modern Icon Set
  const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  const MapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>

  return (
    <>
      <div style={{ background: '#fcfcfd', minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Toast Notification */}
        {msg && (
          <div className="slide-up" style={{
            position:'fixed', top:100, right:30, zIndex:1000,
            background: type === 'error' ? '#fff' : '#fff',
            borderLeft: `5px solid ${type === 'error' ? '#ef4444' : '#10b981'}`,
            color: '#1e293b',
            padding: '16px 24px', borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: type === 'error' ? '#fee2e2' : '#dcfce7', color: type === 'error' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              {type === 'error' ? '!' : '✓'}
            </div>
            {msg}
          </div>
        )}

        {/* Premium Header Banner */}
        <section style={{ 
          position: 'relative',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
          height: '240px',
          borderRadius: '0 0 50px 50px',
          overflow: 'hidden'
        }}>
           <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        </section>

        {/* Content Container */}
        <div style={{ maxWidth: '1200px', margin: '-100px auto 0', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          
          {/* Hero Profile Info */}
          <div className="fade-in" style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>
            <div style={{ 
              width: 160, height: 160, borderRadius: 40, border: '8px solid #fff',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              color: '#fff', fontSize: '3.5rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              {initials}
            </div>
            <div style={{ paddingBottom: 10 }}>
              <h1 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: 4, fontWeight: 800 }}>{name || 'User Profile'}</h1>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ 
                  background: '#eef2ff', color: '#4f46e5', padding: '6px 16px', borderRadius: 99, 
                  fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' 
                }}>
                  {me?.role || 'MEMBER'}
                </span>
                <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
                  <MailIcon /> {email}
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
            
            {/* Left: Account Settings */}
            <div className="premium-card slide-up" style={{ padding: 40, background: '#fff', borderRadius: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>Personal Details</h2>
                    <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>Update your identity and reachability</p>
                  </div>
               </div>

               <form onSubmit={saveProfile} className="form" style={{ gap: 24 }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><UserIcon /></span>
                      <input value={name} onChange={(e)=>setName(e.target.value)} required style={{ padding: '14px 16px 14px 48px', borderRadius: 16, width: '100%', border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><MailIcon /></span>
                      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={{ padding: '14px 16px 14px 48px', borderRadius: 16, width: '100%', border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn pill purple" disabled={loading} style={{ width: '100%', padding: 16, marginTop: 8, fontSize: '1rem' }}>
                    {loading ? 'Processing...' : 'Sync Information'}
                  </button>
               </form>
            </div>

            {/* Right: Security & Activity */}
            <div style={{ display: 'grid', gap: 32 }}>
              
              <div className="premium-card slide-up" style={{ padding: 40, background: '#fff', borderRadius: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldIcon />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>Account Security</h2>
                      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>Manage your password and protection</p>
                    </div>
                 </div>

                 <form onSubmit={changePassword} className="form" style={{ gap: 20 }}>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Current Password</label>
                      <input type="password" value={p1} onChange={(e)=>setP1(e.target.value)} placeholder="••••••••" required style={{ padding: '12px 16px', borderRadius: 14, background: '#f8fafc', border: '1px solid #f1f5f9' }} />
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>New Secure Password</label>
                      <input type="password" value={p2} onChange={(e)=>setP2(e.target.value)} placeholder="Min 6 characters" required minLength={6} style={{ padding: '12px 16px', borderRadius: 14, background: '#f8fafc', border: '1px solid #f1f5f9' }} />
                    </div>
                    <button type="submit" className="btn pill" disabled={loading} style={{ width: '100%', padding: 14, marginTop: 8, background: '#1e293b', color: '#fff', border: 'none' }}>
                      {loading ? 'Securing...' : 'Modify Security Key'}
                    </button>
                 </form>
              </div>

              {/* Quick Summary Card */}
              <div className="premium-card fade-in" style={{ padding: 32, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: 32 }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '1.1rem', opacity: 0.8 }}>Hub Status</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Active</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Verified Member</div>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapIcon />
                    </div>
                  </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
