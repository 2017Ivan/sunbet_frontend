// stores/bets/betStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import betService from '../../services/bets/betService'
import api from '../../services/api'
import { useBookingCodeStore } from '../bookingcode/bookingCodeStore'

export const useBetStore = defineStore('bet', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const slip = ref([])
  const stake = ref(0)
  const isOpen = ref(false)
  const betType = ref('single')
  
  const userBets = ref([])
  const userBetsTotal = ref(0)
  const isLoadingBets = ref(false)
  const betStats = ref(null)
  const isLoadingStats = ref(false)
  
  const isPlacingBet = ref(false)
  const lastPlacedBet = ref(null)
  const placeBetError = ref(null)
  
  const uncheckedWins = ref([])
  const hasUnreadWins = ref(false)

  // ── Auto-refresh state ──────────────────────────────────────────────────
  const lastUpdateTime = ref(Date.now())
  const isAutoRefreshEnabled = ref(true)
  const refreshInterval = ref(30000)

  // ── Computed ──────────────────────────────────────────────────────────────
  const slipCount = computed(() => slip.value.length)
  const totalOdds = computed(() => slip.value.reduce((acc, b) => acc * (b.odds || 1), 1))

  const potentialWin_1 = computed(() => stake.value * (totalOdds.value - 1))
  const tax = computed(() => potentialWin_1.value * 0.12)
  const potentialWin = computed(() => potentialWin_1.value - (tax.value + stake.value))

  const canPlaceBet = computed(() => slipCount.value > 0 && stake.value >= 100)
  const isStakeValid = computed(() => stake.value >= 100)

  const activeBets = computed(() => {
    return userBets.value.filter(bet => 
      bet.status === 'OPEN' || bet.status === 'PENDING'
    )
  })

  const settledBets = computed(() => {
    return userBets.value.filter(bet => 
      bet.status === 'SETTLED'
    )
  })

  const totalActiveBets = computed(() => activeBets.value.length)
  const totalSettledBets = computed(() => settledBets.value.length)

  // ── SLIP ACTIONS ──────────────────────────────────────────────────────────
  
  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

  function addToSlip(selection) {
    const alreadySelected = slip.value.some(
      b => b.matchId === selection.matchId && b.marketKey === selection.marketKey
    )
    
    if (alreadySelected) {
      slip.value = slip.value.filter(
        b => !(b.matchId === selection.matchId && b.marketKey === selection.marketKey)
      )
    } else {
      slip.value = slip.value.filter(b => b.matchId !== selection.matchId)
      slip.value.push({ ...selection, stake: 100 })
      isOpen.value = true
    }
    
    if (slip.value.length === 0) isOpen.value = false
  }

  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
    if (slip.value.length === 0) isOpen.value = false
  }

  function clearSlip() {
    slip.value = []
    stake.value = 0
    isOpen.value = false
    placeBetError.value = null
  }

  function updateStake(newStake) {
    stake.value = Math.max(0, parseFloat(newStake) || 0)
  }

  // ── PLACE BET ─────────────────────────────────────────────────────────────
  
  /**
   * Place a bet from current slip (auto-creates booking code if needed)
   * - Kama user ameLOAD booking code, inatumia bookingCodeId
   * - Kama hajaload, backend inaunda booking code SILENTLY
   */
  async function placeBetFromSlip() {
    if (!canPlaceBet.value) {
      placeBetError.value = {
        message: !slipCount.value ? 'Add selections to your slip' : 'Minimum stake is 100 Tsh'
      }
      return { success: false, error: placeBetError.value }
    }
    
    isPlacingBet.value = true
    placeBetError.value = null
    
    try {
      // Prepare selections from slip
      const selections = slip.value.map(item => ({
        matchId: item.matchId,
        matchName: item.matchName || item.match || 'Match',
        selectionType: item.selectionType || 'HOME',
        selectionValue: item.pick || item.selection || '1',
        odds: parseFloat(item.odds) || 1
      }))
      
      console.log('📤 Store selections being sent:', JSON.stringify(selections, null, 2))
      
      // Angalia kama user ameLOAD booking code
      const bookingCodeStore = useBookingCodeStore()
      const bookingCodeId = bookingCodeStore.currentCode?.id || null
      
      console.log('📤 bookingCodeId from store:', bookingCodeId)
      
      // Call betService.placeBetFromSlip with selections, stake, and optional bookingCodeId
      const result = await betService.placeBetFromSlip(
        selections, 
        stake.value, 
        bookingCodeId
      )
      
      if (result.success) {
        lastPlacedBet.value = result.data
        await refreshUserData()
        clearSlip()
        // Clear booking code after placing bet
        bookingCodeStore.clearBookingCode()
        return { success: true, data: result.data }
      } else {
        placeBetError.value = { message: result.message }
        return { success: false, error: result }
      }
    } catch (error) {
      placeBetError.value = { message: error.message || 'Failed to place bet' }
      return { success: false, error: placeBetError.value }
    } finally {
      isPlacingBet.value = false
    }
  }

  /**
   * Place a bet using existing booking code
   * @param {string} bookingCodeId - ID of the booking code
   * @param {number} stakeAmount - Stake amount
   */
  async function placeBetWithBackend(bookingCodeId, stakeAmount) {
    if (!bookingCodeId) {
      placeBetError.value = { message: 'Booking code is required' }
      return { success: false, error: placeBetError.value }
    }

    if (!stakeAmount || stakeAmount < 100) {
      placeBetError.value = { message: 'Minimum stake is 100 Tsh' }
      return { success: false, error: placeBetError.value }
    }
    
    isPlacingBet.value = true
    placeBetError.value = null
    
    try {
      const result = await betService.placeBet(bookingCodeId, stakeAmount)
      
      if (result.success) {
        lastPlacedBet.value = result.data
        await refreshUserData()
        return { success: true, data: result.data }
      } else {
        placeBetError.value = { message: result.message }
        return { success: false, error: result }
      }
    } catch (error) {
      placeBetError.value = { message: error.message || 'Failed to place bet' }
      return { success: false, error: placeBetError.value }
    } finally {
      isPlacingBet.value = false
    }
  }

  // ── Refresh user data ──────────────────────────────────────────────────
  async function refreshUserData() {
    try {
      await Promise.all([
        loadUserBets(),
        loadBetStats(),
        loadUncheckedWins()
      ])
      lastUpdateTime.value = Date.now()
      return { success: true }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Auto-refresh ────────────────────────────────────────────────────────
  let autoRefreshTimer = null

  function startAutoRefresh() {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer)
    }
    
    if (isAutoRefreshEnabled.value) {
      autoRefreshTimer = setInterval(async () => {
        if (!isPlacingBet.value) {
          await refreshUserData()
        }
      }, refreshInterval.value)
    }
  }

  function stopAutoRefresh() {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer)
      autoRefreshTimer = null
    }
  }

  function toggleAutoRefresh(enabled) {
    isAutoRefreshEnabled.value = enabled
    if (enabled) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  }

  // ── USER BETS ─────────────────────────────────────────────────────────────
  
  async function loadUserBets(options = {}) {
    isLoadingBets.value = true
    
    try {
      const result = await betService.getUserBets(options)
      
      if (result.success) {
        userBets.value = [...(result.data.bets || [])]
        userBetsTotal.value = result.data.total || 0
        lastUpdateTime.value = Date.now()
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load user bets error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingBets.value = false
    }
  }

  async function loadBetById(betId) {
    const existingBet = userBets.value.find(b => String(b.id) === String(betId))
    if (existingBet) {
      return { success: true, data: existingBet, fromCache: true }
    }

    try {
      const result = await betService.getBetById(betId)
      if (result.success) {
        const exists = userBets.value.some(b => String(b.id) === String(result.data.id))
        if (!exists) {
          userBets.value = [result.data, ...userBets.value]
        }
        return { success: true, data: result.data }
      }
      return { success: false, message: result.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async function loadBetStats() {
    isLoadingStats.value = true
    
    try {
      const result = await betService.getUserBetStats()
      
      if (result.success) {
        betStats.value = { ...result.data }
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load bet stats error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingStats.value = false
    }
  }

  // ── CANCEL BET ──────────────────────────────────────────────────────────
  
  async function cancelUserBet(betId) {
    try {
      const result = await betService.cancelBet(betId)
      
      if (result.success) {
        userBets.value = userBets.value.filter(b => String(b.id) !== String(betId))
        await refreshUserData()
        return { success: true, data: result.data }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  
  async function loadUncheckedWins() {
    try {
      const result = await betService.getUncheckedWins()
      
      if (result.success) {
        uncheckedWins.value = [...(result.data.wins || [])]
        hasUnreadWins.value = result.data.hasUnreadWins || false
        return { success: true, data: result.data }
      }
      return { success: false, message: result.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  function markWinsAsNotified() {
    uncheckedWins.value = []
    hasUnreadWins.value = false
  }

  // ── ADMIN BETS ────────────────────────────────────────────────────────────
  
  async function loadAdminBets(options = {}) {
    isLoadingBets.value = true

    try {
      const { status, result, userId, limit = 20, offset = 0 } = options

      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (result) params.append('result', result)
      if (userId) params.append('userId', userId)
      params.append('limit', limit)
      params.append('offset', offset)

      const url = `/bets/admin/bets?${params.toString()}`
      const response = await api.get(url)

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to load bets'
      }
    } catch (error) {
      console.error('Load admin bets error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load bets'
      }
    } finally {
      isLoadingBets.value = false
    }
  }

  async function settleBet(betId, result) {
    try {
      const response = await api.patch(`/bets/admin/bets/${betId}/settle`, { result })

      if (response.data && response.data.success) {
        const betIndex = userBets.value.findIndex(b => String(b.id) === String(betId))
        if (betIndex !== -1) {
          userBets.value[betIndex] = {
            ...userBets.value[betIndex],
            status: 'SETTLED',
            result: result
          }
          userBets.value = [...userBets.value]
        }
        
        await refreshUserData()
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to settle bet'
      }
    } catch (error) {
      console.error('Settle bet error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to settle bet'
      }
    }
  }

  // ── RETURN ──────────────────────────────────────────────────────────────────
  return {
    // State
    slip,
    stake,
    isOpen,
    betType,
    userBets,
    userBetsTotal,
    isLoadingBets,
    betStats,
    isLoadingStats,
    isPlacingBet,
    lastPlacedBet,
    placeBetError,
    uncheckedWins,
    hasUnreadWins,
    lastUpdateTime,
    isAutoRefreshEnabled,
    refreshInterval,
    
    // Computed
    slipCount,
    totalOdds,
    potentialWin,
    canPlaceBet,
    isStakeValid,
    activeBets,
    settledBets,
    totalActiveBets,
    totalSettledBets,
    
    // Slip actions
    isSelected,
    addToSlip,
    removeFromSlip,
    clearSlip,
    updateStake,
    
    // Bet actions
    placeBetFromSlip,       // ← NEW: Auto-creates booking code if needed
    placeBetWithBackend,
    loadUserBets,
    loadBetById,
    loadBetStats,
    cancelUserBet,
    loadUncheckedWins,
    markWinsAsNotified,
    
    // Admin actions
    loadAdminBets,
    settleBet,
    
    // Auto-refresh actions
    refreshUserData,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh
  }
}, {
  persist: {
    key: 'bet-store',
    storage: localStorage,
    paths: ['slip', 'stake', 'isOpen', 'betType']
  }
})