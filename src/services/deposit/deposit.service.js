// src/services/deposit/deposit.service.js
import api from '../api'

const DepositService = {
  // ============ CUSTOMER ============
  // Initiates a PalmPesa mobile-money deposit. The balance is credited
  // automatically once PalmPesa confirms the payment via webhook.
  requestDeposit: async (data) => {
    try {
      const response = await api.post('/money/deposit/palmpesa', data)
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to send deposit request.' }
    }
  },

  // Check the live status of a PalmPesa payment (by our transaction_id).
  // Returns data: { status: 'pending'|'completed'|'failed', new_balance, ... }
  getDepositStatus: async (transactionId) => {
    try {
      const response = await api.get(`/money/payment/status/${transactionId}`)
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to check payment status.' }
    }
  },

  getMyDeposits: async () => {
    try {
      const response = await api.get('/deposit/my')
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load deposits.' }
    }
  },

  // ============ RECIPIENTS (admin) ============
  getRecipients: async () => {
    try {
      const response = await api.get('/deposit/recipients')
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load recipients.' }
    }
  },

  addRecipient: async (data) => {
    try {
      const response = await api.post('/deposit/recipients', data)
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to add recipient.' }
    }
  },

  removeRecipient: async (id) => {
    try {
      const response = await api.delete(`/deposit/recipients/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to remove recipient.' }
    }
  },

  // ============ ADMIN REQUESTS ============
  getRequests: async (params = {}) => {
    try {
      const response = await api.get('/deposit/requests', { params })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load deposit requests.' }
    }
  },

  confirmRequest: async (request_id) => {
    try {
      const response = await api.post('/deposit/confirm', { request_id })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to confirm deposit.' }
    }
  },

  cancelRequest: async (request_id) => {
    try {
      const response = await api.post('/deposit/cancel', { request_id })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to cancel deposit.' }
    }
  }
}

export default DepositService