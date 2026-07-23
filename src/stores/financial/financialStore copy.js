// store/financial/financialStore.js
import { defineStore } from 'pinia'
import financialService from '../../services/financial/financialService'
import { useAuthStore } from '../auth/authStore'

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    isLoading: false,
    error: null,
    transaction: null,
    transactions: []
  }),

  getters: {
    isProcessing: (state) => state.isLoading,
    lastTransaction: (state) => state.transaction,
    allTransactions: (state) => state.transactions
  },

  actions: {
    // ── DEPOSIT ─────────────────────────────────────────────────────────────
    async deposit(amount) {
      const authStore = useAuthStore()
      
      if (!authStore.isLoggedIn) {
        return { success: false, message: 'Please login first' }
      }

      this.isLoading = true
      this.error = null

      try {
        const result = await financialService.deposit(amount)
        
        if (result.success) {
          this.transaction = result.data
          // Update balance in auth store
          if (result.data?.new_balance) {
            authStore.updateBalanceLocally(result.data.new_balance)
          }
          return result
        } else {
          this.error = result.message
          return result
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // ── WITHDRAW ────────────────────────────────────────────────────────────
    async withdraw(amount) {
      const authStore = useAuthStore()
      
      if (!authStore.isLoggedIn) {
        return { success: false, message: 'Please login first' }
      }

      this.isLoading = true
      this.error = null

      try {
        const result = await financialService.withdraw(amount)
        
        if (result.success) {
          this.transaction = result.data
          // Update balance in auth store
          if (result.data?.new_balance) {
            authStore.updateBalanceLocally(result.data.new_balance)
          }
          return result
        } else {
          this.error = result.message
          return result
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // ── GET BALANCE ─────────────────────────────────────────────────────────
    async getBalance() {
      const authStore = useAuthStore()
      
      if (!authStore.isLoggedIn) {
        return { success: false, message: 'Please login first' }
      }

      try {
        const result = await financialService.getBalance()
        return result
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // ── CLEAR TRANSACTION ──────────────────────────────────────────────────
    clearTransaction() {
      this.transaction = null
      this.error = null
    },

    // ── CLEAR ALL ──────────────────────────────────────────────────────────
    clearAll() {
      this.transaction = null
      this.transactions = []
      this.error = null
      this.isLoading = false
    }
  },

  persist: {
    key: 'financial-store',
    storage: localStorage,
    paths: ['transactions']
  }
})