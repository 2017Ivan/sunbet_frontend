// services/bets/betService.js
import api from '../api'
import { useSelectionFormatter } from '../composables/useSelectionFormatter'

/**
 * Bet Service - Handles all betting operations
 * Integrated with backend API
 */

const BET_ENDPOINTS = {
  PLACE_BET: '/bets/place',                    // POST /api/bets/place
  PLACE_MULTIPLE: '/bets/place-multiple',      // POST /api/bets/place-multiple
  USER_BETS: '/bets',                          // GET /api/bets
  BET_STATS: '/bets/stats/my',                 // GET /api/bets/stats/my
  GET_BET_BY_ID: (betId) => `/bets/${betId}`,  // GET /api/bets/:id
  CANCEL_BET: (betId) => `/bets/admin/bets/${betId}/cancel`, // PATCH /api/bets/admin/bets/:id/cancel
  UNCHECKED_WINS: '/bets/unchecked-wins',      // GET /api/bets/unchecked-wins
  BETS_BY_BOOKING_CODE: (bookingCodeId) => `/bets/booking-code/${bookingCodeId}`, // GET /api/bets/booking-code/:bookingCodeId
  BETS_BY_SELECTION: (selectionId) => `/bets/selection/${selectionId}`, // GET /api/bets/selection/:selectionId
}

/**
 * Place a new bet
 * @param {string} bookingCodeId - ID of the booking code
 * @param {string} selectionId - ID of the selection
 * @param {number} stake - Stake amount
 * @returns {Promise<Object>} Placed bet data
 */
export const placeBet = async (bookingCodeId, selectionId, stake) => {
  try {
    const payload = {
      bookingCodeId,
      selectionId,
      stake: parseFloat(stake)
    }

    console.log('📤 Placing bet payload:', payload)

    const response = await api.post(BET_ENDPOINTS.PLACE_BET, payload)

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Place bet error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to place bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Place multiple bets using same booking code
 * @param {string} bookingCodeId - ID of the booking code
 * @param {Array} selections - Array of { selectionId, stake }
 * @returns {Promise<Object>} Result with placed bets and errors
 */
export const placeMultipleBets = async (bookingCodeId, selections) => {
  try {
    const payload = {
      bookingCodeId,
      selections
    }

    const response = await api.post(BET_ENDPOINTS.PLACE_MULTIPLE, payload)

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Place multiple bets error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to place bets',
      error: error.response?.data || error.message
    }
  }
}
/**
 * Place a bet from slip (auto-creates booking code if needed)
 */
export const placeBetFromSlip = async (selections, stake, bookingCodeId = null, selectionId = null) => {
  try {
    const formattedSelections = selections.map(sel => ({
      matchId: sel.matchId,
      matchName: sel.matchName || sel.match || 'Match',
      selectionType: sel.selectionType || 'HOME',
      selectionValue: sel.selectionValue || sel.pick || '1',
      odds: parseFloat(sel.odds) || 1
    }))

    const payload = {
      selections: formattedSelections,
      stake: parseFloat(stake)
    }

    if (bookingCodeId) payload.bookingCodeId = bookingCodeId
    if (selectionId) payload.selectionId = selectionId

    console.log('📤 Placing bet payload:', payload)

    const response = await api.post(BET_ENDPOINTS.PLACE_BET, payload)

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Place bet error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to place bet',
      error: error.response?.data || error.message
    }
  }
}
/**
 * Get user's bet history
 * @param {Object} options - Query options
 * @returns {Promise<Object>} User bets
 */
export const getUserBets = async (options = {}) => {
  try {
    const { status, result, limit = 50, offset = 0 } = options
    
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (result) params.append('result', result)
    params.append('limit', limit)
    params.append('offset', offset)
    
    const url = params.toString() 
      ? `${BET_ENDPOINTS.USER_BETS}?${params.toString()}`
      : BET_ENDPOINTS.USER_BETS
      
    const response = await api.get(url)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get user bets error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bets',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get user bet statistics
 * @returns {Promise<Object>} Bet stats
 */
export const getUserBetStats = async () => {
  try {
    const response = await api.get(BET_ENDPOINTS.BET_STATS)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bet stats error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load statistics',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get bet by ID
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} Bet data
 */
export const getBetById = async (betId) => {
  try {
    const response = await api.get(BET_ENDPOINTS.GET_BET_BY_ID(betId))
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bet by ID error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get bets by booking code ID
 * @param {string} bookingCodeId - Booking code ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Bets data
 */
export const getBetsByBookingCode = async (bookingCodeId, options = {}) => {
  try {
    const { limit = 50, offset = 0 } = options
    const params = new URLSearchParams()
    params.append('limit', limit)
    params.append('offset', offset)
    
    const url = `${BET_ENDPOINTS.BETS_BY_BOOKING_CODE(bookingCodeId)}?${params.toString()}`
    const response = await api.get(url)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bets by booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bets',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get bets by selection ID
 * @param {string} selectionId - Selection ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Bets data
 */
export const getBetsBySelection = async (selectionId, options = {}) => {
  try {
    const { limit = 50, offset = 0 } = options
    const params = new URLSearchParams()
    params.append('limit', limit)
    params.append('offset', offset)
    
    const url = `${BET_ENDPOINTS.BETS_BY_SELECTION(selectionId)}?${params.toString()}`
    const response = await api.get(url)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bets by selection error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bets',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Cancel a bet
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} Cancelled bet data
 */
export const cancelBet = async (betId) => {
  try {
    const response = await api.patch(BET_ENDPOINTS.CANCEL_BET(betId))
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Cancel bet error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get unchecked winning bets
 * @returns {Promise<Object>} Unchecked wins
 */
export const getUncheckedWins = async () => {
  try {
    const response = await api.get(BET_ENDPOINTS.UNCHECKED_WINS)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get unchecked wins error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load win notifications',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Mark winning notification as sent
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} Result
 */
export const markWinningNotified = async (betId) => {
  try {
    const response = await api.patch(`/bets/${betId}/mark-notified`)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Mark winning notified error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update notification status',
      error: error.response?.data || error.message
    }
  }
}

// Export all functions as default object
export default {
  placeBet,
  placeMultipleBets,
  placeBetFromSlip,
  getUserBets,
  getUserBetStats,
  getBetById,
  getBetsByBookingCode,
  getBetsBySelection,
  cancelBet,
  getUncheckedWins,
  markWinningNotified
}