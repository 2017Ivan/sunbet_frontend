// services/authService.js
import api from '../api'

const authService = {
  async register(phone_number, password, promo_code = null) {
    try {
      // Clean phone number
      const cleanedPhone = phone_number.replace(/\D/g, '')
      
      // Ensure it starts with 255
      let finalPhone = cleanedPhone
      if (!cleanedPhone.startsWith('255')) {
        // If it starts with 0, replace with 255
        if (cleanedPhone.startsWith('0')) {
          finalPhone = '255' + cleanedPhone.substring(1)
        } else {
          // If it's 9 digits local format, add 255
          if (cleanedPhone.length === 9) {
            finalPhone = '255' + cleanedPhone
          }
        }
      }
      
      console.log('📱 Registering with phone:', finalPhone)
      
      const response = await api.post('/auth/register', {
        phone_number: finalPhone,
        password,
        promo_code: promo_code || null
      })
      
      console.log('🔍 Register response:', response.data)
      
      if (response.data?.data) {
        const { user, tokens } = response.data.data
        
        if (tokens?.access_token) {
          localStorage.setItem('access_token', tokens.access_token)
        }
        if (tokens?.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token)
        }
        
        return {
          success: true,
          user: user,
          tokens: tokens,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Invalid response' }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  },

  async login(phone_number, password) {
    console.log('🚀 ===== AUTH SERVICE LOGIN CALLED =====')
    
    // Clean phone number
    const cleanedPhone = phone_number.replace(/\D/g, '')
    
    // Ensure it starts with 255
    let finalPhone = cleanedPhone
    if (!cleanedPhone.startsWith('255')) {
      if (cleanedPhone.startsWith('0')) {
        finalPhone = '255' + cleanedPhone.substring(1)
      } else if (cleanedPhone.length === 9) {
        finalPhone = '255' + cleanedPhone
      }
    }
    
    console.log('📞 Original phone:', phone_number)
    console.log('📞 Final phone (cleaned):', finalPhone)
    console.log('🔑 Password:', password)
    
    try {
      console.log('⏳ Calling API: POST /auth/login')
      
      const response = await api.post('/auth/login', {
        phone_number: finalPhone,
        password
      })
      
      console.log('✅ ===== API RESPONSE RECEIVED =====')
      console.log('📦 response.data:', response.data)
      
      if (response.data?.data) {
        const user = response.data.data.user
        const tokens = response.data.data.tokens
        
        console.log('👤 User data:', user)
        console.log('🔑 Tokens data:', tokens)
        
        if (tokens?.access_token) {
          localStorage.setItem('access_token', tokens.access_token)
          console.log('💾 access_token saved to localStorage')
        }
        if (tokens?.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token)
          console.log('💾 refresh_token saved to localStorage')
        }
        
        return {
          success: true,
          user: user,
          tokens: {
            access_token: tokens?.access_token,
            refresh_token: tokens?.refresh_token
          },
          message: response.data.message || 'Login successful'
        }
      }
      
      console.error('❌ No data in response:', response.data)
      return {
        success: false,
        message: response.data?.message || 'Invalid response from server'
      }
      
    } catch (error) {
      console.error('❌ ===== LOGIN ERROR =====')
      console.error('❌ error.response?.data:', error.response?.data)
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      }
    }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return { success: true }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.data?.data) {
        return {
          success: true,
          user: response.data.data,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to get profile' }
    } catch (error) {
      console.error('Get profile error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      }
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (!refreshToken) {
        return { success: false, message: 'No refresh token' }
      }
      
      const response = await api.post('/auth/refresh', { refreshToken })
      
      if (response.data?.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken
        localStorage.setItem('access_token', newAccessToken)
        
        return {
          success: true,
          accessToken: newAccessToken,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to refresh' }
    } catch (error) {
      console.error('Refresh token error:', error)
      this.logout()
      return {
        success: false,
        message: 'Session expired'
      }
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  async forgotPassword(phone_number) {
    try {
      // Clean phone number
      const cleanedPhone = phone_number.replace(/\D/g, '')
      
      // Ensure it starts with 255
      let finalPhone = cleanedPhone
      if (!cleanedPhone.startsWith('255')) {
        if (cleanedPhone.startsWith('0')) {
          finalPhone = '255' + cleanedPhone.substring(1)
        } else if (cleanedPhone.length === 9) {
          finalPhone = '255' + cleanedPhone
        }
      }
      
      const response = await api.post('/auth/forgot-password', { 
        phone_number: finalPhone 
      })
      
      return {
        success: true,
        userId: response.data?.userId,
        message: response.data?.message || 'Reset link sent'
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process request'
      }
    }
  },

  async resetPassword(userId, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        userId,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data?.message || 'Password reset successfully'
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      }
    }
  },

  async changePassword(phone_number, newPassword, confirmPassword) {
    try {
      // Clean phone number
      const cleanedPhone = phone_number.replace(/\D/g, '')
      
      // Ensure it starts with 255
      let finalPhone = cleanedPhone
      if (!cleanedPhone.startsWith('255')) {
        if (cleanedPhone.startsWith('0')) {
          finalPhone = '255' + cleanedPhone.substring(1)
        } else if (cleanedPhone.length === 9) {
          finalPhone = '255' + cleanedPhone
        }
      }
      
      const response = await api.post('/auth/change-password', {
        phone_number: finalPhone,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data?.message || 'Password changed successfully'
      }
    } catch (error) {
      console.error('Change password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      }
    }
  },

  async getBalance() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.data?.data) {
        return {
          success: true,
          balance: response.data.data.balance || 0,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to get balance' }
    } catch (error) {
      console.error('Get balance error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get balance'
      }
    }
  },

  // ---- Daily login reward ----
  async getDailyRewardStatus() {
    try {
      const response = await api.get('/reward/daily-reward/status')
      if (response.data?.data) {
        return { success: true, data: response.data.data }
      }
      return { success: false, message: response.data?.message || 'Failed to get reward status' }
    } catch (error) {
      console.error('Daily reward status error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get reward status'
      }
    }
  },

  async claimDailyReward() {
    try {
      const response = await api.post('/reward/daily-reward/claim')
      if (response.data?.data) {
        return { success: true, data: response.data.data }
      }
      return { success: false, message: response.data?.message || 'Failed to claim reward' }
    } catch (error) {
      console.error('Daily reward claim error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to claim reward'
      }
    }
  },

  // ---- Helper function to format phone number ----
  formatPhoneNumber(phone_number) {
    if (!phone_number) return ''
    
    // Remove all non-digit characters
    const cleaned = phone_number.replace(/\D/g, '')
    
    // If it already starts with 255, return as is
    if (cleaned.startsWith('255')) {
      return cleaned
    }
    
    // If it starts with 0, replace with 255
    if (cleaned.startsWith('0')) {
      return '255' + cleaned.substring(1)
    }
    
    // If it's 9 digits (local format), add 255
    if (cleaned.length === 9) {
      return '255' + cleaned
    }
    
    // If it's less than 9 digits, it's invalid
    if (cleaned.length < 9) {
      return cleaned // Return as is, validation will catch it
    }
    
    // Otherwise return cleaned
    return cleaned
  },

  // ---- Validate phone number ----
  validatePhoneNumber(phone_number) {
    const formatted = this.formatPhoneNumber(phone_number)
    
    if (!formatted) {
      return { valid: false, message: 'Phone number is required' }
    }
    
    // Must start with 255
    if (!formatted.startsWith('255')) {
      return { valid: false, message: 'Phone number must start with 255' }
    }
    
    // Must be exactly 12 digits (255 + 9 digits)
    if (formatted.length !== 12) {
      return { valid: false, message: 'Phone number must be exactly 12 digits (255 + 9 digits)' }
    }
    
    // Network digit must be 6, 7, or 4
    const networkDigit = formatted[3]
    if (!['6', '7', '4'].includes(networkDigit)) {
      return { valid: false, message: 'Phone number must be in format 2556, 2557, or 2554' }
    }
    
    return { valid: true, formatted }
  }
}

export default authService