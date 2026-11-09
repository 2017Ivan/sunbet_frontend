<template>
  <div 
    @click="$emit('click')"
    class="mx-1 min-h-[70px]   border-b border-[#d5e1eb] bg-[#f8fbff] py-2 px-2.5 last:border-b-0 cursor-pointer hover:bg-[#eef6fc] transition-colors duration-150"
  >
    <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1">
      <div class="flex min-w-0 items-center gap-1.5">
        <svg class="hidden sm:block h-3 w-3 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="m10 1.8 2.45 4.97 5.48.8-3.97 3.87.94 5.46L10 14.32l-4.9 2.58.94-5.46L2.07 7.57l5.48-.8L10 1.8Z" />
        </svg>
        <div class="flex min-w-0 items-center gap-2">
          <span
            v-if="game.status === 'HALF_TIME'"
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
          <span
            class="whitespace-nowrap text-[11px] sm:text-xs font-medium leading-none"
            :class="isLive ? 'text-rose-600 animate-pulse' : 'text-slate-500'"
          >
            {{ displayTime }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="shrink-0 rounded-full bg-white/70 p-1 text-slate-500 hover:text-emerald-700"
        aria-label="View match details"
        @click.stop="$emit('click')"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 19V5m0 14h16" />
          <path d="m7 15 4-4 3 2 5-6" />
          <path d="M16 7h3v3" />
        </svg>
      </button>

      <div class="col-span-2 flex min-w-0 items-center justify-between gap-2">
        <div class="min-w-0 flex-1 space-y-1">
          <div class="flex items-center justify-between pr-2">
            <span class="text-[13px] sm:text-sm font-semibold text-slate-800 truncate leading-tight">
              {{ game.homeTeam }}
            </span>
            <span v-if="isLiveOrFinished" class="text-[13px] sm:text-sm font-bold text-rose-600 ml-2 leading-none">
              {{ game.currentScore?.home ?? 0 }}
            </span>
          </div>
          <div class="flex items-center justify-between pr-2">
            <span class="text-[13px] sm:text-sm font-semibold text-slate-800 truncate leading-tight">
              {{ game.awayTeam }}
            </span>
            <span v-if="isLiveOrFinished" class="text-[13px] sm:text-sm font-bold text-rose-600 ml-2 leading-none">
              {{ game.currentScore?.away ?? 0 }}
            </span>
          </div>
        </div>

        <div class="flex shrink-0 gap-1" @click.stop>
          <button
            class="odds-btn overflow-hidden w-10 py-1.5 text-center text-[13px] sm:text-sm font-bold transition-all duration-150 rounded-sm relative"
            :class="getButtonClass('home')"
            @click="handleOddsClick('home')"
            :disabled="!oddsValue('home') || isOddsSelectionLocked('home')"
          >
            <span v-if="!isOddsSelectionLocked('home') && marketFires('home') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
              <span v-for="n in marketFires('home')" :key="'h' + n" class="animate-ember inline-block">🔥</span>
            </span>
            <span v-if="!isOddsSelectionLocked('home')" class="relative z-10">{{ formatOdds(oddsValue('home')) }}</span>
            <span v-if="isOddsSelectionLocked('home')" class="relative z-10" aria-label="Chaguo limefungwa" title="Chaguo limefungwa">🔒</span>
          </button>
          <button
            class="odds-btn overflow-hidden w-10 py-1.5 text-center text-[13px] sm:text-sm font-bold transition-all duration-150 rounded-sm relative"
            :class="getButtonClass('draw')"
            @click="handleOddsClick('draw')"
            :disabled="!oddsValue('draw') || isOddsSelectionLocked('draw')"
          >
            <span v-if="!isOddsSelectionLocked('draw') && marketFires('draw') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
              <span v-for="n in marketFires('draw')" :key="'d' + n" class="animate-ember inline-block">🔥</span>
            </span>
            <span v-if="!isOddsSelectionLocked('draw')" class="relative z-10">{{ formatOdds(oddsValue('draw')) }}</span>
            <span v-if="isOddsSelectionLocked('draw')" class="relative z-10" aria-label="Chaguo limefungwa" title="Chaguo limefungwa">🔒</span>
          </button>
          <button
            class="odds-btn overflow-hidden w-10 py-1.5 text-center text-[13px] sm:text-sm font-bold transition-all duration-150 rounded-sm relative"
            :class="getButtonClass('away')"
            @click="handleOddsClick('away')"
            :disabled="!oddsValue('away') || isOddsSelectionLocked('away')"
          >
            <span v-if="!isOddsSelectionLocked('away') && marketFires('away') > 0" class="absolute top-0.5 left-1 leading-none text-[9px] z-10">
              <span v-for="n in marketFires('away')" :key="'a' + n" class="animate-ember inline-block">🔥</span>
            </span>
            <span v-if="!isOddsSelectionLocked('away')" class="relative z-10">{{ formatOdds(oddsValue('away')) }}</span>
            <span v-if="isOddsSelectionLocked('away')" class="relative z-10" aria-label="Chaguo limefungwa" title="Chaguo limefungwa">🔒</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBetStore } from '../../../stores/bet/betStore.js'
import { useMinuteClock } from '../../../composables/useMinuteClock.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const currentTime = useMinuteClock()
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
const formatLivePeriodTime = (elapsedValue) => {
  const parts = String(elapsedValue ?? '').trim().match(/^(\d+)(?:\s*\+\s*(\d+))?/)
  if (!parts) return null

  const minute = Number(parts[1])
  const period = minute <= 45 ? '1H' : '2H'
  const displayedMinute = parts[2]
    ? `${minute}+${parts[2]}'`
    : minute >= 90 ? "90+'" : `${minute}'`

  return `${period} | ${displayedMinute}`
}

const displayTime = computed(() => {
  if (!props.game) return ''
  if (['HALF_TIME', 'FINISHED'].includes(props.game.status)) return ''

  if (isLive.value) {
    const elapsedValue = props.game.elapsed_minute
      ?? props.game.current_minute
      ?? props.game._raw?.elapsed_minute
    if (elapsedValue !== undefined && elapsedValue !== null) {
      return formatLivePeriodTime(elapsedValue) || 'LIVE'
    }

    if (typeof props.game.time === 'string' && props.game.time.includes("'")) {
      return formatLivePeriodTime(props.game.time) || props.game.time
    }

    if (props.game.date && props.game.time && props.game.time.includes(':')) {
      const matchStart = new Date(`${props.game.date} ${props.game.time}`)
      const wallMinutes = Math.floor((currentTime.value - matchStart.getTime()) / 60000)

      if (!Number.isNaN(wallMinutes) && wallMinutes >= 0) {
        const script = props.game.predetermined_script || {}
        const firstHalfEnd = 45 + (Number(script.extra_time_mins?.ht) || 1)
        const halftimeBreak = Number(script.halftime_break_mins) || 15
        const elapsedMinutes = wallMinutes > firstHalfEnd + halftimeBreak
          ? wallMinutes - halftimeBreak
          : Math.min(wallMinutes, firstHalfEnd)
        return formatLivePeriodTime(elapsedMinutes) || 'LIVE'
      }
    }

    return 'LIVE'
  }

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
  const outcome = type === 'home' ? '1' : type === 'draw' ? 'X' : '2'
  const markets = props.game?.markets
  if (Array.isArray(markets) && markets.length > 0) {
    const market = markets.find((item) => item?.market === '1X2 | Full Time')
    const selection = market?.selections?.find((item) => item?.name === outcome)
    const value = Number(selection?.odds)
    return Number.isFinite(value) && value > 1 ? value : null
  }

  const legacyOdds = props.game?.odds
  const value = Number(
    legacyOdds?.['1X2']?.[outcome]
      ?? legacyOdds?.[outcome]
      ?? legacyOdds?.[type]
  )
  return Number.isFinite(value) && value > 1 ? value : null
}
const marketFires = (type) => fireForOdds(oddsValue(type))

const parseMatchMinute = (value) => {
  const minute = String(value ?? '').match(/(?:^|\|\s*)(\d+)(?:\s*\+\s*\d+)?/)
  return minute ? Number(minute[1]) : null
}

const isOddsSelectionLocked = (type) => {
  const status = props.game?.status
  if (['FINISHED', 'CANCELLED'].includes(status)) return true
  if (!['LIVE', 'HALF_TIME'].includes(status) && !props.game?.live) return false

  const reportedMinute = props.game?.elapsed_minute ?? props.game?._raw?.elapsed_minute
  const minute = parseMatchMinute(reportedMinute) ?? parseMatchMinute(displayTime.value)
  if (!Number.isFinite(minute)) return false
  if (minute >= 90) return true
  return minute >= 85 && oddsValue(type) <= 1.15
}

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
  const hasOdds = oddsValue(type) !== null

  if (isOddsSelectionLocked(type)) {
    return 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80'
  }
  
  if (selected) {
    return 'selected border-emerald-500 bg-emerald-800/60 shadow-lg shadow-emerald-800/10 text-white font-black ring-1 ring-emerald-700/80'
  }
  if (!hasOdds) {
    return 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
  }
  return 'odds-glow bg-[#e5eef7] text-slate-700 hover:bg-emerald-700 hover:text-white border border-[#d7e4ef]'
}

const handleOddsClick = (type) => {
  const odds = oddsValue(type)
  if (!odds || isOddsSelectionLocked(type)) return
  
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
    odds,
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