import api from '../api/client'

export const userService = {
  register(payload) {
    // { name, email, password }
    return api.post('/users/register', payload).then(r => r.data)
  },
  login(payload) {
    // { email, password }
    return api.post('/users/login', payload).then(r => r.data)
  },
  me() {
    return api.get('/users/me').then(r => r.data)
  },
  updateMe(payload) {
    return api.put('/users/me', payload).then(r => r.data)
  },
  changePassword(payload) {
    return api.post('/users/change-password', payload).then(r => r.data)
  },
  listContent() {
    return api.get('/users/content').then(r => r.data)
  },
  createForumPost({ content, anonymous = false }) {
    return api.post('/users/forum', { content, anonymous }).then(r => r.data)
  },
  listForumPosts() {
    return api.get('/users/forum').then(r => r.data)
  },
  saveToolResult({ type, score, data = null }) {
    return api.post('/users/tools/result', { type, score, data }).then(r => r.data)
  },
  myToolResults() {
    return api.get('/users/tools/result').then(r => r.data)
  },
  appointmentNotifications() {
    return api.get('/users/appointments/notifications').then(r => r.data)
  },
  listProfessionalsPublic() {
    return api.get('/professionals/public').then(r => r.data)
  },
  bookAppointment(payload) {
    // { name, phone, email, service, date, time, notes }
    return api.post('/appoinment', payload).then(r => r.data)
  },
  aiChat(messages) {
    return api.post('/ai/chat', { messages }).then(r => r.data)
  },
}
