<template>
  <div class="bg-white px-1  transition-shadow duration-200 overflow-hidden  border-b border-gray-100">
    <!-- League Header -->
    <div class=" py-1 bg-gray-50/80">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-gray-600">{{ game.league }}</span>
        <span class="text-xs font-semibold text-gray-500">{{ game.totalBets }}+</span>
      </div>
    </div>

    <!-- Teams & Odds Row -->
    <div class="flex items-center  py-3 justify-between ">
      
      <!-- Teams -->
      <div class="flex-1 min-w-0">
        <div class="space-y-1.5">
          <span class="text-xs font-semibold text-gray-800 block truncate">{{ game.homeTeam }}</span>
          <span class="text-xs font-semibold text-gray-800 block truncate">{{ game.awayTeam }}</span>
        </div>
      </div>

      <!-- Odds -->
      <div class="flex gap-0.5 flex-shrink-0">
        <button 
          class="w-14 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-200 hover:bg-rose-500 hover:text-white  transition-colors duration-200"
        >
          {{ game.odds.home }}
        </button>
        <button 
          class="w-14 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-200 hover:bg-rose-500 hover:text-white  transition-colors duration-200"
        >
          {{ game.odds.draw }}
        </button>
        <button 
          class="w-14 py-1.5 text-center text-sm font-bold text-gray-700 bg-gray-200 hover:bg-rose-500 hover:text-white  transition-colors duration-200"
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