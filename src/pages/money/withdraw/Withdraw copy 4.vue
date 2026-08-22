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
            <p class="text-2xl font-bold text-gray-100 mt-1">{{ formattedBalance }}</p>
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
                  :min="MINIMUM_WITHDRAW"
                  :max="Math.min(balance, MAXIMUM_WITHDRAW)"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-gray-400 text-xs">Min: TSh {{ MINIMUM_WITHDRAW.toLocaleString() }} | Max: TSh {{ MAXIMUM_WITHDRAW.toLocaleString() }}</p>
                <button 
                  type="button"
                  @click="setMaxAmount"
                  class="text-rose-400 text-xs hover:text-rose-300 transition-colors"
                >
                  Max: {{ formattedBalance }}
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
                  :disabled="amount > balance || amount > MAXIMUM_WITHDRAW"
                  class="py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm hover:border-rose-500 hover:text-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 
                    'border-rose-500 text-rose-400 bg-rose-500/10': withdrawAmount === amount,
                    'opacity-50 cursor-not-allowed': amount > balance || amount > MAXIMUM_WITHDRAW
                  }"
                >
                  TSh {{ amount.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Withdraw Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !withdrawAmount || withdrawAmount < MINIMUM_WITHDRAW || withdrawAmount > balance || withdrawAmount > MAXIMUM_WITHDRAW"
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

            <div v-if="withdrawAmount > 0 && withdrawAmount < MINIMUM_WITHDRAW" class="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-yellow-400 text-xs">
                  Minimum withdrawal is TSh {{ MINIMUM_WITHDRAW.toLocaleString() }}
                </p>
              </div>
            </div>

            <div v-if="withdrawAmount > 0 && withdrawAmount > MAXIMUM_WITHDRAW" class="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-yellow-400 text-xs">
                  Maximum withdrawal is TSh {{ MAXIMUM_WITHDRAW.toLocaleString() }}
                </p>
              </div>
            </div>

            <div class="p-3">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p class="text-gray-400 text-xs">
                  Funds will be sent to your mobile money within 1-24 hours.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeSuccessModal"></div>
        <div class="relative bg-gray-800 border border-green-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-green-500/5 animate-fadeIn">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Withdrawal Successful!</h3>
            <p class="text-gray-400 text-sm mb-4">
              TSh {{ lastWithdrawAmount.toLocaleString() }} has been withdrawn
            </p>
            <div class="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <p class="text-gray-400 text-xs">New Balance</p>
              <p class="text-gray-100 font-bold text-lg">{{ formattedBalance }}</p>
            </div>
            <button
              @click="closeSuccessModal"
              class="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl transition-all duration-200"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/authStore'
import { useFinancialStore } from '../../../stores/financial/financialStore'

const router = useRouter()
const authStore = useAuthStore()
const financialStore = useFinancialStore()

// ============ CONFIGURATION ============
// Change these numbers to update withdrawal limits everywhere
const MINIMUM_WITHDRAW = 500      // Minimum withdrawal amount
const MAXIMUM_WITHDRAW = 5000000   // Maximum withdrawal amount (5,000,000 TZS)

// State
const withdrawAmount = ref(0)
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const lastWithdrawAmount = ref(0)
const errorMessage = ref('')

// Quick amounts based on minimum and maximum withdrawal
const quickWithdrawAmounts = [
  Math.min(MINIMUM_WITHDRAW * 100, MAXIMUM_WITHDRAW),     // 100,000
  Math.min(MINIMUM_WITHDRAW * 500, MAXIMUM_WITHDRAW),     // 500,000
  Math.min(MINIMUM_WITHDRAW * 1000, MAXIMUM_WITHDRAW),    // 1,000,000
  Math.min(MINIMUM_WITHDRAW * 2500, MAXIMUM_WITHDRAW)     // 2,500,000
]

// Computed
const balance = computed(() => authStore.userBalance)
const formattedBalance = computed(() => authStore.formattedBalance)

// Methods
const setMaxAmount = () => {
  withdrawAmount.value = Math.min(balance.value, MAXIMUM_WITHDRAW)
}

const handleWithdraw = async () => {
  // Validation - Minimum
  if (!withdrawAmount.value || withdrawAmount.value < MINIMUM_WITHDRAW) {
    errorMessage.value = `Minimum withdrawal is TSh ${MINIMUM_WITHDRAW.toLocaleString()}`
    showErrorModal.value = true
    return
  }

  // Validation - Maximum
  if (withdrawAmount.value > MAXIMUM_WITHDRAW) {
    errorMessage.value = `Maximum withdrawal is TSh ${MAXIMUM_WITHDRAW.toLocaleString()}`
    showErrorModal.value = true
    return
  }

  // Validation - Balance
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
    // Call financialStore withdraw
    const result = await financialStore.withdraw(withdrawAmount.value)

    if (result.success) {
      lastWithdrawAmount.value = withdrawAmount.value
      showSuccessModal.value = true
      withdrawAmount.value = 0
      
      // Refresh balance
      await authStore.fetchUserBalance()
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
  authStore.fetchUserBalance()
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Lifecycle
onMounted(() => {
  if (authStore.isLoggedIn) {
    authStore.fetchUserBalance()
  }
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

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>