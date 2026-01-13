import { useEffect, useState } from 'react'
import { userService } from '../../services/user'
import { adminService } from '../../services/admin'

export default function AdminContentManager() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const data = await userService.listContent()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startEdit = (item) => setEditing({ ...item })
  const cancelEdit = () => setEditing(null)

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editing?.title?.trim() || !editing?.body?.trim()) return
    setLoading(true)
    setMsg('')
    try {
      await adminService.updateContent(editing.id, { title: editing.title, body: editing.body })
      setMsg('Content updated successfully')
      setEditing(null)
      await load()
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return
    setLoading(true)
    setMsg('')
    try {
      await adminService.deleteContent(id)
      setMsg('Content deleted')
      await load()
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5vw' }}>
        
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: 0 }}>Content Manager</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>Edit or remove existing resources from the platform.</p>
          </div>
          {msg && (
            <div style={{ background: '#f0fdf4', color: '#166534', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid #dcfce7' }}>
              {msg}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {items.map((it) => (
            <div key={it.id} style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              padding: '32px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              {editing?.id === it.id ? (
                <form onSubmit={saveEdit} style={{ display: 'grid', gap: '20px' }}>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                    required
                  />
                  <textarea
                    value={editing.body}
                    onChange={(e) => setEditing((s) => ({ ...s, body: e.target.value }))}
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={cancelEdit} style={{ padding: '12px 24px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', margin: 0 }}>{it.title}</h3>
                    <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>{it.body}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => startEdit(it)} 
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => remove(it.id)} 
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No content pieces found. Start by creating one in the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
