// services/admin/adminDepositService.js
import api from '../api'

const adminDepositService = {
  async getDeposits({ status = 'ALL', search = '', limit = 50, offset = 0 } = {}) {
    try {
      const response = await api.get('/admin/deposits', {
        params: { status, search, limit, offset }
      })
      if (response.data?.data) {
        return { success: true, data: response.data.data }
      }
      return { success: false, message: response.data?.message || 'Failed to load deposits' }
    } catch (error) {
      console.error('Load deposits error:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to load deposits' }
    }
  },

  async createPendingDeposit({ user_id, phone_number, amount, description }) {
    try {
      const response = await api.post('/admin/deposits', { user_id, phone_number, amount, description })
      if (response.data) {
        return { success: true, data: response.data.data, message: response.data.message }
      }
      return { success: false, message: 'Failed to create deposit' }
    } catch (error) {
      console.error('Create deposit error:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to create deposit' }
    }
  },

  async confirmDeposit(id) {
    try {
      const response = await api.patch(`/admin/deposits/${id}/confirm`)
      if (response.data) {
        return { success: true, data: response.data.data, message: response.data.message }
      }
      return { success: false, message: 'Failed to confirm deposit' }
    } catch (error) {
      console.error('Confirm deposit error:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to confirm deposit' }
    }
  },

  async rejectDeposit(id) {
    try {
      const response = await api.patch(`/admin/deposits/${id}/reject`)
      if (response.data) {
        return { success: true, data: response.data.data, message: response.data.message }
      }
      return { success: false, message: 'Failed to reject deposit' }
    } catch (error) {
      console.error('Reject deposit error:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to reject deposit' }
    }
  }
}

export default adminDepositService