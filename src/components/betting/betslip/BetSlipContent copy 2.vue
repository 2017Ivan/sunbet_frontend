// BetSlipContent.vue 
<template>
  <div class="h-full flex flex-col bg-[#0D0D0D]">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 h-16 border-b border-[#2A2A2A] flex-shrink-0">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="2"/>
        </svg>
        <h2 class="text-base font-semibold text-white">Bet Slip</h2>
  
      </div>
      <div class="flex items-center gap-2">
         <!-- Balance display -->
      <div v-if="isLoggedIn" class="pr-2 py-2 flex justify-between items-center">
        <span class="text-[#A32D2D] font-bold text-xs">TZS {{ formatMoney(userBalance) }}</span>
      </div>

     
        <button
    v-if="showCloseButton"
    class="absolute top-2 -right-0 rounded-full bg-[#1E1E1E] w-5 h-5 flex items-center justify-center text-white hover:text-white transition-colors"
    @click="$emit('close')"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  </button>
      
      </div>
      
      
    </div>

    <!-- Sports / Virtuals Tabs -->
    <div class="flex border-b border-[#2A2A2A] bg-[#111] flex-shrink-0">
      <button
        v-for="tab in ['Sports', 'Virtuals']"
        :key="tab"
        @click="activeTab = tab"
        class="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all relative flex items-center justify-center gap-1.5"
        :class="activeTab === tab ? 'text-white' : 'text-[#606060] hover:text-[#A0A0A0]'"
      >
        <span>{{ tab }}</span>
        <span
          class="px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-colors"
          :class="activeTab === tab ? 'bg-[#A32D2D] text-white' : 'bg-[#1E1E1E] text-[#606060]'"
        >
          {{ tab === 'Sports' ? sportsItems.length : virtualsItems.length }}
        </span>
        <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A32D2D]"></div>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!currentTabItems.length" class="flex-1 flex flex-col items-center justify-center gap-4 px-6">
      <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
        <svg class="w-10 h-10 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="2"/>
        </svg>
      </div>
      <div class="text-center">
        <p class="text-sm font-medium text-[#A0A0A0]">{{ activeTab }} bet slip is empty</p>
        <p class="text-xs text-[#606060] mt-1">Click on odds to add selections</p>
      </div>
      <AppButton variant="outline" size="sm" @click="handleBrowseSports">
        Browse {{ activeTab }}
      </AppButton>
    </div>

    <!-- Bets list -->
    <div v-else class="flex-1 overflow-y-auto py-3 px-4 space-y-2">

    <div class="flex justify-between items-center gap-2 my-4">
    <button
          v-if="currentTabItems.length"
          class="text-xs text-[#606060] hover:text-[#EF4444] transition-colors"
          
        >
        Booking code
        </button>
        <button
          v-if="currentTabItems.length"
          class="text-xs text-[#606060] hover:text-[#EF4444] transition-colors"
          @click="handleClearCurrentTab"
        >
          Clear BetSlip
        </button>
      
      </div>


      <div
        v-for="(bet, index) in currentTabItems"
        :key="bet.matchId || index"
        class="bg-[#1E1E1E] border border-[#2A2A2A] rounded-[12px] p-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-xs text-[#606060] truncate">{{ bet.matchName || bet.match || 'Match' }}</p>
            <p class="text-sm font-semibold text-white mt-0.5 truncate">{{ bet.pick || bet.selection || 'Selection' }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <p class="text-xs text-[#A0A0A0]">{{ bet.market || bet.marketKey || '1X2' }}</p>
              <span v-if="bet.type === 'virtuals'" class="text-[9px] bg-[#A32D2D]/10 text-[#A32D2D] px-1 rounded font-medium">Virtual</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <button
              class="text-[#606060] hover:text-[#EF4444] transition-colors"
              @click="handleRemoveBet(bet)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <span class="text-sm font-bold text-[#A32D2D]">{{ parseFloat(bet.odds).toFixed(2) }}</span>
          </div>
        </div>
      </div>


       <!-- Footer: Summary + Place bet -->
    <div v-if="currentTabItems.length" class="border-t border-[#2A2A2A] px-0 py-2 space-y-3 flex-shrink-0">
    

      <!-- Insufficient balance warning -->
      <div v-if="isLoggedIn && stakeAmount > 0 && !hasEnoughBalance" class="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[10px] p-3">
        <p class="text-xs text-[#EF4444] text-center">
          Insufficient balance! Need TZS {{ formatMoney(stakeAmount) }} but have TZS {{ formatMoney(userBalance) }}
        </p>
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
          
        </div>
        <p v-if="stakeAmount > 0 && stakeAmount < 100" class="text-[#EF4444] text-[10px] mt-1">Minimum stake is TZS 100</p>
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
          <div class="flex justify-between text-xs">
          <span class="text-[#606060]"> Tax 12% </span>
          <span class="text-[#22C55E] font-semibold">TZS {{ tax.toLocaleString() }}</span>
        </div>
          <div class="flex justify-between text-xs">
          <span class="text-[#606060]">Payout</span>
          <span class="text-[#22C55E] font-semibold">TZS {{ payout.toLocaleString() }}</span>
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

      <p class="text-[10px] text-[#606060] text-center">20% Excise Duty · Must be 18+</p>
    </div>
    </div>

   
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/authStore.js'
import { useBetStore } from '../../../stores/bets/betStore.js'
import AppButton from '../../../components/ui/AppButton.vue'

const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'place-bet'])

const router = useRouter()
const authStore = useAuthStore()
const betStore = useBetStore()

// ---- Local State ----
const activeTab = ref('Sports')
const stakeAmount = ref(0)
const betType = ref('Single')
const isPlacingBet = ref(false)

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
}

const handleRemoveBet = (bet) => {
  betStore.removeFromSlip(bet.matchId, bet.marketKey)
  if (currentTabItems.value.length === 0) {
    stakeAmount.value = 0
  }
}

const handlePlaceBet = async () => {
  if (!isStakeValid.value || !hasEnoughBalance.value || !currentTabItems.value.length) return
  
  isPlacingBet.value = true
  
  try {
    betStore.updateStake(stakeAmount.value)
    const result = await betStore.placeBetWithBackend()
    
    if (result.success) {
      emit('place-bet', { 
        success: true,
        stake: stakeAmount.value, 
        betType: betType.value,
        category: activeTab.value.toLowerCase(),
        bets: currentTabItems.value,
        totalOdds: totalOdds.value,
        potentialWin: potentialWin.value,
        data: result.data
      })
      
      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      console.error('Bet placement failed:', result.error)
    }
  } catch (error) {
    console.error('Error placing bet:', error)
  } finally {
    isPlacingBet.value = false
  }
}

const handleLoginRedirect = () => {
  emit('close')
  router.push('/auth/login')
}

// ---- Watchers ----
watch(currentTabItems, (newItems) => {
  if (newItems.length === 0) {
    stakeAmount.value = 0
  }
}, { deep: true })

watch(stakeAmount, (newVal) => {
  betStore.updateStake(newVal || 0)
})

// Set initial stake
watch(() => currentTabItems.value.length, (newLength) => {
  if (newLength > 0 && stakeAmount.value === 0) {
    stakeAmount.value = betStore.stake || 100
  }
}, { immediate: true })
</script>

<style scoped>
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