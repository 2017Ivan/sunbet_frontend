<template>
  <div class="p-0 bg-gray-950">
    <div class="max-w-2xl mx-auto px-1 py-3">
      
      <!-- Bet ID Header -->
      <div class="px-0 py-1 bg-[#0D0D0D] flex items-center justify-between">
        <div class="flex items-center gap-3 mb-6">
          <button 
            class="flex items-center gap-2 text-[#606060] hover:text-white transition-colors mb-0 group"
            @click="goBack"
          >
            <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <span class="text-[#8E8E8E] font-mono font-bold text-sm tracking-wider">
            Bet ID:#{{ bet?.id || route.params.id || 'N/A' }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8">
        <div class="flex items-center justify-center gap-3">
          <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[#606060]">Loading bet details...</span>
        </div>
      </div>

      <!-- Bet Details -->
      <div v-else-if="bet" class="space-y-0">
        
        <!-- Status Banner -->
        <div 
          class="p-3 rounded-t-xl flex items-center justify-between"
          :class="isWon ? 'bg-gradient-to-r from-green-900/40 to-green-950/40 border-t border-green-700/30' : 
                   isLost ? 'bg-gradient-to-r from-red-900/40 to-red-950/40 border border-red-700/30' : 
                   'bg-gradient-to-r from-amber-900/40 to-amber-950/40 border-t border-amber-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ isWon ? '🏆' : isLost ? '😔' : '⏳' }}</span>
            <div>
              <p class="text-white font-semibold text-sm my-5">
                {{ isWon ? 'Bet Won!' : isLost ? 'Bet Lost' : 'Bet in Progress' }}
              </p>
              <p class="text-xs text-[#606060]">
                {{ isWon ? '🎉 Congratulations on your win!' : isLost ? '💪 Better luck next time!' : '⏳ Waiting for results...' }}
              </p>
            </div>
          </div>
          <span 
            class="px-4 py-3 text-xs font-bold rounded-full"
            :class="isWon ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                     isLost ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                     'bg-amber-500/20 text-amber-400 border border-amber-500/30'"
          >
            {{ isWon ? 'WON' : isLost ? 'LOST' : 'OPEN' }}
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-[#1A1A1A] border-b border-[#2A2A2A] rounded-b-xl overflow-hidden">
          
          <!-- Stats -->
          <div class="">
            <!-- Total Odds -->
            <div class="flex items-center justify-between px-4 py-1">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Total Odds</p>
              <p class="text-[#8E8E8E] font-bold text-sm">{{ totalOdds.toFixed(2) }}</p>
            </div>
            
            <!-- Stake -->
            <div class="flex items-center justify-between px-4 py-1">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Stake</p>
              <p class="text-[#8E8E8E] font-bold text-sm">TZS {{ formatNumber(stakeAmount) }}</p>
            </div>
            
            <!-- Potential Win -->
            <div class="flex items-center justify-between px-4 py-1">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Potential Win</p>
              <p class="text-[#8E8E8E] font-bold text-sm">TZS {{ formatNumber(potentialWin) }}</p>
            </div>
            
            <!-- Tax -->
            <div class="flex items-center justify-between px-4 py-1">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Tax (12%)</p>
              <p class="text-[#8E8E8E] font-semibold text-sm">- TZS {{ formatNumber(tax) }}</p>
            </div>
          </div>

          <!-- Net Payout -->
          <div class="px-4 py-4 bg-gradient-to-r from-rose-950/20 to-transparent border-t border-[#2A2A2A]">
            <div class="flex items-center justify-between">
              <p class="text-xs text-white font-medium">Payout</p>
              <div class="text-right">
                <p class="text-green-400 font-bold text-sm">
                  TZS {{ formatNumber(payout) }}
                </p>
                <span class="text-xs font-semibold" :class="isWon ? 'text-green-400' : isLost ? 'text-red-400' : 'text-amber-400'">
                  {{ bet.result || bet.status || 'PENDING' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Your Win -->
        <div v-if="!isOpen" class="mt-4">
          <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
            <p class="text-center text-xs text-[#8E8E8E] font-medium mb-3">
              Share this {{ isWon ? 'win' : 'bet' }} with friends
            </p>

            <!-- Native Share -->
            <button
              class="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              :title="'Share this result via any social app'"
              @click="shareWin()"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share Result
            </button>

            <div class="flex items-center justify-center gap-3 flex-wrap">
              <!-- WhatsApp -->
              <button
                class="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                :title="'Share on WhatsApp'"
                @click="shareWin('whatsapp')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>

              <!-- Facebook -->
              <button
                class="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                :title="'Share on Facebook'"
                @click="shareWin('facebook')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.91h-2.32V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg>
              </button>

              <!-- Instagram -->
              <button
                class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                :title="'Share link for Instagram'"
                @click="shareWin('instagram')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none"/></svg>
              </button>

              <!-- Copy link -->
              <button
                class="w-12 h-12 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                :title="'Copy share link'"
                @click="shareWin('copy')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            </div>
            <p class="text-center text-[10px] text-[#8E8E8E] mt-3">
              Friends see only the result — no account details
            </p>
          </div>
        </div>

        <!-- Selections - Using bookingCode selections -->
        <div v-if="selections.length > 0" class="mt-0 p-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
              Selections
            </h3>
            <span class="text-xs text-[#606060] font-medium">{{ selections.length }} picks</span>
          </div>
          
          <div class="space-y-1">
            <div 
              v-for="(selection, index) in selections" 
              :key="index"
              class="bg-[#0D0D0D] p-1 flex flex-col group border-amber-600/20 transition-all border-b border-gray-900"
            >
              <!-- Time and Date -->
              <div v-if="selection.time || selection.date" class="flex gap-2 mt-1 text-[10px] text-gray-500">
                <span v-if="selection.time">{{ selection.time }}</span>
                <span v-if="selection.date">{{ selection.date }}</span>
              </div>

              <div class="flex justify-between items-center">
                <p class="text-[#A7A7A7] font-medium text-xs">{{ selection.matchName || 'Match' }}</p>
                <span class="text-[#8E8E8E] font-bold text-sm px-1 py-1 rounded-lg">{{ parseFloat(selection.odds).toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-1">
                <span class="text-xs text-gray-500 font-bold truncate">{{ selection.league || '' }}</span>
                <span class="text-xs text-[#A0A0A0] font-semibold">
                  <span class="text-xs text-gray-400 font-bold px-1">
                    {{ selection.score ? `${selection.score.home} - ${selection.score.away}` : '—' }}
                  </span>
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-xs text-[#A0A0A0] font-semibold">
                  {{ getMarketDisplay(selection.marketType) }} - 
                  <span class="text-[#A9A9A9] font-medium">{{ getSelectionDisplay(selection) }}</span>
                </span>
                <span 
                  class="text-xs font-semibold px-2 py-0.5 rounded"
                  :class="getResultClass(selection.result)"
                >
                  {{ selection.result || 'PENDING' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Selections -->
        <div v-else class="mt-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-center">
          <p class="text-[#606060] text-sm">No selections found for this bet.</p>
        </div>

        <!-- Timestamps & Actions -->
        <div class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] p-2">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="flex flex-wrap items-center gap-3 justify-center">
              <p class="text-[10px] tracking-wider text-[#8C8C8C] font-medium">Bet Placed on</p>
              <p class="text-gray-400 text-xs">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="flex flex-row items-center gap-3 justify-center">
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-400"></div>
                <span class="text-gray-300 text-xs font-medium">Pending</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500"></div>
                <span class="text-gray-300 text-xs font-medium">Won</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-rose-500"></div>
                <span class="text-gray-300 text-xs font-medium">Lost</span>
              </div>
              <div class="flex flex-row gap-1.5 items-center justify-center">
                <div class="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-500"></div>
                <span class="text-gray-300 text-xs font-medium">Void</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-center justify-center text-center py-2">
          <span class="text-gray-400 text-[13px] font-bold">All Bets are accepted and settled in accordance with <span class="text-gray-400 text-xs">our <span class="underline">Terms and Conditions</span> and <span class="underline">Rules</span> </span></span>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
          <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
        </div>
        <p class="text-[#606060] font-medium">Bet not found</p>
        <button 
          class="mt-4 text-rose-400 hover:text-rose-300 transition-colors"
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
import * as shareUtil from '../../utils/share.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()

const bet = ref(null)
const selections = ref([])
const isLoading = ref(false)

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

// ---- Bet Calculations ----
const stakeAmount = computed(() => {
  if (!bet.value) return 0
  return parseFloat(bet.value.stake) || 0
})

const totalOdds = computed(() => {
  if (!bet.value) return 0
  const odds = parseFloat(bet.value.totalOdds) || parseFloat(bet.value.odds) || 1.00
  return odds
})

const potentialWin = computed(() => {
  if (!stakeAmount.value || !totalOdds.value) return 0
  return Math.round(stakeAmount.value * (totalOdds.value - 1))
})

const tax = computed(() => {
  if (!potentialWin.value) return 0
  return Math.round(potentialWin.value * 0.12)
})

const payout = computed(() => {
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    })
  } catch {
    return 'N/A'
  }
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

.bg-\[\#2A2A2A\]\/20 {
  background-color: rgba(42, 42, 42, 0.2);
}
</style>