<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-amber-600/50 p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg sm:text-xl font-bold text-white mb-2">Generate Matches</h3>
      <p class="text-cyan-400 text-xs sm:text-sm mb-4 sm:mb-6">Auto-create random fixtures with fictional teams (non-African) and real-world leagues</p>

      <!-- Number of matches -->
      <div class="space-y-2 mb-4">
        <label class="text-cyan-400 text-xs sm:text-sm block font-semibold">Number of Matches</label>
        <div class="flex items-center gap-3">
          <button
            class="w-10 h-10 rounded-xl bg-slate-700 text-white text-xl font-bold hover:bg-slate-600 transition-colors"
            @click="decrement"
          >−</button>
          <input
            v-model.number="matchCount"
            type="number"
            min="1"
            max="50"
            class="flex-1 text-center bg-slate-900 border border-amber-600/50 rounded-xl text-white text-lg font-bold py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            class="w-10 h-10 rounded-xl bg-slate-700 text-white text-xl font-bold hover:bg-slate-600 transition-colors"
            @click="increment"
          >+</button>
        </div>
        <p class="text-gray-400 text-[11px]">Min 1 · Max 50</p>
      </div>

      <!-- League -->
      <div class="space-y-2 mb-4">
        <label class="text-cyan-400 text-xs sm:text-sm block font-semibold">League</label>
        <select
          v-model="league"
          class="w-full bg-slate-900 border border-amber-600/50 rounded-xl text-white text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Random League (Auto)</option>
          <option v-for="lg in leagues" :key="lg" :value="lg">{{ lg }}</option>
        </select>
      </div>

      <!-- Info -->
      <div class="bg-slate-900/60 border border-cyan-800/30 rounded-xl p-3 mb-5 text-[11px] sm:text-xs text-gray-300 space-y-1">
        <p>• Fictional team names — unique to our system</p>
        <p>• No African teams / leagues used</p>
        <p>• Each match gets its own odds + live script</p>
        <p>• Scheduled randomly within the next 7 days</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 sm:gap-3 pt-4 border-t border-cyan-800/30">
        <button
          @click="$emit('close')"
          class="flex-1 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="loading || matchCount < 1"
          class="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-amber-500/20 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span>{{ loading ? 'Generating...' : 'Generate Matches' }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LEAGUES } from './fixtureLeagues'

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'generated', 'close'])

const matchCount = ref(5)
const league = ref('')
const leagues = LEAGUES

function increment() {
  if (matchCount.value < 50) matchCount.value++
}

function decrement() {
  if (matchCount.value > 1) matchCount.value--
}

function submit() {
  if (matchCount.value < 1 || matchCount.value > 50) return
  emit('generated', {
    count: matchCount.value,
    league: league.value || null
  })
}
</script>