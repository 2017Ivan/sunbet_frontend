<!-- WinCelebrationModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="celebration" appear>
      <div class="fixed inset-0 z-[200] flex items-center justify-center px-4" role="dialog" aria-modal="true">
        <!-- Soft glow backdrop (content behind stays visible) -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),rgba(0,0,0,0.65)_70%)] backdrop-blur-[2px]" @click="dismiss"></div>

        <!-- Confetti layer -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            v-for="(c, i) in confetti"
            :key="i"
            class="confetti-piece"
            :style="confettiStyle(c)"
          ></div>
        </div>

        <!-- Modal Card -->
        <div
          class="relative w-full max-w-sm bg-gradient-to-b from-[#22190a] via-[#1a1408] to-[#0d0b05] border border-amber-500/25 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.25)] text-center celebrate-in"
        >
          <!-- Top light streak -->
          <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 bg-amber-400/15 blur-3xl rounded-full"></div>

          <!-- Close button -->
          <button
            class="absolute top-3 right-3 z-10 p-2 rounded-full text-amber-200/60 hover:text-white hover:bg-white/10 transition-colors"
            @click="dismiss"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="px-6 pt-8 pb-6 relative">
            <!-- Trophy -->
            <div class="relative w-28 h-28 mx-auto trophy-wrap">
              <div class="absolute inset-0 glow-pulse"></div>
              <svg class="relative w-28 h-28 trophy" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="tc-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fde68a"/>
                    <stop offset="45%" stop-color="#fbbf24"/>
                    <stop offset="100%" stop-color="#b45309"/>
                  </linearGradient>
                  <linearGradient id="tc-golddim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fcd34d"/>
                    <stop offset="100%" stop-color="#92400e"/>
                  </linearGradient>
                </defs>
                <!-- handles -->
                <path d="M8 20c0 8 4 12 12 12M56 20c0 8-4 12-12 12" stroke="url(#tc-golddim)" stroke-width="3" stroke-linecap="round"/>
                <!-- body -->
                <path d="M32 8c-7 0-13 6-13 14 0 8 10 9 13 16 3-7 13-8 13-16 0-8-6-14-13-14z" fill="url(#tc-gold)"/>
                <!-- stem -->
                <path d="M32 40v10" stroke="url(#tc-golddim)" stroke-width="4" stroke-linecap="round"/>
                <!-- base -->
                <path d="M24 54h16" stroke="url(#tc-golddim)" stroke-width="5" stroke-linecap="round"/>
                <path d="M21 60h22" stroke="url(#tc-golddim)" stroke-width="4" stroke-linecap="round"/>
                <!-- shine -->
                <path class="shine" d="M24 10c4-3 12-4 19-1" stroke="#fff" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <!-- Sparkles -->
              <svg class="absolute -top-2 -right-4 w-8 h-8 sparkle" viewBox="0 0 24 24" fill="#fde68a"><path d="M12 1l2.4 6.6L21 10l-6.6 2.4L12 19l-2.4-6.6L3 10l6.6-2.4L12 1z"/></svg>
              <svg class="absolute top-8 -left-6 w-5 h-5 sparkle" style="animation-delay:.6s" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 1l2.4 6.6L21 10l-6.6 2.4L12 19l-2.4-6.6L3 10l6.6-2.4L12 1z"/></svg>
              <svg class="absolute bottom-0 -right-2 w-4 h-4 sparkle" style="animation-delay:1.1s" viewBox="0 0 24 24" fill="#fcd34d"><path d="M12 1l2.4 6.6L21 10l-6.6 2.4L12 19l-2.4-6.6L3 10l6.6-2.4L12 1z"/></svg>
            </div>

            <!-- Headline -->
            <p class="mt-4 text-[10px] font-bold tracking-[0.3em] text-amber-400/80 uppercase">Congratulations Winner</p>
            <h2 class="mt-1 text-2xl font-extrabold text-white">Your bet WON! 🎉</h2>

            <!-- Amount -->
            <div class="mt-4">
              <p class="text-[10px] uppercase tracking-widest text-amber-200/50 font-medium">You won</p>
              <p class="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.45)] tabular-nums">
                TZS {{ displayAmount }}
              </p>
            </div>

            <!-- Divider -->
            <div class="my-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

            <!-- Ticket details -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#8E8E8E]">Ticket</span>
                <span class="text-white font-semibold tracking-wide">{{ win.ticket_code }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#8E8E8E]">Total Odds</span>
                <span class="text-amber-300 font-semibold">{{ oddsText }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#8E8E8E]">Stake</span>
                <span class="text-white font-semibold">TZS {{ formatNumber(win.stake) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#8E8E8E]">Selections</span>
                <span class="text-white font-semibold">{{ win.selections_count || 1 }} picks</span>
              </div>
            </div>

            <!-- CTA -->
            <button
              class="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-[#221400] text-sm font-extrabold tracking-wide shadow-[0_6px_24px_rgba(251,191,36,0.35)] hover:brightness-110 active:scale-[0.98] transition-all"
              @click="dismiss"
            >
              AMAZING!
            </button>
            <p class="mt-2 text-[10px] text-[#8E8E8E]">Payout already credited to your balance</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  win: { type: Object, required: true }
})

const emit = defineEmits(['close'])

// ---- Amount count-up ----
const displayAmount = ref('0')
let rafId = null
onMounted(() => {
  const target = parseFloat(props.win.payout) || 0
  const duration = 900
  const start = performance.now()
  const loop = (now) => {
    const p = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    displayAmount.value = Math.round(target * eased).toLocaleString()
    if (p < 1) rafId = requestAnimationFrame(loop)
    else displayAmount.value = target.toLocaleString()
  }
  rafId = requestAnimationFrame(loop)
})
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const formatNumber = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

const oddsText = computed(() => {
  const o = parseFloat(props.win.total_odds)
  return isNaN(o) ? '1.00' : o.toFixed(2)
})

// ---- Confetti ----
const colors = ['#fbbf24', '#fde68a', '#10b981', '#f472b6', '#38bdf8', '#fb7185', '#a78bfa']
const confetti = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.7,
  duration: 2.2 + Math.random() * 1.8,
  color: colors[i % colors.length],
  size: 6 + Math.random() * 8,
  rotate: Math.random() * 360,
  drift: -30 + Math.random() * 60
}))

const confettiStyle = (c) => ({
  left: `${c.left}%`,
  width: `${c.size}px`,
  height: `${c.size * (Math.random() > 0.5 ? 1 : 0.4)}px`,
  backgroundColor: c.color,
  animationDelay: `${c.delay}s`,
  animationDuration: `${c.duration}s`,
  '--drift': `${c.drift}px`,
  '--rotate-end': `${c.rotate + (Math.random() > 0.5 ? 360 : -360)}deg`
})

const dismiss = () => emit('close')
</script>

<style scoped>
/* Entrance */
.celebrate-in {
  animation: card-in 0.5s cubic-bezier(0.22, 1.61, 0.36, 1) both;
}
.celebration-enter-active { transition: opacity 0.35s ease; }
.celebration-leave-active { transition: opacity 0.25s ease; }
.celebration-enter-from, .celebration-leave-to { opacity: 0; }

@keyframes card-in {
  0% { opacity: 0; transform: scale(0.7) translateY(30px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Trophy */
.trophy-wrap { animation: trophy-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
@keyframes trophy-in {
  0% { opacity: 0; transform: scale(0.3) rotate(-12deg); }
  60% { transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
.trophy { animation: trophy-bob 2.6s ease-in-out 0.9s infinite; }
@keyframes trophy-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.shine { animation: shine-sweep 2.2s ease-in-out 1.2s infinite; }
@keyframes shine-sweep {
  0%, 55% { transform: translateX(-8px); opacity: 0; }
  70% { opacity: 0.9; }
  100% { transform: translateX(10px); opacity: 0; }
}
.glow-pulse {
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%);
  animation: glow-pulse 2s ease-in-out 0.3s infinite;
}
@keyframes glow-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.25); opacity: 1; }
}
.sparkle { animation: sparkle 1.6s ease-in-out infinite; }
@keyframes sparkle {
  0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1.1) rotate(20deg); opacity: 1; }
}

/* Confetti */
.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation-name: confetti-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes confetti-fall {
  0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) translateX(var(--drift)) rotate(var(--rotate-end)); opacity: 0.6; }
}
</style>