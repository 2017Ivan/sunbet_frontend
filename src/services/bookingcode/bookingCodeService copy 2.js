// services/bookingcode/bookingcodeService.js
import api from '../api.js'

const bookingCodeService = {
  /**
   * Create a new booking code from current bet slip selections
   * @param {Array} selections - Array of selection objects
   * @returns {Promise} - { success, data: { bookingCode, expiresAt, expiresInHours } }
   */
  async createBookingCode(selections) {
    try {
      const response = await api.post('/booking-codes/create', { selections })
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Create booking code error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create booking code',
        status: error.response?.status
      }
    }
  },

  /**
   * Load a booking code to get its selections
   * @param {string} code - The booking code string
   * @returns {Promise} - { success, data: { selections, expiresAt, createdAt } }
   */
  async loadBookingCode(code) {
    try {
      const response = await api.get(`/booking-codes/${code}/load`)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Load booking code error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load booking code',
        status: error.response?.status
      }
    }
  },

  /**
   * Check if a booking code exists and is active
   * @param {string} code - The booking code string
   * @returns {Promise} - { success, data: { exists, isActive, isExpired, expiresAt, selectionsCount } }
   */
  async checkBookingCode(code) {
    try {
      const response = await api.get(`/booking-codes/${code}/check`)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Check booking code error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check booking code',
        status: error.response?.status
      }
    }
  },

  /**
   * Validate a booking code format (6 characters alphanumeric)
   */
  validateCodeFormat(code) {
    if (!code) return { valid: false, error: 'Code is required' }
    const cleanCode = code.trim().toUpperCase()
    if (cleanCode.length !== 6) {
      return { valid: false, error: 'Code must be exactly 6 characters' }
    }
    if (!/^[A-Z0-9]{6}$/.test(cleanCode)) {
      return { valid: false, error: 'Code must contain only letters and numbers' }
    }
    return { valid: true, code: cleanCode }
  }
}

export default bookingCodeService