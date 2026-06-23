<template>
    <header class="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2A2A2A]">
      <div class="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">
  
        <!-- Left: Logo + Mobile menu toggle -->
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
          <RouterLink to="/" class="flex items-center gap-2.5 select-none">
            <div class="w-8 h-8 rounded-[8px] bg-[#A32D2D] flex items-center justify-center shadow-[0_4px_12px_rgba(163,45,45,0.4)]">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="font-bold text-lg tracking-tight">
              <span class="text-white">Sun</span><span class="text-[#A32D2D]">Bet</span>
            </span>
          </RouterLink>
        </div>
  
        <!-- Center: Nav links (desktop only) -->
        <nav class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200"
            :class="$route.name === link.name
              ? 'bg-[#A32D2D]/15 text-[#C94040]'
              : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'"
          >
            <component :is="link.icon" class="w-4 h-4" />
            {{ link.label }}
            <span
              v-if="link.badge"
              class="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#A32D2D] text-white"
            >
              {{ link.badge }}
            </span>
          </RouterLink>
        </nav>
  
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
  
          <!-- Bet slip toggle -->
          <button
            class="relative w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#1E1E1E] text-[#A0A0A0] hover:text-white transition-colors"
            @click="$emit('toggle-betslip')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
            <span
              v-if="betSlipCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A32D2D] text-white text-[10px] font-bold flex items-center justify-center"
            >
              {{ betSlipCount > 9 ? '9+' : betSlipCount }}
            </span>
          </button>
  
          <!-- Guest buttons -->
          <template v-if="!isLoggedIn">
            <AppButton variant="ghost" size="sm" @click="$router.push('/auth/login')">
              Login
            </AppButton>
            <AppButton variant="primary" size="sm" @click="$router.push('/auth/register')">
              Register
            </AppButton>
          </template>
  
          <!-- Logged in: Balance + Avatar -->
          <template v-else>
            <!-- Balance -->
            <button
              class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#A32D2D]/40 transition-colors"
              @click="$router.push('/wallet')"
            >
              <svg class="w-4 h-4 text-[#A32D2D]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/>
                <path d="M17 12h4v4h-4a2 2 0 010-4z"/>
              </svg>
              <span class="text-sm font-semibold text-white">{{ formattedBalance }}</span>
            </button>
  
            <!-- Avatar dropdown -->
            <div class="relative" ref="avatarRef">
              <button
                class="w-9 h-9 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-white font-bold text-sm border-2 border-[#A32D2D]/30 hover:border-[#A32D2D] transition-colors"
                @click="dropdownOpen = !dropdownOpen"
              >
                {{ userInitials }}
              </button>
  
              <!-- Dropdown -->
              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 top-12 w-52 bg-[#1E1E1E] border border-[#2A2A2A] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden py-1"
                >
                  <div class="px-4 py-3 border-b border-[#2A2A2A]">
                    <p class="text-sm font-semibold text-white">{{ user?.name }}</p>
                    <p class="text-xs text-[#606060] mt-0.5">{{ user?.phone }}</p>
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
    </header>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { RouterLink, useRouter, useRoute } from 'vue-router'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const props = defineProps({
    isLoggedIn:   { type: Boolean, default: false },
    user:         { type: Object, default: null },
    balance:      { type: Number, default: 0 },
    betSlipCount: { type: Number, default: 0 },
  })
  
  const emit = defineEmits(['toggle-sidebar', 'toggle-betslip', 'logout'])
  
  const router = useRouter()
  const route  = useRoute()
  
  const dropdownOpen = ref(false)
  const avatarRef    = ref(null)
  
  const userInitials = computed(() => {
    if (!props.user?.name) return 'U'
    return props.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })
  
  const formattedBalance = computed(() =>
    `TZS ${props.balance.toLocaleString('en-TZ')}`
  )
  
  // Nav links
  const navLinks = [
    { to: '/',           name: 'home',        label: 'Home',     icon: HomeIcon },
    { to: '/sports',     name: 'sports',      label: 'Sports',   icon: SportsIcon },
    { to: '/live',       name: 'live',        label: 'Live',     icon: LiveIcon,   badge: 'LIVE' },
    { to: '/promotions', name: 'promotions',  label: 'Promos',   icon: PromoIcon },
    { to: '/leaderboard',name: 'leaderboard', label: 'VIP',      icon: VipIcon },
  ]
  
  // Dropdown items
  const dropdownItems = [
    { to: '/dashboard', label: 'My Dashboard', icon: DashIcon },
    { to: '/wallet',    label: 'Wallet',        icon: WalletIcon },
    { to: '/my-bets',   label: 'My Bets',       icon: BetsIcon },
  ]
  
  const handleLogout = () => {
    dropdownOpen.value = false
    emit('logout')
  }
  
  // Close dropdown on outside click
  const handleClickOutside = (e) => {
    if (avatarRef.value && !avatarRef.value.contains(e.target)) {
      dropdownOpen.value = false
    }
  }
  onMounted(()  => document.addEventListener('click', handleClickOutside))
  onUnmounted(()=> document.removeEventListener('click', handleClickOutside))
  
  // ---- Inline SVG icon components ----
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
  </script>
  
  <style scoped>
  .dropdown-enter-active, .dropdown-leave-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .dropdown-enter-from, .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  </style>