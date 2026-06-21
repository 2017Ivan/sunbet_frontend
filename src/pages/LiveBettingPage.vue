<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== STICKY HEADER ===== -->
      <div class="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#1E1E1E]">
        <div class="max-w-screen-xl mx-auto px-4">
  
          <!-- Top row -->
          <div class="flex items-center justify-between py-3 gap-3">
            <div class="flex items-center gap-3">
              <!-- Live pulse indicator -->
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/25">
                <span class="w-2 h-2 rounded-full bg-[#FF3B3B] animate-pulse" />
                <span class="text-[#FF3B3B] text-xs font-bold tracking-wide">LIVE</span>
              </div>
              <div>
                <span class="text-white font-bold text-lg">Betting</span>
                <span class="ml-2 text-xs text-[#606060]">{{ liveMatches.length }} matches</span>
              </div>
            </div>
  
            <!-- Auto refresh toggle -->
            <div class="flex items-center gap-3">
              <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
                :class="autoRefresh
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
                  : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#606060] hover:text-white'"
                @click="autoRefresh = !autoRefresh"
              >
                <svg
                  class="w-3.5 h-3.5 transition-transform"
                  :class="autoRefresh ? 'animate-spin' : ''"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
                {{ autoRefresh ? 'Auto' : 'Manual' }}
              </button>
  
              <!-- Sport filter -->
              <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A]">
                <button
                  v-for="s in liveSports"
                  :key="s.id"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all"
                  :class="activeSport === s.id
                    ? 'bg-[#A32D2D] text-white'
                    : 'text-[#606060] hover:text-white'"
                  @click="activeSport = s.id"
                >
                  {{ s.emoji }}
                  <span class="hidden sm:inline">{{ s.name }}</span>
                  <span
                    class="text-[10px] px-1 rounded-full"
                    :class="activeSport === s.id ? 'bg-white/20' : 'bg-[#1E1E1E]'"
                  >
                    {{ s.count }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-5">
        <div class="flex gap-5">
  
          <!-- ===== LEFT: Match list ===== -->
          <div class="w-full lg:w-80 xl:w-96 flex-shrink-0">
  
            <!-- Featured / selected match (mobile top) -->
            <div v-if="selectedMatch" class="lg:hidden mb-4">
              <MatchDetailPanel :match="selectedMatch" @bet="handleBet" @close="selectedMatch = null" />
            </div>
  
            <!-- Match cards list -->
            <div class="space-y-2">
              <div
                v-for="match in filteredLiveMatches"
                :key="match.id"
                class="relative bg-[#161616] border rounded-[14px] p-4 cursor-pointer transition-all duration-200 group"
                :class="selectedMatch?.id === match.id
                  ? 'border-[#A32D2D]/50 bg-[#A32D2D]/5 shadow-[0_0_20px_rgba(163,45,45,0.15)]'
                  : 'border-[#2A2A2A] hover:border-[#333]'"
                @click="selectedMatch = match"
              >
                <!-- Live badge + minute -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">{{ match.sportEmoji }}</span>
                    <div>
                      <p class="text-[10px] font-semibold text-[#A0A0A0]">{{ match.league }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-[10px] font-bold border border-[#FF3B3B]/20">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse flex-shrink-0" />
                      {{ match.minute }}'
                    </span>
                    <span v-if="match.period" class="text-[10px] text-[#606060]">{{ match.period }}</span>
                  </div>
                </div>
  
                <!-- Teams + Score -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-base">{{ match.homeFlag }}</span>
                      <span
                        class="text-sm font-semibold truncate"
                        :class="match.score.home > match.score.away ? 'text-white' : 'text-[#A0A0A0]'"
                      >
                        {{ match.home }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-base">{{ match.awayFlag }}</span>
                      <span
                        class="text-sm font-semibold truncate"
                        :class="match.score.away > match.score.home ? 'text-white' : 'text-[#A0A0A0]'"
                      >
                        {{ match.away }}
                      </span>
                    </div>
                  </div>
  
                  <!-- Score -->
                  <div class="text-center ml-4 flex-shrink-0">
                    <div class="text-2xl font-black text-white tabular-nums">
                      {{ match.score.home }}<span class="text-[#A32D2D] mx-1">:</span>{{ match.score.away }}
                    </div>
                    <p class="text-[10px] text-[#606060] mt-0.5">HT {{ match.ht.home }}-{{ match.ht.away }}</p>
                  </div>
                </div>
  
                <!-- Match stats mini bar -->
                <div class="mb-3">
                  <div class="flex items-center gap-1 mb-1">
                    <div
                      class="h-1 rounded-full bg-[#A32D2D] transition-all duration-500"
                      :style="{ width: match.stats.possession.home + '%', flex: 'none' }"
                    />
                    <div class="flex-1 h-1 rounded-full bg-[#1E1E1E]" />
                    <div
                      class="h-1 rounded-full bg-[#C0C0C0] transition-all duration-500"
                      :style="{ width: (100 - match.stats.possession.home) + '%', flex: 'none', maxWidth: '50%' }"
                    />
                  </div>
                  <div class="flex justify-between text-[9px] text-[#606060]">
                    <span>{{ match.stats.possession.home }}%</span>
                    <span>Possession</span>
                    <span>{{ 100 - match.stats.possession.home }}%</span>
                  </div>
                </div>
  
                <!-- Quick odds -->
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    v-for="odd in match.mainOdds"
                    :key="odd.label"
                    class="flex flex-col items-center gap-0.5 py-2 rounded-[8px] border text-center transition-all duration-150"
                    :class="isBetSelected(match.id, odd.label)
                      ? 'bg-[#A32D2D] border-[#A32D2D]'
                      : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#A32D2D]/50'"
                    @click.stop="handleBet(match, odd)"
                  >
                    <span class="text-[9px] text-[#606060]">{{ odd.label }}</span>
                    <span
                      class="text-xs font-bold"
                      :class="[
                        isBetSelected(match.id, odd.label) ? 'text-white' : 'text-[#A32D2D]',
                        odd.changed === 'up' ? 'text-[#22C55E]' : odd.changed === 'down' ? 'text-[#EF4444]' : ''
                      ]"
                    >
                      {{ odd.value }}
                      <span v-if="odd.changed === 'up'">▲</span>
                      <span v-if="odd.changed === 'down'">▼</span>
                    </span>
                  </button>
                </div>
  
                <!-- Selected indicator -->
                <div
                  v-if="selectedMatch?.id === match.id"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-[#A32D2D] rounded-r-full"
                />
              </div>
            </div>
  
          </div>
  
          <!-- ===== RIGHT: Match detail panel (desktop) ===== -->
          <div class="hidden lg:flex flex-1 min-w-0">
            <Transition name="panel" mode="out-in">
              <MatchDetailPanel
                v-if="selectedMatch"
                :key="selectedMatch.id"
                :match="selectedMatch"
                @bet="handleBet"
              />
  
              <!-- No match selected -->
              <div
                v-else
                class="flex-1 flex flex-col items-center justify-center gap-4 bg-[#161616] border border-[#2A2A2A] rounded-[18px] min-h-[500px]"
              >
                <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
                  <span class="text-4xl">📺</span>
                </div>
                <div class="text-center">
                  <p class="text-base font-semibold text-[#A0A0A0]">Select a match</p>
                  <p class="text-sm text-[#606060] mt-1">Click any match to see live markets</p>
                </div>
              </div>
            </Transition>
          </div>
  
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useBetSlipStore } from '../stores/useBetSlipStore'
  import MatchDetailPanel from '../components/betting/MatchDetailPanel.vue'
  
  const betSlipStore = useBetSlipStore()
  
  const activeSport   = ref('all')
  const autoRefresh   = ref(true)
  const selectedMatch = ref(null)
  let   refreshTimer  = null
  
  // ---- Live sports filter ----
  const liveSports = [
    { id: 'all',        name: 'All',        emoji: '🔴', count: 24 },
    { id: 'football',   name: 'Football',   emoji: '⚽', count: 16 },
    { id: 'basketball', name: 'Basketball', emoji: '🏀', count: 5  },
    { id: 'tennis',     name: 'Tennis',     emoji: '🎾', count: 3  },
  ]
  
  // ---- Live matches data ----
  const liveMatches = ref([
    {
      id: 1, sport: 'football', sportEmoji: '⚽',
      league: 'Premier League', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      home: 'Man United', homeFlag: '🔴',
      away: 'Chelsea',    awayFlag: '🔵',
      minute: 67, period: '2nd Half',
      score: { home: 2, away: 1 },
      ht: { home: 1, away: 0 },
      stats: {
        possession:  { home: 58, away: 42 },
        shots:       { home: 12, away: 7  },
        shotsOnTarget:{ home: 6, away: 3  },
        corners:     { home: 5,  away: 2  },
        yellowCards: { home: 1,  away: 2  },
        redCards:    { home: 0,  away: 0  },
      },
      mainOdds: [
        { label: '1', value: '1.65', changed: 'down' },
        { label: 'X', value: '3.80', changed: null   },
        { label: '2', value: '5.50', changed: 'up'   },
      ],
      markets: [
        {
          name: 'Match Result',
          odds: [
            { label: 'Man United', value: '1.65', changed: 'down' },
            { label: 'Draw',       value: '3.80', changed: null   },
            { label: 'Chelsea',    value: '5.50', changed: 'up'   },
          ]
        },
        {
          name: 'Next Goal',
          odds: [
            { label: 'Man United', value: '1.80' },
            { label: 'No Goal',    value: '3.20' },
            { label: 'Chelsea',    value: '4.00' },
          ]
        },
        {
          name: 'Over / Under 2.5',
          odds: [
            { label: 'Over 2.5',  value: '1.45' },
            { label: 'Under 2.5', value: '2.60' },
          ]
        },
        {
          name: 'Both Teams to Score',
          odds: [
            { label: 'Yes', value: '1.55' },
            { label: 'No',  value: '2.35' },
          ]
        },
        {
          name: 'Double Chance',
          odds: [
            { label: '1X', value: '1.20' },
            { label: 'X2', value: '2.10' },
            { label: '12', value: '1.35' },
          ]
        },
        {
          name: 'Half Time / Full Time',
          odds: [
            { label: '1/1', value: '2.10' },
            { label: '1/X', value: '8.00' },
            { label: 'X/1', value: '4.50' },
            { label: 'X/X', value: '5.00' },
            { label: 'X/2', value: '9.00' },
            { label: '2/2', value: '7.50' },
          ]
        },
      ],
      events: [
        { minute: 23, type: 'goal',        team: 'home', player: 'Rashford',  icon: '⚽' },
        { minute: 38, type: 'yellow_card', team: 'away', player: 'Gallagher', icon: '🟨' },
        { minute: 41, type: 'yellow_card', team: 'home', player: 'Casemiro',  icon: '🟨' },
        { minute: 45, type: 'goal',        team: 'away', player: 'Jackson',   icon: '⚽' },
        { minute: 58, type: 'goal',        team: 'home', player: 'Højlund',   icon: '⚽' },
        { minute: 62, type: 'substitution',team: 'home', player: 'Bruno ↔ Eriksen', icon: '🔄' },
      ],
    },
    {
      id: 2, sport: 'football', sportEmoji: '⚽',
      league: 'La Liga', leagueFlag: '🇪🇸',
      home: 'Barcelona', homeFlag: '🔵',
      away: 'Atletico',  awayFlag: '🔴',
      minute: 34, period: '1st Half',
      score: { home: 1, away: 0 },
      ht: { home: 0, away: 0 },
      stats: {
        possession:  { home: 65, away: 35 },
        shots:       { home: 8,  away: 4  },
        shotsOnTarget:{ home: 4, away: 1  },
        corners:     { home: 4,  away: 1  },
        yellowCards: { home: 0,  away: 1  },
        redCards:    { home: 0,  away: 0  },
      },
      mainOdds: [
        { label: '1', value: '1.50', changed: 'down' },
        { label: 'X', value: '4.20', changed: null   },
        { label: '2', value: '7.00', changed: 'up'   },
      ],
      markets: [
        {
          name: 'Match Result',
          odds: [
            { label: 'Barcelona', value: '1.50' },
            { label: 'Draw',      value: '4.20' },
            { label: 'Atletico',  value: '7.00' },
          ]
        },
        {
          name: 'Over / Under 2.5',
          odds: [
            { label: 'Over 2.5',  value: '1.80' },
            { label: 'Under 2.5', value: '2.00' },
          ]
        },
        {
          name: 'Both Teams to Score',
          odds: [
            { label: 'Yes', value: '1.85' },
            { label: 'No',  value: '1.95' },
          ]
        },
      ],
      events: [
        { minute: 28, type: 'goal',        team: 'home', player: 'Lewandowski', icon: '⚽' },
        { minute: 31, type: 'yellow_card', team: 'away', player: 'Koke',        icon: '🟨' },
      ],
    },
    {
      id: 3, sport: 'football', sportEmoji: '⚽',
      league: 'Champions League', leagueFlag: '🌟',
      home: 'PSG',      homeFlag: '🔵',
      away: 'Dortmund', awayFlag: '🟡',
      minute: 78, period: '2nd Half',
      score: { home: 2, away: 2 },
      ht: { home: 1, away: 1 },
      stats: {
        possession:  { home: 52, away: 48 },
        shots:       { home: 14, away: 10 },
        shotsOnTarget:{ home: 6, away: 5  },
        corners:     { home: 6,  away: 4  },
        yellowCards: { home: 2,  away: 1  },
        redCards:    { home: 0,  away: 0  },
      },
      mainOdds: [
        { label: '1', value: '2.40', changed: null },
        { label: 'X', value: '2.90', changed: 'up' },
        { label: '2', value: '3.10', changed: 'down' },
      ],
      markets: [
        {
          name: 'Match Result',
          odds: [
            { label: 'PSG',      value: '2.40' },
            { label: 'Draw',     value: '2.90' },
            { label: 'Dortmund', value: '3.10' },
          ]
        },
        {
          name: 'Over / Under 4.5',
          odds: [
            { label: 'Over 4.5',  value: '1.90' },
            { label: 'Under 4.5', value: '1.90' },
          ]
        },
      ],
      events: [
        { minute: 12, type: 'goal',   team: 'home', player: 'Mbappé',    icon: '⚽' },
        { minute: 29, type: 'goal',   team: 'away', player: 'Sancho',    icon: '⚽' },
        { minute: 51, type: 'goal',   team: 'away', player: 'Haller',    icon: '⚽' },
        { minute: 64, type: 'goal',   team: 'home', player: 'Dembélé',   icon: '⚽' },
        { minute: 70, type: 'yellow_card', team: 'home', player: 'Vitinha', icon: '🟨' },
      ],
    },
    {
      id: 4, sport: 'basketball', sportEmoji: '🏀',
      league: 'NBA', leagueFlag: '🇺🇸',
      home: 'Lakers',  homeFlag: '🟡',
      away: 'Warriors', awayFlag: '🔵',
      minute: 'Q3', period: '3rd Quarter',
      score: { home: 88, away: 92 },
      ht: { home: 45, away: 48 },
      stats: {
        possession:  { home: 47, away: 53 },
        shots:       { home: 34, away: 38 },
        shotsOnTarget:{ home: 34, away: 38 },
        corners:     { home: 0,  away: 0  },
        yellowCards: { home: 0,  away: 0  },
        redCards:    { home: 0,  away: 0  },
      },
      mainOdds: [
        { label: 'Lakers',  value: '2.80', changed: 'up'   },
        { label: 'Warriors',value: '1.55', changed: 'down' },
      ],
      markets: [
        {
          name: 'Match Winner',
          odds: [
            { label: 'Lakers',   value: '2.80' },
            { label: 'Warriors', value: '1.55' },
          ]
        },
        {
          name: 'Total Points O/U 220',
          odds: [
            { label: 'Over 220',  value: '1.85' },
            { label: 'Under 220', value: '1.95' },
          ]
        },
      ],
      events: [
        { minute: 'Q1', type: 'quarter', team: 'home', player: 'End of Q1: 22-24', icon: '🏀' },
        { minute: 'Q2', type: 'quarter', team: 'home', player: 'Half Time: 45-48',  icon: '🏀' },
      ],
    },
    {
      id: 5, sport: 'tennis', sportEmoji: '🎾',
      league: 'ATP Wimbledon', leagueFlag: '🇬🇧',
      home: 'Djokovic', homeFlag: '🇷🇸',
      away: 'Alcaraz',  awayFlag: '🇪🇸',
      minute: 'Set 3', period: '3rd Set',
      score: { home: 1, away: 2 },
      ht: { home: 1, away: 1 },
      stats: {
        possession:  { home: 45, away: 55 },
        shots:       { home: 28, away: 34 },
        shotsOnTarget:{ home: 18, away: 22 },
        corners:     { home: 0,  away: 0  },
        yellowCards: { home: 0,  away: 0  },
        redCards:    { home: 0,  away: 0  },
      },
      mainOdds: [
        { label: 'Djokovic', value: '2.10', changed: 'up'   },
        { label: 'Alcaraz',  value: '1.80', changed: 'down' },
      ],
      markets: [
        {
          name: 'Match Winner',
          odds: [
            { label: 'Djokovic', value: '2.10' },
            { label: 'Alcaraz',  value: '1.80' },
          ]
        },
        {
          name: 'Next Set Winner',
          odds: [
            { label: 'Djokovic', value: '1.95' },
            { label: 'Alcaraz',  value: '1.85' },
          ]
        },
      ],
      events: [
        { minute: 'Set 1', type: 'set', team: 'home', player: 'Djokovic wins Set 1: 6-4', icon: '🎾' },
        { minute: 'Set 2', type: 'set', team: 'away', player: 'Alcaraz wins Set 2: 7-5',  icon: '🎾' },
      ],
    },
  ])
  
  // ---- Filtered matches ----
  const filteredLiveMatches = computed(() =>
    activeSport.value === 'all'
      ? liveMatches.value
      : liveMatches.value.filter(m => m.sport === activeSport.value)
  )
  
  // ---- Helpers ----
  const isBetSelected = (matchId, label) =>
    betSlipStore.items.some(b => b.id === `live-${matchId}-${label}`)
  
  const handleBet = (match, odd) => {
    betSlipStore.toggleBet({
      id:        `live-${match.id}-${odd.label}`,
      match:     `${match.home} vs ${match.away}`,
      selection: odd.label,
      market:    'Live',
      odds:      odd.value,
    })
  }
  
  // ---- Auto refresh: simulate odds changes ----
  const refreshOdds = () => {
    if (!autoRefresh.value) return
    liveMatches.value.forEach(match => {
      match.mainOdds.forEach(odd => {
        const change = (Math.random() - 0.5) * 0.1
        const newVal = Math.max(1.01, parseFloat(odd.value) + change)
        odd.changed = change > 0.02 ? 'up' : change < -0.02 ? 'down' : null
        odd.value   = newVal.toFixed(2)
      })
      match.minute = typeof match.minute === 'number'
        ? Math.min(90, match.minute + 1)
        : match.minute
    })
  }
  
  // ---- Auto select first match on desktop ----
  onMounted(() => {
    if (window.innerWidth >= 1024 && liveMatches.value.length) {
      selectedMatch.value = liveMatches.value[0]
    }
    refreshTimer = setInterval(refreshOdds, 8000)
  })
  
  onUnmounted(() => clearInterval(refreshTimer))
  </script>
  
  <style scoped>
  .panel-enter-active, .panel-leave-active { transition: all 0.2s ease; }
  .panel-enter-from  { opacity: 0; transform: translateX(12px); }
  .panel-leave-to    { opacity: 0; transform: translateX(-12px); }
  </style>