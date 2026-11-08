<template>
  <div class="mx-auto">
    <!-- Loading State -->
    <HomePageSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <div class="bg-gray-100">
        <HeroSection />
        <GamesTabs :games="displayGames" />

        <!-- No Matches Found -->
        <div v-if="displayGames.length === 0" class="py-12 text-center bg-white">
          <div class="flex flex-col items-center justify-center gap-4">
            <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>

            <h3 class="text-xl font-bold text-gray-600">No Matches Found</h3>
            <p class="text-sm text-gray-500 max-w-sm">
              There are currently no upcoming matches available. Please check back later.
            </p>
            <button 
              @click="refreshMatches" 
              class="px-6 py-2 mt-2 text-sm font-semibold text-white transition-colors bg-rose-600 rounded-lg hover:bg-rose-700"
            >
              Refresh
            </button>
          </div>
        </div>


        <!-- ══ LIVE MATCHES SECTION (Juu, grouped kwa league) ══ -->
        <div v-if="effectiveLiveGames.length > 0" class="mt-3">
         

          <div v-for="(liveMatches, leagueName) in groupedLiveGames" :key="'live-league-' + leagueName" class="mx-2 mb-3 overflow-hidden rounded-xl bg-emerald-700">
            <!-- LIVE League Header -->
            <div class="flex items-center justify-between gap-3 rounded-t-[10px] bg-emerald-700 px-3 py-2.5 text-white">
              <span class="flex min-w-0 items-center gap-2 text-[13px] sm:text-sm font-bold truncate">
                <span class="shrink-0 text-sm" aria-hidden="true">⚽</span>
                <span class="truncate">
                  <span class="inline-block px-1.5 py-0.5 mr-1 text-[10px] font-extrabold bg-white text-emerald-800 rounded animate-pulse">LIVE</span>
                  {{ leagueName }}
                </span>
              </span>
              <div class="flex shrink-0 items-center gap-2 text-emerald-100">
                <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M3 16h2V9H3v7Zm6 0h2V4H9v12Zm6 0h2V7h-2v9Z" />
                </svg>
                <button
                  type="button"
                  class="rounded p-0.5 hover:bg-white/10"
                  :aria-expanded="!isLeagueCollapsed('live', leagueName)"
                  :aria-label="isLeagueCollapsed('live', leagueName) ? 'Expand league matches' : 'Collapse league matches'"
                  @click.stop="toggleLeagueGroup('live', leagueName)"
                >
                  <svg
                    class="h-3.5 w-3.5 transition-transform duration-200"
                    :class="isLeagueCollapsed('live', leagueName) ? '-rotate-90' : 'rotate-0'"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="m6 7 4 4 4-4 1.4 1.4L10 13.8l-5.4-5.4L6 7Z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- LIVE Matches for this league -->
            <div v-if="!isLeagueCollapsed('live', leagueName)" class="overflow-hidden rounded-t-lg bg-[#eaf2f8]">
              <MatchCard 
                v-for="game in liveMatches" 
                :key="'live-' + game.id"
                :game="game"
                @click="navigateToMatch(game.id)"
              />
            </div>
          </div>

          <div v-if="showViewAllLive" class="text-center  backdrop-blur-sm">
            <button 
              @click="navigateToLive" 
              class="text-gray-600 py-1.5 cursor-pointer  w-full font-semibold text-sm transition-colors"
            >
              View All Live ({{ liveDisplayGames.length }})
            </button>
          </div>
        </div>



        <!-- League Groups (Upcoming, CHINI) -->
        <template v-if="Object.keys(groupedGames).length > 0">
          

          <div 
            v-for="(matches, leagueName) in groupedGames" 
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
                  :aria-expanded="!isLeagueCollapsed('upcoming', leagueName)"
                  :aria-label="isLeagueCollapsed('upcoming', leagueName) ? 'Expand league matches' : 'Collapse league matches'"
                  @click.stop="toggleLeagueGroup('upcoming', leagueName)"
                >
                  <svg
                    class="h-3.5 w-3.5 transition-transform duration-200"
                    :class="isLeagueCollapsed('upcoming', leagueName) ? '-rotate-90' : 'rotate-0'"
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
            <div v-if="!isLeagueCollapsed('upcoming', leagueName)" class="overflow-hidden rounded-t-lg bg-[#eaf2f8]">
              <MatchCard 
                v-for="game in matches" 
                :key="game.id"
                :game="game"
                @click="navigateToMatch(game.id)"
              />
            </div>
          </div>
        </template>

        <!-- View All Football -->
        <div v-if="displayGames.length > 0" class="text-center py-1.5 bg-gradient-to-b from-emerald-600 via-green-400 to-emerald-600 backdrop-blur-sm">
          <button 
            @click="navigateToSports" 
            class="text-gray-600 hover:text-rose-600 font-semibold text-sm transition-colors"
          >
            View All Football ({{ totalFootballGamesCount }})
          </button>
        </div>

        
        
        <RecentWinners :winners="recentWinners" :scroll-speed="1.5" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'
import HeroSection from '../../components/ui/HeroSection/HeroCarousel.vue'
import RecentWinners from '../../components/main components/RecentWinners/RecentWinners.vue'
import GamesTabs from '../../components/ui/games/ GamesTabs.vue'
import { useMatchStore } from '../../stores/match/useMatchStore.js'
import { useBookingCodeStore } from '../../stores/bookingCode/useBookingCodeStore.js'
import { useBetStore } from '../../stores/bet/betStore.js'
import HomePageSkeleton from '../../components/skeletons/home/HomePageSkeleton.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const bookingCodeStore = useBookingCodeStore()
const betStore = useBetStore()
const matchStore = useMatchStore()
const { upcomingMatches, liveMatches, loading } = storeToRefs(matchStore)

const isLoading = ref(true)
const allGames = ref([])
const displayGames = ref([])
const allLiveGames = ref([])
const liveDisplayGames = ref([])
const collapsedLeagueGroups = ref({})

const leagueGroupKey = (type, leagueName) => `${type}:${leagueName}`
const isLeagueCollapsed = (type, leagueName) => Boolean(
  collapsedLeagueGroups.value[leagueGroupKey(type, leagueName)]
)
const toggleLeagueGroup = (type, leagueName) => {
  const key = leagueGroupKey(type, leagueName)
  collapsedLeagueGroups.value = {
    ...collapsedLeagueGroups.value,
    [key]: !collapsedLeagueGroups.value[key]
  }
}

// Timer ya auto-refresh (30s)
let autoRefreshTimer = null

const navigateToSports = () => router.push({ name: 'sports' })
const navigateToLive = () => router.push({ name: 'live' })
const navigateToMatch = (matchId) => router.push({ name: 'sport-detail', params: { id: matchId } })
const refreshMatches = async () => await loadGames()

// ============================================
// 🔄 TRANSFORM MATCH (UPCOMING ONLY)
// ============================================
const transformMatch = (dbMatch) => {
  const odds1X2 = dbMatch.odds?.['1X2'] || dbMatch.odds || {}

  return {
    id: dbMatch.id || dbMatch.match_id,
    league: dbMatch.league || 'Unknown League',
    time: dbMatch.time || dbMatch.match_time || '',
    date: dbMatch.date || dbMatch.match_date || '',
    elapsed_minute: null,
    status: dbMatch.status || 'UPCOMING',
    live: false,
    sport: detectSport(dbMatch.league),
    homeTeam: dbMatch.home_team || dbMatch.homeTeam || 'Unknown',
    awayTeam: dbMatch.away_team || dbMatch.awayTeam || 'Unknown',
    currentScore: { home: 0, away: 0 },
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

const transformLiveMatch = (dbMatch) => {
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

const detectSport = (league) => {
  const l = (league || '').toLowerCase()
  if (l.includes('basketball') || l.includes('nba')) return 'basketball'
  if (l.includes('tennis')) return 'tennis'
  return 'football'
}

const HOMEPAGE_FEATURED_LEAGUES = [
  ['serie a', 'italy serie a', 'serie a italy'],
  ['premier league', 'england premier league', 'premier league england'],
  ['la liga', 'spain la liga', 'la liga spain', 'primera division'],
  ['championship', 'england championship', 'championship england', 'efl championship'],
  ['tanzania premier league', 'premier league tanzania', 'tanzania ligi kuu bara', 'ligi kuu bara', 'tanzania mainland premier league', 'nbc premier league'],
  ['south africa premier soccer league', 'south african premier soccer league', 'premier soccer league', 'premier soccer league south africa', 'south africa premier league', 'south africa premier division', 'south african premier division'],
  ['egyptian premier league', 'egypt premier league', 'premier league egypt'],
  ['moroccan botola', 'morocco botola', 'botola pro inwi', 'botola pro'],
  ['nigerian premier football league', 'nigeria premier football league', 'nigeria premier league', 'nigeria npfl', 'npfl']
]
const HOMEPAGE_EUROPEAN_LEAGUE_COUNT = 4
const LIVE_HOMEPAGE_LIMIT = 5
const LIVE_HOMEPAGE_MIN_AFRICAN_LEAGUES = 2

const getHomepageLeaguePriority = (league) => {
  const normalizedLeague = String(league || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  return HOMEPAGE_FEATURED_LEAGUES.findIndex((aliases) => aliases.includes(normalizedLeague))
}

const selectHomepageFeaturedMatches = (matches, limit = Infinity) => {
  const featuredMatches = matches
    .map((game, index) => ({
      game,
      index,
      priority: getHomepageLeaguePriority(game.league)
    }))
    .filter((entry) => entry.priority >= 0)
    .sort((a, b) => a.priority - b.priority || a.index - b.index)

  const leagueRepresentatives = HOMEPAGE_FEATURED_LEAGUES
    .map((_, priority) => featuredMatches.find((entry) => entry.priority === priority))
    .filter(Boolean)
  const representativeIds = new Set(leagueRepresentatives.map(({ game }) => game.id))
  const additionalMatches = featuredMatches.filter(({ game }) => !representativeIds.has(game.id))

  return [...leagueRepresentatives, ...additionalMatches]
    .slice(0, limit)
    .map(({ game }) => game)
}

const selectHomepageLiveMatches = (matches) => {
  const featuredMatches = selectHomepageFeaturedMatches(matches)
  const featuredSet = new Set(featuredMatches)
  const europeanMatches = featuredMatches.filter((game) => {
    const priority = getHomepageLeaguePriority(game.league)
    return priority >= 0 && priority < HOMEPAGE_EUROPEAN_LEAGUE_COUNT
  })
  const africanMatches = featuredMatches.filter(
    game => getHomepageLeaguePriority(game.league) >= HOMEPAGE_EUROPEAN_LEAGUE_COUNT
  )
  const prioritizedMatches = [
    ...europeanMatches.slice(0, LIVE_HOMEPAGE_LIMIT - LIVE_HOMEPAGE_MIN_AFRICAN_LEAGUES),
    ...africanMatches.slice(0, LIVE_HOMEPAGE_MIN_AFRICAN_LEAGUES),
    ...europeanMatches.slice(LIVE_HOMEPAGE_LIMIT - LIVE_HOMEPAGE_MIN_AFRICAN_LEAGUES),
    ...africanMatches.slice(LIVE_HOMEPAGE_MIN_AFRICAN_LEAGUES)
  ]
  const otherLeagueMatches = matches.filter(
    game => game.sport === 'football' && !featuredSet.has(game)
  )

  return [...prioritizedMatches, ...otherLeagueMatches]
}

const loadGames = async () => {
  isLoading.value = true
  try {
    await matchStore.fetchAllMatches()

    const mapped = upcomingMatches.value.map(transformMatch)
    allGames.value = mapped
    displayGames.value = selectHomepageFeaturedMatches(mapped, 6)

    const mappedLive = liveMatches.value.map(transformLiveMatch)
    allLiveGames.value = mappedLive
    liveDisplayGames.value = selectHomepageLiveMatches(mappedLive)

  } catch (error) {
    console.error('Error loading games:', error)
  } finally {
    isLoading.value = false
  }
}

// 🔄 SILENT AUTO-REFRESH: Inarefresh data tu (bila skeleton/loading, page haishake)
const refreshDataSilently = async () => {
  try {
    await matchStore.fetchAllMatches()
    const mapped = upcomingMatches.value.map(transformMatch)
    allGames.value = mapped
    displayGames.value = selectHomepageFeaturedMatches(mapped, 6)
    const mappedLive = liveMatches.value.map(transformLiveMatch)
    allLiveGames.value = mappedLive
    liveDisplayGames.value = selectHomepageLiveMatches(mappedLive)
  } catch (err) {
    console.error('Silent refresh error:', err)
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

// LIVE matches zinaonyeshwa JUU (grouped kwa league), upcoming CHINI
// Onyesha only 5 live matches kwenye homepage
const effectiveLiveGames = computed(() => liveDisplayGames.value)

const limitedLiveGames = computed(() => liveDisplayGames.value.slice(0, LIVE_HOMEPAGE_LIMIT))

const showViewAllLive = computed(() => liveDisplayGames.value.length > LIVE_HOMEPAGE_LIMIT)

const groupedLiveGames = computed(() => {
  const groups = {}
  limitedLiveGames.value.forEach(game => {
    if (!groups[game.league]) groups[game.league] = []
    groups[game.league].push(game)
  })
  return groups
})

const totalFootballGamesCount = computed(() => allGames.value.filter((game) => game.sport === 'football').length)
const liveTotalCount = computed(() => allLiveGames.value.length)

watch(upcomingMatches, (newMatches) => {
  if (!loading.value) {
    const mapped = newMatches.map(transformMatch)
    allGames.value = mapped
    displayGames.value = selectHomepageFeaturedMatches(mapped, 6)
  }
}, { deep: true })

watch(liveMatches, (newLiveMatches) => {
  if (!loading.value) {
    const mapped = newLiveMatches.map(transformLiveMatch)
    allLiveGames.value = mapped
    liveDisplayGames.value = selectHomepageLiveMatches(mapped)
  }
}, { deep: true })

const recentWinners = [
  { initials: 'JM', phone: '+255677***123', name: 'James M.', bet: 'Accumulator x8', sport: 'Football', amount: 'TZS 4,200,000', time: '5 min ago', avatarColor: '#A32D2D' },
  { initials: 'AK', phone: '+255712***678', name: 'Amina K.', bet: 'Single bet', sport: 'Tennis', amount: 'TZS 850,000', time: '12 min ago', avatarColor: '#7A1F1F' }
]

// ---- Auto-load booking code from a shared link (?booking=CODE) ----
const loadBookingFromQuery = async () => {
  const code = route.query.booking
  if (!code) return

  let result
  try {
    result = await bookingCodeStore.loadBookingCode(code)
  } catch (e) {
    result = { success: false, message: 'Unable to load this booking code.' }
  }

  if (!result || !result.success) {
    toast.error(result?.message || 'Invalid or expired booking code', { position: 'bottom-right', timeout: 4000 })
    return
  }

  const selections = bookingCodeStore.loadedSelections
  if (selections.length === 0) {
    toast.error('No selections found in this code', { position: 'bottom-right', timeout: 4000 })
    return
  }

  betStore.clearSlip()
  selections.forEach((sel) => betStore.addToSlip(sel))
  toast.success(`💰 ${selections.length} selection(s) loaded to your bet slip!`, { position: 'bottom-right', timeout: 4000 })
}

onMounted(() => {
  loadGames()
  matchStore.initMatchSocket()
  loadBookingFromQuery()

  // 🔄 Auto-refresh kila sekunde 30 (data tu, page haishake)
  autoRefreshTimer = setInterval(() => {
    refreshDataSilently()
  }, 30000)
})

// Ikifika code mpya huku tu tayari tuko kwenye home page
watch(
  () => route.query.booking,
  (code) => {
    if (code) loadBookingFromQuery()
  }
)

onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
  matchStore.disconnectSocket()
})
</script>