<!-- SportsPage.vue -->
<template>
  <div class="min-h-screen bg-white pb-10">
    <!-- Loading State -->
    <SportsPageSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <!-- ══ SPORTS FILTER TABS ══ -->
      <div class="sticky top-0 z-20 bg-gray-800 border-b border-gray-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            <button
              v-for="sport in sportsFilter"
              :key="sport.id"
              @click="selectedSport = sport.id"
              class="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
              :class="selectedSport === sport.id
                ? 'bg-gray-700 text-white shadow-md shadow-rose-500/30'
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'"
            >
              <span>{{ sport.icon }}</span>
              {{ sport.name }}
              <span class="text-[10px] opacity-60 ml-0.5">({{ sport.count }})</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ══ SPORTS CONTENT ══ -->
      <div class="max-w-7xl mx-auto  px-0">

        <!-- League Groups -->
        <div  
          v-for="(matches, leagueName) in filteredGames" 
          :key="leagueName"
          class="mb-0"
        >
          <!-- League Header -->
          <div class="sticky top-12 z-10 py-2 pl-1 bg-gradient-to-b from-gray-400 via-gray-700/0 to-gray-400 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-800 truncate">{{ leagueName }}</span>

              <div class="flex gap-1 flex-shrink-0">
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-300 rounded transition-colors duration-200"
                >
                  1
                </span>
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-300 rounded transition-colors duration-200"
                >
                  x
                </span>
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-300 rounded transition-colors duration-200"
                >
                  2
                </span>
              </div>
            </div>
          </div>

          <!-- Matches for this league -->
          <div class="overflow-hidden shadow-sm">
            <MatchCard 
              v-for="game in matches" 
              :key="game.id"
              :game="game"
              @click="navigateToMatch(game.id)"
            />
          </div>
        </div>

        <!-- No Matches -->
        <div v-if="Object.keys(filteredGames).length === 0" class="text-center py-12">
          <div class="text-5xl mb-3">🏟️</div>
          <p class="text-gray-400 text-sm">No matches available for this sport</p>
          <p class="text-gray-500 text-xs mt-1">Check back later for updates</p>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'
import gamesData from '../../assets/DataManager/MatchePaser.js'
import SportsPageSkeleton from '../../components/skeletons/sport/SportsPageSkeleton.vue'

const router = useRouter()

// ---- State ----
const isLoading = ref(true)

// ---- Navigation ----
const navigateToMatch = (matchId) => {
  router.push({
    name: 'sport-detail',
    params: { id: matchId }
  })
}

// ---- State ----
const selectedSport = ref('all')
const games = ref([])

// ---- Sports Filter ----
const sportsFilter = [
  { id: 'all', name: 'All Sports', icon: '⚽', count: 0 },
  { id: 'football', name: 'Football', icon: '⚽', count: 0 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0 },
  { id: 'cricket', name: 'Cricket', icon: '🏏', count: 0 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', count: 0 },
]

// ---- Detect sport from league name ----
const detectSport = (league) => {
  const leagueLower = league.toLowerCase()
  if (leagueLower.includes('basketball') || leagueLower.includes('nba')) return 'basketball'
  if (leagueLower.includes('tennis') || leagueLower.includes('wimbledon')) return 'tennis'
  if (leagueLower.includes('cricket') || leagueLower.includes('icc')) return 'cricket'
  if (leagueLower.includes('rugby')) return 'rugby'
  return 'football'
}

// ---- Load Games from CSV Parser ----
const loadGames = () => {
  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    try {
      // Map the parsed data to match the expected format
      const mappedGames = gamesData.map((item, index) => ({
        id: item.id || index + 1,
        league: item.league || 'Unknown League',
        time: item.time || '00:00',
        date: item.date || new Date().toLocaleDateString(),
        status: 'Upcoming', // All games from CSV are upcoming
        sport: detectSport(item.league),
        homeTeam: item.homeTeam || 'Unknown',
        awayTeam: item.awayTeam || 'Unknown',
        odds: {
          home: parseFloat(item.homeOdds) || 1.00,
          draw: parseFloat(item.drawOdds) || 1.00,
          away: parseFloat(item.awayOdds) || 1.00
        },
        totalBets: item.market || Math.floor(Math.random() * 50) + 10
      }))

      games.value = mappedGames
      updateSportCounts()
    } catch (error) {
      console.error('Error loading games data:', error)
      games.value = []
    } finally {
      isLoading.value = false
    }
  }, 800) // Simulate loading delay
}

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

// ---- Load data on mount ----
onMounted(() => {
  loadGames()
})
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
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
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