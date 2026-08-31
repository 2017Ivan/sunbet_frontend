<template>
  <div class="bg-white min-h-full">
    <!-- Header banner -->
    <div class="relative overflow-hidden bg-gradient-to-r from-rose-700 via-rose-800 to-rose-950">
      <div class="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div class="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
      <div class="relative max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-white mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Live Casino Lobby
        </span>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Casino Games
        </h1>
        <p class="text-sm text-rose-100/80 mt-1 max-w-xl">
          {{ filteredGames.length }} games available — slots, crash, instant win, live & jackpot.
        </p>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 py-5">
      <!-- Search -->
      <div class="flex flex-col sm:flex-row gap-3 mb-5 items-stretch sm:items-center">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search games, providers..."
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Provider filter -->
        <select
          v-model="selectedProvider"
          class="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
        >
          <option v-for="p in providers" :key="p" :value="p">{{ p }}</option>
        </select>

        <button
          @click="clearFilters"
          class="px-4 py-2.5 text-sm font-semibold text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <!-- Category filter tabs -->
      <div class="flex gap-2 flex-wrap mb-6">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-4 py-2 text-sm font-bold rounded-full border transition-all"
          :class="selectedCategory === cat.id
            ? 'bg-rose-600 text-white border-rose-600 shadow'
            : 'bg-white text-gray-600 border-gray-300 hover:border-rose-400 hover:text-rose-600'"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- No results -->
      <div v-if="filteredGames.length === 0" class="py-16 text-center">
        <div class="text-5xl mb-2">🎰</div>
        <p class="text-gray-600 font-semibold">No games found</p>
        <p class="text-sm text-gray-400 mt-1">Try a different search or category</p>
      </div>

      <!-- Games grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          v-for="game in filteredGames"
          :key="game.id"
          class="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
          @click="playGame(game)"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-[4/3] bg-cover bg-center bg-no-repeat overflow-hidden"
               :style="game.image ? { backgroundImage: `url('${game.image}')` } : { background: game.gradient }">
            <div v-if="!game.image" class="w-full h-full flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110">
              {{ game.icon }}
            </div>

            <!-- badges -->
            <div class="absolute top-2 left-2 flex gap-1">
              <span v-if="game.hot" class="text-[9px] font-black text-white bg-rose-600 px-1.5 py-0.5 rounded">HOT</span>
              <span v-if="game.popular" class="text-[9px] font-black text-white bg-amber-500 px-1.5 py-0.5 rounded">POPULAR</span>
            </div>
            <span v-if="game.rtp" class="absolute top-2 right-2 text-[9px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded">
              RTP {{ game.rtp }}
            </span>

            <!-- hover overlay -->
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span class="px-4 py-1.5 rounded-full bg-white text-rose-700 text-sm font-black">Play Now</span>
            </div>
          </div>

          <!-- Game name / provider -->
          <div class="p-2.5 flex-1">
            <p class="text-sm font-bold text-gray-800 leading-tight truncate">{{ game.name }}</p>
            <p class="text-[11px] text-gray-400 mt-0.5 truncate">{{ game.provider }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { casinoGames, casinoCategories, casinoProviders } from '../../assets/games/casinoGames.js'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedProvider = ref('All Providers')

const categoryGradients = {
  slots: 'linear-gradient(135deg,#6d28d9,#a855f7)',
  crash: 'linear-gradient(135deg,#7a1f1f,#a32d2d)',
  instant: 'linear-gradient(135deg,#0e7490,#22d3ee)',
  live: 'linear-gradient(135deg,#047857,#34d399)',
  jackpot: 'linear-gradient(135deg,#b45309,#f59e0b)',
  default: 'linear-gradient(135deg,#7a1f1f,#a32d2d)',
}

const games = computed(() =>
  casinoGames.map((g) => ({ ...g, gradient: categoryGradients[g.category] || categoryGradients.default }))
)

const categories = casinoCategories
const providers = casinoProviders

const filteredGames = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return games.value.filter((g) => {
    const matchCategory =
      selectedCategory.value === 'all' ||
      selectedCategory.value === 'popular' && g.popular ||
      selectedCategory.value === g.category
    const matchProvider =
      selectedProvider.value === 'All Providers' || g.provider === selectedProvider.value
    const matchSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.provider.toLowerCase().includes(q)
    return matchCategory && matchProvider && matchSearch
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedProvider.value = 'All Providers'
}

const playGame = (game) => {
  // Placeholder: route to individual game page if it exists, else stay in lobby
  router.push({ name: 'casino' })
}
</script>

<style scoped>
</style>
