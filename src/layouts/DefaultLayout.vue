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
      @toggle-betslip="betSlipOpen = !betSlipOpen"
    />
    <Footer/>

  </div>
</template>

<script setup>
import { ref, onMounted }    from 'vue'
import { storeToRefs }       from 'pinia'
import AppHeader             from '../components/layout/header/AppHeader.vue'
import AppSidebar            from '../components/layout/AppSidebar.vue'
import BottomNav             from '../components/layout/BottomNav.vue'
import BetSlipDrawer         from '../components/layout/BetSlipDrawer.vue'
import { useAuthStore }      from '../stores/useAuthStore'
import { useWalletStore }    from '../stores/useWalletStore'
import { useBetSlipStore }   from '../stores/useBetSlipStore'
import Footer from '../components/layout/footer/Footer.vue'

// ---- Stores ----
const authStore    = useAuthStore()
const walletStore  = useWalletStore()
const betSlipStore = useBetSlipStore()

// ---- Reactive state kutoka authStore ----
const { isLoggedIn, user, balance } = storeToRefs(authStore)

// ---- Local UI state ----
const sidebarOpen = ref(false)
const betSlipOpen = ref(false)

// ---- On mount: fetch user + transactions ----
onMounted(async () => {
  await authStore.fetchMe()
  if (authStore.isLoggedIn) {
    await walletStore.fetchTransactions()
  }
})

// ---- Actions ----
const handleLogout = () => {
  sidebarOpen.value = false
  betSlipOpen.value = false
  authStore.logout()
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