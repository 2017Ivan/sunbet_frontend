// services/admin/adminDashboardService.js
import api from '../api'

const adminDashboardService = {
  /**
   * GET /api/admin/dashboard - data halisi za admin dashboard
   * @param {Object} params - { limit }
   */
  async getDashboard(params = {}) {
    try {
      const response = await api.get('/admin/dashboard', { params })

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch dashboard data'
      }
    } catch (error) {
      console.error('Get dashboard error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard data'
      }
    }
  }
}

export default adminDashboardService