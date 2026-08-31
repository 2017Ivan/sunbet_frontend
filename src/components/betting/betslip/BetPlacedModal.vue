<!-- BetPlacedModal.vue - Success confirmation with full bet details -->
<template>
  <Transition name="betmodal">
    <div v-if="placedBet" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')" />

      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-[24px] shadow-2xl overflow-x-hidden max-h-[92vh] flex flex-col"
      >
        <!-- Success Header -->
        <div class="px-6 pt-7 pb-5 text-center bg-gradient-to-r from-emerald-600 to-emerald-500">
          <div class="mx-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg class="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="mt-3 text-lg font-bold text-white">Bet Placed Successfully!</h2>
          <p class="text-xs text-emerald-100 mt-1">{{ selections.length }} {{ selections.length === 1 ? 'selection' : 'selections' }} added to your bet</p>        </div>

        <!-- Booking Code Info Bar -->
        <div class="px-6 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200">
          <div>
            <p class="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Booking Code</p>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 font-mono tracking-wider">{{ bookingCode }}</span>
              <button
                class="text-gray-400 hover:text-rose-500 transition-colors"
                :title="copied ? 'Copied!' : 'Copy booking code'"
                @click="copyCode"
              >
                <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </button>
              <button
                class="text-gray-400 hover:text-[#25D366] transition-colors"
                title="Share on WhatsApp"
                @click="shareOnWhatsApp"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Placed On</p>
            <p class="text-xs font-semibold text-gray-700">{{ placedAt }}</p>
          </div>
        </div>

        <!-- Status -->
        <div class="px-6 py-3 flex items-center gap-2 border-b border-gray-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-sm font-semibold text-gray-900">Status:</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
            {{ betStatus }}
          </span>
        </div>

        <!-- Summary -->
        <div class="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs" v-if="hasTotalOdds">
              <span class="text-gray-500">Total Odds</span>
              <span class="text-gray-900 font-semibold">{{ totalOdds.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Stake</span>
              <span class="text-gray-900 font-semibold">TZS {{ formatMoney(stake) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Tax (12%)</span>
              <span class="text-emerald-600 font-semibold">TZS {{ formatMoney(tax) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Potential Win</span>
              <span class="text-emerald-600 font-semibold">TZS {{ formatMoney(possibleWin) }}</span>
            </div>
            <div class="flex justify-between text-base pt-1.5 border-t border-gray-200">
              <span class="font-semibold text-gray-900">Payout</span>
              <span class="font-bold text-emerald-600">TZS {{ formatMoney(payout) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 flex gap-2.5 border-t border-gray-200">
          <button
            class="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
            @click="$emit('close')"
          >
            Done
          </button>
          <button
            class="flex-1 py-3 rounded-xl bg-[#A32D2D] text-white text-sm font-bold hover:bg-[#7A1F1F] transition-colors"
            @click="$emit('view-bets')"
          >
            View My Bets
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  placedBet: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'view-bets'])

const copied = ref(false)
let copyTimer = null

const selections = computed(() => {
  const list = props.placedBet?.selections || []
  return Array.isArray(list) ? list : []
})

const bookingCode = computed(() => {
  return props.placedBet?.booking_code || props.placedBet?.bookingCode || props.placedBet?.ticket_code || 'N/A'
})

const placedAt = computed(() => {
  const created = props.placedBet?.created_at || props.placedBet?.createdAt
  if (!created) return ''
  const date = new Date(created)
  if (isNaN(date)) return ''
  return date.toLocaleString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' })
})

const betStatus = computed(() => {
  const status = (props.placedBet?.status || 'OPEN').toUpperCase()
  const result = (props.placedBet?.result || '').toUpperCase()
  if (result === 'WON') return 'WON'
  if (result === 'LOST') return 'LOST'
  if (status === 'SETTLED') return 'SETTLED'
  return 'OPEN'
})

const totalOdds = computed(() => {
  const t = parseFloat(props.placedBet?.total_odds)
  if (!isNaN(t) && t > 0) return t
  return selections.value.reduce((acc, sel) => acc * (parseFloat(sel?.odds_at_placement ?? sel?.odds) || 1), 1)
})

const hasTotalOdds = computed(() => {
  const t = parseFloat(props.placedBet?.total_odds)
  return (!isNaN(t) && t > 0) || selections.value.length > 1
})

const stake = computed(() => {
  const s = parseFloat(props.placedBet?.stake)
  return isNaN(s) ? 0 : s
})

const possibleWin = computed(() => {
  const p = parseFloat(props.placedBet?.possible_win)
  if (!isNaN(p) && p > 0) return p
  return Math.round((stake.value || 0) * (totalOdds.value - 1))
})

const tax = computed(() => {
  const t = parseFloat(props.placedBet?.tax)
  if (!isNaN(t) && t > 0) return t
  return Math.round((possibleWin.value || 0) * 0.12)
})

const payout = computed(() => {
  const p = parseFloat(props.placedBet?.payout)
  if (!isNaN(p) && p > 0) return p
  return Math.round((possibleWin.value - tax.value) + stake.value)
})

// ---- Actions ----
const formatMoney = (value) => {
  const n = Number(value)
  if (isNaN(n)) return '0'
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(bookingCode.value)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    copied.value = false
  }
}

const shareOnWhatsApp = () => {
  const origin = window.location.origin
  const text = `🎫 Bet with my booking code ${bookingCode.value} on SunBet!\n${origin}/booking/${bookingCode.value}`
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener')
}
</script>

<style scoped>
.betmodal-enter-active,
.betmodal-leave-active {
  transition: opacity 0.25s ease;
}
.betmodal-enter-active .sm\:max-w-md,
.betmodal-enter-active .w-full,
.betmodal-leave-active .sm\:max-w-md,
.betmodal-leave-active .w-full {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.betmodal-enter-from,
.betmodal-leave-to {
  opacity: 0;
}
.betmodal-enter-from .sm\:max-w-md,
.betmodal-enter-from .w-full,
.betmodal-leave-to .sm\:max-w-md,
.betmodal-leave-to .w-full {
  transform: translateY(40px);
}
@media (min-width: 640px) {
  .betmodal-enter-from .sm\:max-w-md,
  .betmodal-leave-to .sm\:max-w-md {
    transform: translateY(0) scale(0.95);
  }
}
</style>