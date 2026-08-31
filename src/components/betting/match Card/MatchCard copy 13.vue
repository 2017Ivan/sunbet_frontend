// src/components/betting/matchCard.vue 
<template>
  <div 
    @click="$emit('click')"
    class="bg-gray-800 py-2 gap-2 border-b border-gray-700/40 cursor-pointer transition-colors duration-200 "
  >
    
    <!-- Teams & Odds Row -->
    <div class="flex items-center py-1.5 px-1 justify-between">
      
      <!-- Teams -->
      <div class="flex-1 min-w-0">
        <div class="text-gray-500 text-xs flex items-center gap-2 mb-2">
          <!-- Time inaonesha "90+5'" kwa LIVE au "06:38 PM Tue 18/08" kwa Upcoming -->
          <span class="text-sm font-normal text-gray-400">{{ game.time }}</span>
          <!-- Status badge for live matches -->
          <span v-if="game.status === 'LIVE'" class="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded animate-pulse">
            LIVE
          </span>
          <span v-else-if="game.status === 'HALF_TIME'" class="px-2 py-0.5 text-xs font-bold text-white bg-yellow-600 rounded">
            HT
          </span>
          <span v-else-if="game.status === 'FINISHED'" class="px-2 py-0.5 text-xs font-bold text-white bg-gray-600 rounded">
            FT
          </span>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-300 truncate">{{ game.homeTeam }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-300 truncate">{{ game.awayTeam }}</span>
          </div>
        </div>
      </div>

      <!-- Odds -->
      <div class="flex gap-0.5 flex-shrink-0" @click.stop>
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold transition-all duration-200 rounded-sm"
          :class="getButtonClass('home')"
          @click="handleOddsClick('home')"
          :disabled="!game.odds || !game.odds.home"
        >
          {{ formatOdds(game.odds?.home) }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold transition-all duration-200 rounded-sm"
          :class="getButtonClass('draw')"
          @click="handleOddsClick('draw')"
          :disabled="!game.odds || !game.odds.draw"
        >
          {{ formatOdds(game.odds?.draw) }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold transition-all duration-200 rounded-sm"
          :class="getButtonClass('away')"
          @click="handleOddsClick('away')"
          :disabled="!game.odds || !game.odds.away"
        >
          {{ formatOdds(game.odds?.away) }}
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useBetStore } from '../../../stores/bet/betStore.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const betStore = useBetStore()

// ---- Format odds ----
const formatOdds = (odds) => {
  if (odds === undefined || odds === null || isNaN(odds)) {
    return '-'
  }
  return parseFloat(odds).toFixed(2)
}

// ---- Check if selection is selected ----
const isSelected = (type) => {
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  return betStore.isSelected(props.game.id, marketKey)
}

// ---- Get button class ----
const getButtonClass = (type) => {
  const selected = isSelected(type)
  const hasOdds = props.game.odds && props.game.odds[type]
  
  if (selected) {
    return 'bg-rose-600 text-white border border-rose-500 shadow-lg shadow-rose-600/30 scale-105'
  }
  
  if (!hasOdds) {
    return 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
  }
  
  return 'bg-gray-700 text-gray-200 hover:bg-rose-600 hover:text-white hover:border-rose-500 border border-gray-600'
}

// ---- Handle Odds Click ----
const handleOddsClick = (type) => {
  if (!props.game.odds || !props.game.odds[type]) {
    console.warn('⚠️ Odds not available for', type)
    return
  }
  
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  const pick = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  
  if (betStore.isSelected(props.game.id, marketKey)) {
    betStore.removeFromSlip(props.game.id, marketKey)
    return
  }
  
  const oddsValue = parseFloat(props.game.odds[type]) || 0
  
  const selection = {
    matchId: props.game.id,
    matchName: `${props.game.homeTeam} vs ${props.game.awayTeam}`,
    league: props.game.league,
    market: '1X2 | Full Time',
    marketKey: marketKey,
    pick: pick,
    odds: oddsValue,
    type: 'sports',
    time: props.game.time || '',
    date: props.game.date || ''
  }
  
  console.log('📝 Adding to slip:', selection)
  betStore.addToSlip(selection)
  betStore.isOpen = true
}
</script>