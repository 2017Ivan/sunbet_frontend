<template>
  <div 
    @click="$emit('click')"
    class="bg-gray-800 py-2.5 px-2 border-b border-gray-700/40 cursor-pointer hover:bg-gray-750 transition-colors duration-150"
  >
    <div class="flex items-center justify-between gap-2">
      
      <!-- Teams & Time Column -->
      <div class="flex-1 min-w-0">
        <!-- Status & Time Header -->
        <div class="text-xs flex items-center gap-2 mb-1.5">
          <span 
            v-if="game.status === 'LIVE'" 
            class="px-1.5 py-0.5 text-[10px] font-extrabold text-white bg-rose-600 rounded animate-pulse"
          >
            LIVE
          </span>
          <span 
            v-else-if="game.status === 'HALF_TIME'" 
            class="px-1.5 py-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded"
          >
            HT
          </span>
          <span 
            v-else-if="game.status === 'FINISHED'" 
            class="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-gray-700 rounded"
          >
            FT
          </span>

          <span class="text-xs font-semibold text-rose-400" v-if="game.status === 'LIVE' || game.status === 'HALF_TIME'">
            {{ game.time }}
          </span>
          <span class="text-xs font-normal text-gray-400" v-else>
            {{ game.time }}
          </span>
        </div>

        <!-- Teams Name & Scores -->
        <div class="space-y-1">
          <!-- Home Team -->
          <div class="flex items-center justify-between pr-2">
            <span class="text-sm font-semibold text-gray-200 truncate">{{ game.homeTeam }}</span>
            <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2">
              {{ game.currentScore?.home ?? 0 }}
            </span>
          </div>

          <!-- Away Team -->
          <div class="flex items-center justify-between pr-2">
            <span class="text-sm font-semibold text-gray-200 truncate">{{ game.awayTeam }}</span>
            <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2">
              {{ game.currentScore?.away ?? 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Odds Buttons -->
      <div class="flex gap-1 flex-shrink-0" @click.stop>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
          :class="getButtonClass('home')"
          @click="handleOddsClick('home')"
          :disabled="!game.odds || !game.odds.home"
        >
          {{ formatOdds(game.odds?.home) }}
        </button>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
          :class="getButtonClass('draw')"
          @click="handleOddsClick('draw')"
          :disabled="!game.odds || !game.odds.draw"
        >
          {{ formatOdds(game.odds?.draw) }}
        </button>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
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
import { computed } from 'vue'
import { useBetStore } from '../../../stores/bet/betStore.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const betStore = useBetStore()

const isLiveOrFinished = computed(() => {
  return ['LIVE', 'HALF_TIME', 'FINISHED'].includes(props.game.status)
})

const formatOdds = (odds) => {
  if (odds === undefined || odds === null || isNaN(odds)) return '-'
  return parseFloat(odds).toFixed(2)
}

const isSelected = (type) => {
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  return betStore.isSelected(props.game.id, marketKey)
}

const getButtonClass = (type) => {
  const selected = isSelected(type)
  const hasOdds = props.game.odds && props.game.odds[type]
  
  if (selected) {
    return 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105 font-extrabold'
  }
  if (!hasOdds) {
    return 'bg-gray-800 text-gray-600 border border-gray-750 cursor-not-allowed opacity-50'
  }
  return 'bg-gray-700 text-gray-200 hover:bg-rose-600 hover:text-white border border-gray-600'
}

const handleOddsClick = (type) => {
  if (!props.game.odds || !props.game.odds[type]) return
  
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  const pick = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  
  if (betStore.isSelected(props.game.id, marketKey)) {
    betStore.removeFromSlip(props.game.id, marketKey)
    return
  }
  
  const selection = {
    matchId: props.game.id,
    matchName: `${props.game.homeTeam} vs ${props.game.awayTeam}`,
    league: props.game.league,
    market: '1X2 | Full Time',
    marketKey: marketKey,
    pick: pick,
    odds: parseFloat(props.game.odds[type]),
    type: 'sports',
    time: props.game.time || '',
    date: props.game.date || ''
  }
  
  betStore.addToSlip(selection)
  betStore.isOpen = true
}
</script>