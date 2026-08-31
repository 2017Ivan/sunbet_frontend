<template>
  <div class="relative overflow-hidden h-[120px] sm:h-[150px] md:h-[170px] w-full">
    
    <div 
      class="flex h-full transition-transform duration-500 ease-out" 
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="min-w-full h-full relative overflow-hidden flex items-center p-3 sm:p-4 select-none"
        :style="{ background: slide.bg }"
      >
        <!-- Blob deko -->
        <div 
          class="absolute -top-[60px] -right-[60px] w-[300px] h-[200px] rounded-full pointer-events-none blur-3xl opacity-60" 
          :style="{ background: slide.blob }" 
        />
        <div 
          class="absolute -bottom-[80px] -left-[40px] w-[260px] h-[200px] rounded-full pointer-events-none blur-3xl opacity-40" 
          :style="{ background: slide.blob2 || slide.blob }" 
        />

        <!-- Left Content -->
        <div class="relative z-20 flex flex-col gap-1 max-w-[58%] sm:max-w-[52%] md:max-w-[48%]">
          <span 
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider w-fit"
            :style="{ background: slide.badgeBg, borderColor: slide.badgeBorder, color: slide.badgeColor }"
          >
            <span v-if="slide.liveIndicator" class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
            {{ slide.badge }}
          </span>

          <h6
            class="text-sm sm:text-base font-black leading-tight" 
            :style="{ color: slide.titleColor || '#fff' }" 
            v-html="slide.title" 
          />
          
          <p class="hidden sm:block text-xs md:text-sm text-white/70 max-w-[380px] line-clamp-1 md:line-clamp-none">
            {{ slide.sub }}
          </p>

          <button 
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold w-fit transition-opacity duration-200 hover:opacity-90 active:scale-95 transform" 
            :style="{ background: slide.ctaBg, color: slide.ctaColor }" 
            @click="$router.push(slide.route)"
          >
            {{ slide.cta }} →
          </button>
        </div>

        <!-- Right Betting Thumbnail -->
        <div class="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 block" v-if="slide.thumb">
          <div class="w-[150px] sm:w-[190px] md:w-[230px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/15 bg-[#151515]/90 backdrop-blur-sm">
            <!-- card top: league -->
            <div class="flex items-center justify-between px-2.5 py-1.5 bg-black/40 border-b border-gray-200">
              <span class="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-white/60 truncate">{{ slide.thumb.league }}</span>
              <span v-if="slide.thumb.live" class="inline-flex items-center gap-1 text-[8px] font-bold text-red-400">
                <span class="w-1 h-1 rounded-full bg-red-500 animate-pulse" />LIVE
              </span>
              <span v-else class="text-[8px] font-bold text-white/50">{{ slide.thumb.time }}</span>
            </div>

            <!-- teams -->
            <div class="px-2.5 py-1.5 space-y-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black text-white flex-shrink-0"
                        :style="{ background: slide.thumb.homeColor }">{{ slide.thumb.homeShort }}</span>
                  <span class="text-[10px] sm:text-[11px] font-medium text-white/90 truncate">{{ slide.thumb.home }}</span>
                </div>
                <span v-if="slide.thumb.score" class="text-[11px] font-black text-white/80 whitespace-nowrap">{{ slide.thumb.score }}</span>
                <button class="px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors whitespace-nowrap">{{ slide.thumb.homeOdds }}</button>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black text-white flex-shrink-0"
                        :style="{ background: slide.thumb.awayColor }">{{ slide.thumb.awayShort }}</span>
                  <span class="text-[10px] sm:text-[11px] font-medium text-white/90 truncate">{{ slide.thumb.away }}</span>
                </div>
                <button class="px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors whitespace-nowrap">{{ slide.thumb.awayOdds }}</button>
              </div>
            </div>

            <!-- footer action bar -->
            <div class="flex items-stretch gap-px bg-black/50">
              <button class="flex-1 py-1 text-center text-[8px] sm:text-[9px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors">{{ slide.thumb.foot1 }}</button>
              <button class="flex-1 py-1 text-center text-[8px] sm:text-[9px] font-bold" :style="{ color: slide.thumb.foot2Color, background: slide.thumb.foot2Bg || '' }">{{ slide.thumb.foot2 }}</button>
              <button class="flex-1 py-1 text-center text-[8px] sm:text-[9px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors">{{ slide.thumb.foot3 }}</button>
            </div>
          </div>
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
    blob: 'rgba(163,45,45,0.25)',
    blob2: 'rgba(255,255,255,0.05)',
    route: '/auth/register',
    liveIndicator: false,
    thumb: {
      league: 'Premier League',
      live: false,
      time: '19:45',
      home: 'Arsenal', homeShort: 'AR', homeColor: '#EF4444', homeOdds: '1.65',
      away: 'Chelsea', awayShort: 'CH', awayColor: '#3B82F6', awayOdds: '4.75',
      foot1: 'Over 2.5', foot2: 'Bet Now', foot2Color: '#fff', foot2Bg: '#A32D2D',
      foot3: '2+ Goals',
    },
  },
  {
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
    blob2: 'rgba(245,158,11,0.08)',
    route: '/sports',
    liveIndicator: false,
    thumb: {
      league: 'Jackpot Roller',
      live: false,
      time: 'Winner',
      home: 'Simba SC', homeShort: 'SB', homeColor: '#F59E0B', homeOdds: '1.90',
      away: 'Young Africans', awayShort: 'YA', awayColor: '#22C55E', awayOdds: '2.10',
      foot1: '13 Games', foot2: 'Play', foot2Color: '#1a0a00', foot2Bg: '#F59E0B',
      foot3: 'TZS 50M',
    },
  },
  {
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
    blob2: 'rgba(255,59,59,0.12)',
    route: '/live',
    liveIndicator: true,
    thumb: {
      league: 'Serie A',
      live: true,
      time: '67′',
      home: 'Inter', homeShort: 'IN', homeColor: '#2563EB', homeOdds: '2.15',
      away: 'AC Milan', awayShort: 'MI', awayColor: '#DC2626', awayOdds: '3.10',
      score: '2 - 1',
      foot1: 'BTTS Yes', foot2: '1X2', foot2Color: '#fff', foot2Bg: '#FF3B3B',
      foot3: 'Match',
    },
  },
  {
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
    blob2: 'rgba(34,197,94,0.08)',
    route: '/wallet',
    liveIndicator: false,
    thumb: {
      league: 'Win · Cash Out',
      live: false,
      time: 'Instant',
      home: 'Balance: TZS', homeShort: 'TZ', homeColor: '#22C55E', homeOdds: '',
      away: 'Available Now', awayShort: '✔', awayColor: '#16A34A', awayOdds: 'M-Pesa',
      foot1: 'Deposit', foot2: 'Withdraw', foot2Color: '#001a0c', foot2Bg: '#22C55E',
      foot3: 'History',
    },
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