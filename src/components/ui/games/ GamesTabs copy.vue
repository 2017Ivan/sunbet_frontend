sasa sikiliza hii component naomba ondoa tabs 
nataka horizontal scroll ambayo iwe ina onesha izo crash tu na ziwe na left  & right arrow

<template>
  <section class="w-full bg-white">
    <div class="max-w-screen-xl mx-auto">
      
      <!-- Tabs -->
      <div class="flex items-center overflow-x-auto scrollbar-hide border-b border-gray-100 pt-1 bg-gray-400/40">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300"
          :class="activeTab === tab.key 
            ? 'bg-gray-900 text-rose-400 scale-105 border-t-2 border-rose-400' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Content - Horizontal Scroll -->
      <div class="overflow-x-auto scrollbar-hide px-0.5 py-1">
        <div class="flex gap-1">
          
          <!-- Game Cards - 65px x 65px -->
          <div
            v-for="(game, index) in filteredGames"
            :key="index"
            class="relative w-[55px] h-[55px] flex-shrink-0"
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
          </div>

        </div>
      </div>

    

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('crash')

const tabs = [
  { key: 'crash', label: 'CRASH' },
  { key: 'casino', label: 'CASINO' },
  { key: 'virtuals', label: 'VIRTUALS' },
  { key: 'promotions', label: 'PROMOTIONS' },
  { key: 'getapp', label: 'GET APP' }
]

const games = ref([
  // Crash Games
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
  // Casino Games
  { 
    name: 'Starburst', 
    provider: 'NetEnt', 
    icon: '💎', 
    category: 'casino',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: 'Book of Dead', 
    provider: "Play'n GO", 
    icon: '📖', 
    category: 'casino',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: 'Mega Moolah', 
    provider: 'Microgaming', 
    icon: '🦁', 
    category: 'casino',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: "Gonzo's Quest", 
    provider: 'NetEnt', 
    icon: '🗿', 
    category: 'casino',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  // Virtuals Games
  { 
    name: 'Virtual Football', 
    provider: 'Betradar', 
    icon: '⚽', 
    category: 'virtuals',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: 'Virtual Horse Racing', 
    provider: 'Betradar', 
    icon: '🐎', 
    category: 'virtuals',
    image: 'https://cdn.xpress-ix.com/images/279_5122638.png?v_=5'
  },
  { 
    name: 'Virtual Tennis', 
    provider: 'Betradar', 
    icon: '🎾', 
    category: 'virtuals' 
  },
  // Promotions
  { 
    name: 'Welcome Bonus', 
    provider: 'SunBet', 
    icon: '🎁', 
    category: 'promotions' 
  },
  { 
    name: 'Free Spins', 
    provider: 'SunBet', 
    icon: '🔄', 
    category: 'promotions' 
  },
  { 
    name: 'Cashback', 
    provider: 'SunBet', 
    icon: '💰', 
    category: 'promotions' 
  },
  // Get App
  { 
    name: 'Download App', 
    provider: 'SunBet', 
    icon: '📱', 
    category: 'getapp' 
  },
  { 
    name: 'Play Store', 
    provider: 'Google', 
    icon: '📲', 
    category: 'getapp' 
  },
  { 
    name: 'App Store', 
    provider: 'Apple', 
    icon: '🍎', 
    category: 'getapp' 
  },
])

const filteredGames = computed(() => {
  return games.value.filter(game => game.category === activeTab.value)
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