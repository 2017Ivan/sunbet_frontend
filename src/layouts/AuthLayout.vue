<template>
    <div class="min-h-screen bg-[#0D0D0D] flex">
  
      <!-- Left: Branding panel (desktop only) -->
      <div class="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col">
  
        <!-- Background gradient + pattern -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#0D0D0D] to-[#0D0D0D]" />
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23A32D2D%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
  
        <!-- Red glow -->
        <div class="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#A32D2D]/20 blur-[120px] pointer-events-none" />
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#A32D2D]/10 blur-[80px] pointer-events-none" />
  
        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full px-12 py-10">
  
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-3 select-none w-fit">
            <div class="w-10 h-10 rounded-[10px] bg-[#A32D2D] flex items-center justify-center shadow-[0_4px_20px_rgba(163,45,45,0.5)]">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="font-bold text-2xl tracking-tight">
              <span class="text-white">Sun</span><span class="text-[#A32D2D]">Bet</span>
            </span>
          </RouterLink>
  
          <!-- Center: Hero text -->
          <div class="flex-1 flex flex-col justify-center">
            <div class="mb-6">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A32D2D]/15 border border-[#A32D2D]/25 text-[#C94040] text-xs font-semibold mb-6">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
                Live Betting Available
              </span>
            </div>
  
            <h1 class="text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">
              Bet Smart,<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#A32D2D] to-[#C94040]">
                Win Big.
              </span>
            </h1>
  
            <p class="text-[#606060] text-lg leading-relaxed max-w-md">
              Tanzania's most trusted sports betting platform. Real-time odds, instant withdrawals, and massive jackpots.
            </p>
  
            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mt-10">
              <div
                v-for="stat in stats"
                :key="stat.label"
                class="bg-white/[0.04] backdrop-blur border border-white/[0.06] rounded-[14px] p-4"
              >
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
                <p class="text-xs text-[#606060] mt-1">{{ stat.label }}</p>
              </div>
            </div>
          </div>
  
          <!-- Bottom: Testimonial -->
          <div class="bg-white/[0.04] border border-white/[0.06] rounded-[16px] p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex -space-x-2">
                <div
                  v-for="(color, i) in ['#A32D2D', '#7A1F1F', '#C94040']"
                  :key="i"
                  class="w-8 h-8 rounded-full border-2 border-[#0D0D0D] flex items-center justify-center text-xs font-bold text-white"
                  :style="{ background: color }"
                >
                  {{ ['JD', 'AM', 'SK'][i] }}
                </div>
              </div>
              <div class="flex gap-0.5">
                <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-[#F59E0B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-[#A0A0A0] leading-relaxed italic">
              "SunBet inalipa haraka sana! Niliomba withdrawal na kupata pesa ndani ya dakika 3."
            </p>
            <p class="text-xs text-[#606060] mt-2">— James D., Dar es Salaam</p>
          </div>
  
        </div>
      </div>
  
      <!-- Right: Auth form -->
      <div class="flex-1 flex flex-col items-center justify-center px-5 py-10 relative">
  
        <!-- Mobile logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 mb-8 lg:hidden select-none">
          <div class="w-9 h-9 rounded-[9px] bg-[#A32D2D] flex items-center justify-center shadow-[0_4px_16px_rgba(163,45,45,0.4)]">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="font-bold text-xl">
            <span class="text-white">Sun</span><span class="text-[#A32D2D]">Bet</span>
          </span>
        </RouterLink>
  
        <!-- Form slot -->
        <div class="w-full max-w-md">
          <RouterView />
        </div>
  
        <!-- Terms -->
        <p class="mt-8 text-xs text-[#606060] text-center max-w-xs leading-relaxed">
          By continuing you agree to our
          <a href="#" class="text-[#A32D2D] hover:underline">Terms of Service</a> and
          <a href="#" class="text-[#A32D2D] hover:underline">Privacy Policy</a>.
          Must be 18+ to bet.
        </p>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { RouterLink, RouterView } from 'vue-router'
  
  const stats = [
    { value: '2M+',   label: 'Active Users' },
    { value: '500K+', label: 'Bets Daily' },
    { value: '3 min', label: 'Avg Withdrawal' },
  ]
  </script>