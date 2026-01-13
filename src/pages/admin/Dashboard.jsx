import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin'
import { shopService } from '../../services/shop'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Shop states
  const [shopName, setShopName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerPassword, setOwnerPassword] = useState('')
  const [shopDesc, setShopDesc] = useState('')
  const [shopMessage, setShopMessage] = useState('')

  useEffect(() => {
    adminService.dashboard().then((data) => setStats(data))
  }, [])

  const createShop = async (e) => {
    e.preventDefault()
    setLoading(true)
    setShopMessage('')
    try {
      await shopService.createShop({ 
        name: shopName, 
        ownerEmail, 
        ownerName, 
        ownerPassword, 
        description: shopDesc 
      })
      setShopName('')
      setOwnerEmail('')
      setOwnerName('')
      setOwnerPassword('')
      setShopDesc('')
      setShopMessage('Shop created successfully!')
      setTimeout(() => setShopMessage(''), 3000)
    } catch (err) {
      setShopMessage('Failed to create shop: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  const createContent = async (e) => {
    e.preventDefault()
    if (!title || !body) return
    setLoading(true)
    setMessage('')
    try {
      await adminService.createContent({ title, body })
      setTitle('')
      setBody('')
      setMessage('Content published successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage('Failed to create content')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats?.users || 0, icon: 'Users', color: '#6366f1' },
    { label: 'Professionals', value: stats?.professionals || 0, icon: 'Briefcase', color: '#8b5cf6' },
    { label: 'Community Posts', value: stats?.posts || 0, icon: 'MessageSquare', color: '#ec4899' },
    { label: 'System Health', value: '100%', icon: 'Activity', color: '#10b981' },
  ]

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Admin Console</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '8px' }}>Manage your platform resources and monitor activity.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Live Updates</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ 
              background: '#fff', 
              padding: '32px', 
              borderRadius: '24px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: card.color }}></div>
              <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{card.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          {/* Main Action Area */}
          <div style={{ display: 'grid', gap: '40px' }}>
            <div style={{ background: '#fff', borderRadius: '32px', padding: '48px', border: '1px solid #f1f5f9', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Create New Shop</h2>
                <p style={{ color: '#64748b' }}>Register a new shop and assign an owner.</p>
              </div>

              {shopMessage && (
                <div style={{ 
                  padding: '16px 24px', 
                  background: shopMessage.includes('failed') ? '#fef2f2' : '#f0fdf4', 
                  color: shopMessage.includes('failed') ? '#991b1b' : '#166534', 
                  borderRadius: '16px', 
                  marginBottom: '24px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: shopMessage.includes('failed') ? '1px solid #fee2e2' : '1px solid #dcfce7'
                }}>
                  {shopMessage}
                </div>
              )}

              <form onSubmit={createShop} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Shop Name</label>
                  <input 
                    value={shopName} 
                    onChange={(e) => setShopName(e.target.value)} 
                    placeholder="e.g. Wellness Center" 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Owner Email</label>
                  <input 
                    value={ownerEmail} 
                    onChange={(e) => setOwnerEmail(e.target.value)} 
                    placeholder="owner@example.com" 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Owner Name (New User)</label>
                  <input 
                    value={ownerName} 
                    onChange={(e) => setOwnerName(e.target.value)} 
                    placeholder="John Doe" 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Owner Password (New User)</label>
                  <input 
                    type="password"
                    value={ownerPassword} 
                    onChange={(e) => setOwnerPassword(e.target.value)} 
                    placeholder="••••••••" 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gap: '8px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Description</label>
                  <textarea 
                    value={shopDesc} 
                    onChange={(e) => setShopDesc(e.target.value)} 
                    placeholder="Brief description of the shop..." 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', minHeight: '100px' }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ gridColumn: 'span 2', padding: '18px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                >
                  {loading ? 'Creating...' : 'Create Shop'}
                </button>
              </form>
            </div>

            <div style={{ background: '#fff', borderRadius: '32px', padding: '48px', border: '1px solid #f1f5f9', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Publish New Content</h2>
                <p style={{ color: '#64748b' }}>Create educational articles or clinical resource updates for users.</p>
              </div>

              {message && (
                <div style={{ 
                  padding: '16px 24px', 
                  background: message.includes('failed') ? '#fef2f2' : '#f0fdf4', 
                  color: message.includes('failed') ? '#991b1b' : '#166534', 
                  borderRadius: '16px', 
                  marginBottom: '24px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: message.includes('failed') ? '1px solid #fee2e2' : '1px solid #dcfce7'
                }}>
                  {message}
                </div>
              )}

              <form onSubmit={createContent} style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Content Title</label>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Managing Burnout in the Workplace" 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Body Content</label>
                  <textarea 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    placeholder="Write the clinical or supportive content here..." 
                    style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', minHeight: '200px', resize: 'vertical', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ flex: 1, padding: '18px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}
                  >
                    {loading ? 'Publishing...' : 'Publish Content'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setTitle(''); setBody(''); }}
                    style={{ padding: '0 32px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Quick Reference */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#1e293b', color: '#fff', borderRadius: '32px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Admin Guidelines</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
                  <span style={{ color: '#818cf8', fontWeight: 900 }}>•</span>
                  <span>Ensure all published content matches clinical standards.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
                  <span style={{ color: '#818cf8', fontWeight: 900 }}>•</span>
                  <span>Review user-generated posts regularly for safety.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
                  <span style={{ color: '#818cf8', fontWeight: 900 }}>•</span>
                  <span>Verify professional certifications before approval.</span>
                </li>
              </ul>
            </div>

            <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#f5f3ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6366f1' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Security Access</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Your session is protected with 256-bit encryption.</p>
              <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'transparent', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>Security Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
