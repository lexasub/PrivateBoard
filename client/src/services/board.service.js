import axios from './api.js'

export const boardService = {
  // Get all boards
  async getAllBoards() {
    const res = await axios.get('/api/boards')
    return res.data
  },

  // Get single board
  async getBoard(id) {
    const res = await axios.get(`/api/boards/${id}`)
    return res.data
  },

  // Create board
  async createBoard(name) {
    const res = await axios.post('/api/boards', { name })
    return res.data
  },

  // Update board
  async updateBoard(id, data) {
    const res = await axios.put(`/api/boards/${id}`, data)
    return res.data
  },

  // Delete board
  async deleteBoard(id) {
    const res = await axios.delete(`/api/boards/${id}`)
    return res.data
  },

  // Get board shares
  async getBoardShares(id) {
    const res = await axios.get(`/api/boards/${id}/shares`)
    return res.data
  },

  // Share board with user
  async shareBoard(id, userId, permissionLevel) {
    const res = await axios.post(`/api/boards/${id}/shares`, {
      userId,
      permissionLevel
    })
    return res.data
  },

  // Remove share
  async removeShare(id, userId) {
    const res = await axios.delete(`/api/boards/${id}/shares/${userId}`)
    return res.data
  },

  // Get share links
  async getShareLinks(id) {
    const res = await axios.get(`/api/boards/${id}/share-links`)
    return res.data
  },

  // Create share link
  async createShareLink(id, permissionLevel, expiresDays) {
    const res = await axios.post(`/api/boards/${id}/share-link`, {
      permissionLevel,
      expiresDays
    })
    return res.data
  },

  // Delete share link
  async deleteShareLink(id, tokenId) {
    const res = await axios.delete(`/api/boards/${id}/share-links/${tokenId}`)
    return res.data
  },

  // Get share link info (public)
  async getShareLinkInfo(token) {
    const res = await axios.get(`/api/share/${token}`)
    return res.data
  },

  // Save board via share link (public)
  async saveViaShareLink(token, data) {
    const res = await axios.put(`/api/share/${token}`, data)
    return res.data
  },

  // Admin: Get all users
  async getAllUsers() {
    const res = await axios.get('/api/admin/users')
    return res.data
  },

  // Admin: Get all boards
  async getAllBoardsAdmin() {
    const res = await axios.get('/api/admin/boards')
    return res.data
  },

  // Admin: Update user role
  async updateUserRole(userId, role) {
    const res = await axios.put(`/api/admin/users/${userId}/role`, { role })
    return res.data
  },

  // Admin: Delete user
  async deleteUser(userId) {
    const res = await axios.delete(`/api/admin/users/${userId}`)
    return res.data
  },

  // Admin: Delete board
  async deleteBoardAdmin(boardId) {
    const res = await axios.delete(`/api/admin/boards/${boardId}`)
    return res.data
  }
}
