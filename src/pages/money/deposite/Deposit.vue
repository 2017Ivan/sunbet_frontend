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
        <h1 class="text-3xl font-bold text-gray-100">Deposit Funds</h1>
        <p class="text-gray-400 text-sm mt-1">Add funds to your account securely</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="text-gray-400 text-sm">Available Balance</p>
            <p class="text-3xl font-bold text-gray-100 mt-1">TSh {{ balance.toLocaleString() }}</p>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="flex-1 sm:flex-none text-right">
              <p class="text-gray-400 text-xs">Total Deposits</p>
              <p class="text-rose-400 font-semibold">TSh {{ totalDeposits.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Deposit Grid -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Deposit Form -->
        <div class="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-gray-100 mb-4">Deposit Amount</h2>
          
          <form @submit.prevent="handleDeposit" class="space-y-4">
            <!-- Amount Input -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Amount (TSh)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">TSh</span>
                <input
                  v-model.number="depositAmount"
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <p class="text-gray-400 text-xs mt-1">Minimum deposit: TSh 1,000</p>
            </div>

            <!-- Quick Amount Buttons -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Quick Amount</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="amount in quickDepositAmounts"
                  :key="amount"
                  type="button"
                  @click="depositAmount = amount"
                  class="py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm hover:border-rose-500 hover:text-rose-400 transition-all"
                  :class="{ 'border-rose-500 text-rose-400 bg-rose-500/10': depositAmount === amount }"
                >
                  TSh {{ amount.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Professional Dropdown for Payment Method -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Payment Method</label>
              <div class="relative">
                <!-- Dropdown Trigger -->
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

                <!-- Dropdown Menu -->
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
              <p class="text-gray-400 text-xs mt-1">Select your mobile network provider</p>
            </div>

            <!-- Deposit Summary -->
            <div class="p-4 bg-gray-900 border border-gray-700 rounded-xl">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-rose-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p class="text-gray-400 text-xs font-medium">Deposit Summary</p>
              </div>
              <div class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-gray-400 text-sm">Payment Method</span>
                  <span class="text-gray-100 text-sm font-medium">{{ selectedMethodName }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-gray-400 text-sm">Amount</span>
                  <span class="text-rose-400 text-sm font-semibold">TSh {{ depositAmount.toLocaleString() }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pt-2 border-t border-gray-700">
                  <span class="text-gray-400 text-sm">Processing Time</span>
                  <span class="text-rose-400 text-sm font-medium">Instant</span>
                </div>
              </div>
            </div>

            <!-- Deposit Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !depositAmount || depositAmount < 1000"
            >
              <template v-if="!isProcessing">
                Deposit TSh {{ depositAmount.toLocaleString() || '0' }}
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

            <div class="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p class="text-rose-400 text-xs">
                  Funds will be added to your account instantly. Minimum deposit: TSh 1,000
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Deposit History -->
        <div class="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-100">Recent Deposits</h2>
            <button class="text-rose-400 text-sm hover:text-rose-300 transition-colors flex-shrink-0">View All</button>
          </div>

          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <div
              v-for="transaction in recentDeposits"
              :key="transaction.id"
              class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg flex-shrink-0" 
                  :class="{
                    'bg-rose-500/10': transaction.status === 'Completed',
                    'bg-rose-400/10': transaction.status === 'Pending',
                    'bg-red-500/10': transaction.status === 'Failed'
                  }"
                >
                  <svg 
                    v-if="transaction.status === 'Completed'" 
                    class="w-5 h-5 m-2.5 text-rose-400" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                  >
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  
                  <svg 
                    v-else-if="transaction.status === 'Pending'" 
                    class="w-5 h-5 m-2.5 text-rose-300" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                  >
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  
                  <svg 
                    v-else 
                    class="w-5 h-5 m-2.5 text-red-400" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-100 text-sm font-medium truncate">{{ transaction.method }}</p>
                  <p class="text-gray-400 text-xs">{{ transaction.date }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <p class="text-rose-400 font-semibold">+TSh {{ transaction.amount.toLocaleString() }}</p>
                <p 
                  class="text-gray-400 text-xs" 
                  :class="{
                    'text-rose-400': transaction.status === 'Completed',
                    'text-rose-300': transaction.status === 'Pending',
                    'text-red-400': transaction.status === 'Failed'
                  }"
                >
                  {{ transaction.status }}
                </p>
              </div>
            </div>

            <div v-if="recentDeposits.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-700 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
              <p class="text-gray-400 text-sm">No recent deposits</p>
              <p class="text-gray-600 text-xs mt-1">Your deposits will appear here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Deposit Stats -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <p class="text-gray-400 text-xs">Total Deposits</p>
          <p class="text-gray-100 font-bold text-lg mt-1">TSh {{ totalDeposits.toLocaleString() }}</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <p class="text-gray-400 text-xs">This Month</p>
          <p class="text-gray-100 font-bold text-lg mt-1">TSh {{ monthlyDeposits.toLocaleString() }}</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <p class="text-gray-400 text-xs">Deposit Count</p>
          <p class="text-gray-100 font-bold text-lg mt-1">{{ depositCount }}</p>
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
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Deposit Successful!</h3>
            <p class="text-gray-400 text-sm mb-4">
              TSh {{ lastDepositAmount.toLocaleString() }} has been added to your account
            </p>
            <div class="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <p class="text-gray-400 text-xs">Transaction ID</p>
              <p class="text-gray-100 font-mono text-sm break-all">{{ transactionId }}</p>
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

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const depositAmount = ref(0)
const selectedMethod = ref('airtel')
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const lastDepositAmount = ref(0)
const transactionId = ref('')
const isDropdownOpen = ref(false)

// Data
const balance = ref(2450000)
const totalDeposits = ref(32500)
const monthlyDeposits = ref(4200)
const depositCount = ref(28)

const quickDepositAmounts = [1000, 5000, 10000, 50000]

// Payment Methods (Tanzanian Mobile Money)
const paymentMethods = [
  {
    id: 'airtel',
    name: 'Airtel Money',
    description: 'Airtel Tanzania',
  },
  {
    id: 'vodacom',
    name: 'M-Pesa',
    description: 'Vodacom Tanzania',
  },
  {
    id: 'mixbyyas',
    name: 'Mix by Yas',
    description: 'Mobile Money',
  },
  {
    id: 'halotel',
    name: 'Halotel',
    description: 'Halotel Mobile Money',
  },
  {
    id: 'ttcl',
    name: 'TTCL',
    description: 'TTCL Mobile Money',
  }
]

const recentDeposits = ref([
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
    status: 'Completed'
  },
  {
    id: 3,
    method: 'Mix by Yas',
    amount: 10000,
    date: '2024-01-12 09:15',
    status: 'Pending'
  }
])

// Computed
const selectedMethodName = computed(() => {
  const method = paymentMethods.find(m => m.id === selectedMethod.value)
  return method ? method.name : 'Unknown'
})

// Methods
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

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}

const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TXN-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value < 1000) return
  
  isProcessing.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    lastDepositAmount.value = depositAmount.value
    transactionId.value = generateTransactionId()
    
    balance.value += depositAmount.value
    
    recentDeposits.value.unshift({
      id: Date.now(),
      method: selectedMethodName.value,
      amount: depositAmount.value,
      date: new Date().toLocaleString(),
      status: 'Pending'
    })
    
    depositAmount.value = 0
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Deposit failed:', error)
  } finally {
    isProcessing.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
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