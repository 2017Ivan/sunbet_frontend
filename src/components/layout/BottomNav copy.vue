<template>
    <nav class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#2A2A2A] safe-area-pb">
      <div class="flex items-center justify-around h-16 px-2">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-all duration-200 group"
          :class="isActive(tab) ? 'text-[#A32D2D]' : 'text-[#606060]'"
        >
          <!-- Active indicator -->
          <span
            v-if="isActive(tab)"
            class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#A32D2D]"
          />
  
          <!-- Icon wrapper -->
          <div class="relative">
            <component
              :is="tab.icon"
              class="w-5 h-5 transition-transform duration-200"
              :class="isActive(tab) ? 'scale-110' : 'group-hover:scale-105'"
            />
            <!-- Badge -->
            <span
              v-if="tab.count && tab.count > 0"
              class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A32D2D] text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ tab.count > 9 ? '9+' : tab.count }}
            </span>
            <!-- Live dot -->
            <span
              v-if="tab.live"
              class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B3B] animate-pulse border border-[#0D0D0D]"
            />
          </div>
  
          <span
            class="text-[10px] font-medium leading-none transition-colors duration-200"
            :class="isActive(tab) ? 'text-[#A32D2D]' : 'text-[#606060]'"
          >
            {{ tab.label }}
          </span>
        </RouterLink>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  
  const props = defineProps({
    betSlipCount: { type: Number, default: 0 },
    liveCount:    { type: Number, default: 0 },
  })
  
  const route = useRoute()
  
  const isActive = (tab) => route.name === tab.name || route.path === tab.to
  
  const makeIcon = (tpl) => ({ template: tpl })
  
  const tabs = computed(() => [
    {
      to: '/', name: 'home', label: 'Home',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`)
    },
    {
      to: '/sports', name: 'sports', label: 'Sports',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>`)
    },
    {
      to: '/live', name: 'live', label: 'Live',
      live: true, count: props.liveCount,
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49"/></svg>`)
    },
    {
      to: '/my-bets', name: 'my-bets', label: 'My Bets',
      count: props.betSlipCount,
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>`)
    },
    {
      to: '/dashboard', name: 'dashboard', label: 'Account',
      icon: makeIcon(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`)
    },
  ])
  </script>
  
  <style scoped>
  .safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
  </style>