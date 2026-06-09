import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ===== STATE =====
  const user        = ref(null)
  const token       = ref(localStorage.getItem('sunbet_token') || null)
  const isLoading   = ref(false)
  const error       = ref(null)
  const otpSent     = ref(false)
  const otpVerified = ref(false)

  // ===== GETTERS =====
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')
  const isVerified = computed(() => user.value?.verified === true)
  const fullName   = computed(() => user.value?.name || '')
  const initials   = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })
  const vipLevel = computed(() => user.value?.vip || 'Bronze')
  const balance  = computed(() => user.value?.balance || 0)

  // ===== HELPERS =====
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('sunbet_token', newToken)
    } else {
      localStorage.removeItem('sunbet_token')
      localStorage.removeItem('sunbet_admin')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const clearError = () => {
    error.value = null
  }

  // ===== ACTIONS =====

  // -- Login --
  const login = async ({ phone, password, remember = false }) => {
    isLoading.value = true
    error.value     = null

    try {
      // TODO: replace with real API call
      // const res = await api.post('/auth/login', { phone, password })

      await new Promise(r => setTimeout(r, 1500)) // simulate

      // Simulate response
      const fakeUser = {
        id:       'USR001',
        name:     'John Doe',
        phone,
        email:    'john@example.com',
        role:     phone === '+255000000000' ? 'admin' : 'user',
        verified: true,
        vip:      'Gold',
        balance:  125000,
        bonus:    10000,
        avatar:   null,
        joinedAt: '2024-01-15',
      }

      const fakeToken = 'sunbet_' + Math.random().toString(36).substring(2)

      setToken(fakeToken)
      setUser(fakeUser)

      if (fakeUser.role === 'admin') {
        localStorage.setItem('sunbet_admin', 'true')
      }

      if (remember) {
        localStorage.setItem('sunbet_remember', phone)
      }

      // Redirect
      await router.push(fakeUser.role === 'admin' ? '/admin' : '/')

      return { success: true, user: fakeUser }

    } catch (err) {
      error.value = err?.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // -- Register --
  const register = async ({ name, phone, dob, password, referral = '' }) => {
    isLoading.value = true
    error.value     = null

    try {
      // TODO: replace with real API call
      // const res = await api.post('/auth/register', { name, phone, dob, password, referral })

      await new Promise(r => setTimeout(r, 2000)) // simulate

      const fakeUser = {
        id:       'USR' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        name,
        phone,
        email:    null,
        role:     'user',
        verified: false,
        vip:      'Bronze',
        balance:  0,
        bonus:    referral ? 10000 : 0, // bonus if referral code
        avatar:   null,
        joinedAt: new Date().toISOString(),
      }

      const fakeToken = 'sunbet_' + Math.random().toString(36).substring(2)

      setToken(fakeToken)
      setUser(fakeUser)

      await router.push('/')

      return { success: true, user: fakeUser }

    } catch (err) {
      error.value = err?.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // -- Logout --
  const logout = async () => {
    try {
      // TODO: call API to invalidate token
      // await api.post('/auth/logout')
    } catch (_) {
      // silent fail
    } finally {
      setToken(null)
      setUser(null)
      otpSent.value     = false
      otpVerified.value = false
      await router.push('/auth/login')
    }
  }

  // -- Fetch current user (on app load) --
  const fetchMe = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      // TODO: replace with real API call
      // const res = await api.get('/auth/me')
      // setUser(res.data.user)

      await new Promise(r => setTimeout(r, 500))

      // Restore fake user from token
      setUser({
        id:       'USR001',
        name:     'John Doe',
        phone:    '+255 712 345 678',
        email:    'john@example.com',
        role:     localStorage.getItem('sunbet_admin') ? 'admin' : 'user',
        verified: true,
        vip:      'Gold',
        balance:  125000,
        bonus:    10000,
        avatar:   null,
        joinedAt: '2024-01-15',
      })

    } catch (err) {
      // Token expired or invalid
      setToken(null)
      setUser(null)
    } finally {
      isLoading.value = false
    }
  }

  // -- Send OTP --
  const sendOtp = async (phone) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.post('/auth/otp/send', { phone })
      await new Promise(r => setTimeout(r, 1000))
      otpSent.value = true
      return { success: true }
    } catch (err) {
      error.value = 'Failed to send OTP. Try again.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Verify OTP --
  const verifyOtp = async (phone, code) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.post('/auth/otp/verify', { phone, code })
      await new Promise(r => setTimeout(r, 800))

      if (code === '1234') { // fake valid OTP
        otpVerified.value = true
        if (user.value) user.value.verified = true
        return { success: true }
      } else {
        error.value = 'Invalid OTP code. Please try again.'
        return { success: false }
      }
    } catch (err) {
      error.value = 'OTP verification failed.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Forgot password --
  const forgotPassword = async (phone) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.post('/auth/forgot-password', { phone })
      await new Promise(r => setTimeout(r, 1200))
      return { success: true, message: 'Reset code sent to ' + phone }
    } catch (err) {
      error.value = 'Failed to send reset code.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Reset password --
  const resetPassword = async ({ phone, code, newPassword }) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.post('/auth/reset-password', { phone, code, newPassword })
      await new Promise(r => setTimeout(r, 1500))
      return { success: true }
    } catch (err) {
      error.value = 'Password reset failed. Please try again.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Change password --
  const changePassword = async ({ currentPassword, newPassword }) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.post('/auth/change-password', { currentPassword, newPassword })
      await new Promise(r => setTimeout(r, 1200))
      return { success: true }
    } catch (err) {
      error.value = 'Failed to change password.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Update profile --
  const updateProfile = async (data) => {
    isLoading.value = true
    error.value     = null
    try {
      // TODO: await api.patch('/auth/profile', data)
      await new Promise(r => setTimeout(r, 1000))
      setUser({ ...user.value, ...data })
      return { success: true }
    } catch (err) {
      error.value = 'Failed to update profile.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  // -- Update balance locally (after deposit/withdrawal) --
  const updateBalance = (newBalance) => {
    if (user.value) user.value.balance = newBalance
  }

  const addToBalance = (amount) => {
    if (user.value) user.value.balance += amount
  }

  const deductFromBalance = (amount) => {
    if (user.value) user.value.balance = Math.max(0, user.value.balance - amount)
  }

  return {
    // state
    user,
    token,
    isLoading,
    error,
    otpSent,
    otpVerified,
    // getters
    isLoggedIn,
    isAdmin,
    isVerified,
    fullName,
    initials,
    vipLevel,
    balance,
    // actions
    login,
    register,
    logout,
    fetchMe,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    updateBalance,
    addToBalance,
    deductFromBalance,
    clearError,
  }
})