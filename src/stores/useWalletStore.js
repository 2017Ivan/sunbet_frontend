// stores/walletStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import authService from '../services/auth/auth.service'

export const useWalletStore = defineStore('wallet', () => {
  const authStore = useAuthStore()

  // ===== STATE =====
  const transactions = ref([])
  const isLoading = ref(false)
  const isDepositing = ref(false)
  const isWithdrawing = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  const bonusBalance = ref(0)
  const pendingAmount = ref(0)

  // ===== GETTERS =====
  const mainBalance = computed(() => authStore.user?.balance || 0)

  const totalBalance = computed(() => Number(mainBalance.value) + Number(bonusBalance.value))

  const depositHistory = computed(() =>
    transactions.value.filter(t => t.type === 'deposit' || t.type === 'deposit')
  )

  const withdrawHistory = computed(() =>
    transactions.value.filter(t => t.type === 'withdrawal')
  )

  const totalDeposited = computed(() =>
    depositHistory.value
      .filter(t => t.status === 'completed' || t.status === 'success')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const totalWithdrawn = computed(() =>
    withdrawHistory.value
      .filter(t => t.status === 'completed' || t.status === 'success')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const recentTransactions = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
      .slice(0, 20)
  )

  // ===== HELPERS =====
  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  const generateRef = (prefix = 'TXN') =>
    prefix + Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()

  const addTransaction = (tx) => {
    transactions.value.unshift({
      id: generateRef(),
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...tx,
    })
  }

  // ===== ACTIONS =====

  // -- Fetch transactions --
  const fetchTransactions = async ({ page = 1, limit = 20, type = 'all' } = {}) => {
    if (!authStore.isLoggedIn) {
      error.value = 'Please login first'
      return { success: false, message: 'Not authenticated' }
    }

    isLoading.value = true
    error.value = null
    
    try {
      // 🔥 Use authService which already has api instance
      const response = await authService.getTransactions({ page, limit, type })
      
      if (response.success) {
        transactions.value = response.data || response.transactions || []
        return { success: true, transactions: transactions.value }
      }
      
      return { success: false, message: response.message || 'Failed to fetch transactions' }
      
    } catch (err) {
      console.error('Fetch transactions error:', err)
      error.value = err.message || 'Failed to load transactions.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // -- Deposit --
  const deposit = async ({ amount, method, phone, promoCode = '' }) => {
    if (!authStore.isLoggedIn) {
      error.value = 'Please login first'
      return { success: false, error: 'Not authenticated' }
    }

    isDepositing.value = true
    clearMessages()

    try {
      // Validate
      if (!amount || amount < 1000) {
        throw new Error('Minimum deposit is TZS 1,000')
      }
      if (amount > 5000000) {
        throw new Error('Maximum deposit is TZS 5,000,000')
      }

      // 🔥 Use authService
      const response = await authService.deposit({
        amount,
        method,
        phone,
        promoCode
      })

      if (response.success) {
        const data = response.data || {}
        
        // Add transaction
        addTransaction({
          type: 'deposit',
          amount: amount,
          status: data.status || 'completed',
          method: methodLabel(method),
          phone: phone,
          ref: data.reference || generateRef('DEP'),
          description: `Deposit via ${methodLabel(method)}`,
        })

        // Update balance using authStore
        await authStore.fetchUserBalance()

        successMessage.value = {
          title: 'Deposit Successful!',
          subtitle: 'Your account has been credited',
          amount: `TZS ${Number(amount).toLocaleString()}`,
          ref: data.reference || generateRef('DEP'),
          status: 'Completed',
        }

        return { success: true, ref: data.reference, amount }
      }

      return { success: false, error: response.message || 'Failed to process deposit' }

    } catch (err) {
      console.error('Deposit error:', err)
      error.value = err.message || 'Deposit failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isDepositing.value = false
    }
  }

  // -- Withdraw --
  const withdraw = async ({ amount, method, phone, pin }) => {
    if (!authStore.isLoggedIn) {
      error.value = 'Please login first'
      return { success: false, error: 'Not authenticated' }
    }

    isWithdrawing.value = true
    clearMessages()

    try {
      // Validate
      if (!amount || amount < 1000) {
        throw new Error('Minimum withdrawal is TZS 1,000')
      }
      if (amount > mainBalance.value) {
        throw new Error(`Insufficient balance. Your balance is TZS ${mainBalance.value.toLocaleString()}`)
      }
      if (amount > 5000000) {
        throw new Error('Maximum withdrawal per transaction is TZS 5,000,000')
      }
      if (!pin || pin.toString().length < 4) {
        throw new Error('Invalid PIN')
      }

      // 🔥 Use authService
      const response = await authService.withdraw({
        amount,
        method,
        phone,
        pin
      })

      if (response.success) {
        const data = response.data || {}

        addTransaction({
          type: 'withdrawal',
          amount: amount,
          status: data.status || 'processing',
          method: methodLabel(method),
          phone: phone,
          ref: data.reference || generateRef('WTH'),
          description: `Withdrawal to ${methodLabel(method)}`,
        })

        // Update balance using authStore
        await authStore.fetchUserBalance()

        successMessage.value = {
          title: 'Withdrawal Initiated!',
          subtitle: 'Funds sent to your mobile number',
          amount: `TZS ${Number(amount).toLocaleString()}`,
          ref: data.reference || generateRef('WTH'),
          status: data.status || 'Processing',
        }

        return { success: true, ref: data.reference, amount }
      }

      return { success: false, error: response.message || 'Failed to process withdrawal' }

    } catch (err) {
      console.error('Withdrawal error:', err)
      error.value = err.message || 'Withdrawal failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isWithdrawing.value = false
    }
  }

  // -- Check promo code --
  const checkPromoCode = async (code) => {
    try {
      // 🔥 Use authService
      const response = await authService.checkPromo(code)
      
      if (response.success) {
        return {
          valid: true,
          bonus: response.bonus || 0,
          description: response.message || 'Promo code applied!'
        }
      }
      
      return { valid: false, description: response.message || 'Invalid or expired promo code.' }
      
    } catch (err) {
      console.error('Promo check error:', err)
      return { 
        valid: false, 
        description: err.message || 'Could not verify code. Try again.' 
      }
    }
  }

  // -- Set spending limit --
  const setSpendingLimit = async ({ daily, weekly, monthly }) => {
    if (!authStore.isLoggedIn) {
      error.value = 'Please login first'
      return { success: false }
    }

    isLoading.value = true
    try {
      // 🔥 Use authService
      const response = await authService.setLimits({ daily, weekly, monthly })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, message: response.message }
      
    } catch (err) {
      console.error('Set limits error:', err)
      error.value = err.message || 'Failed to set limits.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Refresh balance --
  const refreshBalance = async () => {
    if (!authStore.isLoggedIn) return { success: false }
    return await authStore.fetchUserBalance()
  }

  // -- Format helpers --
  const methodLabel = (method) => {
    const methods = {
      mpesa: 'M-Pesa',
      tigopesa: 'Tigo Pesa',
      airtelmoney: 'Airtel Money',
      halopesa: 'HaloPesa',
      wallet: 'Wallet',
      bank: 'Bank Transfer',
      card: 'Card Payment'
    }
    return methods[method?.toLowerCase()] || method || 'Unknown'
  }

  const formatAmount = (amount) =>
    `TZS ${Number(amount).toLocaleString('en-TZ')}`

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago'
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hrs ago'
    if (diff < 172800000) return 'Yesterday'
    return date.toLocaleDateString('en-TZ', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-400',
      success: 'text-green-400',
      processing: 'text-yellow-400',
      pending: 'text-yellow-400',
      failed: 'text-red-400',
      lost: 'text-red-400',
      active: 'text-blue-400',
      cancelled: 'text-gray-400'
    }
    return colors[status?.toLowerCase()] || 'text-gray-400'
  }

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
      success: 'bg-green-500/10 text-green-400 border-green-500/20',
      processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      lost: 'bg-red-500/10 text-red-400 border-red-500/20',
      active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
    return badges[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }

  return {
    // state
    transactions,
    isLoading,
    isDepositing,
    isWithdrawing,
    error,
    successMessage,
    bonusBalance,
    pendingAmount,
    
    // getters
    mainBalance,
    totalBalance,
    depositHistory,
    withdrawHistory,
    totalDeposited,
    totalWithdrawn,
    recentTransactions,
    
    // actions
    fetchTransactions,
    deposit,
    withdraw,
    checkPromoCode,
    setSpendingLimit,
    clearMessages,
    refreshBalance,
    
    // helpers
    formatAmount,
    formatDate,
    methodLabel,
    getStatusColor,
    getStatusBadge,
  }
})