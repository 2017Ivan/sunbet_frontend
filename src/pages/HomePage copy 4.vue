<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== HERO SECTION ===== -->
      <section class="relative overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#0D0D0D] to-[#0D0D0D]" />
        <div class="absolute top-0 left-0 right-0 h-[500px] bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23A32D2D%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div class="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#A32D2D]/10 blur-[140px] pointer-events-none" />
        <div class="absolute top-40 left-1/4 w-64 h-64 rounded-full bg-[#A32D2D]/8 blur-[80px] pointer-events-none" />
      </section>

      <!-- Hero Carousel - Full width on mobile -->
      <section class="w-full">
        <HeroCarousel/>
      </section>

      <!-- ===== SPORTS CATEGORIES ===== -->
      <section class="w-full px-3 sm:px-4 py-4 sm:py-8">
        <div class="max-w-screen-xl mx-auto">
          <!-- <div class="flex items-center justify-between mb-4 sm:mb-5">
            <h2 class="text-base sm:text-lg font-bold text-white">Sports</h2>
            <RouterLink to="/sports" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
              View all →
            </RouterLink>
          </div> -->

          <!-- Horizontal scroll on mobile - Full width with no extra margins -->
          <div class="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4">
            <button
              v-for="sport in sports"
              :key="sport.id"
              class="flex-shrink-0 flex flex-row items-center gap-1 sm:gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-[14px] border transition-all duration-200 min-w-[70px] sm:min-w-[80px]"
              :class="selectedSport === sport.id
                ? 'bg-[#A32D2D]/15 border-[#A32D2D]/40 text-[#C94040]'
                : 'bg-[#161616] border-[#2A2A2A] text-[#606060] hover:border-[#333] hover:text-[#A0A0A0]'"
              @click="selectedSport = sport.id"
            >
              <!-- <span class="text-xl sm:text-2xl">{{ sport.emoji }}</span> -->
              <span class="text-[11px] sm:text-xs font-semibold whitespace-nowrap">{{ sport.name }}</span>
              <span
                class="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                :class="selectedSport === sport.id
                  ? 'bg-[#A32D2D]/20 text-[#C94040]'
                  : 'bg-[#1E1E1E] text-[#606060]'"
              >
                ({{ sport.count }})
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- ===== FEATURED MATCHES ===== -->
      <section class="w-full px-3 sm:px-4 pb-6 sm:pb-8">
        <div class="max-w-screen-xl mx-auto">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
            <!-- <div class="flex items-center gap-3">
              <h2 class="text-base sm:text-lg font-bold text-white">Featured Matches</h2>
              <span class="px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#606060] text-xs">
                {{ filteredMatches.length }} games
              </span>
            </div> -->

            <!-- Filter tabs - Scrollable on mobile -->
            <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A] overflow-x-auto w-full sm:w-auto scrollbar-hide">
              <button
                v-for="filter in matchFilters"
                :key="filter"
                class="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-[7px] transition-all whitespace-nowrap flex-shrink-0"
                :class="activeFilter === filter
                  ? 'bg-[#A32D2D] text-white'
                  : 'text-[#606060] hover:text-white'"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <!-- Matches grid -->
          <div class="space-y-3">
            <div
              v-for="match in filteredMatches"
              :key="match.id"
              class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-3 sm:p-4 hover:border-[#A32D2D]/30 transition-all duration-200 group"
            >
              <!-- Match header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div>
                    <p class="text-[11px] sm:text-xs font-medium text-[#A0A0A0]">{{ match.league }}</p>
                    <p class="text-[9px] sm:text-[10px] text-[#606060]">{{ match.time }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span
                    v-if="match.isLive"
                    class="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-[9px] sm:text-[10px] font-bold border border-[#FF3B3B]/25"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
                    {{ match.minute }}'
                  </span>
                  <span
                    v-else
                    class="text-[9px] sm:text-[10px] text-[#606060] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1E1E1E]"
                  >
                    {{ match.time }}
                  </span>
                  <button class="text-[#606060] hover:text-[#F59E0B] transition-colors">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Teams + Score -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-1.5 sm:gap-2 mb-1.5">
                    <!-- <span class="text-base sm:text-lg">{{ match.homeFlag }}</span> -->
                    <span class="text-sm font-semibold text-white truncate">{{ match.home }}</span>
                    <span v-if="match.isLive" class="text-sm font-black text-white ml-auto mr-2">{{ match.score.home }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <!-- <span class="text-base sm:text-lg">{{ match.awayFlag }}</span> -->
                    <span class="text-sm font-semibold text-[#A0A0A0] truncate">{{ match.away }}</span>
                    <span v-if="match.isLive" class="text-sm font-black text-[#A0A0A0] ml-auto mr-2">{{ match.score.away }}</span>
                  </div>
                </div>
              </div>

              <!-- Odds buttons -->
              <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  v-for="odd in match.odds"
                  :key="odd.label"
                  class="flex flex-col items-center gap-0.5 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-[10px] border transition-all duration-200"
                  :class="isBetSelected(match.id, odd.label)
                    ? 'bg-[#A32D2D] border-[#A32D2D] text-white'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#A32D2D]/40 hover:bg-[#A32D2D]/8 text-[#A0A0A0]'"
                  @click="toggleBet(match, odd)"
                >
                  <span class="text-[9px] sm:text-[10px] font-medium">{{ odd.label }}</span>
                  <span
                    class="text-sm font-bold"
                    :class="isBetSelected(match.id, odd.label) ? 'text-white' : 'text-[#A32D2D]'"
                  >
                    {{ odd.value }}
                  </span>
                </button>
              </div>

              <!-- More markets link -->
              <button class="w-full mt-3 text-[10px] sm:text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors flex items-center justify-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                {{ match.marketCount }} more markets
              </button>
            </div>
          </div>

          <!-- Load more -->
          <button
            class="w-full mt-4 py-3 rounded-[12px] border border-[#2A2A2A] text-sm text-[#606060] hover:text-white hover:border-[#333] transition-all"
            @click="loadMore"
          >
            Load more matches
          </button>
        </div>
      </section>

      <!-- ===== PROMOTIONS BANNER ===== -->
      <section class="w-full px-3 sm:px-4 pb-6 sm:pb-8">
        <div class="max-w-screen-xl mx-auto">
          <div class="flex items-center justify-between mb-4 sm:mb-5">
            <h2 class="text-base sm:text-lg font-bold text-white">Hot Promotions 🔥</h2>
            <RouterLink to="/promotions" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
              View all →
            </RouterLink>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="promo in promotions"
              :key="promo.id"
              class="relative overflow-hidden rounded-[18px] p-4 sm:p-5 cursor-pointer group"
              :style="{ background: promo.gradient }"
              @click="$router.push('/promotions')"
            >
              <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/svg%3E')]" />
              <div class="relative z-10">
                <span class="text-2xl sm:text-3xl mb-2 sm:mb-3 block">{{ promo.emoji }}</span>
                <span class="inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-[9px] sm:text-[10px] font-bold mb-2 sm:mb-3">
                  {{ promo.badge }}
                </span>
                <h3 class="text-base sm:text-lg font-black text-white leading-tight mb-1">{{ promo.title }}</h3>
                <p class="text-xs sm:text-sm text-white/70 leading-relaxed mb-3 sm:mb-4">{{ promo.description }}</p>
                <button class="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] sm:text-xs font-semibold transition-all group-hover:gap-2.5">
                  {{ promo.cta }}
                  <svg class="w-3 h-3 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== JACKPOT TICKER ===== -->
      <section class="w-full px-3 sm:px-4 pb-6 sm:pb-8">
        <div class="max-w-screen-xl mx-auto">
          <div class="bg-gradient-to-r from-[#1a0a0a] via-[#2a0f0f] to-[#1a0a0a] border border-[#A32D2D]/25 rounded-[18px] p-4 sm:p-5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#A32D2D]/10 blur-[60px] pointer-events-none" />

            <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg sm:text-xl">🏆</span>
                  <span class="text-[10px] sm:text-xs font-bold text-[#F59E0B] uppercase tracking-wider">Mega Jackpot</span>
                </div>
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  TZS <span class="text-[#F59E0B]">50,000,000</span>
                </h3>
                <p class="text-xs sm:text-sm text-[#606060] mt-1">Pick 13 correct results to win</p>
              </div>

              <div class="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                <!-- Countdown -->
                <div class="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <div
                    v-for="unit in countdown"
                    :key="unit.label"
                    class="flex flex-col items-center bg-black/30 rounded-[10px] px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-none min-w-[45px] sm:min-w-[52px]"
                  >
                    <span class="text-base sm:text-xl font-black text-white tabular-nums">{{ unit.value }}</span>
                    <span class="text-[7px] sm:text-[9px] text-[#606060] uppercase">{{ unit.label }}</span>
                  </div>
                </div>

                <AppButton variant="primary" size="md" class="w-full sm:w-auto text-sm" @click="$router.push('/sports')">
                  🎯 Play Jackpot
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== RECENT WINNERS ===== -->
      <section class="w-full px-3 sm:px-4 pb-8 sm:pb-10">
        <div class="max-w-screen-xl mx-auto">
          <div class="flex items-center justify-between mb-4 sm:mb-5">
            <h2 class="text-base sm:text-lg font-bold text-white">Recent Winners 🏅</h2>
            <RouterLink to="/leaderboard" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
              Leaderboard →
            </RouterLink>
          </div>

          <div class="space-y-2">
            <div
              v-for="(winner, i) in recentWinners"
              :key="i"
              class="flex items-center gap-2 sm:gap-3 bg-[#161616] border border-[#2A2A2A] rounded-[14px] px-3 sm:px-4 py-2.5 sm:py-3 hover:border-[#A32D2D]/20 transition-all"
            >
              <!-- Rank -->
              <div
                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0"
                :class="[
                  i === 0 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                  i === 1 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
                  i === 2 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                  'bg-[#1E1E1E] text-[#606060]'
                ]"
              >
                {{ i < 3 ? ['🥇','🥈','🥉'][i] : i + 1 }}
              </div>

              <!-- Avatar -->
              <div
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0"
                :style="{ background: winner.avatarColor }"
              >
                {{ winner.initials }}
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-semibold text-white truncate">{{ winner.name }}</p>
                <p class="text-[10px] sm:text-xs text-[#606060] truncate">{{ winner.bet }} • {{ winner.sport }}</p>
              </div>

              <!-- Amount -->
              <div class="text-right flex-shrink-0">
                <p class="text-xs sm:text-sm font-black text-[#22C55E]">+{{ winner.amount }}</p>
                <p class="text-[8px] sm:text-[10px] text-[#606060]">{{ winner.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppButton from '../components/ui/AppButton.vue'
import { useBetSlipStore } from '../stores/useBetSlipStore'
import HeroCarousel from '../components/shared/HeroSection/HeroCarousel.vue'

const router       = useRouter()
const betSlipStore = useBetSlipStore()

// ---- Live count ----
const liveMatchCount = ref(24)

// ---- Trust badges ----
const trustBadges = [
  { icon: '✅', label: 'Licensed & Regulated' },
  { icon: '⚡', label: 'Instant Withdrawal' },
  { icon: '🔒', label: '256-bit SSL Secure' },
  { icon: '📱', label: 'M-Pesa Supported' },
]

// ---- Platform stats ----
const platformStats = [
  { value: '2M+',   label: 'Active Users' },
  { value: '500K+', label: 'Bets Today' },
  { value: 'TZS 50M', label: 'Jackpot Prize' },
  { value: '3 min', label: 'Avg Withdrawal' },
]

// ---- Hero odds ----
const heroOdds = [
  { label: '1 (Man Utd)', value: '2.10' },
  { label: 'X (Draw)',    value: '3.40' },
  { label: '2 (Chelsea)', value: '3.75' },
]

// ---- Sports ----
const selectedSport = ref('football')
const sports = [
  { id: 'football',   name: 'Football',   emoji: '⚽', count: 142 },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', count: 38 },
  { id: 'tennis',     name: 'Tennis',     emoji: '🎾', count: 64 },
  { id: 'cricket',    name: 'Cricket',    emoji: '🏏', count: 12 },
  { id: 'rugby',      name: 'Rugby',      emoji: '🏉', count: 8 },
  { id: 'boxing',     name: 'Boxing',     emoji: '🥊', count: 5 },
  { id: 'esports',    name: 'Esports',    emoji: '🎮', count: 22 },
]

// ---- Match filters ----
const matchFilters = ['All', 'Live', 'Today', 'Tomorrow']
const activeFilter = ref('All')

// ---- Matches data ----
const matches = ref([
  {
    id: 1, sportEmoji: '⚽', league: 'Premier League', time: 'Today 21:00',
    home: 'Man United', homeFlag: '🔴', away: 'Chelsea', awayFlag: '🔵',
    isLive: true, minute: 67, score: { home: 2, away: 1 },
    odds: [
      { label: '1', value: '2.10' },
      { label: 'X', value: '3.40' },
      { label: '2', value: '3.75' },
    ],
    marketCount: 48,
  },
  {
    id: 2, sportEmoji: '⚽', league: 'La Liga', time: 'Today 22:00',
    home: 'Barcelona', homeFlag: '🔵', away: 'Real Madrid', awayFlag: '⚪',
    isLive: false, minute: null, score: null,
    odds: [
      { label: '1', value: '2.35' },
      { label: 'X', value: '3.20' },
      { label: '2', value: '3.10' },
    ],
    marketCount: 62,
  },
  {
    id: 3, sportEmoji: '🏀', league: 'NBA', time: 'Today 02:30',
    home: 'Lakers', homeFlag: '🟡', away: 'Warriors', awayFlag: '🔵',
    isLive: true, minute: 34, score: { home: 88, away: 92 },
    odds: [
      { label: 'Lakers', value: '2.80' },
      { label: 'Warriors', value: '1.55' },
      { label: 'O/U 220', value: '1.90' },
    ],
    marketCount: 31,
  },
  {
    id: 4, sportEmoji: '⚽', league: 'Serie A', time: 'Tomorrow 20:45',
    home: 'AC Milan', homeFlag: '🔴', away: 'Juventus', awayFlag: '⚫',
    isLive: false, minute: null, score: null,
    odds: [
      { label: '1', value: '2.90' },
      { label: 'X', value: '3.30' },
      { label: '2', value: '2.50' },
    ],
    marketCount: 55,
  },
  {
    id: 5, sportEmoji: '🎾', league: 'ATP Wimbledon', time: 'Today 15:00',
    home: 'Djokovic', homeFlag: '🇷🇸', away: 'Alcaraz', awayFlag: '🇪🇸',
    isLive: true, minute: 42, score: { home: 1, away: 2 },
    odds: [
      { label: 'Djokovic', value: '1.85' },
      { label: 'Alcaraz',  value: '2.10' },
      { label: 'O 3.5 sets', value: '1.70' },
    ],
    marketCount: 24,
  },
])

const filteredMatches = computed(() => {
  if (activeFilter.value === 'All')      return matches.value
  if (activeFilter.value === 'Live')     return matches.value.filter(m => m.isLive)
  if (activeFilter.value === 'Today')    return matches.value.filter(m => m.time.includes('Today'))
  if (activeFilter.value === 'Tomorrow') return matches.value.filter(m => m.time.includes('Tomorrow'))
  return matches.value
})

const loadMore = () => {
  // TODO: fetch more matches from API
  console.log('Load more...')
}

// ---- Bet slip ----
const isBetSelected = (matchId, label) => {
  return betSlipStore.items.some(b => b.id === `${matchId}-${label}`)
}

const toggleBet = (match, odd) => {
  betSlipStore.toggleBet({
    id:        `${match.id}-${odd.label}`,
    match:     `${match.home} vs ${match.away}`,
    selection: odd.label,
    market:    '1X2',
    odds:      odd.value,
  })
}

const addToBetSlip = (odd) => {
  betSlipStore.toggleBet({
    id:        `hero-${odd.label}`,
    match:     'Man United vs Chelsea',
    selection: odd.label,
    market:    '1X2',
    odds:      odd.value,
  })
}

// ---- Promotions ----
const promotions = [
  {
    id: 1,
    emoji: '🎁',
    badge: 'NEW USER',
    title: '100% Welcome Bonus',
    description: 'Deposit TZS 10,000 and get TZS 10,000 free bet instantly.',
    cta: 'Claim Now',
    gradient: 'linear-gradient(135deg, #7A1F1F, #A32D2D)',
  },
  {
    id: 2,
    emoji: '⚡',
    badge: 'DAILY',
    title: 'Cashback Friday',
    description: 'Get 10% cashback on all losing bets every Friday.',
    cta: 'Learn More',
    gradient: 'linear-gradient(135deg, #1a3a5c, #1e5f8c)',
  },
  {
    id: 3,
    emoji: '🏆',
    badge: 'JACKPOT',
    title: 'TZS 50M Mega Jackpot',
    description: 'Pick 13 correct results and win the mega jackpot this weekend.',
    cta: 'Play Now',
    gradient: 'linear-gradient(135deg, #78350f, #d97706)',
  },
]

// ---- Recent winners ----
const recentWinners = [
  { initials: 'JM', name: 'James M.', bet: 'Accumulator x8', sport: 'Football', amount: 'TZS 4,200,000', time: '5 min ago', avatarColor: '#A32D2D' },
  { initials: 'AK', name: 'Amina K.', bet: 'Single bet',     sport: 'Tennis',   amount: 'TZS 850,000',  time: '12 min ago', avatarColor: '#7A1F1F' },
  { initials: 'SM', name: 'Said M.',  bet: 'Double bet',     sport: 'Basketball',amount: 'TZS 1,350,000',time: '28 min ago', avatarColor: '#C94040' },
  { initials: 'FH', name: 'Fatuma H.',bet: 'Accumulator x5', sport: 'Football', amount: 'TZS 2,780,000',time: '1 hr ago',   avatarColor: '#6B1A1A' },
  { initials: 'DM', name: 'David M.', bet: 'Single bet',     sport: 'Cricket',  amount: 'TZS 420,000',  time: '2 hrs ago',  avatarColor: '#8B2020' },
]

// ---- Jackpot countdown ----
const countdown = ref([
  { label: 'Days',  value: '02' },
  { label: 'Hours', value: '14' },
  { label: 'Mins',  value: '36' },
  { label: 'Secs',  value: '00' },
])

let countdownTimer = null

const updateCountdown = () => {
  const target = new Date()
  target.setDate(target.getDate() + 2)
  target.setHours(20, 0, 0, 0)

  const diff = target - Date.now()
  if (diff <= 0) return

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  countdown.value = [
    { label: 'Days',  value: String(d).padStart(2, '0') },
    { label: 'Hours', value: String(h).padStart(2, '0') },
    { label: 'Mins',  value: String(m).padStart(2, '0') },
    { label: 'Secs',  value: String(s).padStart(2, '0') },
  ]
}

onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(countdownTimer)
})
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