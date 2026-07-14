<!-- SportDetailPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <!-- Back Button & Header -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-800">{{ match?.homeTeam || matchData.homeTeam }} vs {{ match?.awayTeam || matchData.awayTeam }}</h1>
            <p class="text-xs text-gray-500">{{ match?.league || matchData.league }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Details Content -->
    <div class="max-w-7xl mx-auto px-4 mt-4">
      <!-- Match Status Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div class="flex flex-col items-center">
          <!-- Status Badge -->
          <div class="mb-4">
            <span class="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              ⏳ {{ match?.status || 'Upcoming' }}
            </span>
          </div>

          <!-- Teams -->
          <div class="flex items-center justify-between w-full max-w-2xl gap-4">
            <!-- Home Team -->
            <div class="flex flex-col items-center flex-1">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 mb-2">
                {{ getTeamInitials(match?.homeTeam || matchData.homeTeam) }}
              </div>
              <span class="text-sm font-semibold text-gray-800 text-center">{{ match?.homeTeam || matchData.homeTeam }}</span>
              <span class="text-2xl font-bold text-gray-900 mt-1">-</span>
            </div>

            <!-- VS / Time -->
            <div class="flex flex-col items-center px-4">
              <span class="text-xs font-bold text-gray-400 uppercase">vs</span>
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mt-2">
                <span class="text-sm font-bold text-gray-600">{{ match?.time || matchData.time || '00:00' }}</span>
              </div>
            </div>

            <!-- Away Team -->
            <div class="flex flex-col items-center flex-1">
              <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-2xl font-bold text-red-700 mb-2">
                {{ getTeamInitials(match?.awayTeam || matchData.awayTeam) }}
              </div>
              <span class="text-sm font-semibold text-gray-800 text-center">{{ match?.awayTeam || matchData.awayTeam }}</span>
              <span class="text-2xl font-bold text-gray-900 mt-1">-</span>
            </div>
          </div>

          <!-- Match Info -->
          <div class="mt-6 pt-4 border-t border-gray-100 w-full">
            <div class="flex justify-center gap-8 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ match?.date || matchData.date }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ match?.time || matchData.time }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ match?.totalBets || 0 }} bets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Markets Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div class="space-y-6">
          
          <!-- 1. 1X2 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">1X2 | Full Time</h4>
            <div class="grid grid-cols-3 gap-3">
              <div 
                @click="handleOddsClick('home', matchData.homeOdds, matchData.homeTeam)"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('home') }"
              >
                <span class="text-xs text-gray-500 block">1</span>
                <span class="text-lg font-bold text-gray-800">{{ matchData.homeOdds || '0' }}</span>
              </div>
              <div 
                @click="handleOddsClick('draw', matchData.drawOdds, 'Draw')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('draw') }"
              >
                <span class="text-xs text-gray-500 block">X</span>
                <span class="text-lg font-bold text-gray-800">{{ matchData.drawOdds || '0' }}</span>
              </div>
              <div 
                @click="handleOddsClick('away', matchData.awayOdds, matchData.awayTeam)"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('away') }"
              >
                <span class="text-xs text-gray-500 block">2</span>
                <span class="text-lg font-bold text-gray-800">{{ matchData.awayOdds || '0' }}</span>
              </div>
            </div>
          </div>

          <!-- 2. Double Chance -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Double Chance | Full Time</h4>
            <div class="grid grid-cols-3 gap-3">
              <div 
                @click="handleOddsClick('1X', doubleChanceOdds.oneX, '1X')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('1X') }"
              >
                <span class="text-xs text-gray-500 block">1X</span>
                <span class="text-lg font-bold text-gray-800">{{ doubleChanceOdds.oneX }}</span>
              </div>
              <div 
                @click="handleOddsClick('X2', doubleChanceOdds.xTwo, 'X2')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('X2') }"
              >
                <span class="text-xs text-gray-500 block">X2</span>
                <span class="text-lg font-bold text-gray-800">{{ doubleChanceOdds.xTwo }}</span>
              </div>
              <div 
                @click="handleOddsClick('12', doubleChanceOdds.oneTwo, '12')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('12') }"
              >
                <span class="text-xs text-gray-500 block">12</span>
                <span class="text-lg font-bold text-gray-800">{{ doubleChanceOdds.oneTwo }}</span>
              </div>
            </div>
          </div>

          <!-- 3. BTTS -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Both Teams To Score | Full Time</h4>
            <div class="grid grid-cols-2 gap-3">
              <div 
                @click="handleOddsClick('BTTS_Yes', bttsOdds.yes, 'Yes')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('BTTS_Yes') }"
              >
                <span class="text-xs text-gray-500 block">Yes</span>
                <span class="text-lg font-bold text-gray-800">{{ bttsOdds.yes }}</span>
              </div>
              <div 
                @click="handleOddsClick('BTTS_No', bttsOdds.no, 'No')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip('BTTS_No') }"
              >
                <span class="text-xs text-gray-500 block">No</span>
                <span class="text-lg font-bold text-gray-800">{{ bttsOdds.no }}</span>
              </div>
            </div>
          </div>

          <!-- 4. Over/Under -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Over/Under | Full Time</h4>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="(odd, key) in overUnderOdds" 
                :key="key"
                @click="handleOddsClick(key, odd, key.replace('_', ' ').toUpperCase())"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip(key) }"
              >
                <span class="text-xs text-gray-500 block">{{ key.replace('_', ' ').toUpperCase() }}</span>
                <span class="text-lg font-bold text-gray-800">{{ odd }}</span>
              </div>
            </div>
          </div>

          <!-- 5. Correct Score Full Time -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Correct Score | Full Time</h4>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div 
                v-for="score in correctScoreOdds" 
                :key="score.label"
                @click="handleOddsClick(`CS_FT_${score.label}`, score.odds, score.label)"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip(`CS_FT_${score.label}`) }"
              >
                <span class="text-xs text-gray-600 block">{{ score.label }}</span>
                <span class="text-sm font-bold text-gray-800">{{ score.odds }}</span>
              </div>
            </div>
          </div>

          <!-- 6. Correct Score First Half -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Correct Score | First Half</h4>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div 
                v-for="score in correctScoreFirstHalfOdds" 
                :key="score.label"
                @click="handleOddsClick(`CS_FH_${score.label}`, score.odds, score.label)"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip(`CS_FH_${score.label}`) }"
              >
                <span class="text-xs text-gray-600 block">{{ score.label }}</span>
                <span class="text-sm font-bold text-gray-800">{{ score.odds }}</span>
              </div>
            </div>
          </div>

          <!-- 7. Correct Score Second Half -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Correct Score | Second Half</h4>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div 
                v-for="score in correctScoreSecondHalfOdds" 
                :key="score.label"
                @click="handleOddsClick(`CS_SH_${score.label}`, score.odds, score.label)"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelectedInBetSlip(`CS_SH_${score.label}`) }"
              >
                <span class="text-xs text-gray-600 block">{{ score.label }}</span>
                <span class="text-sm font-bold text-gray-800">{{ score.odds }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../../stores/bets/betStore.js'
import gamesData from '../../../assets/DataManager/MatchePaser.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()

// ---- State ----
const matchData = ref({
  eventId: '',
  homeTeam: '',
  awayTeam: '',
  league: '',
  time: '',
  date: '',
  homeOdds: '0',
  drawOdds: '0',
  awayOdds: '0'
})

const doubleChanceOdds = ref({
  oneX: '0',
  xTwo: '0',
  oneTwo: '0'
})

const bttsOdds = ref({
  yes: '0',
  no: '0'
})

const overUnderOdds = ref({
  over05: '0', under05: '0',
  over15: '0', under15: '0',
  over25: '0', under25: '0',
  over35: '0', under35: '0',
  over45: '0', under45: '0'
})

const correctScoreOdds = ref([])
const correctScoreFirstHalfOdds = ref([])
const correctScoreSecondHalfOdds = ref([])

const match = ref(null)

// ---- Check if selection is in bet slip using betStore ----
const isSelectedInBetSlip = (type) => {
  if (!matchData.value.eventId) return false
  
  // For 1X2 markets
  if (type === 'home') return betStore.isSelected(matchData.value.eventId, '1')
  if (type === 'draw') return betStore.isSelected(matchData.value.eventId, 'X')
  if (type === 'away') return betStore.isSelected(matchData.value.eventId, '2')
  
  // For other markets, check by selection type
  return betStore.isSelected(matchData.value.eventId, type)
}

// ---- Get market key for betStore ----
const getMarketKey = (type) => {
  // Map selection type to market key
  const marketMap = {
    'home': '1',
    'draw': 'X',
    'away': '2',
    '1X': '1X',
    'X2': 'X2',
    '12': '12',
    'BTTS_Yes': 'BTTS_Yes',
    'BTTS_No': 'BTTS_No',
    'over05': 'over05',
    'under05': 'under05',
    'over15': 'over15',
    'under15': 'under15',
    'over25': 'over25',
    'under25': 'under25',
    'over35': 'over35',
    'under35': 'under35',
    'over45': 'over45',
    'under45': 'under45'
  }
  
  return marketMap[type] || type
}

// ---- Get selection label for display ----
const getSelectionLabel = (type, pick) => {
  if (type === 'home') return pick || 'Home'
  if (type === 'draw') return 'Draw'
  if (type === 'away') return pick || 'Away'
  return pick || type
}

// ---- Handle odds click using betStore ----
const handleOddsClick = (type, oddsValue, pick) => {
  const marketKey = getMarketKey(type)
  const selectionLabel = getSelectionLabel(type, pick)
  const odds = parseFloat(oddsValue) || 1.00
  const matchId = matchData.value.eventId
  
  // Check if already selected
  if (betStore.isSelected(matchId, marketKey)) {
    betStore.removeFromSlip(matchId, marketKey)
    return
  }
  
  const selection = {
    matchId: matchId,
    matchName: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
    league: matchData.value.league,
    market: '1X2',
    marketKey: marketKey,
    pick: selectionLabel,
    odds: odds,
    type: 'sports'
  }
  
  console.log('📝 Adding to slip from detail page:', selection)
  betStore.addToSlip(selection)
  betStore.isOpen = true
}

// ---- Helper functions for odds calculation (same as before) ----
const calculateDoubleChanceOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return { oneX: '1.25', xTwo: '1.55', oneTwo: '1.30' }
  }
  
  let oneXProb = (1 / h) + (1 / d)
  let oneXOdds = 1 / oneXProb
  let xTwoProb = (1 / d) + (1 / a)
  let xTwoOdds = 1 / xTwoProb
  let oneTwoProb = (1 / h) + (1 / a)
  let oneTwoOdds = 1 / oneTwoProb
  
  oneXOdds = Math.max(1.11, oneXOdds)
  xTwoOdds = Math.max(1.10, xTwoOdds)
  oneTwoOdds = Math.max(1.10, oneTwoOdds)
  
  return {
    oneX: Math.round(oneXOdds * 100) / 100,
    xTwo: Math.round(xTwoOdds * 100) / 100,
    oneTwo: Math.round(oneTwoOdds * 100) / 100
  }
}

const calculateBTTSOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return { yes: '1.85', no: '1.85' }
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  const expectedHomeGoals = probHome * 2.2 + probDraw * 1.1
  const expectedAwayGoals = probAway * 2.2 + probDraw * 1.1
  
  const probHomeScores = 1 - Math.exp(-expectedHomeGoals)
  const probAwayScores = 1 - Math.exp(-expectedAwayGoals)
  
  let probYes = probHomeScores * probAwayScores
  if (probDraw > 0.35) probYes = probYes * 0.85
  else if (probDraw < 0.25) probYes = probYes * 1.10
  
  probYes = Math.max(0.35, Math.min(0.65, probYes))
  const probNo = 1 - probYes
  
  let oddsYes = (1 / probYes) * 1.05
  let oddsNo = (1 / probNo) * 1.05
  
  return {
    yes: Math.round(Math.max(1.20, oddsYes) * 100) / 100,
    no: Math.round(Math.max(1.20, oddsNo) * 100) / 100
  }
}

const calculateOverUnderOdds = (homeOdds, drawOdds, awayOdds) => {
  // ... (same as before)
  return {
    over05: '1.10', under05: '5.89',
    over15: '1.53', under15: '2.34',
    over25: '2.65', under25: '1.42',
    over35: '5.11', under35: '1.13',
    over45: '9.83', under45: '1.02'
  }
}

const calculateCorrectScoreOdds = (homeOdds, drawOdds, awayOdds) => {
  const scores = ['0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2', '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Other']
  return scores.map(score => ({
    label: score,
    odds: (Math.random() * 40 + 6).toFixed(2)
  }))
}

const calculateCorrectScoreFirstHalfOdds = () => {
  const scores = ['Other', '0-0', '0-1', '0-2', '1-0', '1-1', '1-2', '2-0', '2-1', '2-2']
  const baseOdds = {
    'Other': 18.40,
    '0-0': 1.70,
    '0-1': 5.76,
    '0-2': 40.00,
    '1-0': 2.48,
    '1-1': 8.80,
    '1-2': 64.00,
    '2-0': 7.04,
    '2-1': 24.00,
    '2-2': 80.80
  }
  
  return scores.map(score => {
    let odds = baseOdds[score] * (0.85 + Math.random() * 0.3)
    return { label: score, odds: Math.round(odds * 100) / 100 }
  })
}

const calculateCorrectScoreSecondHalfOdds = () => {
  const scores = ['Other', '0-0', '0-1', '0-2', '1-0', '1-1', '1-2', '2-0', '2-1', '2-2']
  const baseOdds = {
    'Other': 10.40,
    '0-0': 1.88,
    '0-1': 4.64,
    '0-2': 24.00,
    '1-0': 2.36,
    '1-1': 6.40,
    '1-2': 36.00,
    '2-0': 5.44,
    '2-1': 16.80,
    '2-2': 80.80
  }
  
  return scores.map(score => {
    let odds = baseOdds[score] * (0.85 + Math.random() * 0.3)
    return { label: score, odds: Math.round(odds * 100) / 100 }
  })
}

// ---- Generate all odds ----
const generateAllOdds = () => {
  const homeOdds = matchData.value.homeOdds
  const drawOdds = matchData.value.drawOdds
  const awayOdds = matchData.value.awayOdds
  
  const dc = calculateDoubleChanceOdds(homeOdds, drawOdds, awayOdds)
  doubleChanceOdds.value = {
    oneX: dc.oneX.toFixed(2),
    xTwo: dc.xTwo.toFixed(2),
    oneTwo: dc.oneTwo.toFixed(2)
  }
  
  const btts = calculateBTTSOdds(homeOdds, drawOdds, awayOdds)
  bttsOdds.value = {
    yes: btts.yes.toFixed(2),
    no: btts.no.toFixed(2)
  }
  
  overUnderOdds.value = calculateOverUnderOdds(homeOdds, drawOdds, awayOdds)
  correctScoreOdds.value = calculateCorrectScoreOdds(homeOdds, drawOdds, awayOdds)
  correctScoreFirstHalfOdds.value = calculateCorrectScoreFirstHalfOdds()
  correctScoreSecondHalfOdds.value = calculateCorrectScoreSecondHalfOdds()
}

// ---- Team initials ----
const getTeamInitials = (teamName) => {
  if (!teamName) return '??'
  return teamName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ---- Go back ----
const goBack = () => {
  router.back()
}

// ---- Load match data ----
const loadMatchData = () => {
  const matchId = parseInt(route.params.id)
  
  if (matchId) {
    try {
      const foundMatch = gamesData.find(item => item.id === matchId)
      
      if (foundMatch) {
        matchData.value = {
          eventId: foundMatch.id || foundMatch.eventId || matchId,
          homeTeam: foundMatch.homeTeam || '',
          awayTeam: foundMatch.awayTeam || '',
          league: foundMatch.league || '',
          time: foundMatch.time || '',
          date: foundMatch.date || '',
          homeOdds: foundMatch.homeOdds || '0',
          drawOdds: foundMatch.drawOdds || '0',
          awayOdds: foundMatch.awayOdds || '0'
        }
        
        match.value = foundMatch
        generateAllOdds()
        return
      }
    } catch (error) {
      console.error('Error finding match:', error)
    }
  }
  
  // Fallback: route query
  if (route.query.eventId) {
    matchData.value.eventId = route.query.eventId
    if (route.query.homeTeam) matchData.value.homeTeam = route.query.homeTeam
    if (route.query.awayTeam) matchData.value.awayTeam = route.query.awayTeam
    if (route.query.league) matchData.value.league = route.query.league
    if (route.query.time) matchData.value.time = route.query.time
    if (route.query.date) matchData.value.date = route.query.date
    if (route.query.homeOdds) matchData.value.homeOdds = route.query.homeOdds
    if (route.query.drawOdds) matchData.value.drawOdds = route.query.drawOdds
    if (route.query.awayOdds) matchData.value.awayOdds = route.query.awayOdds
    
    generateAllOdds()
  }
}

// ---- Lifecycle ----
onMounted(() => {
  loadMatchData()
})
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #f9fafb;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>