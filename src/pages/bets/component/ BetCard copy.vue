<template>
  <div 
    class="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 hover:border-rose-600/30 transition-all cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <!-- Event Name -->
        <h3 class="text-white font-semibold text-sm">{{ bet.event }}</h3>
        
        <!-- Selection -->
        <p class="text-[#A0A0A0] text-sm mt-1">
          {{ bet.selection }} 
          <span class="text-rose-400 font-semibold">@ {{ bet.odds }}</span>
        </p>
        
        <!-- Market -->
        <p class="text-xs text-[#606060] mt-0.5">{{ bet.market }}</p>
        
        <!-- Details -->
        <div class="flex flex-wrap items-center gap-3 mt-2 text-xs">
          <span class="text-[#606060]">Stake: <span class="text-white">{{ bet.stake.toLocaleString() }} TZS</span></span>
          <span class="text-[#606060]">|</span>
          <span class="text-[#606060]">Potential: <span class="text-green-400">{{ bet.potentialWin.toLocaleString() }} TZS</span></span>
        </div>
      </div>
      
      <div class="text-right flex-shrink-0 ml-4">
        <!-- Status Badge -->
        <span 
          class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
          :class="statusClass"
        >
          {{ statusLabel }}
        </span>
        
        <!-- Amount (for settled bets) -->
        <p v-if="bet.status === 'won'" class="text-green-400 font-bold text-sm mt-1.5">
          +{{ bet.actualWin.toLocaleString() }}
        </p>
        <p v-else-if="bet.status === 'lost'" class="text-red-400 font-bold text-sm mt-1.5">
          -{{ bet.stake.toLocaleString() }}
        </p>
        
        <!-- Booking Code -->
        <p class="text-[10px] text-[#606060] mt-1">#{{ bet.bookingCode }}</p>
      </div>
    </div>
    
    <!-- Arrow indicator -->
    <div class="flex justify-end mt-2">
      <svg class="w-4 h-4 text-[#606060]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bet: { type: Object, required: true },
  status: { type: String, default: 'open' }
})

defineEmits(['click'])

const statusLabel = computed(() => {
  if (props.bet.status === 'won') return 'Won ✅'
  if (props.bet.status === 'lost') return 'Lost ❌'
  return 'Open ⏳'
})

const statusClass = computed(() => {
  if (props.bet.status === 'won') return 'bg-green-900/30 text-green-400 border border-green-800/30'
  if (props.bet.status === 'lost') return 'bg-red-900/30 text-red-400 border border-red-800/30'
  return 'bg-rose-900/30 text-rose-400 border border-rose-800/30'
})
</script>