<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <div class="max-w-2xl mx-auto px-4 py-6">
      
      <!-- Back Button -->
      <button 
        class="flex items-center gap-2 text-[#606060] hover:text-white transition-colors mb-4 group"
        @click="goBack"
      >
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Bets
      </button>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8">
        <div class="flex items-center justify-center gap-3">
          <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[#606060]">Loading bet details...</span>
        </div>
      </div>

      <!-- Bet Details -->
      <div v-else-if="bet">
        
        <!-- Status Banner -->
        <div 
          class="rounded-xl p-4 mb-5 flex items-center justify-between"
          :class="bet.status === 'won' ? 'bg-gradient-to-r from-green-900/40 to-green-950/40 border border-green-700/30' : 
                   bet.status === 'lost' ? 'bg-gradient-to-r from-red-900/40 to-red-950/40 border border-red-700/30' : 
                   'bg-gradient-to-r from-rose-900/40 to-rose-950/40 border border-rose-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ bet.status === 'won' ? '🏆' : bet.status === 'lost' ? '😔' : '⏳' }}</span>
            <div>
              <p class="text-white font-semibold text-sm">
                {{ bet.status === 'won' ? 'Bet Won!' : bet.status === 'lost' ? 'Bet Lost' : 'Bet in Progress' }}
              </p>
              <p class="text-xs text-[#606060]">
                {{ bet.status === 'won' ? 'Congratulations on your win!' : bet.status === 'lost' ? 'Better luck next time!' : 'Waiting for settlement' }}
              </p>
            </div>
          </div>
          <span 
            class="px-3 py-1 text-xs font-bold rounded-full"
            :class="bet.status === 'won' ? 'bg-green-500/20 text-green-400' : 
                     bet.status === 'lost' ? 'bg-red-500/20 text-red-400' : 
                     'bg-rose-500/20 text-rose-400'"
          >
            {{ bet.status === 'won' ? 'WON' : bet.status === 'lost' ? 'LOST' : 'OPEN' }}
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          
          <!-- Bet ID Header -->
          <div class="px-5 py-3.5 bg-[#0D0D0D] border-b border-[#2A2A2A] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4 text-[#606060]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              <span class="text-[#606060] text-xs font-medium">BET ID</span>
            </div>
            <span class="text-white font-mono font-semibold text-sm tracking-wider">#{{ bet.id || bet.bookingCode || 'N/A' }}</span>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-0">
            <!-- Stake -->
            <div class="px-5 py-3.5 border-r border-b border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Stake</p>
              <p class="text-white font-bold text-base mt-0.5">TZS {{ (bet.stake || 0).toLocaleString() }}</p>
            </div>
            <!-- Total Odds -->
            <div class="px-5 py-3.5 border-b border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Total Odds</p>
              <p class="text-rose-400 font-bold text-base mt-0.5">{{ bet.totalOdds || bet.odds || 'N/A' }}</p>
            </div>
            <!-- Tax -->
            <div class="px-5 py-3.5 border-r border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Tax</p>
              <p class="text-white font-semibold text-sm mt-0.5">- TZS {{ ((bet.tax || 0)).toLocaleString() }}</p>
            </div>
            <!-- Potential Win -->
            <div class="px-5 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Potential Win</p>
              <p class="text-green-400 font-bold text-base mt-0.5">TZS {{ (bet.potentialWin || 0).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Net Won (Highlighted) -->
          <div class="px-5 py-4 bg-gradient-to-r from-rose-950/30 to-transparent border-t border-[#2A2A2A] flex items-center justify-between">
            <div>
              <p class="text-xs text-[#606060] font-medium">Net Won</p>
              <p class="text-white font-bold text-xl mt-0.5">TZS {{ (bet.netWon || 0).toLocaleString() }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-[#606060]">Status</p>
              <span class="text-xs font-semibold" :class="bet.status === 'won' ? 'text-green-400' : bet.status === 'lost' ? 'text-red-400' : 'text-rose-400'">
                {{ bet.status === 'won' ? '✅ Won' : bet.status === 'lost' ? '❌ Lost' : '⏳ Open' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Selections Section -->
        <div v-if="bet.selections && bet.selections.length > 0" class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
              Selections
            </h3>
            <span class="text-xs text-[#606060] font-medium">{{ bet.selections.length }} picks</span>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="(selection, index) in bet.selections" 
              :key="index"
              class="bg-[#0D0D0D] rounded-lg p-3.5 flex items-center justify-between group hover:border-rose-600/20 transition-all border border-transparent"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-rose-600/20 text-rose-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ index + 1 }}
                  </span>
                  <p class="text-white font-medium text-sm">{{ selection.match || selection.matchName || 'Match' }}</p>
                </div>
                <div class="flex items-center gap-3 ml-7 mt-0.5">
                  <span class="text-xs text-[#606060]">{{ selection.market || selection.marketKey || 'Market' }}</span>
                  <span class="text-[10px] text-[#606060]">•</span>
                  <span class="text-xs text-[#A0A0A0]">Pick: <span class="text-white font-medium">{{ selection.pick || selection.selection || 'N/A' }}</span></span>
                </div>
              </div>
              <span class="text-rose-400 font-bold text-sm bg-rose-600/10 px-3 py-1 rounded-lg">{{ selection.odds || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Timestamps & Actions -->
        <div class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-6">
              <div v-if="bet.placedAt">
                <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Placed</p>
                <p class="text-white text-sm mt-0.5">{{ formatDate(bet.placedAt) }}</p>
              </div>
              <div v-if="bet.settledAt">
                <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Settled</p>
                <p class="text-white text-sm mt-0.5">{{ formatDate(bet.settledAt) }}</p>
              </div>
            </div>
            <button 
              v-if="bet.status === 'open' || bet.status === 'pending'"
              class="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-rose-600/25 flex items-center gap-2"
              @click="cancelBet"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel Bet
            </button>
          </div>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../stores/bets/betStore.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()

const bet = ref(null)
const isLoading = ref(false)

// ---- Format Date ----
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })
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
    // First try to find in store
    const existingBet = betStore.userBets.find(b => b.id === parseInt(id) || b.id === id)
    if (existingBet) {
      bet.value = existingBet
      return
    }

    // If not in store, try to load from API
    // You can add a fetch single bet API call here
    // For now, show not found
    bet.value = null
  } catch (error) {
    console.error('Error loading bet:', error)
    bet.value = null
  } finally {
    isLoading.value = false
  }
}

// ---- Go Back ----
const goBack = () => {
  router.push('/bets')
}

// ---- Cancel Bet ----
const cancelBet = async () => {
  if (!bet.value) return
  if (confirm('Are you sure you want to cancel this bet?')) {
    try {
      const result = await betStore.cancelUserBet(bet.value.id)
      if (result.success) {
        alert('Bet cancelled successfully')
        await loadBet() // Reload bet details
        // Navigate back to bets list after cancellation
        router.push('/bets')
      } else {
        alert(result.message || 'Failed to cancel bet')
      }
    } catch (error) {
      console.error('Error cancelling bet:', error)
      alert('An error occurred while cancelling the bet')
    }
  }
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
</style>