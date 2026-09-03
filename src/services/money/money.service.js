// src/services/money/money.service.js

import api from '../api'

const MoneyService = {
  /**
   * Deposit money to user account
   * @param {Object} data - Deposit data
   * @param {string} data.userId - User ID
   * @param {number} data.amount - Amount to deposit
   * @returns {Promise<Object>} - Response with updated user data
   */
  deposit: async (data) => {
    try {
      const response = await api.post('/money/deposite', data)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to deposit. Please try again.'
      }
    }
  },

  /**
   * Withdraw money from user account
   * @param {Object} data - Withdraw data
   * @param {string} data.userId - User ID
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise<Object>} - Response with updated user data
   */
  withdraw: async (data) => {
    try {
      const response = await api.post('/money/withdraw', data)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to withdraw. Please try again.'
      }
    }
  },

  // ============ ADMIN - WITHDRAW REQUESTS ============
  getWithdrawRequests: async (params = {}) => {
    try {
      const response = await api.get('/money/withdraw/requests', { params })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load withdraw requests.' }
    }
  },

  confirmWithdraw: async (request_id) => {
    try {
      const response = await api.post('/money/withdraw/confirm', { request_id })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to confirm withdraw.' }
    }
  },

  cancelWithdraw: async (request_id) => {
    try {
      const response = await api.post('/money/withdraw/cancel', { request_id })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to cancel withdraw.' }
    }
  }
}

export default MoneyService