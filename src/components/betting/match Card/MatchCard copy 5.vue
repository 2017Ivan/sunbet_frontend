// MatchCard.vue 
<template>
  <div class="bg-gray-800 py-2 gap-2 border-b border-gray-100/40  ">
    
    <!-- Teams & Odds Row -->
    <div class="flex items-center py-1.5 px-1 justify-between">
      
      <!-- Teams -->
      <div class="flex-1 min-w-0 ">
       <div class="text-gray-600 text-xs flex items-center gap-2 mb-2">
       <span class="text-sm font-normal text-gray-300">
       {{ game.time }}
       </span>
       <span class="text-sm font-normal text-gray-300">
        {{ game.date }}
       </span>
       
       </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-400 truncate">{{ game.homeTeam }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-400 truncate">{{ game.awayTeam }}</span>
          </div>
        </div>
        <!-- <div class="text-white text-xs">+45 Market</div> -->
      </div>

      <!-- Odds -->
      <div class="flex gap-0.5 flex-shrink-0">
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white  transition-colors duration-200"
        >
          {{ game.odds.home }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs  font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white  transition-colors duration-200"
        >
          {{ game.odds.draw }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs  font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white  transition-colors duration-200"
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