// composables/useSelectionFormatter.js

/**
 * Composable for formatting selections between frontend and backend
 * Backend expects: matchId, matchName, selectionType, selectionValue, odds, time, date, league, marketType
 * Frontend uses: matchId, matchName, pick, odds, market, time, date, league
 */
export function useSelectionFormatter() {
  
  // Market mapping
  const marketMap = {
    '1X2': '1X2 | Full Time',
    'Double Chance': 'Double Chance | Full Time',
    'Both Teams to Score': 'Both Teams to Score | Full Time',
    'BTTS': 'Both Teams to Score | Full Time',
    'Over/Under': 'Over/Under | Full Time',
    'Correct Score': 'Correct Score | Full Time',
    'Correct Score First Half': 'Correct Score | First Half',
    'Correct Score Second Half': 'Correct Score | Second Half',
    'CS_FT': 'Correct Score | Full Time',
    'CS_FH': 'Correct Score | First Half',
    'CS_SH': 'Correct Score | Second Half',
    'OU': 'Over/Under | Full Time'
  }

  /**
   * Map selectionType to selectionValue (BACKEND FORMAT)
   */
  const mapSelectionTypeToValue = (selectionType) => {
    if (!selectionType) return '1'
    
    const typeMap = {
      'HOME': '1',
      'DRAW': 'X',
      'AWAY': '2',
      'OVER': 'Over',
      'UNDER': 'Under',
      'YES': 'Yes',
      'NO': 'No'
    }
    
    return typeMap[selectionType] || selectionType
  }

  /**
   * Map frontend pick to backend selectionType
   */
  const mapPickToSelectionType = (pick) => {
    if (!pick) return 'HOME'
    
    const pickUpper = pick.toString().toUpperCase().trim()
    
    if (pickUpper === '1' || pickUpper === 'HOME') return 'HOME'
    if (pickUpper === 'X' || pickUpper === 'DRAW') return 'DRAW'
    if (pickUpper === '2' || pickUpper === 'AWAY') return 'AWAY'
    if (pickUpper.includes('OVER')) return 'OVER'
    if (pickUpper.includes('UNDER')) return 'UNDER'
    if (pickUpper === 'YES') return 'YES'
    if (pickUpper === 'NO') return 'NO'
    
    return 'HOME'
  }

  /**
   * Get market display name
   */
  const getMarketDisplay = (marketKey) => {
    return marketMap[marketKey] || marketKey || '1X2 | Full Time'
  }

  /**
   * Get selection display
   */
  const getSelectionDisplay = (pick, marketKey) => {
    const market = marketKey || '1X2'
    
    if (market === '1X2' || market === '1X2 | Full Time') {
      if (pick === '1' || pick === 'home') return '1'
      if (pick === 'X' || pick === 'draw') return 'X'
      if (pick === '2' || pick === 'away') return '2'
      return pick
    }
    
    if (market === 'Double Chance' || market === 'Double Chance | Full Time') {
      if (pick === '1X') return '1X'
      if (pick === 'X2') return 'X2'
      if (pick === '12') return '12'
      return pick
    }
    
    if (pick && pick.toLowerCase().includes('over')) return pick.toUpperCase()
    if (pick && pick.toLowerCase().includes('under')) return pick.toUpperCase()
    if (pick && pick.toLowerCase() === 'yes') return 'Yes'
    if (pick && pick.toLowerCase() === 'no') return 'No'
    
    return pick || ''
  }

  /**
   * Format frontend selections to backend format
   * === HAPA NDIO FIX KUU ===
   * selectionValue inatokana na selectionType, siyo pick moja kwa moja
   */
  const formatForBackend = (selections) => {
    if (!selections || !Array.isArray(selections)) {
      return []
    }

    console.log('📤 Formatting selections for backend:', selections)

    return selections.map(item => {
      const pick = item.pick || item.selection || ''
      
      // GET selectionType kutoka kwenye pick
      const selectionType = mapPickToSelectionType(pick)
      
      // GET correct selectionValue based on selectionType
      const selectionValue = mapSelectionTypeToValue(selectionType)
      
      const result = {
        matchId: item.matchId || item.matchId,
        matchName: item.matchName || item.match || 'Match',
        selectionType: selectionType,
        selectionValue: selectionValue, // HAPA NDIO SAHIHI SASA
        odds: parseFloat(item.odds) || 0,
        time: item.time || '',
        date: item.date || '',
        league: item.league || '',
        marketType: item.market || item.marketKey || '1X2'
      }

      console.log(`✅ Selection:`, {
        original_pick: pick,
        selectionType: result.selectionType,
        selectionValue: result.selectionValue,
        marketType: result.marketType
      })

      return result
    })
  }

  /**
   * Format backend selections to frontend format
   * === HAPA NDIO FIX ===
   * pick inatokana na selectionType, siyo selectionValue
   */
  const formatForFrontend = (selections) => {
    if (!selections || !Array.isArray(selections)) {
      return []
    }

    console.log('📥 Formatting selections from backend:', selections)

    return selections.map(item => {
      // GET selectionType from backend
      const selectionType = item.selectionType || 'HOME'
      
      // GET pick based on selectionType
      const pick = mapSelectionTypeToValue(selectionType)
      
      // Market key based on pick
      let marketKey = '2'
      if (pick === '1') marketKey = '1'
      else if (pick === 'X') marketKey = 'X'
      else if (pick === '2') marketKey = '2'

      const result = {
        matchId: item.matchId,
        matchName: item.matchName || 'Match',
        pick: pick,
        odds: parseFloat(item.odds) || 0,
        market: item.marketType || '1X2',
        marketKey: marketKey,
        selectionType: selectionType,
        selectionValue: pick,
        score: item.score || null,
        result: item.result || 'PENDING',
        isSettled: item.isSettled || false,
        time: item.time || '',
        date: item.date || '',
        league: item.league || '',
        marketType: item.marketType || '1X2'
      }

      console.log(`✅ Formatted for frontend:`, {
        matchId: result.matchId,
        pick: result.pick,
        selectionType: result.selectionType,
        selectionValue: result.selectionValue
      })

      return result
    })
  }

  /**
   * Validate selection has required fields
   */
  const validateSelection = (selection) => {
    const errors = []
    
    if (!selection.matchId) errors.push('matchId is required')
    if (!selection.matchName) errors.push('matchName is required')
    if (!selection.selectionType) errors.push('selectionType is required')
    if (!selection.selectionValue) errors.push('selectionValue is required')
    if (!selection.odds || parseFloat(selection.odds) <= 0) errors.push('odds must be greater than 0')
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate multiple selections
   */
  const validateSelections = (selections) => {
    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return {
        valid: false,
        errors: [{ index: -1, errors: ['At least one selection is required'] }]
      }
    }

    const validationErrors = []
    let isValid = true

    selections.forEach((selection, index) => {
      const result = validateSelection(selection)
      if (!result.valid) {
        isValid = false
        validationErrors.push({
          index: index + 1,
          errors: result.errors
        })
      }
    })

    return {
      valid: isValid,
      errors: validationErrors
    }
  }

  /**
   * Get display value for selection
   */
  const getDisplayValue = (selection) => {
    if (!selection) return ''
    
    const pick = selection.pick || selection.selectionValue || ''
    const type = selection.selectionType || ''
    
    if (pick) {
      if (pick === '1') return '1'
      if (pick === 'X') return 'X'
      if (pick === '2') return '2'
      return pick
    }
    
    const displayMap = {
      'HOME': '1',
      'DRAW': 'X',
      'AWAY': '2',
      'OVER': 'Over',
      'UNDER': 'Under',
      'YES': 'Yes',
      'NO': 'No'
    }
    
    return displayMap[type] || type
  }

  /**
   * Get selection type from pick
   */
  const getSelectionTypeFromPick = (pick) => {
    return mapPickToSelectionType(pick)
  }

  /**
   * Get correct selection display (1, X, 2)
   */
  const getCorrectSelectionDisplay = (selection) => {
    if (!selection) return ''
    
    const pick = selection.pick || selection.selectionValue || ''
    const type = selection.selectionType || ''
    
    // Kama pick ni 1, X, au 2 - return hiyo
    if (pick === '1' || pick === 'X' || pick === '2') {
      return pick
    }
    
    // Vinginevyo tumia selectionType
    return mapSelectionTypeToValue(type)
  }

  return {
    formatForBackend,
    formatForFrontend,
    validateSelection,
    validateSelections,
    getDisplayValue,
    getSelectionTypeFromPick,
    getCorrectSelectionDisplay,
    mapPickToSelectionType,
    mapSelectionTypeToValue,
    getMarketDisplay,
    getSelectionDisplay,
    marketMap
  }
}