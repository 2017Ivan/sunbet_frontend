<!-- pages/Auth/LoginPage.vue -->
<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-white">Welcome back 👋</h2>
      <p class="text-sm text-[#606060] mt-1">Login to continue betting</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <AppInput
        v-model="form.phone"
        label="Phone Number"
        placeholder="Enter 9 digit number"
        type="tel"
        required
        :phone="true"
        hint="Enter 9 digits (e.g., 798764567)"
        :error="errors.phone"
      >
        <template #icon-left>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </template>
      </AppInput>

      <AppInput
        v-model="form.password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        required
        :error="errors.password"
      >
        <template #icon-left>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </template>
      </AppInput>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer group">
          <div
            class="w-4 h-4 rounded border flex items-center justify-center transition-all"
            :class="form.remember
              ? 'bg-[#A32D2D] border-[#A32D2D]'
              : 'border-[#333] group-hover:border-[#A32D2D]/50'"
            @click="form.remember = !form.remember"
          >
            <svg v-if="form.remember" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span class="text-xs text-[#606060]">Remember me</span>
        </label>
        <button type="button" class="text-xs text-[#A32D2D] hover:text-[#C94040] transition-colors" @click="goToForgotPassword">
          Forgot password?
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="loginError" class="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm">
        {{ loginError }}
      </div>

      <AppButton
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        :loading="loading"
        loading-text="Logging in..."
        class="mt-2"
      >
        Login to SunBet
      </AppButton>
    </form>

    <p class="text-center text-sm text-[#606060] mt-6">
      Don't have an account?
      <router-link to="/register" class="text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
        Register free
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore.js'
import AppInput from '../../components/ui/AppInput.vue'
import AppButton from '../../components/ui/AppButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ---- Loading State ----
const loading = ref(false)

// ---- Error State ----
const loginError = ref('')

// ---- Form ----
const form = ref({
  phone: '',
  password: '',
  remember: false,
})
const errors = ref({ phone: '', password: '' })

// ---- Validation Functions ----
const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required'
  
  const cleaned = String(phone).replace(/\D/g, '')
  
  if (cleaned.length !== 9) {
    return 'Phone number must be exactly 9 digits'
  }
  
  const validPrefixes = ['6', '7', '4']
  if (!validPrefixes.includes(cleaned[0])) {
    return 'Phone number must start with 6, 7, or 4'
  }
  
  return null
}

// ---- Go to Forgot Password ----
const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' })
}

// ---- HANDLE LOGIN ----
const handleLogin = async () => {
  errors.value = { phone: '', password: '' }
  loginError.value = ''
  let valid = true

  console.log('🔄 Starting login process...')
  console.log('📱 Phone:', form.value.phone)

  // Validate phone
  const phoneError = validatePhone(form.value.phone)
  if (phoneError) {
    errors.value.phone = phoneError
    valid = false
  }

  // Validate password
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    valid = false
  } else if (form.value.password.length < 4) {
    errors.value.password = 'Password must be at least 4 characters'
    valid = false
  }

  if (!valid) return

  loading.value = true
  
  try {
    const result = await authStore.login(
      form.value.phone,
      form.value.password
    )

    console.log('📨 Login result:', result)

    // ONLY redirect if login was successful
    if (result.success) {
      console.log('✅ Login successful!')
      
      // Check if store is updated
      if (!authStore.isLoggedIn) {
        console.warn('⚠️ Store says not logged in, re-initializing...')
        await authStore.initialize()
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const redirect = route.query.redirect || '/'
      console.log('🔄 Redirecting to:', redirect)
      
      // 👇 USE replace to avoid back button issues
      router.replace(redirect)
    } else {
      // 👇 SHOW ERROR - DO NOT REDIRECT
      console.log('❌ Login failed:', result.message)
      loginError.value = result.message || 'Login failed. Please try again.'
      
      // Set field-specific errors
      if (result.message?.toLowerCase().includes('phone') || 
          result.message?.toLowerCase().includes('number') ||
          result.message?.toLowerCase().includes('not found')) {
        errors.value.phone = result.message
      } else if (result.message?.toLowerCase().includes('password')) {
        errors.value.password = result.message
      }
      
      // 👇 IMPORTANT: Stay on login page
      // Do NOT redirect
      return
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    loginError.value = 'An unexpected error occurred. Please try again.'
    // 👇 Stay on login page
  } finally {
    loading.value = false
  }
}

// ---- Check if already logged in ----
onMounted(() => {
  console.log('🔍 Login page mounted')
  
  if (authStore.isLoggedIn) {
    console.log('✅ Already logged in, redirecting to home')
    router.replace('/')
  }
})
</script>