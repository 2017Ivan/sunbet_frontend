// services/bookingcode/bookingCodeService.js
import api from '../api.js'
import { useSelectionFormatter } from '../composables/useSelectionFormatter.js'

const bookingCodeService = {
  /**
   * Create a new booking code from current bet slip selections
   * @param {Array} selections - Array of selection objects
   * @returns {Promise} - { success, data: { bookingCode, expiresAt, expiresInHours } }
   */
  async createBookingCode(selections) {
    try {
      const { formatForBackend } = useSelectionFormatter()
      
      // Format selections for backend using composable
      const formattedSelections = formatForBackend(selections)

      const response = await api.post('/booking-codes/create', { selections: formattedSelections })
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Create booking code error:', error)
      
      let errorMessage = 'Failed to create booking code'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        data: error.response?.data
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
      const { formatForFrontend } = useSelectionFormatter()
      
      const response = await api.get(`/booking-codes/${code}/load`)
      
      // Format selections for frontend using composable
      if (response.data?.data?.selections) {
        response.data.data.selections = formatForFrontend(response.data.data.selections)
      }
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Load booking code error:', error)
      
      let errorMessage = 'Failed to load booking code'
      
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.status === 404) {
          errorMessage = 'Booking code not found'
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid booking code'
        } else if (error.response.status === 410 || error.response.status === 403) {
          errorMessage = 'Booking code has expired (5 hours limit)'
        }
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection'
      }
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        data: error.response?.data
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
      
      let errorMessage = 'Failed to check booking code'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        data: error.response?.data
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