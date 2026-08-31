<template>
  <div 
    class="bg-white border border-gray-200 rounded-xl p-3 hover:border-rose-600/40 transition-all duration-300 cursor-pointer hover:bg-white group"
    @click="$emit('click')"
  >
    <!-- Header: Status + Selection Count + Booking Code -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2">
        <span 
          class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
          :class="statusClass"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
          {{ statusLabel }} 
          <!-- ({{ selectionCount }}) -->
        </span>
      </div>
      <span class="text-[10px] font-bold text-gray-500">{{ bet.ticket_code }}</span>
    </div>

    <!-- Date -->
    <span class="text-[10px] text-gray-500 block mb-2.5 font-bold">{{ formatDate(bet.createdAt) }}</span>

    <!-- Stats Grid - 3 columns -->
    <div class="grid grid-cols-3 gap-2  rounded-lg p-2.5">
      <!-- Total Odds -->
      <div class="text-start">
        <p class="text-[9px] text-gray-900 uppercase tracking-wider">Odds</p>
        <p class="text-gray-950 font-bold text-sm">{{ formatOdds(bet.total_odds ?? bet.totalOdds) }}</p>
      </div>
      
      <!-- Stake -->
      <div class="text-center border-x border-gray-200">
        <p class="text-[9px] text-gray-900 uppercase tracking-wider">Stake</p>
        <p class="text-gray-950 font-bold text-sm">{{ formatNumber(bet.stake) }}</p>
      </div>
      
      <!-- Payout -->
      <div class="text-end">
        <p class="text-[9px] text-gray-900 uppercase tracking-wider">Payout</p>
        <p class="text-green-400 font-bold text-sm">{{ formatNumber(bet.payout ?? bet.potentialReturn ?? bet.possible_win) }}</p>
      </div>
    </div>

    <!-- Arrow Indicator on Hover -->
    <!-- <div class="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingCodeStore } from '../../../stores/bookingCode/useBookingCodeStore.js'

const props = defineProps({
  bet: { type: Object, required: true },
  status: { type: String, default: 'OPEN' }
})

defineEmits(['click'])

const bookingCodeStore = useBookingCodeStore()

// ---- Helper Functions ----
const formatNumber = (value) => {
  if (value === undefined || value === null || value === '') return '0'
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

const formatOdds = (value) => {
  if (value === undefined || value === null || value === '') return '0.00'
  const num = parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-TZ', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ---- Get Selection Count from Booking Code ----
const selectionCount = computed(() => {
  // Try to get selections from bookingCode if available
  if (props.bet.bookingCode?.selections) {
    return props.bet.bookingCode.selections.length
  }
  
  // If selections are directly on bet
  if (props.bet.selections) {
    return props.bet.selections.length
  }
  
  // Try to find in bookingCodeStore
  const bookingCode = bookingCodeStore.bookingCodes?.find(
    bc => bc.id === props.bet.bookingCodeId
  )
  if (bookingCode?.selections) {
    return bookingCode.selections.length
  }
  
  return 0
})

// ---- Status ----
const isCashedOut = computed(() => {
  const result = (props.bet.result || '').toUpperCase()
  const hasCashoutAmount = parseFloat(props.bet.cashout_amount) > 0
  return result === 'CASHED_OUT' || hasCashoutAmount
})

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

const isOpen = computed(() => {
  const status = (props.bet.status || '').toUpperCase()
  const result = (props.bet.result || '').toUpperCase()
  return status === 'OPEN' || status === 'PENDING' || result === 'PENDING'
})

const statusLabel = computed(() => {
  if (isCashedOut.value) return 'CASH OUT'
  if (isWon.value) return 'WON'
  if (isLost.value) return 'LOST'
  if (isOpen.value) return 'PENDING'
  return 'SETTLED'
})

const statusClass = computed(() => {
  if (isCashedOut.value) {
    return 'bg-emerald-900 text-emerald-400 border border-emerald-800/30'
  }
  if (isWon.value) {
    return 'bg-green-900 text-green-400 border border-green-800/30'
  }
  if (isLost.value) {
    return 'bg-red-900 text-red-400 border border-red-800/30'
  }
  if (isOpen.value) {
    return 'bg-amber-900 text-amber-400 border border-amber-800/30'
  }
  return 'bg-gray-900 text-gray-400 border border-gray-800/30'
})

const statusDotClass = computed(() => {
  if (isCashedOut.value) return 'bg-emerald-400'
  if (isWon.value) return 'bg-green-400'
  if (isLost.value) return 'bg-red-400'
  if (isOpen.value) return 'bg-amber-900 animate-pulse'
  return 'bg-gray-400'
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>