<template>
  <div 
    class="flex flex-col bg-gray-900 border-b border-[#2A2A2A] rounded-xl p-2 hover:border-rose-600/30 transition-all cursor-pointer hover:bg-[#1A1A1A]"
    @click="$emit('click')"
  >
      <div class="flex flex-row items-center justify-between py-1 bg-gray-950">
          <span class="text-[10px] text-[#606060] ">pending(bet.length())</span>
          <span class="text-[10px] text-[#606060] ">ID: {{ bet.id }}</span>
        </div>
        <div class="flex flex-row items-center justify-start text-[10px] text-[#606060]">
          <span>11:00 AM</span>
          <span>12 jul 2026</span>
        </div>
        <div class="flex flex-row items-center justify-between py-1 bg-gray-950">
          <span class="text-[10px] text-[#606060] ">Odds</span>
          <span class="text-[10px] text-[#606060] ">{{ bet.totalOdds }}</span>
        </div>
        <div class="flex flex-row items-center justify-between py-1 bg-gray-950">
          <span class="text-[10px] text-[#606060] ">Stake</span>
          <span class="text-[10px] text-[#606060] "> {{ bet.stake }} TZS</span>
        </div>
        <div class="flex flex-row items-center justify-between py-1 bg-gray-950">
          <span class="text-[10px] text-[#606060] ">Payout</span>
          <span class="text-[10px] text-[#606060] ">{{ bet.potentialReturn }} TZS</span>
        </div>



    
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bet: { type: Object, required: true },
  status: { type: String, default: 'OPEN' }
})

defineEmits(['click'])

// ---- Helper Functions ----
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

const getEventName = () => {
  if (!props.bet.selections || props.bet.selections.length === 0) {
    return 'Unknown Event'
  }
  return props.bet.selections[0]?.match?.name || 'Unknown Event'
}

const getSelection = () => {
  if (!props.bet.selections || props.bet.selections.length === 0) {
    return 'Unknown Selection'
  }
  const sel = props.bet.selections[0]
  return sel.selection || sel.pick || 'Unknown'
}

const getOdds = () => {
  if (!props.bet.selections || props.bet.selections.length === 0) {
    return '1.00'
  }
  const sel = props.bet.selections[0]
  return parseFloat(sel.odds || 1).toFixed(2)
}

const getMarket = () => {
  if (!props.bet.selections || props.bet.selections.length === 0) {
    return '1X2'
  }
  return props.bet.selections[0]?.match?.market || '1X2'
}

// ---- Status ----
const isWon = computed(() => {
  const status = (props.bet.status || '').toUpperCase()
  const result = (props.bet.result || '').toUpperCase()
  return status === 'WON' || result === 'WON'
})

const isLost = computed(() => {
  const status = (props.bet.status || '').toUpperCase()
  const result = (props.bet.result || '').toUpperCase()
  return status === 'LOST' || result === 'LOST'
})

const statusLabel = computed(() => {
  if (isWon.value) return 'WON ✅'
  if (isLost.value) return 'LOST ❌'
  const status = (props.bet.status || '').toUpperCase()
  if (status === 'SETTLED') return 'SETTLED'
  return 'OPEN ⏳'
})

const statusClass = computed(() => {
  if (isWon.value) {
    return 'bg-green-900/30 text-green-400 border border-green-800/30'
  }
  if (isLost.value) {
    return 'bg-red-900/30 text-red-400 border border-red-800/30'
  }
  const status = (props.bet.status || '').toUpperCase()
  if (status === 'SETTLED') {
    return 'bg-gray-900/30 text-gray-400 border border-gray-800/30'
  }
  return 'bg-rose-900/30 text-rose-400 border border-rose-800/30'
})
</script>