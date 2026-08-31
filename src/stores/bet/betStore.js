// src/stores/bet/betStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import BetService from '../../services/bet/bet.service'
import { MINIMUM_STAKE } from '../../constants/betting'
import { useAuthStore } from '../auth/authStore'

export const useBetStore = defineStore('betStore', () => {
  // ============ STATE ============
  const slip = ref([])
  const stake = ref()
  const isPlacingBet = ref(false)
  const betHistory = ref([])
  const currentBet = ref(null)
  const isLoadingHistory = ref(false)
  const error = ref(null)
  const winNotifications = ref([])
  const isLoadingWins = ref(false)

  // ============ GETTERS ============
  const slipCount = computed(() => slip.value.length)
  
  const totalOdds = computed(() => {
    return slip.value.reduce((acc, sel) => acc * (sel.odds || 1), 1)
  })
  
  const isSlipValid = computed(() => {
    return slipCount.value > 0 && stake.value >= MINIMUM_STAKE
  })

  // ============ SLIP ACTIONS ============

  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

  function addToSlip(selection) {
    console.log('📥 addToSlip received selection:', JSON.stringify(selection, null, 2))
    
    const matchId = selection.matchId || selection.match_id || selection.id
    
    if (!matchId) {
      console.error('❌ No matchId found! Selection:', selection)
      return
    }
    
    const marketKeyRawCandidate = (selection.market_key || selection.market || '1X2')
    const outcomeKeyRawCandidate = selection.outcome_key != null ? selection.outcome_key : (selection.pick || '1')
    const identityKeyCandidate = selection.marketKey ||
      `${matchId}-${marketKeyRawCandidate}-${outcomeKeyRawCandidate}`.toUpperCase()

    // 1) Chaguo lile lile (identity sawasawa) => toggle off / ondoa kwenye slip
    const sameIdentity = slip.value.findIndex(
      b => b.matchId === matchId && b.marketKey === identityKeyCandidate
    )
    if (sameIdentity !== -1) {
      slip.value.splice(sameIdentity, 1)
      return
    }

    // 2) Match hiyo hiyo + soko hilo hilo => replace pick (kubadilisha chaguo)
    //    Multi-market ya match hiyo hiyo (soko tofauti) inabaki wote ndani ya slip.
    slip.value = slip.value.filter(
      b => !(b.matchId === matchId && (b.market_key || b.market || '1X2') === marketKeyRawCandidate)
    )
    // ============ RAW KEYS KWA BACKEND (haziharibiwi) ============
    // market_key = soko halisi la DB (1X2, Over_Under, Double_Chance...)
    // outcome_key = chaguo halisi la DB (1/X/2, OVER 2.5, 1X, Yes...)
    const marketKeyRaw = selection.market_key || selection.market || '1X2'
    const outcomeKeyRaw = selection.outcome_key != null ? selection.outcome_key : (selection.pick || '1')
    
    // identity = ufunguo wa kipekee wa slip (hudumishwa na page inayoongeza)
    // MatchCard: '1'/'X'/'2'  |  SportDetail: '<matchId>_<market>_<option>'
    const identityKey = selection.marketKey ||
      `${matchId}-${marketKeyRaw}-${outcomeKeyRaw}`.toUpperCase()
    
    const newSelection = {
      ...selection,
      matchId: matchId,
      matchName: selection.matchName || selection.match_name || `${selection.home_team || ''} vs ${selection.away_team || ''}`,
      market: selection.market || '1X2',
      marketKey: identityKey,
      // Backend raw keys
      market_key: marketKeyRaw,
      outcome_key: outcomeKeyRaw,
      // Kama outcomes zipo clean, pick inabaki kama object ya ku-display
      pick: selection.outcome_key != null
        ? (selection.pick || outcomeKeyRaw)
        : (selection.pick || '1'),
      odds: selection.odds || selection.odds_value || 1,
      stake: 100 
    }
    
    console.log('✅ New selection added to slip:', JSON.stringify(newSelection, null, 2))
    
    slip.value.push(newSelection)
  }

  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
  }

  function clearSlip() {
    slip.value = []
    stake.value = 100000
  }

  function updateStake(amount) {
    stake.value = Math.max(0, parseFloat(amount) || 0)
  }

  // ============ PLACE BET ============

  const placeBetWithBackend = async () => {
    if (!isSlipValid.value) {
      return {
        success: false,
        error: 'Invalid slip or stake amount',
        message: !slipCount.value ? 'Add selections to your slip' : `Minimum stake is TZS ${MINIMUM_STAKE}`
      }
    }

    isPlacingBet.value = true
    error.value = null

    try {
      const selections = slip.value.map(sel => ({
        match_id: sel.matchId,
        market_key: sel.market_key || sel.market || '1X2',
        outcome_key: sel.outcome_key != null ? sel.outcome_key : (sel.pick || '1')
      }))

      const betData = {
        stake: stake.value,
        selections: selections,
        placed_via: 'DIRECT'
      }

      const response = await BetService.placeBet(betData)
      
      if (response.success) {
        // ============ FIX: Transform backend response to frontend format ============
        const bet = response.data
        
        // Map backend fields to frontend format
        const formattedBet = {
          id: bet.id,
          ticket_code: bet.ticket_code,
          booking_code: bet.booking_code || null,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          // ============ IMPORTANT FIX: Map status and result ============
          status: bet.status, // 'PENDING' or 'SETTLED'
          result: bet.result, // 'OPEN', 'WON', 'LOST', 'CANCELLED'
          cashout_value: bet.cashout_value ?? null,
          cashout_amount: bet.cashout_amount ?? null,
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }
        
        currentBet.value = formattedBet
        
        // ============ FIX: Add to betHistory immediately ============
        betHistory.value.unshift(formattedBet)
        
        clearSlip()
        
        // ============ FIX: Refresh user balance so header/slip update reactively ============
        try {
          const authStore = useAuthStore()
          await authStore.fetchUserBalance()
        } catch (balanceErr) {
          // Never fail the bet placement because the balance refresh failed
          console.warn('⚠️ Balance refresh after bet placement failed:', balanceErr)
        }
        
        return {
          success: true,
          data: formattedBet,
          message: response.message || 'Bet placed successfully!'
        }
      } else {
        throw new Error(response.message || 'Failed to place bet')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return {
        success: false,
        error: error.value,
        message: err.message || 'Failed to place bet'
      }
    } finally {
      isPlacingBet.value = false
    }
  }

  // ============ BOOKING CODE ============

  const loadFromBookingCode = (bookingData) => {
    clearSlip()
    
    const selections = bookingData.selections || bookingData.matches || []
    
    selections.forEach(item => {
      const selection = {
        matchId: item.match_id || item.matchId || item.id,
        matchName: `${item.home_team || ''} vs ${item.away_team || ''}`,
        market: item.market_key || item.market || '1X2',
        marketKey: `${item.match_id || item.id}_${item.market_key || '1X2'}`,
        pick: item.outcome_key || item.pick || '1',
        odds: item.odds || 1,
        home_team: item.home_team,
        away_team: item.away_team,
        league: item.league
      }
      
      addToSlip(selection)
    })
    
    return {
      success: true,
      count: selections.length
    }
  }

  // ============ BET HISTORY ============

  const fetchBetHistory = async (options = {}) => {
    isLoadingHistory.value = true
    error.value = null
    
    try {
      const response = await BetService.getUserBets(options)
      
      if (response.success) {
        // ============ FIX: Transform all bets to frontend format ============
        const formattedBets = (response.data || []).map(bet => ({
          id: bet.id,
          ticket_code: bet.ticket_code,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          status: bet.status, // 'PENDING' or 'SETTLED'
          result: bet.result, // 'OPEN', 'WON', 'LOST', 'CANCELLED'
          cashout_value: bet.cashout_value ?? null,
          cashout_amount: bet.cashout_amount ?? null,
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }))
        
        betHistory.value = formattedBets
        
        return {
          success: true,
          data: formattedBets
        }
      } else {
        throw new Error(response.message || 'Failed to fetch bet history')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return {
        success: false,
        error: error.value
      }
    } finally {
      isLoadingHistory.value = false
    }
  }

  const fetchBetByTicket = async (ticketCode) => {
    try {
      const response = await BetService.getBetByTicketCode(ticketCode)
      
      if (response.success) {
        const bet = response.data
        const formattedBet = {
          id: bet.id,
          ticket_code: bet.ticket_code,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          status: bet.status,
          result: bet.result,
          cashout_value: bet.cashout_value ?? null,
          cashout_amount: bet.cashout_amount ?? null,
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }
        
        return {
          success: true,
          data: formattedBet
        }
      } else {
        throw new Error(response.message || 'Bet not found')
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to fetch bet details'
      }
    }
  }

  // ============ CASHOUT ============

  const cashoutBet = async (betId) => {
    error.value = null
    try {
      const response = await BetService.cashoutBet(betId)

      if (response.success) {
        const bet = response.data

        if (bet) {
          // Update the bet in history in place so lists refresh immediately
          const index = betHistory.value.findIndex(b => String(b.id) === String(bet.id))
          if (index !== -1) {
            const updated = {
              id: bet.id,
              ticket_code: bet.ticket_code,
              stake: bet.stake,
              total_odds: bet.total_odds,
              possible_win: bet.possible_win,
              tax: bet.tax,
              payout: bet.payout,
              cashout_amount: bet.cashout_amount ?? null,
              status: bet.status,
              result: bet.result,
              cashout_value: null,
              selections: bet.selections || betHistory.value[index].selections || [],
              created_at: bet.createdAt || bet.created_at,
              updated_at: bet.updatedAt || bet.updated_at
            }
            betHistory.value[index] = updated
          }
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Bet cashed out successfully!'
        }
      } else {
        throw new Error(response.message || 'Failed to cash out bet')
      }
    } catch (err) {
      error.value = err?.message || err?.error || 'Something went wrong'
      return {
        success: false,
        error: error.value,
        message: err?.message || err?.error || 'Failed to cash out bet'
      }
    }
  }

  // ============ ALIASES FOR MY BETS (BetsPage expects these) ============
  const userBets = computed(() => betHistory.value || [])

  const loadUserBets = async (options = {}) => {
    return await fetchBetHistory(options)
  }

  // ============ WIN CELEBRATION NOTIFICATIONS ============
  const fetchWinNotifications = async () => {
    isLoadingWins.value = true
    try {
      const response = await BetService.getWinNotifications()
      winNotifications.value = response.data || []
      return winNotifications.value
    } catch (err) {
      console.error('Failed to fetch win notifications:', err)
      winNotifications.value = []
      return []
    } finally {
      isLoadingWins.value = false
    }
  }

  const acknowledgeWin = async (betId) => {
    let success = false
    try {
      await BetService.acknowledgeWin(betId)
      success = true
    } catch (err) {
      console.error('Failed to acknowledge win:', err)
    } finally {
      // Always drop it from the local queue so the session isn't stuck re-showing it
      winNotifications.value = winNotifications.value.filter(x => x.id !== betId)
    }
    return success
  }

  // ============ RETURN ============
  return {
    // State
    slip,
    stake,
    isPlacingBet,
    betHistory,
    currentBet,
    isLoadingHistory,
    error,
    winNotifications,
    isLoadingWins,
    
    // Getters
    slipCount,
    totalOdds,
    isSlipValid,
    
    // Slip actions
    isSelected,
    addToSlip,
    removeFromSlip,
    clearSlip,
    updateStake,
    
    // Bet actions
    placeBetWithBackend,
    loadFromBookingCode,
    fetchBetHistory,
    fetchBetByTicket,
    cashoutBet,
    loadUserBets,

    // Win celebration
    fetchWinNotifications,
    acknowledgeWin,

    // My Bets aliases
    userBets,
  }
})