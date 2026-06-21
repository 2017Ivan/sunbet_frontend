<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== PAGE HEADER ===== -->
      <div class="bg-[#0D0D0D] border-b border-[#1E1E1E] sticky top-16 z-30">
        <div class="max-w-screen-xl mx-auto px-4">
  
          <!-- Top row: Title + Search -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div>
              <h1 class="text-xl font-bold text-white">Sports Lobby</h1>
              <p class="text-xs text-[#606060] mt-0.5">{{ totalMatchCount }} matches available</p>
            </div>
  
            <!-- Search -->
            <div class="relative flex-1 max-w-xs">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search teams, leagues..."
                class="w-full h-10 pl-10 pr-4 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-sm text-white placeholder:text-[#606060] focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 transition-all"
              />
              <button
                v-if="searchQuery"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-white"
                @click="searchQuery = ''"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
  
            <!-- View toggle -->
            <div class="hidden sm:flex gap-1 p-1 bg-[#1E1E1E] rounded-[10px] border border-[#2A2A2A]">
              <button
                v-for="v in ['list', 'grid']"
                :key="v"
                class="w-8 h-8 rounded-[7px] flex items-center justify-center transition-all"
                :class="viewMode === v ? 'bg-[#A32D2D] text-white' : 'text-[#606060] hover:text-white'"
                @click="viewMode = v"
              >
                <svg v-if="v === 'list'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- Sports tabs — horizontal scroll -->
          <div class="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            <button
              v-for="sport in sports"
              :key="sport.id"
              class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200"
              :class="activeSport === sport.id
                ? 'bg-[#A32D2D] border-[#A32D2D] text-white shadow-[0_4px_12px_rgba(163,45,45,0.35)]'
                : 'bg-[#161616] border-[#2A2A2A] text-[#606060] hover:border-[#333] hover:text-[#A0A0A0]'"
              @click="activeSport = sport.id"
            >
              <span>{{ sport.emoji }}</span>
              {{ sport.name }}
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                :class="activeSport === sport.id ? 'bg-white/20 text-white' : 'bg-[#1E1E1E] text-[#606060]'"
              >
                {{ sport.count }}
              </span>
            </button>
          </div>
  
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
  
            <!-- Matches grouped by league -->
            <template v-if="displayedMatches.length > 0">
              <div
                v-for="group in groupedMatches"
                :key="group.leagueId"
                class="mb-4"
              >
                <!-- League header -->
                <button
                  class="w-full flex items-center gap-3 px-4 py-3 bg-[#161616] border border-[#2A2A2A] rounded-t-[14px] hover:bg-[#1E1E1E] transition-colors"
                  :class="collapsedLeagues.includes(group.leagueId) ? 'rounded-b-[14px]' : ''"
                  @click="toggleCollapse(group.leagueId)"
                >
                  <span class="text-lg">{{ group.flag }}</span>
                  <div class="flex-1 text-left">
                    <span class="text-sm font-semibold text-white">{{ group.leagueName }}</span>
                    <span class="text-xs text-[#606060] ml-2">{{ group.matches.length }} matches</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="group.hasLive"
                      class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-[10px] font-bold border border-[#FF3B3B]/25"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
                      LIVE
                    </span>
                    <svg
                      class="w-4 h-4 text-[#606060] transition-transform duration-200"
                      :class="collapsedLeagues.includes(group.leagueId) ? 'rotate-180' : ''"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    >
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  </div>
                </button>
  
                <!-- Matches list -->
                <Transition name="collapse">
                  <div
                    v-if="!collapsedLeagues.includes(group.leagueId)"
                    class="border-x border-b border-[#2A2A2A] rounded-b-[14px] overflow-hidden divide-y divide-[#1E1E1E]"
                  >
                    <!-- List view -->
                    <template v-if="viewMode === 'list'">
                      <div
                        v-for="match in group.matches"
                        :key="match.id"
                        class="bg-[#0D0D0D] hover:bg-[#161616] transition-colors px-4 py-3"
                      >
                        <div class="flex items-center gap-3">
  
                          <!-- Time / Live -->
                          <div class="w-14 flex-shrink-0 text-center">
                            <template v-if="match.isLive">
                              <div class="flex items-center justify-center gap-1 mb-0.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse flex-shrink-0" />
                                <span class="text-[10px] font-bold text-[#FF3B3B]">{{ match.minute }}'</span>
                              </div>
                              <p class="text-[10px] text-[#606060]">{{ match.score.home }}-{{ match.score.away }}</p>
                            </template>
                            <template v-else>
                              <p class="text-xs font-semibold text-[#A0A0A0]">{{ match.kickoffTime }}</p>
                              <p class="text-[10px] text-[#606060]">{{ match.kickoffDate }}</p>
                            </template>
                          </div>
  
                          <!-- Teams -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                              <span class="text-sm">{{ match.homeFlag }}</span>
                              <span
                                class="text-sm font-semibold truncate"
                                :class="match.isLive && match.score.home > match.score.away ? 'text-white' : 'text-[#A0A0A0]'"
                              >
                                {{ match.home }}
                              </span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="text-sm">{{ match.awayFlag }}</span>
                              <span
                                class="text-sm font-semibold truncate"
                                :class="match.isLive && match.score.away > match.score.home ? 'text-white' : 'text-[#A0A0A0]'"
                              >
                                {{ match.away }}
                              </span>
                            </div>
                          </div>
  
                          <!-- Odds -->
                          <div class="flex gap-1.5 flex-shrink-0">
                            <button
                              v-for="odd in match.odds"
                              :key="odd.label"
                              class="flex flex-col items-center gap-0.5 w-16 py-2 rounded-[10px] border text-center transition-all duration-150"
                              :class="isBetSelected(match.id, odd.label)
                                ? 'bg-[#A32D2D] border-[#A32D2D]'
                                : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#A32D2D]/40'"
                              @click="toggleBet(match, odd)"
                            >
                              <span class="text-[9px] text-[#606060]">{{ odd.label }}</span>
                              <span
                                class="text-sm font-bold"
                                :class="isBetSelected(match.id, odd.label) ? 'text-white' : 'text-[#A32D2D]'"
                              >
                                {{ odd.value }}
                              </span>
                            </button>
                          </div>
  
                          <!-- More + Favourite -->
                          <div class="flex items-center gap-1 flex-shrink-0">
                            <button
                              class="text-[10px] text-[#606060] hover:text-[#A32D2D] whitespace-nowrap px-2 py-1.5 rounded-[8px] hover:bg-[#A32D2D]/10 transition-all"
                              @click="$router.push('/live')"
                            >
                              +{{ match.marketCount }}
                            </button>
                            <button
                              class="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all"
                              :class="favourites.includes(match.id)
                                ? 'text-[#F59E0B]'
                                : 'text-[#333] hover:text-[#F59E0B]'"
                              @click="toggleFavourite(match.id)"
                            >
                              <svg class="w-4 h-4" viewBox="0 0 24 24" :fill="favourites.includes(match.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </button>
                          </div>
  
                        </div>
                      </div>
                    </template>
  
                    <!-- Grid view -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0D0D0D]">
                      <div
                        v-for="match in group.matches"
                        :key="match.id"
                        class="bg-[#161616] border border-[#2A2A2A] rounded-[14px] p-4 hover:border-[#A32D2D]/30 transition-all"
                      >
                        <!-- Match time -->
                        <div class="flex items-center justify-between mb-3">
                          <div>
                            <p class="text-xs text-[#606060]">{{ match.kickoffDate }}</p>
                            <p class="text-xs font-semibold text-[#A0A0A0]">{{ match.kickoffTime }}</p>
                          </div>
                          <span
                            v-if="match.isLive"
                            class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-[10px] font-bold"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
                            {{ match.minute }}'
                          </span>
                        </div>
  
                        <!-- Teams -->
                        <div class="space-y-1.5 mb-4">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <span>{{ match.homeFlag }}</span>
                              <span class="text-sm font-semibold text-white truncate max-w-[120px]">{{ match.home }}</span>
                            </div>
                            <span v-if="match.isLive" class="text-sm font-black text-white">{{ match.score.home }}</span>
                          </div>
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <span>{{ match.awayFlag }}</span>
                              <span class="text-sm font-semibold text-[#A0A0A0] truncate max-w-[120px]">{{ match.away }}</span>
                            </div>
                            <span v-if="match.isLive" class="text-sm font-black text-[#A0A0A0]">{{ match.score.away }}</span>
                          </div>
                        </div>
  
                        <!-- Odds grid -->
                        <div class="grid grid-cols-3 gap-1.5">
                          <button
                            v-for="odd in match.odds"
                            :key="odd.label"
                            class="flex flex-col items-center gap-0.5 py-2 rounded-[8px] border transition-all"
                            :class="isBetSelected(match.id, odd.label)
                              ? 'bg-[#A32D2D] border-[#A32D2D]'
                              : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#A32D2D]/40'"
                            @click="toggleBet(match, odd)"
                          >
                            <span class="text-[9px] text-[#606060]">{{ odd.label }}</span>
                            <span
                              class="text-sm font-bold"
                              :class="isBetSelected(match.id, odd.label) ? 'text-white' : 'text-[#A32D2D]'"
                            >
                              {{ odd.value }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
  
                  </div>
                </Transition>
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
  
  const router       = useRouter()
  const betSlipStore = useBetSlipStore()
  
  // ---- UI state ----
  const searchQuery      = ref('')
  const viewMode         = ref('list')
  const activeSport      = ref('football')
  const activeTime       = ref('all')
  const activeMarket     = ref('1x2')
  const selectedLeagues  = ref([])
  const showAllLeagues   = ref(false)
  const collapsedLeagues = ref([])
  const favourites       = ref([])
  const loadingMore      = ref(false)
  
  // ---- Sports ----
  const sports = [
    { id: 'football',   name: 'Football',   emoji: '⚽', count: 142 },
    { id: 'basketball', name: 'Basketball', emoji: '🏀', count: 38  },
    { id: 'tennis',     name: 'Tennis',     emoji: '🎾', count: 64  },
    { id: 'cricket',    name: 'Cricket',    emoji: '🏏', count: 12  },
    { id: 'rugby',      name: 'Rugby',      emoji: '🏉', count: 8   },
    { id: 'boxing',     name: 'Boxing',     emoji: '🥊', count: 5   },
    { id: 'esports',    name: 'Esports',    emoji: '🎮', count: 22  },
  ]
  
  // ---- Time filters ----
  const timeFilters = [
    { id: 'all',      label: 'All',      count: 142 },
    { id: 'live',     label: '🔴 Live',  count: 24  },
    { id: 'today',    label: 'Today',    count: 68  },
    { id: 'tomorrow', label: 'Tomorrow', count: 50  },
    { id: 'week',     label: 'This Week',count: 142 },
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
  
  // ---- All matches data ----
  const allMatches = ref([
    // Premier League
    {
      id: 101, leagueId: 'epl', leagueName: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      sport: 'football', home: 'Man United', homeFlag: '🔴',
      away: 'Chelsea', awayFlag: '🔵',
      isLive: true, minute: 67, kickoffTime: '21:00', kickoffDate: 'Today',
      score: { home: 2, away: 1 },
      odds: [{ label: '1', value: '2.10' }, { label: 'X', value: '3.40' }, { label: '2', value: '3.75' }],
      marketCount: 48,
    },
    {
      id: 102, leagueId: 'epl', leagueName: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      sport: 'football', home: 'Arsenal', homeFlag: '🔴',
      away: 'Liverpool', awayFlag: '🔴',
      isLive: false, minute: null, kickoffTime: '17:30', kickoffDate: 'Today',
      score: null,
      odds: [{ label: '1', value: '2.60' }, { label: 'X', value: '3.20' }, { label: '2', value: '2.80' }],
      marketCount: 52,
    },
    {
      id: 103, leagueId: 'epl', leagueName: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      sport: 'football', home: 'Man City', homeFlag: '🔵',
      away: 'Tottenham', awayFlag: '⚪',
      isLive: false, minute: null, kickoffTime: '20:00', kickoffDate: 'Tomorrow',
      score: null,
      odds: [{ label: '1', value: '1.55' }, { label: 'X', value: '4.00' }, { label: '2', value: '6.50' }],
      marketCount: 60,
    },
    // La Liga
    {
      id: 201, leagueId: 'laliga', leagueName: 'La Liga', flag: '🇪🇸',
      sport: 'football', home: 'Barcelona', homeFlag: '🔵',
      away: 'Real Madrid', awayFlag: '⚪',
      isLive: false, minute: null, kickoffTime: '22:00', kickoffDate: 'Today',
      score: null,
      odds: [{ label: '1', value: '2.35' }, { label: 'X', value: '3.20' }, { label: '2', value: '3.10' }],
      marketCount: 62,
    },
    {
      id: 202, leagueId: 'laliga', leagueName: 'La Liga', flag: '🇪🇸',
      sport: 'football', home: 'Atletico Madrid', homeFlag: '🔴',
      away: 'Sevilla', awayFlag: '⚪',
      isLive: true, minute: 34, kickoffTime: '19:30', kickoffDate: 'Today',
      score: { home: 1, away: 0 },
      odds: [{ label: '1', value: '1.80' }, { label: 'X', value: '3.50' }, { label: '2', value: '4.20' }],
      marketCount: 44,
    },
    // Champions League
    {
      id: 301, leagueId: 'ucl', leagueName: 'Champions League', flag: '🌟',
      sport: 'football', home: 'PSG', homeFlag: '🔵',
      away: 'Bayern Munich', awayFlag: '🔴',
      isLive: false, minute: null, kickoffTime: '21:00', kickoffDate: 'Tomorrow',
      score: null,
      odds: [{ label: '1', value: '2.90' }, { label: 'X', value: '3.40' }, { label: '2', value: '2.45' }],
      marketCount: 70,
    },
    {
      id: 302, leagueId: 'ucl', leagueName: 'Champions League', flag: '🌟',
      sport: 'football', home: 'Inter Milan', homeFlag: '🔵',
      away: 'Dortmund', awayFlag: '🟡',
      isLive: true, minute: 55, kickoffTime: '21:00', kickoffDate: 'Today',
      score: { home: 0, away: 1 },
      odds: [{ label: '1', value: '2.10' }, { label: 'X', value: '3.30' }, { label: '2', value: '3.60' }],
      marketCount: 58,
    },
    // Tanzania Premier
    {
      id: 401, leagueId: 'tanzaniaPL', leagueName: 'Tanzania Premier', flag: '🇹🇿',
      sport: 'football', home: 'Simba SC', homeFlag: '🔴',
      away: 'Young Africans', awayFlag: '🟡',
      isLive: false, minute: null, kickoffTime: '16:00', kickoffDate: 'Today',
      score: null,
      odds: [{ label: '1', value: '1.95' }, { label: 'X', value: '3.10' }, { label: '2', value: '4.00' }],
      marketCount: 28,
    },
    {
      id: 402, leagueId: 'tanzaniaPL', leagueName: 'Tanzania Premier', flag: '🇹🇿',
      sport: 'football', home: 'Azam FC', homeFlag: '🔵',
      away: 'Coastal Union', awayFlag: '🟢',
      isLive: false, minute: null, kickoffTime: '14:00', kickoffDate: 'Tomorrow',
      score: null,
      odds: [{ label: '1', value: '2.20' }, { label: 'X', value: '3.00' }, { label: '2', value: '3.40' }],
      marketCount: 22,
    },
    // Serie A
    {
      id: 501, leagueId: 'seriea', leagueName: 'Serie A', flag: '🇮🇹',
      sport: 'football', home: 'AC Milan', homeFlag: '🔴',
      away: 'Juventus', awayFlag: '⚫',
      isLive: false, minute: null, kickoffTime: '20:45', kickoffDate: 'Tomorrow',
      score: null,
      odds: [{ label: '1', value: '2.90' }, { label: 'X', value: '3.30' }, { label: '2', value: '2.50' }],
      marketCount: 55,
    },
  ])
  
  // ---- Total match count ----
  const totalMatchCount = computed(() => allMatches.value.length)
  
  // ---- Filtered matches ----
  const displayedMatches = computed(() => {
    let matches = allMatches.value.filter(m => m.sport === activeSport.value)
  
    // Time filter
    if (activeTime.value === 'live')     matches = matches.filter(m => m.isLive)
    if (activeTime.value === 'today')    matches = matches.filter(m => m.kickoffDate === 'Today')
    if (activeTime.value === 'tomorrow') matches = matches.filter(m => m.kickoffDate === 'Tomorrow')
  
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
        m.leagueName.toLowerCase().includes(q)
      )
    }
  
    return matches
  })
  
  // ---- Group by league ----
  const groupedMatches = computed(() => {
    const groups = {}
    for (const match of displayedMatches.value) {
      if (!groups[match.leagueId]) {
        groups[match.leagueId] = {
          leagueId:   match.leagueId,
          leagueName: match.leagueName,
          flag:       match.flag,
          matches:    [],
          hasLive:    false,
        }
      }
      groups[match.leagueId].matches.push(match)
      if (match.isLive) groups[match.leagueId].hasLive = true
    }
    return Object.values(groups)
  })
  
  // ---- Helpers ----
  const toggleLeague    = (id) => {
    const i = selectedLeagues.value.indexOf(id)
    i >= 0 ? selectedLeagues.value.splice(i, 1) : selectedLeagues.value.push(id)
  }
  
  const toggleCollapse  = (id) => {
    const i = collapsedLeagues.value.indexOf(id)
    i >= 0 ? collapsedLeagues.value.splice(i, 1) : collapsedLeagues.value.push(id)
  }
  
  const toggleFavourite = (id) => {
    const i = favourites.value.indexOf(id)
    i >= 0 ? favourites.value.splice(i, 1) : favourites.value.push(id)
  }
  
  const isBetSelected = (matchId, label) =>
    betSlipStore.items.some(b => b.id === `${matchId}-${label}`)
  
  const toggleBet = (match, odd) => {
    betSlipStore.toggleBet({
      id:        `${match.id}-${odd.label}`,
      match:     `${match.home} vs ${match.away}`,
      selection: odd.label,
      market:    activeMarket.value.toUpperCase(),
      odds:      odd.value,
    })
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
  .scrollbar-hide          { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  
  .collapse-enter-active,
  .collapse-leave-active   { transition: all 0.25s ease; overflow: hidden; }
  .collapse-enter-from,
  .collapse-leave-to       { opacity: 0; max-height: 0; }
  .collapse-enter-to,
  .collapse-leave-from     { opacity: 1; max-height: 2000px; }
  </style>