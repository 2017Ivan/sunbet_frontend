// stores/bookingCode/useBookingCodeStore.js
import { defineStore } from 'pinia'
import { bookingCodeService } from '../../services/bookingCode/bookingCode.service'
import { useBetStore } from '../bet/betStore'

// Kituo cha Kanuni (Canonical) kwa booking codes
// - Create: createBookingCodeFromSlip()  -> inatumiwa na BookingCodeModal
// - Load:   loadBookingCode()             -> inatumiwa na BetSlip
// - helper: fetchBookingCodeById()        -> fallback (bets zina selections zake)
//
// Kumbukumbu: Uundaji wa payload (match_id/market_key/outcome_key) unafanyika katika
// bookingCode.service.js (kiwango cha API) — hii inaepuka kurudia-format yenye kutofautiana.
export const useBookingCodeStore = defineStore('bookingCode', {
  state: () => ({
    currentBookingCode: null,
    bookingCodeDetails: null,
    loadedSelections: [],
    loadedExpiresAt: null,
    loadedCreatedAt: null,
    isLoading: false,
    isCreating: false,
    isFetching: false,
    error: null,
    recentCodes: []
  }),

  getters: {
    hasBookingCode: (state) => !!state.currentBookingCode?.code,
    formattedCode: (state) => state.currentBookingCode?.code || null,
    totalOdds: (state) => state.currentBookingCode?.total_odds || state.currentBookingCode?.totalOdds || 0,
    selectionCount: (state) => state.currentBookingCode?.selections?.length || 0,
    loadedSelectionCount: (state) => state.loadedSelections.length || 0
  },

  actions: {
    // ===== CREATE =====
    // Huunda booking code kutoka kwenye slip ya betStore
    async createBookingCodeFromSlip() {
      this.isCreating = true
      this.error = null
      const betStore = useBetStore()
      try {
        const response = await bookingCodeService.createBookingCode(betStore.slip || [])
        this.currentBookingCode = response.data?.data || null
        return this.handleCreateResponse(response)
      } catch (error) {
        return this.handleError('create', error)
      } finally {
        this.isCreating = false
      }
    },

    // Version yenye argument (kwa matumizi ya nje kama selection ziko tayari)
    async createBookingCode(selections) {
      this.isCreating = true
      this.error = null
      try {
        const response = await bookingCodeService.createBookingCode(selections || [])
        this.currentBookingCode = response.data?.data || null
        return this.handleCreateResponse(response)
      } catch (error) {
        return this.handleError('create', error)
      } finally {
        this.isCreating = false
      }
    },

    // Hufanya slip iwe raw (formatting inafanyika katika bookingCode.service.js)
    slipToSelections() {
      return this.rawSlipSelections || []
    },

    // Hii inaruhusu kupiga betStore kuweka rawSlipSelections kabla ya create
    attachSlip(selections) {
      this.rawSlipSelections = selections
    },

    // ===== CREATE RESPONSE FORMATTER =====
    handleCreateResponse(response) {
      const data = response?.data?.data || null
      if (data) {
        this.currentBookingCode = data
        this.recentCodes.unshift({
          code: data.code,
          selections: data.selections?.length || 0,
          createdAt: new Date().toISOString()
        })
        if (this.recentCodes.length > 10) this.recentCodes = this.recentCodes.slice(0, 10)
        return {
          success: true,
          data: {
            bookingCode: data,
            code: data.code,
            expiresAt: data.expires_at || data.expiresAt
          },
          bookingCode: data.code,
          message: response?.data?.message || 'Booking code imetengenezwa kikamilifu.'
        }
      }
      return { success: true, data: { bookingCode: data }, message: response?.data?.message || 'Booking code imetengenezwa.' }
    },

    // ===== LOAD =====
    // Hupakia booking code na kuthibitisha kuwa haijapitwa na wakati
    async loadBookingCode(code) {
      this.isLoading = true
      this.error = null
      try {
        const result = await this.fetchBookingCodeDetails(code)
        if (!result.success) return result
        return this.applyLoadedData(result.data)
      } catch (error) {
        return this.handleError('load', error)
      } finally {
        this.isLoading = false
      }
    },

    applyLoadedData(details) {
      const selections = (details.selections || []).map((sel) => ({
        matchId: sel.match_id || sel.matchId,
        matchName: `${sel.home_team || ''} vs ${sel.away_team || ''}`,
        home_team: sel.home_team,
        away_team: sel.away_team,
        league: sel.league,
        market: sel.market_key || '1X2',
        marketKey: sel.market_key || '1X2',
        market_key: sel.market_key || '1X2',
        outcome_key: sel.outcome_key || sel.pick || '1',
        pick: sel.outcome_key || sel.pick || '1',
        odds: parseFloat(sel.odds) || 1,
        fromBookingCode: true
      }))

      this.loadedSelections = selections
      this.loadedExpiresAt = details.expires_at || details.expiresAt || null
      this.loadedCreatedAt = details.createdAt || details.created_at || null

      return { success: true, selections: this.loadedSelections }
    },

    // ===== FETCH DETAILS =====
    async fetchBookingCodeDetails(code) {
      this.isFetching = true
      this.error = null
      try {
        const response = await bookingCodeService.getBookingCodeDetails(code.toUpperCase())
        if (response?.data?.data) {
          this.bookingCodeDetails = response.data.data
          return { success: true, data: response.data.data }
        }
        return { success: false, message: 'Booking code haijapatikana.' }
      } catch (error) {
        return this.handleError('fetch', error)
      } finally {
        this.isFetching = false
      }
    },

    // ===== BETS/by-id fallback =====
    // Bets zina selections zao; hii ni fallback tu (haina backend endpoint)
    async fetchBookingCodeById(id) {
      if (!id) return { success: false, message: 'No booking code reference.' }
      return { success: true, data: { selections: this.loadedSelections || [] } }
    },

    // ===== HELPERS =====
    clearBookingCode() {
      this.currentBookingCode = null
      this.bookingCodeDetails = null
      this.error = null
      this.rawSlipSelections = null
    },

    clearLoadedSelections() {
      this.loadedSelections = []
      this.loadedExpiresAt = null
      this.loadedCreatedAt = null
    },

    resetState() {
      this.currentBookingCode = null
      this.bookingCodeDetails = null
      this.error = null
      this.loadedSelections = []
      this.loadedExpiresAt = null
      this.loadedCreatedAt = null
      this.isLoading = false
      this.isCreating = false
      this.isFetching = false
      this.rawSlipSelections = null
    },

    handleError(kind, error) {
      const msg = error?.response?.data?.message || error?.message || 'Kuna tatizo limetokea.'
      this.error = msg
      // isActive false => expired/deactivated
      const expired = error?.response?.status === 400 || /pitwa|muda|aktivo/i.test(msg)
      return { success: false, message: msg, isExpired: expired }
    }
  }
})
