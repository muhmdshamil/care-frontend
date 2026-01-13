import api from '../api/client'

export const shopService = {
    login(payload) {
        return api.post('/shops/login', payload).then(r => r.data)
    },
    // Admin: create shop
    createShop(payload) {
        // payload: { name, ownerEmail, description }
        return api.post('/shops', payload).then(r => r.data)
    },
    // Public: list shops
    listShops() {
        return api.get('/shops').then(r => r.data)
    },
    // Shop Owner: get my shop
    myShop() {
        return api.get('/shops/my-shop').then(r => r.data)
    },
    // Shop Owner: add professional
    addProfessional(payload) {
        // payload: { name, email, password, bio }
        return api.post('/shops/professionals', payload).then(r => r.data)
    },
    // Public: get specific shop
    getShopById(id) {
        return api.get(`/shops/${id}`).then(r => r.data)
    },
    // Shop Owner: list contact messages
    listMessages() {
        return api.get('/shops/messages/all').then(r => r.data)
    },
    // Shop Owner: update professional
    updateProfessional(id, payload) {
        return api.put(`/shops/professionals/${id}`, payload).then(r => r.data)
    },
    // Shop Owner: list appointments
    listAppointments() {
        return api.get('/shops/appointments/all').then(r => r.data)
    }
}
