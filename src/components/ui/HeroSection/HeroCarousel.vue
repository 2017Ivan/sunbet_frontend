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
        <!-- Full-bleed uploaded thumbnail (admin): image inachukua upana mzima wa slide -->
        <img
          v-if="slide.thumb && slide.thumb.image"
          :src="slide.thumb.image"
          :alt="slide.badge"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Default content (maneno + bet-card) — hayapo ikiwa kuna uploaded image -->
        <template v-else>
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

          <!-- Right Betting Thumbnail (bet-card) -->
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
        </template>
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
import { storeToRefs } from 'pinia'
import { useHeroStore } from '../../../stores/hero/heroStore'

const heroStore = useHeroStore()
const { slides } = storeToRefs(heroStore)

const current = ref(0)
let timer = null

const goTo = (i) => { current.value = i; resetTimer(); }
const next = () => { current.value = (current.value + 1) % slides.value.length }
const prev = () => { current.value = (current.value - 1 + slides.value.length) % slides.value.length; resetTimer(); }

const resetTimer = () => {
  clearInterval(timer)
  timer = setInterval(next, 4500)
}

onMounted(async () => {
  await heroStore.load()
  resetTimer()
})
onUnmounted(() => clearInterval(timer))
</script>