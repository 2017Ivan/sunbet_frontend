<!-- MatchCard.vue -->
<template>
  <div class="bg-gray-800 py-2 gap-2 border-b border-gray-100/40">
    
    <!-- Teams & Odds Row -->
    <div class="flex items-center py-1.5 px-1 justify-between">
      
      <!-- Teams -->
      <div class="flex-1 min-w-0">
        <div class="text-gray-600 text-xs flex items-center gap-2 mb-2">
          <span class="text-sm font-normal text-gray-300">{{ game.time }}</span>
          <span class="text-sm font-normal text-gray-300">{{ game.date }}</span>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-400 truncate">{{ game.homeTeam }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[14px] font-bold text-gray-400 truncate">{{ game.awayTeam }}</span>
          </div>
        </div>
      </div>

      <!-- Odds -->
      <div class="flex gap-0.5 flex-shrink-0">
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white transition-colors duration-200"
          @click="handleOddsClick('home')"
        >
          {{ game.odds.home }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white transition-colors duration-200"
          @click="handleOddsClick('draw')"
        >
          {{ game.odds.draw }}
        </button>
        <button 
          class="w-12 py-1.5 text-center text-xs font-bold text-gray-700 bg-gradient-to-b from-white via-gray-300 to-white hover:bg-rose-500 hover:text-white transition-colors duration-200"
          @click="handleOddsClick('away')"
        >
          {{ game.odds.away }}
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useBetStore } from '../../../stores/bets/betStore.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const betStore = useBetStore()

// ---- Handle Odds Click ----
const handleOddsClick = (type) => {
  const selection = {
    matchId: props.game.id,
    matchName: `${props.game.homeTeam} vs ${props.game.awayTeam}`,
    league: props.game.league,
    market: '1X2',
    marketKey: type === 'home' ? '1' : type === 'draw' ? 'X' : '2',
    pick: type === 'home' ? props.game.homeTeam : type === 'draw' ? 'Draw' : props.game.awayTeam,
    odds: props.game.odds[type],
    type: 'sports'
  }
  
  console.log('📝 Adding to slip:', selection)
  betStore.addToSlip(selection)
  
  // Open bet slip
  betStore.isOpen = true
}
</script>