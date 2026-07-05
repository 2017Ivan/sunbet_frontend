<template>
  <section class="w-full bg-white ">
    <div class="max-w-screen-xl mx-auto ">
      
      <!-- Tabs -->
      <div class="flex items-center  overflow-x-auto scrollbar-hide border-b border-gray-100 pt-1 bg-gray-400/40 ">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold  whitespace-nowrap transition-all duration-300"
          :class="activeTab === tab.key 
            ? 'bg-gray-900 text-rose-400  scale-105 border-t-2 border-rose-400' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Content - Horizontal Scroll -->
      <div class="overflow-x-auto scrollbar-hide  px-0.5">
        <div class="flex gap-1 ">
          
          <!-- Game Cards -->
          <div
            v-for="(game, index) in filteredGames"
            :key="index"
            class="flex-shrink-0 w-[80px] sm:w-[80px] bg-gray-50  border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <!-- Game Image/Icon -->
            <div class="relative h-[50px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span class="text-2xl sm:text-2xl font-black text-gray-300/30 group-hover:text-rose-500/20 transition-colors duration-300">
                {{ game.icon }}
              </span>
            
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
    category: 'crash' 
  },
  { 
    name: 'SPACEMAN', 
    provider: 'SPRIBE', 
    icon: '👨‍🚀', 
    category: 'crash' 
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '💣', 
    category: 'crash' 
  },
  { 
    name: 'AirStar', 
    provider: 'BOMBAZ', 
    icon: '✈️', 
    category: 'crash' 
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '🎯', 
    category: 'crash' 
  },
  { 
    name: 'BOMBAZ', 
    provider: 'BOMBAZ', 
    icon: '🔥', 
    category: 'crash' 
  },
  // Casino Games
  { 
    name: 'Starburst', 
    provider: 'NetEnt', 
    icon: '💎', 
    category: 'casino' 
  },
  { 
    name: 'Book of Dead', 
    provider: 'Play\'n GO', 
    icon: '📖', 
    category: 'casino' 
  },
  { 
    name: 'Mega Moolah', 
    provider: 'Microgaming', 
    icon: '🦁', 
    category: 'casino' 
  },
  { 
    name: 'Gonzo\'s Quest', 
    provider: 'NetEnt', 
    icon: '🗿', 
    category: 'casino' 
  },
  // Virtuals Games
  { 
    name: 'Virtual Football', 
    provider: 'Betradar', 
    icon: '⚽', 
    category: 'virtuals' 
  },
  { 
    name: 'Virtual Horse Racing', 
    provider: 'Betradar', 
    icon: '🐎', 
    category: 'virtuals' 
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