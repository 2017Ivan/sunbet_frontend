<!-- SportDetailPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <!-- Back Button & Header -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-800">{{ match?.homeTeam }} vs {{ match?.awayTeam }}</h1>
            <p class="text-xs text-gray-500">{{ match?.league }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Details Content -->
    <div class="max-w-7xl mx-auto px-4 mt-4" v-if="match">
      <!-- Match Status Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div class="flex flex-col items-center">
          <!-- Status Badge -->
          <div class="mb-4">
            <span 
              class="px-4 py-1.5 rounded-full text-xs font-semibold"
              :class="getStatusColor(match.status)"
            >
              {{ getStatusText(match.status) }}
            </span>
          </div>

          <!-- Teams -->
          <div class="flex items-center justify-between w-full max-w-2xl gap-4">
            <!-- Home Team -->
            <div class="flex flex-col items-center flex-1">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 mb-2">
                {{ getTeamInitials(match.homeTeam) }}
              </div>
              <span class="text-sm font-semibold text-gray-800 text-center">{{ match.homeTeam }}</span>
              <span class="text-2xl font-bold text-gray-900 mt-1">{{ match.score?.home || '-' }}</span>
            </div>

            <!-- VS / Time -->
            <div class="flex flex-col items-center px-4">
              <span class="text-xs font-bold text-gray-400 uppercase">vs</span>
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mt-2">
                <span class="text-sm font-bold text-gray-600">{{ match.time || match.status }}</span>
              </div>
            </div>

            <!-- Away Team -->
            <div class="flex flex-col items-center flex-1">
              <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-2xl font-bold text-red-700 mb-2">
                {{ getTeamInitials(match.awayTeam) }}
              </div>
              <span class="text-sm font-semibold text-gray-800 text-center">{{ match.awayTeam }}</span>
              <span class="text-2xl font-bold text-gray-900 mt-1">{{ match.score?.away || '-' }}</span>
            </div>
          </div>

          <!-- Match Info -->
          <div class="mt-6 pt-4 border-t border-gray-100 w-full">
            <div class="flex justify-center gap-8 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ match.date }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ match.time }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ match.totalBets || 0 }} bets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Odds Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h3 class="text-sm font-bold text-gray-700 mb-4">📊 Match Odds</h3>
        <div class="grid grid-cols-3 gap-3">
          <div 
            v-for="(odd, type) in match.odds" 
            :key="type"
            class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="selectOdd(type, odd)"
          >
            <p class="text-xs text-gray-500 uppercase font-medium">{{ getOddLabel(type) }}</p>
            <p class="text-xl font-bold text-gray-800 mt-1">{{ odd.toFixed(2) }}</p>
            <p class="text-xs text-gray-400 mt-1">Click to bet</p>
          </div>
        </div>
      </div>

      <!-- Match Statistics -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h3 class="text-sm font-bold text-gray-700 mb-4">📈 Match Statistics</h3>
        <div class="space-y-3">
          <div v-for="stat in matchStats" :key="stat.label" class="flex items-center gap-3">
            <span class="text-xs text-gray-500 w-20">{{ stat.label }}</span>
            <div class="flex-1 flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-700 w-8 text-right">{{ stat.home }}</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  :style="{ width: stat.homePercent + '%' }"
                ></div>
              </div>
              <span class="text-xs font-semibold text-gray-700 w-8 text-left">{{ stat.away }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Matches / Head to Head -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-sm font-bold text-gray-700 mb-4">🔄 Head to Head</h3>
        <div class="space-y-2">
          <div 
            v-for="(h2h, index) in headToHead" 
            :key="index"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs font-medium text-gray-600">{{ h2h.date }}</span>
              <span class="text-xs text-gray-500">{{ h2h.homeTeam }}</span>
              <span class="text-xs font-bold text-gray-700">{{ h2h.score }}</span>
              <span class="text-xs text-gray-500">{{ h2h.awayTeam }}</span>
            </div>
            <span 
              class="text-xs px-2 py-0.5 rounded-full"
              :class="h2h.winner === 'home' ? 'bg-green-100 text-green-700' : h2h.winner === 'away' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ h2h.winner === 'home' ? '🏠' : h2h.winner === 'away' ? '✈️' : '🤝' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
        <p class="text-gray-500 mt-4 text-sm">Loading match details...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBetStore } from '../../../stores/bets/betStore.js'

const route = useRoute()
const router = useRouter()
const betStore = useBetStore()
const match = ref(null)

// Complete match data - In a real app, this would come from an API
const allMatches = [
  {
    id: 1,
    league: 'England - Premier League',
    time: '23:22',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    odds: { home: 2.85, draw: 3.40, away: 2.20 },
    totalBets: 40,
    score: { home: 1, away: 0 }
  },
  {
    id: 2,
    league: 'England - Premier League',
    time: '22:15',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    odds: { home: 3.10, draw: 3.20, away: 2.40 },
    totalBets: 35,
    score: { home: 2, away: 1 }
  },
  {
    id: 3,
    league: 'England - Premier League',
    time: '88:12',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    odds: { home: 1.60, draw: 4.00, away: 6.00 },
    totalBets: 89,
    score: { home: 3, away: 1 }
  },
  {
    id: 4,
    league: 'England - Premier League',
    time: '55:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Newcastle United',
    awayTeam: 'Aston Villa',
    odds: { home: 2.40, draw: 3.30, away: 3.10 },
    totalBets: 67,
    score: { home: 1, away: 1 }
  },
  {
    id: 5,
    league: 'Spain - La Liga',
    time: '45:00',
    date: 'Tue 06/15',
    status: 'HT',
    sport: 'football',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    odds: { home: 2.30, draw: 3.20, away: 3.10 },
    totalBets: 98,
    score: { home: 2, away: 2 }
  },
  {
    id: 6,
    league: 'Spain - La Liga',
    time: '68:30',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Sevilla',
    odds: { home: 2.10, draw: 3.30, away: 3.60 },
    totalBets: 75,
    score: { home: 1, away: 0 }
  },
  {
    id: 7,
    league: 'Spain - La Liga',
    time: '35:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'Villarreal',
    awayTeam: 'Real Sociedad',
    odds: { home: 2.70, draw: 3.20, away: 2.80 },
    totalBets: 52,
    score: { home: 0, away: 0 }
  },
  {
    id: 8,
    league: 'Italy - Serie A',
    time: '82:15',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'AC Milan',
    awayTeam: 'Inter Milan',
    odds: { home: 2.60, draw: 3.30, away: 2.80 },
    totalBets: 45,
    score: { home: 2, away: 0 }
  },
  {
    id: 9,
    league: 'Italy - Serie A',
    time: '50:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Juventus',
    awayTeam: 'Napoli',
    odds: { home: 2.20, draw: 3.20, away: 3.50 },
    totalBets: 62,
    score: { home: 2, away: 2 }
  },
  {
    id: 10,
    league: 'Italy - Serie A',
    time: '28:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'AS Roma',
    awayTeam: 'Lazio',
    odds: { home: 2.40, draw: 3.10, away: 3.20 },
    totalBets: 55,
    score: { home: 0, away: 1 }
  }
]

// Match statistics based on match ID
const getMatchStats = (matchId) => {
  const statsMap = {
    1: [
      { label: 'Possession', home: 58, away: 42, homePercent: 58 },
      { label: 'Shots on Target', home: 7, away: 4, homePercent: 64 },
      { label: 'Passes', home: 423, away: 356, homePercent: 54 },
      { label: 'Tackles', home: 18, away: 22, homePercent: 45 },
      { label: 'Corners', home: 6, away: 3, homePercent: 67 }
    ],
    2: [
      { label: 'Possession', home: 45, away: 55, homePercent: 45 },
      { label: 'Shots on Target', home: 4, away: 6, homePercent: 40 },
      { label: 'Passes', home: 356, away: 423, homePercent: 46 },
      { label: 'Tackles', home: 22, away: 18, homePercent: 55 },
      { label: 'Corners', home: 3, away: 6, homePercent: 33 }
    ]
  }
  return statsMap[matchId] || [
    { label: 'Possession', home: 50, away: 50, homePercent: 50 },
    { label: 'Shots on Target', home: 5, away: 5, homePercent: 50 },
    { label: 'Passes', home: 380, away: 380, homePercent: 50 },
    { label: 'Tackles', home: 20, away: 20, homePercent: 50 },
    { label: 'Corners', home: 4, away: 4, homePercent: 50 }
  ]
}

// Head to head data based on match
const getHeadToHead = (homeTeam, awayTeam) => {
  return [
    { date: '2024-01-15', homeTeam, awayTeam, score: '2-2', winner: 'draw' },
    { date: '2023-10-22', homeTeam, awayTeam, score: '1-3', winner: 'away' },
    { date: '2023-08-05', homeTeam, awayTeam, score: '0-1', winner: 'away' },
    { date: '2023-05-20', homeTeam, awayTeam, score: '2-1', winner: 'home' }
  ]
}

// Methods
const goBack = () => {
  router.back()
}

const getTeamInitials = (teamName) => {
  if (!teamName) return '??'
  return teamName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getStatusColor = (status) => {
  if (status === 'H1' || status === 'H2') return 'bg-green-100 text-green-700'
  if (status === 'HT') return 'bg-yellow-100 text-yellow-700'
  if (status === 'FT') return 'bg-gray-100 text-gray-700'
  return 'bg-blue-100 text-blue-700'
}

const getStatusText = (status) => {
  const statusMap = {
    'H1': '⏳ First Half',
    'H2': '⏳ Second Half',
    'HT': '⏸️ Half Time',
    'FT': '✅ Full Time'
  }
  return statusMap[status] || status
}

const getOddLabel = (type) => {
  const labelMap = {
    'home': 'Home',
    'draw': 'Draw',
    'away': 'Away'
  }
  return labelMap[type] || type
}

const selectOdd = (type, odd) => {
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  const pick = type === 'home' ? match.value.homeTeam : type === 'draw' ? 'Draw' : match.value.awayTeam
  
  // Check if already selected
  if (betStore.isSelected(match.value.id, marketKey)) {
    betStore.removeFromSlip(match.value.id, marketKey)
    return
  }
  
  const selection = {
    matchId: match.value.id,
    matchName: `${match.value.homeTeam} vs ${match.value.awayTeam}`,
    league: match.value.league,
    market: '1X2',
    marketKey: marketKey,
    pick: pick,
    odds: odd,
    type: 'sports'
  }
  
  console.log('📝 Adding to slip from detail page:', selection)
  betStore.addToSlip(selection)
  betStore.isOpen = true
}

// Load match data based on route param
onMounted(() => {
  const matchId = parseInt(route.params.id)
  const foundMatch = allMatches.find(m => m.id === matchId)
  
  if (foundMatch) {
    match.value = foundMatch
    // Update matchStats and headToHead based on the match
    matchStats.value = getMatchStats(matchId)
    headToHead.value = getHeadToHead(foundMatch.homeTeam, foundMatch.awayTeam)
  } else {
    router.push('/sports')
  }
})

// Reactive references
const matchStats = ref([])
const headToHead = ref([])
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #f9fafb;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>