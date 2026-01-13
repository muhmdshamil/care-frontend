import api from '../api/client'

export const adminService = {
  login(payload) {
    // payload: { email, password }
    return api.post('/admin/login', payload).then(r => r.data)
  },
  seed() {
    return api.post('/admin/seed').then(r => r.data)
  },
  dashboard() {
    return api.get('/admin/dashboard').then(r => r.data)
  },
  createContent({ title, body }) {
    return api.post('/admin/content', { title, body }).then(r => r.data)
  },
  updateContent(id, { title, body }) {
    return api.put(`/admin/content/${id}`, { title, body }).then(r => r.data)
  },
  deleteContent(id) {
    return api.delete(`/admin/content/${id}`).then(r => r.data)
  },
}
