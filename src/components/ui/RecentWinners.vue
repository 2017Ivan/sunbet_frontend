<template>
  <section class="w-full px-3 overflow-hidden">
    <div class="max-w-screen-xl mx-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-5">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          Recent Winners
        </h2>
        <RouterLink to="/leaderboard" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
          Leaderboard 
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </RouterLink>
      </div>

      <div 
        ref="scrollContainer"
        class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4 select-none functionality-scroll"
        @mouseenter="pauseAutoScroll"
        @mouseleave="resumeAutoScroll"
        @touchstart="pauseAutoScroll"
        @touchend="resumeAutoScroll"
      >
        <div
          v-for="(winner, i) in duplicatedWinners"
          :key="i"
          class="flex-shrink-0 w-[280px] sm:w-[320px] flex items-center gap-2 sm:gap-3 bg-[#161616] border border-[#2A2A2A] rounded-br-[26px] px-3 sm:px-4 py-2.5 sm:py-6 hover:border-[#A32D2D]/30 hover:bg-[#1A1A1A] transition-all duration-300 group"
        >
        

      

          <!-- Info - Show Phone Number instead of Name -->
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-semibold text-white truncate">{{ getMaskedPhone(i) }}</p>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  winners: {
    type: Array,
    required: true,
    default: () => []
  },
  scrollSpeed: {
    type: Number,
    default: 0.6 
  }
})

const scrollContainer = ref(null)
let animationId = null
let isPaused = false
let currentScrollX = 0 

const duplicatedWinners = computed(() => {
  if (!props.winners.length) return []
  return [...props.winners, ...props.winners, ...props.winners]
})

const getRankIndex = (index) => props.winners.length ? index % props.winners.length : 0

const getRankDisplay = (index) => {
  const i = getRankIndex(index)
  if (i < 3) return ['🥇', '🥈', '🥉'][i]
  return i + 1
}

const getWinnerColor = (index) => props.winners[getRankIndex(index)]?.avatarColor || '#1e1e1e'
const getWinnerInitials = (index) => props.winners[getRankIndex(index)]?.initials || ''
const getWinnerName = (index) => props.winners[getRankIndex(index)]?.name || ''
const getWinnerBet = (index) => props.winners[getRankIndex(index)]?.bet || ''
const getWinnerSport = (index) => props.winners[getRankIndex(index)]?.sport || ''
const getWinnerAmount = (index) => props.winners[getRankIndex(index)]?.amount || ''
const getWinnerTime = (index) => props.winners[getRankIndex(index)]?.time || ''

// Function to mask phone number
const getMaskedPhone = (index) => {
  const phone = props.winners[getRankIndex(index)]?.phone || ''
  if (!phone) return 'Unknown'
  
  // Format: +255 677 453 xxx
  // Remove all spaces and non-digits
  const clean = phone.replace(/\D/g, '')
  
  if (clean.length === 12) {
    // +255 677 453 123
    return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9, 10)}xx`
  } else if (clean.length === 10) {
    // 677 453 123
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 7)}xx`
  } else if (clean.length === 9) {
    // 677 45 3123
    return `${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 6)}xx`
  } else {
    // Show partial
    const visible = Math.min(clean.length - 2, 6)
    const masked = clean.slice(0, visible) + 'xx'
    return masked
  }
}

const startAutoScroll = () => {
  if (!scrollContainer.value || props.winners.length === 0) return

  const container = scrollContainer.value
  
  const scroll = () => {
    if (isPaused) {
      animationId = requestAnimationFrame(scroll)
      return
    }

    const oneThirdScrollWidth = container.scrollWidth / 3

    currentScrollX += props.scrollSpeed

    if (currentScrollX >= oneThirdScrollWidth) {
      currentScrollX -= oneThirdScrollWidth
    }

    container.scrollLeft = currentScrollX
    animationId = requestAnimationFrame(scroll)
  }
  
  animationId = requestAnimationFrame(scroll)
}

const pauseAutoScroll = () => {
  isPaused = true
}

const resumeAutoScroll = () => {
  if (scrollContainer.value) {
    currentScrollX = scrollContainer.value.scrollLeft
  }
  isPaused = false
}

onMounted(async () => {
  await nextTick()

  if (props.winners.length > 0) {
    startAutoScroll()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

defineExpose({
  pauseAutoScroll,
  resumeAutoScroll
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
.functionality-scroll {
  scroll-behavior: auto !important; 
}
</style>