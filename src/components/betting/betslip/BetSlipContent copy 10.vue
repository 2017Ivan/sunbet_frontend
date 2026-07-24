<!-- BetSlipContent.vue -->
<template>
  <div class="h-full flex flex-col bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 h-16 border-b border-gray-700 flex-shrink-0">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="2"/>
        </svg>
        <h2 class="text-base font-semibold text-white">Bet Slip</h2>
      </div>
      <div class="flex items-center gap-2">
        <!-- Balance display -->
        <div v-if="isLoggedIn" class="pr-2 py-2 flex justify-between items-center">
          <span class="text-rose-500 font-bold text-xs">TZS {{ formatMoney(userBalance) }}</span>
        </div>

        <button
          v-if="showCloseButton"
          class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Sports / Virtuals Tabs -->
    <div class="flex border-b border-gray-700 bg-gray-800 flex-shrink-0">
      <button
        v-for="tab in ['Sports', 'Virtuals']"
        :key="tab"
        @click="activeTab = tab"
        class="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all relative flex items-center justify-center gap-1.5"
        :class="activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
      >
        <span>{{ tab }}</span>
        <span
          class="px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-colors"
          :class="activeTab === tab ? 'bg-rose-500 text-white' : 'bg-gray-700 text-gray-400'"
        >
          {{ tab === 'Sports' ? sportsItems.length : virtualsItems.length }}
        </span>
        <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"></div>
      </button>
    </div>

    <!-- ============ EMPTY STATE WITH LOAD CODE ============ -->
    <div v-if="!currentTabItems.length" class="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-8">
      <!-- Empty Icon -->
      <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="2"/>
        </svg>
      </div>

      <div class="text-center">
        <p class="text-sm font-medium text-gray-400">{{ activeTab }} bet slip is empty</p>
        <p class="text-xs text-gray-500 mt-1">Load a booking code or click on odds to add selections</p>
      </div>

      <!-- Load Booking Code Input - Always visible when empty -->
      <div class="w-full max-w-xs space-y-3 mt-2">
        <div class="flex gap-2">
          <input
            v-model="loadCodeInput"
            type="text"
            placeholder="Enter code e.g. ABC123"
            maxlength="6"
            class="flex-1 min-w-0 h-10 px-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-rose-500 text-white text-sm uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:text-gray-500"
            @input="handleLoadCodeInput"
            @keyup.enter="handleLoadCodeFromEmpty"
          />
          <button
            class="px-4 py-2 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            :disabled="!isLoadCodeValid || isLoadingCode"
            @click="handleLoadCodeFromEmpty"
          >
            <span v-if="isLoadingCode" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Loading...
            </span>
            <span v-else>Load</span>
          </button>
        </div>

        <!-- Load error -->
        <div v-if="loadError" class="bg-red-500/10 border border-red-500/20 rounded-xl p-2">
          <p class="text-xs text-red-400 text-center">{{ loadError }}</p>
        </div>

        <div class="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
          <span class="w-8 h-px bg-gray-700"></span>
          <span>or</span>
          <span class="w-8 h-px bg-gray-700"></span>
        </div>

        <AppButton variant="outline" size="sm" fullWidth @click="handleBrowseSports">
          Browse {{ activeTab }}
        </AppButton>
      </div>
    </div>

    <!-- ============ BETS LIST (With selections) ============ -->
    <div v-else class="flex-1 overflow-y-auto py-3 px-4 space-y-2">
      <!-- Actions row -->
      <div class="flex justify-between items-center gap-2 mb-3">
        <button
          class="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-medium"
          @click="toggleBookingCodeModal"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M8 12h8"/>
          </svg>
          Create Booking Code
        </button>
        <button
          class="text-xs text-gray-500 hover:text-red-400 transition-colors"
          @click="handleClearCurrentTab"
        >
          Clear BetSlip
        </button>
      </div>

      <!-- Bet items -->
      <div
        v-for="(bet, index) in currentTabItems"
        :key="bet.matchId || index"
        class="bg-gray-800 border border-gray-700 rounded-[12px] p-3 hover:border-gray-600 transition-colors"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 truncate">{{ bet.matchName || bet.match || 'Match' }}</p>
            <div class="mt-0.5 flex flex-row gap-1 items-center">
              <p class="text-xs text-gray-400">{{ getMarketDisplay(bet) }}</p>
              <p class="text-xs font-semibold text-gray-300 truncate">
                - {{ getSelectionDisplay(bet) }}
              </p>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span v-if="bet.type === 'virtuals'" class="text-[9px] bg-rose-500/10 text-rose-400 px-1 rounded font-medium">Virtual</span>
            </div>
            <div class="flex flex-row gap-2">
                <p v-if="bet.time" class="text-[10px] text-gray-500 font-bold mt-0.5">{{ bet.time }}</p>
                <p v-if="bet.date" class="text-[10px] text-gray-500 font-bold mt-0.5">{{ bet.date }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <button
              class="text-gray-500 hover:text-red-400 transition-colors"
              @click="handleRemoveBet(bet)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <span class="text-sm font-bold text-rose-400">{{ parseFloat(bet.odds).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Footer: Summary + Place bet -->
      <div class="border-t border-gray-700 px-0 py-2 space-y-3 flex-shrink-0">
        <!-- Insufficient balance warning -->
        <div v-if="isLoggedIn && stakeAmount > 0 && !hasEnoughBalance" class="bg-red-500/10 border border-red-500/20 rounded-[10px] p-3">
          <p class="text-xs text-red-400 text-center">
            Insufficient balance! Need TZS {{ formatMoney(stakeAmount) }} but have TZS {{ formatMoney(userBalance) }}
          </p>
        </div>

        <!-- Stake input -->
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Stake (TZS)</label>
          <div class="flex gap-2">
            <input
              v-model.number="stakeAmount"
              type="number"
              min="100"
              placeholder="Enter stake"
              :disabled="!isLoggedIn"
              class="flex-1 h-10 px-3 rounded-[10px] bg-gray-800 border border-gray-700 focus:border-rose-500 text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <p v-if="stakeAmount > 0 && stakeAmount < 100" class="text-red-400 text-[10px] mt-1">Minimum stake is TZS 100</p>
        </div>

        <!-- Summary -->
        <div class="space-y-1.5 bg-gray-800 rounded-[10px] px-3 py-2.5 border border-gray-700">
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">Total Odds</span>
            <span class="text-white font-semibold">{{ totalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">Potential Win</span>
            <span class="text-emerald-400 font-semibold">TZS {{ potentialWin.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">Tax 12%</span>
            <span class="text-emerald-400 font-semibold">TZS {{ tax.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">Payout</span>
            <span class="text-emerald-400 font-semibold">TZS {{ payout.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Place bet button -->
        <AppButton
          v-if="isLoggedIn"
          variant="primary"
          fullWidth
          size="lg"
          :loading="isPlacingBet"
          loading-text="Processing..."
          :disabled="!isStakeValid || !hasEnoughBalance || isPlacingBet"
          @click="handlePlaceBet"
        >
          Place Bet
        </AppButton>

        <AppButton
          v-else
          variant="primary"
          fullWidth
          size="lg"
          @click="handleLoginRedirect"
        >
          Login to Bet
        </AppButton>

        <p class="text-[10px] text-gray-500 text-center">20% Excise Duty · Must be 18+</p>
      </div>
    </div>

    <!-- Booking Code Modal -->
     <BookingCodeModal
      :is-open="showBookingCodeModal"
      @close="toggleBookingCodeModal"
      @code-created="handleCodeCreated"
      @code-loaded="handleCodeLoaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../../../stores/auth/authStore.js'
import { useBetStore } from '../../../stores/bets/betStore.js'
import { useBookingCodeStore } from '../../../stores/bookingcode/bookingCodeStore.js'
import AppButton from '../../../components/ui/AppButton.vue'
import BookingCodeModal from '../../betting/bookingcode/BookingCodeModal.vue'

const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'place-bet'])

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const betStore = useBetStore()
const bookingCodeStore = useBookingCodeStore()

// ---- Local State ----
const activeTab = ref('Sports')
const stakeAmount = ref(0)
const betType = ref('Single')
const isPlacingBet = ref(false)
const showBookingCodeModal = ref(false)

// ---- Load Code State (Empty State) ----
const loadCodeInput = ref('')
const isLoadingCode = ref(false)
const loadError = ref('')

// ---- Segregating Items based on Tab ----
const sportsItems = computed(() => {
  return betStore.slip.filter(item => !item.type || item.type === 'sports' || item.type === 'sport')
})

const virtualsItems = computed(() => {
  return betStore.slip.filter(item => item.type === 'virtuals')
})

const currentTabItems = computed(() => {
  return activeTab.value === 'Sports' ? sportsItems.value : virtualsItems.value
})

// ---- Computed Calculations ----
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userBalance = computed(() => authStore.user?.balance || 0)

const totalOdds = computed(() => {
  if (!currentTabItems.value.length) return 1
  return currentTabItems.value.reduce((acc, bet) => acc * (parseFloat(bet.odds) || 1), 1)
})

const potentialWin = computed(() => {
  return Math.round((stakeAmount.value || 0) * (totalOdds.value - 1))
})

const tax = computed(() => {
  return Math.round((potentialWin.value || 0) * 0.12)
})

const payout = computed(() => {
  return Math.round((potentialWin.value - tax.value) + stakeAmount.value)
})

const isStakeValid = computed(() => stakeAmount.value >= 100)

const hasEnoughBalance = computed(() => {
  if (!isLoggedIn.value) return false
  return userBalance.value >= stakeAmount.value
})

// ---- Load Code Validation ----
const isLoadCodeValid = computed(() => {
  const code = loadCodeInput.value.trim().toUpperCase()
  return code.length === 6 && /^[A-Z0-9]{6}$/.test(code)
})

// ---- Display Helpers ----
const getMarketDisplay = (bet) => {
  const market = bet.market || bet.marketKey || '1X2'
  
  // Map market keys to display names
  const marketMap = {
    '1X2': '1X2 | Full Time',
    'Double Chance': 'Double Chance | Full Time',
    'Both Teams to Score': 'Both Teams to Score | Full Time',
    'BTTS': 'Both Teams to Score | Full Time',
    'Over/Under': 'Over/Under | Full Time',
    'Correct Score': 'Correct Score | Full Time',
    'Correct Score First Half': 'Correct Score | First Half',
    'Correct Score Second Half': 'Correct Score | Second Half',
    'CS_FT': 'Correct Score | Full Time',
    'CS_FH': 'Correct Score | First Half',
    'CS_SH': 'Correct Score | Second Half',
    'OU': 'Over/Under | Full Time'
  }
  
  return marketMap[market] || market
}

const getSelectionDisplay = (bet) => {
  let pick = bet.pick || bet.selection || ''
  const market = bet.market || bet.marketKey || '1X2'
  
  // For 1X2 market - show as is (1, X, 2)
  if (market === '1X2' || market === '1X2 | Full Time') {
    if (pick === '1' || pick === 'home') return '1'
    if (pick === 'X' || pick === 'draw') return 'X'
    if (pick === '2' || pick === 'away') return '2'
    return pick
  }
  
  // For Double Chance market - show as is (1X, X2, 12)
  if (market === 'Double Chance' || market === 'Double Chance | Full Time') {
    if (pick === '1X' || pick === '1X') return '1X'
    if (pick === 'X2' || pick === 'X2') return 'X2'
    if (pick === '12' || pick === '12') return '12'
    return pick
  }
  
  // For Over/Under, format nicely
  if (pick.toLowerCase().includes('over')) {
    return pick.toUpperCase()
  }
  if (pick.toLowerCase().includes('under')) {
    return pick.toUpperCase()
  }
  
  // For BTTS
  if (pick.toLowerCase() === 'yes') return 'Yes'
  if (pick.toLowerCase() === 'no') return 'No'
  
  // For Correct Score, already has format like "2-1"
  return pick
}

// ---- Methods ----
const formatMoney = (n) => {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 2 }).format(n || 0)
}

const handleBrowseSports = () => {
  emit('close')
  router.push('/sports')
}

const handleClearCurrentTab = () => {
  const itemsToRemove = currentTabItems.value
  itemsToRemove.forEach(item => {
    betStore.removeFromSlip(item.matchId, item.marketKey)
  })
  stakeAmount.value = 0
  toast.info('Bet slip cleared', {
    position: 'bottom-right',
    timeout: 2000
  })
}

const handleRemoveBet = (bet) => {
  betStore.removeFromSlip(bet.matchId, bet.marketKey)
  if (currentTabItems.value.length === 0) {
    stakeAmount.value = 0
  }
  toast.info('Selection removed', {
    position: 'bottom-right',
    timeout: 1500
  })
}

//  handlePlaceBet

const handlePlaceBet = async () => {
  if (!isStakeValid.value || !hasEnoughBalance.value || !currentTabItems.value.length) return
  
  isPlacingBet.value = true
  
  try {
    betStore.updateStake(stakeAmount.value)
    
    const result = await betStore.placeBetFromSlip()
    
    if (result.success) {
      toast.success('🎉 Bet placed successfully!')
      // ... rest of code
    } else {
      toast.error(result.error || '❌ Failed to place bet')
    }
  } catch (error) {
    toast.error('❌ An error occurred while placing bet')
  } finally {
    isPlacingBet.value = false
  }
}

const handleLoginRedirect = () => {
  emit('close')
  router.push('/auth/login')
}

// ---- Load Code Methods (Empty State) ----
const handleLoadCodeInput = (e) => {
  const value = e.target.value.toUpperCase()
  loadCodeInput.value = value.replace(/[^A-Z0-9]/g, '')
  loadError.value = ''
}

const handleLoadCodeFromEmpty = async () => {
  if (!isLoadCodeValid.value) {
    loadError.value = 'Enter a valid 6-character code (letters and numbers only)'
    return
  }

  isLoadingCode.value = true
  loadError.value = ''

  const code = loadCodeInput.value.trim().toUpperCase()

  try {
    const result = await bookingCodeStore.loadBookingCode(code)
    if (result.success) {
      loadError.value = ''
      if (bookingCodeStore.loadedSelections.length > 0) {
        const success = bookingCodeStore.applyLoadedSelectionsToSlip()
        if (success) {
          toast.success(`✅ ${bookingCodeStore.loadedSelections.length} selections loaded!`, {
            position: 'bottom-right',
            timeout: 3000
          })
          loadCodeInput.value = ''
        } else {
          loadError.value = 'Failed to apply selections'
        }
      } else {
        loadError.value = 'No selections found in this code'
      }
    } else {
      loadError.value = result.error || 'Failed to load booking code'
    }
  } catch (error) {
    loadError.value = 'An error occurred while loading code'
    console.error('Load code error:', error)
  } finally {
    isLoadingCode.value = false
  }
}

// ---- Booking Code Modal Methods ----
const toggleBookingCodeModal = () => {
  if (currentTabItems.value.length === 0) {
    toast.warning('No selections to create a booking code', {
      position: 'bottom-right',
      timeout: 3000
    })
    return
  }
  showBookingCodeModal.value = !showBookingCodeModal.value
}

const handleCodeCreated = (data) => {
  toast.success(`✅ Booking code created: ${data.bookingCode}`, {
    position: 'bottom-right',
    timeout: 5000
  })
  console.log('✅ Code created:', data)
}

const handleCodeLoaded = (selections) => {
  toast.success(`✅ ${selections.length} selections loaded to bet slip`, {
    position: 'bottom-right',
    timeout: 3000
  })
  console.log('✅ Code loaded:', selections.length, 'selections')
}

// ---- Watchers ----
watch(currentTabItems, (newItems) => {
  if (newItems.length === 0) {
    stakeAmount.value = 0
    loadError.value = ''
  }
}, { deep: true })

watch(stakeAmount, (newVal) => {
  betStore.updateStake(newVal || 0)
})

watch(() => currentTabItems.value.length, (newLength) => {
  if (newLength > 0 && stakeAmount.value === 0) {
    stakeAmount.value = betStore.stake || 100
  }
}, { immediate: true })

watch(loadCodeInput, () => {
  loadError.value = ''
})
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #f43f5e;
}

input::placeholder {
  color: #6b7280;
}

input:focus {
  outline: none;
}
</style>