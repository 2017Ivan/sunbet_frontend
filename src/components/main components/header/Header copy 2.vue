<template>
  <header class="bg-gradient-to-r from-rose-900 to-rose-950 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      
      <!-- ROW 1: Logo + User Actions -->
      <div class="flex items-center justify-between h-14 sm:h-16 border-b border-rose-800">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span class="text-white font-bold text-base sm:text-xl">☀️</span>
          </div>
          <div class="min-w-0">
            <h1 class="text-white font-bold text-base sm:text-xl tracking-tight truncate">SunBetting</h1>
            <p class="text-rose-300 text-xs hidden sm:block">Bet with the sun</p>
          </div>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          <!-- Search Button - Toggles search row -->
          <button 
            @click="toggleSearch" 
            class="p-1.5 sm:p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            :class="{ 'bg-white/20 text-white': isSearchOpen }"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Notifications -->
          <button class="relative p-1.5 sm:p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          </button>

          <!-- User Profile / Login -->
          <div class="flex items-center space-x-1 sm:space-x-2">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-white text-xs sm:text-sm font-medium">John Doe</span>
              <span class="text-rose-300 text-xs">Balance: $500</span>
            </div>
            <button class="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-rose-400 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                JD
              </div>
              <svg class="w-3 h-3 sm:w-4 sm:h-4 text-rose-200 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ROW 2: Search Bar (Hidden by default) -->
      <div 
        v-show="isSearchOpen"
        class="py-2 sm:py-3 transition-all duration-300"
        :class="{ 'animate-slide-down': isSearchOpen }"
      >
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Search Input -->
          <div class="flex-1 relative min-w-0">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search games, teams..." 
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/10 text-white placeholder-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
              @keyup.enter="performSearch"
              autofocus
            />
            <!-- Clear button -->
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-white transition-colors duration-200"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Button - Hidden on mobile, shows icon only -->
          <button 
            @click="performSearch"
            class="px-3 sm:px-6 py-2 sm:py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/25 flex items-center justify-center space-x-1 sm:space-x-2 whitespace-nowrap"
          >
            <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="hidden sm:inline">Search</span>
          </button>

          <!-- Cancel/Close Button -->
          <button 
            @click="closeSearch"
            class="p-1.5 sm:p-2.5 text-rose-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex-shrink-0"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Suggestions -->
        <div v-if="searchQuery.length > 0" class="mt-2 sm:mt-3 space-y-1">
          <div class="text-xs text-rose-300 px-2">Recent Searches</div>
          <div class="flex flex-wrap gap-1 sm:gap-2">
            <span 
              v-for="suggestion in suggestions" 
              :key="suggestion"
              @click="searchQuery = suggestion"
              class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-rose-200 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-all duration-200"
            >
              {{ suggestion }}
            </span>
          </div>
        </div>
      </div>

      <!-- ROW 3: Navigation Menu -->
      <div class="flex items-center justify-between py-1.5 sm:py-2">
        <nav class="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto hide-scrollbar flex-1 min-w-0">
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Home
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Live
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Sports
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Casino
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Promo
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Jackpot
          </a>
          <a href="#" class="px-2 sm:px-4 py-1.5 sm:py-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap">
            Virtual
          </a>
        </nav>

        <!-- Quick Stats -->
        <div class="hidden lg:flex items-center space-x-4 text-xs text-rose-300 flex-shrink-0">
          <span class="flex items-center space-x-1">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Live: 24</span>
          </span>
          <span>|</span>
          <span>156 Matches</span>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// State for search
const isSearchOpen = ref(false)
const searchQuery = ref('')

// Suggestions data
const suggestions = ref([
  'Manchester United',
  'Real Madrid',
  'Liverpool vs Arsenal',
  'NBA Playoffs',
  'Tennis US Open'
])

// Toggle search bar
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value) {
    searchQuery.value = ''
  }
}

// Close search bar
const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

// Clear search query
const clearSearch = () => {
  searchQuery.value = ''
}

// Perform search
const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    alert(`Searching for: ${searchQuery.value}`)
  }
}
</script>

<style scoped>
/* Hide scrollbar for navigation on mobile */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Slide down animation for search bar */
.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>