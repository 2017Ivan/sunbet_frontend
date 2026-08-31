// services/bookingCode/bookingCode.service.js
import api from '../api'

// Hutoa raw market key kutoka display ("1X2 | Full Time" => "1X2")
const normalizeMarketKey = (m) => {
  if (!m) return '1X2'
  const base = String(m).replace(/\s*\|.*$/, '').trim()
  return base || '1X2'
}

export const bookingCodeService = {
  createBookingCode(selections) {
    // ============ FORMAT DATA KWA BACKEND ============
    console.log('📤 Original selections from frontend:', JSON.stringify(selections, null, 2))

    const formattedSelections = (selections || []).map(sel => {
      // ============ ANGALIA MATCH ID ============
      const matchId = sel.match_id || sel.matchId || sel.id || sel.matchID

      console.log('🔍 Selection:', {
        original: sel,
        extracted_matchId: matchId,
        market: sel.market,
        pick: sel.pick
      })

      if (!matchId) {
        console.error('❌ No match_id found for selection:', sel)
        throw new Error('Match ID haipo kwenye selection')
      }
      // =============================================

      return {
        match_id: matchId,
        market_key: normalizeMarketKey(sel.market_key || sel.market || '1X2'),
        outcome_key: sel.outcome_key ?? sel.pick ?? sel.selection ?? sel.marketKey ?? '1'
      }
    })
    // ==================================================

    console.log('📤 Formatted selections for backend:', JSON.stringify(formattedSelections, null, 2))

    return api.post('/code/create', { selections: formattedSelections })
  },

  getBookingCodeDetails(code) {
    return api.get(`/code/${code}`)
  },

  // ADMIN: booking codes zote (list) - search kwa code, status filter
  getAdminBookingCodes(params = {}) {
    return api.get('/code/admin', { params })
  }
}