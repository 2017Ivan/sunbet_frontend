<!-- views/admin/AdminBets.vue - SunBet Theme -->
<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" 
                class="px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-rose-500/50 focus:outline-none transition-colors">
          <option value="" class="bg-[#0D0D0D]">All Status</option>
          <option value="OPEN">Open</option>
          <option value="SETTLED">Settled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <select v-model="filters.result" 
                class="px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-rose-500/50 focus:outline-none transition-colors">
          <option value="">All Results</option>
          <option value="PENDING">Pending</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
        
        <input 
          v-model="filters.search"
          type="text" 
          placeholder="Search by user or bet ID..."
          class="flex-1 px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
        />
        
        <button @click="loadBets" 
                class="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20">
          🔍 Search
        </button>
      </div>
    </div>

    <!-- Bets Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#0D0D0D]">
            <tr>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Bet ID</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">User</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Selections</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Stake</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Potential Win</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bet in bets" :key="bet.id" 
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-6 py-4 text-white text-sm font-mono">#{{ bet.id }}</td>
              <td class="px-6 py-4 text-gray-300 text-sm">{{ bet.user?.phone_number || 'N/A' }}</td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-for="(sel, idx) in bet.selections?.slice(0, 2)" :key="idx" class="text-xs text-gray-400">
                    {{ sel.match?.name || sel.matchName }}
                  </div>
                  <span v-if="bet.selections?.length > 2" class="text-xs text-gray-500">+{{ bet.selections.length - 2 }} more</span>
                </div>
              </td>
              <td class="px-6 py-4 text-rose-400 text-sm font-bold">TZS {{ formatMoney(bet.stake) }}</td>
              <td class="px-6 py-4 text-rose-400 text-sm font-bold">TZS {{ formatMoney(bet.potentialReturn) }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getStatusClass(bet)">
                  {{ bet.status }} · {{ bet.result }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="viewBetDetails(bet)" 
                          class="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-[#2A2A2A]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button v-if="bet.status === 'OPEN' && bet.result === 'PENDING'" 
                          @click="openSettleModal(bet)" 
                          class="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-[#2A2A2A]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-[#2A2A2A]">
        <p class="text-sm text-gray-500">Showing {{ bets.length }} of {{ total }} bets</p>
        <div class="flex gap-2">
          <button @click="prevPage" 
                  :disabled="page === 1" 
                  class="px-4 py-2 rounded-lg bg-[#0D0D0D] text-gray-400 hover:text-white hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm">
            ← Previous
          </button>
          <button @click="nextPage" 
                  :disabled="page * limit >= total" 
                  class="px-4 py-2 rounded-lg bg-[#0D0D0D] text-gray-400 hover:text-white hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm">
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Settle Bet Modal - SunBet Theme -->
    <div v-if="showSettleModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" 
         @click.self="closeSettleModal">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-md shadow-2xl shadow-rose-500/10 animate-fadeIn">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-white">Settle Bet</h3>
          <button @click="closeSettleModal" class="text-gray-500 hover:text-rose-400 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-gray-400 mb-4 font-mono text-sm">Bet #{{ selectedBet?.id }}</p>
        
        <div class="space-y-4">
          <!-- Bet Details -->
          <div class="bg-[#0D0D0D] rounded-xl p-4 border border-[#2A2A2A]">
            <div class="flex justify-between mb-2">
              <span class="text-gray-400 text-sm">Stake</span>
              <span class="text-white font-bold">TZS {{ formatMoney(selectedBet?.stake) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">Potential Win</span>
              <span class="text-rose-400 font-bold">TZS {{ formatMoney(selectedBet?.potentialReturn) }}</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button @click="confirmSettle('WON')" 
                    class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20">
              ✅ Won
            </button>
            <button @click="confirmSettle('LOST')" 
                    class="flex-1 py-3 bg-[#2A2A2A] text-gray-300 rounded-xl font-bold hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
              ❌ Lost
            </button>
          </div>
          
          <button @click="closeSettleModal" 
                  class="w-full py-2 text-gray-500 hover:text-gray-300 transition-colors text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBetStore } from '../../../stores/bets/betStore'
import { useRouter } from 'vue-router'

const betStore = useBetStore()
const router = useRouter()

const bets = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const showSettleModal = ref(false)
const selectedBet = ref(null)

const filters = ref({
  status: '',
  result: '',
  search: ''
})

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function getStatusClass(bet) {
  if (bet.result === 'WON') return 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
  if (bet.result === 'LOST') return 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
  if (bet.status === 'OPEN') return 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
}

async function loadBets() {
  const result = await betStore.loadAdminBets({
    ...filters.value,
    page: page.value,
    limit: limit.value
  })
  if (result.success) {
    bets.value = result.data.bets
    total.value = result.data.total
  }
}

function openSettleModal(bet) {
  selectedBet.value = bet
  showSettleModal.value = true
}

function closeSettleModal() {
  showSettleModal.value = false
  selectedBet.value = null
}

async function confirmSettle(result) {
  if (!selectedBet.value) return
  
  try {
    const response = await betStore.settleBet(selectedBet.value.id, result)
    if (response.success) {
      closeSettleModal()
      await loadBets()
    } else {
      alert(response.message || 'Failed to settle bet')
    }
  } catch (error) {
    console.error('Error settling bet:', error)
    alert('An error occurred while settling the bet')
  }
}

function viewBetDetails(bet) {
  router.push(`/admin/bets/${bet.id}`)
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    loadBets()
  }
}

function nextPage() {
  if (page.value * limit.value < total.value) {
    page.value++
    loadBets()
  }
}

onMounted(() => {
  loadBets()
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

/* Select dropdown styling */
select option {
  background: #0D0D0D;
  color: white;
}

/* Input focus effects */
input:focus, select:focus {
  box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.1);
}
</style>