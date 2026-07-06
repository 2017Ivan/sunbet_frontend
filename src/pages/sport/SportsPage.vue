<template>
  <div class="min-h-screen bg-white pb-10">

    <!-- ══ SPORTS FILTER TABS ══ -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
          <button
            v-for="sport in sportsFilter"
            :key="sport.id"
            @click="selectedSport = sport.id"
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            :class="selectedSport === sport.id
              ? 'bg-gray-800 text-white shadow-md shadow-rose-500/30'
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
    <div class="max-w-7xl mx-auto  mt-3">

     

      <!-- League Groups -->
      <div  
        v-for="(matches, leagueName) in filteredGames" 
        :key="leagueName"
        class="mb-0"
      >
        <!-- League Header -->
        <div class="sticky top-12 z-10 py-2 pl-1 bg-gradient-to-b from-gray-400 via-gray-700/0  to-gray-400 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-800 truncate">{{ leagueName }}</span>

            <div class="flex gap-1 flex-shrink-0">
              <span 
                class="w-12 sm:w-14 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
              >
                1
              </span>
              <span 
                class="w-12 sm:w-14 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
              >
                x
              </span>
              <span 
                class="w-12 sm:w-14 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
              >
                2
              </span>
            </div>
          </div>
        </div>

        <!-- Matches for this league -->
        <div class="bg-white overflow-hidden shadow-sm">
          <MatchCard 
            v-for="game in matches" 
            :key="game.id"
            :game="game"
          />
        </div>
      </div>

      <!-- No Matches -->
      <div v-if="Object.keys(filteredGames).length === 0" class="text-center ">
        <div class="text-5xl mb-3">🏟️</div>
        <p class="text-gray-500 text-sm">No matches available for this sport</p>
        <p class="text-gray-400 text-xs mt-1">Check back later for updates</p>
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
  { id: 'all', name: 'All Sports', icon: '⚽', count: 0 },
  { id: 'football', name: 'Football', icon: '⚽', count: 0 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0 },
  { id: 'cricket', name: 'Cricket', icon: '🏏', count: 0 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', count: 0 },
]

// ---- Games Data ----
const games = ref([
  // ============================================
  // ENGLAND - PREMIER LEAGUE
  // ============================================
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
    league: 'England - Premier League',
    time: '88:12',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    odds: { home: 1.60, draw: 4.00, away: 6.00 },
    totalBets: 89
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
    totalBets: 67
  },

  // ============================================
  // SPAIN - LA LIGA
  // ============================================
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
    totalBets: 98
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
    totalBets: 75
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
    totalBets: 52
  },

  // ============================================
  // ITALY - SERIE A
  // ============================================
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
    totalBets: 45
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
    totalBets: 62
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
    totalBets: 55
  },

  // ============================================
  // BRAZIL - U20 PIAUIENSE
  // ============================================
  {
    id: 11,
    league: 'Brazil - U20 Piauiense',
    time: '23:22',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'River-PI U20',
    awayTeam: 'AE Altos U20',
    odds: { home: 2.85, draw: 3.40, away: 2.20 },
    totalBets: 40
  },
  {
    id: 12,
    league: 'Brazil - U20 Piauiense',
    time: '22:15',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'football',
    homeTeam: 'Piauí U20',
    awayTeam: 'River-PI U20',
    odds: { home: 3.10, draw: 3.20, away: 2.40 },
    totalBets: 35
  },

  // ============================================
  // ICELAND - U19 LEAGUE
  // ============================================
  {
    id: 13,
    league: 'Iceland - U19 League',
    time: '75:24',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Fylkir/Ellidi U19',
    awayTeam: 'HK/Ymir U19',
    odds: { home: 40.00, draw: 10.00, away: 1.03 },
    totalBets: 25
  },
  {
    id: 14,
    league: 'Iceland - U19 League',
    time: '63:33',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'football',
    homeTeam: 'Stjarnan/KFG U19',
    awayTeam: 'Leiknir U19',
    odds: { home: 1.41, draw: 4.10, away: 6.70 },
    totalBets: 22
  },

  // ============================================
  // BASKETBALL - NBA
  // ============================================
  {
    id: 15,
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
    id: 16,
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
  {
    id: 17,
    league: 'NBA - Regular Season',
    time: '55:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'basketball',
    homeTeam: 'Denver Nuggets',
    awayTeam: 'Phoenix Suns',
    odds: { home: 1.95, draw: 2.10, away: 2.60 },
    totalBets: 28
  },

  // ============================================
  // TENNIS - WIMBLEDON
  // ============================================
  {
    id: 18,
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
    id: 19,
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
  {
    id: 20,
    league: 'Wimbledon - Men\'s Singles',
    time: '12:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'tennis',
    homeTeam: 'Jannik Sinner',
    awayTeam: 'Daniil Medvedev',
    odds: { home: 2.10, draw: 2.00, away: 2.80 },
    totalBets: 18
  },

  // ============================================
  // CRICKET - ICC WORLD CUP
  // ============================================
  {
    id: 21,
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
  {
    id: 22,
    league: 'ICC World Cup - Group Stage',
    time: '28:00',
    date: 'Tue 06/15',
    status: 'H1',
    sport: 'cricket',
    homeTeam: 'England',
    awayTeam: 'New Zealand',
    odds: { home: 2.10, draw: 2.00, away: 2.90 },
    totalBets: 45
  },

  // ============================================
  // RUGBY - SIX NATIONS
  // ============================================
  {
    id: 23,
    league: 'Six Nations Championship',
    time: '55:00',
    date: 'Tue 06/15',
    status: 'H2',
    sport: 'rugby',
    homeTeam: 'England',
    awayTeam: 'France',
    odds: { home: 2.30, draw: 2.50, away: 2.80 },
    totalBets: 31
  },
  {
    id: 24,
    league: 'Six Nations Championship',
    time: '42:00',
    date: 'Tue 06/15',
    status: 'HT',
    sport: 'rugby',
    homeTeam: 'Ireland',
    awayTeam: 'Scotland',
    odds: { home: 1.90, draw: 2.60, away: 3.20 },
    totalBets: 24
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

const liveMatches = computed(() => {
  return games.value.filter(g => g.status.includes('H') || g.status === 'HT').length
})

// Update sport counts
const updateSportCounts = () => {
  const counts = {}
  games.value.forEach(game => {
    counts[game.sport] = (counts[game.sport] || 0) + 1
  })
  sportsFilter.forEach(sport => {
    if (sport.id === 'all') {
      sport.count = games.value.length
    } else {
      sport.count = counts[sport.id] || 0
    }
  })
}
updateSportCounts()
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

/* Animations */
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