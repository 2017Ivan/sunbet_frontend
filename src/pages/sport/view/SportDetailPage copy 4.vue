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
                @click="handleOddsClick('1', matchData.homeOdds, '1')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-1`) }"
              >
                <span class="text-xs text-gray-500 block">1</span>
                <span class="text-lg font-bold text-gray-800">{{ matchData.homeOdds || '0' }}</span>
              </div>
              <div 
                @click="handleOddsClick('X', matchData.drawOdds, 'X')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-X`) }"
              >
                <span class="text-xs text-gray-500 block">X</span>
                <span class="text-lg font-bold text-gray-800">{{ matchData.drawOdds || '0' }}</span>
              </div>
              <div 
                @click="handleOddsClick('2', matchData.awayOdds, '2')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-2`) }"
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
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-1X`) }"
              >
                <span class="text-xs text-gray-500 block">1X</span>
                <span class="text-lg font-bold text-gray-800">{{ doubleChanceOdds.oneX }}</span>
              </div>
              <div 
                @click="handleOddsClick('X2', doubleChanceOdds.xTwo, 'X2')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-X2`) }"
              >
                <span class="text-xs text-gray-500 block">X2</span>
                <span class="text-lg font-bold text-gray-800">{{ doubleChanceOdds.xTwo }}</span>
              </div>
              <div 
                @click="handleOddsClick('12', doubleChanceOdds.oneTwo, '12')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-12`) }"
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
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-BTTS_Yes`) }"
              >
                <span class="text-xs text-gray-500 block">Yes</span>
                <span class="text-lg font-bold text-gray-800">{{ bttsOdds.yes }}</span>
              </div>
              <div 
                @click="handleOddsClick('BTTS_No', bttsOdds.no, 'No')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-BTTS_No`) }"
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
                @click="handleOddsClick('OU_Over05', overUnderOdds.over05, 'Over 0.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Over05`) }"
              >
                <span class="text-xs text-gray-500 block">Over 0.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.over05 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Under05', overUnderOdds.under05, 'Under 0.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Under05`) }"
              >
                <span class="text-xs text-gray-500 block">Under 0.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.under05 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Over15', overUnderOdds.over15, 'Over 1.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Over15`) }"
              >
                <span class="text-xs text-gray-500 block">Over 1.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.over15 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Under15', overUnderOdds.under15, 'Under 1.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Under15`) }"
              >
                <span class="text-xs text-gray-500 block">Under 1.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.under15 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Over25', overUnderOdds.over25, 'Over 2.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Over25`) }"
              >
                <span class="text-xs text-gray-500 block">Over 2.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.over25 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Under25', overUnderOdds.under25, 'Under 2.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Under25`) }"
              >
                <span class="text-xs text-gray-500 block">Under 2.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.under25 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Over35', overUnderOdds.over35, 'Over 3.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Over35`) }"
              >
                <span class="text-xs text-gray-500 block">Over 3.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.over35 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Under35', overUnderOdds.under35, 'Under 3.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Under35`) }"
              >
                <span class="text-xs text-gray-500 block">Under 3.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.under35 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Over45', overUnderOdds.over45, 'Over 4.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Over45`) }"
              >
                <span class="text-xs text-gray-500 block">Over 4.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.over45 }}</span>
              </div>
              <div 
                @click="handleOddsClick('OU_Under45', overUnderOdds.under45, 'Under 4.5')"
                class="cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-OU_Under45`) }"
              >
                <span class="text-xs text-gray-500 block">Under 4.5</span>
                <span class="text-lg font-bold text-gray-800">{{ overUnderOdds.under45 }}</span>
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
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-CS_FT_${score.label}`) }"
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
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-CS_FH_${score.label}`) }"
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
                :class="{ 'border-2 border-rose-500 bg-rose-50': isSelected(`${matchData.eventId}-CS_SH_${score.label}`) }"
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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
const selectedBets = ref([])

// ---- Detect sport from league name ----
const detectSport = (league) => {
  const leagueLower = league.toLowerCase()
  if (leagueLower.includes('basketball') || leagueLower.includes('nba')) return 'basketball'
  if (leagueLower.includes('tennis') || leagueLower.includes('wimbledon')) return 'tennis'
  if (leagueLower.includes('cricket') || leagueLower.includes('icc')) return 'cricket'
  if (leagueLower.includes('rugby')) return 'rugby'
  return 'football'
}

// ---- Helper functions ----
const ensureMinimumOdds = (odds, minimum = 1.05) => {
  let result = parseFloat(odds)
  if (isNaN(result) || result < minimum) return minimum
  return Math.round(result * 100) / 100
}

// ---- Calculate Double Chance odds ----
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
  
  oneXOdds = Math.round(oneXOdds * 100) / 100
  xTwoOdds = Math.round(xTwoOdds * 100) / 100
  oneTwoOdds = Math.round(oneTwoOdds * 100) / 100
  
  return {
    oneX: oneXOdds.toFixed(2),
    xTwo: xTwoOdds.toFixed(2),
    oneTwo: oneTwoOdds.toFixed(2)
  }
}

// ---- Calculate BTTS odds ----
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
  
  let oddsYes = 1 / probYes * 1.05
  let oddsNo = 1 / probNo * 1.05
  
  oddsYes = Math.max(1.20, oddsYes)
  oddsNo = Math.max(1.20, oddsNo)
  
  oddsYes = Math.round(oddsYes * 100) / 100
  oddsNo = Math.round(oddsNo * 100) / 100
  
  return {
    yes: oddsYes.toFixed(2),
    no: oddsNo.toFixed(2)
  }
}

// ---- Calculate Over/Under odds ----
const calculateOverUnderOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return {
      over05: '1.10', under05: '5.89',
      over15: '1.53', under15: '2.34',
      over25: '2.65', under25: '1.42',
      over35: '5.11', under35: '1.13',
      over45: '9.83', under45: '1.02'
    }
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  let expectedGoals = (probHome * 2.0) + (probDraw * 1.2) + (probAway * 1.8)
  expectedGoals = Math.max(1.2, Math.min(3.8, expectedGoals))
  
  const poisson = (lambda, k) => {
    let result = Math.exp(-lambda)
    for (let i = 1; i <= k; i++) result *= lambda / i
    return result
  }
  
  let probUnder05 = poisson(expectedGoals, 0)
  let probUnder15 = probUnder05 + poisson(expectedGoals, 1)
  let probUnder25 = probUnder15 + poisson(expectedGoals, 2)
  let probUnder35 = probUnder25 + poisson(expectedGoals, 3)
  let probUnder45 = probUnder35 + poisson(expectedGoals, 4)
  
  const margin = 1.06
  
  let oddsOver05 = (1 / (1 - probUnder05)) * margin
  let oddsUnder05 = (1 / probUnder05) * margin
  let oddsOver15 = (1 / (1 - probUnder15)) * margin
  let oddsUnder15 = (1 / probUnder15) * margin
  let oddsOver25 = (1 / (1 - probUnder25)) * margin
  let oddsUnder25 = (1 / probUnder25) * margin
  let oddsOver35 = (1 / (1 - probUnder35)) * margin
  let oddsUnder35 = (1 / probUnder35) * margin
  let oddsOver45 = (1 / (1 - probUnder45)) * margin
  let oddsUnder45 = (1 / probUnder45) * margin
  
  return {
    over05: Math.max(1.01, oddsOver05).toFixed(2),
    under05: Math.max(1.01, oddsUnder05).toFixed(2),
    over15: Math.max(1.01, oddsOver15).toFixed(2),
    under15: Math.max(1.01, oddsUnder15).toFixed(2),
    over25: Math.max(1.01, oddsOver25).toFixed(2),
    under25: Math.max(1.01, oddsUnder25).toFixed(2),
    over35: Math.max(1.01, oddsOver35).toFixed(2),
    under35: Math.max(1.01, oddsUnder35).toFixed(2),
    over45: Math.max(1.01, oddsOver45).toFixed(2),
    under45: Math.max(1.01, oddsUnder45).toFixed(2)
  }
}

// ---- Calculate Correct Score odds ----
const calculateCorrectScoreOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  const scores = ['0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2', '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Other']
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return scores.map(score => ({
      label: score,
      odds: (Math.random() * 40 + 6).toFixed(2)
    }))
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  let expectedHomeGoals = probHome * 2.0 + probDraw * 1.0
  let expectedAwayGoals = probAway * 2.0 + probDraw * 1.0
  
  expectedHomeGoals = Math.max(0.3, Math.min(2.5, expectedHomeGoals))
  expectedAwayGoals = Math.max(0.3, Math.min(2.5, expectedAwayGoals))
  
  const poissonProb = (lambda, k) => {
    if (k === 0) return Math.exp(-lambda)
    if (k === 1) return Math.exp(-lambda) * lambda
    if (k === 2) return Math.exp(-lambda) * lambda * lambda / 2
    if (k === 3) return Math.exp(-lambda) * lambda * lambda * lambda / 6
    return Math.exp(-lambda) * Math.pow(lambda, k) / 120
  }
  
  const scoreOdds = scores.map(score => {
    if (score === 'Other') {
      return { label: score, odds: (15 + Math.random() * 25).toFixed(2) }
    }
    
    const [homeScore, awayScore] = score.split('-').map(Number)
    let probability = poissonProb(expectedHomeGoals, homeScore) * poissonProb(expectedAwayGoals, awayScore)
    
    if (probability < 0.001) probability = 0.001
    
    let odds = 1 / probability
    odds = Math.min(100, Math.max(5, odds))
    odds = Math.round(odds * 100) / 100
    
    return { label: score, odds: odds.toFixed(2) }
  })
  
  return scoreOdds.sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds))
}

// ---- Calculate Correct Score First Half odds ----
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
  
  const randomVariation = () => 0.85 + (Math.random() * 0.3)
  
  return scores.map(score => {
    let odds = baseOdds[score] * randomVariation()
    odds = Math.round(odds * 100) / 100
    return { label: score, odds: odds.toFixed(2) }
  })
}

// ---- Calculate Correct Score Second Half odds ----
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
  
  const randomVariation = () => 0.85 + (Math.random() * 0.3)
  
  return scores.map(score => {
    let odds = baseOdds[score] * randomVariation()
    odds = Math.round(odds * 100) / 100
    return { label: score, odds: odds.toFixed(2) }
  })
}

// ---- Generate all odds ----
const generateAllOdds = () => {
  const homeOdds = matchData.value.homeOdds
  const drawOdds = matchData.value.drawOdds
  const awayOdds = matchData.value.awayOdds
  
  doubleChanceOdds.value = calculateDoubleChanceOdds(homeOdds, drawOdds, awayOdds)
  bttsOdds.value = calculateBTTSOdds(homeOdds, drawOdds, awayOdds)
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

// ---- Bet selection ----
const isSelected = (selectionId) => {
  return selectedBets.value.some(bet => bet.id === selectionId)
}

const handleOddsClick = (selectionType, oddsValue, label) => {
  const selectionId = `${matchData.value.eventId}-${selectionType}`
  const existingIndex = selectedBets.value.findIndex(bet => bet.id === selectionId)
  
  let newBets = []
  
  if (existingIndex !== -1) {
    newBets = selectedBets.value.filter((_, index) => index !== existingIndex)
  } else {
    const betsWithoutThisMatch = selectedBets.value.filter(bet => bet.eventId !== matchData.value.eventId)
    
    const selection = {
      id: selectionId,
      eventId: matchData.value.eventId,
      match: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
      league: matchData.value.league,
      time: `${matchData.value.time} ${matchData.value.date || ''}`,
      selection: label || selectionType,
      odds: parseFloat(oddsValue) || 1.00,
      homeTeam: matchData.value.homeTeam,
      awayTeam: matchData.value.awayTeam,
      market: getMarketType(selectionType)
    }
    
    newBets = [...betsWithoutThisMatch, selection]
  }
  
  selectedBets.value = newBets
  saveToLocalStorage(newBets)
}

const getMarketType = (selectionType) => {
  if (selectionType === '1' || selectionType === 'X' || selectionType === '2') return '1X2'
  if (selectionType === '1X' || selectionType === 'X2' || selectionType === '12') return 'Double Chance'
  if (selectionType === 'BTTS_Yes' || selectionType === 'BTTS_No') return 'Both Teams to Score'
  if (selectionType.startsWith('OU_')) return 'Over/Under'
  if (selectionType.startsWith('CS_FT_')) return 'Correct Score'
  if (selectionType.startsWith('CS_FH_')) return 'Correct Score First Half'
  if (selectionType.startsWith('CS_SH_')) return 'Correct Score Second Half'
  return 'Other'
}

// ---- Local storage ----
const saveToLocalStorage = (bets) => {
  localStorage.setItem('betslip_selections', JSON.stringify(bets))
  const event = new CustomEvent('betslip-update', { detail: bets })
  window.dispatchEvent(event)
}

const loadFromLocalStorage = () => {
  const savedBets = localStorage.getItem('betslip_selections')
  if (savedBets) {
    try {
      selectedBets.value = JSON.parse(savedBets)
    } catch (e) {
      console.error('Error parsing saved bets:', e)
    }
  } else {
    selectedBets.value = []
  }
}

const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') loadFromLocalStorage()
}

const handleBetslipUpdate = (event) => {
  selectedBets.value = event.detail || []
}

// ---- Go back ----
const goBack = () => {
  router.back()
}

// ---- Load match data ----
const loadMatchData = () => {
  // First try to get from route params (from SportsPage/HomePage navigation)
  const matchId = parseInt(route.params.id)
  
  if (matchId) {
    try {
      // Find match from gamesData
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
  
  // Fallback: try to get from route query (for backward compatibility)
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
  loadFromLocalStorage()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
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