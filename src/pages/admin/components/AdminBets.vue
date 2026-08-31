<!-- views/admin/AdminBets.vue - Bets zote (list-only) + search kwa namba ya simu -->
<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Tafuta kwa namba ya simu ya user (mf. 2557...)"
          class="flex-1 min-w-[220px] px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          @keyup.enter="searchBets"
        />

        <button @click="searchBets"
                class="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20 whitespace-nowrap">
          🔍 Tafuta
        </button>
      </div>
    </div>

    <!-- Bets Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto overflow-y-auto" style="max-height: 600px;">
        <table class="w-full min-w-[900px]">
          <thead class="bg-[#0D0D0D] sticky top-0 z-20">
            <tr>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Ticket</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">User</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Selections</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Stake</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Odds</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Potential Win</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Result</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Tarehe</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10" class="px-6 py-10 text-center text-gray-400">Inapakia bets...</td>
            </tr>
            <tr v-else-if="bets.length === 0">
              <td colspan="10" class="px-6 py-10 text-center text-gray-400">Hakuna bets zilizopatikana</td>
            </tr>
            <tr v-for="bet in bets" :key="bet.id"
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-4 py-4 text-white text-sm font-mono whitespace-nowrap">{{ bet.ticket_code }}</td>
              <td class="px-4 py-4 text-gray-300 text-sm whitespace-nowrap">{{ bet.user?.phone_number || 'N/A' }}</td>
              <td class="px-4 py-4">
                <div class="space-y-1 min-w-[150px]">
                  <div v-for="(sel, idx) in bet.selections?.slice(0, 2)" :key="idx" class="text-xs text-gray-400 truncate max-w-[220px]">
                    {{ sel.match ? `${sel.match.home_team} vs ${sel.match.away_team}` : 'Mechi' }} — {{ getMarketDisplay(sel.market_key) }} {{ sel.outcome_key }}
                  </div>
                  <span v-if="bet.selections?.length > 2" class="text-xs text-gray-500">+{{ bet.selections.length - 2 }} zaidi</span>
                </div>
              </td>
              <td class="px-4 py-4 text-rose-400 text-sm font-bold whitespace-nowrap">TZS {{ formatMoney(bet.stake) }}</td>
              <td class="px-4 py-4 text-white text-sm font-semibold whitespace-nowrap">{{ formatOdds(bet.total_odds) }}</td>
              <td class="px-4 py-4 text-emerald-400 text-sm font-bold whitespace-nowrap">TZS {{ formatMoney(bet.possible_win) }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="statusClass(bet)" class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{{ bet.status || '—' }}</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="resultClass(bet)" class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{{ resultLabel(bet) }}</span>
              </td>
              <td class="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{{ formatDate(bet.created_at || bet.createdAt) }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <button @click="viewBetDetails(bet)"
                        class="px-3 py-1.5 bg-white/5 text-white border border-[#2A2A2A] rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">
                  👁 Angalia
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <p class="text-sm text-gray-400">
        Showing <span class="text-white font-semibold">{{ bets.length }}</span> of <span class="text-white font-semibold">{{ total }}</span> bets
      </p>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="offset === 0 || isLoading"
                class="px-4 py-2 bg-white/5 border border-[#2A2A2A] text-white text-sm rounded-lg disabled:opacity-40 hover:bg-white/10 transition-all">
          ← Prev
        </button>
        <button @click="nextPage" :disabled="!hasMore || isLoading"
                class="px-4 py-2 bg-white/5 border border-[#2A2A2A] text-white text-sm rounded-lg disabled:opacity-40 hover:bg-white/10 transition-all">
          Next →
        </button>
      </div>
    </div>

    <!-- Details Modal (read-only) -->
    <div v-if="showDetailsModal && selectedBet" class="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm" @click.self="closeDetailsModal">
      <div class="relative w-full max-w-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
        <button class="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors" @click="closeDetailsModal">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h3 class="text-lg font-bold text-white font-mono">{{ selectedBet.ticket_code }}</h3>
        <p class="mt-1 text-xs text-gray-400">User: <span class="text-white font-semibold">{{ selectedBet.user?.phone_number || 'N/A' }}</span>
          &nbsp;·&nbsp; {{ formatDate(selectedBet.created_at || selectedBet.createdAt) }}</p>

        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Stake</p>
            <p class="mt-1 text-lg font-bold text-white">TZS {{ formatMoney(selectedBet.stake) }}</p>
          </div>
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Odds</p>
            <p class="mt-1 text-lg font-bold text-white">{{ formatOdds(selectedBet.total_odds) }}</p>
          </div>
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Potential Win</p>
            <p class="mt-1 text-lg font-bold text-emerald-400">TZS {{ formatMoney(selectedBet.possible_win) }}</p>
          </div>
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Payout</p>
            <p class="mt-1 text-lg font-bold text-rose-400">TZS {{ formatMoney(selectedBet.payout) }}</p>
          </div>
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Status</p>
            <p class="mt-1"><span :class="statusClass(selectedBet)" class="px-2.5 py-1 rounded-full text-xs font-semibold">{{ selectedBet.status }}</span></p>
          </div>
          <div class="bg-[#0D0D0D] rounded-xl p-3">
            <p class="text-xs text-gray-400 uppercase">Result</p>
            <p class="mt-1"><span :class="resultClass(selectedBet)" class="px-2.5 py-1 rounded-full text-xs font-semibold">{{ resultLabel(selectedBet) }}</span></p>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">Selections ({{ selectedBet.selections?.length || 0 }})</p>
          <div class="space-y-2">
            <div v-for="(sel, idx) in selectedBet.selections" :key="idx" class="bg-[#0D0D0D] rounded-xl p-3 text-sm">
              <p class="text-white font-semibold">{{ sel.match ? `${sel.match.home_team} vs ${sel.match.away_team}` : 'Mechi' }}</p>
              <div class="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span>{{ sel.match?.league || 'League' }} · {{ getMarketDisplay(sel.market_key) }} · {{ sel.outcome_key }}</span>
                <span class="text-white font-semibold">{{ sel.odds_at_placement || formatOdds(sel.odds) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BetService from '../../../services/bet/bet.service'

const bets = ref([])
const total = ref(0)
const offset = ref(0)
const limit = ref(20)
const hasMore = ref(false)
const isLoading = ref(false)

const showDetailsModal = ref(false)
const selectedBet = ref(null)

const filters = reactive({ search: '' })

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(Number(n || 0))
}

function formatOdds(o) {
  const v = Number(o)
  return isNaN(v) ? '—' : v.toFixed(2)
}

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function getMarketDisplay(marketKey) {
  const marketMap = {
    '1X2': '1X2',
    'Double Chance': 'Double Chance',
    'BTTS': 'BTTS',
    'Over/Under': 'Over/Under',
    'Correct Score': 'Correct Score',
    'CS_FH': 'CS FH',
    'CS_SH': 'CS SH'
  }
  return marketMap[marketKey] || marketKey || '1X2'
}

function statusClass(bet) {
  if (!bet) return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
  if (bet.status === 'OPEN') return 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
  if (bet.status === 'SETTLED') return 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
  return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
}

function resultLabel(bet) {
  if (!bet) return '—'
  if (bet.result === 'CASHED_OUT') return 'CASH OUT'
  return bet.result || '—'
}

function resultClass(bet) {
  if (!bet) return ''
  if (bet.result === 'WON') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
  if (bet.result === 'LOST') return 'bg-gray-500/15 text-gray-400 border border-gray-500/25'
  if (bet.result === 'CASHED_OUT') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  return 'bg-white/5 text-gray-300 border border-white/10'
}

async function loadBets() {
  isLoading.value = true
  try {
    const response = await BetService.getAdminBets({
      search: filters.search,
      limit: limit.value,
      offset: offset.value
    })
    if (response?.success) {
      bets.value = response.data.bets || []
      total.value = response.data.total || 0
      hasMore.value = response.data.hasMore || false
    } else {
      bets.value = []
      total.value = 0
      hasMore.value = false
    }
  } catch (error) {
    console.error('Error loading bets:', error)
    bets.value = []
    total.value = 0
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

function searchBets() {
  offset.value = 0
  loadBets()
}

function nextPage() {
  offset.value = offset.value + limit.value
  loadBets()
}

function prevPage() {
  offset.value = Math.max(0, offset.value - limit.value)
  loadBets()
}

function viewBetDetails(bet) {
  selectedBet.value = bet
  showDetailsModal.value = true
}

function closeDetailsModal() {
  showDetailsModal.value = false
}

onMounted(loadBets)
</script>