// services/financial/financialService.js
import api from '../api'

const financialService = {
  // ── SNIPPE MOBILE DEPOSIT ──────────────────────────────────────────────
  async deposit(amount, phone_number) {
    try {
      const response = await api.post('/financial/deposit/snipe', {
        amount,
        phone_number
      })
      
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
      console.error('Snippe deposit error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Status:', error.response?.status)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initiate payment'
      }
    }
  },

  // ── CHECK PAYMENT STATUS ────────────────────────────────────────────────
  async checkPaymentStatus(transactionId) {
    try {
      const response = await api.get(`/financial/payment/status/${transactionId}`)
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to get status'
      }
    } catch (error) {
      console.error('Status check error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check status'
      }
    }
  },

  // ── WITHDRAW (For normal users) ─────────────────────────────────────────
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

  // ── ADMIN WITHDRAW (via Snippe) ─────────────────────────────────────────
  async adminWithdraw(amount, phone_number) {
    try {
      const response = await api.post('/financial/admin/withdraw', {
        amount,
        phone_number
      })
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Admin withdrawal failed'
      }
    } catch (error) {
      console.error('Admin withdraw error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initiate admin withdrawal'
      }
    }
  },

  // ── GET BALANCE ──────────────────────────────────────────────────────────
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