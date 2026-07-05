<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- Page Header -->
      <div class="mb-8">
        <RouterLink to="/profile" class="inline-flex items-center gap-2 text-[#8A8A8A] hover:text-rose-400 transition-colors text-sm mb-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Profile
        </RouterLink>
        <h1 class="text-3xl font-bold text-[#F0E8E8]">Withdraw Funds</h1>
        <p class="text-[#8A8A8A] text-sm mt-1">Withdraw your winnings securely to your mobile money</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-[#2A1010] to-[#1A0A0A] border border-[#3A1A1A] rounded-2xl p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="text-[#8A8A8A] text-sm">Available Balance</p>
            <p class="text-3xl font-bold text-[#F0E8E8] mt-1">TSh {{ balance.toLocaleString() }}</p>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="flex-1 sm:flex-none text-right">
              <p class="text-[#8A8A8A] text-xs">Pending Withdrawal</p>
              <p class="text-rose-400 font-semibold">TSh {{ pendingWithdrawal.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Withdrawal Grid -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Withdrawal Form -->
        <div class="flex-1 bg-[#1A0A0A] border border-[#2A1414] rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-[#F0E8E8] mb-4">Withdrawal Details</h2>
          
          <form @submit.prevent="handleWithdraw" class="space-y-4">
            <!-- Amount Input -->
            <div>
              <label class="block text-sm text-[#8A8A8A] mb-2">Amount (TSh)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] font-semibold">TSh</span>
                <input
                  v-model.number="withdrawAmount"
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 bg-[#120808] border border-[#2A1414] rounded-xl text-[#F0E8E8] text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500': withdrawAmount > balance }"
                  required
                />
              </div>
              <div class="flex justify-between mt-1">
                <p v-if="withdrawAmount > balance" class="text-red-400 text-xs">
                  Insufficient balance
                </p>
                <p v-else-if="withdrawAmount > 0 && withdrawAmount < 1000" class="text-rose-400 text-xs">
                  Minimum withdrawal is TSh 1,000
                </p>
                <p class="text-[#8A8A8A] text-xs ml-auto">
                  Max: TSh {{ balance.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Quick Amount Buttons -->
            <div>
              <label class="block text-sm text-[#8A8A8A] mb-2">Quick Amount</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="amount in quickWithdrawAmounts"
                  :key="amount"
                  type="button"
                  @click="setQuickAmount(amount)"
                  class="py-2 bg-[#120808] border border-[#2A1414] rounded-lg text-[#8A8A8A] text-sm hover:border-rose-500 hover:text-rose-400 transition-all"
                  :class="{ 'border-rose-500 text-rose-400 bg-rose-500/10': withdrawAmount === amount }"
                >
                  TSh {{ amount.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Phone Number Input -->
            <div>
              <label class="block text-sm text-[#8A8A8A] mb-2">Mobile Money Number</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] font-semibold text-sm">+255</span>
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="712345678"
                  maxlength="9"
                  class="w-full pl-16 pr-4 py-3 bg-[#120808] border border-[#2A1414] rounded-xl text-[#F0E8E8] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <p class="text-[#8A8A8A] text-xs mt-1">Enter your mobile money registered number</p>
            </div>

            <!-- Professional Dropdown for Mobile Network -->
            <div>
              <label class="block text-sm text-[#8A8A8A] mb-2">Select Mobile Network</label>
              <div class="relative">
                <!-- Dropdown Trigger -->
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full flex items-center justify-between p-3 bg-[#120808] border border-[#2A1414] rounded-xl text-[#F0E8E8] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  :class="{ 'border-rose-500': isDropdownOpen }"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-[#1A0A0A] flex items-center justify-center flex-shrink-0">
                      <span class="text-rose-400 font-bold text-xs">{{ getMethodInitial(selectedMethodName) }}</span>
                    </div>
                    <div class="text-left">
                      <p class="text-[#F0E8E8] text-sm font-medium">{{ selectedMethodName }}</p>
                      <p class="text-[#8A8A8A] text-xs">{{ getMethodDescription(selectedMethodName) }}</p>
                    </div>
                  </div>
                  <svg 
                    class="w-5 h-5 text-[#8A8A8A] transition-transform duration-200"
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
                  class="absolute z-50 w-full mt-2 bg-[#1A0A0A] border border-[#2A1414] rounded-xl shadow-2xl shadow-rose-500/10 overflow-hidden animate-dropdown"
                >
                  <div class="max-h-60 overflow-y-auto">
                    <button
                      v-for="method in withdrawalMethods"
                      :key="method.id"
                      type="button"
                      @click="selectMethod(method.id)"
                      class="w-full flex items-center gap-3 p-3 hover:bg-[#2A1010] transition-colors border-b border-[#2A1414] last:border-b-0"
                      :class="{ 'bg-rose-500/5 border-rose-500/30': selectedWithdrawMethod === method.id }"
                    >
                      <div class="w-8 h-8 rounded-lg bg-[#120808] flex items-center justify-center flex-shrink-0">
                        <span class="text-rose-400 font-bold text-xs">{{ getMethodInitial(method.name) }}</span>
                      </div>
                      <div class="text-left flex-1">
                        <p class="text-[#F0E8E8] text-sm font-medium">{{ method.name }}</p>
                        <p class="text-[#8A8A8A] text-xs">{{ method.description }}</p>
                      </div>
                      <svg 
                        v-if="selectedWithdrawMethod === method.id"
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
              <p class="text-[#8A8A8A] text-xs mt-1">Select your mobile network provider</p>
            </div>

            <!-- Account Details -->
            <div class="p-4 bg-[#120808] border border-[#2A1414] rounded-xl">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-rose-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p class="text-[#8A8A8A] text-xs font-medium">Withdrawal Summary</p>
              </div>
              <div class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-[#8A8A8A] text-sm">Network</span>
                  <span class="text-[#F0E8E8] text-sm font-medium">{{ selectedMethodName }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-[#8A8A8A] text-sm">Phone Number</span>
                  <span class="text-[#F0E8E8] text-sm font-medium">{{ formattedPhoneNumber }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-[#8A8A8A] text-sm">Amount</span>
                  <span class="text-rose-400 text-sm font-semibold">TSh {{ withdrawAmount.toLocaleString() }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pt-2 border-t border-[#2A1414]">
                  <span class="text-[#8A8A8A] text-sm">Processing Time</span>
                  <span class="text-rose-400 text-sm font-medium">Instant</span>
                </div>
              </div>
            </div>

            <!-- Withdrawal Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !withdrawAmount || withdrawAmount < 1000 || withdrawAmount > balance || !phoneNumber || phoneNumber.length < 9"
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

            <div class="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p class="text-rose-400 text-xs">
                  Funds will be sent to your mobile money instantly. Minimum withdrawal: TSh 1,000
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Withdrawal History -->
        <div class="flex-1 bg-[#1A0A0A] border border-[#2A1414] rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-[#F0E8E8]">Recent Withdrawals</h2>
            <button class="text-rose-400 text-sm hover:text-rose-300 transition-colors flex-shrink-0">View All</button>
          </div>

          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <div
              v-for="transaction in recentWithdrawals"
              :key="transaction.id"
              class="flex items-center justify-between p-3 bg-[#120808] border border-[#2A1414] rounded-xl hover:border-[#3A1A1A] transition-all"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg flex-shrink-0" 
                  :class="{
                    'bg-rose-500/10': transaction.status === 'Completed',
                    'bg-rose-400/10': transaction.status === 'Pending',
                    'bg-red-500/10': transaction.status === 'Failed'
                  }"
                >
                  <!-- Status Icon based on transaction status -->
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
                  <p class="text-[#F0E8E8] text-sm font-medium truncate">{{ transaction.method }}</p>
                  <p class="text-[#8A8A8A] text-xs truncate">{{ transaction.phone }}</p>
                  <p class="text-[#8A8A8A] text-xs">{{ transaction.date }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <p class="text-rose-400 font-semibold">-TSh {{ transaction.amount.toLocaleString() }}</p>
                <p 
                  class="text-[#8A8A8A] text-xs" 
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

            <div v-if="recentWithdrawals.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-[#2A1414] mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <p class="text-[#8A8A8A] text-sm">No recent withdrawals</p>
              <p class="text-[#6A6A6A] text-xs mt-1">Your withdrawals will appear here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Withdrawal Limits Card -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-[#1A0A0A] border border-[#2A1414] rounded-xl p-4 text-center">
          <p class="text-[#8A8A8A] text-xs">Minimum Withdrawal</p>
          <p class="text-[#F0E8E8] font-bold text-lg mt-1">TSh 1,000</p>
        </div>
        <div class="bg-[#1A0A0A] border border-[#2A1414] rounded-xl p-4 text-center">
          <p class="text-[#8A8A8A] text-xs">Maximum Withdrawal</p>
          <p class="text-[#F0E8E8] font-bold text-lg mt-1">TSh 10,000,000</p>
        </div>
        <div class="bg-[#1A0A0A] border border-[#2A1414] rounded-xl p-4 text-center">
          <p class="text-[#8A8A8A] text-xs">Daily Limit</p>
          <p class="text-[#F0E8E8] font-bold text-lg mt-1">TSh 25,000,000</p>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-[#0A0505]/80 backdrop-blur-sm" @click="closeSuccessModal"></div>
        <div class="relative bg-gradient-to-br from-[#1A0A0A] to-[#120808] border border-rose-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-rose-500/5 animate-fadeIn">
          <div class="text-center">
            <div class="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#F0E8E8] mb-2">Withdrawal Successful!</h3>
            <p class="text-[#8A8A8A] text-sm mb-4">
              TSh {{ lastWithdrawAmount.toLocaleString() }} has been sent to your {{ lastWithdrawMethod }} number
            </p>
            <div class="bg-[#120808] border border-[#2A1414] rounded-xl p-4 mb-6">
              <p class="text-[#8A8A8A] text-xs">Transaction ID</p>
              <p class="text-[#F0E8E8] font-mono text-sm break-all">{{ transactionId }}</p>
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
const withdrawAmount = ref(0)
const selectedWithdrawMethod = ref('airtel')
const phoneNumber = ref('')
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const lastWithdrawAmount = ref(0)
const lastWithdrawMethod = ref('')
const transactionId = ref('')
const isDropdownOpen = ref(false)

// Data
const balance = ref(2450000)
const pendingWithdrawal = ref(1500)

const quickWithdrawAmounts = [1000, 5000, 10000, 50000]

// Tanzanian Mobile Money Methods
const withdrawalMethods = [
  {
    id: 'airtel',
    name: 'Airtel Money',
    description: 'Airtel Tanzania',
    icon: '/icons/airtel.svg'
  },
  {
    id: 'vodacom',
    name: 'M-Pesa',
    description: 'Vodacom Tanzania',
    icon: '/icons/vodacom.svg'
  },
  {
    id: 'mixbyyas',
    name: 'Mix by Yas',
    description: 'Mobile Money',
    icon: '/icons/mixbyyas.svg'
  },
  {
    id: 'halotel',
    name: 'Halotel',
    description: 'Halotel Mobile Money',
    icon: '/icons/halotel.svg'
  },
  {
    id: 'ttcl',
    name: 'TTCL',
    description: 'TTCL Mobile Money',
    icon: '/icons/ttcl.svg'
  }
]

const recentWithdrawals = ref([
  {
    id: 1,
    method: 'M-Pesa',
    phone: '+255 712 345 678',
    amount: 50000,
    date: '2024-01-15 14:30',
    status: 'Completed'
  },
  {
    id: 2,
    method: 'Airtel Money',
    phone: '+255 765 432 100',
    amount: 25000,
    date: '2024-01-14 10:20',
    status: 'Pending'
  },
  {
    id: 3,
    method: 'Mix by Yas',
    phone: '+255 688 901 234',
    amount: 10000,
    date: '2024-01-12 09:15',
    status: 'Completed'
  }
])

// Computed
const selectedMethodName = computed(() => {
  const method = withdrawalMethods.find(m => m.id === selectedWithdrawMethod.value)
  return method ? method.name : 'Unknown'
})

const formattedPhoneNumber = computed(() => {
  if (!phoneNumber.value) return 'Not set'
  const num = phoneNumber.value.replace(/\D/g, '')
  if (num.length === 9) {
    return `+255 ${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 9)}`
  }
  return `+255 ${num}`
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
  const method = withdrawalMethods.find(m => m.name === name)
  return method ? method.description : ''
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectMethod = (methodId) => {
  selectedWithdrawMethod.value = methodId
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

const setQuickAmount = (amount) => {
  withdrawAmount.value = Math.min(amount, balance.value)
}

const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TXN-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const handleWithdraw = async () => {
  if (!withdrawAmount.value || withdrawAmount.value < 1000 || withdrawAmount.value > balance.value) return
  if (!phoneNumber.value || phoneNumber.value.length < 9) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Success
    const method = withdrawalMethods.find(m => m.id === selectedWithdrawMethod.value)
    lastWithdrawMethod.value = method ? method.name : 'Unknown'
    lastWithdrawAmount.value = withdrawAmount.value
    transactionId.value = generateTransactionId()
    
    // Update balance
    balance.value -= withdrawAmount.value
    
    // Add to recent withdrawals
    recentWithdrawals.value.unshift({
      id: Date.now(),
      method: lastWithdrawMethod.value,
      phone: formattedPhoneNumber.value,
      amount: withdrawAmount.value,
      date: new Date().toLocaleString(),
      status: 'Pending'
    })
    
    // Reset form
    withdrawAmount.value = 0
    phoneNumber.value = ''
    
    // Show success modal
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Withdrawal failed:', error)
  } finally {
    isProcessing.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
/* Custom scrollbar - Rose theme */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #1A0A0A;
}
::-webkit-scrollbar-thumb {
  background: #3A1A1A;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
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

/* Input focus styles */
input:focus {
  border-color: #e11d48;
  box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
}

/* Smooth text colors */
.text-\[F0E8E8\] {
  color: #F0E8E8;
}

.text-\[8A8A8A\] {
  color: #8A8A8A;
}

.text-\[6A6A6A\] {
  color: #6A6A6A;
}

/* Dropdown scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 2px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #120808;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #3A1A1A;
  border-radius: 10px;
}
</style>