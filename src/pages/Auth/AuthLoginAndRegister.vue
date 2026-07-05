<template>
  <div>
    <div class="flex gap-1 p-1 bg-[#161616] rounded-[14px] mb-8 border border-[#2A2A2A]">
      <button
        v-for="tab in ['Login', 'Register']"
        :key="tab"
        class="flex-1 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200"
        :class="activeTab === tab
          ? 'bg-[#A32D2D] text-white shadow-[0_4px_12px_rgba(163,45,45,0.35)]'
          : 'text-[#606060] hover:text-[#A0A0A0]'"
        @click="switchTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <Transition name="form" mode="out-in">
      <div v-if="activeTab === 'Login'" key="login">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white">Welcome back 👋</h2>
          <p class="text-sm text-[#606060] mt-1">Login to continue betting</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <AppInput
            v-model="loginForm.phone"
            label="Phone Number"
            placeholder="+255 7XX XXX XXX"
            type="tel"
            required
            :error="loginErrors.phone"
          >
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </template>
          </AppInput>

          <AppInput
            v-model="loginForm.password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            required
            :error="loginErrors.password"
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
                :class="loginForm.remember
                  ? 'bg-[#A32D2D] border-[#A32D2D]'
                  : 'border-[#333] group-hover:border-[#A32D2D]/50'"
                @click="loginForm.remember = !loginForm.remember"
              >
                <svg v-if="loginForm.remember" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
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
          <button class="text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors" @click="switchTab('Register')">
            Register free
          </button>
        </p>
      </div>

      <div v-else key="register">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white">Create account 🎯</h2>
          <p class="text-sm text-[#606060] mt-1">Join 2M+ bettors on SunBet</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <AppInput
            v-model="registerForm.phone"
            label="Phone Number"
            placeholder="+255 7XX XXX XXX"
            type="tel"
            required
            hint="This will be your login username"
            :error="registerErrors.phone"
          >
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </template>
          </AppInput>

          <AppInput
            v-model="registerForm.password"
            label="Password"
            placeholder="Min 4 characters"
            type="password"
            required
            :error="registerErrors.password"
          >
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </template>
          </AppInput>

          <div v-if="registerForm.password" class="space-y-1.5">
            <div class="flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                class="flex-1 h-1 rounded-full transition-all duration-300"
                :class="i <= passwordStrength.score ? passwordStrength.color : 'bg-[#2A2A2A]'"
              />
            </div>
            <p class="text-xs" :class="passwordStrength.textColor">
              {{ passwordStrength.label }}
            </p>
          </div>

          <label class="flex items-start gap-3 cursor-pointer group pt-2">
            <div
              class="w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-all"
              :class="registerForm.agreed
                ? 'bg-[#A32D2D] border-[#A32D2D]'
                : 'border-[#333] group-hover:border-[#A32D2D]/50'"
              @click="registerForm.agreed = !registerForm.agreed"
            >
              <svg v-if="registerForm.agreed" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span class="text-xs text-[#606060] leading-relaxed">
              I confirm I am 18+ years old and agree to the
              <a href="#" class="text-[#A32D2D] hover:underline">Terms</a> &
              <a href="#" class="text-[#A32D2D] hover:underline">Privacy Policy</a>
            </span>
          </label>
          <p v-if="registerErrors.agreed" class="text-xs text-[#EF4444] -mt-2">{{ registerErrors.agreed }}</p>

          <!-- Error Message -->
          <div v-if="registerError" class="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm">
            {{ registerError }}
          </div>

          <AppButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            :loading="loading"
            loading-text="Creating account..."
            class="mt-4"
          >
            Create Account 🎉
          </AppButton>
        </form>

        <p class="text-center text-sm text-[#606060] mt-6">
          Already have an account?
          <button class="text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors" @click="switchTab('Login')">
            Login here
          </button>
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore.js'
import AppInput from '../../components/ui/AppInput.vue'
import AppButton from '../../components/ui/AppButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ---- Active Tab ----
// Sasa inaangalia query parameter 'tab'
const activeTab = ref('Login')

// ---- Loading State ----
const loading = ref(false)

// ---- Error States ----
const loginError = ref('')
const registerError = ref('')

// ---- Login Form ----
const loginForm = ref({
  phone: '',
  password: '',
  remember: false,
})
const loginErrors = ref({ phone: '', password: '' })

// ---- Register Form ----
const registerForm = ref({
  phone: '',
  password: '',
  agreed: false,
})
const registerErrors = ref({ phone: '', password: '', agreed: '' })

// ---- Function ya ku-set active tab kutoka URL ----
const setTabFromQuery = () => {
  const tab = route.query.tab
  if (tab === 'register' || tab === 'Register') {
    activeTab.value = 'Register'
  } else {
    activeTab.value = 'Login'
  }
}

// ---- Switch Tab ----
const switchTab = (tab) => {
  activeTab.value = tab
  clearErrors()
  loginError.value = ''
  registerError.value = ''
  
  // Badilisha URL kuwa na query parameter ya tab
  router.push({ 
    name: 'auth', 
    query: { tab: tab.toLowerCase() } 
  })
}

// ---- Go to Forgot Password ----
const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' })
}

// ---- HANDLE LOGIN ----
const handleLogin = async () => {
  clearErrors()
  loginError.value = ''
  let valid = true

  // Validate phone
  if (!loginForm.value.phone) {
    loginErrors.value.phone = 'Phone number is required'
    valid = false
  } else if (loginForm.value.phone.length < 9) {
    loginErrors.value.phone = 'Please enter a valid phone number'
    valid = false
  }

  // Validate password
  if (!loginForm.value.password) {
    loginErrors.value.password = 'Password is required'
    valid = false
  } else if (loginForm.value.password.length < 4) {
    loginErrors.value.password = 'Password must be at least 4 characters'
    valid = false
  }

  if (!valid) return

  loading.value = true
  
  try {
    const result = await authStore.login(
      loginForm.value.phone,
      loginForm.value.password
    )

    if (result.success) {
      // Login successful
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      // Login failed
      loginError.value = result.message || 'Login failed. Please try again.'
      
      // Handle specific errors
      if (result.message?.toLowerCase().includes('phone')) {
        loginErrors.value.phone = result.message
      } else if (result.message?.toLowerCase().includes('password')) {
        loginErrors.value.password = result.message
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// ---- HANDLE REGISTER ----
const handleRegister = async () => {
  clearErrors()
  registerError.value = ''
  let valid = true

  // Validate phone
  if (!registerForm.value.phone) {
    registerErrors.value.phone = 'Phone number is required'
    valid = false
  } else if (registerForm.value.phone.length < 9) {
    registerErrors.value.phone = 'Please enter a valid phone number'
    valid = false
  }

  // Validate password
  if (!registerForm.value.password) {
    registerErrors.value.password = 'Password is required'
    valid = false
  } else if (registerForm.value.password.length < 4) {
    registerErrors.value.password = 'Password must be at least 4 characters'
    valid = false
  }

  // Validate agreement
  if (!registerForm.value.agreed) {
    registerErrors.value.agreed = 'You must agree to the terms and conditions'
    valid = false
  }

  if (!valid) return

  loading.value = true

  try {
    const result = await authStore.register(
      registerForm.value.phone,
      registerForm.value.password
    )

    if (result.success) {
      // Registration successful - user is automatically logged in
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      // Registration failed
      registerError.value = result.message || 'Registration failed. Please try again.'
      
      // Handle specific errors
      if (result.message?.toLowerCase().includes('phone') || 
          result.message?.toLowerCase().includes('exists')) {
        registerErrors.value.phone = result.message
      } else if (result.message?.toLowerCase().includes('password')) {
        registerErrors.value.password = result.message
      }
    }
  } catch (error) {
    console.error('Register error:', error)
    registerError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// ---- Password Strength ----
const passwordStrength = computed(() => {
  const p = registerForm.value.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const map = {
    0: { label: 'Too weak', color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
    1: { label: 'Weak', color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
    2: { label: 'Fair', color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
    3: { label: 'Good', color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
    4: { label: 'Strong 💪', color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
  }
  return { score, ...map[score] }
})

// ---- Clear Errors ----
const clearErrors = () => {
  loginErrors.value = { phone: '', password: '' }
  registerErrors.value = { phone: '', password: '', agreed: '' }
}

// ---- Watch for route query changes ----
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === 'register' || newTab === 'Register') {
      activeTab.value = 'Register'
    } else if (newTab === 'login' || newTab === 'Login' || !newTab) {
      activeTab.value = 'Login'
    }
  },
  { immediate: true }
)

// ---- Check if user is already logged in ----
onMounted(() => {
  // Set tab from URL query
  setTabFromQuery()
  
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped>
.form-enter-active,
.form-leave-active {
  transition: all 0.2s ease;
}
.form-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.form-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>