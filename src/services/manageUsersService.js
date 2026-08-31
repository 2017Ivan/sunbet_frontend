// services/manageUsersService.js
import api from './api'

const manageUsersService = {
  /**
   * GET /api/user/all - Get all users with pagination and search (admin only)
   * @param {Object} params - { search, limit, offset }
   */
  async getUsers(params = {}) {
    try {
      const response = await api.get('/user/all', { params })

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch users'
      }
    } catch (error) {
      console.error('Get users error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      }
    }
  },

  /**
   * GET /api/user/:id - Get user by ID (admin only)
   * @param {string} id - User ID
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/user/${id}`)

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'User not found'
      }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      }
    }
  },

  /**
   * GET /api/user/phone/:phone - Get user by phone number (admin only)
   * @param {string} phone - Phone number
   */
  async getUserByPhone(phone) {
    try {
      const response = await api.get(`/user/phone/${phone}`)

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'User not found'
      }
    } catch (error) {
      console.error('Get user by phone error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      }
    }
  },

  /**
   * PATCH /api/user/:id/balance - Adjust user balance (admin only)
   * @param {string} id - User ID
   * @param {string} action - 'add', 'deduct', or 'set'
   * @param {number} amount - Amount to adjust
   */
  async adjustBalance(id, action, amount) {
    try {
      const response = await api.patch(`/user/${id}/balance`, {
        action,
        amount
      })

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Balance updated successfully'
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to update balance'
      }
    } catch (error) {
      console.error('Adjust balance error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update balance'
      }
    }
  },

  /**
   * DELETE /api/user/:id - Delete user (admin only)
   * @param {string} id - User ID
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/user/${id}`)

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'User deleted successfully'
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to delete user'
      }
    } catch (error) {
      console.error('Delete user error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      }
    }
  }
}

export default manageUsersService