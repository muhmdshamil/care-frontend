import api from '../api/client'

export const professionalService = {
  register(payload) {
    // { name, email, password, bio }
    return api.post('/professionals/register', payload).then(r => r.data)
  },
  login(payload) {
    // { email, password }
    return api.post('/professionals/login', payload).then(r => r.data)
  },
  me() {
    return api.get('/professionals/me').then(r => r.data)
  },
  updateAvailability(availability) {
    // availability can be array/object or null
    return api.post('/professionals/availability', { availability }).then(r => r.data)
  },
  listRequests() {
    return api.get('/professionals/requests').then(r => r.data)
  },
  confirmSession(id) {
    return api.post(`/professionals/confirm/${id}`).then(r => r.data)
  },
  rejectSession(id) {
    return api.post(`/professionals/reject/${id}`).then(r => r.data)
  },
  createContactMessage(payload) {
    return api.post('/professionals/contact', payload).then(r => r.data)
  },
}
