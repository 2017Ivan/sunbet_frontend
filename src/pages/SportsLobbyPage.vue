<template>
  <div class="min-h-screen bg-[#0D0D0D]">

    <!-- ===== PAGE HEADER ===== -->
    <div class="bg-[#0D0D0D] border-b border-[#1E1E1E] sticky top-16 z-30">
      <div class="max-w-screen-xl mx-auto px-4">

     
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 py-6">
      <div class="flex gap-6">

        <!-- ===== LEFT SIDEBAR: Leagues filter (desktop) ===== -->
        <aside class="hidden lg:block w-60 flex-shrink-0">

          <!-- Time filter -->
          <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4 mb-4">
            <h3 class="text-xs font-bold text-[#606060] uppercase tracking-wider mb-3">Time</h3>
            <div class="space-y-1">
              <button
                v-for="time in timeFilters"
                :key="time.id"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-sm transition-all"
                :class="activeTime === time.id
                  ? 'bg-[#A32D2D]/15 text-[#C94040] font-semibold'
                  : 'text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white'"
                @click="activeTime = time.id"
              >
                <span>{{ time.label }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#606060]">
                  {{ time.count }}
                </span>
              </button>
            </div>
          </div>

          <!-- Leagues filter -->
          <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xs font-bold text-[#606060] uppercase tracking-wider">Leagues</h3>
              <button
                v-if="selectedLeagues.length"
                class="text-[10px] text-[#A32D2D] hover:text-[#C94040] font-semibold"
                @click="selectedLeagues = []"
              >
                Clear
              </button>
            </div>
            <div class="space-y-1">
              <button
                v-for="league in visibleLeagues"
                :key="league.id"
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm transition-all group"
                :class="selectedLeagues.includes(league.id)
                  ? 'bg-[#A32D2D]/15 text-[#C94040]'
                  : 'text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white'"
                @click="toggleLeague(league.id)"
              >
                <span class="text-base">{{ league.flag }}</span>
                <span class="flex-1 text-left truncate text-xs font-medium">{{ league.name }}</span>
                <div
                  class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                  :class="selectedLeagues.includes(league.id)
                    ? 'bg-[#A32D2D] border-[#A32D2D]'
                    : 'border-[#333] group-hover:border-[#A32D2D]/40'"
                >
                  <svg v-if="selectedLeagues.includes(league.id)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </button>
            </div>

            <button
              v-if="leagues.length > 6"
              class="w-full mt-2 py-2 text-xs text-[#606060] hover:text-[#A32D2D] transition-colors text-center"
              @click="showAllLeagues = !showAllLeagues"
            >
              {{ showAllLeagues ? 'Show less ↑' : `+${leagues.length - 6} more leagues ↓` }}
            </button>
          </div>

          <!-- Markets filter -->
          <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4">
            <h3 class="text-xs font-bold text-[#606060] uppercase tracking-wider mb-3">Markets</h3>
            <div class="space-y-1">
              <button
                v-for="market in markets"
                :key="market.id"
                class="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs transition-all"
                :class="activeMarket === market.id
                  ? 'bg-[#A32D2D]/15 text-[#C94040] font-semibold'
                  : 'text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white'"
                @click="activeMarket = market.id"
              >
                {{ market.label }}
              </button>
            </div>
          </div>
        </aside>

        <!-- ===== MAIN CONTENT ===== -->
        <div class="flex-1 min-w-0">

          <!-- Mobile filters row -->
          <div class="flex gap-2 mb-4 lg:hidden overflow-x-auto scrollbar-hide pb-1">
            <button
              v-for="time in timeFilters"
              :key="time.id"
              class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-all"
              :class="activeTime === time.id
                ? 'bg-[#A32D2D] border-[#A32D2D] text-white'
                : 'bg-[#161616] border-[#2A2A2A] text-[#606060]'"
              @click="activeTime = time.id"
            >
              {{ time.label }}
              <span class="opacity-70">{{ time.count }}</span>
            </button>
          </div>

          <!-- Search results indicator -->
          <div v-if="searchQuery" class="flex items-center gap-2 mb-4 px-1">
            <svg class="w-4 h-4 text-[#606060]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span class="text-sm text-[#606060]">
              Results for <span class="text-white font-semibold">"{{ searchQuery }}"</span>
              — {{ displayedMatches.length }} found
            </span>
            <button class="ml-auto text-xs text-[#A32D2D] hover:text-[#C94040]" @click="searchQuery = ''">Clear</button>
          </div>

          <!-- Matches grid using MatchCard component -->
          <template v-if="displayedMatches.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MatchCard
                v-for="match in displayedMatches"
                :key="match.id"
                :match="match"
              />
            </div>
          </template>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center text-4xl">
              🔍
            </div>
            <div class="text-center">
              <p class="text-base font-semibold text-[#A0A0A0]">No matches found</p>
              <p class="text-sm text-[#606060] mt-1">Try different filters or search term</p>
            </div>
            <AppButton variant="outline" size="sm" @click="resetFilters">
              Reset Filters
            </AppButton>
          </div>

          <!-- Load more -->
          <button
            v-if="displayedMatches.length > 0"
            class="w-full mt-4 py-3.5 rounded-[12px] border border-[#2A2A2A] text-sm text-[#606060] hover:text-white hover:border-[#333] transition-all flex items-center justify-center gap-2"
            :class="loadingMore ? 'opacity-50 cursor-not-allowed' : ''"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <svg v-if="loadingMore" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ loadingMore ? 'Loading...' : 'Load more matches' }}
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '../components/ui/AppButton.vue'
import { useBetSlipStore } from '../stores/useBetSlipStore'
import MatchCard from '../components/betting/MatchCard.vue'

const router       = useRouter()
const betSlipStore = useBetSlipStore()

// ---- UI state ----
const searchQuery      = ref('')
const activeSport      = ref('football')
const activeTime       = ref('all')
const activeMarket     = ref('1x2')
const selectedLeagues  = ref([])
const showAllLeagues   = ref(false)
const loadingMore      = ref(false)

// ---- Sports ----
const sports = [
  { id: 'football',   name: 'Football',   emoji: '⚽', count: 6 },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', count: 0 },
  { id: 'tennis',     name: 'Tennis',     emoji: '🎾', count: 0 },
  { id: 'cricket',    name: 'Cricket',    emoji: '🏏', count: 0 },
  { id: 'rugby',      name: 'Rugby',      emoji: '🏉', count: 0 },
  { id: 'boxing',     name: 'Boxing',     emoji: '🥊', count: 0 },
  { id: 'esports',    name: 'Esports',    emoji: '🎮', count: 0 },
]

// ---- Time filters ----
const timeFilters = [
  { id: 'all',      label: 'All',      count: 6 },
  { id: 'today',    label: 'Today',    count: 4 },
  { id: 'tomorrow', label: 'Tomorrow', count: 2 },
  { id: 'week',     label: 'This Week',count: 6 },
]

// ---- Leagues ----
const leagues = [
  { id: 'epl',       name: 'Premier League',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'laliga',    name: 'La Liga',          flag: '🇪🇸' },
  { id: 'seriea',    name: 'Serie A',          flag: '🇮🇹' },
  { id: 'bundesliga',name: 'Bundesliga',       flag: '🇩🇪' },
  { id: 'ligue1',    name: 'Ligue 1',          flag: '🇫🇷' },
  { id: 'ucl',       name: 'Champions League', flag: '🌟' },
  { id: 'tanzaniaPL',name: 'Tanzania Premier', flag: '🇹🇿' },
  { id: 'afcon',     name: 'AFCON',            flag: '🌍' },
  { id: 'worldcup',  name: 'World Cup Quals',  flag: '🏆' },
]

const visibleLeagues = computed(() =>
  showAllLeagues.value ? leagues : leagues.slice(0, 6)
)

// ---- Markets ----
const markets = [
  { id: '1x2',    label: '1X2 (Match Result)' },
  { id: 'btts',   label: 'Both Teams to Score' },
  { id: 'ou',     label: 'Over / Under' },
  { id: 'ht',     label: 'Half Time Result' },
  { id: 'dc',     label: 'Double Chance' },
  { id: 'dnb',    label: 'Draw No Bet' },
  { id: 'anytime',label: 'Anytime Goalscorer' },
]

// ---- All matches data - NO LIVE ----
const allMatches = ref([
  // Premier League
  {
    id: 101, leagueId: 'epl', league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    sport: 'football', home: 'Man United', homeFlag: '🔴',
    away: 'Chelsea', awayFlag: '🔵',
    isLive: false, minute: null, kickoffTime: '21:00', kickoffDate: 'Today',
    score: null,
    odds: [{ label: '1', value: '2.10' }, { label: 'X', value: '3.40' }, { label: '2', value: '3.75' }],
    marketCount: 48,
  },
  {
    id: 102, leagueId: 'epl', league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    sport: 'football', home: 'Arsenal', homeFlag: '🔴',
    away: 'Liverpool', awayFlag: '🔴',
    isLive: false, minute: null, kickoffTime: '17:30', kickoffDate: 'Today',
    score: null,
    odds: [{ label: '1', value: '2.60' }, { label: 'X', value: '3.20' }, { label: '2', value: '2.80' }],
    marketCount: 52,
  },
  {
    id: 103, leagueId: 'epl', league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    sport: 'football', home: 'Man City', homeFlag: '🔵',
    away: 'Tottenham', awayFlag: '⚪',
    isLive: false, minute: null, kickoffTime: '20:00', kickoffDate: 'Tomorrow',
    score: null,
    odds: [{ label: '1', value: '1.55' }, { label: 'X', value: '4.00' }, { label: '2', value: '6.50' }],
    marketCount: 60,
  },
  // La Liga
  {
    id: 201, leagueId: 'laliga', league: 'La Liga', flag: '🇪🇸',
    sport: 'football', home: 'Barcelona', homeFlag: '🔵',
    away: 'Real Madrid', awayFlag: '⚪',
    isLive: false, minute: null, kickoffTime: '22:00', kickoffDate: 'Today',
    score: null,
    odds: [{ label: '1', value: '2.35' }, { label: 'X', value: '3.20' }, { label: '2', value: '3.10' }],
    marketCount: 62,
  },
  // Champions League
  {
    id: 301, leagueId: 'ucl', league: 'Champions League', flag: '🌟',
    sport: 'football', home: 'PSG', homeFlag: '🔵',
    away: 'Bayern Munich', awayFlag: '🔴',
    isLive: false, minute: null, kickoffTime: '21:00', kickoffDate: 'Tomorrow',
    score: null,
    odds: [{ label: '1', value: '2.90' }, { label: 'X', value: '3.40' }, { label: '2', value: '2.45' }],
    marketCount: 70,
  },
  // Tanzania Premier
  {
    id: 401, leagueId: 'tanzaniaPL', league: 'Tanzania Premier', flag: '🇹🇿',
    sport: 'football', home: 'Simba SC', homeFlag: '🔴',
    away: 'Young Africans', awayFlag: '🟡',
    isLive: false, minute: null, kickoffTime: '16:00', kickoffDate: 'Today',
    score: null,
    odds: [{ label: '1', value: '1.95' }, { label: 'X', value: '3.10' }, { label: '2', value: '4.00' }],
    marketCount: 28,
  },
])

// ---- Total match count ----
const totalMatchCount = computed(() => allMatches.value.length)

// ---- Filtered matches ----
const displayedMatches = computed(() => {
  let matches = allMatches.value.filter(m => m.sport === activeSport.value)

  // Time filter
  if (activeTime.value === 'today')    matches = matches.filter(m => m.kickoffDate === 'Today')
  if (activeTime.value === 'tomorrow') matches = matches.filter(m => m.kickoffDate === 'Tomorrow')
  // 'all' inaonyesha zote

  // League filter
  if (selectedLeagues.value.length) {
    matches = matches.filter(m => selectedLeagues.value.includes(m.leagueId))
  }

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    matches = matches.filter(m =>
      m.home.toLowerCase().includes(q) ||
      m.away.toLowerCase().includes(q) ||
      m.league.toLowerCase().includes(q)
    )
  }

  return matches
})

// ---- Helpers ----
const toggleLeague = (id) => {
  const i = selectedLeagues.value.indexOf(id)
  i >= 0 ? selectedLeagues.value.splice(i, 1) : selectedLeagues.value.push(id)
}

const resetFilters = () => {
  searchQuery.value     = ''
  activeTime.value      = 'all'
  selectedLeagues.value = []
  activeSport.value     = 'football'
}

const loadMore = async () => {
  loadingMore.value = true
  await new Promise(r => setTimeout(r, 1200))
  loadingMore.value = false
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>