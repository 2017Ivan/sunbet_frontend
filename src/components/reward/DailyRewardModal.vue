<!-- DailyRewardModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="reward" appear>
      <div class="fixed inset-0 z-[210] flex items-center justify-center px-4" role="dialog" aria-modal="true">
        <!-- Soft glow backdrop (content behind stays visible) -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),rgba(0,0,0,0.7)_70%)] backdrop-blur-[2px]" @click="close"></div>

        <!-- Floating embers -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div v-for="(e, i) in embers" :key="i" class="ember" :style="emberStyle(e)"></div>
        </div>

        <!-- Modal Card -->
        <div
          class="relative w-full max-w-sm bg-gradient-to-b from-[#1d1609] via-[#171205] to-[#0c0a04] border border-amber-500/25 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(251,191,36,0.25)] text-center reward-in"
        >
          <!-- Top glow -->
          <div class="absolute -top-14 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-400/15 blur-3xl rounded-full"></div>

          <!-- Close button -->
          <button
            class="absolute top-3 right-3 z-10 p-2 rounded-full text-amber-200/60 hover:text-white hover:bg-white/10 transition-colors"
            @click="close"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="px-5 pt-7 pb-6 relative">
            <!-- Flame -->
            <div class="relative w-24 h-24 mx-auto flame-wrap">
              <div class="absolute inset-0 flame-glow"></div>
              <svg class="relative w-24 h-24 flame-anim" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="dr-flame" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fde68a"/>
                    <stop offset="40%" stop-color="#fbbf24"/>
                    <stop offset="75%" stop-color="#f97316"/>
                    <stop offset="100%" stop-color="#b91c1c"/>
                  </linearGradient>
                </defs>
                <path d="M32 4c4 10 16 14 16 28 0 11-7 20-16 20S16 43 16 32C16 22 27 20 31 10c1 4 2 6 4 8 1-4 1-9-3-14z" fill="url(#dr-flame)"/>
                <path class="flame-core" d="M32 22c2 5 8 6 8 12 0 5-3 9-8 9s-8-4-8-9c0-5 5-7 7-12" fill="#fff7dc"/>
              </svg>
              <!-- Sparkles -->
              <svg class="absolute -top-1 -right-3 w-7 h-7 sparkle" viewBox="0 0 24 24" fill="#fde68a"><path d="M12 1l2.4 6.6L21 10l-6.6 2.4L12 19l-2.4-6.6L3 10l6.6-2.4L12 1z"/></svg>
              <svg class="absolute top-6 -left-5 w-4 h-4 sparkle" style="animation-delay:.7s" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 1l2.4 6.6L21 10l-6.6 2.4L12 19l-2.4-6.6L3 10l6.6-2.4L12 1z"/></svg>
            </div>

            <!-- Headline -->
            <p class="mt-3 text-[10px] font-bold tracking-[0.3em] text-amber-400/80 uppercase">Daily Login Reward</p>
            <h2 class="mt-1 text-xl font-extrabold text-white">Ingia kila siku, pata zawadi! 🔥</h2>
            <p class="mt-1 text-xs text-[#8E8E8E]">Zawadi inaongezeka kila siku unapoendelea kucheza</p>

            <!-- Streak badge -->
            <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="#fbbf24"><path d="M10 2c.8 2.4 4 3.4 4 7a4 4 0 0 1-8 0c0-1.2.4-2.2 1-3 .2 1 .8 1.6 1.4 2-.1-2 .5-4 1.6-6z"/></svg>
              <span class="text-xs font-bold text-amber-200">
                <template v-if="status && status.current_streak > 0">{{ status.current_streak }} siku mfululizo</template>
                <template v-else>Anza sasa</template>
              </span>
            </div>

            <!-- Claimed success state -->
            <template v-if="claimedReward !== null">
              <div class="mt-5">
                <p class="text-[10px] uppercase tracking-widest text-amber-200/50 font-medium">Umeshakusanya</p>
                <p class="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.45)] tabular-nums">
                  TZS {{ claimedReward.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-emerald-400 font-semibold">+ Imetumwa kwenye balance yako ✨</p>
              </div>
            </template>

            <!-- 7-day strip -->
            <div class="mt-5 rounded-2xl bg-black/25 border border-white/5 p-3">
              <p class="text-left text-[10px] uppercase tracking-widest text-[#8E8E8E] font-semibold mb-2.5">Zawadi za Wiki</p>
              <div class="flex justify-between items-end gap-1">
                <div
                  v-for="(tier, i) in tiers"
                  :key="i"
                  class="flex-1 flex flex-col items-center gap-1"
                  :class="dayCellClass(i + 1)"
                >
                  <span v-if="i + 1 === currentCollectedDay && status.claimed_today" class="text-[10px] leading-none">🔥</span>
                  <span v-else-if="i + 1 === status.next_day" class="text-[10px] leading-none">👉</span>
                  <span v-else class="text-[10px] leading-none opacity-0">·</span>
                  <span class="text-[11px] font-black leading-none tabular-nums" :class="tierTextClass(i + 1)">{{ (tier || 0).toLocaleString() }}</span>
                  <span class="text-[8px] uppercase tracking-wide text-[#6b6b6b] font-semibold leading-none">Siku {{ i + 1 }}</span>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="my-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

            <!-- Claim button / already claimed -->
            <button
              v-if="claimedReward === null && canClaim"
              class="relative w-full rounding-claim overflow-hidden ... disabled-not"
              @click="handleClaim"
              :class="isClaiming ? 'opacity-70' : ''"
            >
              <span class="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-600"></span>
              <span class="relative z-10 flex items-center justify-center gap-2 py-3.5 text-sm font-extrabold text-black">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 1v4H8l4 6 4-6h-3V1h-2zM6 13h12v2H6v-2zm0 4h12v2H6v-2zm0 4h12v2H6v-2z"/></svg>
                KUSANYA ZAWADI — TZS {{ (status.next_reward || 0).toLocaleString() }}
              </span>
            </button>

            <div v-else-if="claimedReward === null" class="w-full rounded-2xl bg-white/5 border border-gray-200 py-3.5 text-sm font-bold text-[#6b6b6b]">
              <template v-if="status.claimed_today">✔ Umeshakusanya zawadi ya leo</template>
              <template v-else>Rudi kesho kukusanya TZS {{ (status.next_reward || 0).toLocaleString() }} 🔥</template>
            </div>

            <p class="mt-3 text-[10px] text-[#555]">Bonasi ya kila siku - malipo ya moja kwa moja kwenye balance</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'

const props = defineProps({
  status: { type: Object, required: true }
})

const emit = defineEmits(['close', 'claimed'])

const authStore = useAuthStore()

const claimedReward = ref(null)
const isClaiming = computed(() => authStore.dailyReward.isClaiming)

const tiers = computed(() => {
  const t = props.status.tiers || {}
  return [1, 2, 3, 4, 5, 6, 7].map((i) => Number(t[i] || 0))
})

const canClaim = computed(() => {
  return claimedReward.value === null && props.status.can_claim && !props.status.claimed_today
})

const currentCollectedDay = computed(() => {
  if (!props.status.claimed_today) return null
  return ((props.status.current_streak - 1) % 7) + 1
})

const dayCellClass = (day) => {
  if (day === currentCollectedDay.value && props.status.claimed_today) {
    return 'rounded-xl px-1 py-1.5 bg-amber-500/15 border border-amber-400/40'
  }
  if (day === props.status.next_day) {
    return 'rounded-xl px-1 py-1.5 bg-amber-500/10 border border-amber-500/25'
  }
  return 'rounded-xl px-1 py-1.5 bg-transparent border border-transparent'
}

const tierTextClass = (day) => {
  if (day === currentCollectedDay.value && props.status.claimed_today) return 'text-amber-300'
  if (day === props.status.next_day) return 'text-amber-400'
  return 'text-[#8E8E8E]'
}

const handleClaim = async () => {
  if (isClaiming.value) return
  const result = await authStore.claimDailyReward()
  if (result.success) {
    claimedReward.value = result.data.reward
    emit('claimed', result.data)
  }
}

const close = () => emit('close')

// Embers particles
const embers = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (i * 7 + 12) % 100,
  delay: (i % 7) * 0.5,
  duration: 3 + (i % 4) * 0.9,
  size: 3 + (i % 3) * 2
}))

const emberStyle = (e) => ({
  left: `${e.left}%`,
  width: `${e.size}px`,
  height: `${e.size}px`,
  animationDelay: `${e.delay}s`,
  animationDuration: `${e.duration}s`
})
</script>

<style scoped>
.ember {
  position: absolute;
  bottom: -10px;
  border-radius: 9999px;
  background: radial-gradient(circle, #fcd34d 0%, rgba(251, 191, 36, 0) 70%);
  animation: ember-rise linear infinite;
  pointer-events: none;
}
@keyframes ember-rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.9; }
  100% { transform: translateY(-420px) scale(0.3); opacity: 0; }
}

.flame-glow {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(249, 115, 22, 0.12) 55%, transparent 75%);
  animation: flame-breathe 2.4s ease-in-out infinite;
  border-radius: 9999px;
}
@keyframes flame-breathe {
  0%, 100% { transform: scale(0.85); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
}
.flame-anim {
  animation: flame-flicker 1.6s ease-in-out infinite;
  transform-origin: 50% 100%;
  filter: drop-shadow(0 0 14px rgba(249, 115, 22, 0.55));
}
@keyframes flame-flicker {
  0%, 100% { transform: scaleY(1) rotate(-1deg); }
  50% { transform: scaleY(1.08) rotate(1deg); }
}
.flame-core {
  animation: core-pulse 1.6s ease-in-out infinite;
}
@keyframes core-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}

@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0.25; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.15) rotate(12deg); }
}
.sparkle {
  animation: sparkle-twinkle 1.8s ease-in-out infinite;
}

.reward-in {
  animation: reward-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes reward-pop {
  0% { opacity: 0; transform: scale(0.8) translateY(18px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.reward-enter-active, .reward-leave-active {
  transition: opacity 0.3s ease;
}
.reward-enter-from, .reward-leave-to {
  opacity: 0;
}

.rounding-claim {
  border-radius: 9999px;
  box-shadow: 0 8px 28px rgba(251, 191, 36, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
</style>