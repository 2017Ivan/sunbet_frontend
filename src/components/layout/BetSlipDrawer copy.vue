<template>
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        @click="$emit('close')"
      />
    </Transition>
  
    <!-- Drawer -->
    <Transition name="slide-right">
      <div
        v-if="open"
        class="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-[#2A2A2A] flex flex-col shadow-[−8px_0_40px_rgba(0,0,0,0.6)]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 h-16 border-b border-[#2A2A2A]">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
            <h2 class="text-base font-semibold text-white">Bet Slip</h2>
            <span
              v-if="bets.length"
              class="px-2 py-0.5 rounded-full bg-[#A32D2D] text-white text-xs font-bold"
            >
              {{ bets.length }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="bets.length"
              class="text-xs text-[#606060] hover:text-[#EF4444] transition-colors"
              @click="$emit('clear-all')"
            >
              Clear all
            </button>
            <button
              class="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#606060] hover:text-white transition-colors"
              @click="$emit('close')"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Empty state -->
        <div v-if="!bets.length" class="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
            <svg class="w-10 h-10 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-[#A0A0A0]">Bet slip is empty</p>
            <p class="text-xs text-[#606060] mt-1">Click on odds to add selections</p>
          </div>
          <AppButton variant="outline" size="sm" @click="$router.push('/sports'); $emit('close')">
            Browse Sports
          </AppButton>
        </div>
  
        <!-- Bets list -->
        <div v-else class="flex-1 overflow-y-auto py-3 px-4 space-y-2">
          <div
            v-for="(bet, index) in bets"
            :key="bet.id"
            class="bg-[#1E1E1E] border border-[#2A2A2A] rounded-[12px] p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-xs text-[#606060] truncate">{{ bet.match }}</p>
                <p class="text-sm font-semibold text-white mt-0.5 truncate">{{ bet.selection }}</p>
                <p class="text-xs text-[#A0A0A0] mt-0.5">{{ bet.market }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <button
                  class="text-[#606060] hover:text-[#EF4444] transition-colors"
                  @click="$emit('remove-bet', index)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
                <span class="text-sm font-bold text-[#A32D2D]">{{ bet.odds }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Footer: Summary + Place bet -->
        <div v-if="bets.length" class="border-t border-[#2A2A2A] p-4 space-y-3">
          <!-- Bet type tabs -->
          <div class="flex gap-1 p-1 bg-[#1E1E1E] rounded-[10px]">
            <button
              v-for="type in ['Single', 'Accumulator']"
              :key="type"
              class="flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
              :class="betType === type
                ? 'bg-[#A32D2D] text-white'
                : 'text-[#606060] hover:text-white'"
              @click="betType = type"
            >
              {{ type }}
            </button>
          </div>
  
          <!-- Stake input -->
          <div>
            <label class="text-xs text-[#606060] mb-1.5 block">Stake (TZS)</label>
            <div class="flex gap-2">
              <input
                v-model="stake"
                type="number"
                placeholder="0"
                class="flex-1 h-10 px-3 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30"
              />
              <div class="flex gap-1">
                <button
                  v-for="quick in [500, 1000, 5000]"
                  :key="quick"
                  class="px-2 py-1 rounded-[8px] bg-[#2A2A2A] text-[#A0A0A0] hover:text-white text-xs font-medium transition-colors"
                  @click="stake = quick"
                >
                  {{ quick >= 1000 ? `${quick/1000}k` : quick }}
                </button>
              </div>
            </div>
          </div>
  
          <!-- Summary -->
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-[#606060]">Total Odds</span>
              <span class="text-white font-semibold">{{ totalOdds.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#606060]">Potential Win</span>
              <span class="text-[#22C55E] font-semibold">TZS {{ potentialWin.toLocaleString() }}</span>
            </div>
          </div>
  
          <!-- Place bet button -->
          <AppButton variant="primary" fullWidth size="lg" @click="$emit('place-bet', { stake, betType })">
            Place Bet — TZS {{ Number(stake || 0).toLocaleString() }}
          </AppButton>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    bets: { type: Array, default: () => [] },
  })
  
  defineEmits(['close', 'clear-all', 'remove-bet', 'place-bet'])
  
  const stake   = ref('')
  const betType = ref('Single')
  
  const totalOdds = computed(() =>
    props.bets.reduce((acc, bet) => acc * (parseFloat(bet.odds) || 1), 1)
  )
  
  const potentialWin = computed(() =>
    Math.round((parseFloat(stake.value) || 0) * totalOdds.value)
  )
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
  .fade-enter-from, .fade-leave-to       { opacity: 0; }
  
  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
  }
  .slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
  </style>