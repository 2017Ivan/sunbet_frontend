<template>
  <section class="w-full bg-white">
    <div class="max-w-screen-xl mx-auto relative">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-2 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-300 py-2 ">
        <h2 class="text-base sm:text-lg font-bold text-gray-100 flex items-center gap-2">
          <span class="text-rose-500">🔥</span>
          Casino
        </h2>
        <span class="text-xs font-bold text-rose-400">Games</span>
      </div>

      <!-- Horizontal Scroll with Arrows -->
      <div class="relative">
        
        <!-- Left Arrow -->
        <button 
          @click="scrollLeft"
          class="absolute left-2  top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center"
          :class="{ 'opacity-50 cursor-not-allowed': scrollPosition === 0 }"
          :disabled="scrollPosition === 0"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Scroll Container -->
        <div 
          ref="scrollContainer"
          class="overflow-x-auto scrollbar-hide py-0.5   px-0.5"
          @scroll="updateScrollPosition"
        >
          <div class="flex gap-2 sm:gap-3">
            
            <!-- Game Cards - 65px x 65px -->
            <div
              v-for="(game, index) in games"
              :key="index"
              class="relative w-[65px] h-[65px] flex-shrink-0"
              style="overflow: visible;"
            >
              <!-- Game Image Container -->
              <div 
                class="w-full h-full bg-no-repeat bg-cover bg-center cursor-pointer bg-gray-200 rounded-md overflow-hidden relative"
                :style="{ backgroundImage: `url('${game.image || 'https://via.placeholder.com/65x65/333/666?text=' + game.icon}')` }"
              >
                <!-- Fallback if no image -->
                <div v-if="!game.image" class="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  {{ game.icon }}
                </div>

                <!-- Top Icons -->
                <div class="absolute inset-0 flex items-start justify-between p-1">
                  <!-- Star Icon -->
                  <div class="w-4 h-4 hover:[&_svg]:fill-secondary">
                    <svg fill="#FEFEFE" stroke="none" style="width:13px; height:13px;">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#generic-sprite-star"></use>
                    </svg>
                  </div>
                  <!-- Info Icon -->
                  <div class="w-4 h-4 hover:[&_svg]:fill-secondary">
                    <svg fill="#FEFEFE" stroke="none" style="width:13px; height:13px;">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#generic-sprite-info"></use>
                    </svg>
                  </div>
                </div>

                <!-- Hover Overlay -->
                <div 
                  class="absolute inset-0 flex items-center justify-center transition-all duration-200 scale-0 hover:scale-100 rounded-md"
                  style="background-color: rgba(0, 0, 0, 0.7);"
                >
                  <div class="flex flex-col items-center justify-center gap-1 px-1 w-full">
                    <button class="w-full rounded-md bg-white h-6 text-[10px] font-bold hover:brightness-90 transition-all">
                      Onyesho
                    </button>
                    <button class="w-full rounded-md bg-rose-500 text-white h-6 text-[10px] font-bold hover:brightness-90 transition-all">
                      Cheza
                    </button>
                  </div>
                </div>
              </div>

              <!-- Game Name -->
              <!-- <span class="absolute top-full left-0 w-full text-[9px] pt-1 leading-3 truncate text-gray-600 text-center">
                {{ game.name }}
              </span> -->
            </div>

          </div>
        </div>

        <!-- Right Arrow -->
        <button 
          @click="scrollRight"
          class="absolute right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center"
          :class="{ 'opacity-50 cursor-not-allowed': scrollPosition >= maxScroll }"
          :disabled="scrollPosition >= maxScroll"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      <!-- Scroll Indicator Dots -->
      <!-- <div class="flex justify-center gap-1.5 mt-3">
        <span 
          v-for="i in Math.ceil(games.length / 4)" 
          :key="i"
          class="w-1.5 h-1.5 rounded-full transition-all duration-300"
          :class="i === activeDot ? 'bg-rose-500 w-3' : 'bg-gray-300'"
        ></span>
      </div> -->

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const scrollContainer = ref(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)
const activeDot = ref(1)

const games = ref([
  { 
    name: 'JetX', 
    provider: 'Functor', 
    icon: '🚀', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: 'SPACEMAN', 
    provider: 'SPRIBE', 
    icon: '👨‍🚀', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_3691767.png?v_=5'
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '💣', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/146_419174.png?v_=5'
  },
  { 
    name: 'AirStar', 
    provider: 'BOMBAZ', 
    icon: '✈️', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_8160236.png?v_=5'
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '🎯', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_7250732.jpeg?v_=5'
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '🔥', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_4340647.jpeg?v_=5'
  },
  { 
    name: 'Aviator', 
    provider: 'SPRIBE', 
    icon: '✈️', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_3691767.png?v_=5'
  },
  { 
    name: 'Spaceman', 
    provider: 'SPRIBE', 
    icon: '👨‍🚀', 
    category: 'crash',
    image: 'https://cdn.xpress-ix.com/images/171_3691767.png?v_=5'
  },
])

// Scroll functions
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
    
    // Update active dot
    const cardWidth = 65 + 12 // card width + gap
    const visibleCards = Math.floor(container.clientWidth / cardWidth)
    const currentCard = Math.floor(container.scrollLeft / cardWidth)
    activeDot.value = Math.floor(currentCard / visibleCards) + 1
  }
}

// Get scroll position on mount
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