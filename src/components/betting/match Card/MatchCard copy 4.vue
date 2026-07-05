<template>
  <div class="bg-white transition-shadow duration-200 overflow-hidden border-b border-gray-100">
    
    <!-- League Header - Sticky -->
    <div class="sticky top-0 z-10 py-1.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
      <div class="flex items-center justify-between px-2">
        <span class="text-xs font-semibold text-gray-700 truncate">{{ game.league }}</span>
        <!-- <span class="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
          {{ game.totalBets }}+ Bets
        </span> -->
        <div class="flex gap-1 flex-shrink-0">
        <span 
          class="w-12 sm:w-14 py-1.5 text-center text-xs sm:text-sm font-bold text-gray-700  hover:text-white rounded transition-colors duration-200"
        >
          1
        </span>
        <span 
          class="w-12 sm:w-14 py-1.5 text-center text-xs sm:text-sm font-bold hover:text-white rounded transition-colors duration-200"
        >
         x
        </span>
        <span 
          class="w-12 sm:w-14 py-1.5 text-center text-xs sm:text-sm font-bold text-gray-700  hover:text-white rounded transition-colors duration-200"
        >
          2
        </span>
      </div>
      </div>
    </div>

    <!-- Teams & Odds Row -->
    <div class="flex items-center py-3 px-2 justify-between">
      
      <!-- Teams -->
      <div class="flex-1 min-w-0">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-800 truncate">{{ game.homeTeam }}</span>
            <!-- <span class="text-[10px] font-bold text-gray-400">{{ game.homeScore !== undefined ? game.homeScore : '' }}</span> -->
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-800 truncate">{{ game.awayTeam }}</span>
            <!-- <span class="text-[10px] font-bold text-gray-400">{{ game.awayScore !== undefined ? game.awayScore : '' }}</span> -->
          </div>
        </div>
      </div>

      <!-- Odds -->
      <div class="flex gap-0.5 flex-shrink-0">
        <button 
          class="w-14 py-1.5 text-center text-xs sm:text-sm font-bold text-gray-700 bg-rose-400/40 hover:bg-rose-500 hover:text-white rounded transition-colors duration-200"
        >
          {{ game.odds.home }}
        </button>
        <button 
          class="w-14 py-1.5 text-center text-xs sm:text-sm font-bold text-gray-700 bg-rose-400/40 hover:bg-rose-500 hover:text-white rounded transition-colors duration-200"
        >
          {{ game.odds.draw }}
        </button>
        <button 
          class="w-14 py-1.5 text-center text-xs sm:text-sm font-bold text-gray-700 bg-rose-400/40 hover:bg-rose-500 hover:text-white rounded transition-colors duration-200"
        >
          {{ game.odds.away }}
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>