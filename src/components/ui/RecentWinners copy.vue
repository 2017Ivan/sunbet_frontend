<template>
  <section class="w-full px-3 sm:px-4 pb-8 sm:pb-10">
    <div class="max-w-screen-xl mx-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-5">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>🏅</span> Recent Winners
        </h2>
        <RouterLink to="/leaderboard" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
          Leaderboard 
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </RouterLink>
      </div>

      <!-- Horizontal scroll container with auto-scroll -->
      <div 
        ref="scrollContainer"
        class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4 scroll-smooth"
        @mouseenter="pauseAutoScroll"
        @mouseleave="startAutoScroll"
        @touchstart="pauseAutoScroll"
        @touchend="startAutoScroll"
      >
        <!-- Duplicate winners for seamless loop -->
        <div
          v-for="(winner, i) in duplicatedWinners"
          :key="i"
          class="flex-shrink-0 w-[280px] sm:w-[320px] flex items-center gap-2 sm:gap-3 bg-[#161616] border border-[#2A2A2A] rounded-[14px] px-3 sm:px-4 py-2.5 sm:py-3 hover:border-[#A32D2D]/30 hover:bg-[#1A1A1A] transition-all duration-300 group"
        >
          <!-- Rank -->
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0"
            :class="[
              getRankIndex(i) === 0 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
              getRankIndex(i) === 1 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
              getRankIndex(i) === 2 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
              'bg-[#1E1E1E] text-[#606060]'
            ]"
          >
            {{ getRankDisplay(i) }}
          </div>

          <!-- Avatar -->
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            :style="{ background: getWinnerColor(i) }"
          >
            {{ getWinnerInitials(i) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-semibold text-white truncate">{{ getWinnerName(i) }}</p>
            <p class="text-[10px] sm:text-xs text-[#606060] truncate">{{ getWinnerBet(i) }} • {{ getWinnerSport(i) }}</p>
          </div>

          <!-- Amount -->
          <div class="text-right flex-shrink-0">
            <p class="text-xs sm:text-sm font-black text-[#22C55E] animate-pulse">+{{ getWinnerAmount(i) }}</p>
            <p class="text-[8px] sm:text-[10px] text-[#606060]">{{ getWinnerTime(i) }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  winners: {
    type: Array,
    required: true,
    default: () => []
  },
  scrollSpeed: {
    type: Number,
    default: 1 // pixels per frame
  }
})

const scrollContainer = ref(null)
let animationId = null
let isPaused = false
let isAtStart = ref(true)
let isAtEnd = ref(false)

// Duplicate winners for seamless scrolling
const duplicatedWinners = computed(() => {
  return [...props.winners, ...props.winners]
})

// Helper functions to handle duplicated array indexing
const getRankIndex = (index) => {
  return index % props.winners.length
}

const getRankDisplay = (index) => {
  const i = index % props.winners.length
  if (i < 3) {
    const medals = ['🥇', '🥈', '🥉']
    return medals[i]
  }
  return i + 1
}

const getWinnerColor = (index) => {
  const i = index % props.winners.length
  return props.winners[i].avatarColor
}

const getWinnerInitials = (index) => {
  const i = index % props.winners.length
  return props.winners[i].initials
}

const getWinnerName = (index) => {
  const i = index % props.winners.length
  return props.winners[i].name
}

const getWinnerBet = (index) => {
  const i = index % props.winners.length
  return props.winners[i].bet
}

const getWinnerSport = (index) => {
  const i = index % props.winners.length
  return props.winners[i].sport
}

const getWinnerAmount = (index) => {
  const i = index % props.winners.length
  return props.winners[i].amount
}

const getWinnerTime = (index) => {
  const i = index % props.winners.length
  return props.winners[i].time
}

// Auto-scroll logic
const startAutoScroll = () => {
  if (isPaused) return
  if (animationId) return
  
  const scroll = () => {
    if (!scrollContainer.value || isPaused) {
      animationId = null
      return
    }

    const container = scrollContainer.value
    const maxScroll = container.scrollWidth - container.clientWidth
    
    // Check if at end
    if (container.scrollLeft >= maxScroll - 1) {
      // Smoothly reset to start for seamless loop
      container.scrollLeft = 0
      isAtStart.value = true
      isAtEnd.value = false
    } else {
      container.scrollLeft += props.scrollSpeed
      isAtStart.value = container.scrollLeft < 10
      isAtEnd.value = container.scrollLeft >= maxScroll - 10
    }
    
    animationId = requestAnimationFrame(scroll)
  }
  
  animationId = requestAnimationFrame(scroll)
}

const pauseAutoScroll = () => {
  isPaused = true
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const resumeAutoScroll = () => {
  isPaused = false
  if (!animationId) {
    startAutoScroll()
  }
}

// Manual scroll controls
const scrollToStart = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ left: 0, behavior: 'smooth' })
  }
}

const scrollToMiddle = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value
    const middle = (container.scrollWidth - container.clientWidth) / 2
    container.scrollTo({ left: middle, behavior: 'smooth' })
  }
}

const scrollToEnd = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value
    container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: 'smooth' })
  }
}

// Update scroll position indicators
const updateScrollIndicators = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const maxScroll = container.scrollWidth - container.clientWidth
  isAtStart.value = container.scrollLeft < 10
  isAtEnd.value = container.scrollLeft >= maxScroll - 10
}

// Lifecycle
onMounted(() => {
  startAutoScroll()
  
  // Add scroll event listener for indicators
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateScrollIndicators)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateScrollIndicators)
  }
})

// Expose methods for parent component if needed
defineExpose({
  pauseAutoScroll,
  resumeAutoScroll,
  scrollToStart,
  scrollToMiddle,
  scrollToEnd
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