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
        <div class="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-4">
          <div>
            <p class="text-gray-400 text-sm">Available Balance</p>
            <p class="text-sm font-bold text-gray-100 mt-1">{{ formattedBalance }}</p>
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
                  max="5000000"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-gray-400 text-xs">Maximum withdrawal: TSh 5,000,000</p>
             
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

    


            <!-- Withdraw Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !withdrawAmount || withdrawAmount < 1000 || withdrawAmount > balance"
            >
              <template v-if="!isProcessing">
                Withdraw 
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
                  Funds will be sent to your mobile money within 1-24 hours. Fee: 0% of withdrawal amount.
                </p>
              </div>
            </div>
          </form>
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

const quickWithdrawAmounts = [100000, 500000, 1000000, 2500000]
const withdrawalFeePercent = 0.005 // 0.5%



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