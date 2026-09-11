// src/services/paymentGateway/paymentGateway.service.js
import api from '../api'

const PaymentGatewayService = {
  // GET current active deposit gateway (PalmPesa / Snipe)
  getGateway: async () => {
    try {
      const response = await api.get('/money/deposit/gateway')
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load payment gateway.' }
    }
  },

  // POST switch active deposit gateway  { gateway: 'palmpesa' | 'snipe' }
  setGateway: async (gateway) => {
    try {
      const response = await api.post('/money/deposit/gateway', { gateway })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to switch payment gateway.' }
    }
  },

  // GET provider API keys (DB-backed) - ADMIN
  getKeys: async () => {
    try {
      const response = await api.get('/money/deposit/gateway/keys')
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to load provider API keys.' }
    }
  },

  // PUT update provider API keys (DB-backed) - ADMIN  { gateway, ...fields }
  updateKeys: async (gateway, fields = {}) => {
    try {
      const response = await api.put('/money/deposit/gateway/keys', { gateway, ...fields })
      return response.data
    } catch (error) {
      if (error.response?.data) return error.response.data
      return { success: false, message: error.message || 'Failed to update provider API keys.' }
    }
  }
}

export default PaymentGatewayService