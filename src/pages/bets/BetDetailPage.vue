<template>
  <div class="p-0 bg-gray-100">
    <div class="max-w-2xl mx-auto px-1 py-3">
      
      <!-- Bet ID Header -->
      <div class="px-0 py-1 bg-white flex items-center justify-between">
        <div class="flex items-center gap-3 mb-6">
          <button 
            class="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-0 group"
            @click="goBack"
          >
            <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <span class="text-gray-950 font-mono font-bold text-sm tracking-wider">
            Bet ID:#{{ bet?.ticket_code || route.params.ticket_code }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white border border-gray-200 rounded-xl p-8">
        <div class="flex items-center justify-center gap-3">
          <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-500">Loading bet details...</span>
        </div>
      </div>

      <!-- Bet Details -->
      <div v-else-if="bet" class="space-y-0">
        
        <!-- Status Banner -->
        <div 
          class="p-3 rounded-t-xl flex items-center justify-between"
          :class="isWon ? 'bg-gradient-to-r from-emerald-900/80 to-green-950/40 border-t border-green-700/30' : 
                   isLost ? 'bg-gradient-to-r from-red-900/90 to-red-950/80 border border-red-700/30' : 
                   isCashedOut ? 'bg-gradient-to-r from-emerald-900/80 to-emerald-950/40 border-t border-emerald-700/30' :
                   'bg-gradient-to-r from-amber-900/80 to-amber-950/40 border-t border-amber-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ isWon ? '🏆' : isLost ? '😔' : isCashedOut ? '💰' : '⏳' }}</span>
            <div>
              <p class="text-white font-semibold text-sm my-5">
                {{ isWon ? 'Bet Won!' : isLost ? 'Bet Lost' : isCashedOut ? 'Bet Cashed Out!' : 'Bet in Progress' }}
              </p>
              <p class="text-xs text-gray-100">
                {{ isWon ? '🎉 Congratulations on your win!' : isLost ? '💪 Better luck next time!' : isCashedOut ? '🎯 You locked in your payout early' : '⏳ Waiting for results...' }}
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
            <div class="flex items-center justify-between px-2 py-1.5">
              <p class="text-[10px] uppercase tracking-wider text-gray-950 font-medium">Stake</p>
              <p class="text-gray-600 font-bold text-xs">TZS {{ formatNumber(stakeAmount) }}</p>
            </div>
            
            <!-- Potential Win -->
            <div class="flex items-center justify-between px-2 py-1.5">
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

        <!-- Cash Out Panel (below payout) -->
        <div v-if="cashoutValue > 0" class="mt-3">
        
            <button
              class="w-full py-3 cursor-pointer rounded-xl bg-transparent text-emerald font-bold text-sm hover:opacity-90 transition-opacity"
              @click="showCashOutModal = true"
            >
             <span class="text-emerald-600"> Request Cash Out</span>
            </button>
          <!-- </div> -->
        </div>

        <!-- Share Your Win -->
        <div v-if="!isOpen" class="mt-4">
         

            <!-- Share Result (opens WhatsApp) -->
            <button
              class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              title="Share this result via WhatsApp"
              @click="shareWin('whatsapp')"
            >
              <!-- <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> -->
              Share Result
            </button>
     
        </div>

        <!-- Selections - Using bookingCode selections -->
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
              v-for="(selection, index) in selections" 
              :key="index"
              class="bg-white p-1 flex flex-col group border-amber-600/20 transition-all border-b border-gray-200"
            >
              <!-- Time and Date -->
              <div v-if="selection.time || selection.date" class="flex gap-2 mt-1 text-[10px] text-gray-500">
                <span v-if="isMatchPlaying(selection) && getLiveMinute(selection)" class="inline-flex items-center gap-1.5 text-rose-500 font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  LIVE {{ getLiveMinute(selection) }}
                </span>
                <span v-else-if="isMatchPlaying(selection)" class="inline-flex items-center gap-1.5 text-rose-500 font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  LIVE
                </span>
                <span v-else>{{ formatUpcomingTime(selection.date, selection.time) }}</span>
              </div>

              <div class="flex justify-between items-center">
                <p class="text-[#A7A7A7] font-medium text-xs">{{ selection.matchName || 'Match' }}</p>
                <span class="text-[#8E8E8E] font-bold text-sm px-1 py-1 rounded-lg">{{ parseFloat(selection.odds).toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-1">
                <span class="text-xs text-gray-500 font-bold truncate">{{ selection.league || '' }}</span>
                <span class="text-xs text-gray-500 font-semibold">
                  <span v-if="isMatchStarted(selection)" class="text-xs text-gray-400 font-bold px-1">
                    {{ selection.score ? `${selection.score.home} - ${selection.score.away}` : '0 - 0' }}
                  </span>
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 font-semibold">
                  {{ getMarketDisplay(selection.marketType) }} - 
                  <span class="text-gray-600 font-medium">{{ getSelectionDisplay(selection) }}</span>
                </span>
                <span 
                  v-if="isMatchFinished(selection)"
                  class="text-xs font-semibold px-2 py-0.5 rounded"
                  :class="getResultClass(selection.result)"
                >
                  {{ selection.result || 'PENDING' }}
                </span>
                <span 
                  v-else-if="isMatchStarted(selection)"
                  class="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 animate-pulse"
                >
                  Live
                </span>
                <div 
                  v-else
                  class="inline-flex items-center h-5 w-5 rounded-full bg-gray-500/20 text-gray-400"
                >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Selections -->
        <div v-else class="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-center">
          <p class="text-gray-500 text-sm">No selections found for this bet.</p>
        </div>

        <!-- Timestamps & Actions -->
        <div class="mt-5 bg-white border border-gray-200 p-2">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="flex flex-wrap items-center gap-3 justify-center">
              <p class="text-[10px] tracking-wider text-[#8C8C8C] font-medium">Bet Placed on</p>
              <p class="text-gray-400 text-xs">{{ formatDate(bet.created_at) }}</p>
            </div>
            <div class="flex flex-row items-center gap-3 justify-center">
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-400"></div>
                <span class="text-gray-600 text-xs font-medium">Pending</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500"></div>
                <span class="text-gray-600 text-xs font-medium">Won</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-rose-500"></div>
                <span class="text-gray-600 text-xs font-medium">Lost</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-500"></div>
                <span class="text-gray-600 text-xs font-medium">Void</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-center justify-center text-center py-2">
          <span class="text-gray-400 text-[13px] font-bold">All Bets are accepted and settled in accordance with <span class="text-gray-400 text-xs">our <span class="underline">Terms and Conditions</span> and <span class="underline">Rules</span> </span></span>
        </div>

        <!-- Cashout Modal -->
        <CashOutModal
          v-if="showCashOutModal"
          :bet-id="bet.id"
          :cashout-value="cashoutValue"
          @close="showCashOutModal = false"
          @cashed-out="onCashedOut"
        />
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
          <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
        </div>
        <p class="text-gray-500 font-medium">Bet not found</p>
        <button 
          class="mt-4 text-rose-400 hover:text-rose-700 transition-colors"
          @click="goBack"
        >
          Go back to bets
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../stores/bet/betStore.js'
import CashOutModal from '../../components/bet/CashOutModal.vue'
import * as shareUtil from '../../utils/share.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()

const bet = ref(null)
const selections = ref([])
const isLoading = ref(false)
const showCashOutModal = ref(false)

// ---- Market Display ----
const marketMap = {
  '1X2': '1X2 | Full Time',
  'Double Chance': 'Double Chance | Full Time',
  'Double_Chance': 'Double Chance | Full Time',
  'BTTS': 'Both Teams To Score | Full Time',
  'Over/Under': 'Over/Under | Full Time',
  'Over_Under': 'Over/Under | Full Time',
  'Correct Score': 'Correct Score | Full Time',
  'Correct_Score': 'Correct Score | Full Time',
  'CS_FH': 'Correct Score | First Half',
  'CS_SH': 'Correct Score | Second Half',
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

const getMarketDisplay = (marketKey) => {
  const clean = typeof marketKey === 'string' ? marketKey.split('|')[0].trim() : ''
  return marketMap[clean] || marketMap[marketKey] || marketKey || '1X2 | Full Time'
}

const titleCaseWord = (w) => {
  if (w === undefined || w === null || w === '') return ''
  return String(w).charAt(0).toUpperCase() + String(w).slice(1).toLowerCase()
}

const formatOutcomeLabel = (outcomeKey) => {
  if (outcomeKey === undefined || outcomeKey === null) return ''
  const o = String(outcomeKey)

  if (o === '1') return '1'
  if (o === 'X') return 'Draw'
  if (o === '2') return '2'

  if (/^OVER\b/i.test(o)) return 'Over ' + o.replace(/^OVER[_ ]*/i, '').trim()
  if (/^UNDER\b/i.test(o)) return 'Under ' + o.replace(/^UNDER[_ ]*/i, '').trim()

  const parts = o.split('_')
  const joined = parts.map((p) => {
    if (/^[+\-]?\d+(\.\d+)?$/.test(p) || /^[0-9.]+[+]?$/.test(p)) return p
    return titleCaseWord(p)
  }).join(' ')

  return joined.trim()
}

// ---- Result Class ----
const getResultClass = (result) => {
  if (result === 'WON') return 'bg-green-500/20 text-green-400 border border-green-500/20'
  if (result === 'LOST') return 'bg-red-500/20 text-red-400 border border-red-500/20'
  return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
}

const isMatchStarted = (selection) => {
  if (!selection) return false
  const status = String(selection.matchStatus || '').toUpperCase()
  return status !== 'UPCOMING' && status !== ''
}

const isMatchFinished = (selection) => {
  if (!selection) return false
  return String(selection.matchStatus || '').toUpperCase() === 'FINISHED'
}

const isMatchPlaying = (selection) => {
  return isMatchStarted(selection) && !isMatchFinished(selection)
}

const getLiveMinute = (selection) => {
  if (!selection) return ''
  const em = selection.elapsed_minute
  if (em !== undefined && em !== null && em !== '' && !isNaN(parseInt(em))) {
    const m = parseInt(em)
    return m >= 90 ? "90+'" : `${m}'`
  }
  const timeParts = String(selection.time || '').trim().toLowerCase().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/)
  if (selection.date && timeParts) {
    let hours = parseInt(timeParts[1], 10)
    const minutes = parseInt(timeParts[2], 10)
    if (timeParts[3] === 'pm' && hours < 12) hours += 12
    if (timeParts[3] === 'am' && hours === 12) hours = 0
    const start = new Date(`${selection.date} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
    if (!isNaN(start.getTime())) {
      const mins = Math.floor((Date.now() - start.getTime()) / 60000)
      if (mins >= 0) return mins >= 90 ? "90+'" : `${mins}'`
    }
  }
  return ''
}

// ---- Selection Display ----
const getSelectionDisplay = (selection) => {
  if (!selection) return 'N/A'
  const type = selection.selectionType || selection.pick || ''
  if (!type) return 'N/A'
  return formatOutcomeLabel(type)
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

// ---- Cashout ----
const cashoutValue = computed(() => {
  if (!bet.value) return 0
  const value = parseFloat(bet.value.cashout_value)
  return isNaN(value) ? 0 : value
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

// ---- Upcoming Match Time Formatting (same as MatchCard.vue) ----
const formatUpcomingTime = (dateStr, timeStr) => {
  if (!dateStr && !timeStr) return timeStr || ''

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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const dayNum = String(date.getDate()).padStart(2, '0')
    const monthNum = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase()
    return `${dayName} ${dayNum}/${monthNum}/${year} at ${timeFormatted}`
  } catch {
    return 'N/A'
  }
}

// ---- Cashout success handler ----
const onCashedOut = () => {
  showCashOutModal.value = false
  loadBet()
}

// ---- Load Bet ----
const loadBet = async () => {
  const id = route.params.id
  if (!id) {
    router.push('/bets')
    return
  }

  isLoading.value = true
  try {
    // Find bet in store (has embedded selections)
    const existingBet = betStore.userBets?.find(b => String(b.id) === String(id))
    if (existingBet) {
      bet.value = existingBet
      mapSelections(existingBet.selections)
      return
    }

    // If not found and we have a ticket code, try public ticket API
    const response = await betStore.fetchBetByTicket(id)
    if (response && response.data) {
      bet.value = response.data
      mapSelections(response.data.selections)
    } else {
      bet.value = null
    }
  } catch (error) {
    console.error('Error loading bet:', error)
    bet.value = null
  } finally {
    isLoading.value = false
  }
}

// ---- Map backend embedded selections to display format ----
const mapSelections = (rawSelections) => {
  const raw = rawSelections || []
  selections.value = raw.map((sel) => {
    const m = sel.match || {}
    return {
      time: m.time || '',
      date: m.date || '',
      matchName: `${m.home_team || ''} vs ${m.away_team || ''}`,
      odds: sel.odds_at_placement || sel.odds || 1,
      league: m.league || '',
      score: m.current_score || null,
      matchStatus: m.status || '',
      elapsed_minute: m.elapsed_minute ?? null,
      marketType: sel.market_key || sel.market || '1X2',
      result: sel.status || 'PENDING',
      selectionType: sel.outcome_key || sel.pick || ''
    }
  })
}

// ---- Share Win ----
const ticketCode = computed(() => bet.value?.ticket_code || bet.value?.ticketCode || '')

const publicShareUrl = computed(() => {
  if (!ticketCode.value) return ''
  return `${shareUtil.getShareOrigin()}/share/bet/${ticketCode.value}`
})

const buildShareText = () => {
  const statusWord = isWon.value ? '🏆 I just WON' : isLost.value ? '😔 Bet lost' : '⏳ Check out my bet'
  return `${statusWord} on SunBet! Bet ID: #${bet.value?.id} Payout: ${formatNumber(payout.value)} TZS`
}

const shareWin = async (platform) => {
  const url = publicShareUrl.value
  if (!url) return

  if (platform === 'whatsapp') {
    shareUtil.shareWhatsApp(`${buildShareText()}\n\n${url}`)
  } else if (platform === 'facebook') {
    shareUtil.shareFacebook(url)
  } else if (platform === 'instagram') {
    // Instagram haina web share-intent; nakili link
    await copyToClipboard(`Join me on SunBet & see my result: ${url}`)
  } else if (platform === 'copy') {
    await copyToClipboard(`I just shared a bet on SunBet. View it here: ${url}`)
  } else {
    // Native share (default)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SunBet', text: buildShareText(), url })
      } catch (err) {
        if (err.name !== 'AbortError') {
          await copyToClipboard(`${buildShareText()}\n${url}`)
        }
      }
    } else {
      await copyToClipboard(`${buildShareText()}\n${url}`)
    }
  }
}

const copyToClipboard = async (text) => {
  await shareUtil.copyToClipboard(text)
  alert('✅ Copied to clipboard!')
}

// ---- Go Back ----
const goBack = () => {
  router.push('/bets')
}

// ---- Mounted ----
onMounted(() => {
  loadBet()
})
</script>

<style scoped>
/* Custom scrollbar */
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.bg-\[\#2A2A2A\]\/20 {
  background-color: rgba(42, 42, 42, 0.2);
}
</style>