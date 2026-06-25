<template>
  <div 
    class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-3 sm:p-4 hover:border-[#A32D2D]/40 transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(163,45,45,0.15)]"
  >
    <!-- Match header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div>
          <p class="text-[11px] sm:text-xs font-medium text-[#A0A0A0]">{{ match.league }}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Live indicator -->
        <span
          v-if="match.isLive"
          class="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-[9px] sm:text-[10px] font-bold border border-[#FF3B3B]/25 animate-pulse"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-ping" />
          LIVE {{ match.minute }}'
        </span>
        <span
          v-else
          class="text-[9px] sm:text-[10px] text-[#606060] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1E1E1E]"
        >
          {{ match.time }}
        </span>
        
        <!-- Favorite button -->
        <button 
          class="text-[#606060] hover:text-[#F59E0B] transition-colors p-1 rounded-full hover:bg-[#F59E0B]/10"
          @click="toggleFavorite"
        >
          <svg 
            class="w-3.5 h-3.5 sm:w-4 sm:h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            :class="isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : ''"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Teams + Score -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-1.5 sm:gap-2 mb-1.5">
          <span class="text-sm font-semibold text-[#A0A0A0] truncate">{{ match.home }}</span>
          <span v-if="match.isLive" class="text-sm font-black text-white ml-auto">{{ match.score.home }}</span>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span class="text-sm font-semibold text-[#A0A0A0] truncate">{{ match.away }}</span>
          <span v-if="match.isLive" class="text-sm font-black text-[#A0A0A0] ml-auto">{{ match.score.away }}</span>
        </div>
      </div>
    </div>

    <!-- Odds buttons -->
    <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
      <button
        v-for="odd in match.odds"
        :key="odd.label"
        class="relative flex flex-col items-center gap-0.5 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-[10px] border transition-all duration-200 overflow-hidden group/odd"
        :class="isBetSelected(odd.label)
          ? 'bg-[#A32D2D] border-[#A32D2D] text-white shadow-[0_4px_20px_rgba(163,45,45,0.3)]'
          : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#A32D2D]/40 hover:bg-[#A32D2D]/8 text-[#A0A0A0]'"
        @click="handleBetClick(odd)"
      >
        <!-- Selection indicator -->
        <span v-if="isBetSelected(odd.label)" class="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-[10px] flex items-center justify-center text-[8px]">
          ✓
        </span>
        
        <div class="flex justify-between items-center  w-full">
                <span class="text-[9px] sm:text-[10px] font-medium">{{ odd.label }}</span>
                <span
                class="text-sm font-bold transition-colors"
                :class="isBetSelected(odd.label) ? 'text-white' : 'text-[#A32D2D] group-hover/odd:text-[#C94040]'"
                >
                {{ odd.value }}
                </span>
        </div>
        
        <!-- Hover glow -->
        <div v-if="!isBetSelected(odd.label)" class="absolute inset-0 bg-gradient-to-r from-[#A32D2D]/0 via-[#A32D2D]/5 to-[#A32D2D]/0 opacity-0 group-hover/odd:opacity-100 transition-opacity duration-300" />
      </button>
    </div>

    <!-- More markets link -->
    <!-- <button 
      class="w-full mt-3 text-[10px] sm:text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors flex items-center justify-center gap-1 group/markets"
    >
      <svg class="w-3 h-3 transition-transform group-hover/markets:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      {{ match.marketCount }} more markets
    </button> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBetSlipStore } from '../../stores/useBetSlipStore'

const props = defineProps({
  match: {
    type: Object,
    required: true
  }
})

const betSlipStore = useBetSlipStore()
const isFavorite = ref(false)

const isBetSelected = (label) => {
  return betSlipStore.items.some(b => b.id === `${props.match.id}-${label}`)
}

const handleBetClick = (odd) => {
  betSlipStore.toggleBet({
    id:        `${props.match.id}-${odd.label}`,
    match:     `${props.match.home} vs ${props.match.away}`,
    selection: odd.label,
    market:    '1X2',
    odds:      odd.value,
  })
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Optional: Emit event or store in localStorage
}
</script>