<template>
  <section class="w-full bg-white/80">
    <div class="max-w-screen-xl mx-auto relative">

      <!-- Section header: title + view all casino -->
      <div class="flex items-center justify-between px-1 pb-2">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-5 rounded-full bg-rose-600" />
          <h3 class="text-sm sm:text-base font-black text-gray-800 tracking-tight">
            Casino Games
          </h3>
          <span class="text-[10px] font-bold text-emerald-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            {{ games.length }} Games
          </span>
        </div>
        <button
          @click="openCasinoLobby"
          class="flex items-center gap-1 text-xs font-bold text-rose-600/50 hover:text-rose-700 transition-colors"
        >
          View All Casino
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Horizontal Scroll with Arrows -->
      <div class="relative">

        <!-- Left Arrow -->
        <button
          @click="scrollLeft"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center"
          :class="{ 'opacity-40 cursor-not-allowed': scrollPosition === 0 }"
          :disabled="scrollPosition === 0"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Scroll Container -->
        <div
          ref="scrollContainer"
          class="overflow-x-auto scrollbar-hide py-0.5 px-0.5"
          @scroll="updateScrollPosition"
        >
          <div class="flex gap-2 sm:gap-3">

            <!-- Game Cards -->
            <div
              v-for="game in games"
              :key="game.id"
              class="relative w-[65px] h-[65px] flex-shrink-0 group cursor-pointer"
              @click="openCasinoLobby"
            >
              <div
                class="w-full h-full bg-no-repeat bg-cover bg-center rounded-md overflow-hidden relative border border-transparent group-hover:border-rose-400 transition-all"
                :style="{ backgroundImage: game.image ? `url('${game.image}')` : '' }"
              >
                <!-- Fallback if no image -->
                <div
                  v-if="!game.image"
                  class="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br"
                  :style="game.gradient || 'linear-gradient(135deg,#7a1f1f,#a32d2d)'"
                >
                  {{ game.icon }}
                </div>

                <!-- Top icons -->
                <div class="absolute inset-0 flex items-start justify-between p-1">
                  <span v-if="game.hot" class="text-[7px] font-black text-white bg-rose-600 px-1 py-0.5 rounded">HOT</span>
                  <span class="w-4 h-4" />
                </div>

                <!-- Bottom badge -->
                <div class="absolute bottom-0 inset-x-0 flex items-center justify-center">
                  <span class="text-[8px] font-bold text-white bg-black/50 w-full text-center py-0.5 truncate px-1">
                    {{ game.name }}
                  </span>
                </div>

                <!-- Hover Overlay -->
                <div
                  class="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-md"
                  style="background-color: rgba(0, 0, 0, 0.7);"
                >
                  <button class="w-full rounded-md bg-white h-6 text-[10px] font-bold hover:brightness-90 transition-all">
                    Play
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Right Arrow -->
        <button
          @click="scrollRight"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center"
          :class="{ 'opacity-40 cursor-not-allowed': scrollPosition >= maxScroll }"
          :disabled="scrollPosition >= maxScroll"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { casinoGames } from '../../../assets/games/casinoGames.js'

const router = useRouter()
const scrollContainer = ref(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)

// Use at least 15 games from the shared catalog
const categoryGradients = {
  slots: 'linear-gradient(135deg,#6d28d9,#a855f7)',
  crash: 'linear-gradient(135deg,#7a1f1f,#a32d2d)',
  instant: 'linear-gradient(135deg,#0e7490,#22d3ee)',
  live: 'linear-gradient(135deg,#047857,#34d399)',
  jackpot: 'linear-gradient(135deg,#b45309,#f59e0b)',
}

const games = ref(
  casinoGames.slice(0, 18).map((g) => ({
    ...g,
    gradient: categoryGradients[g.category] || 'linear-gradient(135deg,#7a1f1f,#a32d2d)',
  }))
)

const openCasinoLobby = () => {
  router.push({ name: 'casino' })
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const updateScrollPosition = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value
    scrollPosition.value = container.scrollLeft
    maxScroll.value = container.scrollWidth - container.clientWidth
  }
}

onMounted(async () => {
  await nextTick()
  if (scrollContainer.value) {
    maxScroll.value = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
    updateScrollPosition()
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
