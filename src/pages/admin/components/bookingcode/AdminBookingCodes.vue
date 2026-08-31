<!-- views/admin/AdminBookingCodes.vue - Booking codes zote (list + status) + search kwa code -->
<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">Jumla ya Codes</p>
        <p class="mt-1 text-2xl font-bold text-white">{{ total }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">ACTIVE</p>
        <p class="mt-1 text-2xl font-bold text-emerald-400">{{ activeCount }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">EXPIRED</p>
        <p class="mt-1 text-2xl font-bold text-amber-400">{{ expiredCount }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">DEACTIVATED</p>
        <p class="mt-1 text-2xl font-bold text-rose-400">{{ deactivatedCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" @change="handleStatusFilter"
                class="px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors">
          <option value="" class="bg-[#0D0D0D]">All Status</option>
          <option value="ACTIVE" class="bg-[#0D0D0D]">ACTIVE</option>
          <option value="EXPIRED" class="bg-[#0D0D0D]">EXPIRED</option>
          <option value="DEACTIVATED" class="bg-[#0D0D0D]">DEACTIVATED</option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Tafuta kwa booking code (mf. BC-8X92A)..."
          class="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
          @keyup.enter="searchCodes"
        />

        <button @click="searchCodes"
                class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/20 whitespace-nowrap">
          🔍 Tafuta
        </button>
      </div>
    </div>

    <!-- Codes Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto overflow-y-auto" style="max-height: 600px;">
        <table class="w-full min-w-[900px]">
          <thead class="bg-[#0D0D0D] sticky top-0 z-20">
            <tr>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Code</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Total Odds</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Selections</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Creator</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Expires At</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Created</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-10 text-center text-gray-400">Inapakia booking codes...</td>
            </tr>
            <tr v-else-if="codes.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-gray-400">Hakuna booking codes zilizopatikana</td>
            </tr>
            <tr v-for="code in codes" :key="code.id"
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-4 py-4 text-white text-sm font-mono whitespace-nowrap">{{ code.code }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="statusClass(code.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{{ code.status }}</span>
              </td>
              <td class="px-4 py-4 text-amber-400 text-sm font-bold whitespace-nowrap">{{ formatOdds(code.total_odds) }}</td>
              <td class="px-4 py-4 text-gray-300 text-sm whitespace-nowrap">{{ code.selections_count }}</td>
              <td class="px-4 py-4 text-gray-400 text-sm whitespace-nowrap">{{ code.creator?.phone_number || 'Public' }}</td>
              <td class="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{{ formatDate(code.expires_at) }}</td>
              <td class="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{{ formatDate(code.created_at) }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <button @click="viewSelections(code)"
                        class="px-3 py-1.5 bg-white/5 text-white border border-[#2A2A2A] rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">
                  👁 Selections
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
        Showing <span class="text-white font-semibold">{{ codes.length }}</span> of <span class="text-white font-semibold">{{ total }}</span> codes
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

    <!-- Selections Modal (read-only) -->
    <div v-if="showSelectionsModal && selectedCode" class="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm" @click.self="closeSelectionsModal">
      <div class="relative w-full max-w-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
        <button class="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors" @click="closeSelectionsModal">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h3 class="text-lg font-bold text-white font-mono">{{ selectedCode.code }}</h3>
        <div class="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span :class="statusClass(selectedCode.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">{{ selectedCode.status }}</span>
          <span>Odds: <b class="text-amber-400">{{ formatOdds(selectedCode.total_odds) }}</b></span>
          <span>Selections: <b class="text-white">{{ selectedCode.selections_count }}</b></span>
        </div>

        <div class="mt-4 space-y-2">
          <div v-for="(sel, idx) in selectedCode.selections" :key="idx" class="bg-[#0D0D0D] rounded-xl p-3 text-sm">
            <p class="text-white font-semibold">{{ sel.home_team }} vs {{ sel.away_team }}</p>
            <div class="mt-1 flex items-center justify-between text-xs text-gray-400">
              <span>{{ sel.league }} · {{ getMarketDisplay(sel.market_key) }} · {{ sel.outcome_key }} ({{ sel.odds }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { bookingCodeService } from '../../../../services/bookingCode/bookingCode.service'

const codes = ref([])
const total = ref(0)
const offset = ref(0)
const limit = ref(50)
const hasMore = ref(false)
const isLoading = ref(false)

const showSelectionsModal = ref(false)
const selectedCode = ref(null)

const filters = reactive({ search: '', status: '' })

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

function statusClass(status) {
  if (status === 'ACTIVE') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
  if (status === 'EXPIRED') return 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
  return 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
}

async function loadCodes() {
  isLoading.value = true
  try {
    const response = await bookingCodeService.getAdminBookingCodes({
      search: filters.search,
      status: filters.status,
      limit: limit.value,
      offset: offset.value
    })
    const data = response?.data?.data
    if (data && response?.data?.success) {
      codes.value = data.codes || []
      total.value = data.total || 0
      hasMore.value = data.hasMore || false
    } else {
      codes.value = []
      total.value = 0
      hasMore.value = false
    }
  } catch (error) {
    console.error('Error loading booking codes:', error)
    codes.value = []
    total.value = 0
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

function searchCodes() {
  offset.value = 0
  loadCodes()
}

function handleStatusFilter() {
  offset.value = 0
  loadCodes()
}

function nextPage() {
  offset.value = offset.value + limit.value
  loadCodes()
}

function prevPage() {
  offset.value = Math.max(0, offset.value - limit.value)
  loadCodes()
}

function viewSelections(code) {
  selectedCode.value = code
  showSelectionsModal.value = true
}

function closeSelectionsModal() {
  showSelectionsModal.value = false
}

// ---- Computed stats (kutoka list ya sasa) ----
const activeCount = computed(() => codes.value.filter(c => c.status === 'ACTIVE').length)
const expiredCount = computed(() => codes.value.filter(c => c.status === 'EXPIRED').length)
const deactivatedCount = computed(() => codes.value.filter(c => c.status === 'DEACTIVATED').length)

onMounted(loadCodes)
</script>