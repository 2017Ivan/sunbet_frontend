<template>
  <div class="mx-auto">
    <!-- Loading State -->
    <HomePageSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <div class="bg-white">
        <HeroSection />
        <GamesTabs :games="displayGames" />

        <!-- No Matches Found -->
        <div v-if="displayGames.length === 0" class="py-12 text-center bg-gray-900">
          <div class="flex flex-col items-center justify-center gap-4">
            <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-bold text-gray-600">No Matches Found</h3>
            <p class="text-sm text-gray-500 max-w-sm">
              There are currently no matches available. Please check back later for upcoming games.
            </p>
            <button 
              @click="refreshMatches" 
              class="px-6 py-2 mt-2 text-sm font-semibold text-white transition-colors bg-rose-600 rounded-lg hover:bg-rose-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <!-- League Groups -->
        <div 
          v-else
          v-for="(matches, leagueName) in groupedGames" 
          :key="leagueName"
        >
          <!-- League Header -->
          <div class="sticky top-0 z-10 py-2 pl-1 bg-gradient-to-b from-gray-400 via-gray-700/0 to-gray-400 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-800 truncate">{{ leagueName }}</span>

              <div class="flex gap-1 flex-shrink-0">
                <span class="w-12 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200">1</span>
                <span class="w-12 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200">X</span>
                <span class="w-12 text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-white rounded transition-colors duration-200">2</span>
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
        <div v-if="displayGames.length > 0" class="text-center py-1.5 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-300 backdrop-blur-sm">
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'
import HeroSection from '../../components/ui/HeroSection/HeroCarousel.vue'
import RecentWinners from '../../components/main components/RecentWinners/RecentWinners.vue'
import GamesTabs from '../../components/ui/games/ GamesTabs.vue'
import { useMatchStore } from '../../stores/match/useMatchStore.js'
import HomePageSkeleton from '../../components/skeletons/home/HomePageSkeleton.vue'

const router = useRouter()
const matchStore = useMatchStore()
const { upcomingMatches, liveMatches, loading } = storeToRefs(matchStore)

const isLoading = ref(true)
const allGames = ref([])
const displayGames = ref([])

const navigateToSports = () => router.push({ name: 'sports' })
const navigateToMatch = (matchId) => router.push({ name: 'sport-detail', params: { id: matchId } })
const refreshMatches = async () => await loadGames()

// ============================================
// 🔄 TRANSFORM MATCH (BOOMBET STYLE PASS-THROUGH)
// ============================================
const transformMatch = (dbMatch) => {
  const odds1X2 = dbMatch.odds?.['1X2'] || dbMatch.odds || {}

  return {
    id: dbMatch.id || dbMatch.match_id,
    league: dbMatch.league || 'Unknown League',
    time: dbMatch.time || dbMatch.match_time || '',
    date: dbMatch.date || dbMatch.match_date || '',
    elapsed_minute: dbMatch.elapsed_minute ?? dbMatch.current_minute, // Direct copy for live minutes
    status: dbMatch.status || (dbMatch.live ? 'LIVE' : 'UPCOMING'),
    live: dbMatch.status === 'LIVE' || dbMatch.live || false,
    sport: detectSport(dbMatch.league),
    homeTeam: dbMatch.home_team || dbMatch.homeTeam || 'Unknown',
    awayTeam: dbMatch.away_team || dbMatch.awayTeam || 'Unknown',
    currentScore: dbMatch.current_score || dbMatch.score || { home: 0, away: 0 },
    predetermined_script: dbMatch.predetermined_script,
    odds: {
      home: parseFloat(odds1X2['1'] || odds1X2.home) || null,
      draw: parseFloat(odds1X2['X'] || odds1X2.draw) || null,
      away: parseFloat(odds1X2['2'] || odds1X2.away) || null
    },
    _raw: dbMatch
  }
}

const detectSport = (league) => {
  const l = (league || '').toLowerCase()
  if (l.includes('basketball') || l.includes('nba')) return 'basketball'
  if (l.includes('tennis')) return 'tennis'
  return 'football'
}

const loadGames = async () => {
  isLoading.value = true
  try {
    await matchStore.fetchAllMatches()
    const allMatches = [...liveMatches.value, ...upcomingMatches.value]
    const mapped = allMatches.map(transformMatch)
    allGames.value = mapped
    displayGames.value = mapped.slice(0, 15)
  } catch (error) {
    console.error('Error loading games:', error)
  } finally {
    isLoading.value = false
  }
}

const groupedGames = computed(() => {
  const groups = {}
  displayGames.value.forEach(game => {
    if (!groups[game.league]) groups[game.league] = []
    groups[game.league].push(game)
  })
  return groups
})

const totalGamesCount = computed(() => allGames.value.length)

watch([upcomingMatches, liveMatches], () => {
  if (!loading.value) {
    const allMatches = [...liveMatches.value, ...upcomingMatches.value]
    const mapped = allMatches.map(transformMatch)
    allGames.value = mapped
    displayGames.value = mapped.slice(0, 15)
  }
}, { deep: true })

const recentWinners = [
  { initials: 'JM', phone: '+255677***123', name: 'James M.', bet: 'Accumulator x8', sport: 'Football', amount: 'TZS 4,200,000', time: '5 min ago', avatarColor: '#A32D2D' },
  { initials: 'AK', phone: '+255712***678', name: 'Amina K.', bet: 'Single bet', sport: 'Tennis', amount: 'TZS 850,000', time: '12 min ago', avatarColor: '#7A1F1F' }
]

onMounted(() => {
  loadGames()
  matchStore.initMatchSocket()
})

onUnmounted(() => {
  matchStore.disconnectSocket()
})
</script>