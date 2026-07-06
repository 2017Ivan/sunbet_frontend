
// BetDetailPage.vue 
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

      <!-- Bet Details -->
      <div v-if="bet">
        
        <!-- Status Banner -->
        <div 
          class="rounded-xl p-4 mb-5 flex items-center justify-between"
          :class="bet.status === 'won' ? 'bg-gradient-to-r from-green-900/40 to-green-950/40 border border-green-700/30' : 
                   bet.status === 'lost' ? 'bg-gradient-to-r from-red-900/40 to-red-950/40 border border-red-700/30' : 
                   'bg-gradient-to-r from-rose-900/40 to-rose-950/40 border border-rose-700/30'"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm">{{ bet.status === 'won' ? '🏆' : bet.status === 'lost' ? '😔' : '⏳' }}</span>
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
            <span class="text-white font-mono font-semibold text-sm tracking-wider">#{{ bet.betId || bet.bookingCode }}</span>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-0">
            <!-- Stake -->
            <div class="px-5 py-3.5 border-r border-b border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Stake</p>
              <p class="text-white font-bold text-base mt-0.5">TZS {{ bet.stake.toLocaleString() }}</p>
            </div>
            <!-- Total Odds -->
            <div class="px-5 py-3.5 border-b border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Total Odds</p>
              <p class="text-rose-400 font-bold text-base mt-0.5">{{ bet.totalOdds || bet.odds }}</p>
            </div>
            <!-- Tax -->
            <div class="px-5 py-3.5 border-r border-[#2A2A2A]">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Tax (12%)</p>
              <p class="text-white font-semibold text-sm mt-0.5">- TZS {{ (bet.tax || 0).toLocaleString() }}</p>
            </div>
            <!-- Potential Win -->
            <div class="px-5 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Potential Win</p>
              <p class="text-green-400 font-bold text-base mt-0.5">TZS {{ bet.potentialWin.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Net Won (Highlighted) -->
          <div class="px-5 py-4 bg-gradient-to-r from-rose-950/30 to-transparent border-t border-[#2A2A2A] flex items-center justify-between">
            <div>
              <p class="text-xs text-[#606060] font-medium">Net Won</p>
              <p class="text-white font-bold text-xl mt-0.5">TZS {{ bet.netWon.toLocaleString() }}</p>
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
        <div class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
              Selections
            </h3>
            <span class="text-xs text-[#606060] font-medium">{{ bet.selections?.length || 0 }} picks</span>
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
                  <p class="text-white font-medium text-sm">{{ selection.match }}</p>
                </div>
                <div class="flex items-center gap-3 ml-7 mt-0.5">
                  <span class="text-xs text-[#606060]">{{ selection.market }}</span>
                  <span class="text-[10px] text-[#606060]">•</span>
                  <span class="text-xs text-[#A0A0A0]">Pick: <span class="text-white font-medium">{{ selection.pick }}</span></span>
                </div>
              </div>
              <span class="text-rose-400 font-bold text-sm bg-rose-600/10 px-3 py-1 rounded-lg">{{ selection.odds }}</span>
            </div>
          </div>
        </div>

       

        <!-- Share / Print Actions -->
        <div class="mt-4 flex gap-3">
          <button class="flex-1 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#606060] hover:text-white hover:border-[#3A3A3A] transition-all text-sm font-medium flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
          <button class="flex-1 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#606060] hover:text-white hover:border-[#3A3A3A] transition-all text-sm font-medium flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M18 9H6"/>
              <path d="M18 14v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4"/>
              <rect x="2" y="14" width="20" height="4" rx="2"/>
            </svg>
            Print
          </button>
        </div>
         <!-- Timestamps & Actions -->
        <div class="mt-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-6">
              <div>
                <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Placed</p>
                <p class="text-white text-sm mt-0.5">{{ formattedPlacedAt }}</p>
              </div>
              <!-- <div v-if="bet.settledAt">
                <p class="text-[10px] uppercase tracking-wider text-[#606060] font-medium">Settled</p>
                <p class="text-white text-sm mt-0.5">{{ formattedSettledAt }}</p>
              </div> -->
            </div>
            <button 
              v-if="bet.status === 'open'"
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

      <!-- Loading / Not Found -->
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

const router = useRouter()
const route = useRoute()

const bet = ref(null)

// ---- Dummy Data with Won Bet Example ----
const allBets = [
  // WON BET - Example 1
  {
    id: 1,
    betId: '17573423917',
    event: 'Arsenal vs Man City',
    market: '1X2 - 1',
    selection: 'Arsenal',
    odds: 3.2,
    totalOdds: 38.08,
    stake: 125000,
    potentialWin: 4635000,
    tax: 556200,
    netWon: 3953800,
    placedAt: '2026-07-02T10:23:00',
    settledAt: '2026-07-02T12:30:00',
    status: 'won',
    bookingCode: 'ABC123',
    selections: [
      { match: 'Arsenal vs Man City', market: '1X2', pick: '1', odds: 3.2 },
      { match: 'Barcelona vs Real Madrid', market: '1X2', pick: '1', odds: 3.4 },
      { match: 'Juventus vs AC Milan', market: '1X2', pick: '1', odds: 3.5 }
    ]
  },
  // WON BET - Example 2
  {
    id: 2,
    betId: '17573423918',
    event: 'Manchester United vs Liverpool',
    market: '1X2 - Home',
    selection: 'Manchester United',
    odds: 2.15,
    totalOdds: 4.62,
    stake: 5000,
    potentialWin: 23100,
    tax: 2772,
    netWon: 20328,
    placedAt: '2026-07-01T14:30:00',
    settledAt: '2026-07-01T16:30:00',
    status: 'won',
    bookingCode: 'DEF456',
    selections: [
      { match: 'Manchester United vs Liverpool', market: '1X2', pick: 'Home', odds: 2.15 },
      { match: 'Arsenal vs Chelsea', market: 'Over 2.5', pick: 'Over', odds: 2.15 }
    ]
  },
  // LOST BET
  {
    id: 3,
    betId: '17573423919',
    event: 'Bayern Munich vs Dortmund',
    market: 'Both Teams to Score',
    selection: 'Yes',
    odds: 1.75,
    totalOdds: 1.75,
    stake: 3000,
    potentialWin: 5250,
    tax: 630,
    netWon: 0,
    placedAt: '2026-06-30T18:30:00',
    settledAt: '2026-06-30T20:30:00',
    status: 'lost',
    bookingCode: 'GHI789',
    selections: [
      { match: 'Bayern Munich vs Dortmund', market: 'BTTS', pick: 'Yes', odds: 1.75 }
    ]
  },
  // OPEN BET
  {
    id: 4,
    betId: '17573423920',
    event: 'Chelsea vs Tottenham',
    market: '1X2 - Home',
    selection: 'Chelsea',
    odds: 1.95,
    totalOdds: 1.95,
    stake: 10000,
    potentialWin: 19500,
    tax: 2340,
    netWon: 0,
    placedAt: '2026-07-03T09:00:00',
    status: 'open',
    bookingCode: 'JKL012',
    selections: [
      { match: 'Chelsea vs Tottenham', market: '1X2', pick: 'Home', odds: 1.95 }
    ]
  }
]

// Computed
const statusLabel = computed(() => {
  if (!bet.value) return ''
  if (bet.value.status === 'won') return 'Won ✅'
  if (bet.value.status === 'lost') return 'Lost ❌'
  return 'Open ⏳'
})

const statusClass = computed(() => {
  if (!bet.value) return ''
  if (bet.value.status === 'won') return 'bg-green-900/30 text-green-400 border border-green-800/30'
  if (bet.value.status === 'lost') return 'bg-red-900/30 text-red-400 border border-red-800/30'
  return 'bg-rose-900/30 text-rose-400 border border-rose-800/30'
})

const formattedPlacedAt = computed(() => {
  if (!bet.value) return ''
  const date = new Date(bet.value.placedAt)
  return date.toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })
})

const formattedSettledAt = computed(() => {
  if (!bet.value?.settledAt) return ''
  const date = new Date(bet.value.settledAt)
  return date.toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })
})

// Methods
const loadBet = () => {
  const id = parseInt(route.params.id)
  bet.value = allBets.find(b => b.id === id) || null
}

const goBack = () => {
  router.push('/bets')
}

const cancelBet = () => {
  if (confirm('Are you sure you want to cancel this bet?')) {
    console.log('Bet cancelled:', bet.value?.id)
    // API call to cancel bet
  }
}

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
</style>