<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">

    <!-- Header (Sasa hivi urefu wake ni ~92px kutokana na Row 2) -->
    <AppHeader
      :is-logged-in="isLoggedIn"
      :user="user"
      :balance="balance"
      :bet-slip-count="betSlipStore.count"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @toggle-betslip="betSlipOpen = !betSlipOpen"
      @logout="handleLogout"
    />

    <!-- Sidebar (mobile only) -->
    <AppSidebar
      :open="sidebarOpen"
      :is-logged-in="isLoggedIn"
      :user="user"
      :balance="balance"
      @close="sidebarOpen = false"
      @logout="handleLogout"
    />

    <!-- 
      MAIN CONTAINER 
      Nimetumia pt-[100px] ili kutoa nafasi ya kutosha kwa ajili ya Hero Carousel isijifiche!
    -->
    <main class="pt-[104px] flex-1 w-full  mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full relative">
        
        <!-- Left Side: Kurasa zote (HomePage, SportsLobby nk) -->
        <div class="lg:col-span-8 xl:col-span-9 min-w-0">
          <RouterView v-slot="{ Component, route }">
            <Transition name="page" mode="out-in">
              <component :is="Component" :key="route.path" />
            </Transition>
          </RouterView>
        </div>

        <!-- Right Side: Permanent Desktop Bet Slip -->
        <!-- Inakuwa 'sticky' chini ya header, inaonekana kuanzia lg screen kwenda juu -->
        <aside class="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-[110px] max-h-[calc(100vh-140px)] overflow-y-auto bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
          <div class="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-4">
            <h3 class="font-bold text-sm tracking-wide text-white uppercase flex items-center gap-2">
              <svg class="w-4 h-4 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
              Betslip ({{ betSlipStore.count }})
            </h3>
            <button 
              v-if="betSlipStore.count > 0"
              @click="betSlipStore.clearAll()" 
              class="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>

          <!-- Sehemu ya ku-render BetSlip Drawer content ikiwa kwenye desktop -->
          <div v-if="betSlipStore.count === 0" class="py-12 text-center text-gray-500 text-xs">
            <p>Your betslip is empty.</p>
            <p class="mt-1">Select odds from any match to add a bet.</p>
          </div>
          
          <div v-else class="flex flex-col gap-3">
            <!-- 
              Hapa unaweza ku-import component ya list ya betslip yako moja kwa moja 
              au ku-pass data kwenda kwenye `BetSlipDrawer` lakini ukiivua ile modal/drawer element.
            -->
            <div v-for="(bet, index) in betSlipStore.items" :key="index" class="p-3 bg-[#141414] rounded-lg border border-[#2A2A2A] text-xs">
              <div class="flex justify-between items-start">
                <p class="font-semibold text-white">{{ bet.selection }}</p>
                <button @click="betSlipStore.removeBet(index)" class="text-gray-500 hover:text-red-400">×</button>
              </div>
              <p class="text-gray-400 mt-0.5">{{ bet.match }}</p>
              <div class="flex justify-between items-center mt-2 pt-2 border-t border-[#2A2A2A]">
                <span class="text-gray-500">Odds:</span>
                <span class="font-bold text-[#A32D2D]">{{ bet.odds }}</span>
              </div>
            </div>


            <!-- Mfano wa sehemu ya kuweka dau (Stake Box) -->
            <div class="mt-4 pt-4 border-t border-[#2A2A2A] space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Total Odds</span>
                <span class="font-bold text-white">2.45</span>
              </div>
              <button @click="handlePlaceBet" class="w-full py-2.5 bg-[#A32D2D] hover:bg-[#7A1F1F] text-white font-bold text-sm rounded-lg transition-colors">
                Place Bet
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>

    <!-- Mobile-only Bet Slip Drawer (Inafanya kazi kwenye simu tu sasa hivi) -->
    <BetSlipDrawer
      class="lg:hidden"
      :open="betSlipOpen"
      :bets="betSlipStore.items"
      @close="betSlipOpen = false"
      @clear-all="betSlipStore.clearAll()"
      @remove-bet="(i) => betSlipStore.removeBet(i)"
      @place-bet="handlePlaceBet"
    />

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
import { useAuthStore }      from '../stores/authStore.js'
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