<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- Header -->
      <AppHeader
        :is-logged-in="isLoggedIn"
        :user="user"
        :balance="balance"
        :bet-slip-count="betSlipStore.count"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-betslip="betSlipOpen = !betSlipOpen"
        @logout="handleLogout"
      />
  
      <!-- Sidebar (mobile) -->
      <AppSidebar
        :open="sidebarOpen"
        :is-logged-in="isLoggedIn"
        :user="user"
        :balance="balance"
        @close="sidebarOpen = false"
        @logout="handleLogout"
      />
  
      <!-- Bet Slip Drawer -->
      <BetSlipDrawer
        :open="betSlipOpen"
        :bets="betSlipStore.items"
        @close="betSlipOpen = false"
        @clear-all="betSlipStore.clearAll()"
        @remove-bet="(i) => betSlipStore.removeBet(i)"
        @place-bet="handlePlaceBet"
      />
  
      <!-- Main content -->
      <main class="pt-16 pb-20 lg:pb-0 min-h-screen">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
  
      <!-- Bottom Nav (mobile) -->
      <BottomNav
        :bet-slip-count="betSlipStore.count"
        :live-count="12"
      />
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AppHeader      from '../components/layout/AppHeader.vue'
  import AppSidebar     from '../components/layout/AppSidebar.vue'
  import BottomNav      from '../components/layout/BottomNav.vue'
  import BetSlipDrawer  from '../components/layout/BetSlipDrawer.vue'
  import { useBetSlipStore } from '../stores/useBetSlipStore'
  
  const router       = useRouter()
  const betSlipStore = useBetSlipStore()
  
  const sidebarOpen = ref(false)
  const betSlipOpen = ref(false)
  
  // Fake auth — baadaye uunganishe na useAuthStore
  const isLoggedIn = ref(!!localStorage.getItem('sunbet_token'))
  const user       = ref(isLoggedIn.value ? { name: 'Hissa Azam', phone: '+255 712 345 678' } : null)
  const balance    = ref(isLoggedIn.value ? 125000 : 0)
  
  const handleLogout = () => {
    localStorage.removeItem('sunbet_token')
    isLoggedIn.value = false
    user.value       = null
    balance.value    = 0
    router.push('/')
  }
  
  const handlePlaceBet = ({ stake, betType }) => {
    console.log('Placing bet:', { stake, betType, bets: betSlipStore.items })
    betSlipStore.clearAll()
    betSlipOpen.value = false
  }
  </script>
  
  <style scoped>
  .page-enter-active, .page-leave-active {
    transition: all 0.2s ease;
  }
  .page-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .page-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
  </style>