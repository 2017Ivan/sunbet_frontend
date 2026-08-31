<!-- views/admin/AdminDeposits.vue - Deposit transactions (completed + pending/failed) -->
<template>
  <div class="space-y-6">
    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">Jumla ya Kiasi (SUCCESS)</p>
        <p class="mt-1 text-2xl font-bold text-emerald-400">TZS {{ formatMoney(stats.total) }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">Zilizokamilika</p>
        <p class="mt-1 text-2xl font-bold text-emerald-400">{{ stats.completed || 0 }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">Zinazosubiri</p>
        <p class="mt-1 text-2xl font-bold text-amber-400">{{ stats.pending || 0 }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">Zilizokataliwa</p>
        <p class="mt-1 text-2xl font-bold text-rose-400">{{ stats.failed || 0 }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" @change="loadDeposits"
                class="px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors">
          <option value="ALL" class="bg-[#0D0D0D]">All Deposits</option>
          <option value="SUCCESS" class="bg-[#0D0D0D]">Completed</option>
          <option value="PENDING" class="bg-[#0D0D0D]">Pending</option>
          <option value="FAILED" class="bg-[#0D0D0D]">Failed</option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Tafuta kwa simu, reference..."
          class="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
          @keyup.enter="loadDeposits"
        />

        <button @click="loadDeposits"
                class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/20 whitespace-nowrap">
          🔍 Tafuta
        </button>

        <button @click="showCreateModal = true"
                class="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-amber-500/20 whitespace-nowrap">
          ＋ Deposit Mpya (PENDING)
        </button>
      </div>
    </div>

    <!-- Deposits Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto overflow-y-auto" style="max-height: 600px;">
        <table class="w-full min-w-[900px]">
          <thead class="bg-[#0D0D0D] sticky top-0 z-20">
            <tr>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Reference</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">User</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Kiasi</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Balance (Awali → Baada)</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Maelezo</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Tarehe</th>
              <th class="text-left px-4 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-10 text-center text-gray-400">Inapakia deposits...</td>
            </tr>
            <tr v-else-if="deposits.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-gray-400">Hakuna deposits zilizopatikana</td>
            </tr>
            <tr v-for="dep in deposits" :key="dep.id"
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-4 py-4 text-white text-sm font-mono whitespace-nowrap">{{ dep.reference }}</td>
              <td class="px-4 py-4 text-gray-300 text-sm whitespace-nowrap">{{ dep.user?.phone_number || 'N/A' }}</td>
              <td class="px-4 py-4 text-emerald-400 text-sm font-bold whitespace-nowrap">TZS {{ formatMoney(dep.amount) }}</td>
              <td class="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">
                TZS {{ formatMoney(dep.balance_before) }} → TZS {{ formatMoney(dep.balance_after) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="statusClass(dep.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  {{ statusLabel(dep.status) }}
                </span>
              </td>
              <td class="px-4 py-4 text-gray-400 text-sm max-w-[220px] truncate">{{ dep.description || '—' }}</td>
              <td class="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{{ formatDate(dep.created_at) }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div v-if="dep.status === 'PENDING'" class="flex gap-2">
                  <button @click="handleAction(dep, 'confirm')"
                          class="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-lg text-xs font-semibold hover:bg-emerald-500/25 transition-all">
                    ✓ IDHINI
                  </button>
                  <button @click="handleAction(dep, 'reject')"
                          class="px-3 py-1.5 bg-rose-500/15 text-rose-400 border border-rose-500/25 rounded-lg text-xs font-semibold hover:bg-rose-500/25 transition-all">
                    ✕ KATAZA
                  </button>
                </div>
                <span v-else class="text-gray-600 text-xs">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Pending Deposit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div class="relative w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
        <button class="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors" @click="showCreateModal = false">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="text-lg font-bold text-white">Deposit Mpya (PENDING)</h3>
        <p class="mt-1 text-xs text-gray-400">Kwa malipo ya benki/M-Pesa yanayosubiri kuthibitishwa na admin.</p>

        <div class="mt-5 space-y-4">
          <div>
            <label class="text-xs text-gray-400 uppercase tracking-wider">Namba ya Simu</label>
            <input v-model="createForm.phone_number" type="text" placeholder="2557XXXXXXXX"
                   class="mt-1 w-full px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <div>
            <label class="text-xs text-gray-400 uppercase tracking-wider">Kiasi (TZS)</label>
            <input v-model="createForm.amount" type="number" min="1" placeholder="10000"
                   class="mt-1 w-full px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <div>
            <label class="text-xs text-gray-400 uppercase tracking-wider">Maelezo</label>
            <input v-model="createForm.description" type="text" placeholder="M-Pesa kicki, Benki..."
                   class="mt-1 w-full px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm focus:border-emerald-500/50 focus:outline-none" />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button @click="showCreateModal = false"
                  class="flex-1 px-4 py-2.5 rounded-lg bg-[#2A2A2A] text-gray-300 text-sm font-semibold hover:bg-[#333] transition-colors">
            Ghairi
          </button>
          <button @click="createDeposit" :disabled="isCreating"
                  class="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-60">
            {{ isCreating ? 'Inaunda...' : 'Unda PENDING' }}
          </button>
        </div>
        <p v-if="notificationVisible" class="mt-3 text-xs font-semibold text-center" :class="notificationOk ? 'text-emerald-400' : 'text-rose-400'">
          {{ notificationMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import adminDepositService from '../../../services/admin/adminDepositService'

const deposits = ref([])
const stats = ref({ completed: 0, pending: 0, failed: 0, total: 0 })
const isLoading = ref(false)
const isCreating = ref(false)
const showCreateModal = ref(false)
const createForm = reactive({ phone_number: '', amount: '', description: '' })
const notificationVisible = ref(false)
const notificationOk = ref(true)
const notificationMessage = ref('')

const filters = reactive({ status: 'ALL', search: '' })

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(Number(n || 0))
}

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function statusLabel(status) {
  return { SUCCESS: 'COMPLETED', PENDING: 'PENDING', FAILED: 'FAILED' }[status] || status || '—'
}

function statusClass(status) {
  if (status === 'SUCCESS') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
  if (status === 'PENDING') return 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
  return 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
}

function notify(message, ok = true) {
  notificationMessage.value = message
  notificationOk.value = ok
  notificationVisible.value = true
  setTimeout(() => (notificationVisible.value = false), 3500)
}

async function loadDeposits() {
  isLoading.value = true
  try {
    const result = await adminDepositService.getDeposits(filters)
    if (result.success) {
      deposits.value = result.data.deposits || []
      stats.value = result.data.stats || { completed: 0, pending: 0, failed: 0, total: 0 }
    } else {
      notify(result.message, false)
    }
  } catch (error) {
    console.error('Error loading deposits:', error)
  } finally {
    isLoading.value = false
  }
}

async function createDeposit() {
  if (!createForm.phone_number || !createForm.amount) {
    notify('Jaza namba ya simu na kiasi', false)
    return
  }
  isCreating.value = true
  try {
    const result = await adminDepositService.createPendingDeposit(createForm)
    if (result.success) {
      notify(result.message || 'Deposit imeundwa')
      showCreateModal.value = false
      createForm.phone_number = ''
      createForm.amount = ''
      createForm.description = ''
      await loadDeposits()
    } else {
      notify(result.message, false)
    }
  } finally {
    isCreating.value = false
  }
}

async function handleAction(dep, action) {
  const result = action === 'confirm'
    ? await adminDepositService.confirmDeposit(dep.id)
    : await adminDepositService.rejectDeposit(dep.id)
  if (result.success) {
    notify(result.message)
  } else {
    notify(result.message, false)
  }
  await loadDeposits()
}

onMounted(loadDeposits)
</script>