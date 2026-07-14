<!-- withdraw.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- Page Header -->
      <div class="mb-8">
        <RouterLink to="/profile" class="inline-flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors text-sm mb-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Profile
        </RouterLink>
        <h1 class="text-3xl font-bold text-gray-100">Withdraw Funds</h1>
        <p class="text-gray-400 text-sm mt-1">Withdraw your winnings securely</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="text-gray-400 text-sm">Available Balance</p>
            <p class="text-3xl font-bold text-gray-100 mt-1">{{ formattedBalance }}</p>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="flex-1 sm:flex-none text-right">
              <p class="text-gray-400 text-xs">Total Withdrawn</p>
              <p class="text-rose-400 font-semibold">TSh {{ totalWithdrawn.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 22v-4M4 12H2M6 12H4M20 12h-2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Withdraw Form -->
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-gray-100 mb-4">Withdraw Amount</h2>
          
          <form @submit.prevent="handleWithdraw" class="space-y-4">
            <!-- Amount Input -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Amount (TSh)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">TSh</span>
                <input
                  v-model.number="withdrawAmount"
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-gray-400 text-xs">Minimum withdrawal: TSh 1,000</p>
                <button 
                  type="button"
                  @click="setMaxAmount"
                  class="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Withdraw All
                </button>
              </div>
            </div>

            <!-- Quick Amount Buttons -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Quick Amount</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="amount in quickWithdrawAmounts"
                  :key="amount"
                  type="button"
                  @click="withdrawAmount = amount"
                  class="py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm hover:border-rose-500 hover:text-rose-400 transition-all"
                  :class="{ 'border-rose-500 text-rose-400 bg-rose-500/10': withdrawAmount === amount }"
                >
                  TSh {{ amount.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Payment Method Dropdown -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Withdraw To</label>
              <div class="relative">
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  :class="{ 'border-rose-500': isDropdownOpen }"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span class="text-rose-400 font-bold text-xs">{{ getMethodInitial(selectedMethodName) }}</span>
                    </div>
                    <div class="text-left">
                      <p class="text-gray-100 text-sm font-medium">{{ selectedMethodName }}</p>
                      <p class="text-gray-400 text-xs">{{ getMethodDescription(selectedMethodName) }}</p>
                    </div>
                  </div>
                  <svg 
                    class="w-5 h-5 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': isDropdownOpen }"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                <div 
                  v-if="isDropdownOpen"
                  class="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl shadow-rose-500/10 overflow-hidden animate-dropdown"
                >
                  <div class="max-h-60 overflow-y-auto">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.id"
                      type="button"
                      @click="selectMethod(method.id)"
                      class="w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                      :class="{ 'bg-rose-500/5 border-rose-500/30': selectedMethod === method.id }"
                    >
                      <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <span class="text-rose-400 font-bold text-xs">{{ getMethodInitial(method.name) }}</span>
                      </div>
                      <div class="text-left flex-1">
                        <p class="text-gray-100 text-sm font-medium">{{ method.name }}</p>
                        <p class="text-gray-400 text-xs">{{ method.description }}</p>
                      </div>
                      <svg 
                        v-if="selectedMethod === method.id"
                        class="w-4 h-4 text-rose-400 flex-shrink-0"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2.5"
                      >
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p class="text-gray-400 text-xs mt-1">Funds will be sent to your mobile money account</p>
            </div>

            <!-- Withdrawal Summary -->
            <div v-if="withdrawAmount >= 1000" class="p-4 bg-gray-900/50 border border-gray-700 rounded-xl space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Withdrawal Amount</span>
                <span class="text-gray-100 font-semibold">TSh {{ withdrawAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Withdrawal Fee</span>
                <span class="text-gray-100 font-semibold">TSh {{ withdrawalFee.toLocaleString() }}</span>
              </div>
              <div class="border-t border-gray-700 pt-2 flex justify-between text-sm">
                <span class="text-gray-400">You'll Receive</span>
                <span class="text-rose-400 font-bold">TSh {{ netAmount.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Withdraw Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !withdrawAmount || withdrawAmount < 1000 || withdrawAmount > balance"
            >
              <template v-if="!isProcessing">
                Withdraw TSh {{ withdrawAmount.toLocaleString() || '0' }}
              </template>
              <template v-else>
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-linecap="round"/>
                  </svg>
                  Processing...
                </span>
              </template>
            </button>

            <!-- Info Messages -->
            <div v-if="withdrawAmount > balance && withdrawAmount > 0" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-red-400 text-xs">
                  Insufficient balance. You have TSh {{ balance.toLocaleString() }} available.
                </p>
              </div>
            </div>

            <div class="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p class="text-rose-400 text-xs">
                  Funds will be sent to your mobile money within 1-24 hours. Fee: 0.5% of withdrawal amount.
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Recent Withdrawals Sidebar -->
        <div class="lg:w-80 space-y-4">
          <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h3 class="text-sm font-semibold text-gray-100 mb-4">Recent Withdrawals</h3>
            <div class="space-y-3">
              <div 
                v-for="withdrawal in recentWithdrawals" 
                :key="withdrawal.id"
                class="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/50"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2v4M12 22v-4M4 12H2M6 12H4M20 12h-2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-100 text-sm font-medium">TSh {{ withdrawal.amount.toLocaleString() }}</p>
                    <p class="text-gray-400 text-xs">{{ withdrawal.method }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span 
                    class="text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-500/10 text-green-400': withdrawal.status === 'Completed',
                      'bg-yellow-500/10 text-yellow-400': withdrawal.status === 'Pending',
                      'bg-red-500/10 text-red-400': withdrawal.status === 'Failed'
                    }"
                  >
                    {{ withdrawal.status }}
                  </span>
                  <p class="text-gray-500 text-[10px] mt-1">{{ withdrawal.date }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Withdrawal Limits -->
          <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h4 class="text-sm font-semibold text-gray-100 mb-3">Withdrawal Limits</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Minimum</span>
                <span class="text-gray-100">TSh 1,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Maximum (Daily)</span>
                <span class="text-gray-100">TSh 1,000,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Fee</span>
                <span class="text-rose-400">0.5%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Processing Time</span>
                <span class="text-gray-100">1-24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeSuccessModal"></div>
        <div class="relative bg-gray-800 border border-rose-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-rose-500/5 animate-fadeIn">
          <div class="text-center">
            <div class="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Withdrawal Requested!</h3>
            <p class="text-gray-400 text-sm mb-4">
              TSh {{ lastWithdrawAmount.toLocaleString() }} will be sent to your {{ selectedMethodName }} account
            </p>
            <div class="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <p class="text-gray-400 text-xs">Transaction ID</p>
              <p class="text-gray-100 font-mono text-sm break-all">{{ transactionId }}</p>
              <p class="text-gray-400 text-xs mt-2">Status</p>
              <p class="text-yellow-400 text-sm font-medium">Pending</p>
            </div>
            <button
              @click="closeSuccessModal"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="showErrorModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeErrorModal"></div>
        <div class="relative bg-gray-800 border border-red-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-red-500/5 animate-fadeIn">
          <div class="text-center">
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Withdrawal Failed</h3>
            <p class="text-gray-400 text-sm mb-6">{{ errorMessage }}</p>
            <button
              @click="closeErrorModal"
              class="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/authStore'

const router = useRouter()
const authStore = useAuthStore()

// State
const withdrawAmount = ref(0)
const selectedMethod = ref('airtel')
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const lastWithdrawAmount = ref(0)
const transactionId = ref('')
const isDropdownOpen = ref(false)
const errorMessage = ref('')
const totalWithdrawn = ref(125000)

const quickWithdrawAmounts = [1000, 5000, 10000, 50000]
const withdrawalFeePercent = 0.005 // 0.5%

// Payment Methods
const paymentMethods = [
  { id: 'airtel', name: 'Airtel Money', description: 'Airtel Tanzania' },
  { id: 'vodacom', name: 'M-Pesa', description: 'Vodacom Tanzania' },
  { id: 'mixbyyas', name: 'Mix by Yas', description: 'Mobile Money' },
  { id: 'halotel', name: 'Halotel', description: 'Halotel Mobile Money' },
  { id: 'ttcl', name: 'TTCL', description: 'TTCL Mobile Money' }
]

// Computed
const balance = computed(() => authStore.userBalance)
const formattedBalance = computed(() => authStore.formattedBalance)

const selectedMethodName = computed(() => {
  const method = paymentMethods.find(m => m.id === selectedMethod.value)
  return method ? method.name : 'Unknown'
})

const withdrawalFee = computed(() => {
  if (!withdrawAmount.value || withdrawAmount.value < 1000) return 0
  return Math.round(withdrawAmount.value * withdrawalFeePercent)
})

const netAmount = computed(() => {
  if (!withdrawAmount.value || withdrawAmount.value < 1000) return 0
  return withdrawAmount.value - withdrawalFee.value
})

// Recent Withdrawals
const recentWithdrawals = ref([
  {
    id: 1,
    method: 'M-Pesa',
    amount: 50000,
    date: '2024-01-15 14:30',
    status: 'Completed'
  },
  {
    id: 2,
    method: 'Airtel Money',
    amount: 25000,
    date: '2024-01-14 10:20',
    status: 'Pending'
  },
  {
    id: 3,
    method: 'Mix by Yas',
    amount: 10000,
    date: '2024-01-12 09:15',
    status: 'Completed'
  }
])

// Methods
const setMaxAmount = () => {
  withdrawAmount.value = balance.value
}

const getMethodInitial = (name) => {
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getMethodDescription = (name) => {
  const method = paymentMethods.find(m => m.name === name)
  return method ? method.description : ''
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectMethod = (methodId) => {
  selectedMethod.value = methodId
  isDropdownOpen.value = false
}

const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'WTH-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const handleWithdraw = async () => {
  // Validation
  if (!withdrawAmount.value || withdrawAmount.value < 1000) {
    errorMessage.value = 'Minimum withdrawal is TSh 1,000'
    showErrorModal.value = true
    return
  }

  if (withdrawAmount.value > balance.value) {
    errorMessage.value = `Insufficient balance. You have TSh ${balance.value.toLocaleString()} available`
    showErrorModal.value = true
    return
  }

  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  isProcessing.value = true

  try {
    // Call withdrawal action from authStore
    const result = await authStore.withdraw(withdrawAmount.value)

    if (result.success) {
      lastWithdrawAmount.value = withdrawAmount.value
      transactionId.value = generateTransactionId()
      
      // Add to recent withdrawals
      recentWithdrawals.value.unshift({
        id: Date.now(),
        method: selectedMethodName.value,
        amount: withdrawAmount.value,
        date: new Date().toLocaleString(),
        status: 'Pending'
      })

      showSuccessModal.value = true
      withdrawAmount.value = 0
    } else {
      errorMessage.value = result.message || 'Withdrawal failed'
      showErrorModal.value = true
    }
  } catch (error) {
    console.error('Withdrawal failed:', error)
    errorMessage.value = error.message || 'Withdrawal failed. Please try again.'
    showErrorModal.value = true
  } finally {
    isProcessing.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

// Handle click outside dropdown
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (authStore.isLoggedIn) {
    authStore.fetchUserBalance()
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #e11d48;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-dropdown {
  animation: dropdownSlide 0.2s ease-out;
}

/* Prevent overflow */
.min-w-0 {
  min-width: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break-all {
  word-break: break-all;
}

/* Dropdown scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 2px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #1a1a1a;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>