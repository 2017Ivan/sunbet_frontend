import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './useAuthStore'

export const useWalletStore = defineStore('wallet', () => {
  const authStore = useAuthStore()

  // ===== STATE =====
  const transactions   = ref([])
  const isLoading      = ref(false)
  const isDepositing   = ref(false)
  const isWithdrawing  = ref(false)
  const error          = ref(null)
  const successMessage = ref(null)
  const bonusBalance   = ref(10000)
  const pendingAmount  = ref(0)

  // ===== GETTERS =====
  const mainBalance = computed(() => authStore.balance)

  const totalBalance = computed(() => mainBalance.value + bonusBalance.value)

  const depositHistory = computed(() =>
    transactions.value.filter(t => t.type === 'deposit')
  )

  const withdrawHistory = computed(() =>
    transactions.value.filter(t => t.type === 'withdrawal')
  )

  const totalDeposited = computed(() =>
    depositHistory.value
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalWithdrawn = computed(() =>
    withdrawHistory.value
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const recentTransactions = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
  )

  // ===== HELPERS =====
  const clearMessages = () => {
    error.value          = null
    successMessage.value = null
  }

  const generateRef = (prefix = 'TXN') =>
    prefix + Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()

  const addTransaction = (tx) => {
    transactions.value.unshift({
      id:        generateRef(),
      createdAt: new Date().toISOString(),
      ...tx,
    })
  }

  // ===== ACTIONS =====

  // -- Fetch transactions --
  const fetchTransactions = async ({ page = 1, limit = 20, type = 'all' } = {}) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: replace with real API
      // const res = await api.get('/wallet/transactions', { params: { page, limit, type } })
      // transactions.value = res.data.transactions

      await new Promise(r => setTimeout(r, 800))

      // Seed fake transactions if empty
      if (!transactions.value.length) {
        transactions.value = [
          { id: 'TXN001', type: 'deposit',    amount: 50000,  status: 'completed', method: 'M-Pesa',    phone: '+255 712 345 678', ref: 'DEP001XYZ', createdAt: new Date(Date.now() - 3600000).toISOString(),   description: 'Deposit via M-Pesa'          },
          { id: 'TXN002', type: 'bet',        amount: 10000,  status: 'active',    method: 'Wallet',    phone: null,               ref: 'BET002ABC', createdAt: new Date(Date.now() - 7200000).toISOString(),   description: 'Bet placed — Accumulator x5' },
          { id: 'TXN003', type: 'win',        amount: 306000, status: 'completed', method: 'Wallet',    phone: null,               ref: 'WIN003DEF', createdAt: new Date(Date.now() - 86400000).toISOString(),  description: 'Bet won — Accumulator x4'    },
          { id: 'TXN004', type: 'withdrawal', amount: 80000,  status: 'completed', method: 'M-Pesa',    phone: '+255 712 345 678', ref: 'WTH004GHI', createdAt: new Date(Date.now() - 172800000).toISOString(), description: 'Withdrawal to M-Pesa'        },
          { id: 'TXN005', type: 'bonus',      amount: 10000,  status: 'completed', method: 'Bonus',     phone: null,               ref: 'BON005JKL', createdAt: new Date(Date.now() - 259200000).toISOString(), description: 'Welcome bonus credited'       },
          { id: 'TXN006', type: 'deposit',    amount: 30000,  status: 'completed', method: 'Tigo Pesa', phone: '+255 713 456 789', ref: 'DEP006MNO', createdAt: new Date(Date.now() - 345600000).toISOString(), description: 'Deposit via Tigo Pesa'        },
          { id: 'TXN007', type: 'bet',        amount: 25000,  status: 'lost',      method: 'Wallet',    phone: null,               ref: 'BET007PQR', createdAt: new Date(Date.now() - 432000000).toISOString(), description: 'Bet placed — Single'         },
          { id: 'TXN008', type: 'deposit',    amount: 100000, status: 'completed', method: 'Airtel',    phone: '+255 714 567 890', ref: 'DEP008STU', createdAt: new Date(Date.now() - 518400000).toISOString(), description: 'Deposit via Airtel Money'     },
        ]
      }

      return { success: true, transactions: transactions.value }
    } catch (err) {
      error.value = 'Failed to load transactions.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Deposit --
  const deposit = async ({ amount, method, phone, promoCode = '' }) => {
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

      // TODO: replace with real API
      // const res = await api.post('/wallet/deposit', { amount, method, phone, promoCode })

      await new Promise(r => setTimeout(r, 2000))

      const ref     = generateRef('DEP')
      const bonus   = promoCode?.toUpperCase() === 'SUNBET100' ? 10000 : 0
      const total   = amount + bonus

      // Add transaction
      addTransaction({
        type:        'deposit',
        amount,
        status:      'completed',
        method:      methodLabel(method),
        phone,
        ref,
        description: `Deposit via ${methodLabel(method)}`,
      })

      if (bonus > 0) {
        bonusBalance.value += bonus
        addTransaction({
          type:        'bonus',
          amount:      bonus,
          status:      'completed',
          method:      'Bonus',
          phone:       null,
          ref:         generateRef('BON'),
          description: 'Promo bonus — ' + promoCode,
        })
      }

      // Update balance
      authStore.addToBalance(amount)

      successMessage.value = {
        title:    'Deposit Successful!',
        subtitle: 'Your account has been credited',
        amount:   `TZS ${total.toLocaleString()}`,
        ref,
        status:   'Completed',
      }

      return { success: true, ref, amount: total }

    } catch (err) {
      error.value = err.message || 'Deposit failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isDepositing.value = false
    }
  }

  // -- Withdraw --
  const withdraw = async ({ amount, method, phone, pin }) => {
    isWithdrawing.value = true
    clearMessages()

    try {
      // Validate
      if (!amount || amount < 1000) {
        throw new Error('Minimum withdrawal is TZS 1,000')
      }
      if (amount > mainBalance.value) {
        throw new Error('Insufficient balance')
      }
      if (amount > 5000000) {
        throw new Error('Maximum withdrawal per transaction is TZS 5,000,000')
      }
      if (!pin || pin.toString().length < 4) {
        throw new Error('Invalid PIN')
      }

      // TODO: replace with real API
      // const res = await api.post('/wallet/withdraw', { amount, method, phone, pin })

      await new Promise(r => setTimeout(r, 2500))

      // Fake PIN validation
      if (pin.toString() !== '1234') {
        throw new Error('Incorrect PIN. Please try again.')
      }

      const ref = generateRef('WTH')

      addTransaction({
        type:        'withdrawal',
        amount,
        status:      'processing',
        method:      methodLabel(method),
        phone,
        ref,
        description: `Withdrawal to ${methodLabel(method)}`,
      })

      // Deduct balance
      authStore.deductFromBalance(amount)
      pendingAmount.value += amount

      // Simulate processing complete after 3 min (fake)
      setTimeout(() => {
        const tx = transactions.value.find(t => t.ref === ref)
        if (tx) {
          tx.status = 'completed'
          pendingAmount.value = Math.max(0, pendingAmount.value - amount)
        }
      }, 10000) // 10s for demo (real: ~3 min)

      successMessage.value = {
        title:    'Withdrawal Initiated!',
        subtitle: 'Funds sent to your mobile number',
        amount:   `TZS ${amount.toLocaleString()}`,
        ref,
        status:   'Processing (~3 min)',
      }

      return { success: true, ref, amount }

    } catch (err) {
      error.value = err.message || 'Withdrawal failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isWithdrawing.value = false
    }
  }

  // -- Check promo code --
  const checkPromoCode = async (code) => {
    try {
      // TODO: await api.post('/wallet/promo/check', { code })
      await new Promise(r => setTimeout(r, 800))

      const validCodes = {
        'SUNBET100': { bonus: 10000, description: '+TZS 10,000 bonus on deposit!' },
        'WELCOME50': { bonus: 5000,  description: '+TZS 5,000 bonus on deposit!'  },
        'VIP2024':   { bonus: 20000, description: '+TZS 20,000 VIP bonus!'        },
      }

      const found = validCodes[code.toUpperCase()]
      if (found) {
        return { valid: true, ...found }
      } else {
        return { valid: false, description: 'Invalid or expired promo code.' }
      }
    } catch {
      return { valid: false, description: 'Could not verify code. Try again.' }
    }
  }

  // -- Set spending limit --
  const setSpendingLimit = async ({ daily, weekly, monthly }) => {
    isLoading.value = true
    try {
      // TODO: await api.post('/wallet/limits', { daily, weekly, monthly })
      await new Promise(r => setTimeout(r, 800))
      return { success: true }
    } catch {
      error.value = 'Failed to set limits.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Format helpers --
  const methodLabel = (method) => ({
    mpesa:       'M-Pesa',
    tigopesa:    'Tigo Pesa',
    airtelmoney: 'Airtel Money',
    halopesa:    'HaloPesa',
  }[method] || method)

  const formatAmount = (amount) =>
    `TZS ${Number(amount).toLocaleString('en-TZ')}`

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now  = new Date()
    const diff = now - date

    if (diff < 60000)      return 'Just now'
    if (diff < 3600000)    return Math.floor(diff / 60000) + ' min ago'
    if (diff < 86400000)   return Math.floor(diff / 3600000) + ' hrs ago'
    if (diff < 172800000)  return 'Yesterday'
    return date.toLocaleDateString('en-TZ', { day: 'numeric', month: 'short' })
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
    // helpers
    formatAmount,
    formatDate,
    methodLabel,
  }
})