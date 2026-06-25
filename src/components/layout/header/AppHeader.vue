<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2A2A2A]">
    <div class="max-w-screen-2xl mx-auto px-4">
      
      <!-- ROW 1: Logo + Actions -->
      <div class="flex items-center justify-between h-14">
        <!-- Left: Logo + Hamburger -->
        <div class="flex items-center gap-3">
          <!-- Hamburger (mobile only) -->
          <button
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#1E1E1E] text-[#A0A0A0] hover:text-white transition-colors"
            @click="$emit('toggle-sidebar')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-1 select-none">
            <div class="hidden md:flex w-8 h-8 rounded-[8px] bg-[#A32D2D]  items-center justify-center shadow-[0_4px_12px_rgba(163,45,45,0.4)]">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="font-bold text-lg tracking-tight">
              <span class="text-white">Sun</span><span class="text-[#A32D2D]">Bet</span>
            </span>
          </RouterLink>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <!-- Live indicator -->
          <RouterLink
            to="/live"
            class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/25 text-[#FF3B3B] text-xs font-semibold hover:bg-[#FF3B3B]/20 transition-colors"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
            LIVE
          </RouterLink>

          <!-- Guest buttons (NOT Logged In) -->
          <template v-if="!isLoggedIn">
            <RouterLink 
              to="/auth/login" 
              class="px-3 py-1.5 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
            >
              Login
            </RouterLink>
            <RouterLink 
              to="/auth/register" 
              class="px-4 py-1.5 rounded-[8px] bg-[#A32D2D] text-white text-sm font-semibold hover:bg-[#7A1F1F] transition-colors"
            >
              Register
            </RouterLink>
          </template>

          <!-- Logged in: Balance + Avatar -->
          <template v-else>
            <!-- Balance Chip -->
            <!-- Balance Chip - Always visible, responsive size -->
<RouterLink
  to="/wallet"
  class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[8px] sm:rounded-[10px] bg-[#1E1E1E] border border-[#A32D2D]/40 hover:border-[#A32D2D] transition-colors"
>
  <!-- <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A32D2D]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5     a2 2 0 012-2h14a2 2 0 012 2v1"/>
    <path d="M17 12h4v4h-4a2 2 0 010-4z"/>
  </svg> -->
  <span class="text-[10px] text-[#606060] font-medium  xs:inline">TZS</span>
  <span class="text-xs sm:text-sm font-bold text-[#A32D2D]">{{ formattedBalance }}</span>
</RouterLink>

            <!-- Avatar -->
            <div class="relative" ref="avatarRef">
              <button
                class="w-9 h-9 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-white font-bold text-sm border-2 border-[#A32D2D]/30 hover:border-[#A32D2D] transition-colors"
                @click="dropdownOpen = !dropdownOpen"
              >
                <!-- {{ userInitials }} -->
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
                    <!-- <p class="text-sm font-semibold text-white">{{ user?.name }}</p> -->
                    <p class="text-xs text-[#606060] mt-0.5">{{ user?.phone || user?.email }}</p>
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

      <!-- ROW 2: Navigation Links (scrollable on mobile, centered on desktop) -->
      <nav class="flex items-center border-t border-gray-800 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div class="flex items-center justify-center gap-1 px-4 w-full min-w-max py-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2 px-4 py-1.5  text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
            :class="$route.name === link.name
              ? 'bg-red-900/20 text-red-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'"
          >
            <component :is="link.icon" class="w-4 h-4" />
            {{ link.label }}
            <span
              v-if="link.badge"
              class="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-red-600 text-white"
            >
              {{ link.badge }}
            </span>
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const props = defineProps({
  isLoggedIn:   { type: Boolean, default: false },
  user:         { type: Object, default: null },
  balance:      { type: Number, default: 0 },
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

const router = useRouter()
const route  = useRoute()

// Icon components
const HomeIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
}
const SportsIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>`
}
const LiveIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14"/></svg>`
}
const PromoIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`
}
const VipIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
}
const DashIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
}
const WalletIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/><path d="M17 12h4v4h-4a2 2 0 010-4z"/></svg>`
}
const BetsIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>`
}

// Nav links
const navLinks = [
  { to: '/',           name: 'home',        label: 'Home',     icon: HomeIcon },
  { to: '/sports',     name: 'sports',      label: 'Sports',   icon: SportsIcon },
  { to: '/live',       name: 'live',        label: 'Live',     icon: LiveIcon,   badge: 'LIVE' },
  { to: '/promotions', name: 'promotions',  label: 'Promos',   icon: PromoIcon },
  { to: '/leaderboard',name: 'leaderboard', label: 'VIP',      icon: VipIcon },
]

const dropdownItems = [
  { to: '/dashboard', label: 'My Dashboard', icon: DashIcon },
  { to: '/wallet',    label: 'Wallet',        icon: WalletIcon },
  { to: '/my-bets',   label: 'My Bets',       icon: BetsIcon },
]

const dropdownOpen = ref(false)
const avatarRef    = ref(null)

const userInitials = computed(() => {
  if (!props.user?.name) return 'U'
  return props.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const formattedBalance = computed(() => {
  return new Intl.NumberFormat('en-TZ', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(props.balance)
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
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

/* Hide scrollbar for Chrome/Safari */
nav::-webkit-scrollbar {
  display: none;
}
</style>