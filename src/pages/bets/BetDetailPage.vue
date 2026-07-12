<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <div class="max-w-2xl mx-auto px-1 py-6">
      
      <!-- Back Button -->
      <button 
        class="flex items-center gap-2 text-[#606060] hover:text-white transition-colors mb-0 group"
        @click="goBack"
      >
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      
      </button>

          <!-- Bet ID Header -->
          <div class="px-0 py-1 bg-[#0D0D0D]  flex items-center justify-between">
            <div class="flex items-center gap-3">
              
            <span class="text-[#8E8E8E] font-mono font-semibold text-sm tracking-wider"> BET ID: #{{ bet.id || bet.id || 'N/A' }}</span>
              
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
      <div v-else-if="bet">
        
        <div class="bg-red-60 flex flex-col">
        <!-- Status Banner -->
        <div 
          class=" p-2  flex items-center justify-between"
          :class="isWon ? 'bg-gradient-to-r from-green-900/40 to-green-950/40 ' : 
                   isLost ? 'bg-gradient-to-r from-red-900/40 to-red-950/40 border border-red-700/30' : 
                   'bg-gradient-to-r from-amber-900/40 to-amber-950/40 border border-amber-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ isWon ? '🏆' : isLost ? '😔' : '⏳' }}</span>
            <div>
              <p class="text-white font-semibold text-sm">
                {{ isWon ? 'Bet Won!' : isLost ? 'Bet Lost' : 'Bet in Progress' }}
              </p>
              <p class="text-xs text-[#606060]">
                {{ isWon ? '🎉 Congratulations on your win!' : isLost ? '💪 Better luck next time!' : '' }}
              </p>
            </div>
          </div>
          <span 
            class="px-3 py-1 text-xs font-bold rounded-full"
            :class="isWon ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                     isLost ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                     'bg-amber-500/20 text-amber-400 border border-amber-500/30'"
          >
            {{ isWon ? 'WON' : isLost ? 'LOST' : 'OPEN' }}
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-[#1A1A1A]  overflow-hidden">
          

          <!-- Stats Grid -->
          <div class="flex flex-col px-2">
            <!-- Stake -->
            <div class=" flex flex-row items-center justify-between px-0 py-3.5 ">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Stake</p>
              <p class="text-[#8E8E8E] font-bold text-xs">TZS {{ formatNumber(bet.stake) }}</p>
            </div>
            <!-- Total Odds -->
            <div class="flex flex-row items-center justify-between px-0 py-3.5 ">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Total Odds</p>
              <p class="text-[#8E8E8E] font-bold text-xs">{{ parseFloat(bet.totalOdds).toFixed(2) }}</p>
            </div>
            <!-- Tax -->
            <div class="flex flex-row items-center justify-between px-0 py-3.5 ">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Tax</p>
              <p class="text-[#8E8E8E] font-semibold text-xs">- TZS {{ formatNumber(bet.tax) }}</p>
            </div>
            <!-- Potential Win -->
            <div class="flex flex-row items-center justify-between px-0 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#8E8E8E] font-medium">Potential Return</p>
              <p class="text-[#8E8E8E]  font-bold text-xs ">TZS {{ formatNumber(bet.potentialReturn) }}</p>
            </div>
          </div>

          <!-- Net Won (Highlighted) -->
          <div class="flex-col py-4 bg-gradient-to-r from-rose-950/30 to-transparent border-t border-[#2A2A2A] ">
            <div class="flex flex-row items-center justify-between">
              <p class="text-xs text-white font-medium">Net Payout</p>
              <p class="text-green-400  font-bold text-xl">TZS {{ formatNumber(bet.netPayout || bet.potentialReturn) }}</p>
            </div>
             <div class="text-right">
              <!-- <p class="text-[10px] text-[#606060]">Result</p> -->
              <span class="text-xs font-semibold" :class="isWon ? 'text-green-400' : isLost ? 'text-red-400' : 'text-amber-400'">
                {{ bet.result || 'PENDING' }}
              </span>
            </div>
           
          </div>
        </div>
        
        </div>

        <!-- Selections Section -->
        <div v-if="bet.selections && bet.selections.length > 0" class="mt-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-1">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              class="bg-transparent rounded-lg p-1 flex items-center justify-between group hover:border-amber-600/20 transition-all border border-transparent"
            >
              <div class="flex-1">
                <div class="flex items-center">
                 
                  <p class="text-white font-medium text-sm">{{ selection.match?.name || selection.matchName || 'Match' }}</p>
                </div>
                <div class="flex items-center gap-1 ml-0 mt-0.5">
                  <span class="text-xs font-semibold text-[#A0A0A0]">{{ selection.match?.market || selection.market || '1X2' }}</span>
                  <span class="text-xs text-[#A0A0A0]">| Full Time-  <span class="text-white font-medium">{{ selection.selection || selection.pick || 'N/A' }}</span></span>
                </div>
              </div>
              <span class="text-amber-400 font-bold text-sm bg-amber-600/10 px-3 py-1 rounded-lg">{{ parseFloat(selection.odds).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Timestamps & Actions -->
        <div class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-6 justify-center">
                <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Placed</p>
                <p class="text-white text-sm ">{{ formatDate(bet.createdAt) }}</p>
              
             
            </div>
         
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../stores/bets/betStore.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()

const bet = ref(null)
const isLoading = ref(false)

// ---- Computed ----
const betStatus = computed(() => {
  if (!bet.value) return 'unknown'
  
  const status = (bet.value.status || '').toUpperCase()
  const result = (bet.value.result || '').toUpperCase()
  
  // Check if settled
  if (status === 'SETTLED') {
    if (result === 'WON') return 'won'
    if (result === 'LOST') return 'lost'
    return 'settled'
  }
  
  // Check if open
  if (status === 'OPEN' || status === 'PENDING') {
    return 'open'
  }
  
  // Check by result
  if (result === 'WON') return 'won'
  if (result === 'LOST') return 'lost'
  
  return 'unknown'
})

const isWon = computed(() => betStatus.value === 'won')
const isLost = computed(() => betStatus.value === 'lost')
const isOpen = computed(() => betStatus.value === 'open')

// ---- Helper Functions ----
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

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
    const existingBet = betStore.userBets.find(b => String(b.id) === String(id))
    if (existingBet) {
      bet.value = existingBet
      return
    }

    // If not in store, try to load from API
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
        await loadBet()
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