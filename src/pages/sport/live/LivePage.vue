<!-- SportsPage.vue -->
<template>
  <div class="mx-auto bg-[#f8fafc] pb-10">
    <!-- Loading State -->
    <SportsPageSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
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
                ? 'bg-emerald-600 text-white shadow-md shadow-rose-500/30'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
            >
              <span>{{ sport.icon }}</span>
              {{ sport.name }}
              <span class="text-[10px] opacity-60 ml-0.5">({{ sport.count }})</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ══ SPORTS CONTENT ══ -->
      <div class="max-w-7xl mx-auto px-0">

        <!-- League Groups -->
        <div  
          v-for="(matches, leagueName) in filteredGames" 
          :key="leagueName"
          class="mx-2 mb-3 overflow-hidden rounded-xl bg-emerald-700"
        >
          <!-- League Header -->
          <div class="flex items-center justify-between gap-3 rounded-t-[10px] bg-emerald-700 px-3 py-2.5 text-white">
            <span class="flex min-w-0 items-center gap-2 text-[13px] sm:text-sm font-bold truncate">
              <span class="shrink-0 text-sm" aria-hidden="true">⚽</span>
              <span class="truncate">{{ leagueName }}</span>
            </span>
            <div class="flex shrink-0 items-center gap-2 text-emerald-100">
              <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3 16h2V9H3v7Zm6 0h2V4H9v12Zm6 0h2V7h-2v9Z" />
              </svg>
              <button
                type="button"
                class="rounded p-0.5 hover:bg-white/10"
                :aria-expanded="!isLeagueCollapsed(leagueName)"
                :aria-label="isLeagueCollapsed(leagueName) ? 'Expand league matches' : 'Collapse league matches'"
                @click.stop="toggleLeagueGroup(leagueName)"
              >
                <svg
                  class="h-3.5 w-3.5 transition-transform duration-200"
                  :class="isLeagueCollapsed(leagueName) ? '-rotate-90' : 'rotate-0'"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="m6 7 4 4 4-4 1.4 1.4L10 13.8l-5.4-5.4L6 7Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Matches for this league -->
          <div v-if="!isLeagueCollapsed(leagueName)" class="overflow-hidden rounded-t-lg bg-[#eaf2f8]">
            <MatchCard 
              v-for="game in matches" 
              :key="game.id"
              :game="game"
              @click="navigateToMatch(game.id)"
            />
          </div>
        </div>

        <!-- No Live Matches -->
        <div v-if="Object.keys(filteredGames).length === 0" class="text-center py-12">
          <div class="text-5xl mb-3">🏟️</div>
          <p class="text-gray-400 text-sm">No live matches available for this sport right now</p>
          <p class="text-gray-500 text-xs mt-1">Check back soon when matches begin</p>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import MatchCard from '../../../components/betting/match Card/MatchCard.vue'
import SportsPageSkeleton from '../../../components/skeletons/sport/SportsPageSkeleton.vue'
import { useMatchStore } from '../../../stores/match/useMatchStore.js'

const router = useRouter()
const matchStore = useMatchStore()
const { liveMatches, loading } = storeToRefs(matchStore)

// ---- State ----
const isLoading = ref(true)
const selectedSport = ref('all')
const allGames = ref([])
const collapsedLeagues = ref({})

const isLeagueCollapsed = (leagueName) => Boolean(collapsedLeagues.value[leagueName])
const toggleLeagueGroup = (leagueName) => {
  collapsedLeagues.value = {
    ...collapsedLeagues.value,
    [leagueName]: !isLeagueCollapsed(leagueName)
  }
}

// ---- Navigation ----
const navigateToMatch = (matchId) => {
  router.push({
    name: 'sport-detail',
    params: { id: matchId }
  })
}

// ---- Sports Filter Tabs ----
const sportsFilter = ref([
  { id: 'all', name: 'All Sports', icon: '⚽', count: 0 },
  { id: 'football', name: 'Football', icon: '⚽', count: 0 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0 },
  { id: 'cricket', name: 'Cricket', icon: '🏏', count: 0 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', count: 0 }
])

// ---- Detect sport from league name ----
const detectSport = (league) => {
  const l = (league || '').toLowerCase()
  if (l.includes('basketball') || l.includes('nba')) return 'basketball'
  if (l.includes('tennis') || l.includes('wimbledon')) return 'tennis'
  if (l.includes('cricket') || l.includes('icc')) return 'cricket'
  if (l.includes('rugby')) return 'rugby'
  return 'football'
}

// ============================================
// 🔄 TRANSFORM MATCH LOGIC
// ============================================
const transformMatch = (dbMatch) => {
  const odds1X2 = dbMatch.odds?.['1X2'] || dbMatch.odds || {}

  return {
    id: dbMatch.id || dbMatch.match_id,
    league: dbMatch.league || 'Unknown League',
    time: dbMatch.time || dbMatch.match_time || '',
    date: dbMatch.date || dbMatch.match_date || '',
    elapsed_minute: dbMatch.elapsed_minute ?? dbMatch.current_minute,
    status: dbMatch.status || 'LIVE',
    live: true,
    sport: detectSport(dbMatch.league),
    homeTeam: dbMatch.home_team || dbMatch.homeTeam || 'Unknown',
    awayTeam: dbMatch.away_team || dbMatch.awayTeam || 'Unknown',
    currentScore: dbMatch.current_score || dbMatch.score || { home: 0, away: 0 },
    predetermined_script: dbMatch.predetermined_script,
    markets: dbMatch.markets,
    odds: {
      home: parseFloat(odds1X2['1'] || odds1X2.home) || null,
      draw: parseFloat(odds1X2['X'] || odds1X2.draw) || null,
      away: parseFloat(odds1X2['2'] || odds1X2.away) || null
    },
    _raw: dbMatch
  }
}

// ---- Load Live Games Only ----
const loadGames = async () => {
  isLoading.value = true
  try {
    await matchStore.fetchAllMatches()
    allGames.value = liveMatches.value.map(transformMatch)
    updateSportCounts()
  } catch (error) {
    console.error('Error loading live sports games:', error)
  } finally {
    isLoading.value = false
  }
}

// Update sport counts dynamically
const updateSportCounts = () => {
  const counts = {}
  allGames.value.forEach(game => {
    counts[game.sport] = (counts[game.sport] || 0) + 1
  })
  sportsFilter.value.forEach(sport => {
    if (sport.id === 'all') {
      sport.count = allGames.value.length
    } else {
      sport.count = counts[sport.id] || 0
    }
  })
}

// ---- Computed Filtered & Grouped Games ----
const filteredGames = computed(() => {
  const filtered = selectedSport.value === 'all' 
    ? allGames.value 
    : allGames.value.filter(g => g.sport === selectedSport.value)
  
  const groups = {}
  filtered.forEach(game => {
    if (!groups[game.league]) {
      groups[game.league] = []
    }
    groups[game.league].push(game)
  })
  return groups
})

// Watch liveMatches updates in real-time
watch(liveMatches, (newLiveMatches) => {
  if (!loading.value) {
    allGames.value = newLiveMatches.map(transformMatch)
    updateSportCounts()
  }
}, { deep: true })

onMounted(() => {
  loadGames()
  matchStore.initMatchSocket()
})

onUnmounted(() => {
  matchStore.disconnectSocket()
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

/* Sticky header offset */
.sticky {
  position: sticky;
}
</style>