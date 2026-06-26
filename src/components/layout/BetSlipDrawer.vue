<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="open"
      class="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-[#2A2A2A] flex flex-col shadow-[−8px_0_40px_rgba(0,0,0,0.6)]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 h-16 border-b border-[#2A2A2A]">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
          <h2 class="text-base font-semibold text-white">Bet Slip</h2>
          <span
            v-if="betSlipStore.count"
            class="px-2 py-0.5 rounded-full bg-[#A32D2D] text-white text-xs font-bold"
          >
            {{ betSlipStore.count }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="betSlipStore.count"
            class="text-xs text-[#606060] hover:text-[#EF4444] transition-colors"
            @click="handleClearAll"
          >
            Clear all
          </button>
          <button
            class="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#606060] hover:text-white transition-colors"
            @click="$emit('close')"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!betSlipStore.count" class="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
          <svg class="w-10 h-10 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
          </svg>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-[#A0A0A0]">Bet slip is empty</p>
          <p class="text-xs text-[#606060] mt-1">Click on odds to add selections</p>
        </div>
        <AppButton variant="outline" size="sm" @click="$router.push('/sports'); $emit('close')">
          Browse Sports
        </AppButton>
      </div>

      <!-- Bets list -->
      <div v-else class="flex-1 overflow-y-auto py-3 px-4 space-y-2">
        <div
          v-for="(bet, index) in betSlipStore.items"
          :key="bet.id || index"
          class="bg-[#1E1E1E] border border-[#2A2A2A] rounded-[12px] p-3"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-[#606060] truncate">{{ bet.matchName || bet.match || 'Match' }}</p>
              <p class="text-sm font-semibold text-white mt-0.5 truncate">{{ bet.pick || bet.selection || 'Selection' }}</p>
              <p class="text-xs text-[#A0A0A0] mt-0.5">{{ bet.market || '1X2' }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <button
                class="text-[#606060] hover:text-[#EF4444] transition-colors"
                @click="handleRemoveBet(index)"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <span class="text-sm font-bold text-[#A32D2D]">{{ bet.odds }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer: Summary + Place bet -->
      <div v-if="betSlipStore.count" class="border-t border-[#2A2A2A] p-4 space-y-3">
        <!-- Login required warning -->
        <div v-if="!isLoggedIn" class="bg-[#A32D2D]/10 border border-[#A32D2D]/20 rounded-[10px] p-3">
          <p class="text-xs text-[#A32D2D] text-center">Please login to place bets</p>
        </div>

        <!-- Insufficient balance warning -->
        <div v-if="isLoggedIn && stakeAmount > 0 && !hasEnoughBalance" class="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[10px] p-3">
          <p class="text-xs text-[#EF4444] text-center">
            Insufficient balance! Need TZS {{ formatMoney(stakeAmount) }} but have TZS {{ formatMoney(userBalance) }}
          </p>
        </div>

        <!-- Bet type tabs -->
        <div class="flex gap-1 p-1 bg-[#1E1E1E] rounded-[10px]">
          <button
            v-for="type in ['Single', 'Accumulator']"
            :key="type"
            class="flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
            :class="betType === type
              ? 'bg-[#A32D2D] text-white'
              : 'text-[#606060] hover:text-white'"
            @click="betType = type"
          >
            {{ type }}
          </button>
        </div>

        <!-- Stake input -->
        <div>
          <label class="text-xs text-[#606060] mb-1.5 block">Stake (TZS)</label>
          <div class="flex gap-2">
            <input
              v-model.number="stakeAmount"
              type="number"
              min="100"
              placeholder="Enter stake"
              :disabled="!isLoggedIn"
              class="flex-1 h-10 px-3 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div class="flex gap-1">
              <button
                v-for="quick in [500, 1000, 5000]"
                :key="quick"
                class="px-2 py-1 rounded-[8px] bg-[#2A2A2A] text-[#A0A0A0] hover:text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isLoggedIn"
                @click="stakeAmount = quick"
              >
                {{ quick >= 1000 ? `${quick/1000}k` : quick }}
              </button>
            </div>
          </div>
          <p v-if="stakeAmount > 0 && stakeAmount < 100" class="text-[#EF4444] text-[10px] mt-1">Minimum stake is TZS 100</p>
        </div>

        <!-- Balance display -->
        <div v-if="isLoggedIn" class="bg-[#1E1E1E] rounded-[10px] px-3 py-2 flex justify-between items-center">
          <span class="text-[#606060] text-xs">Your Balance</span>
          <span class="text-[#A32D2D] font-bold text-sm">TZS {{ formatMoney(userBalance) }}</span>
        </div>

        <!-- Summary -->
        <div class="space-y-1.5 bg-[#1E1E1E] rounded-[10px] px-3 py-2.5">
          <div class="flex justify-between text-xs">
            <span class="text-[#606060]">Total Odds</span>
            <span class="text-white font-semibold">{{ totalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-[#606060]">Potential Win</span>
            <span class="text-[#22C55E] font-semibold">TZS {{ potentialWin.toLocaleString() }}</span>
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
          Place Bet — TZS {{ (stakeAmount || 0).toLocaleString() }}
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

        <p class="text-[10px] text-[#606060] text-center">20% Excise Duty · Must be 18+</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBetSlipStore } from '../../stores/useBetSlipStore'
import AppButton from '../../components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const betSlipStore = useBetSlipStore()

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'place-bet'])

// ---- Local State ----
const stakeAmount = ref(0)
const betType = ref('Single')
const isPlacingBet = ref(false)

// ---- Computed ----
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userBalance = computed(() => authStore.user?.balance || 0)

const totalOdds = computed(() => {
  if (!betSlipStore.items.length) return 1
  return betSlipStore.items.reduce((acc, bet) => acc * (parseFloat(bet.odds) || 1), 1)
})

const potentialWin = computed(() => {
  return Math.round((stakeAmount.value || 0) * totalOdds.value)
})

const isStakeValid = computed(() => stakeAmount.value >= 100)

const hasEnoughBalance = computed(() => {
  if (!isLoggedIn.value) return false
  return userBalance.value >= stakeAmount.value
})

// ---- Methods ----
const formatMoney = (n) => {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0 }).format(n || 0)
}

const handleClearAll = () => {
  betSlipStore.clearAll()
  stakeAmount.value = 0
}

const handleRemoveBet = (index) => {
  betSlipStore.removeBet(index)
}

const handlePlaceBet = async () => {
  // Validate stake
  if (!isStakeValid.value) {
    // You can add toast notification here
    return
  }
  
  // Check balance
  if (!hasEnoughBalance.value) {
    // You can add toast notification here
    return
  }
  
  // Check if there are bets
  if (!betSlipStore.count) {
    // You can add toast notification here
    return
  }
  
  isPlacingBet.value = true
  
  try {
    // Emit place bet event with data
    emit('place-bet', { 
      stake: stakeAmount.value, 
      betType: betType.value,
      bets: betSlipStore.items,
      totalOdds: totalOdds.value,
      potentialWin: potentialWin.value
    })
  } finally {
    isPlacingBet.value = false
  }
}

const handleLoginRedirect = () => {
  emit('close')
  router.push('/auth/login')
}

// ---- Watch for drawer close ----
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    isPlacingBet.value = false
  }
})

// ---- Watch for bet changes ----
watch(() => betSlipStore.items, (newItems) => {
  if (newItems.length === 0) {
    stakeAmount.value = 0
  }
}, { deep: true })

// ---- Expose ----
defineExpose({
  stakeAmount,
  betType,
  totalOdds,
  potentialWin,
  isStakeValid,
  hasEnoughBalance,
  betSlipStore
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
}
</style>