<template>
  <section class="w-full overflow-hidden bg-gray-300/50">
    <div class="max-w-screen-xl mx-auto">
      <div class="flex items-center justify-between mb-2">
        <!-- <h6 class="text-sm italic sm:text-sm font-bold text-gray-600 flex items-center gap-2">
          Recent Winners
        </h6> -->
      </div>

      <div 
        ref="scrollContainer"
        class="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4 select-none functionality-scroll"
        @mouseenter="pauseAutoScroll"
        @mouseleave="resumeAutoScroll"
        @touchstart="pauseAutoScroll"
        @touchend="resumeAutoScroll"
      >
        <div
          v-for="(winner, i) in duplicatedWinners"
          :key="i"
          class="relative flex-col flex-shrink-0 flex items-start gap-1 bg-gray-900 border border-[#2A2A2A] rounded-br-[30px] px-3 sm:px-4 py-2.5 hover:border-[#A32D2D]/30 hover:bg-[#1A1A1A] transition-all duration-300 group overflow-hidden"
        >
          <!-- TrophyIcon Background -->
          <div class="absolute -bottom-6 -right-1 text-amber-800/70 group-hover:text-white/10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
            <TrophyIcon class="w-20 h-20 sm:w-24 sm:h-24" />
          </div>
         

          <!-- Info - Show Phone Number instead of Name -->
          <div class="flex-1 min-w-0 relative z-10">
            <p class="text-xs sm:text-sm font-semibold text-white truncate">{{ getMaskedPhone(i) }}</p>
          </div>

          <!-- Amount -->
          <div class="text-right flex-shrink-0 relative z-10">
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
import { TrophyIcon } from '@heroicons/vue/24/solid'



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