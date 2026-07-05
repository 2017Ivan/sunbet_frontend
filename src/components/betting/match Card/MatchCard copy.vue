<template>
  <div class="bg-white transition-shadow duration-200 overflow-hidden">
    
    <!-- League Header -->
    <div class="px-3 sm:px-4 py-2 bg-gray-50/80 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-gray-600 truncate">{{ game.league }}</span>
        <div class="flex items-center space-x-2 flex-shrink-0">
          <span class="text-[10px] font-semibold text-gray-500">{{ game.time }}</span>
          <span 
            class="text-[10px] font-bold px-1.5 py-0.5 rounded"
            :class="statusClass"
          >
            {{ game.status }}
          </span>
        </div>
      </div>
    </div>

   <div class="flex flex-row justify-between items-baseline">
    <!-- Match Score -->
    <div class="px-3 sm:px-4 py-3">
      <div class="space-y-2">
        <!-- Home Team -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-800 truncate flex-1">{{ game.homeTeam }}</span>
          <span class="text-sm font-bold text-gray-900 ml-4">{{ game.homeScore }}</span>
        </div>
        
        <!-- Away Team -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-800 truncate flex-1">{{ game.awayTeam }}</span>
          <span class="text-sm font-bold text-gray-900 ml-4">{{ game.awayScore }}</span>
        </div>
      </div>
    </div>

    <!-- Odds -->
    <div class="px-3 sm:px-4">
      <div class="flex  gap-2">
        <button 
          class="flex-1 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-100 hover:bg-rose-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          {{ game.odds.home }}
        </button>
        <button 
          class="flex-1 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-100 hover:bg-rose-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          {{ game.odds.draw }}
        </button>
        <button 
          class="flex-1 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-100 hover:bg-rose-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          {{ game.odds.away }}
        </button>
      </div>
    </div>
   </div>

   
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

// Status badge color
const statusClass = computed(() => {
  const status = props.game.status
  if (status === 'H1') return 'bg-green-100 text-green-700'
  if (status === 'H2') return 'bg-blue-100 text-blue-700'
  if (status === 'HT') return 'bg-yellow-100 text-yellow-700'
  if (status === 'FT') return 'bg-gray-100 text-gray-700'
  return 'bg-green-100 text-green-700'
})
</script>