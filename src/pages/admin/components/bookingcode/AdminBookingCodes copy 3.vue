<!-- views/admin/AdminBookingCodes.vue - SunBet Theme -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Booking Codes</h1>
        <p class="text-gray-400 text-sm">Manage all booking codes and update match scores</p>
      </div>
      <div class="flex gap-3">
        <button @click="refreshData" 
                class="px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
          🔄 Refresh
        </button>
        <button @click="exportData" 
                class="px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
          📊 Export
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Total Codes</p>
        <p class="text-2xl font-bold text-white">{{ bookingCodeStore.totalCodes }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Active Codes</p>
        <p class="text-2xl font-bold text-emerald-400">{{ activeCodes }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Expired Codes</p>
        <p class="text-2xl font-bold text-red-400">{{ expiredCodes }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Total Selections</p>
        <p class="text-2xl font-bold text-rose-400">{{ totalSelections }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="bookingCodeStore.isLoading" class="flex justify-center py-8">
      <div class="flex items-center gap-3 text-gray-400">
        <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-lg">Loading booking codes...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="bookingCodeStore.error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
      {{ bookingCodeStore.error }}
    </div>

    <!-- Search and Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by code or match name..."
          class="flex-1 px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          @input="handleSearch"
        />
        <select v-model="statusFilter" 
                class="px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-rose-500/50 focus:outline-none transition-colors">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <button @click="loadData" 
                class="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20">
          🔍 Search
        </button>
      </div>
    </div>

    <!-- Booking Codes Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1000px]">
          <thead class="bg-[#0D0D0D] sticky top-0 z-10">
            <tr>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Code</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">User</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Selections</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Created</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Expires</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="bookingCodeStore.bookingCodes.length === 0 && !bookingCodeStore.isLoading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">
                No booking codes found
              </td>
            </tr>
            <tr v-for="code in bookingCodeStore.bookingCodes" :key="code.id" 
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-6 py-4">
                <span class="font-mono font-bold text-rose-400 text-sm">{{ code.code }}</span>
              </td>
              <td class="px-6 py-4 text-gray-300 text-sm">{{ code.userId || 'Anonymous' }}</td>
              <td class="px-6 py-4 text-white text-sm">
                <span class="px-2 py-1 bg-[#2A2A2A] rounded text-xs">
                  {{ code.selections?.length || 0 }} selections
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium border"
                  :class="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': code.status === 'ACTIVE',
                    'bg-red-500/10 text-red-400 border-red-500/20': code.status === 'EXPIRED'
                  }"
                >
                  {{ code.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(code.createdAt) }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(code.expiresAt) }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="viewSelections(code)" 
                          class="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="View Selections">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="openScoreModal(code)" 
                          class="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="Update Score">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deactivateCode(code)" 
                          v-if="code.status === 'ACTIVE'"
                          class="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="Deactivate">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-wrap justify-between items-center gap-4">
      <p class="text-gray-500 text-sm">
        Showing {{ bookingCodeStore.bookingCodes.length }} of {{ bookingCodeStore.totalCodes }} codes
      </p>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          :disabled="bookingCodeStore.pagination.offset === 0 || bookingCodeStore.isLoading"
          class="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400 hover:text-white hover:border-rose-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="!bookingCodeStore.pagination.hasMore || bookingCodeStore.isLoading"
          class="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400 hover:text-white hover:border-rose-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- View Selections Modal -->
    <div v-if="showSelectionsModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
         @click.self="closeSelectionsModal">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-rose-500/10 animate-fadeIn">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#2A2A2A]">
          <div>
            <h3 class="text-xl font-bold text-white">Selections for <span class="text-rose-400">{{ selectedCode?.code }}</span></h3>
            <p class="text-sm text-gray-500">Booking Code ID: {{ selectedCode?.id }}</p>
          </div>
          <button @click="closeSelectionsModal" class="text-gray-500 hover:text-rose-400 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Selections Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(selection, index) in selectedCode?.selections" :key="index"
               class="bg-[#0D0D0D] rounded-xl p-4 border border-[#2A2A2A] hover:border-rose-500/30 transition-all duration-300">
            <div class="flex justify-between items-start mb-2">
              <p class="text-white font-medium text-sm">{{ selection.matchName }}</p>
              <span class="text-xs text-gray-500">Match ID: {{ selection.matchId }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-gray-500">Selection</p>
                <p class="text-white font-medium">{{ selection.selectionValue }} ({{ selection.selectionType }})</p>
              </div>
              <div>
                <p class="text-gray-500">Odds</p>
                <p class="text-rose-400 font-bold">{{ selection.odds }}</p>
              </div>
              <div>
                <p class="text-gray-500">Score</p>
                <p class="text-white font-medium">{{ selection.score ? `${selection.score.home} - ${selection.score.away}` : '—' }}</p>
              </div>
              <div>
                <p class="text-gray-500">Result</p>
                <span class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20': selection.result === 'PENDING',
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': selection.result === 'WON',
                    'bg-red-500/10 text-red-400 border border-red-500/20': selection.result === 'LOST'
                  }"
                >
                  {{ selection.result || 'PENDING' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No selections -->
        <div v-if="!selectedCode?.selections?.length" class="text-center py-8 text-gray-400">
          No selections found for this booking code.
        </div>

        <!-- Actions -->
        <div class="mt-4 pt-4 border-t border-[#2A2A2A] flex gap-3">
          <button @click="closeSelectionsModal" 
                  class="flex-1 px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Update Score Modal -->
    <div v-if="showScoreModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
         @click.self="closeScoreModal">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-md shadow-2xl shadow-rose-500/10 animate-fadeIn">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#2A2A2A]">
          <div>
            <h3 class="text-xl font-bold text-white">Update Score</h3>
            <p class="text-sm text-gray-500">Booking Code: <span class="text-rose-400">{{ selectedCode?.code }}</span></p>
          </div>
          <button @click="closeScoreModal" class="text-gray-500 hover:text-rose-400 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Select Match -->
        <div class="mb-4">
          <label class="text-gray-400 text-sm block mb-2">Select Match</label>
          <select v-model="selectedMatchId" 
                  class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:border-rose-500/50 focus:outline-none transition-colors">
            <option value="">Select a match...</option>
            <option v-for="(sel, idx) in selectedCode?.selections" :key="idx" :value="sel.matchId">
              {{ sel.matchName }} ({{ sel.selectionValue }})
            </option>
          </select>
        </div>

        <!-- Selection Type -->
        <div class="mb-4">
          <label class="text-gray-400 text-sm block mb-2">Selection Type</label>
          <select v-model="selectedSelectionType" 
                  class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:border-rose-500/50 focus:outline-none transition-colors">
            <option value="HOME">1 (HOME)</option>
            <option value="DRAW">X (DRAW)</option>
            <option value="AWAY">2 (AWAY)</option>
          </select>
        </div>

        <!-- Market Type -->
        <div class="mb-4">
          <label class="text-gray-400 text-sm block mb-2">Market Type</label>
          <select v-model="selectedMarketType" 
                  class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:border-rose-500/50 focus:outline-none transition-colors">
            <option value="1X2">1X2 | Full Time</option>
            <option value="Double Chance">Double Chance | Full Time</option>
            <option value="BTTS">Both Teams to Score | Full Time</option>
            <option value="Over/Under">Over/Under | Full Time</option>
            <option value="Correct Score">Correct Score | Full Time</option>
            <option value="CS_FH">Correct Score | First Half</option>
            <option value="CS_SH">Correct Score | Second Half</option>
          </select>
        </div>

        <!-- Scores -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-400 text-sm block mb-2">Home Score</label>
            <input v-model.number="homeScore" type="number" min="0" max="99"
                   class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-center text-2xl font-bold focus:border-rose-500/50 focus:outline-none transition-colors"
                   placeholder="0"/>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-2">Away Score</label>
            <input v-model.number="awayScore" type="number" min="0" max="99"
                   class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-center text-2xl font-bold focus:border-rose-500/50 focus:outline-none transition-colors"
                   placeholder="0"/>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="selectedMatchId && homeScore !== '' && awayScore !== ''" 
             class="bg-[#0D0D0D] rounded-xl p-3 mb-4 border border-[#2A2A2A]">
          <p class="text-gray-400 text-sm">Score Preview</p>
          <p class="text-white text-lg font-bold text-center">
            {{ getMatchName(selectedMatchId) }} → <span class="text-rose-400">{{ homeScore }} - {{ awayScore }}</span>
          </p>
          <p class="text-gray-500 text-xs text-center">{{ getMarketDisplay(selectedMarketType) }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button @click="confirmUpdateScore" 
                  :disabled="!selectedMatchId || homeScore === '' || awayScore === '' || !selectedSelectionType || !selectedMarketType || isUpdating"
                  class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isUpdating" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Updating...
            </span>
            <span v-else>Update Score</span>
          </button>
          <button @click="closeScoreModal" 
                  class="flex-1 py-3 bg-[#2A2A2A] text-gray-400 rounded-xl font-bold hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
            Cancel
          </button>
        </div>

        <!-- Error message -->
        <div v-if="scoreError" class="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-2">
          <p class="text-xs text-red-400 text-center">{{ scoreError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useBookingCodeStore } from '../../../../stores/bookingcode/bookingCodeStore'

// ── Stores ──────────────────────────────────────────────────────────────────
const bookingCodeStore = useBookingCodeStore()
const toast = useToast()

// ── Local State ────────────────────────────────────────────────────────────
const searchQuery = ref('')
const statusFilter = ref('')
const searchTimeout = ref(null)

const showSelectionsModal = ref(false)
const showScoreModal = ref(false)
const selectedCode = ref(null)
const selectedMatchId = ref('')
const selectedSelectionType = ref('HOME')
const selectedMarketType = ref('1X2')
const homeScore = ref('')
const awayScore = ref('')
const isUpdating = ref(false)
const scoreError = ref('')

// ── Computed ────────────────────────────────────────────────────────────────
const activeCodes = computed(() => {
  return bookingCodeStore.bookingCodes.filter(c => c.status === 'ACTIVE').length
})

const expiredCodes = computed(() => {
  return bookingCodeStore.bookingCodes.filter(c => c.status === 'EXPIRED').length
})

const totalSelections = computed(() => {
  return bookingCodeStore.bookingCodes.reduce((sum, code) => {
    return sum + (code.selections?.length || 0)
  }, 0)
})

// ── Watch for match selection ──────────────────────────────────────────────
watch(selectedMatchId, (newMatchId) => {
  if (newMatchId && selectedCode.value?.selections) {
    const selection = selectedCode.value.selections.find(s => s.matchId === newMatchId)
    if (selection) {
      selectedSelectionType.value = selection.selectionType || 'HOME'
      selectedMarketType.value = selection.marketType || '1X2'
      homeScore.value = selection.score?.home || ''
      awayScore.value = selection.score?.away || ''
    }
  }
})

// ── Format Helpers ──────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getMatchName(matchId) {
  const selection = selectedCode.value?.selections?.find(s => s.matchId === matchId)
  return selection?.matchName || matchId
}

function getMarketDisplay(marketKey) {
  const marketMap = {
    '1X2': '1X2 | Full Time',
    'Double Chance': 'Double Chance | Full Time',
    'BTTS': 'Both Teams to Score | Full Time',
    'Over/Under': 'Over/Under | Full Time',
    'Correct Score': 'Correct Score | Full Time',
    'CS_FH': 'Correct Score | First Half',
    'CS_SH': 'Correct Score | Second Half'
  }
  return marketMap[marketKey] || marketKey || '1X2 | Full Time'
}

// ── Load Data ──────────────────────────────────────────────────────────────
async function loadData() {
  const params = {}
  if (searchQuery.value) params.search = searchQuery.value
  if (statusFilter.value) params.status = statusFilter.value
  
  await bookingCodeStore.fetchAllBookingCodes(params)
}

async function refreshData() {
  searchQuery.value = ''
  statusFilter.value = ''
  await bookingCodeStore.resetAndFetchAll()
}

function handleSearch() {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    loadData()
  }, 500)
}

// ── Pagination ─────────────────────────────────────────────────────────────
async function nextPage() {
  await bookingCodeStore.loadNextPage()
}

async function prevPage() {
  if (bookingCodeStore.pagination.offset > 0) {
    bookingCodeStore.pagination.offset = bookingCodeStore.pagination.offset - bookingCodeStore.pagination.limit
    await loadData()
  }
}

// ── Export ──────────────────────────────────────────────────────────────────
function exportData() {
  toast.info('Export functionality coming soon...', {
    position: 'bottom-right',
    timeout: 3000
  })
}

// ── View Selections ────────────────────────────────────────────────────────
function viewSelections(code) {
  selectedCode.value = code
  showSelectionsModal.value = true
}

function closeSelectionsModal() {
  showSelectionsModal.value = false
}

// ── Score Modal ────────────────────────────────────────────────────────────
function openScoreModal(code) {
  selectedCode.value = code
  selectedMatchId.value = ''
  selectedSelectionType.value = 'HOME'
  selectedMarketType.value = '1X2'
  homeScore.value = ''
  awayScore.value = ''
  scoreError.value = ''
  showScoreModal.value = true
}

function closeScoreModal() {
  showScoreModal.value = false
  selectedMatchId.value = ''
  selectedSelectionType.value = 'HOME'
  selectedMarketType.value = '1X2'
  homeScore.value = ''
  awayScore.value = ''
  scoreError.value = ''
  isUpdating.value = false
}

async function confirmUpdateScore() {
  if (!selectedMatchId.value) {
    scoreError.value = 'Please select a match'
    return
  }
  
  if (homeScore.value === '' || awayScore.value === '') {
    scoreError.value = 'Please enter both scores'
    return
  }

  if (homeScore.value < 0 || awayScore.value < 0) {
    scoreError.value = 'Scores cannot be negative'
    return
  }

  if (!selectedSelectionType.value) {
    scoreError.value = 'Please select a selection type'
    return
  }

  if (!selectedMarketType.value) {
    scoreError.value = 'Please select a market type'
    return
  }

  isUpdating.value = true
  scoreError.value = ''

  try {
    const result = await bookingCodeStore.updateSelectionScore(
      selectedCode.value.id,
      selectedMatchId.value,
      parseInt(homeScore.value),
      parseInt(awayScore.value),
      selectedSelectionType.value,
      selectedMarketType.value
    )

    if (result.success) {
      toast.success('✅ Score updated successfully!', {
        position: 'bottom-right',
        timeout: 3000
      })
      closeScoreModal()
      await loadData()
    } else {
      scoreError.value = result.error || 'Failed to update score'
      toast.error(scoreError.value, {
        position: 'bottom-right',
        timeout: 3000
      })
    }
  } catch (error) {
    scoreError.value = error.message || 'An error occurred'
    toast.error(scoreError.value, {
      position: 'bottom-right',
      timeout: 3000
    })
  } finally {
    isUpdating.value = false
  }
}

// ── Deactivate Code ────────────────────────────────────────────────────────
async function deactivateCode(code) {
  if (!confirm(`Are you sure you want to deactivate booking code ${code.code}?`)) return

  try {
    const result = await bookingCodeStore.deactivateBookingCode(code.id)
    if (result.success) {
      toast.success(`✅ Booking code ${code.code} deactivated`, {
        position: 'bottom-right',
        timeout: 3000
      })
      await loadData()
    } else {
      toast.error(result.error || 'Failed to deactivate code', {
        position: 'bottom-right',
        timeout: 3000
      })
    }
  } catch (error) {
    toast.error(error.message || 'An error occurred', {
      position: 'bottom-right',
      timeout: 3000
    })
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  loadData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0D0D0D;
}
::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3A3A3A;
}

/* Button hover effects */
button {
  position: relative;
  overflow: hidden;
}

button:active {
  transform: scale(0.97);
}

/* Input focus effects */
input:focus, select:focus {
  box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.1);
}

/* Modal scroll */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>