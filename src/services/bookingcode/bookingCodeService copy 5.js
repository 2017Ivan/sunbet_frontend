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
   * Get user's booking codes (AUTHENTICATED)
   * @returns {Promise} - { success, data: bookingCodes[] }
   */
  async getUserBookingCodes() {
    try {
      const response = await api.get('/booking-codes/my')
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Get user booking codes error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load booking codes',
        status: error.response?.status
      }
    }
  },

  /**
   * Get all booking codes (ADMIN only)
   * @param {Object} params - { limit, offset, status, search }
   * @returns {Promise} - { success, data: { total, bookingCodes, pagination } }
   */
  async getAllBookingCodes(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.offset) queryParams.append('offset', params.offset)
      if (params.status) queryParams.append('status', params.status)
      if (params.search) queryParams.append('search', params.search)
      
      const url = `/booking-codes/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await api.get(url)
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Get all booking codes error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load booking codes',
        status: error.response?.status
      }
    }
  },

  /**
   * Update selection score (ADMIN only)
   * @param {string} bookingCodeId - Booking code ID
   * @param {string} matchId - Match ID
   * @param {number} homeScore - Home score
   * @param {number} awayScore - Away score
   * @returns {Promise} - { success, data: updatedBookingCode }
   */
  async updateSelectionScore(bookingCodeId, matchId, homeScore, awayScore) {
    try {
      const response = await api.patch(`/booking-codes/admin/${bookingCodeId}/score`, {
        matchId,
        homeScore,
        awayScore
      })
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Update selection score error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update score',
        status: error.response?.status
      }
    }
  },

  /**
   * Deactivate booking code (ADMIN only)
   * @param {string} bookingCodeId - Booking code ID
   * @returns {Promise} - { success, data: updatedBookingCode }
   */
  async deactivateBookingCode(bookingCodeId) {
    try {
      const response = await api.patch(`/booking-codes/admin/${bookingCodeId}/deactivate`)
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Deactivate booking code error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to deactivate code',
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