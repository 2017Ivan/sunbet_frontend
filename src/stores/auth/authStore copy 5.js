// store/auth/authStore.js
import { defineStore } from 'pinia'
import authService from '../../services/auth/authService'
import api from '../../services/api'

// ── Helper: Decode JWT token ──────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      phone_number: null,
      role: null,
      balance: null,
      created_at: null,
      updated_at: null
    },
    isLoggedIn: false,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    initialized: false
  }),
  
  getters: {
    userPhone: (state) => state.user.phone_number,
    userRole: (state) => state.user.role,
    isAdmin: (state) => state.user.role === 'ADMIN',
    isAgent: (state) => state.user.role === 'AGENT',
    isUser: (state) => state.user.role === 'USER',
    hasRole: (state) => (role) => {
      if (Array.isArray(role)) {
        return role.includes(state.user.role)
      }
      return state.user.role === role
    },
    
    // 👇 FIX: Ensure balance is always a number
    userBalance: (state) => {
      const balance = state.user.balance
      if (balance === null || balance === undefined) return 0
      return typeof balance === 'string' ? parseFloat(balance) : balance
    },
    
    hasSufficientBalance: (state) => (amount) => {
      const balance = state.user.balance
      const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
      return numBalance >= amount
    },
    
    // 👇 FIX: Format balance with commas
    formattedBalance: (state) => {
      const balance = state.user.balance
      if (balance === null || balance === undefined) return 'TZS 0'
      
      // Ensure it's a number
      const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
      
      // Format with commas and no decimals
      return `TZS ${numBalance.toLocaleString()}`
    }
  },
  
  actions: {
    // ── HELPER: Normalize phone for backend ─────────────────────────────────
    normalizePhoneForBackend(phone) {
      if (!phone) return ''
      
      let cleaned = String(phone).replace(/\D/g, '')
      
      if (cleaned.length === 9) {
        return '255' + cleaned
      }
      if (cleaned.startsWith('255') && cleaned.length === 12) {
        return cleaned
      }
      if (cleaned.startsWith('0')) {
        return '255' + cleaned.substring(1)
      }
      if (cleaned.length === 12 && cleaned.startsWith('255')) {
        return cleaned
      }
      return cleaned
    },

    // ── INITIALIZE ──────────────────────────────────────────────────────────
    async initialize() {
      console.log('🔄 Initializing auth store...')
      
      const token = localStorage.getItem('access_token')
      console.log('🔑 Token from localStorage:', token ? 'exists' : 'not found')
      
      if (token) {
        try {
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token:', decoded)
          
          if (decoded) {
            this.user.id = decoded.id || decoded.userId || decoded.sub
            this.user.role = decoded.role || 'USER'
            this.user.balance = 0 // 👈 Initialize as number
            this.isLoggedIn = true
            this.accessToken = token
            this.initialized = true
            
            console.log('✅ Store initialized. User:', {
              id: this.user.id,
              role: this.user.role,
              isLoggedIn: this.isLoggedIn
            })
            
            await this.fetchUserProfile()
            await this.fetchUserBalance()
            
            console.log('✅ Final state after init:', this.$state)
            return true
          } else {
            console.warn('⚠️ Invalid token, clearing auth')
            this.clearAuth()
            return false
          }
        } catch (error) {
          console.error('❌ Init error:', error)
          this.clearAuth()
          return false
        }
      } else {
        console.log('ℹ️ No token found, auth not initialized')
        this.clearAuth()
        return false
      }
    },
    
    // ── REGISTER ────────────────────────────────────────────────────────────
    async register(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const normalizedPhone = this.normalizePhoneForBackend(phone_number)
        console.log('📞 Register - Original:', phone_number, 'Normalized:', normalizedPhone)
        
        const result = await authService.register(normalizedPhone, password)
        
        if (result.success) {
          return await this.login(phone_number, password)
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── LOGIN ───────────────────────────────────────────────────────────────
    async login(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const normalizedPhone = this.normalizePhoneForBackend(phone_number)
        console.log('📞 Login - Original:', phone_number, 'Normalized:', normalizedPhone)
        
        const result = await authService.login(normalizedPhone, password)
        console.log('📨 Login response from service:', result)
        
        if (result.success) {
          const token = result.tokens?.accessToken || result.accessToken || result.token
          
          if (!token) {
            throw new Error('No token received from server')
          }
          
          this.accessToken = token
          this.refreshToken = result.tokens?.refreshToken || null
          
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token on login:', decoded)
          
          this.user.id = decoded.id || decoded.userId || decoded.sub || result.user?.id
          this.user.phone_number = phone_number
          this.user.role = decoded.role || 'USER'
          this.user.balance = 0 // 👈 Initialize as number
          this.isLoggedIn = true
          this.initialized = true
          
          console.log('✅ Login successful. User state:', {
            id: this.user.id,
            phone: this.user.phone_number,
            role: this.user.role,
            isLoggedIn: this.isLoggedIn,
            initialized: this.initialized
          })
          
          await this.fetchUserProfile()
          await this.fetchUserBalance()
          
          console.log('✅ Final user state after login:', this.$state)
          
          return { 
            success: true, 
            user: this.user,
            message: result.message || 'Login successful'
          }
        } else {
          this.error = result.message || 'Login failed'
          return { success: false, message: this.error }
        }
      } catch (error) {
        console.error('❌ Login error:', error)
        this.error = error.message || 'Login failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── LOGOUT ──────────────────────────────────────────────────────────────
    logout() {
      authService.logout()
      this.clearAuth()
      return { success: true, message: 'Logged out successfully' }
    },
    
    // ── CLEAR AUTH ──────────────────────────────────────────────────────────
    clearAuth() {
      this.user = {
        id: null,
        phone_number: null,
        role: null,
        balance: null,
        created_at: null,
        updated_at: null
      }
      this.isLoggedIn = false
      this.accessToken = null
      this.refreshToken = null
      this.error = null
      this.initialized = false
    },
    
    // ── FETCH USER PROFILE ──────────────────────────────────────────────────
    async fetchUserProfile() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      this.isLoading = true
      
      try {
        const result = await authService.getProfile()
        console.log('📨 Profile response:', result)
        
        if (result.success) {
          const currentRole = this.user.role
          const currentId = this.user.id
          
          this.user.phone_number = result.user.phone_number
          this.user.created_at = result.user.created_at
          this.user.updated_at = result.user.updated_at
          
          this.user.role = currentRole
          this.user.id = currentId
          
          console.log('✅ Profile fetched. Keeping role from token:', this.user.role)
          
          return { success: true, user: this.user }
        } else {
          this.clearAuth()
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── FETCH USER BALANCE ──────────────────────────────────────────────────
    async fetchUserBalance() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      try {
        const result = await authService.getBalance()
        console.log('💰 Balance response:', result)
        
        if (result.success) {
          // 👇 CONVERT TO NUMBER
          
          const balance = result.balance || result.data?.balance || 0
          this.user.balance = typeof balance === 'string' ? parseFloat(balance) : balance
          console.log('💰 Balance saved as number:', this.user.balance)
          return { success: true, balance: this.user.balance }
        } else {
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      }
    },
    
    // ── UPDATE BALANCE LOCALLY ─────────────────────────────────────────────
    updateBalanceLocally(newBalance) {
      this.user.balance = typeof newBalance === 'string' ? parseFloat(newBalance) : newBalance
    },
    
    // ── DEPOSIT ─────────────────────────────────────────────────────────────
    async initiateDeposit(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/deposit', { amount })
        
        if (response.data && response.data.data && response.data.data.paymentUrl) {
          window.location.href = response.data.data.paymentUrl
          return { success: true, paymentUrl: response.data.data.paymentUrl }
        } else {
          return { success: false, message: 'Failed to initiate deposit' }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Deposit failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── WITHDRAW ────────────────────────────────────────────────────────────
    async withdraw(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
      if (this.user.balance < amount) {
        return { 
          success: false, 
          message: `Insufficient balance. Your balance is TZS ${this.user.balance.toLocaleString()}` 
        }
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/withdraw', { amount })
        
        if (response.data) {
          if (response.data.data && response.data.data.new_balance) {
            this.user.balance = typeof response.data.data.new_balance === 'string' 
              ? parseFloat(response.data.data.new_balance) 
              : response.data.data.new_balance
          } else {
            await this.fetchUserBalance()
          }
          
          return { 
            success: true, 
            message: response.data.message,
            newBalance: this.user.balance
          }
        } else {
          return { success: false, message: 'Withdrawal failed' }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Withdrawal failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── FORGOT PASSWORD ─────────────────────────────────────────────────────
    async forgotPassword(phone_number) {
      this.isLoading = true
      this.error = null
      
      try {
        const normalizedPhone = this.normalizePhoneForBackend(phone_number)
        const result = await authService.forgotPassword(normalizedPhone)
        return result
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── RESET PASSWORD ──────────────────────────────────────────────────────
    async resetPassword(userId, newPassword, confirmPassword) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.resetPassword(userId, newPassword, confirmPassword)
        return result
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    }
  }
})