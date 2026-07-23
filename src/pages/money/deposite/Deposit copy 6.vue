<!-- pages/money/deposite/Deposit.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- Page Header -->
      <div class="mb-8">
        <RouterLink to="/profile" class="inline-flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors text-sm mb-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Profile
        </RouterLink>
        <h1 class="text-lg font-bold text-gray-300">Deposit Funds</h1>
        <p class="text-gray-400 text-sm mt-1">Add funds to your account securely</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-4">
          <div class="text-center">
            <p class="text-gray-400 text-sm">Available Balance</p>
            <p class="text-2xl font-bold text-white mt-1">{{ formattedBalance }}</p>
          </div>
        </div>
      </div>

      <!-- Deposit Form -->
      <div class="flex flex-col lg:flex-row gap-6">
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
                  :min="MINIMUM_DEPOSIT"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <p class="text-gray-400 text-xs mt-1">Minimum deposit: TSh {{ MINIMUM_DEPOSIT.toLocaleString() }}.00</p>
            </div>

            <!-- Deposit Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || !depositAmount || depositAmount < MINIMUM_DEPOSIT"
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

            <!-- Info Message -->
            <div class="p-3 bg-gray-900/50 rounded-xl">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p class="text-gray-400 text-xs">
                  Funds will be added to your account instantly. Minimum deposit: TSh {{ MINIMUM_DEPOSIT.toLocaleString() }}.00
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
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Deposit Initiated!</h3>
            <p class="text-gray-400 text-sm mb-4">
              Please check your phone for M-Pesa prompt
            </p>
            <p class="text-gray-500 text-xs mb-4">
              Amount: TSh {{ lastDepositAmount.toLocaleString() }}
            </p>
            <div class="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <p class="text-gray-400 text-xs">Transaction Reference</p>
              <p class="text-gray-100 font-mono text-sm break-all">{{ transactionId }}</p>
              <p class="text-rose-400 text-xs mt-2">⏳ Awaiting payment confirmation...</p>
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
        <div class="relative bg-gray-800 border border-red-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div class="text-center">
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-100 mb-2">Deposit Failed</h3>
            <p class="text-gray-400 text-sm mb-4">{{ errorMessage }}</p>
            <button
              @click="closeErrorModal"
              class="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200"
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
import { useFinancialStore } from '../../../stores/money/financial.store'

const router = useRouter()
const authStore = useAuthStore()
const financialStore = useFinancialStore()

// ============ CONFIGURATION ============
// Change this number to update minimum deposit everywhere
const MINIMUM_DEPOSIT = 500

// State
const depositAmount = ref(0)
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const lastDepositAmount = ref(0)
const transactionId = ref('')
const errorMessage = ref('')

// Computed
const balance = computed(() => authStore.userBalance)
const formattedBalance = computed(() => {
  return new Intl.NumberFormat('en-TZ', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(balance.value || 0)
})

// Methods
const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TXN-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value < MINIMUM_DEPOSIT) {
    alert(`Minimum deposit is TSh ${MINIMUM_DEPOSIT.toLocaleString()}.00`)
    return
  }
  
  // Check if user is authenticated
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  isProcessing.value = true
  
  try {
    // Generate transaction ID
    transactionId.value = generateTransactionId()
    lastDepositAmount.value = depositAmount.value
    
    // Call the deposit action from financialStore
    const result = await financialStore.initiateDeposit({
      amount: depositAmount.value,
      phoneNumber: authStore.user?.phone_number || ''
    })
    
    if (result) {
      // Deposit initiated successfully
      // The user will receive an M-Pesa prompt on their phone
      showSuccessModal.value = true
      depositAmount.value = 0
      
      // Start polling for payment status
      await pollPaymentStatus(result.order_id)
    }
    
  } catch (error) {
    console.error('Deposit failed:', error)
    errorMessage.value = error.message || 'Deposit failed. Please try again.'
    showErrorModal.value = true
  } finally {
    isProcessing.value = false
  }
}

const pollPaymentStatus = async (orderId) => {
  let attempts = 0
  const maxAttempts = 30 // 30 * 5 seconds = 2.5 minutes
  
  const pollInterval = setInterval(async () => {
    attempts++
    
    try {
      const status = await financialStore.checkPaymentStatus(orderId)
      
      if (status.success && status.status === 'completed') {
        clearInterval(pollInterval)
        // Balance has been updated in the store
        await authStore.fetchUserBalance() // Refresh balance
        // Update success message
        return
      }
      
      if (status.status === 'failed' || status.status === 'expired') {
        clearInterval(pollInterval)
        errorMessage.value = 'Payment was not completed. Please try again.'
        showErrorModal.value = true
        showSuccessModal.value = false
        return
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval)
        // Still pending, but we stop polling
        console.log('Polling timeout - payment still pending')
      }
    } catch (error) {
      console.error('Error polling status:', error)
    }
  }, 5000) // Poll every 5 seconds
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Refresh balance when closing
  authStore.fetchUserBalance()
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Lifecycle
onMounted(() => {
  // Refresh balance when component mounts
  if (authStore.isLoggedIn) {
    authStore.fetchUserBalance()
  }
})

onBeforeUnmount(() => {
  // Cleanup any intervals if needed
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>