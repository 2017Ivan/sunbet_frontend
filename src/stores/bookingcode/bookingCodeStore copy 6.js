// stores/bookingcode/bookingCodeStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bookingCodeService from '../../services/bookingcode/bookingCodeService.js'
import { useBetStore } from '../bets/betStore.js'

export const useBookingCodeStore = defineStore('bookingCode', () => {
  // ---- State ----
  const currentCode = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const loadedSelections = ref([])
  const codeStatus = ref(null)

  // ---- Admin State ----
  const bookingCodes = ref([])
  const totalCodes = ref(0)
  const pagination = ref({
    limit: 20,
    offset: 0,
    hasMore: false
  })

  // ---- Getters ----
  const hasActiveCode = computed(() => {
    if (!currentCode.value) return false
    const now = new Date()
    const expiresAt = new Date(currentCode.value.expiresAt)
    return now < expiresAt
  })

  const codeExpiryTime = computed(() => {
    if (!currentCode.value) return null
    const expiresAt = new Date(currentCode.value.expiresAt)
    const now = new Date()
    const diff = expiresAt - now
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  })

  const canLoadCode = computed(() => {
    return loadedSelections.value.length > 0
  })

  // ---- Actions ----
  
  /**
   * Create a booking code from current bet slip selections
   */
  async function createBookingCodeFromSlip() {
    const betStore = useBetStore()
    
    const selections = betStore.slip.map(item => ({
      matchId: item.matchId,
      matchName: item.matchName || item.match || 'Match',
      pick: item.pick || item.selection || '',
      odds: parseFloat(item.odds) || 0,
      market: item.market || item.marketKey || '1X2'
    }))

    if (selections.length === 0) {
      error.value = 'No selections in bet slip'
      return { success: false, error: 'No selections in bet slip' }
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await bookingCodeService.createBookingCode(selections)
      
      if (result.success) {
        currentCode.value = {
          id: result.data.bookingCode.id,
          code: result.data.bookingCode.code,
          expiresAt: result.data.bookingCode.expiresAt,
          selections: result.data.selections
        }
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message || 'Failed to create booking code'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load a booking code and add selections to bet slip
   */
  async function loadBookingCode(code) {
    const cleanCode = code.trim().toUpperCase()
    isLoading.value = true
    error.value = null
    loadedSelections.value = []

    try {
      const result = await bookingCodeService.loadBookingCode(cleanCode)
      
      if (result.success) {
        loadedSelections.value = result.data.selections || []
        currentCode.value = {
          id: result.data.bookingCode?.id || null,
          code: cleanCode,
          expiresAt: result.data.bookingCode?.expiresAt || result.data.expiresAt,
          selections: loadedSelections.value
        }
        return { 
          success: true, 
          data: result.data,
          message: result.message || 'Booking code loaded successfully'
        }
      } else {
        error.value = result.error
        return { 
          success: false, 
          error: result.error,
          status: result.status
        }
      }
    } catch (err) {
      error.value = err.message || 'Failed to load booking code'
      return { 
        success: false, 
        error: error.value 
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check a booking code status
   */
  async function checkBookingCode(code) {
    const cleanCode = code.trim().toUpperCase()
    isLoading.value = true
    error.value = null

    try {
      const result = await bookingCodeService.checkBookingCode(cleanCode)
      if (result.success) {
        codeStatus.value = result.data
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message || 'Failed to check booking code'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Apply loaded selections to bet slip
   */
  function applyLoadedSelectionsToSlip() {
    const betStore = useBetStore()
    if (loadedSelections.value.length === 0) {
      error.value = 'No selections to apply'
      return false
    }

    betStore.clearSlip()
    loadedSelections.value.forEach(selection => {
      betStore.addToSlip({
        matchId: selection.matchId,
        matchName: selection.matchName || 'Match',
        pick: selection.pick || selection.selectionValue || '',
        odds: parseFloat(selection.odds) || 0,
        market: '1X2',
        marketKey: selection.pick === '1' ? '1' : selection.pick === 'X' ? 'X' : '2',
        type: 'sports'
      })
    })

    loadedSelections.value = []
    return true
  }

  /**
   * Clear current booking code
   */
  function clearBookingCode() {
    currentCode.value = null
    loadedSelections.value = []
    codeStatus.value = null
    error.value = null
  }

  /**
   * Generate a shareable URL with booking code
   */
  function generateShareUrl(code) {
    if (!code) return null
    const baseUrl = window.location.origin
    return `${baseUrl}/booking/${code}`
  }

  /**
   * Copy booking code to clipboard
   */
  async function copyBookingCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      return { success: true, message: 'Code copied to clipboard!' }
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return { success: true, message: 'Code copied to clipboard!' }
      } catch (fallbackErr) {
        document.body.removeChild(textArea)
        return { success: false, error: 'Failed to copy code' }
      }
    }
  }

  // ============================================================
  // ADMIN ACTIONS
  // ============================================================

  /**
   * Fetch all booking codes (ADMIN only)
   */
  async function fetchAllBookingCodes(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      const result = await bookingCodeService.getAllBookingCodes({
        limit: pagination.value.limit,
        offset: pagination.value.offset,
        ...params
      })

      if (result.success) {
        bookingCodes.value = result.data.bookingCodes || []
        totalCodes.value = result.data.total || 0
        pagination.value.hasMore = result.data.pagination?.hasMore || false
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch booking codes'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset and fetch first page (ADMIN)
   */
  async function resetAndFetchAll() {
    pagination.value.offset = 0
    return await fetchAllBookingCodes()
  }

  /**
   * Load next page (ADMIN)
   */
  async function loadNextPage() {
    if (pagination.value.hasMore && !isLoading.value) {
      pagination.value.offset += pagination.value.limit
      return await fetchAllBookingCodes()
    }
    return { success: false, error: 'No more pages' }
  }

  /**
   * Update selection score (ADMIN only)
   */
  async function updateSelectionScore(bookingCodeId, matchId, homeScore, awayScore) {
    isLoading.value = true
    error.value = null

    try {
      const result = await bookingCodeService.updateSelectionScore(
        bookingCodeId,
        matchId,
        homeScore,
        awayScore
      )

      if (result.success) {
        // Update the local list
        const index = bookingCodes.value.findIndex(c => c.id === bookingCodeId)
        if (index !== -1) {
          bookingCodes.value[index] = result.data
        }
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message || 'Failed to update score'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deactivate booking code (ADMIN only)
   */
  async function deactivateBookingCode(bookingCodeId) {
    isLoading.value = true
    error.value = null

    try {
      const result = await bookingCodeService.deactivateBookingCode(bookingCodeId)

      if (result.success) {
        // Update the local list
        const index = bookingCodes.value.findIndex(c => c.id === bookingCodeId)
        if (index !== -1) {
          bookingCodes.value[index] = result.data
        }
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message || 'Failed to deactivate code'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // ---- Reset ----
  function reset() {
    currentCode.value = null
    isLoading.value = false
    error.value = null
    loadedSelections.value = []
    codeStatus.value = null
    bookingCodes.value = []
    totalCodes.value = 0
    pagination.value = {
      limit: 20,
      offset: 0,
      hasMore: false
    }
  }

  return {
    // State
    currentCode,
    isLoading,
    error,
    loadedSelections,
    codeStatus,
    bookingCodes,
    totalCodes,
    pagination,

    // Getters
    hasActiveCode,
    codeExpiryTime,
    canLoadCode,

    // User Actions
    createBookingCodeFromSlip,
    loadBookingCode,
    checkBookingCode,
    applyLoadedSelectionsToSlip,
    clearBookingCode,
    generateShareUrl,
    copyBookingCode,

    // Admin Actions
    fetchAllBookingCodes,
    resetAndFetchAll,
    loadNextPage,
    updateSelectionScore,
    deactivateBookingCode,

    reset
  }
}, {
  persist: {
    key: 'booking-code-store',
    storage: localStorage,
    paths: ['currentCode', 'loadedSelections', 'codeStatus']
  }
})