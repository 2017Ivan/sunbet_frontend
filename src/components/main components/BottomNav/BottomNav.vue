<!-- BottomNav.vue -->
<template>
  <!-- Loading State -->
  <BottomNavSkeleton v-if="isLoading" />
  
  <!-- Actual Content -->
  <template v-else>
    <nav class="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-pb">
      <div class="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/40 to-transparent" />

      <div class="relative bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-[#221C16]">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF6A]/35 to-transparent" />

        <div class="flex items-end justify-around h-[64px] px-1">

          <!-- HOME -->
          <RouterLink
            to="/"
            class="group relative flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2"
          >
            <span v-if="isActive('/')" class="absolute top-1 w-9 h-9 rounded-full bg-gradient-to-b from-[#B5333D]/25 to-[#B5333D]/5" />
            <span v-if="isActive('/')" class="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#B5333D]" />
            <div class="relative w-[21px] h-[21px] transition-all duration-300" :class="isActive('/') ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'">
              <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" :stroke="isActive('/') ? '#FFFFFF' : 'rgba(255,255,255,0.45)'" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span class="relative text-[10px] leading-none tracking-[0.01em] transition-colors duration-300" :class="isActive('/') ? 'text-[#F2EFE9] font-semibold' : 'text-[#9A9298] font-medium'">
              Home
            </span>
          </RouterLink>

          <!-- SPORTS -->
          <RouterLink
            to="/sports"
            class="group relative flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2"
          >
            <span v-if="isActive('/sports')" class="absolute top-1 w-9 h-9 rounded-full bg-gradient-to-b from-[#B5333D]/25 to-[#B5333D]/5" />
            <span v-if="isActive('/sports')" class="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#B5333D]" />
            <div class="relative w-[21px] h-[21px] transition-all duration-300" :class="isActive('/sports') ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'">
              <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" :stroke="isActive('/sports') ? '#FFFFFF' : 'rgba(255,255,255,0.45)'" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9.5"/>
                <path d="M4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M4.9 19.1l4.3-4.3M14.8 9.2l4.3-4.3"/>
              </svg>
            </div>
            <span class="relative text-[10px] leading-none tracking-[0.01em] transition-colors duration-300" :class="isActive('/sports') ? 'text-[#F2EFE9] font-semibold' : 'text-[#9A9298] font-medium'">
              Sports
            </span>
          </RouterLink>

          <!-- BET SLIP -->
          <div class="relative flex-1 flex justify-center">
            <button
              class="group absolute -top-15 flex flex-col items-center justify-center w-[60px] h-[60px] rounded-full transition-all duration-300 ease-out active:scale-95"
              :class="betSlipCount > 0 ? 'fab-active' : 'fab-idle'"
              @click="$emit('toggle-betslip')"
              aria-label="Open bet slip"
            >
              <span class="absolute inset-0 rounded-full" :class="betSlipCount > 0 ? 'rim-active' : 'rim-idle'" />
              <span v-if="betSlipCount > 0" class="absolute inset-0 rounded-full pulse-ring" />
              <span
                class="relative w-[52px] h-[52px] rounded-full flex flex-col items-center justify-center gap-0.5 transition-colors duration-300"
                :class="betSlipCount > 0 ? 'chip-active' : 'chip-idle'"
              >
                <svg class="w-[19px] h-[19px] transition-transform duration-300 group-active:scale-90" viewBox="0 0 24 24" fill="none" :stroke="betSlipCount > 0 ? '#FFFFFF' : 'rgba(255,255,255,0.7)'" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="2"/>
                  <path d="M9 12h6M9 16h4"/>
                </svg>
                <span
                  class="text-[8.5px] font-semibold tracking-[0.12em] uppercase leading-none"
                  :class="betSlipCount > 0 ? 'text-white' : 'text-white/70'"
                >Slip</span>
              </span>
              <span
                v-if="betSlipCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-b from-[#E7C181] to-[#C79A4D] text-[#1A1410] text-[10px] font-bold flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.5)] ring-2 ring-[#0A0A0B]"
              >
                {{ betSlipCount }}
              </span>
            </button>
          </div>

          <!-- MY BETS -->
          <RouterLink
            to="/bets" 
            class="group relative flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2"
          >
            <span v-if="isActive('/bets')" class="absolute top-1 w-9 h-9 rounded-full bg-gradient-to-b from-[#B5333D]/25 to-[#B5333D]/5" />
            <span v-if="isActive('/bets')" class="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#B5333D]" />
            <div class="relative w-[21px] h-[21px] transition-all duration-300" :class="isActive('/bets') ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'">
              <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" :stroke="isActive('/bets') ? '#FFFFFF' : 'rgba(255,255,255,0.45)'" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h12l4 4v12H4z"/>
                <path d="M16 4v4h4"/>
                <path d="M8 12h8M8 16h5"/>
              </svg>
              <span
                v-if="myBetsCount > 0"
                class="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-gradient-to-b from-[#C84450] to-[#8E2229] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#0A0A0B]"
              >
                {{ myBetsCount }}
              </span>
            </div>
            <span class="relative text-[10px] leading-none tracking-[0.01em] transition-colors duration-300" :class="isActive('/bets') ? 'text-[#F2EFE9] font-semibold' : 'text-[#9A9298] font-medium'">
              My Bets
            </span>
          </RouterLink>

          <!-- ACCOUNT / PROFILE -->
          <RouterLink
            to="/profile"
            class="group relative flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2"
          >
            <span v-if="isActive('/profile')" class="absolute top-1 w-9 h-9 rounded-full bg-gradient-to-b from-[#B5333D]/25 to-[#B5333D]/5" />
            <span v-if="isActive('/profile')" class="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#B5333D]" />
            <div class="relative w-[21px] h-[21px] transition-all duration-300" :class="isActive('/profile') ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'">
              <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" :stroke="isActive('/profile') ? '#FFFFFF' : 'rgba(255,255,255,0.45)'" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="3.8"/>
                <path d="M4.5 20c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5"/>
              </svg>
            </div>
            <span class="relative text-[10px] leading-none tracking-[0.01em] transition-colors duration-300" :class="isActive('/profile') ? 'text-[#F2EFE9] font-semibold' : 'text-[#9A9298] font-medium'">
              Account
            </span>
          </RouterLink>

        </div>
      </div>
    </nav>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BottomNavSkeleton from '../../skeletons/bottomNav/BottomNavSkeleton.vue'

// ---- Loading State ----
const isLoading = ref(true)

const props = defineProps({
  betSlipCount: { type: Number, default: 0 },
  myBetsCount: { type: Number, default: 0 },
})

defineEmits(['toggle-betslip'])

const route = useRoute()

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// ---- Simulate loading ----
setTimeout(() => {
  isLoading.value = false
}, 500)
</script>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}

.fab-idle {
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));
}
.fab-active {
  filter: drop-shadow(0 8px 20px rgba(181, 51, 61, 0.45)) drop-shadow(0 2px 8px rgba(212, 175, 106, 0.25));
}

.rim-idle {
  background: linear-gradient(155deg, #2C2730, #18151A);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}
.rim-active {
  background: linear-gradient(155deg, #E7C181, #8E6A2E 55%, #B5333D);
}

.chip-idle {
  position: absolute;
  inset: 4px;
  background: radial-gradient(circle at 32% 28%, #2A2630, #16131A);
}
.chip-active {
  position: absolute;
  inset: 4px;
  background: radial-gradient(circle at 32% 28%, #C8333D, #7A1B22 80%);
}

.pulse-ring {
  border: 1.5px solid rgba(212, 175, 106, 0.55);
  animation: pulseRing 2.2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.92);
    opacity: 0.9;
  }
  70% {
    transform: scale(1.28);
    opacity: 0;
  }
  100% {
    transform: scale(1.28);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse-ring { animation: none; display: none; }
  * { transition-duration: 0.01ms !important; }
}
</style>