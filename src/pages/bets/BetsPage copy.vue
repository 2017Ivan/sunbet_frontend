<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <div class="max-w-4xl mx-auto px-4 py-6">
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">My Bets</h1>
        <p class="text-sm text-[#606060] mt-1">Track all your betting activity</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] mb-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
          :class="activeTab === tab.key
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/25'
            : 'text-[#606060] hover:text-white hover:bg-[#2A2A2A]'"
        >
          <span class="flex items-center justify-center gap-2">
            {{ tab.label }}
            <span 
              v-if="tab.badge && getBadgeCount(tab.key) > 0"
              class="px-1.5 py-0.5 text-[10px] font-bold rounded-full"
              :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'"
            >
              {{ getBadgeCount(tab.key) }}
            </span>
          </span>
        </button>
      </div>

      <!-- Content -->
      <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 min-h-[400px]">
        <!-- Open Bets -->
        <div v-if="activeTab === 'open'">
          <div v-if="openBets.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
            </div>
            <p class="text-[#606060] font-medium">No open bets</p>
            <p class="text-xs text-[#606060] mt-1">Place a bet to see it here</p>
          </div>
          <div v-else class="space-y-3">
            <BetCard
              v-for="bet in openBets"
              :key="bet.id"
              :bet="bet"
              status="open"
              @click="goToBetDetail(bet.id)"
            />
          </div>
        </div>

        <!-- Settled Bets -->
        <div v-if="activeTab === 'settled'">
          <div v-if="settledBets.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-[#606060] font-medium">No settled bets</p>
            <p class="text-xs text-[#606060] mt-1">Completed bets will appear here</p>
          </div>
          <div v-else class="space-y-3">
            <BetCard
              v-for="bet in settledBets"
              :key="bet.id"
              :bet="bet"
              status="settled"
              @click="goToBetDetail(bet.id)"
            />
          </div>
        </div>

        <!-- Virtual Bets -->
        <div v-if="activeTab === 'virtual'">
          <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                <line x1="8" y1="2" x2="8" y2="22"/>
                <line x1="16" y1="2" x2="16" y2="22"/>
                <line x1="2" y1="8" x2="22" y2="8"/>
                <line x1="2" y1="16" x2="22" y2="16"/>
              </svg>
            </div>
            <p class="text-[#606060] font-medium">Virtual Bets</p>
            <p class="text-xs text-[#606060] mt-1">Coming soon</p>
          </div>
        </div>

        <!-- Jackpot Bets -->
        <div v-if="activeTab === 'jackpot'">
          <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <svg class="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p class="text-[#606060] font-medium">Jackpot Bets</p>
            <p class="text-xs text-[#606060] mt-1">Coming soon</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BetCard from './component/ BetCard.vue'

const router = useRouter()

// Tabs
const tabs = [
  { key: 'open', label: 'Open', badge: true },
  { key: 'settled', label: 'Settled', badge: true },
  { key: 'virtual', label: 'Virtual' },
  { key: 'jackpot', label: 'Jackpot' },
]

const activeTab = ref('open')

// ---- Dummy Data ----
const openBets = ref([
  {
    id: 1,
    event: 'Manchester United vs Liverpool',
    market: '1X2 - Home',
    selection: 'Manchester United',
    odds: 2.15,
    stake: 5000,
    potentialWin: 10750,
    placedAt: '2024-01-15T14:30:00',
    status: 'open',
    bookingCode: 'ABC123',
    selections: [
      { match: 'Manchester United vs Liverpool', market: '1X2', pick: 'Home', odds: 2.15 },
      { match: 'Arsenal vs Chelsea', market: 'Over 2.5', pick: 'Over', odds: 1.85 }
    ]
  },
  {
    id: 2,
    event: 'Arsenal vs Chelsea',
    market: 'Over 2.5 Goals',
    selection: 'Over 2.5',
    odds: 1.85,
    stake: 2500,
    potentialWin: 4625,
    placedAt: '2024-01-15T16:45:00',
    status: 'open',
    bookingCode: 'XYZ789',
    selections: [
      { match: 'Arsenal vs Chelsea', market: 'Over 2.5', pick: 'Over', odds: 1.85 }
    ]
  }
])

const settledBets = ref([
  {
    id: 3,
    event: 'Real Madrid vs Barcelona',
    market: '1X2 - Home',
    selection: 'Real Madrid',
    odds: 1.95,
    stake: 10000,
    potentialWin: 19500,
    actualWin: 19500,
    placedAt: '2024-01-14T20:00:00',
    settledAt: '2024-01-14T22:00:00',
    status: 'won',
    result: 'Won',
    bookingCode: 'DEF456',
    selections: [
      { match: 'Real Madrid vs Barcelona', market: '1X2', pick: 'Home', odds: 1.95 }
    ]
  },
  {
    id: 4,
    event: 'Bayern Munich vs Dortmund',
    market: 'Both Teams to Score',
    selection: 'Yes',
    odds: 1.75,
    stake: 3000,
    potentialWin: 5250,
    actualWin: 0,
    placedAt: '2024-01-14T18:30:00',
    settledAt: '2024-01-14T20:30:00',
    status: 'lost',
    result: 'Lost',
    bookingCode: 'GHI789',
    selections: [
      { match: 'Bayern Munich vs Dortmund', market: 'BTTS', pick: 'Yes', odds: 1.75 }
    ]
  }
])

// Methods
const getBadgeCount = (tabKey) => {
  if (tabKey === 'open') return openBets.value.length
  if (tabKey === 'settled') return settledBets.value.length
  return 0
}

const goToBetDetail = (betId) => {
  router.push(`/bets/${betId}`)
}
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