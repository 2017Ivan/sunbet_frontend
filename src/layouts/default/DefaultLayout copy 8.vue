<template>
  <div class="min-h-screen bg-white lg:px-47">
    <!-- Header - Pitisha auth props -->
    <Header 
      :is-logged-in="isLoggedIn"
      :user="user"
      :balance="balance"
      @toggle-sidebar="toggleMobileSidebar"
      @logout="handleLogout"
    />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row">
        <!-- Main Content - Left Side (Scrollable) -->
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex-1">
            <slot name="main">
              <router-view></router-view>
            </slot>
          </div>
          
          <!-- Footer -->
          <div class="lg:pb-0">
            <Footer />
          </div>
        </div>

        <!-- Right Sidebar - Desktop only (Fixed/Sticky) -->
        <div class="hidden lg:block  sm:w-full   flex-shrink-0 bg-gray-800 border-l border-[#2A2A2A] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto" :class="sidebarWidthClass">
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

    <!-- Mobile Sidebar - Pitisha auth props -->
    <MobileSidebar
      :open="isMobileSidebarOpen"
      :is-logged-in="isLoggedIn"
      :user="user"
      :balance="balance"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'
import { useBetStore } from '../../stores/bets/betStore.js'
import Header from '../../components/main components/header/Header.vue'
import Footer from '../../components/main components/footer/Footer.vue'
import BottomNav from '../../components/main components/BottomNav/BottomNav.vue'
import BetSlip from '../../components/betting/betslip/BetSlip.vue'
import MobileSidebar from '../../components/main components/MobileSidebar/MobileSidebar.vue'

const authStore = useAuthStore()
const betStore = useBetStore()

// 👇 Auth state - computed from store
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const balance = computed(() => authStore.user?.balance || 0)


const sidebarWidthClass = computed(() => {
  // Using Tailwind's responsive classes
  return 'w-full lg:w-[320px] xl:w-[380px] 2xl:w-[450px]'
})


// Bet slip drawer state (mobile only)
const isBetSlipOpen = ref(false)

// Mobile sidebar state
const isMobileSidebarOpen = ref(false)

// Computed
const betSlipCount = computed(() => betStore.slipCount)
const myBetsCount = ref(0) // Replace with actual store

// Methods
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
}

const handleLogout = () => {
  authStore.logout()
  closeMobileSidebar()
}
</script>

<style scoped>
/* Custom styles if needed */
</style>