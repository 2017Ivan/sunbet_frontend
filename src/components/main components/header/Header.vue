<template>
  <header class="bg-rose-700 shadow-lg sticky top-0 z-50 max-w-7xl mx-auto">
    <!-- ROW 1: Logo + User Actions -->
    <div class="flex items-center justify-between mx-auto px-1 h-14 bg-gradient-to-r from-rose-900 to-rose-950 border-b border-rose-800">
      <div class="flex items-center gap-1">
        <!-- Hamburger (mobile only) -->
        <button
          class="lg:hidden flex items-center justify-center rounded-[10px] bg-transparent text-gray-400 hover:text-white transition-colors"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-1 select-none">
          <div class="hidden md:flex w-8 h-8 rounded-[8px] bg-[#A32D2D] items-center justify-center shadow-[0_4px_12px_rgba(163,45,45,0.4)]">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="font-bold text-lg tracking-tight">
            <span class="text-white">Sun</span><span class="text-rose-600">Bet</span>
          </span>
        </RouterLink>
      </div>

      <div class="flex items-center">
        <!-- Live indicator -->
        <RouterLink
          to="/live"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/25 text-[#FF3B3B] text-xs font-semibold hover:bg-[#FF3B3B]/20 transition-colors"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
          LIVE
        </RouterLink>

        <button 
          @click="toggleSearch" 
          class="text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 p-1.5"
          :class="{ 'bg-transparent text-white': isSearchOpen }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- Guest buttons (NOT Logged In) -->
        <template v-if="!isLoggedIn">
          <RouterLink 
            to="/login" 
            class="px-2 py-1.5 text-sm font-bold text-gray-200 hover:text-white transition-colors"
          >
            Login
          </RouterLink>
          <RouterLink 
            to="/register" 
            class="px-2 py-1.5 rounded-[6px] bg-[#A32D2D] text-white text-sm font-semibold hover:bg-[#7A1F1F] transition-colors"
          >
            Register
          </RouterLink>
        </template>

        <!-- Logged in: Balance + Avatar -->
        <template v-else>
          <!-- Balance Chip -->
          <RouterLink
            to="/wallet"
            class="flex items-center gap-1  px-2  py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] bg-gray-950/40 border border-[#A32D2D]/40 hover:border-[#A32D2D] transition-colors"
          >
            <span class="text-[9px] text-gray-300 font-medium xs:inline">TZS</span>
            <span class="text-xs font-bold text-[#D23434]">{{ formattedBalance }}</span>
          </RouterLink>

          <!-- Avatar -->
          <div class="relative ml-1" ref="avatarRef">
            <button
              class="w-7 h-7 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-white font-bold text-sm border-2 border-[#A32D2D]/30 hover:border-[#A32D2D] transition-colors"
              @click="dropdownOpen = !dropdownOpen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-12 w-52 bg-[#1E1E1E] border border-[#2A2A2A] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden py-1"
              >
                <div class="px-4 py-3 border-b border-[#2A2A2A]">
                  <p class="text-xs text-[#606060] mt-0.5">{{ user?.phone_number || user?.phone || user?.email || 'User' }}</p>
                </div>

                <RouterLink
                  v-for="item in dropdownItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] transition-colors"
                  @click="dropdownOpen = false"
                >
                  <component :is="item.icon" class="w-4 h-4" />
                  {{ item.label }}
                </RouterLink>

                <div class="border-t border-[#2A2A2A] mt-1">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#2A2A2A] transition-colors"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>
      </div>
    </div>

    <!-- ROW 2: Search Bar -->
    <div 
      v-show="isSearchOpen"
      class="py-2 sm:py-3 transition-all duration-300 max-w-7xl mx-auto px-2  bg-rose-950"
      :class="{ 'animate-slide-down': isSearchOpen }"
    >
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="flex-1 relative min-w-0">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search games, teams..." 
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white text-rose-950 placeholder-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
            @keyup.enter="performSearch"
            autofocus
          />
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-white transition-colors duration-200"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button 
          @click="performSearch"
          class="px-3 py-2 bg-rose-950 border-2 border-gray-200 cursor-pointer hover:bg-rose-600 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/25 flex items-center justify-center space-x-1 sm:space-x-2 whitespace-nowrap"
        >
          <span class="text-xs sm:text-sm uppercase">Search</span>
        </button>
      </div>

      <div v-if="searchQuery.length > 0" class="mt-2 sm:mt-3 space-y-1">
        <div class="text-xs text-rose-300 px-2">Recent Searches</div>
        <div class="flex flex-wrap gap-1 sm:gap-2">
          <span 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            @click="searchQuery = suggestion"
            class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-rose-200 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-all duration-200"
          >
            {{ suggestion }}
          </span>
        </div>
      </div>
    </div>

   
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  isLoggedIn: { type: Boolean, default: false },
  user: { type: Object, default: null },
  balance: { type: Number, default: 0 },
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

const route = useRoute()

// ---- Search State ----
const isSearchOpen = ref(false)
const searchQuery = ref('')
const suggestions = ref([
  'Manchester United',
  'Real Madrid',
  'Liverpool vs Arsenal',
  'NBA Playoffs',
  'Tennis US Open'
])

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value) {
    searchQuery.value = ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    alert(`Searching for: ${searchQuery.value}`)
  }
}

// ---- Icons ----
const HomeIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
    h('polyline', { points: '9 22 9 12 15 12 15 22' })
  ])
}

const SportsIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('path', { d: 'M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24' })
  ])
}

const LiveIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '2' }),
    h('path', { d: 'M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14' })
  ])
}

const PromoIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z' }),
    h('line', { x1: '7', y1: '7', x2: '7.01', y2: '7' })
  ])
}

const VipIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
  ])
}

const DashIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '3', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '14', width: '7', height: '7' }),
    h('rect', { x: '3', y: '14', width: '7', height: '7' })
  ])
}

const WalletIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1' }),
    h('path', { d: 'M17 12h4v4h-4a2 2 0 010-4z' })
  ])
}

const BetsIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' }),
    h('rect', { x: '9', y: '3', width: '6', height: '4', rx: '2' }),
    h('path', { d: 'M9 12h6M9 16h4' })
  ])
}

// ---- Nav Links ----
const navLinks = [
  { to: '/', name: 'home', label: 'Home', icon: HomeIcon },
  { to: '/sports', name: 'sports', label: 'Sports', icon: SportsIcon },
  { to: '/sports/live', name: 'live', label: 'Live', icon: LiveIcon, badge: 'LIVE' },
  { to: '/promotions', name: 'promotions', label: 'Promos', icon: PromoIcon },
  { to: '/leaderboard', name: 'leaderboard', label: 'VIP', icon: VipIcon },
]

const dropdownItems = [
  { to: '/profile', label: 'My Dashboard', icon: DashIcon },
  { to: '/profile', label: 'Wallet', icon: WalletIcon },
  { to: '/bets', label: 'My Bets', icon: BetsIcon },
]

// ---- Dropdown ----
const dropdownOpen = ref(false)
const avatarRef = ref(null)

const formattedBalance = computed(() => {
  const bal = props.balance || 0.00
  return new Intl.NumberFormat('en-TZ', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(bal)
})

const handleLogout = () => {
  dropdownOpen.value = false
  emit('logout')
}

const handleClickOutside = (e) => {
  if (avatarRef.value && !avatarRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
</style>