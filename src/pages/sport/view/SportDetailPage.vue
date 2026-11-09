<!-- SportDetailPage.vue - SunBet Theme (Rose & Gray) -->
<template>
  <div class="min-h-screen pb-16 bg-slate-50 text-slate-700">
    <!-- Back Button & Header -->
    <div class="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div class="flex items-center justify-between relative">
          <!-- Back Button -->
          <button 
            @click="goBack"
            class="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <!-- Center Content -->
          <div class="text-center flex-1 px-2">
            <h1 class="text-sm sm:text-base font-semibold text-slate-900 truncate" v-if="matchData">
              Match details
            </h1>
            <p class="text-xs text-slate-500 font-medium truncate" v-if="matchData">{{ matchData.league }}</p>
          </div>

          <div class="w-9"></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!matchData" class="max-w-4xl mx-auto px-3 mt-10 text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mb-3"></div>
      <p class="text-sm font-medium text-slate-500">Loading match details...</p>
    </div>

    <!-- Match Details Content -->
    <div v-else class="max-w-4xl mx-auto px-3 mt-4 sm:mt-6 space-y-4">
      
      <!-- Match Banner Card -->
      <div class="bg-white rounded-2xl p-4 sm:p-6">
        <div class="flex flex-col items-center">
          
          <!-- Status & Live Time Badge -->
          <div class="mb-3">
            <span v-if="isLive" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> LIVE {{ displayTime }}
            </span>
            <span v-else-if="matchData.status === 'HALF_TIME'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
              HT
            </span>
            <span v-else-if="matchData.status === 'FINISHED'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              FT
            </span>
            <span v-else class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              ⏳ {{ displayTime }}
            </span>
          </div>

          <!-- Teams & Score -->
          <div class="flex items-center justify-between w-full max-w-xl gap-2">
            <!-- Home Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-100 flex items-center justify-center text-sm sm:text-xl font-bold text-rose-700 mb-2">
                {{ getTeamInitials(matchData.homeTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">{{ matchData.homeTeam }}</span>
              <span v-if="isLiveOrFinished" class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{{ matchData.score?.home ?? 0 }}</span>
            </div>

            <!-- VS -->
            <div class="flex flex-col items-center px-2">
              <span class="text-[11px] font-semibold tracking-wide text-slate-400">VS</span>
              <span class="text-[10px] text-slate-500 mt-2 text-center">{{ matchData.date }}</span>
            </div>

            <!-- Away Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-100 flex items-center justify-center text-sm sm:text-xl font-bold text-rose-700 mb-2">
                {{ getTeamInitials(matchData.awayTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">{{ matchData.awayTeam }}</span>
              <span v-if="isLiveOrFinished" class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{{ matchData.score?.away ?? 0 }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- DYNAMIC BETTING MARKETS LIST -->
      <div class="space-y-3">
        <p v-if="apiMarketsLoading" class="text-center text-sm font-medium text-slate-500 py-2">
          Loading markets...
        </p>

        <div
          v-if="!apiMarketsLoading && formattedMarkets.length === 0"
          class="bg-white rounded-xl px-4 py-8 text-center text-sm text-slate-500"
        >
          Markets are not available for this match yet.
        </div>

        <div 
          v-for="market in formattedMarkets" 
          :key="market.key"
          class="bg-white rounded-xl p-3 sm:p-4"
        >
          <!-- Market Header Title -->
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm sm:text-base font-semibold text-slate-800">
              {{ market.title }}
            </h3>
          </div>

          <!-- Market Odds Grid -->
          <div 
            class="grid gap-2"
            :class="getGridColsClass(market.key, market.options.length)"
          >
            <button 
              v-for="opt in market.options"
              :key="opt.key"
              @click="handleOddsClick(market.key, opt.key, opt.value, market.title, opt.label)"
              :disabled="market.readOnly || isSelectionLocked(opt.value, market.key)"
              class="relative flex justify-between items-center px-3 py-2.5 rounded-sm transition-colors duration-200 text-left active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              :class="[
                getOddButtonClass(market.key, opt.key),
                (market.readOnly || isSelectionLocked(opt.value, market.key)) && 'cursor-not-allowed opacity-75'
              ]"
            >
              <span class="relative z-10 text-xs font-bold truncate pr-1" :class="getLabelClass(market.key, opt.key)">
                {{ opt.label || formatOptionLabel(opt.key, market.key) }}
              </span>
              <span
                v-if="!isMarketOddsHidden(market.key) && !market.readOnly && !isSelectionLocked(opt.value, market.key)"
                class="relative z-10 text-xs sm:text-sm font-black font-mono ml-auto"
              >{{ formatOdds(opt.value) }}</span>
              <svg
                v-if="market.readOnly || isSelectionLocked(opt.value, market.key)"
                class="relative z-10 ml-1 h-3.5 w-3.5 shrink-0 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-label="Market locked"
                title="Market locked"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
              </svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../../stores/bet/betStore.js'
import { useMatchStore } from '../../../stores/match/useMatchStore.js'
import { useMinuteClock } from '../../../composables/useMinuteClock.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()
const matchStore = useMatchStore()
const currentTime = useMinuteClock()
const apiMarkets = ref(null)
const apiMarketsLoading = ref(false)
let apiMarketsRequestId = 0

const matchId = computed(() => route.params.id || route.query.id)

const formatOdds = (val) => {
  const num = parseFloat(val)
  return isNaN(num) ? val : num.toFixed(2)
}

// Tafuta match kutoka Store
const rawMatch = computed(() => {
  if (!matchId.value) return null
  return matchStore.upcomingMatches.find(m => m.id == matchId.value) ||
         matchStore.liveMatches.find(m => m.id == matchId.value) || null
})

watch(
  () => rawMatch.value?.source === 'FOOTBALL_API' ? rawMatch.value.external_id : null,
  async (externalId) => {
    const requestId = ++apiMarketsRequestId
    apiMarkets.value = null
    apiMarketsLoading.value = Boolean(externalId)
    if (!externalId) return

    try {
      const markets = await matchStore.fetchFootballApiMarkets(externalId, rawMatch.value?.status)
      if (requestId === apiMarketsRequestId) {
        apiMarkets.value = markets
      }
    } catch (error) {
      if (requestId === apiMarketsRequestId) {
        console.error('[SPORT DETAIL] Market loading failed:', error)
      }
    } finally {
      if (requestId === apiMarketsRequestId) {
        apiMarketsLoading.value = false
      }
    }
  },
  { immediate: true }
)

// General match information
const matchData = computed(() => {
  if (!rawMatch.value) return null
  const m = rawMatch.value
  return {
    id: m.id,
    homeTeam: m.home_team || m.homeTeam,
    awayTeam: m.away_team || m.awayTeam,
    league: m.league,
    time: m.time || m.match_time || '',
    date: m.date || m.match_date || '',
    elapsed_minute: m.elapsed_minute ?? m.current_minute,
    status: m.status || (m.live ? 'LIVE' : 'UPCOMING'),
    live: m.status === 'LIVE' || m.live || false,
    score: m.current_score || m.score || { home: 0, away: 0 }
  }
})

const isLive = computed(() => matchData.value?.status === 'LIVE' || matchData.value?.live || false)

const isLiveOrFinished = computed(() => {
  if (!matchData.value) return false
  return isLive.value || ['HALF_TIME', 'FINISHED'].includes(matchData.value.status)
})

// ============================================
// 📅 HELPER FUNCTION FOR UPCOMING TIME FORMATTING
// ============================================
function formatUpcomingTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return matchData.value?.time || ''

  try {
    let matchDateObj

    if (dateStr && timeStr) {
      matchDateObj = new Date(`${dateStr}T${timeStr}`)
      if (isNaN(matchDateObj.getTime())) {
        matchDateObj = new Date(`${dateStr} ${timeStr}`)
      }
    } else if (dateStr) {
      matchDateObj = new Date(dateStr)
    } else {
      return timeStr
    }

    if (isNaN(matchDateObj.getTime())) {
      return timeStr || dateStr
    }

    const today = new Date()
    const isToday =
      matchDateObj.getDate() === today.getDate() &&
      matchDateObj.getMonth() === today.getMonth() &&
      matchDateObj.getFullYear() === today.getFullYear()

    const timeFormatted = matchDateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    if (isToday) {
      return `${timeFormatted} Today`
    } else {
      const dayName = matchDateObj.toLocaleDateString('en-US', { weekday: 'short' })
      const dayNum = String(matchDateObj.getDate()).padStart(2, '0')
      const monthNum = String(matchDateObj.getMonth() + 1).padStart(2, '0')

      return `${timeFormatted} ${dayName} ${dayNum}/${monthNum}`
    }
  } catch (err) {
    return timeStr || dateStr || ''
  }
}

// ============================================
// ⏱️ REALTIME COMPUTED TIME (MATCHCARD / BOOMBET LOGIC)
// ============================================
const displayTime = computed(() => {
  if (!matchData.value) return ''

  if (isLive.value) {
    // 1. Kama Socket au Store ina elapsed_minute
    if (matchData.value.elapsed_minute !== undefined && matchData.value.elapsed_minute !== null) {
      const elapsed = parseInt(matchData.value.elapsed_minute)
      return elapsed >= 90 ? "90+'" : `${elapsed}'`
    }

    // 2. Kama time ina string yenye dakika (mfano "35'")
    if (typeof matchData.value.time === 'string' && matchData.value.time.includes("'")) {
      return matchData.value.time
    }

    // 3. Clock time calculation
    if (matchData.value.date && matchData.value.time && matchData.value.time.includes(':')) {
      const matchStart = new Date(`${matchData.value.date} ${matchData.value.time}`)
      const elapsedMinutes = Math.floor((currentTime.value - matchStart) / (1000 * 60))

      if (!isNaN(elapsedMinutes) && elapsedMinutes >= 0) {
        return elapsedMinutes >= 90 ? "90+'" : `${elapsedMinutes}'`
      }
    }

    return 'LIVE'
  }

  if (matchData.value.status === 'HALF_TIME') return 'HT'
  if (matchData.value.status === 'FINISHED') return 'FT'

  // UPCOMING MATCH DISPLAY FORMAT
  return formatUpcomingTime(matchData.value.date, matchData.value.time)
})

// Majina ya Masoko kwa Kiingereza/Kiswahili Kizuri cha Betting
const marketTitleMap = {
  '1X2': '1X2 | Full Time',
  'Double_Chance': 'Double Chance | Full Time',
  'BTTS': 'Both Teams To Score | Full Time',
  'Over_Under': 'Over/Under | Full Time',
  'Draw_No_Bet': 'Draw No Bet | Full Time',
  'Asian_Handicap': 'Asian Handicap',
  'Corner_Line': 'Corners Over / Under',
  'Corner_Asian': 'Asian Handicap (Corners)',
  'Card_Line': 'Cards Over / Under',
  'Card_Asian': 'Asian Handicap (Cards)',
  'Asian_Handicap_Half': 'Asian Handicap (1st Half)',
  'Goal_Line_Half': 'Goals Over / Under (1st Half)',
  'Corner_Line_Half': 'Corners Over / Under (1st Half)',
  'Goal_Line_Fixed': 'Fixed Goal Lines',
  'Correct_Score': 'Correct Score',
  'Handicap': 'Handicap',
  'HT_FT': 'Half Time / Full Time',
  'BTTS_Win': 'BTTS & Match Result',
  'Odd_Even': 'Total Goals (Odd/Even)',
  'Total_Goals': 'Exact Total Goals',
  'Both_Halves': 'Goals In Both Halves',
  'First_Last_Goal': 'First / Last Goal Scorer',
  'Highest_Scoring_Half': 'Highest Scoring Half',
  'Clean_Sheet': 'Clean Sheet'
}

// Kanuni za Mpangilio wa Masoko (Array ya Vipaumbele)
const optionOrderMap = {
  '1X2': ['1', 'X', '2'],
  'Double_Chance': ['1X', '12', 'X2'],
  'BTTS': ['YES', 'NO', 'Yes', 'No'],
  'Over_Under': ['OVER', 'UNDER', 'Over', 'Under']
}

const BETTABLE_MARKETS = new Set([
  '1X2',
  'Double_Chance',
  'BTTS',
  'Over_Under',
  'Draw_No_Bet',
  'Correct_Score',
  'Total_Goals',
  'BTTS_Win',
  'Odd_Even',
  'Clean_Sheet'
])
const LATE_LOCKED_MARKETS = new Set([
  'Correct_Score',
  'Total_Goals',
  'BTTS_Win',
  'Odd_Even'
])

const marketKeyForTitle = (title) => {
  const exactTitles = {
    '1X2 | Full Time': '1X2',
    'Double Chance | Full Time': 'Double_Chance',
    'Both Teams To Score | Full Time': 'BTTS',
    'Over/Under | Full Time': 'Over_Under',
    'Draw No Bet | Full Time': 'Draw_No_Bet',
    'Correct Score | Full Time': 'Correct_Score',
    'Total Goals Exact | Full Time': 'Total_Goals',
    '1X2 and Both Teams To Score | Full Time': 'BTTS_Win',
    'Odd/Even | Full Time': 'Odd_Even',
    'Asian Handicap | Full Time': 'Asian_Handicap',
    'Asian Handicap | First Half': 'Asian_Handicap_Half',
    'Total Corners Over/Under | Full Time': 'Corner_Line',
    'Total Corners Over/Under | First Half': 'Corner_Line_Half',
    'Corner Asian Handicap | Full Time': 'Corner_Asian',
    'Total Bookings Over/Under | Full Time': 'Card_Line',
    'Card Asian Handicap | Full Time': 'Card_Asian',
    'Fixed Goal Lines': 'Goal_Line_Fixed',
    'Over/Under | First Half': 'Goal_Line_Half'
  }
  if (exactTitles[title]) return exactTitles[title]
  if (title.startsWith('Clean Sheet | ') && title.endsWith(' | Full Time')) return 'Clean_Sheet'
  return null
}

const selectionKeyForMarketArray = (market, selectionName) => {
  if (market.key === 'Over_Under' || market.key === 'Goal_Line_Half'
    || market.key === 'Corner_Line' || market.key === 'Corner_Line_Half'
    || market.key === 'Card_Line' || market.key === 'Goal_Line_Fixed') {
    const match = selectionName.match(/^(Over|Under)\s+(.+)$/i)
    if (match) return `${match[1].toUpperCase()}_${match[2]}`
  }

  if (market.key === 'BTTS_Win') {
    const match = selectionName.match(/^(1|X|2) & (Yes|No)$/)
    if (match) {
      const result = match[1] === '1' ? 'Home' : match[1] === '2' ? 'Away' : 'Draw'
      return `${result}_${match[2]}`
    }
  }

  if (market.key === 'Clean_Sheet') {
    const side = market.title.includes(`| ${matchData.value.homeTeam} |`) ? 'Home' : 'Away'
    return `${side}_${selectionName}`
  }

  return selectionName
}

const isImpossibleCorrectScore = (marketKey, selectionName) => {
  if (marketKey !== 'Correct_Score' || !['LIVE', 'HALF_TIME'].includes(matchData.value?.status)) {
    return false
  }

  const scoreline = String(selectionName).match(/^(\d+)[-_](\d+)$/)
  const currentHome = Number(matchData.value?.score?.home)
  const currentAway = Number(matchData.value?.score?.away)
  if (!scoreline || !Number.isFinite(currentHome) || !Number.isFinite(currentAway)) return false

  return Number(scoreline[1]) < currentHome || Number(scoreline[2]) < currentAway
}

const formattedMarkets = computed(() => {
  if (!rawMatch.value) return []
  const apiMarketsAvailable = rawMatch.value.source === 'FOOTBALL_API'
    && Array.isArray(apiMarkets.value)
    && apiMarkets.value.length > 0
  const storedMarkets = apiMarketsAvailable
    ? apiMarkets.value
    : Array.isArray(rawMatch.value.markets) && rawMatch.value.markets.length > 0
      ? rawMatch.value.markets
      : rawMatch.value.odds

  if (Array.isArray(storedMarkets)) {
    return storedMarkets.map((market, index) => {
      const key = marketKeyForTitle(market.market)
      const normalizedMarket = { key, title: market.market }
      const options = (market.selections || [])
        .filter((selection) => (
          Number.isFinite(Number(selection.odds))
          && Number(selection.odds) > 1
          && !isImpossibleCorrectScore(key, selection.name)
        ))
        .map((selection) => ({
          key: key ? selectionKeyForMarketArray(normalizedMarket, selection.name) : selection.name,
          label: selection.name,
          value: Number(selection.odds)
        }))

      return {
        key: key || `market-${index}`,
        title: market.market,
        options,
        readOnly: !BETTABLE_MARKETS.has(key)
      }
    }).filter((market) => market.options.length > 0)
  }

  const oddsObj = rawMatch.value.odds
  if (!oddsObj || typeof oddsObj !== 'object') return []

  return Object.keys(oddsObj).map(marketKey => {
    const rawOptions = oddsObj[marketKey] || {}
    const optionsArray = []
    const addOption = (key) => {
      const value = rawOptions[key]
      const numericValue = Number(value)
      if (value !== null && value !== undefined && value !== ''
        && Number.isFinite(numericValue) && numericValue > 1
        && !isImpossibleCorrectScore(marketKey, key)) {
        optionsArray.push({ key, value })
      }
    }
    
    if (optionOrderMap[marketKey]) {
      const preferredOrder = optionOrderMap[marketKey]
      
      preferredOrder.forEach(key => {
        addOption(key)
      })

      Object.keys(rawOptions).forEach(key => {
        if (!preferredOrder.includes(key)) {
          addOption(key)
        }
      })
    } else {
      Object.keys(rawOptions).forEach(key => {
        addOption(key)
      })
    }

    return {
      key: marketKey,
      title: marketTitleMap[marketKey] || marketKey.replace(/_/g, ' '),
      options: optionsArray,
      readOnly: !BETTABLE_MARKETS.has(marketKey)
    }
  }).filter(market => market.options.length > 0)
})

const getGridColsClass = (marketKey, totalOptions) => {
  if (marketKey === '1X2' || marketKey === 'Double_Chance' || marketKey === 'Highest_Scoring_Half') {
    return 'grid-cols-3'
  }
  if (marketKey === 'Correct_Score' || marketKey === 'HT_FT') {
    return 'grid-cols-2 sm:grid-cols-4'
  }
  if (marketKey === 'Over_Under' || marketKey === 'BTTS' || marketKey === 'Odd_Even') {
    return 'grid-cols-2'
  }
  if (totalOptions > 4) {
    return 'grid-cols-2 sm:grid-cols-3'
  }
  return 'grid-cols-2'
}

const formatOptionLabel = (optionKey, marketKey) => {
  if (marketKey === '1X2') {
    if (optionKey === '1') return `1 `
    if (optionKey === 'X') return 'X '
    if (optionKey === '2') return `2 `
  }
  
  return optionKey
    .replace(/_/g, ' ')
    .replace('OVER', 'Over')
    .replace('UNDER', 'Under')
}

// Slip Checker
const isSelected = (marketKey, optionKey) => {
  if (!matchData.value) return false
  const fullMarketKey = `${matchData.value.id}_${marketKey}_${optionKey}`
  return betStore.isSelected(matchData.value.id, fullMarketKey)
}

const getOddButtonClass = (marketKey, optionKey) => {
  if (isSelected(marketKey, optionKey)) {
    return 'border border-emerald-500 bg-emerald-800/60 text-white font-black'
  }
  return 'bg-slate-50 text-slate-700 hover:bg-rose-50'
}

const getLabelClass = (marketKey, optionKey) => {
  return isSelected(marketKey, optionKey) ? 'text-white' : 'text-slate-700'
}

const isLateMarketLocked = (marketKey) => {
  const status = matchData.value?.status
  if (!['LIVE', 'HALF_TIME'].includes(status)) return false
  const minute = getCurrentMatchMinute()
  return Number.isFinite(minute) && minute >= 85 && LATE_LOCKED_MARKETS.has(marketKey)
}

const isAllMarketsLocked = () => {
  const status = matchData.value?.status
  if (!['LIVE', 'HALF_TIME'].includes(status)) return false
  const minute = getCurrentMatchMinute()
  return Number.isFinite(minute) && minute >= 90
}

const getCurrentMatchMinute = () => {
  const storedMinute = String(matchData.value?.elapsed_minute ?? '').match(/(?:^|\|\s*)(\d+)/)
  if (storedMinute) return Number(storedMinute[1])

  const displayedMinute = String(displayTime.value).match(/(?:^|\|\s*)(\d+)/)
  return displayedMinute ? Number(displayedMinute[1]) : null
}

const isMarketOddsHidden = (marketKey) => (
  ['FINISHED', 'CANCELLED'].includes(matchData.value?.status)
  || isAllMarketsLocked()
  || isLateMarketLocked(marketKey)
)

const isSelectionLocked = (odds, marketKey) => {
  const status = matchData.value?.status
  if (['FINISHED', 'CANCELLED'].includes(status)) return true
  if (!['LIVE', 'HALF_TIME'].includes(status)) return false
  const minute = getCurrentMatchMinute()
  if (!Number.isFinite(minute)) return false
  if (minute >= 90) return true
  if (minute < 85) return false
  return LATE_LOCKED_MARKETS.has(marketKey) || Number(odds) <= 1.15
}

// Handle Add/Remove Bet Slip
const handleOddsClick = (marketKey, optionKey, oddsValue, marketTitle, selectionLabel) => {
  if (!matchData.value || !oddsValue) return
  if (!BETTABLE_MARKETS.has(marketKey)) return
  if (isSelectionLocked(oddsValue, marketKey)) return
  const odds = parseFloat(oddsValue)
  if (isNaN(odds)) return

  const fullMarketKey = `${matchData.value.id}_${marketKey}_${optionKey}`
  const label = selectionLabel || formatOptionLabel(optionKey, marketKey)

  betStore.addToSlip({
    matchId: matchData.value.id,
    matchName: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
    market: marketTitle,
    pick: `${marketTitle} - ${label}`,
    marketKey: fullMarketKey,
    market_key: marketKey,
    outcome_key: optionKey,
    odds: odds,
  })
}

const getTeamInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const goBack = () => router.back()

onMounted(() => {
  if (matchStore.upcomingMatches.length === 0 && matchStore.liveMatches.length === 0) {
    matchStore.fetchAllMatches()
  }
})
</script>
