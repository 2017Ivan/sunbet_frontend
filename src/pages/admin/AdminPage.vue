<!-- views/admin/AdminPage.vue - Admin Dashboard (data halisi kutoka DB) -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white">Admin Dashboard</h1>
        <p class="text-xs text-gray-500 mt-1">{{ lastUpdated }}</p>
      </div>
      <button
        @click="loadDashboard"
        :disabled="isLoading"
        class="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
      >
        <svg :class="isLoading ? 'animate-spin' : ''" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Loading / Error -->
    <div v-if="error" class="bg-red-950/60 border border-red-800 rounded-2xl p-4 text-red-300 text-sm">
      {{ error }}
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in adminStats" :key="stat.key"
           class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:border-rose-500/30 transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xl">{{ stat.icon }}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400">
            {{ stat.tag }}
          </span>
        </div>
        <p class="text-2xl font-black font-mono text-rose-400">{{ stat.value }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Recent bets table -->
    <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
        <h3 class="font-bold text-white">Recent Bets</h3>
        <span class="text-xs text-gray-500">{{ recentBets.length }} ya hivi karibuni</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[#2A2A2A]">
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ticket</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stake</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Odds</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Possible Win</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Result</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#2A2A2A]">
            <tr v-if="isLoading && recentBets.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-gray-500">Inapakia data...</td>
            </tr>
            <tr v-else-if="recentBets.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-gray-500">Hakuna bets bado</td>
            </tr>
            <tr v-for="bet in recentBets" :key="bet.id" class="hover:bg-[#2A2A2A]/30 transition-colors">
              <td class="px-4 py-3 font-mono text-xs text-rose-400">{{ bet.ticket_code }}</td>
              <td class="px-4 py-3 text-gray-300 font-mono">{{ bet.phone_number || 'N/A' }}</td>
              <td class="px-4 py-3 font-mono text-rose-400 font-bold">TZS {{ formatMoney(bet.stake) }}</td>
              <td class="px-4 py-3 font-mono text-gray-400">{{ formatOdds(bet.total_odds) }}x</td>
              <td class="px-4 py-3 font-mono text-gray-300">TZS {{ formatMoney(bet.possible_win) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                      :class="resultBadge(bet.result)">
                  {{ bet.result }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{{ formatDate(bet.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import adminDashboardService from '../../services/admin/adminDashboardService'

const isLoading = ref(false)
const error = ref('')
const lastUpdated = ref('')
const stats = reactive({})
const recentBets = ref([])

const formatMoney = (n) => {
  const num = parseFloat(n || 0)
  return new Intl.NumberFormat('en-TZ').format(num)
}

const formatOdds = (n) => {
  const num = parseFloat(n || 0)
  return num.toFixed(2)
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleString('en-TZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resultBadge = (r) => {
  const map = {
    WON: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    LOST: 'bg-red-500/10 text-red-400 border-red-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    CASHED_OUT: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
  return map[r] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

// Stats columns: map real DB fields -> display (4 pekee)
const statDefs = [
  { key: 'total_users', icon: '👥', label: 'Total Users', tag: 'users', money: false },
  { key: 'deposits_today', icon: '💳', label: 'Total Deposits Today', tag: 'TZS', money: true },
  { key: 'bets_today', icon: '📋', label: 'Bets Today', tag: 'today', money: false },
  { key: 'notifications_today', icon: '🔔', label: 'Notifications Today', tag: 'today', money: false }
]

const adminStats = computed(() =>
  statDefs.map((def) => {
    const raw = stats[def.key] ?? 0
    return {
      key: def.key,
      icon: def.icon,
      label: def.label,
      tag: def.tag,
      value: def.money ? `TZS ${formatMoney(raw)}` : formatMoney(raw)
    }
  })
)

async function loadDashboard() {
  isLoading.value = true
  error.value = ''

  try {
    const result = await adminDashboardService.getDashboard({ limit: 10 })

    if (result.success) {
      const data = result.data || {}
      Object.assign(stats, data.stats || {})
      recentBets.value = data.recent_bets || []

      lastUpdated.value = 'Last updated: ' + new Date().toLocaleString('en-TZ', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = 'Iliangamia kupakia data'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDashboard)
</script>