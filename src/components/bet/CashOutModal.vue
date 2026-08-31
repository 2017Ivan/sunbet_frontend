<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30" @click="handleClose"></div>

      <!-- Panel -->
      <div class="relative w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl">
        <!-- Success -->
        <template v-if="status === 'success'">
          <div class="flex flex-col items-center py-4">
            <div class="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mb-3">
              <svg class="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Cashed Out! 🎉</h3>
            <p class="text-sm text-gray-500 mt-1">Amount credited to your balance</p>
            <p class="text-2xl font-bold text-green-600 mt-2">TZS {{ formatNumber(cashoutValue) }}</p>
          </div>
          <button
            class="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            @click="done"
          >
            Done
          </button>
        </template>

        <!-- Confirm -->
        <template v-else>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              Cash Out
            </h3>
            <button class="text-gray-500 hover:text-gray-900 transition-colors" @click="handleClose">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <!-- <p class="text-xs text-gray-500 mb-1">Your cashout offer</p> -->
            <p class="text-xl font-bold text-emerald-600">TZS {{ formatNumber(cashoutValue) }}</p>
            <p class="text-[10px] text-gray-500 mt-1">Final amount — includes your stake and reduced profit.</p>
          </div>

          <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5">
            <p class="text-xs text-amber-600 leading-relaxed">
              ⚠️ Cashing out locks this bet now. You won't receive any further winnings if the remaining matches win.
            </p>
          </div>

          <p v-if="errorMessage" class="text-xs text-[#EF4444] mb-3 text-center">{{ errorMessage }}</p>

          <div class="flex gap-3">
            <button
              class="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold text-sm hover:text-gray-900 transition-colors"
              :disabled="processing"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              class="flex-[1.4] py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="processing"
              @click="confirmCashout"
            >
              <svg v-if="processing" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <template v-else>Confirm Cash Out</template>
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useBetStore } from '../../stores/bet/betStore.js'

const props = defineProps({
  betId: { type: String, required: true },
  cashoutValue: { type: [Number, String], default: 0 }
})

const emit = defineEmits(['close', 'cashed-out'])

const betStore = useBetStore()

const processing = ref(false)
const errorMessage = ref('')
const status = ref('confirm')

const formatNumber = (value) => {
  if (value === undefined || value === null || value === '') return '0.00'
  const num = parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const confirmCashout = async () => {
  processing.value = true
  errorMessage.value = ''

  try {
    const result = await betStore.cashoutBet(props.betId)

    if (result.success) {
      status.value = 'success'
      emit('cashed-out', result.data)
    } else {
      errorMessage.value = result.message || 'Cashout failed. Please try again.'
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Cashout failed. Please try again.'
  } finally {
    processing.value = false
  }
}

const done = () => {
  emit('cashed-out')
  handleClose()
}

const handleClose = () => {
  if (processing.value) return
  emit('close')
}

defineExpose({ cashoutValue: props.cashoutValue })
</script>