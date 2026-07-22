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
   * Map frontend pick to backend selectionType
   * @param {string} pick - The pick value (1, X, 2, Over, Under, Yes, No)
   * @returns {string} - Backend selectionType (HOME, DRAW, AWAY, OVER, UNDER, YES, NO)
   */
  const mapPickToSelectionType = (pick) => {
    if (!pick) return 'HOME'
    
    const pickUpper = pick.toString().toUpperCase().trim()
    
    // 1X2 markets
    if (pickUpper === '1' || pickUpper === 'HOME') return 'HOME'
    if (pickUpper === 'X' || pickUpper === 'DRAW') return 'DRAW'
    if (pickUpper === '2' || pickUpper === 'AWAY') return 'AWAY'
    
    // Over/Under
    if (pickUpper.includes('OVER')) return 'OVER'
    if (pickUpper.includes('UNDER')) return 'UNDER'
    
    // BTTS
    if (pickUpper === 'YES') return 'YES'
    if (pickUpper === 'NO') return 'NO'
    
    // Default
    return 'HOME'
  }

  /**
   * Get market display name
   * @param {string} marketKey - The market key
   * @returns {string} - Display name
   */
  const getMarketDisplay = (marketKey) => {
    return marketMap[marketKey] || marketKey || '1X2 | Full Time'
  }

  /**
   * Get selection display
   * @param {string} pick - The pick value
   * @param {string} marketKey - The market key
   * @returns {string} - Display value
   */
  const getSelectionDisplay = (pick, marketKey) => {
    const market = marketKey || '1X2'
    
    // For 1X2 market - show as is (1, X, 2)
    if (market === '1X2' || market === '1X2 | Full Time') {
      if (pick === '1' || pick === 'home') return '1'
      if (pick === 'X' || pick === 'draw') return 'X'
      if (pick === '2' || pick === 'away') return '2'
      return pick
    }
    
    // For Double Chance market - show as is (1X, X2, 12)
    if (market === 'Double Chance' || market === 'Double Chance | Full Time') {
      if (pick === '1X') return '1X'
      if (pick === 'X2') return 'X2'
      if (pick === '12') return '12'
      return pick
    }
    
    // For Over/Under, format nicely
    if (pick && pick.toLowerCase().includes('over')) {
      return pick.toUpperCase()
    }
    if (pick && pick.toLowerCase().includes('under')) {
      return pick.toUpperCase()
    }
    
    // For BTTS
    if (pick && pick.toLowerCase() === 'yes') return 'Yes'
    if (pick && pick.toLowerCase() === 'no') return 'No'
    
    // For Correct Score, already has format like "2-1"
    return pick || ''
  }

  /**
   * Format frontend selections to backend format
   * @param {Array} selections - Frontend selections array
   * @returns {Array} - Formatted selections for backend
   */
  const formatForBackend = (selections) => {
    if (!selections || !Array.isArray(selections)) {
      return []
    }

    return selections.map(item => {
      const pick = item.pick || item.selection || ''
      
      return {
        matchId: item.matchId || item.matchId,
        matchName: item.matchName || item.match || 'Match',
        selectionType: mapPickToSelectionType(pick),
        selectionValue: pick,
        odds: parseFloat(item.odds) || 0,
        // New fields
        time: item.time || '',
        date: item.date || '',
        league: item.league || '',
        marketType: item.market || item.marketKey || '1X2'
      }
    })
  }

  /**
   * Format backend selections to frontend format
   * @param {Array} selections - Backend selections array
   * @returns {Array} - Formatted selections for frontend
   */
  const formatForFrontend = (selections) => {
    if (!selections || !Array.isArray(selections)) {
      return []
    }

    return selections.map(item => {
      // Map selectionType back to pick
      let pick = item.selectionValue || ''
      
      // If selectionValue is empty, derive from selectionType
      if (!pick) {
        const typeMap = {
          'HOME': '1',
          'DRAW': 'X',
          'AWAY': '2',
          'OVER': 'Over',
          'UNDER': 'Under',
          'YES': 'Yes',
          'NO': 'No'
        }
        pick = typeMap[item.selectionType] || ''
      }

      return {
        matchId: item.matchId,
        matchName: item.matchName || 'Match',
        pick: pick,
        odds: parseFloat(item.odds) || 0,
        market: item.marketType || '1X2',
        marketKey: pick === '1' ? '1' : pick === 'X' ? 'X' : '2',
        selectionType: item.selectionType,
        selectionValue: item.selectionValue,
        score: item.score || null,
        result: item.result || 'PENDING',
        isSettled: item.isSettled || false,
        // New fields
        time: item.time || '',
        date: item.date || '',
        league: item.league || '',
        marketType: item.marketType || '1X2'
      }
    })
  }

  /**
   * Validate selection has required fields
   * @param {Object} selection - Selection object
   * @returns {Object} - { valid: boolean, errors: string[] }
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
   * @param {Array} selections - Array of selections
   * @returns {Object} - { valid: boolean, errors: Array<{index: number, errors: string[]}> }
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
   * @param {Object} selection - Selection object
   * @returns {string} - Display value
   */
  const getDisplayValue = (selection) => {
    if (!selection) return ''
    
    const pick = selection.pick || selection.selectionValue || ''
    const type = selection.selectionType || ''
    
    // If we have a pick, use it
    if (pick) {
      if (pick === '1') return '1'
      if (pick === 'X') return 'X'
      if (pick === '2') return '2'
      return pick
    }
    
    // Otherwise use selectionType
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
   * @param {string} pick - The pick value
   * @returns {string} - Selection type
   */
  const getSelectionTypeFromPick = (pick) => {
    return mapPickToSelectionType(pick)
  }

  return {
    // Methods
    formatForBackend,
    formatForFrontend,
    validateSelection,
    validateSelections,
    getDisplayValue,
    getSelectionTypeFromPick,
    mapPickToSelectionType,
    // New methods
    getMarketDisplay,
    getSelectionDisplay,
    marketMap
  }
}