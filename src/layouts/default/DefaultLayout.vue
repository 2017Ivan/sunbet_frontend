<!-- DefaultLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-950">
    <!-- Loading State -->
    <DefaultLayoutSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <!-- Header -->
      <Header 
        :is-logged-in="isLoggedIn"
        :user="user"
        :balance="userBalance"
        @toggle-sidebar="toggleMobileSidebar"
        @logout="handleLogout"
      />

      <!-- Main Content Area (left padding reserved for fixed sidebar) -->
      <div class="max-w-7xl mx-auto w-full lg:pr-[300px] xl:pr-[360px] 2xl:pr-[420px]">
        <!-- Main Content - shrinks/expands to fit the page content -->
        <slot name="main">
          <router-view></router-view>
        </slot>

        <Footer />
      </div>

      <!-- Right Sidebar - Desktop only (fixed, aligned with centered container) -->
      <div
        class="hidden lg:block lg:fixed lg:top-14 lg:right-[max(0px,calc((100vw-80rem)/2))] lg:h-[calc(100vh-3.5rem)] bg-gray-800 border-l border-gray-700 overflow-y-auto"
        :class="sidebarWidthClass"
      >
        <slot name="sidebar">
          <!-- Desktop Bet Slip -->
          <BetSlip mode="desktop" />
        </slot>
      </div>

      <!-- Bottom Navigation - Mobile only -->
      <BottomNav 
        :bet-slip-count="betSlipCount"
        :my-bets-count="myBetsCount"
        @toggle-betslip="toggleBetSlip"
      />

      <!-- Mobile Sidebar -->
      <MobileSidebar
        :open="isMobileSidebarOpen"
        :is-logged-in="isLoggedIn"
        :user="user"
        :balance="userBalance"
        @close="closeMobileSidebar"
        @logout="handleLogout"
      />

      <!-- Bet Slip Drawer - Mobile only -->
      <BetSlip 
        mode="drawer"
        :open="isBetSlipOpen"
        @close="closeBetSlip"
        @place-bet="handlePlaceBet"
      />

      <!-- Win Celebration (appears on first login when a bet won while away) -->
      <WinCelebrationModal v-if="currentCelebrationWin" :win="currentCelebrationWin" @close="dismissWin" />

      <!-- Daily Login Reward (after win celebration queue, only if claimable) -->
      <DailyRewardModal
        v-if="showDailyRewardModal && dailyRewardStatus"
        :status="dailyRewardStatus"
        @close="dismissDailyReward"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'
import { useBetStore } from '../../stores/bet/betStore.js'
import Header from '../../components/main components/header/Header.vue'
import Footer from '../../components/main components/footer/Footer.vue'
import BottomNav from '../../components/main components/BottomNav/BottomNav.vue'
import BetSlip from '../../components/betting/betslip/BetSlip.vue'
import MobileSidebar from '../../components/main components/MobileSidebar/MobileSidebar.vue'
import DefaultLayoutSkeleton from '../../components/skeletons/default/DefaultLayoutSkeleton.vue'
import WinCelebrationModal from '../../components/bet/WinCelebrationModal.vue'
import DailyRewardModal from '../../components/reward/DailyRewardModal.vue'

const authStore = useAuthStore()
const betStore = useBetStore()

// ---- Bet Slip state ----
const isBetSlipOpen = ref(false)

// ---- Loading State ----
const isLoading = ref(true)

// ---- Auth state ----
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const userBalance = computed(() => {
  const balance = authStore.user?.balance
  if (typeof balance === 'string') {
    return parseFloat(balance) || 0
  }
  return balance || 0
})

// ---- Bet Slip state ----
const isMobileSidebarOpen = ref(false)
const betSlipCount = computed(() => betStore.slipCount)

const myBetsCount = computed(() => {
  if (!betStore.userBets || betStore.userBets.length === 0) return 0
  
  return betStore.userBets.filter(b => {
    const status = (b.status || '').toUpperCase()
    return status === 'OPEN' || status === 'PENDING'
  }).length
})

// ---- Sidebar width ----
const sidebarWidthClass = computed(() => {
  return 'w-full lg:w-[300px] xl:w-[360px] 2xl:w-[420px]'
})

// ---- Methods ----
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const toggleBetSlip = () => {
  isBetSlipOpen.value = !isBetSlipOpen.value
}

const closeBetSlip = () => {
  isBetSlipOpen.value = false
}

const handlePlaceBet = (data) => {
  console.log('Bet placed:', data)
  // Handle bet placement result
}

const handleLogout = () => {
  authStore.logout()
  closeMobileSidebar()
}

// ---- Simulate loading ----
onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

// ---- Win Celebration ----
const currentCelebrationWin = ref(null)

const showNextCelebration = () => {
  const wins = Array.isArray(betStore.winNotifications) ? betStore.winNotifications : []
  currentCelebrationWin.value = wins.length > 0 ? wins[0] : null
}

const dismissWin = async () => {
  const win = currentCelebrationWin.value
  currentCelebrationWin.value = null
  if (win) {
    await betStore.acknowledgeWin(win.id)
  }
  showNextCelebration()
  if (!currentCelebrationWin.value && showDailyRewardStatus.value === 'QUEUED') {
    await showDailyRewardIfClaimable()
  }
}

watch(
  () => authStore.isLoggedIn,
  async (loggedIn) => {
    if (loggedIn) {
      await betStore.fetchWinNotifications()
      showNextCelebration()
      if (!currentCelebrationWin.value) {
        await showDailyRewardIfClaimable()
      } else {
        showDailyRewardStatus.value = 'QUEUED'
      }
    } else {
      currentCelebrationWin.value = null
      showDailyRewardModal.value = false
    }
  },
  { immediate: true }
)

// ---- Daily Login Reward ----
const dailyRewardStatus = ref(null)
const showDailyRewardModal = ref(false)
const showDailyRewardStatus = ref('IDLE')

const showDailyRewardIfClaimable = async () => {
  const status = await authStore.fetchDailyRewardStatus(true)
  dailyRewardStatus.value = status
  if (status && status.can_claim && !status.claimed_today) {
    showDailyRewardModal.value = true
  }
}

const dismissDailyReward = async () => {
  showDailyRewardModal.value = false
  dailyRewardStatus.value = await authStore.fetchDailyRewardStatus(true)
}
</script>

<style scoped>
/* Hide scrollbar for all elements */
:global(*::-webkit-scrollbar) {
  width: 0px;
  height: 0px;
  background: transparent;
}

:global(*::-webkit-scrollbar-track) {
  background: transparent;
}

:global(*::-webkit-scrollbar-thumb) {
  background: transparent;
}

/* For Firefox */
:global(*) {
  scrollbar-width: none;
}

/* For IE and Edge */
:global(*) {
  -ms-overflow-style: none;
}
</style>