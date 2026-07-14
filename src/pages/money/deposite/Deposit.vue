<!-- deposit.vue -->
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

      <!-- Balance Card - Now using authStore -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-4">
          <div>
            <p class="text-gray-400 text-sm">Available Balance</p>
            <p class="text-sm font-bold text-gray-100 mt-1">{{ formattedBalance }}</p>
          </div>
       
        </div>
      </div>

      <!-- Rest of your template remains the same -->
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
                  min="168000"
                  step="100"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>
              <p class="text-gray-400 text-xs mt-1">Minimum deposit: TSh 1,000</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth/authStore' // Adjust path as needed

const router = useRouter()
const authStore = useAuthStore()

// State
const depositAmount = ref(0)
const selectedMethod = ref('airtel')
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const lastDepositAmount = ref(0)
const transactionId = ref('')
const isDropdownOpen = ref(false)
const totalDeposits = ref(32500) // This could also come from API

const quickDepositAmounts = [1000, 5000, 10000, 50000]


// Computed - Using authStore
const balance = computed(() => authStore.userBalance)
const formattedBalance = computed(() => authStore.formattedBalance)

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

const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TXN-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value < 1000) {
    return
  }
  
  // Check if user is authenticated
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  isProcessing.value = true
  
  try {
    // Call the deposit action from authStore
    const result = await authStore.initiateDeposit(depositAmount.value)
    
    if (result.success && result.paymentUrl) {
      // If payment URL is returned, redirect
      window.location.href = result.paymentUrl
      return
    }
    
    // If deposit is handled directly (not redirect)
    // Update balance locally
    lastDepositAmount.value = depositAmount.value
    transactionId.value = generateTransactionId()
    
    // Refresh balance from server
    await authStore.fetchUserBalance()
    
    showSuccessModal.value = true
    depositAmount.value = 0
    
  } catch (error) {
    console.error('Deposit failed:', error)
    // Show error message
    alert(error.message || 'Deposit failed. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

// Handle click outside dropdown
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Refresh balance when component mounts
  if (authStore.isLoggedIn) {
    authStore.fetchUserBalance()
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Your existing styles remain the same */
</style>