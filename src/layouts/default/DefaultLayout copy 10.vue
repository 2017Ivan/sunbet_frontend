<!-- DefaultLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-950 px-0 lg:px-45">
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

      <!-- Main Content Area -->
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row">
          <!-- Main Content - Left Side -->
          <div class="flex-1 min-w-0 flex flex-col">
            <div class="flex-1">
              <slot name="main">
                <router-view></router-view>
              </slot>
            </div>
            
            <div class="lg:pb-0">
              <Footer />
            </div>
          </div>

          <!-- Right Sidebar - Desktop only (Fixed/Sticky) -->
          <div class="hidden lg:block flex-shrink-0 bg-gray-800 border-l border-gray-700 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto"
               :class="sidebarWidthClass">
            <slot name="sidebar">
              <!-- Desktop Bet Slip -->
              <BetSlip mode="desktop" />
            </slot>
          </div>
        </div>
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
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'
import { useBetStore } from '../../stores/bets/betStore.js'
import Header from '../../components/main components/header/Header.vue'
import Footer from '../../components/main components/footer/Footer.vue'
import BottomNav from '../../components/main components/BottomNav/BottomNav.vue'
import BetSlip from '../../components/betting/betslip/BetSlip.vue'
import MobileSidebar from '../../components/main components/MobileSidebar/MobileSidebar.vue'
import DefaultLayoutSkeleton from '../../components/skeletons/default/DefaultLayoutSkeleton.vue'

const authStore = useAuthStore()
const betStore = useBetStore()

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
const isBetSlipOpen = ref(false)
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
</script>

<style scoped>
/* Custom styles */
</style>