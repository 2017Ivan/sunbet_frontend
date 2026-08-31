<template>
  <div class="mx-auto">
    <!-- Loading State -->
    <HomePageSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <div class="bg-white">
        <HeroSection />
        <GamesTabs :games="displayGames" />

        <!-- League Groups -->
        <div 
          v-for="(matches, leagueName) in groupedGames" 
          :key="leagueName"
          class=""
        >
          <!-- League Header -->
          <div class="sticky top-0 z-10 py-2 pl-1 bg-gradient-to-b from-gray-400 via-gray-700/0 to-gray-400 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-800 truncate">{{ leagueName }}</span>

              <div class="flex gap-1 flex-shrink-0">
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
                >
                  1
                </span>
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
                >
                  x
                </span>
                <span 
                  class="w-12  text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200"
                >
                  2
                </span>
              </div>
            </div>
          </div>

          <!-- Matches for this league -->
          <div class="bg-white overflow-hidden">
            <MatchCard 
              v-for="game in matches" 
              :key="game.id"
              :game="game"
              @click="navigateToMatch(game.id)"
            />
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center py-1.5 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-300 backdrop-blur-sm">
          <button 
            @click="navigateToSports" 
            class="text-gray-500 hover:text-rose-600 font-semibold text-sm transition-colors"
          >
            View All ({{ totalGamesCount }}) Sports 
          </button>
        </div>
        
        <RecentWinners :winners="recentWinners" :scroll-speed="1.5" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'
import HeroSection from '../../components/ui/HeroSection/HeroCarousel.vue'
import RecentWinners from '../../components/main components/RecentWinners/RecentWinners.vue'
import GamesTabs from '../../components/ui/games/ GamesTabs.vue'
import { useBetStore } from '../../stores/bet/betStore.js'
import { useMatchStore } from '../../stores/match/useMatchStore.js'
import HomePageSkeleton from '../../components/skeletons/home/HomePageSkeleton.vue'

// ---- Initialize Router ----
const router = useRouter()

// ---- Stores ----
const betStore = useBetStore()
const matchStore = useMatchStore()

// ---- Store Refs ----
const { upcomingMatches, liveMatches, loading } = storeToRefs(matchStore)

// ---- State ----
const isLoading = ref(true)
const allGames = ref([])
const displayGames = ref([])

// ---- Navigation Functions ----
const navigateToSports = () => {
  router.push({ name: 'sports' })
}

const navigateToMatch = (matchId) => {
  router.push({
    name: 'sport-detail',
    params: { id: matchId }
  })
}

// ---- Transform DB match to frontend format ----
const transformMatch = (dbMatch) => {
  // Extract odds from 1X2 market
  const odds1X2 = dbMatch.odds?.['1X2'] || {}
  
  return {
    id: dbMatch.id || dbMatch.match_id,
    league: dbMatch.league || 'Unknown League',
    time: dbMatch.time || '00:00',
    date: dbMatch.date || new Date().toLocaleDateString(),
    status: dbMatch.status || 'Upcoming',
    sport: detectSport(dbMatch.league),
    homeTeam: dbMatch.home_team || 'Unknown',
    awayTeam: dbMatch.away_team || 'Unknown',
    odds: {
      home: parseFloat(odds1X2['1']) || 1.00,
      draw: parseFloat(odds1X2['X']) || 1.00,
      away: parseFloat(odds1X2['2']) || 1.00
    },
    totalBets: dbMatch.total_bets || Math.floor(Math.random() * 50) + 10,
    // Keep original data for detailed view
    _raw: dbMatch
  }
}

// ---- Detect sport from league name ----
const detectSport = (league) => {
  const leagueLower = (league || '').toLowerCase()
  if (leagueLower.includes('basketball') || leagueLower.includes('nba')) return 'basketball'
  if (leagueLower.includes('tennis') || leagueLower.includes('wimbledon')) return 'tennis'
  if (leagueLower.includes('cricket') || leagueLower.includes('icc')) return 'cricket'
  if (leagueLower.includes('rugby')) return 'rugby'
  return 'football'
}

// ---- Load games from store ----
const loadGames = async () => {
  isLoading.value = true
  
  try {
    // Fetch matches from database
    await matchStore.fetchAllMatches()
    
    // Combine upcoming and live matches
    const allMatches = [...upcomingMatches.value, ...liveMatches.value]
    
    // Transform to frontend format
    const mappedGames = allMatches.map(transformMatch)
    
    allGames.value = mappedGames
    
    // Take only first 7 games for display
    displayGames.value = mappedGames.slice(0, 7)
    
  } catch (error) {
    console.error('Error loading games from store:', error)
    allGames.value = []
    displayGames.value = []
  } finally {
    isLoading.value = false
  }
}

// ---- Group games by league (for display) ----
const groupedGames = computed(() => {
  const groups = {}
  displayGames.value.forEach(game => {
    if (!groups[game.league]) {
      groups[game.league] = []
    }
    groups[game.league].push(game)
  })
  return groups
})

// ---- Total games count (from all games, not just display) ----
const totalGamesCount = computed(() => {
  return allGames.value.length
})

// ---- Watch for store updates and refresh display ----
watch(
  [upcomingMatches, liveMatches],
  () => {
    // Only refresh if not loading and has data
    if (!loading.value && upcomingMatches.value.length > 0) {
      const allMatches = [...upcomingMatches.value, ...liveMatches.value]
      const mappedGames = allMatches.map(transformMatch)
      allGames.value = mappedGames
      displayGames.value = mappedGames.slice(0, 7)
    }
  },
  { deep: true }
)

// ---- Recent winners ----
const recentWinners = [
  { 
    initials: 'JM', 
    phone: '+255677453123',
    name: 'James M.', 
    bet: 'Accumulator x8', 
    sport: 'Football', 
    amount: 'TZS 4,200,000', 
    time: '5 min ago', 
    avatarColor: '#A32D2D' 
  },
  { 
    initials: 'AK', 
    phone: '+255712345678',
    name: 'Amina K.', 
    bet: 'Single bet', 
    sport: 'Tennis', 
    amount: 'TZS 850,000', 
    time: '12 min ago', 
    avatarColor: '#7A1F1F' 
  },
  { 
    initials: 'SM', 
    phone: '+255756789012',
    name: 'Said M.', 
    bet: 'Double bet', 
    sport: 'Basketball', 
    amount: 'TZS 1,350,000', 
    time: '28 min ago', 
    avatarColor: '#C94040' 
  },
  { 
    initials: 'FH', 
    phone: '+255698765432',
    name: 'Fatuma H.', 
    bet: 'Accumulator x5', 
    sport: 'Football', 
    amount: 'TZS 2,780,000', 
    time: '1 hr ago', 
    avatarColor: '#6B1A1A' 
  },
  { 
    initials: 'DM', 
    phone: '+255623456789',
    name: 'David M.', 
    bet: 'Single bet', 
    sport: 'Cricket', 
    amount: 'TZS 420,000', 
    time: '2 hrs ago', 
    avatarColor: '#8B2020' 
  },
]

// ---- Initialize socket connection when component mounts ----
onMounted(() => {
  // Load matches
  loadGames()
  
  // Initialize socket for real-time updates
  matchStore.initMatchSocket()
})

// ---- Cleanup socket on unmount ----
import { onUnmounted } from 'vue'
onUnmounted(() => {
  matchStore.disconnectSocket()
})
</script>