<template>
  <div class="min-h-screen bg-[#0D0D0D]">
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
        <div class="mt-4">
          <button 
            @click="shareWin"
            class="group relative w-full cursor-pointer overflow-hidden bg-gradient-to-r from-green-600/50 via-green-500 to-green-400/40 border border-rose-400/30 rounded-xl p-3.5 transition-all duration-300 shadow-lg shadow-rose-500/20 hover:shadow-teal-500/40"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-center justify-center gap-3">
              <span class="text-white font-bold text-base tracking-wide uppercase">Share Your Win</span>
              <svg class="w-4 h-4 text-white/70 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="18" cy="5" r="3" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="6" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="18" cy="19" r="3" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-linecap="round"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-linecap="round"/>
              </svg>
            </div>
          </button>
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
                <p class="text-[#A7A7A7] font-medium text-sm">{{ selection.matchName || 'Match' }}</p>
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
                  <span class="text-[#A9A9A9] font-medium">{{ selection.selectionValue || selection.pick || 'N/A' }}</span>
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
import { useBetStore } from '../../stores/bets/betStore.js'
import { useBookingCodeStore } from '../../stores/bookingcode/bookingCodeStore.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()
const bookingCodeStore = useBookingCodeStore()

const bet = ref(null)
const selections = ref([])
const isLoading = ref(false)

// ---- Market Display ----
const marketMap = {
  '1X2': '1X2 | Full Time',
  'Double Chance': 'Double Chance | Full Time',
  'BTTS': 'Both Teams to Score | Full Time',
  'Over/Under': 'Over/Under | Full Time',
  'Correct Score': 'Correct Score | Full Time',
  'CS_FH': 'Correct Score | First Half',
  'CS_SH': 'Correct Score | Second Half'
}

const getMarketDisplay = (marketKey) => {
  return marketMap[marketKey] || marketKey || '1X2 | Full Time'
}

// ---- Result Class ----
const getResultClass = (result) => {
  if (result === 'WON') return 'bg-green-500/20 text-green-400 border border-green-500/20'
  if (result === 'LOST') return 'bg-red-500/20 text-red-400 border border-red-500/20'
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
  return Math.round(potentialWin.value - tax.value + stakeAmount.value)
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
    // Find bet in store
    const existingBet = betStore.userBets?.find(b => String(b.id) === String(id))
    if (existingBet) {
      bet.value = existingBet
      // Load selections from booking code
      await loadSelections(existingBet.bookingCodeId)
      return
    }

    // If not found, try API
    const response = await betStore.fetchBetById(id)
    if (response && response.data) {
      bet.value = response.data
      await loadSelections(response.data.bookingCodeId)
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

// ---- Load Selections from Booking Code ----
const loadSelections = async (bookingCodeId) => {
  if (!bookingCodeId) {
    selections.value = []
    return
  }

  try {
    // Fetch booking code with selections
    const result = await bookingCodeStore.fetchBookingCodeById(bookingCodeId)
    if (result && result.data) {
      selections.value = result.data.selections || []
    } else {
      selections.value = []
    }
  } catch (error) {
    console.error('Error loading selections:', error)
    selections.value = []
  }
}

// ---- Share Win ----
const shareWin = async () => {
  if (!bet.value) return
  
  const shareText = `🏆 I won ${formatNumber(payout.value)} TZS on SunBet! 🎉\nBet ID: #${bet.value.id}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'SunBet Win',
        text: shareText,
        url: window.location.href
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
        copyToClipboard(shareText)
      }
    }
  } else {
    copyToClipboard(shareText)
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Copied to clipboard!')
  }).catch(() => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('✅ Copied to clipboard!')
  })
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