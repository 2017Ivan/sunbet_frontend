<template>
  <div class="min-h-screen bg-transparent flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-transparent border border-gray-800 rounded-2xl p-8 text-center">
      <!-- Loading -->
      <div v-if="status === 'loading'" class="space-y-4">
        <div class="mx-auto w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-300 font-medium">Loading booking code...</p>
      </div>

      <!-- Expired / Error -->
      <div v-else-if="status === 'error'" class="space-y-4">
        <div class="mx-auto w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-3L13.75 4a2 2 0 00-3.5 0L3.25 16a2 2 0 001.75 3z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white">Booking Code Expired</h2>
        <p class="text-sm text-gray-400">{{ errorMessage }}</p>
        <button
          @click="goHome"
          class="w-full py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors"
        >
          Go to Home
        </button>
      </div>

      <!-- Success (brief) -->
      <div v-else class="space-y-4">
        <div class="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white">Code Loaded!</h2>
        <p class="text-sm text-gray-400">Adding {{ selectionCount }} selection(s) to your bet slip...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingCodeStore } from '../../stores/bookingCode/useBookingCodeStore.js'
import { useBetStore } from '../../stores/bet/betStore.js'

const route = useRoute()
const router = useRouter()
const bookingCodeStore = useBookingCodeStore()
const betStore = useBetStore()

const status = ref('loading')
const errorMessage = ref('')
const selectionCount = ref(0)

const goHome = () => {
  router.replace({ name: 'home', query: { booking: route.params.code } })
}

const loadCode = async () => {
  const code = route.params.code
  if (!code) {
    status.value = 'error'
    errorMessage.value = 'No booking code provided.'
    return
  }

  try {
    const result = await bookingCodeStore.loadBookingCode(code)
    if (!result.success) {
      status.value = 'error'
      errorMessage.value = result.message || 'This booking code has expired or is no longer active.'
      return
    }

    const selections = bookingCodeStore.loadedSelections
    selectionCount.value = selections.length

    // Add selections to bet slip
    betStore.clearSlip()
    selections.forEach((sel) => betStore.addToSlip(sel))

    status.value = 'success'
    setTimeout(() => {
      goHome()
    }, 700)
  } catch (e) {
    status.value = 'error'
    errorMessage.value = 'Unable to load this booking code.'
  }
}

onMounted(loadCode)
</script>
