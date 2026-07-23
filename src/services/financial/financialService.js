// services/financial/financialService.js
import api from '../api'

const financialService = {
  // DEPOSIT
  async deposit(amount) {
    try {
      const response = await api.post('/financial/deposit', { amount })
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Deposit failed'
      }
    } catch (error) {
      console.error('Deposit error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Deposit failed'
      }
    }
  },

  // WITHDRAW
  async withdraw(amount) {
    try {
      const response = await api.post('/financial/withdraw', { amount })
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Withdrawal failed'
      }
    } catch (error) {
      console.error('Withdraw error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Withdrawal failed'
      }
    }
  },

  // GET BALANCE
  async getBalance() {
    try {
      const response = await api.get('/financial/balance')
      
      if (response.data && response.data.success) {
        return {
          success: true,
          balance: response.data.data?.balance || 0,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to get balance'
      }
    } catch (error) {
      console.error('Get balance error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get balance'
      }
    }
  }
}

export default financialService