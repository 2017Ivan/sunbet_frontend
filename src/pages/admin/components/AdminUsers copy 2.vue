<!-- views/admin/AdminUsers.vue - SunBet Theme -->
<template>
  <div class="space-y-6">
    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Total Users</p>
        <p class="text-2xl font-bold text-white">{{ manageUsersStore.totalUsers }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Active Today</p>
        <p class="text-2xl font-bold text-white">{{ activeToday }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Total Deposits</p>
        <p class="text-2xl font-bold text-rose-400">TZS {{ formatMoney(totalDeposits) }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 hover:border-rose-500/30 transition-all duration-300">
        <p class="text-gray-400 text-sm">Total Withdrawals</p>
        <p class="text-2xl font-bold text-gray-400">TZS {{ formatMoney(totalWithdrawals) }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="manageUsersStore.isLoading" class="flex justify-center py-8">
      <div class="flex items-center gap-3 text-gray-400">
        <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-lg">Loading users...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="manageUsersStore.hasError" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
      {{ manageUsersStore.errorMessage }}
    </div>

    <!-- Search and Filters -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4">
      <div class="flex flex-wrap gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by phone number..."
          class="flex-1 px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          @input="handleSearch"
        />
        <button @click="loadUsers" 
                class="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20">
          🔍 Search
        </button>
        <button @click="exportUsers" 
                class="px-6 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
          📊 Export CSV
        </button>
        <button @click="refreshUsers" 
                class="px-6 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#0D0D0D]">
            <tr>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">User ID</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Phone Number</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Balance</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Role</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Total Bets</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Total Won</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Joined</th>
              <th class="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="manageUsersStore.allUsers.length === 0 && !manageUsersStore.isLoading">
              <td colspan="8" class="px-6 py-8 text-center text-gray-400">
                No users found
              </td>
            </tr>
            <tr v-for="user in manageUsersStore.allUsers" :key="user.id" 
                class="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]/30 transition-all duration-200">
              <td class="px-6 py-4 text-white text-sm font-mono">{{ user.id?.slice(0, 8) }}...</td>
              <td class="px-6 py-4 text-gray-300 text-sm">{{ user.phone_number }}</td>
              <td class="px-6 py-4 text-rose-400 text-sm font-bold">TZS {{ formatMoney(user.balance) }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium border"
                  :class="{
                    'bg-rose-500/10 text-rose-400 border-rose-500/20': user.role === 'ADMIN',
                    'bg-blue-500/10 text-blue-400 border-blue-500/20': user.role === 'AGENT',
                    'bg-gray-500/10 text-gray-400 border-gray-500/20': user.role === 'USER'
                  }"
                >
                  {{ user.role || 'USER' }}
                </span>
              </td>
              <td class="px-6 py-4 text-white text-sm">{{ user.totalBets || 0 }}</td>
              <td class="px-6 py-4 text-rose-400 text-sm">TZS {{ formatMoney(user.totalWon || 0) }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="openAdjustBalanceModal(user)" 
                          class="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="Adjust Balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  <button @click="viewUserDetails(user)" 
                          class="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="View Details">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="openDeleteModal(user)" 
                          class="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-[#2A2A2A]" 
                          title="Delete User">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
    <div class="flex justify-between items-center">
      <p class="text-gray-500 text-sm">
        Showing {{ manageUsersStore.allUsers.length }} of {{ manageUsersStore.totalUsers }} users
      </p>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          :disabled="manageUsersStore.pagination.offset === 0 || manageUsersStore.isLoading"
          class="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400 hover:text-white hover:border-rose-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="!manageUsersStore.pagination.hasMore || manageUsersStore.isLoading"
          class="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400 hover:text-white hover:border-rose-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Adjust Balance Modal - SunBet Theme -->
    <div v-if="showBalanceModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" 
         @click.self="closeBalanceModal">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-md shadow-2xl shadow-rose-500/10 animate-fadeIn">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-white">Adjust Balance</h3>
          <button @click="closeBalanceModal" class="text-gray-500 hover:text-rose-400 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-gray-400 mb-2">User: <span class="text-white">{{ selectedUser?.phone_number }}</span></p>
        <p class="text-gray-400 mb-4">Current Balance: <span class="text-rose-400 font-bold">TZS {{ formatMoney(selectedUser?.balance) }}</span></p>
        
        <div class="space-y-4">
          <select v-model="balanceAction" 
                  class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:border-rose-500/50 focus:outline-none transition-colors">
            <option value="add">➕ Add (Deposit)</option>
            <option value="deduct">➖ Deduct (Withdraw)</option>
            <option value="set">🎯 Set Exact Amount</option>
          </select>
          
          <input 
            v-model.number="balanceAmount"
            type="number" 
            placeholder="Enter amount..."
            class="w-full px-4 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          />
          
          <div class="flex gap-3">
            <button @click="confirmAdjustBalance" 
                    class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/20">
              Confirm
            </button>
            <button @click="closeBalanceModal" 
                    class="flex-1 py-3 bg-[#2A2A2A] text-gray-400 rounded-xl font-bold hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal - SunBet Theme -->
    <div v-if="showDeleteModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" 
         @click.self="closeDeleteModal">
      <div class="bg-[#1A1A1A] rounded-2xl border border-red-500/30 p-6 w-full max-w-md shadow-2xl shadow-red-500/10 animate-fadeIn">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-red-400">Delete User</h3>
          <button @click="closeDeleteModal" class="text-gray-500 hover:text-red-400 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-white mb-2">Are you sure you want to delete this user?</p>
        <p class="text-gray-400 mb-4">User: <span class="text-white">{{ selectedUser?.phone_number }}</span></p>
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p class="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span> This action cannot be undone!
          </p>
        </div>
        
        <div class="flex gap-3">
          <button @click="confirmDeleteUser" 
                  class="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/20">
            Delete
          </button>
          <button @click="closeDeleteModal" 
                  class="flex-1 py-3 bg-[#2A2A2A] text-gray-400 rounded-xl font-bold hover:bg-[#3A3A3A] hover:text-white transition-all duration-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useManageUsersStore } from '../../../stores/users/manageUsersStore'
import api from '../../../services/api'

// ── Store ──────────────────────────────────────────────────────────────────
const manageUsersStore = useManageUsersStore()

// ── Local State ────────────────────────────────────────────────────────────
const searchQuery = ref('')
const searchTimeout = ref(null)

const activeToday = ref(0)
const totalDeposits = ref(0)
const totalWithdrawals = ref(0)

const showBalanceModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)
const balanceAction = ref('add')
const balanceAmount = ref(0)

// ── Format Helpers ──────────────────────────────────────────────────────────
function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

// ── Load Users ──────────────────────────────────────────────────────────────
async function loadUsers() {
  await manageUsersStore.fetchUsers({ search: searchQuery.value })
}

async function refreshUsers() {
  searchQuery.value = ''
  await manageUsersStore.resetAndFetch()
}

function handleSearch() {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    loadUsers()
  }, 500)
}

// ── Pagination ─────────────────────────────────────────────────────────────
async function nextPage() {
  await manageUsersStore.loadNextPage()
}

async function prevPage() {
  if (manageUsersStore.pagination.offset > 0) {
    manageUsersStore.pagination.offset = manageUsersStore.pagination.offset - manageUsersStore.pagination.limit
    await loadUsers()
  }
}

// ── Export Users ────────────────────────────────────────────────────────────
async function exportUsers() {
  try {
    const response = await api.get('/admin/users/export', {
      params: { search: searchQuery.value },
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export users:', error)
    alert('Failed to export users')
  }
}

// ── Balance Modal ───────────────────────────────────────────────────────────
function openAdjustBalanceModal(user) {
  selectedUser.value = user
  balanceAmount.value = 0
  balanceAction.value = 'add'
  showBalanceModal.value = true
}

async function confirmAdjustBalance() {
  if (!selectedUser.value || !balanceAmount.value || balanceAmount.value <= 0) {
    alert('Please enter a valid amount')
    return
  }
  
  const result = await manageUsersStore.updateUserBalance(
    selectedUser.value.id,
    balanceAction.value,
    balanceAmount.value
  )
  
  if (result.success) {
    closeBalanceModal()
    alert('Balance updated successfully!')
  } else {
    alert(result.message || 'Failed to update balance')
  }
}

function closeBalanceModal() {
  showBalanceModal.value = false
  selectedUser.value = null
  balanceAmount.value = 0
}

// ── Delete Modal ───────────────────────────────────────────────────────────
function openDeleteModal(user) {
  selectedUser.value = user
  showDeleteModal.value = true
}

async function confirmDeleteUser() {
  if (!selectedUser.value) return
  
  const result = await manageUsersStore.removeUser(selectedUser.value.id)
  
  if (result.success) {
    closeDeleteModal()
    alert('User deleted successfully!')
  } else {
    alert(result.message || 'Failed to delete user')
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedUser.value = null
}

// ── View User Details ──────────────────────────────────────────────────────
function viewUserDetails(user) {
  console.log('View user details:', user)
  // Navigate to user details page
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  loadUsers()
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
</style>