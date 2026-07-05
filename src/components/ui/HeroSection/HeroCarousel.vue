<template>
  <div class="relative overflow-hidden h-[120px] w-full">
    
    <div 
      class="flex h-full transition-transform duration-500 ease-out" 
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="min-w-full h-full relative overflow-hidden flex items-end p-2 select-none"
        :style="{ background: slide.bg }"
      >
        <div 
          class="absolute -top-[60px] -right-[60px] w-[300px] h-[200px] rounded-full pointer-events-none blur-3xl opacity-60" 
          :style="{ background: slide.blob }" 
        />

        <div class="absolute right-8 top-1/2 -translate-y-1/2 text-[90px] opacity-20 pointer-events-none z-10">
          {{ slide.emoji }}
        </div>

        <div class="relative z-20 flex flex-col gap-1 max-w-[70%]">
          <span 
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-wider w-fit"
            :style="{ background: slide.badgeBg, borderColor: slide.badgeBorder, color: slide.badgeColor }"
          >
            <span v-if="slide.liveIndicator" class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
            {{ slide.badge }}
          </span>

          <h6
            class="text-sm font-black leading-tight" 
            :style="{ color: slide.titleColor || '#fff' }" 
            v-html="slide.title" 
          />
          
          <p class="text-xs md:text-sm text-white/70 max-w-[380px] line-clamp-1 md:line-clamp-none">
            {{ slide.sub }}
          </p>

          <button 
            class="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs md:text-sm font-bold w-fit transition-opacity duration-200 hover:opacity-90 active:scale-95 transform" 
            :style="{ background: slide.ctaBg, color: slide.ctaColor }" 
            @click="$router.push(slide.route)"
          >
            {{ slide.cta }} →
          </button>
        </div>
      </div>
    </div>

    <button 
      class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/45 border border-white/15 text-white w-9 h-9 rounded-full items-center justify-center text-xl transition-all duration-200 hover:bg-black/70 active:scale-95" 
      @click="prev"
    >
      &#8249;
    </button>
    <button 
      class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/45 border border-white/15 text-white w-9 h-9 rounded-full items-center justify-center text-xl transition-all duration-200 hover:bg-black/70 active:scale-95" 
      @click="next"
    >
      &#8250;
    </button>

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="h-1.5 rounded-full transition-all duration-350 p-0"
        :class="i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/30'"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const current = ref(0)
let timer = null

const slides = [
  {
    emoji: '🎁',
    badge: '🔥 New User Offer',
    badgeBg: 'rgba(255,255,255,0.15)',
    badgeBorder: 'rgba(255,255,255,0.25)',
    badgeColor: '#fff',
    title: '100% Welcome<br>Bonus Up To TZS 20K',
    titleColor: '#fff',
    sub: 'Deposit TZS 10,000 — play with TZS 20,000 instantly',
    cta: 'Claim Bonus',
    ctaBg: '#fff',
    ctaColor: '#1a0505',
    bg: 'linear-gradient(135deg,#3a0808 0%,#1a0505 50%,#0D0D0D 100%)',
    blob: 'rgba(163,45,45,0.25)', // Nimeongeza opacity kidogo ionekane vyema na Tailwind blur
    route: '/auth/register',
    liveIndicator: false,
  },
  {
    emoji: '🏆',
    badge: '🏆 Mega Jackpot',
    badgeBg: 'rgba(245,158,11,0.2)',
    badgeBorder: 'rgba(245,158,11,0.4)',
    badgeColor: '#F59E0B',
    title: '<span style="color:#F59E0B">TZS 50,000,000</span><br>Jackpot This Weekend',
    titleColor: '#fff',
    sub: 'Pick 13 correct results to win the biggest prize in Tanzania',
    cta: 'Play Jackpot',
    ctaBg: '#F59E0B',
    ctaColor: '#1a0a00',
    bg: 'linear-gradient(135deg,#2a1a00 0%,#3d2500 50%,#0D0D0D 100%)',
    blob: 'rgba(245,158,11,0.20)',
    route: '/sports',
    liveIndicator: false,
  },
  {
    emoji: '⚡',
    badge: 'Live Now',
    badgeBg: 'rgba(255,59,59,0.2)',
    badgeBorder: 'rgba(255,59,59,0.4)',
    badgeColor: '#FF3B3B',
    title: '24 Matches<br>Live Right Now',
    titleColor: '#fff',
    sub: 'Real-time odds • Cash out anytime • In-play betting',
    cta: 'Watch Live',
    ctaBg: '#FF3B3B',
    ctaColor: '#fff',
    bg: 'linear-gradient(135deg,#001a3a 0%,#001228 50%,#0D0D0D 100%)',
    blob: 'rgba(56,125,255,0.20)',
    route: '/live',
    liveIndicator: true,
  },
  {
    emoji: '📱',
    badge: '⚡ Instant Withdrawal',
    badgeBg: 'rgba(34,197,94,0.2)',
    badgeBorder: 'rgba(34,197,94,0.4)',
    badgeColor: '#22C55E',
    title: 'Withdraw Via<br>M-Pesa In 3 Minutes',
    titleColor: '#fff',
    sub: 'No delays. No hidden fees. Your winnings, instantly.',
    cta: 'Withdraw Now',
    ctaBg: '#22C55E',
    ctaColor: '#001a0c',
    bg: 'linear-gradient(135deg,#002a14 0%,#001a0c 50%,#0D0D0D 100%)',
    blob: 'rgba(34,197,94,0.20)',
    route: '/wallet',
    liveIndicator: false,
  },
]

const goTo = (i) => { current.value = i; resetTimer(); }
const next = () => { current.value = (current.value + 1) % slides.length }
const prev = () => { current.value = (current.value - 1 + slides.length) % slides.length; resetTimer(); }

const resetTimer = () => {
  clearInterval(timer)
  timer = setInterval(next, 4500)
}

onMounted(() => resetTimer())
onUnmounted(() => clearInterval(timer))
</script>