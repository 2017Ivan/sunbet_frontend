<template>
  <div 
    @click="$emit('click')"
    class="bg-white py-2.5 px-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
  >
   <div class="flex items-center justify-between gap-2">
      
  <!-- Teams & Time Column -->
  <div class="flex-1 min-w-0">
    <!-- Status & Time Header (left) + Fire trend (right) -->
    <div class="flex items-center gap-2 mb-1">
      <div class="flex items-center gap-2">
        <span 
          v-if="isLive" 
          class="px-1.5 py-0.5 text-[10px] font-extrabold text-white bg-emerald-800 rounded animate-pulse"
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
          class="px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-100 rounded"
        >
          FT
        </span>

        <!-- Time Display (Live Minutes / HT / Upcoming Format) -->
        <span 
          class="text-xs font-semibold leading-none" 
          :class="isLive ? 'text-rose-400 animate-pulse' : 'text-gray-500'"
        >
          {{ displayTime }}
        </span>
      </div>
    </div>

    <!-- Teams Name & Scores -->
    <div class="space-y-1">
      <!-- Home Team -->
      <div class="flex items-center justify-between pr-2">
        <span class="text-sm font-semibold text-gray-900 truncate leading-tight">
          {{ game.homeTeam }}
        </span>
        <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2 leading-none">
          {{ game.currentScore?.home ?? 0 }}
        </span>
      </div>

      <!-- Away Team -->
      <div class="flex items-center justify-between pr-2">
        <span class="text-sm font-semibold text-gray-900 truncate leading-tight">
          {{ game.awayTeam }}
        </span>
        <span v-if="isLiveOrFinished" class="text-sm font-bold text-rose-500 ml-2 leading-none">
          {{ game.currentScore?.away ?? 0 }}
        </span>
      </div>
    </div>
  </div>

  <!-- Odds Buttons (Aligned to Bottom/Center) -->
  <div class="flex gap-1 flex-shrink-0 self-end pb-0.5" @click.stop>
    <button 
      class="odds-btn overflow-hidden w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded relative"
      :class="getButtonClass('home')"
      @click="handleOddsClick('home')"
      :disabled="!game.odds || !game.odds.home"
    >
      <span v-if="marketFires('home') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
        <span v-for="n in marketFires('home')" :key="'h' + n" class="animate-ember inline-block">🔥</span>
      </span>
      <span class="relative z-10">{{ formatOdds(game.odds?.home) }}</span>
    </button>
    <button 
      class="odds-btn overflow-hidden w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded relative"
      :class="getButtonClass('draw')"
      @click="handleOddsClick('draw')"
      :disabled="!game.odds || !game.odds.draw"
    >
      <span v-if="marketFires('draw') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
        <span v-for="n in marketFires('draw')" :key="'d' + n" class="animate-ember inline-block">🔥</span>
      </span>
      <span class="relative z-10">{{ formatOdds(game.odds?.draw) }}</span>
    </button>
    <button 
      class="odds-btn overflow-hidden w-12 py-2 text-center text-xs font-bold transition-all duration-150 rounded relative"
      :class="getButtonClass('away')"
      @click="handleOddsClick('away')"
      :disabled="!game.odds || !game.odds.away"
    >
      <span v-if="marketFires('away') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
        <span v-for="n in marketFires('away')" :key="'a' + n" class="animate-ember inline-block">🔥</span>
      </span>
      <span class="relative z-10">{{ formatOdds(game.odds?.away) }}</span>
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


// ============================================
// 🔥 FIRE TREND (idadi ya bets kwa kila outcome)
// Zinaonyeshwa kwenye button ya odds husika (kama BetPawa).
// Tunakokotoa kutoka odds ya upande husika: odds ndogo
// = watu wengi wamebeti hapo = moto zaidi.
// ============================================
function fireForOdds(odds) {
  if (typeof odds !== 'number' || isNaN(odds)) return 0
  if (odds <= 1.80) return 3
  if (odds <= 2.10) return 2
  if (odds <= 2.50) return 1
  return 0
}
const oddsValue = (type) => {
  if (!props.game?.odds) return null
  const v = props.game.odds[type]
  return typeof v === 'number' ? v : null
}
const marketFires = (type) => fireForOdds(oddsValue(type))

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
    return 'selected border-emerald-500 bg-emerald-800/60 shadow-lg shadow-emerald-800/10 text-white font-black ring-1 ring-emerald-700/80'
  }
  if (!hasOdds) {
    return 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
  }
  return 'odds-glow bg-gray-50 text-gray-700 hover:bg-rose-600 hover:text-white border border-gray-200'
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
    market_key: '1X2',
    outcome_key: marketKey,
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

<style scoped>
.odds-btn {
  isolation: isolate;
}

/* --- UNSELECTED (default): nucleus inayotembea kwenye border --- */
.odds-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  width: 5px;
  height: 3px;
  border-radius: 9999px;
  background: radial-gradient(circle, #34d399 0%, #10b981 60%, transparent 100%);
  box-shadow: 0 0 6px 1px rgba(16, 185, 129, 0.8);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.odds-glow::before {
  opacity: 1;
  offset-path: rect(0 100% 100% 0 round 6px);
  offset-anchor: 50% 50%;
  animation: oddsComet 2s linear infinite;
}
.odds-glow:hover::before {
  animation-duration: 1s;
}

/* --- SELECTED: dimlight/glow ring (sawa na SportDetailPage) --- */
.odds-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(16, 185, 129, 0) 200deg,
    #10b981 320deg,
    #34d399 350deg,
    #10b981 360deg
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}
.odds-btn.selected::after {
  opacity: 1;
  animation: oddsGlowSpin 1.6s linear infinite;
}
.odds-btn.selected:hover::after {
  animation-duration: 0.8s;
}

@keyframes oddsComet {
  0%   { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
@keyframes oddsGlowSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.animate-ember {
  display: inline-block;
  animation: emberPulse 1.6s ease-in-out infinite;
}
.animate-ember:nth-child(2) { animation-delay: 0.25s; }
.animate-ember:nth-child(3) { animation-delay: 0.5s; }
@keyframes emberPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.85); }
}
</style>