<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide-left">
    <div
      v-if="open"
      class="fixed top-0 left-0 z-50 h-full w-[280px] bg-[#0D0D0D] border-r border-[#2A2A2A] flex flex-col shadow-[8px_0_40px_rgba(0,0,0,0.6)] lg:hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 h-16 border-b border-[#2A2A2A] flex-shrink-0">
        <RouterLink to="/" class="flex items-center gap-2" @click="$emit('close')">
          <div class="w-8 h-8 rounded-[8px] bg-[#A32D2D] flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="font-bold text-lg">
            <span class="text-white">Sun</span><span class="text-[#A32D2D]">Bet</span>
          </span>
        </RouterLink>
        <button
          class="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#606060] hover:text-white transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- User Info (if logged in) -->
      <div v-if="isLoggedIn" class="px-4 py-3 border-b border-[#2A2A2A]">
        <p class="text-sm font-semibold text-white">{{ user?.name || user?.phone_number || 'User' }}</p>
        <p class="text-xs text-[#606060]">Balance: TZS {{ formattedBalance }}</p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto py-2">
        <RouterLink
          v-for="link in menuLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] transition-colors"
          :class="$route.name === link.name ? 'text-white bg-[#2A2A2A] border-r-2 border-[#A32D2D]' : ''"
          @click="$emit('close')"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.label }}
          <span
            v-if="link.badge"
            class="ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#A32D2D] text-white"
          >
            {{ link.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- Footer - Auth Buttons -->
      <div class="border-t border-[#2A2A2A] p-4 flex-shrink-0">
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/auth/login"
            class="w-full block text-center py-2.5 text-sm font-semibold text-white bg-[#A32D2D] rounded-[10px] hover:bg-[#7A1F1F] transition-colors"
            @click="$emit('close')"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="w-full block text-center py-2.5 text-sm font-semibold text-[#A0A0A0] hover:text-white transition-colors mt-2"
            @click="$emit('close')"
          >
            Register
          </RouterLink>
        </template>
        <button
          v-else
          class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#EF4444] hover:bg-[#2A2A2A] rounded-[10px] transition-colors"
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
</template>

<script setup>
import { computed, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  open: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  user: { type: Object, default: null },
  balance: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'logout'])

const route = useRoute()

// Icons
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

const DashboardIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '3', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '14', width: '7', height: '7' }),
    h('rect', { x: '3', y: '14', width: '7', height: '7' })
  ])
}

const BetsIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' }),
    h('rect', { x: '9', y: '3', width: '6', height: '4', rx: '2' }),
    h('path', { d: 'M9 12h6M9 16h4' })
  ])
}

const ProfileIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '8', r: '3.8' }),
    h('path', { d: 'M4.5 20c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5' })
  ])
}

const menuLinks = [
  { to: '/', name: 'home', label: 'Home', icon: HomeIcon },
  { to: '/sports', name: 'sports', label: 'Sports', icon: SportsIcon },
  { to: '/sports', name: 'live', label: 'Live', icon: LiveIcon, badge: 'LIVE' },
  { to: '/promotions', name: 'promotions', label: 'Promos', icon: PromoIcon },
  { to: '/leaderboard', name: 'leaderboard', label: 'VIP', icon: VipIcon },
  { to: '/dashboard', name: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/bets', name: 'bets', label: 'My Bets', icon: BetsIcon },
  { to: '/profile', name: 'profile', label: 'Profile', icon: ProfileIcon },
]

const formattedBalance = computed(() => {
  const bal = props.balance || 0
  return new Intl.NumberFormat('en-TZ', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(bal)
})

const handleLogout = () => {
  emit('logout')
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

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