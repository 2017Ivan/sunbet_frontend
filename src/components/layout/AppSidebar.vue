<template>
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        @click="$emit('close')"
      />
    </Transition>
  
    <!-- Sidebar -->
    <Transition name="slide">
      <aside
        class="fixed top-0 left-0 z-50 h-full w-72 bg-[#0D0D0D] border-r border-[#2A2A2A] flex flex-col lg:hidden"
        v-if="open"
      >
        <!-- Logo -->
        <div class="flex items-center justify-between px-5 h-16 border-b border-[#2A2A2A]">
          <RouterLink to="/" class="flex items-center gap-2.5" @click="$emit('close')">
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
  
        <!-- User quick info (if logged in) -->
        <div v-if="isLoggedIn && user" class="mx-4 mt-4 p-3 rounded-[12px] bg-[#1E1E1E] border border-[#2A2A2A]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-white font-bold">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ user.name }}</p>
              <p class="text-xs text-[#606060] truncate">{{ user.phone }}</p>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
            <span class="text-xs text-[#606060]">Balance</span>
            <span class="text-sm font-bold text-[#A32D2D]">TZS {{ balance.toLocaleString() }}</span>
          </div>
        </div>
  
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p class="text-[10px] font-semibold text-[#606060] uppercase tracking-widest px-3 py-2">Main</p>
  
          <RouterLink
            v-for="link in mainLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 group"
            :class="$route.name === link.name
              ? 'bg-[#A32D2D]/15 text-[#C94040] border border-[#A32D2D]/20'
              : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'"
            @click="$emit('close')"
          >
            <component :is="link.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ link.label }}</span>
            <span
              v-if="link.badge"
              class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              :class="link.badgeClass || 'bg-[#A32D2D] text-white'"
            >
              {{ link.badge }}
            </span>
          </RouterLink>
  
          <!-- Auth only links -->
          <template v-if="isLoggedIn">
            <p class="text-[10px] font-semibold text-[#606060] uppercase tracking-widest px-3 py-2 mt-4">Account</p>
            <RouterLink
              v-for="link in accountLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200"
              :class="$route.name === link.name
                ? 'bg-[#A32D2D]/15 text-[#C94040]'
                : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'"
              @click="$emit('close')"
            >
              <component :is="link.icon" class="w-5 h-5" />
              {{ link.label }}
            </RouterLink>
          </template>
        </nav>
  
        <!-- Bottom: Deposit button + Logout -->
        <div class="p-4 border-t border-[#2A2A2A] space-y-2">
          <RouterLink to="/wallet" class="block" @click="$emit('close')">
            <AppButton variant="primary" fullWidth size="md">
              💳 Deposit Now
            </AppButton>
          </RouterLink>
  
          <button
            v-if="isLoggedIn"
            class="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#606060] hover:text-[#EF4444] transition-colors"
            @click="$emit('logout'); $emit('close')"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </Transition>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const props = defineProps({
    open:       { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    user:       { type: Object, default: null },
    balance:    { type: Number, default: 0 },
  })
  
  defineEmits(['close', 'logout'])
  
  const route = useRoute()
  
  const userInitials = computed(() => {
    if (!props.user?.name) return 'U'
    return props.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })
  
  // ---- Icon components ----
  const makeIcon = (tpl) => ({ template: tpl })
  
  const mainLinks = [
    {
      to: '/', name: 'home', label: 'Home',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`)
    },
    {
      to: '/sports', name: 'sports', label: 'Sports',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>`)
    },
    {
      to: '/live', name: 'live', label: 'Live Betting',
      badge: 'LIVE', badgeClass: 'bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/30',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49"/></svg>`)
    },
    {
      to: '/promotions', name: 'promotions', label: 'Promotions',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`)
    },
    {
      to: '/leaderboard', name: 'leaderboard', label: 'VIP & Leaderboard',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`)
    },
  ]
  
  const accountLinks = [
    {
      to: '/dashboard', name: 'dashboard', label: 'Dashboard',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`)
    },
    {
      to: '/wallet', name: 'wallet', label: 'Wallet',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/><path d="M17 12h4v4h-4a2 2 0 010-4z"/></svg>`)
    },
    {
      to: '/my-bets', name: 'my-bets', label: 'My Bets',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>`)
    },
  ]
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
  .fade-enter-from, .fade-leave-to       { opacity: 0; }
  
  .slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1); }
  .slide-enter-from, .slide-leave-to       { transform: translateX(-100%); }
  </style>