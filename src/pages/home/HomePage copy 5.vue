<!-- HomePage.vue -->
<template>
  <div class="mx-auto bg-white">
    
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
      <div class="bg-white overflow-hidden">
        <MatchCard 
          v-for="game in matches" 
          :key="game.id"
          :game="game"
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '../../components/betting/match Card/MatchCard.vue'
import HeroSection from '../../components/ui/HeroSection/HeroCarousel.vue'
import RecentWinners from '../../components/main components/RecentWinners/RecentWinners.vue'
import GamesTabs from '../../components/ui/games/ GamesTabs.vue'
import { useBetStore } from '../../stores/bets/betStore.js'
import gamesData from '../../assets/DataManager/MatchePaser.js'

// ---- Initialize Router ----
const router = useRouter()

// ---- Navigation Function ----
const navigateToSports = () => {
  router.push({ name: 'sports' })
}

// ---- Initialize Bet Store ----
const betStore = useBetStore()

// ---- All games from parser ----
const allGames = ref([])

// ---- Display only 7 games ----
const displayGames = ref([])

// ---- Detect sport from league name ----
const detectSport = (league) => {
  const leagueLower = league.toLowerCase()
  if (leagueLower.includes('basketball') || leagueLower.includes('nba')) return 'basketball'
  if (leagueLower.includes('tennis') || leagueLower.includes('wimbledon')) return 'tennis'
  if (leagueLower.includes('cricket') || leagueLower.includes('icc')) return 'cricket'
  if (leagueLower.includes('rugby')) return 'rugby'
  return 'football'
}

// ---- Load games from parser ----
const loadGames = () => {
  try {
    // Map the parsed data to match the expected format
    const mappedGames = gamesData.map((item, index) => ({
      id: item.id || index + 1,
      league: item.league || 'Unknown League',
      time: item.time || '00:00',
      date: item.date || new Date().toLocaleDateString(),
      status: 'Upcoming',
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

    allGames.value = mappedGames
    
    // Take only first 7 games for display
    displayGames.value = mappedGames.slice(0, 7)
    
  } catch (error) {
    console.error('Error loading games data:', error)
    allGames.value = []
    displayGames.value = []
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

// ---- Load data on mount ----
onMounted(() => {
  loadGames()
})
</script>