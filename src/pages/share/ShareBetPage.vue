<template>
  <div class="min-h-screen bg-gray-950">
    <div class="max-w-2xl mx-auto px-4 pb-10 pt-6">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-3">
        <div class="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm">Loading result...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
        </div>
        <h2 class="text-white text-lg font-bold">Bet not found</h2>
        <p class="text-gray-500 text-sm max-w-sm">{{ errorMessage }}</p>
        <button
          @click="goRegister"
          class="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors"
        >
          Join SunBet &amp; Start Winning
        </button>
      </div>

      <!-- Result -->
      <div v-else-if="bet" class="space-y-4">
        <!-- Result Hero -->
        <div
          class="p-6 rounded-2xl text-center border"
          :class="isWon ? 'bg-gradient-to-b from-green-900/50 to-gray-900 border-green-700/30' :
                   isLost ? 'bg-gradient-to-b from-red-900/40 to-gray-900 border-red-700/30' :
                   'bg-gradient-to-b from-amber-900/40 to-gray-900 border-amber-700/30'"
        >
          <div class="text-6xl mb-3">{{ isWon ? '🏆' : isLost ? '😔' : '⏳' }}</div>
          <h1 class="text-2xl font-extrabold text-white mb-1">
            {{ isWon ? 'This Ticket WON!' : isLost ? 'Not This Time' : 'Still Running' }}
          </h1>
          <p class="text-sm text-gray-400 mb-4">
            {{ isWon ? 'Share this winning feeling!' : isLost ? 'Every bet brings you closer.' : 'This bet is still in progress.' }}
          </p>

          <div v-if="isWon" class="inline-block px-5 py-2 rounded-full bg-green-500/20 border border-green-500/40">
            <span class="text-green-300 font-bold text-lg">+ TZS {{ formatNumber(payout) }}</span>
          </div>

          <div class="mt-4 inline-block px-4 py-1.5 rounded-full text-xs font-bold"
               :class="isWon ? 'bg-green-500/20 text-green-400' : isLost ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'">
            {{ isWon ? 'WON' : isLost ? 'LOST' : 'OPEN' }}
          </div>
        </div>

        <!-- Ticket summary -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <span class="text-xs uppercase tracking-wider text-gray-500 font-medium">Ticket</span>
            <span class="font-mono text-sm text-gray-300">{{ bet.ticket_code }}</span>
          </div>
          <div class="grid grid-cols-3 divide-x divide-gray-800 text-center py-4">
            <div>
              <p class="text-[10px] uppercase text-gray-500">Stake</p>
              <p class="text-white font-bold text-sm mt-1">TZS {{ formatNumber(bet.stake) }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase text-gray-500">Odds</p>
              <p class="text-white font-bold text-sm mt-1">{{ totalOdds.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase text-gray-500">Payout</p>
              <p class="text-emerald-400 font-bold text-sm mt-1">TZS {{ formatNumber(payout) }}</p>
            </div>
          </div>
        </div>

        <!-- Selections -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 class="text-sm font-bold text-white mb-3">Selections ({{ selections.length }})</h3>
          <div class="space-y-2">
            <div
              v-for="(sel, i) in selections"
              :key="i"
              class="bg-gray-800/60 border border-gray-800 rounded-xl p-3"
            >
              <p class="text-sm text-gray-200 font-medium">{{ sel.home_team || 'Home' }} <span class="text-gray-500 text-xs">vs</span> {{ sel.away_team || 'Away' }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ sel.league }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-400">{{ marketTitle(sel.market_key) }} - <span class="text-gray-200 font-semibold">{{ outcomeLabel(sel.outcome_key) }}</span></span>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">@{{ Number(sel.odds_at_placement).toFixed(2) }}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded"
                    :class="sel.status === 'WON' ? 'bg-green-500/20 text-green-400' : sel.status === 'LOST' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'">
                    {{ sel.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="pt-2 space-y-3">
          <p v-if="!isWon" class="text-center text-xs text-gray-500">Think you can do better? Give it a try!</p>
          <button
            @click="goRegister"
            class="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-extrabold text-base tracking-wide hover:opacity-90 transition-opacity"
          >
            {{ isWon ? '🎉 Join &amp; Win Too' : '🚀 Join SunBet &amp; Start Betting' }}
          </button>
          <p class="text-center text-[10px] text-gray-600">18+ · Play responsibly · Terms apply</p>
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

const stakeAmount = computed(() => parseFloat(bet.value?.stake) || 0)
const totalOdds = computed(() => parseFloat(bet.value?.totalOdds || bet.value?.total_odds) || 1)
const potentialWin = computed(() => Math.round(stakeAmount.value * (totalOdds.value - 1)))
const tax = computed(() => Math.round(potentialWin.value * 0.12))
const payout = computed(() => Math.round(potentialWin.value - tax.value) + stakeAmount.value)

const result = computed(() => (bet.value?.result || '').toUpperCase())
const isWon = computed(() => result.value === 'WON' && (bet.value?.status || '').toUpperCase() !== 'OPEN')
const isLost = computed(() => ['LOST', 'CANCELLED'].includes(result.value))

const formatNumber = (v) => {
  const n = parseFloat(v)
  if (isNaN(n)) return '0.00'
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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

const goRegister = () => {
  router.push({ name: 'register', query: { redirect: route.fullPath } })
}

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
