<template>
  <div class="p-0 bg-gray-100">
    <div class="max-w-2xl mx-auto px-1 py-3">
      
      <!-- Bet Code Header -->
      <div class="px-0 py-1 bg-white flex items-center justify-between">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-gray-950 font-mono font-bold text-sm tracking-wider">
            {{ bet?.ticket_code || route.params.ticketCode }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white border border-gray-200 rounded-xl p-8">
        <div class="flex items-center justify-center gap-3">
          <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-500">Loading result...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
          <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
        </div>
        <p class="text-gray-500 font-medium">Bet not found</p>
        <p class="text-gray-400 text-sm mt-2 max-w-sm mx-auto">{{ errorMessage }}</p>
        <button
          @click="goRegister"
          class="mt-4 px-6 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors"
        >
          Join SunBet &amp; Start Winning
        </button>
      </div>

      <!-- Bet Details -->
      <div v-else-if="bet" class="space-y-0">
        
        <!-- Status Banner -->
        <div 
          class="p-3 rounded-t-xl flex items-center justify-between"
          :class="isWon ? 'bg-gradient-to-r from-green-900/40 to-green-950/40 border-t border-green-700/30' : 
                   isLost ? 'bg-gradient-to-r from-red-900/90 to-red-950/80 border border-red-700/30' : 
                   isCashedOut ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-950/40 border-t border-emerald-700/30' :
                   'bg-gradient-to-r from-amber-900/40 to-amber-950/40 border-t border-amber-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ isWon ? '🏆' : isLost ? '😔' : isCashedOut ? '💰' : '⏳' }}</span>
            <div>
              <p class="text-white font-semibold text-sm my-5">
                {{ isWon ? 'Bet Won!' : isLost ? 'Bet Lost' : isCashedOut ? 'Bet Cashed Out!' : 'Bet in Progress' }}
              </p>
              <p class="text-xs text-gray-100">
                {{ isWon ? 'Congratulations on your win!' : isLost ? 'Better luck next time!' : isCashedOut ? 'You locked in your payout early' : 'Waiting for results...' }}
              </p>
            </div>
          </div>
          <span 
            class="px-4 py-3 text-xs font-bold rounded-full"
            :class="isWon ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                     isLost ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                     isCashedOut ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                     'bg-amber-500/20 text-amber-400 border border-amber-500/30'"
          >
            {{ isWon ? 'WON' : isLost ? 'LOST' : isCashedOut ? 'CASHED OUT' : 'OPEN' }}
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white border-b border-gray-200 rounded-b-xl overflow-hidden">
          
          <!-- Stats -->
          <div class="">
            <!-- Total Odds -->
            <div class="flex items-center justify-between px-2 pt-2">
              <p class="text-[10px] uppercase tracking-wider text-gray-950 font-medium">Total Odds</p>
              <p class="text-gray-600 font-bold text-xs">{{ totalOdds.toFixed(2) }}</p>
            </div>
            
            <!-- Stake -->
            <div class="flex items-center justify-between px-2 py-0.5">
              <p class="text-[10px] uppercase tracking-wider text-gray-950 font-medium">Stake</p>
              <p class="text-gray-600 font-bold text-xs">TZS {{ formatNumber(stakeAmount) }}</p>
            </div>
            
            <!-- Potential Win -->
            <div class="flex items-center justify-between px-2 py-0.5">
              <p class="text-[10px] uppercase tracking-wider text-gray-950 font-medium">Potential Win</p>
              <p class="text-gray-600 font-bold text-xs">TZS {{ formatNumber(potentialWin) }}</p>
            </div>
            
            <!-- Tax -->
            <div class="flex items-center justify-between px-2 pb-2">
              <p class="text-[10px] uppercase tracking-wider text-gray-950 font-medium">Tax (12%)</p>
              <p class="text-gray-600 font-semibold text-xs">- TZS {{ formatNumber(tax) }}</p>
            </div>
          </div>

          <!-- Net Payout -->
          <div class="px-4 py-4 bg-gradient-to-r from-emerald-800/80 to-emerald-800/80 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-100 font-bold">Payout</p>
              <div class="text-right">
                <p class="text-green-100 font-bold text-sm">
                  TZS {{ formatNumber(payout) }}
                </p>
                <span v-if="resultLabel" class="text-xs font-semibold" :class="isWon ? 'text-green-400' : isLost ? 'text-red-400' : 'text-emerald-400'">
                  {{ resultLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selections -->
        <div v-if="selections.length > 0" class="mt-0 p-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
              Selections
            </h3>
            <span class="text-xs text-gray-500 font-medium">{{ selections.length }} picks</span>
          </div>
          
          <div class="space-y-1">
            <div 
              v-for="(sel, index) in selections" 
              :key="index"
              class="bg-white p-1 flex flex-col group border-amber-600/20 transition-all border-b border-gray-200"
            >
              <div class="flex justify-between items-center">
                <p class="text-[#A7A7A7] font-medium text-xs">{{ sel.home_team || 'Home' }} vs {{ sel.away_team || 'Away' }}</p>
                <span class="text-[#8E8E8E] font-bold text-sm px-1 py-1 rounded-lg">{{ Number(sel.odds_at_placement).toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-1">
                <span class="text-xs text-gray-500 font-bold truncate">{{ sel.league || '' }}</span>
                <span class="text-xs text-gray-500 font-semibold">
                  <span class="text-xs text-gray-400 font-bold px-1">—</span>
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 font-semibold">
                  {{ marketTitle(sel.market_key) }} - 
                  <span class="text-[#F2E4E4] font-medium">{{ outcomeLabel(sel.outcome_key) }}</span>
                </span>
                <span 
                  class="text-xs font-semibold px-2 py-0.5 rounded"
                  :class="getResultClass(sel.status)"
                >
                  {{ sel.status || 'PENDING' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Selections -->
        <div v-else class="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-center">
          <p class="text-gray-500 text-sm">No selections found for this bet.</p>
        </div>

        <!-- CTA -->
        <div class="mt-5 bg-white border border-gray-200 p-4">
          <p v-if="!isWon" class="text-center text-xs text-gray-500 mb-3">Think you can do better? Give it a try!</p>
          <button
            @click="goRegister"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-extrabold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            {{ isWon ? 'Join & Win Too' : 'Join SunBet & Start Betting' }}
          </button>
          <p class="text-center text-[10px] text-gray-400 mt-2">18+ · Play responsibly · Terms apply</p>
        </div>

        <div class="flex flex-col items-center justify-center text-center py-2">
          <span class="text-gray-400 text-[13px] font-bold">All Bets are accepted and settled in accordance with <span class="text-gray-400 text-xs">our <span class="underline">Terms and Conditions</span> and <span class="underline">Rules</span> </span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BetService from '../../services/bet/bet.service'

const route = useRoute()
const router = useRouter()

const bet = ref(null)
const selections = ref([])
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// ---- Market Titles ----
const marketTitles = {
  '1X2': '1X2 | Full Time',
  'Double_Chance': 'Double Chance | Full Time',
  'Double Chance': 'Double Chance | Full Time',
  'BTTS': 'Both Teams To Score | Full Time',
  'Over_Under': 'Over/Under | Full Time',
  'Over/Under': 'Over/Under | Full Time',
  'Correct_Score': 'Correct Score | Full Time',
  'Correct Score': 'Correct Score | Full Time',
  'Handicap': 'Handicap | Full Time',
  'HT_FT': 'Half Time/Full Time',
  'BTTS_Win': 'BTTS & Match Result',
  'Odd_Even': 'Total Goals (Odd/Even)',
  'Total_Goals': 'Exact Total Goals',
  'Both_Halves': 'Goals In Both Halves',
  'First_Last_Goal': 'First/Last Goal',
  'Highest_Scoring_Half': 'Highest Scoring Half',
  'Clean_Sheet': 'Clean Sheet'
}

const marketTitle = (key) => {
  const clean = typeof key === 'string' ? key.split('|')[0].trim() : ''
  return marketTitles[clean] || marketTitles[key] || key || '1X2 | Full Time'
}

const titleCaseWord = (w) => {
  if (w === undefined || w === null || w === '') return ''
  return String(w).charAt(0).toUpperCase() + String(w).slice(1).toLowerCase()
}

const outcomeLabel = (key) => {
  if (key === undefined || key === null) return ''
  const o = String(key)
  if (o === '1') return '1'
  if (o === 'X') return 'Draw'
  if (o === '2') return '2'
  if (/^OVER\b/i.test(o)) return 'Over ' + o.replace(/^OVER[_ ]*/i, '').trim()
  if (/^UNDER\b/i.test(o)) return 'Under ' + o.replace(/^UNDER[_ ]*/i, '').trim()
  const joined = o.split('_').map((p) => {
    if (/^[+\-]?\d+(\.\d+)?$/.test(p) || /^[0-9.]+[+]?$/.test(p)) return p
    return titleCaseWord(p)
  }).join(' ')
  return joined.trim()
}

// ---- Result Class ----
const getResultClass = (status) => {
  if (status === 'WON') return 'bg-green-500/20 text-green-400 border border-green-500/20'
  if (status === 'LOST') return 'bg-red-500/20 text-red-400 border border-red-500/20'
  return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
}

// ---- Computed ----
const betStatus = computed(() => {
  if (!bet.value) return 'unknown'
  
  const status = (bet.value.status || '').toUpperCase()
  const result = (bet.value.result || '').toUpperCase()
  
  if (status === 'SETTLED') {
    if (result === 'WON') return 'won'
    if (result === 'LOST') return 'lost'
    if (result === 'CASHED_OUT') return 'cashed-out'
    return 'settled'
  }
  
  if (status === 'OPEN' || status === 'PENDING') {
    return 'open'
  }
  
  if (result === 'WON') return 'won'
  if (result === 'LOST') return 'lost'
  
  return 'unknown'
})

const isWon = computed(() => betStatus.value === 'won')
const isLost = computed(() => betStatus.value === 'lost')
const isOpen = computed(() => betStatus.value === 'open')
const isCashedOut = computed(() => betStatus.value === 'cashed-out')

const resultLabel = computed(() => {
  if (isWon.value) return 'WON'
  if (isLost.value) return 'LOST'
  if (isCashedOut.value) return 'CASHED OUT'
  return ''
})

// ---- Bet Calculations ----
const stakeAmount = computed(() => {
  if (!bet.value) return 0
  return parseFloat(bet.value.stake) || 0
})

const totalOdds = computed(() => {
  if (!bet.value) return 0
  const odds = parseFloat(bet.value.total_odds) || parseFloat(bet.value.totalOdds) || parseFloat(bet.value.odds) || 1.00
  return odds
})

const potentialWin = computed(() => {
  const dbValue = parseFloat(bet.value?.possible_win)
  if (!isNaN(dbValue) && dbValue > 0) return dbValue
  if (!stakeAmount.value || !totalOdds.value) return 0
  return Math.round(stakeAmount.value * (totalOdds.value - 1))
})

const tax = computed(() => {
  const dbValue = parseFloat(bet.value?.tax)
  if (!isNaN(dbValue) && dbValue > 0) return dbValue
  if (!potentialWin.value) return 0
  return Math.round(potentialWin.value * 0.12)
})

const payout = computed(() => {
  if (!bet.value) return 0
  if (isLost.value) return 0
  if (!isOpen.value) {
    const actual = parseFloat(bet.value.cashout_amount) || parseFloat(bet.value.payout)
    return isNaN(actual) ? 0 : actual
  }
  const dbValue = parseFloat(bet.value.payout)
  if (!isNaN(dbValue) && dbValue > 0) return dbValue
  if (!potentialWin.value) return 0
  return Math.round((potentialWin.value - tax.value) + stakeAmount.value)
})

// ---- Helpers ----
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  const num = parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// ---- Map Selections ----
const mapSelections = (raw) => {
  return (raw || []).map((sel) => {
    const m = sel.match || {}
    return {
      home_team: m.home_team || '',
      away_team: m.away_team || '',
      league: m.league || '',
      market_key: sel.market_key || sel.market || '1X2',
      outcome_key: sel.outcome_key || sel.pick || '',
      odds_at_placement: sel.odds_at_placement || sel.odds || 1,
      status: sel.status || 'PENDING'
    }
  })
}

// ---- Register ----
const goRegister = () => {
  router.push({ name: 'register', query: { redirect: route.fullPath } })
}

// ---- Load Ticket ----
const loadTicket = async () => {
  const ticketCode = route.params.ticketCode
  if (!ticketCode) {
    error.value = true
    errorMessage.value = 'Missing ticket code.'
    loading.value = false
    return
  }

  try {
    const response = await BetService.getBetByTicketCode(ticketCode)
    if (response?.success && response.data) {
      bet.value = response.data
      selections.value = mapSelections(response.data.selections)
    } else {
      error.value = true
      errorMessage.value = response?.message || 'This ticket could not be found or has expired.'
    }
  } catch (e) {
    error.value = true
    errorMessage.value = e?.message || 'Unable to load this ticket.'
  } finally {
    loading.value = false
  }
}

onMounted(loadTicket)
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
