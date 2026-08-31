<template>
  <div 
    @click="$emit('click')"
    class="bg-gray-800 py-2.5 px-2 border-b border-gray-700/40 cursor-pointer hover:bg-gray-750 transition-colors duration-150"
  >
    <div class="flex items-center justify-between gap-2">
      
      <!-- Teams & Time Column -->
      <div class="flex-1 min-w-0">
        <!-- Status & Time Header -->
        <div class="text-xs flex items-center gap-2 mb-1.5">
          <span 
            v-if="isLive" 
            class="px-1.5 py-0.5 text-[10px] font-extrabold text-white bg-rose-600 rounded animate-pulse"
          >
            LIVE
          </span>
          <span 
            v-else-if="game.status === 'HALF_TIME'" 
            class="px-1.5 py-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded"
          >
            HT
          </span>
          <span 
            v-else-if="game.status === 'FINISHED'" 
            class="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-gray-700 rounded"
          >
            FT
          </span>

          <!-- Time Display (Live Minutes / HT / Upcoming Format) -->
          <span 
            class="text-xs font-semibold" 
            :class="isLive ? 'text-rose-400 animate-pulse' : 'text-gray-400'"
          >
            {{ displayTime }}
          </span>
        </div>

        <!-- Teams Name & Scores -->
        <div class="space-y-1">
          <!-- Home Team -->
          <div class="flex items-center justify-between pr-2">
            <span class="text-sm font-semibold text-gray-200 truncate">{{ game.homeTeam }}</span>
            <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2">
              {{ game.currentScore?.home ?? 0 }}
            </span>
          </div>

          <!-- Away Team -->
          <div class="flex items-center justify-between pr-2">
            <span class="text-sm font-semibold text-gray-200 truncate">{{ game.awayTeam }}</span>
            <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2">
              {{ game.currentScore?.away ?? 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Odds Buttons -->
      <div class="flex gap-1 flex-shrink-0" @click.stop>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
          :class="getButtonClass('home')"
          @click="handleOddsClick('home')"
          :disabled="!game.odds || !game.odds.home"
        >
          {{ formatOdds(game.odds?.home) }}
        </button>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
          :class="getButtonClass('draw')"
          @click="handleOddsClick('draw')"
          :disabled="!game.odds || !game.odds.draw"
        >
          {{ formatOdds(game.odds?.draw) }}
        </button>
        <button 
          class="w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded"
          :class="getButtonClass('away')"
          @click="handleOddsClick('away')"
          :disabled="!game.odds || !game.odds.away"
        >
          {{ formatOdds(game.odds?.away) }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBetStore } from '../../../stores/bet/betStore.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const betStore = useBetStore()

const isLive = computed(() => props.game?.status === 'LIVE' || props.game?.live || false)

const isLiveOrFinished = computed(() => {
  return isLive.value || ['HALF_TIME', 'FINISHED'].includes(props.game.status)
})

// ============================================
// 📅 HELPER FUNCTION KWA AJILI YA UPCOMING MATCH FORMATTING
// ============================================
function formatUpcomingTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return props.game?.time || ''

  try {
    let matchDateObj

    if (dateStr && timeStr) {
      matchDateObj = new Date(`${dateStr}T${timeStr}`)
      if (isNaN(matchDateObj.getTime())) {
        matchDateObj = new Date(`${dateStr} ${timeStr}`)
      }
    } else if (dateStr) {
      matchDateObj = new Date(dateStr)
    } else {
      return timeStr
    }

    if (isNaN(matchDateObj.getTime())) {
      return timeStr || dateStr
    }

    const today = new Date()
    const isToday =
      matchDateObj.getDate() === today.getDate() &&
      matchDateObj.getMonth() === today.getMonth() &&
      matchDateObj.getFullYear() === today.getFullYear()

    const timeFormatted = matchDateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    if (isToday) {
      return `${timeFormatted} Today`
    } else {
      const dayName = matchDateObj.toLocaleDateString('en-US', { weekday: 'short' })
      const dayNum = String(matchDateObj.getDate()).padStart(2, '0')
      const monthNum = String(matchDateObj.getMonth() + 1).padStart(2, '0')

      return `${timeFormatted} ${dayName} ${dayNum}/${monthNum}`
    }
  } catch (err) {
    return timeStr || dateStr || ''
  }
}

// ============================================
// ⏱️ REALTIME COMPUTED DAKIKA & DATE/TIME UPDATE (BOOMBET LOGIC)
// ============================================
const displayTime = computed(() => {
  if (!props.game) return ''

  if (isLive.value) {
    // 1. Kama Socket / Store imepokea elapsed_minute
    if (props.game.elapsed_minute !== undefined && props.game.elapsed_minute !== null) {
      const elapsed = parseInt(props.game.elapsed_minute)
      return elapsed >= 90 ? "90+'" : `${elapsed}'`
    }

    // 2. Kama socket / backend time ina string yenye dakika (mfano "45'")
    if (typeof props.game.time === 'string' && props.game.time.includes("'")) {
      return props.game.time
    }

    // 3. Clock time calculation kama fallback
    if (props.game.date && props.game.time && props.game.time.includes(':')) {
      const matchStart = new Date(`${props.game.date} ${props.game.time}`)
      const now = new Date()
      const elapsedMinutes = Math.floor((now - matchStart) / (1000 * 60))

      if (!isNaN(elapsedMinutes) && elapsedMinutes >= 0) {
        return elapsedMinutes >= 90 ? "90+'" : `${elapsedMinutes}'`
      }
    }

    return 'LIVE'
  }

  if (props.game.status === 'HALF_TIME') return 'HT'
  if (props.game.status === 'FINISHED') return 'FT'

  // UPCOMING MATCH DISPLAY FORMAT
  return formatUpcomingTime(props.game.date || props.game.match_date, props.game.time || props.game.match_time)
})

const formatOdds = (odds) => {
  if (odds === undefined || odds === null || isNaN(odds)) return '-'
  return parseFloat(odds).toFixed(2)
}

const isSelected = (type) => {
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  return betStore.isSelected(props.game.id, marketKey)
}

const getButtonClass = (type) => {
  const selected = isSelected(type)
  const hasOdds = props.game.odds && props.game.odds[type]
  
  if (selected) {
    return 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105 font-extrabold'
  }
  if (!hasOdds) {
    return 'bg-gray-800 text-gray-600 border border-gray-750 cursor-not-allowed opacity-50'
  }
  return 'bg-gray-700 text-gray-200 hover:bg-rose-600 hover:text-white border border-gray-600'
}

const handleOddsClick = (type) => {
  if (!props.game.odds || !props.game.odds[type]) return
  
  const marketKey = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  const pick = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  
  if (betStore.isSelected(props.game.id, marketKey)) {
    betStore.removeFromSlip(props.game.id, marketKey)
    return
  }
  
  const selection = {
    matchId: props.game.id,
    matchName: `${props.game.homeTeam} vs ${props.game.awayTeam}`,
    league: props.game.league,
    market: '1X2 | Full Time',
    marketKey: marketKey,
    pick: pick,
    odds: parseFloat(props.game.odds[type]),
    type: 'sports',
    time: props.game.time || '',
    date: props.game.date || ''
  }
  
  betStore.addToSlip(selection)
  betStore.isOpen = true
}
</script>