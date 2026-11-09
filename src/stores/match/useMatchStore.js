import { defineStore } from 'pinia'
import { matchService } from '../../services/match/match.service'
import { io } from 'socket.io-client'

export const useMatchStore = defineStore('match', {
  state: () => ({
    upcomingMatches: [],
    liveMatches: [],
    footballApiMarketsByFixture: {},
    selectedMatch: null,
    loading: false,
    actionLoading: false,
    error: null,
    socket: null
  }),

  actions: {
    // --- FETCH ACTIONS ---
    async fetchAllMatches() {
      this.loading = true
      this.error = null
      try {
        const [upcomingRes, liveRes] = await Promise.all([
          matchService.getUpcomingMatches(),
          matchService.getLiveMatches()
        ])

        this.upcomingMatches = upcomingRes.data.data || []
        this.liveMatches = liveRes.data.data || []

        const footballApiUpcomingMatches = this.upcomingMatches.filter(
          match => match.source === 'FOOTBALL_API'
        )
        console.log('⚽ Full Football API upcoming match objects:', footballApiUpcomingMatches)

        try {
          const apiLiveRes = await matchService.getFootballApiLiveMatches()
          const apiLiveMatches = apiLiveRes.data.data || []
          const storedApiMatchesById = new Map(
            this.liveMatches
              .filter(match => match.source === 'FOOTBALL_API')
              .map(match => [String(match.external_id), match])
          )
          this.liveMatches = [
            ...this.liveMatches.filter(match => match.source !== 'FOOTBALL_API'),
            ...apiLiveMatches.map(apiMatch => {
              const storedMatch = storedApiMatchesById.get(String(apiMatch.external_id))
              return storedMatch
                ? { ...storedMatch, ...apiMatch, id: storedMatch.id }
                : apiMatch
            })
          ]
        } catch (apiError) {
          console.error('[FOOTBALL API LIVE ERROR]:', apiError)
          this.error = apiError.response?.data?.message || 'Imeshindikana kuleta live matches kutoka Football API'
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuleta mechi'
        console.error('[MATCH STORE ERROR]:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchFootballApiMarkets(externalId, status) {
      const fixtureStatus = status === 'LIVE' ? 'LIVE' : 'UPCOMING'
      const cacheKey = `${externalId}:${fixtureStatus}`
      const cachedFixtureOdds = this.footballApiMarketsByFixture[cacheKey]
      if (cachedFixtureOdds) return cachedFixtureOdds.markets

      const response = await matchService.getFootballApiMarkets(externalId, fixtureStatus)
      const fixtureOdds = response.data?.data
      const markets = fixtureOdds?.markets
      if (!Array.isArray(markets)) {
        throw new Error('Football API imerudisha markets zisizo sahihi')
      }

      this.footballApiMarketsByFixture = {
        ...this.footballApiMarketsByFixture,
        [cacheKey]: { fixtureOdds, markets }
      }

      const addMarketsToMatch = (match) => (
        match.source === 'FOOTBALL_API' && String(match.external_id) === String(externalId)
          ? {
            ...match,
            markets,
            football_api_odds: fixtureOdds
          }
          : match
      )
      this.upcomingMatches = this.upcomingMatches.map(addMarketsToMatch)
      this.liveMatches = this.liveMatches.map(addMarketsToMatch)

      const fullMatch = [...this.upcomingMatches, ...this.liveMatches].find(
        match => match.source === 'FOOTBALL_API' && String(match.external_id) === String(externalId)
      )
      console.log('⚽ Full Football API match with raw odds and markets:', fullMatch)

      return markets
    },

    async fetchMatchDetails(id) {
      this.loading = true
      this.error = null
      try {
        const response = await matchService.getMatchDetails(id)
        this.selectedMatch = response.data.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuleta maelezo ya mechi'
      } finally {
        this.loading = false
      }
    },

    // --- ADMIN ACTIONS ---
    async createMatch(matchData) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.createMatch(matchData)
        const newMatch = response.data.data

        if (newMatch.status === 'UPCOMING') {
          this.upcomingMatches.unshift(newMatch)
          this.upcomingMatches = [...this.upcomingMatches]
        } else if (newMatch.status === 'LIVE') {
          this.liveMatches.unshift(newMatch)
          this.liveMatches = [...this.liveMatches]
        }

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuunda mechi'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async createMultipleMatches(matchesData) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.createMultipleMatches(matchesData)
        const newMatches = response.data.data?.created || []

        newMatches.forEach(match => {
          if (match.status === 'UPCOMING') {
            this.upcomingMatches.unshift(match)
          } else if (match.status === 'LIVE') {
            this.liveMatches.unshift(match)
          }
        })

        this.upcomingMatches = [...this.upcomingMatches]
        this.liveMatches = [...this.liveMatches]

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuunda mechi nyingi'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    // Auto-generate random matches (admin)
    async generateMatches(options = {}) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.generateMatches(options)
        const newMatches = response.data.data?.created || []

        newMatches.forEach(match => {
          if (match.status === 'UPCOMING') {
            this.upcomingMatches.unshift(match)
          } else if (match.status === 'LIVE') {
            this.liveMatches.unshift(match)
          }
        })

        this.upcomingMatches = [...this.upcomingMatches]
        this.liveMatches = [...this.liveMatches]

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuzalisha mechi'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async uploadMatchesFile(file) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.uploadMatchesFile(file)
        const newMatches = response.data.data?.created || []

        newMatches.forEach(match => {
          if (match.status === 'UPCOMING') {
            this.upcomingMatches.unshift(match)
          } else if (match.status === 'LIVE') {
            this.liveMatches.unshift(match)
          }
        })

        this.upcomingMatches = [...this.upcomingMatches]
        this.liveMatches = [...this.liveMatches]

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuupload file'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async updateOdds(matchId, odds) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchOdds(matchId, odds)
        const updatedMatch = response.data.data

        this._updateLocalMatch(updatedMatch)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kubadilisha odds'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async updateStatus(matchId, status) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchStatus(matchId, status)
        await this.fetchAllMatches()
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kubadilisha status'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    // --- SOCKET LISTENERS ---
    initMatchSocket() {
      if (this.socket) return

      // Inatumia localhost ukiwa kwenye dev environment, na domain ya SSL ukiwa kwenye VPS
      const isLocal = /localhost|127\.0\.0\.1/.test(window.location.origin)
      const socketUrl = isLocal ? 'http://localhost:5000' : window.location.origin

      this.socket = io(socketUrl, {
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        secure: window.location.protocol === 'https:'
      })

      this.socket.on('connect', () => {
        console.log('⚡ Socket connected successfully:', this.socket.id)
      })

      this.socket.on('connect_error', (err) => {
        console.error('❌ Socket Connection Error:', err.message)
      })

      // ✅ LISTENER KWA MATCH SCORE & MINUTE UPDATE
      this.socket.on('match_score_update', ({ match_id, current_score, elapsed_minute, markets }) => {
        console.log('⚡ Score/Minute Update:', match_id, current_score, elapsed_minute)
        
        // Match ID Comparison kwa kutumia String() kuzuia type mismatch
        const liveIndex = this.liveMatches.findIndex(m => String(m.id) === String(match_id))
        
        if (liveIndex !== -1) {
          const updatedMatch = {
            ...this.liveMatches[liveIndex],
            current_score: current_score ? { ...current_score } : this.liveMatches[liveIndex].current_score,
            elapsed_minute: elapsed_minute !== undefined ? elapsed_minute : this.liveMatches[liveIndex].elapsed_minute,
            markets: Array.isArray(markets) ? markets : this.liveMatches[liveIndex].markets,
            _updatedAt: Date.now()
          }
          
          this.liveMatches.splice(liveIndex, 1, updatedMatch)
          this.liveMatches = [...this.liveMatches] // Force top-level reactivity
        } else {
          const upcomingIndex = this.upcomingMatches.findIndex(m => String(m.id) === String(match_id))
          if (upcomingIndex !== -1) {
            const movedMatch = {
              ...this.upcomingMatches[upcomingIndex],
              status: 'LIVE',
              current_score: current_score ? { ...current_score } : this.upcomingMatches[upcomingIndex].current_score,
              elapsed_minute: elapsed_minute !== undefined ? elapsed_minute : this.upcomingMatches[upcomingIndex].elapsed_minute,
              markets: Array.isArray(markets) ? markets : this.upcomingMatches[upcomingIndex].markets,
              _updatedAt: Date.now()
            }

            this.upcomingMatches.splice(upcomingIndex, 1)
            this.upcomingMatches = [...this.upcomingMatches]

            this.liveMatches.push(movedMatch)
            this.liveMatches = [...this.liveMatches]
            console.log('🔄 Match moved to LIVE:', movedMatch.home_team, 'vs', movedMatch.away_team)
          }
        }

        if (this.selectedMatch && String(this.selectedMatch.id) === String(match_id)) {
          this.selectedMatch = {
            ...this.selectedMatch,
            status: 'LIVE',
            current_score: current_score ? { ...current_score } : this.selectedMatch.current_score,
            elapsed_minute: elapsed_minute !== undefined ? elapsed_minute : this.selectedMatch.elapsed_minute,
            markets: Array.isArray(markets) ? markets : this.selectedMatch.markets,
            _updatedAt: Date.now()
          }
        }
      })

      this.socket.on('match_odds_update', ({ match_id, markets }) => {
        if (!Array.isArray(markets)) return

        this.upcomingMatches = this.upcomingMatches.map(match => (
          String(match.id) === String(match_id) ? { ...match, markets } : match
        ))
        this.liveMatches = this.liveMatches.map(match => (
          String(match.id) === String(match_id) ? { ...match, markets } : match
        ))
        if (this.selectedMatch && String(this.selectedMatch.id) === String(match_id)) {
          this.selectedMatch = { ...this.selectedMatch, markets }
        }
      })

      // ✅ LISTENER KWA MATCH EVENT UPDATE
      this.socket.on('match_event_update', ({ match_id, event_index, current_event }) => {
        console.log('📅 Event Update:', match_id, 'Event Index:', event_index)
        
        const liveIndex = this.liveMatches.findIndex(m => String(m.id) === String(match_id))
        if (liveIndex !== -1) {
          const liveMatch = { ...this.liveMatches[liveIndex] }
          const events = liveMatch.predetermined_script?.events_timeline || []
          
          if (event_index !== undefined && event_index < events.length) {
            const event = events[event_index]
            if (event.current_score) liveMatch.current_score = { ...event.current_score }
            if (event.minute !== undefined) liveMatch.elapsed_minute = event.minute
            
            if (event.type === 'HALF_TIME') {
              liveMatch.status = 'HALF_TIME'
            } else if (event.type === 'FULL_TIME') {
              liveMatch.status = 'FINISHED'
              this.liveMatches = this.liveMatches.filter(m => String(m.id) !== String(match_id))
              return
            }
          } else if (current_event) {
            if (current_event.current_score) liveMatch.current_score = { ...current_event.current_score }
            if (current_event.minute !== undefined) liveMatch.elapsed_minute = current_event.minute
          }
          
          liveMatch._updatedAt = Date.now()
          this.liveMatches.splice(liveIndex, 1, liveMatch)
          this.liveMatches = [...this.liveMatches]
        }
      })

      // ✅ LISTENER KWA MATCH FINISHED
      this.socket.on('match_finished', ({ match_id, final_score }) => {
        console.log('🏁 Match Finished:', match_id, final_score)
        
        this.liveMatches = this.liveMatches.filter(m => String(m.id) !== String(match_id))

        if (this.selectedMatch && String(this.selectedMatch.id) === String(match_id)) {
          this.selectedMatch = {
            ...this.selectedMatch,
            status: 'FINISHED',
            current_score: final_score ? { home: final_score.homeScore, away: final_score.awayScore } : this.selectedMatch.current_score
          }
        }
      })

      // ✅ LISTENER KWA MATCH STATUS CHANGE
      this.socket.on('match_status_change', ({ match_id, status, match_data }) => {
        console.log('🔄 Status Change:', match_id, status)
        
        if (status === 'LIVE') {
          const upcomingIndex = this.upcomingMatches.findIndex(m => String(m.id) === String(match_id))
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            this.upcomingMatches = [...this.upcomingMatches]

            const liveMatch = { ...movedMatch, status: 'LIVE', ...(match_data || {}) }
            this.liveMatches.push(liveMatch)
            this.liveMatches = [...this.liveMatches]
          }
        } else if (status === 'FINISHED') {
          this.liveMatches = this.liveMatches.filter(m => String(m.id) !== String(match_id))
        }
      })

      console.log('🔌 Socket initialized and listening')
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        console.log('🔌 Socket disconnected')
      }
    },

    getCurrentEvent(matchId) {
      const match = this.liveMatches.find(m => String(m.id) === String(matchId))
      if (!match?.predetermined_script?.events_timeline) return null
      const events = match.predetermined_script.events_timeline
      return events[events.length - 1] || null
    },

    getCurrentMinute(matchId) {
      const match = this.liveMatches.find(m => String(m.id) === String(matchId))
      if (match?.elapsed_minute !== undefined) return match.elapsed_minute
      if (!match?.predetermined_script?.events_timeline) return null
      const events = match.predetermined_script.events_timeline
      const lastEvent = events[events.length - 1]
      return lastEvent?.minute || null
    },

    advanceMatchEvent(matchId, eventIndex) {
      const liveIndex = this.liveMatches.findIndex(m => String(m.id) === String(matchId))
      if (liveIndex === -1) return false
      
      const match = { ...this.liveMatches[liveIndex] }
      const events = match.predetermined_script?.events_timeline || []
      
      if (eventIndex >= 0 && eventIndex < events.length) {
        const event = events[eventIndex]
        if (event.current_score) match.current_score = { ...event.current_score }
        if (event.minute !== undefined) match.elapsed_minute = event.minute
        
        if (event.type === 'HALF_TIME') {
          match.status = 'HALF_TIME'
        } else if (event.type === 'FULL_TIME') {
          match.status = 'FINISHED'
          this.liveMatches = this.liveMatches.filter(m => String(m.id) !== String(matchId))
          return true
        }
        
        match._updatedAt = Date.now()
        this.liveMatches.splice(liveIndex, 1, match)
        this.liveMatches = [...this.liveMatches]
        return true
      }
      return false
    },

    _updateLocalMatch(updatedMatch) {
      let matchIndex = this.upcomingMatches.findIndex(m => String(m.id) === String(updatedMatch.id))
      if (matchIndex !== -1) {
        this.upcomingMatches[matchIndex] = { ...this.upcomingMatches[matchIndex], ...updatedMatch }
        this.upcomingMatches = [...this.upcomingMatches]
      } else {
        matchIndex = this.liveMatches.findIndex(m => String(m.id) === String(updatedMatch.id))
        if (matchIndex !== -1) {
          this.liveMatches[matchIndex] = { ...this.liveMatches[matchIndex], ...updatedMatch }
          this.liveMatches = [...this.liveMatches]
        }
      }

      if (this.selectedMatch && String(this.selectedMatch.id) === String(updatedMatch.id)) {
        this.selectedMatch = { ...this.selectedMatch, ...updatedMatch }
      }
    }
  }
})