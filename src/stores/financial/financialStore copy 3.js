// store/financial/financialStore.js
import { defineStore } from 'pinia'
import financialService from '../../services/financial/financialService'
import { useAuthStore } from '../auth/authStore'

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    isLoading: false,
    error: null,
    transaction: null,
    transactionId: null,
    paymentStatus: null,
    pollingInterval: null
  }),

  getters: {
    isProcessing: (state) => state.isLoading,
    lastTransaction: (state) => state.transaction,
    currentTransactionId: (state) => state.transactionId,
    status: (state) => state.paymentStatus
  },

  actions: {
    // ── PALMPESA MOBILE DEPOSIT ─────────────────────────────────────────────
    async depositViaPalmPesa(amount, phone_number) {
      const authStore = useAuthStore()
      
      if (!authStore.isLoggedIn) {
        return { success: false, message: 'Please login first' }
      }

      this.isLoading = true
      this.error = null
      this.transactionId = null
      this.paymentStatus = null

      try {
        const result = await financialService.depositViaPalmPesa(amount, phone_number)
        
        if (result.success) {
          this.transaction = result.data
          this.transactionId = result.data?.transaction_id
          this.paymentStatus = 'pending'
          
          // Anzisha Polling kutoka store
          this.startPolling(this.transactionId)
          
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

    // ── POLL PAYMENT STATUS ─────────────────────────────────────────────────
    startPolling(transactionId) {
      this.stopPolling()

      let attempts = 0
      const maxAttempts = 36 // 36 * 5 seconds = 3 minutes

      this.pollingInterval = setInterval(async () => {
        attempts++
        
        try {
          const result = await financialService.checkPalmPesaStatus(transactionId)
          
          if (result.success) {
            const currentStatus = result.data?.status
            this.paymentStatus = currentStatus
            
            // Unapoona COMPLETED au FAILED, simamisha polling
            if (currentStatus === 'completed' || currentStatus === 'failed') {
              this.stopPolling()
              
              if (currentStatus === 'completed') {
                const authStore = useAuthStore()
                if (result.data?.new_balance) {
                  authStore.updateBalanceLocally?.(result.data.new_balance)
                }
                await authStore.fetchUserBalance()
                
                this.transaction = {
                  ...this.transaction,
                  ...result.data
                }
              }
            }
          }
          
          if (attempts >= maxAttempts) {
            this.stopPolling()
            this.paymentStatus = 'timeout'
          }
        } catch (error) {
          console.error('Polling error:', error)
        }
      }, 5000)
    },

    // ── STOP POLLING ────────────────────────────────────────────────────────
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },

    // ── CHECK STATUS MANUALLY ──────────────────────────────────────────────
    async checkStatus(transactionId) {
      try {
        const result = await financialService.checkPalmPesaStatus(transactionId)
        if (result.success) {
          this.paymentStatus = result.data?.status
          return {
            success: true,
            data: result.data,
            message: result.message
          }
        }
        return { success: false, message: result.message }
      } catch (error) {
        return { success: false, message: error.message }
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
          if (result.data?.new_balance) {
            authStore.updateBalanceLocally?.(result.data.new_balance)
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

    // ── CLEAR ──────────────────────────────────────────────────────────────
    clearTransaction() {
      this.transaction = null
      this.transactionId = null
      this.paymentStatus = null
      this.error = null
      this.stopPolling()
    },

    clearAll() {
      this.transaction = null
      this.transactions = []
      this.transactionId = null
      this.paymentStatus = null
      this.error = null
      this.isLoading = false
      this.stopPolling()
    }
  },

  persist: {
    key: 'financial-store',
    storage: localStorage,
    paths: ['transaction']
  }
})