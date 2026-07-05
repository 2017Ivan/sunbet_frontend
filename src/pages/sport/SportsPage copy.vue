<template>
  <div class="min-h-screen bg-gray-50 pb-10">

    <!-- ══ HEADER ══ -->
    <div class="relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_50%,rgba(244,63,94,0.06),transparent_60%)]"></div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent"></div>

      <div class="relative max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-white tracking-wide">Sports</h1>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-gray-400">{{ totalMatches }} Matches</span>
          <span class="w-px h-5 bg-gray-700"></span>
          <span class="text-red-400 font-semibold">{{ liveMatches }} Live</span>
        </div>
      </div>
    </div>

    <!-- ══ SPORTS FILTER TABS ══ -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
          <button
            v-for="sport in sportsFilter"
            :key="sport.id"
            @click="selectedSport = sport.id"
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            :class="selectedSport === sport.id
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'"
          >
            <span>{{ sport.icon }}</span>
            {{ sport.name }}
            <span class="text-[10px] opacity-60 ml-0.5">({{ sport.count }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ══ SPORTS CONTENT ══ -->
    <div class="max-w-7xl mx-auto px-4 mt-6">

      <!-- Live Matches Banner -->
      <div v-if="liveMatches > 0" class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span class="text-sm font-bold text-red-600">{{ liveMatches }} Live Matches</span>
          <span class="text-xs text-gray-500">Watch the action now!</span>
        </div>
        <button class="text-xs text-rose-500 hover:text-rose-600 font-semibold">View All →</button>
      </div>

      <!-- League Groups -->
      <div 
        v-for="(matches, leagueName) in filteredGames" 
        :key="leagueName"
        class="mb-4"
      >
        <!-- League Header -->
        <div class="sticky top-12 z-10 py-2 px-1 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-700 truncate">{{ leagueName }}</span>
            <div class="flex gap-1 flex-shrink-0">
              <span class="w-12 sm:w-14 text-center text-xs font-bold text-gray-500">1</span>
              <span class="w-12 sm:w-14 text-center text-xs font-bold text-gray-500">x</span>
              <span class="w-12 sm:w-14 text-center text-xs font-bold text-gray-500">2</span>
            </div>
          </div>
        </div>

        <!-- Matches -->
        <div class="bg-white rounded-b-xl border border-gray-200 overflow-hidden shadow-sm">
          <MatchCard 
            v-for="game in matches" 
            :key="game.id"
            :game="game"
          />
        </div>
      </div>

      <!-- No Matches -->
      <div v-if="Object.keys(filteredGames).length === 0" class="text-center py-12">
        <div class="text-5xl mb-3">🏟️</div>
        <p class="text-gray-500 text-sm">No matches available for this sport</p>
        <p class="text-gray-400 text-xs mt-1">Check back later for updates</p>
      </div>

      <!-- View All Button -->
      <div class="text-center py-3 mt-2 bg-white border border-gray-200 rounded-xl shadow-sm">
        <button class="text-gray-500 hover:text-rose-500 font-semibold text-sm transition-colors">
          View All ({{ totalMatches }}) Sports 
        </button>
      </div>
      
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'

const router = useRouter()

// ---- State ----
const selectedSport = ref('all')

// ---- Sports Filter ----
const sportsFilter = [
  { id: 'all', name: 'All Sports', icon: '⚽', count: 25 },
  { id: 'football', name: 'Football', icon: '⚽', count: 15 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 4 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 3 },
  { id: 'cricket', name: 'Cricket', icon: '🏏', count: 2 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', count: 1 },
]

// ---- Games Data ----
const games = ref([
  // Football
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
    totalBets: 40
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
    totalBets: 35
  },
  {
    id: 3,
    league: 'Spain - La Liga',
    time: '45:00',
    date: 'Tue 06/15',
    status: 'HT',
    sport: 'football',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    odds: { home: 2.30, draw: 3.20, away: 3.10 },
    totalBets: 98
  },
  {
    id: 4,
    league: 'Spain - La Liga',
    time: '68:30',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Sevilla',
    odds: { home: 2.10, draw: 3.30, away: 3.60 },
    totalBets: 75
  },
  {
    id: 5,
    league: 'Italy - Serie A',
    time: '82:15',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'AC Milan',
    awayTeam: 'Inter Milan',
    odds: { home: 2.60, draw: 3.30, away: 2.80 },
    totalBets: 45
  },
  {
    id: 6,
    league: 'Italy - Serie A',
    time: '50:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Juventus',
    awayTeam: 'Napoli',
    odds: { home: 2.20, draw: 3.20, away: 3.50 },
    totalBets: 62
  },
  // Basketball
  {
    id: 7,
    league: 'NBA - Regular Season',
    time: '88:12',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'basketball',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    odds: { home: 1.85, draw: 1.95, away: 2.10 },
    totalBets: 56
  },
  {
    id: 8,
    league: 'NBA - Regular Season',
    time: '78:45',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'basketball',
    homeTeam: 'Miami Heat',
    awayTeam: 'Boston Celtics',
    odds: { home: 2.20, draw: 1.90, away: 2.50 },
    totalBets: 34
  },
  // Tennis
  {
    id: 9,
    league: 'Wimbledon - Men\'s Singles',
    time: '15:30',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'tennis',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Novak Djokovic',
    odds: { home: 2.40, draw: 1.80, away: 2.90 },
    totalBets: 28
  },
  {
    id: 10,
    league: 'Wimbledon - Women\'s Singles',
    time: '14:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'tennis',
    homeTeam: 'Iga Swiatek',
    awayTeam: 'Aryna Sabalenka',
    odds: { home: 1.95, draw: 2.10, away: 2.70 },
    totalBets: 22
  },
  // Cricket
  {
    id: 11,
    league: 'ICC World Cup - Group Stage',
    time: '35:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'cricket',
    homeTeam: 'India',
    awayTeam: 'Australia',
    odds: { home: 1.75, draw: 2.20, away: 2.85 },
    totalBets: 67
  },
  // Rugby
  {
    id: 12,
    league: 'Six Nations Championship',
    time: '55:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'rugby',
    homeTeam: 'England',
    awayTeam: 'France',
    odds: { home: 2.30, draw: 2.50, away: 2.80 },
    totalBets: 31
  }
])

// ---- Computed ----
const filteredGames = computed(() => {
  const filtered = selectedSport.value === 'all' 
    ? games.value 
    : games.value.filter(g => g.sport === selectedSport.value)
  
  const groups = {}
  filtered.forEach(game => {
    if (!groups[game.league]) {
      groups[game.league] = []
    }
    groups[game.league].push(game)
  })
  return groups
})

const totalMatches = computed(() => games.value.length)
const liveMatches = computed(() => games.value.filter(g => g.status.includes('H') || g.status === 'HT').length)
const liveGames = computed(() => games.value.filter(g => g.status.includes('H') || g.status === 'HT'))
</script>

<style scoped>
/* Hide scrollbar for filter tabs */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  background: #f43f5e;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sticky header offset */
.sticky {
  position: sticky;
}
.top-12 {
  top: 48px;
}
</style>