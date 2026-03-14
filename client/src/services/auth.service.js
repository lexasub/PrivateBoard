import axios from './api.js'

export const authService = {
  // Get current user info
  async getCurrentUser() {
    const res = await axios.get('/api/auth/me')
    return res.data.user
  },

  // Login user
  async login(username, password) {
    const res = await axios.post('/api/auth/login', { username, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    return user
  },

  // Register user
  async register(username, password) {
    const res = await axios.post('/api/auth/register', { username, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    return user
  },

  // Logout user
  logout() {
    localStorage.removeItem('token')
  },

  // Change password
  async changePassword(currentPassword, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match')
    }
    if (newPassword.length < 4) {
      throw new Error('New password must be at least 4 characters')
    }
    const res = await axios.put('/api/auth/password', { currentPassword, newPassword })
    return res.data
  }
}
