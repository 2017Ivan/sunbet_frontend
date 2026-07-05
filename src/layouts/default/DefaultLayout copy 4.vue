<template>
  <div class="min-h-screen bg-white lg:px-45">
    <!-- Header -->
    <Header />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row">
        <!-- Main Content - Left Side -->
        <div class="flex-1 min-w-0">
          <slot name="main">
            <router-view></router-view>
          </slot>
        </div>

        <!-- Right Sidebar - Desktop only -->
        <div class="hidden lg:block w-[350px] flex-shrink-0 bg-[#0D0D0D] border-l border-[#2A2A2A] min-h-screen">
          <slot name="sidebar">
            <!-- Desktop Bet Slip -->
            <BetSlip mode="desktop" />
          </slot>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pb-[50px] lg:pb-0">
      <Footer />
    </div>

    <!-- Bottom Navigation - Mobile only -->
    <BottomNav 
      :bet-slip-count="betSlipCount"
      :my-bets-count="myBetsCount"
      @toggle-betslip="toggleBetSlip"
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
import { useBetStore } from '../../stores/bets/betStore.js'
import Header from '../../components/main components/header/Header.vue'
import Footer from '../../components/main components/footer/Footer.vue'
import BottomNav from '../../components/main components/BottomNav/BottomNav.vue'
import BetSlip from '../../components/betting/betslip/BetSlip.vue'

const betStore = useBetStore()

// Bet slip drawer state (mobile only)
const isBetSlipOpen = ref(false)

// Computed
const betSlipCount = computed(() => betStore.slipCount)
const myBetsCount = ref(0) // Replace with actual store

// Methods
const toggleBetSlip = () => {
  isBetSlipOpen.value = !isBetSlipOpen.value
}

const closeBetSlip = () => {
  isBetSlipOpen.value = false
}

const handlePlaceBet = (data) => {
  console.log('Bet placed:', data)
}
</script>

<style scoped>
/* Custom styles if needed */
</style>