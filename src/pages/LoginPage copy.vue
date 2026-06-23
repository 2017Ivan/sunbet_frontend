<template>
    <div>
  
      <!-- Tabs: Login / Register -->
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
  
      <!-- ===== LOGIN FORM ===== -->
      <Transition name="form" mode="out-in">
        <div v-if="activeTab === 'Login'" key="login">
  
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white">Welcome back 👋</h2>
            <p class="text-sm text-[#606060] mt-1">Login to continue betting</p>
          </div>
  
          <form class="space-y-4" @submit.prevent="handleLogin">
  
            <!-- Phone -->
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
  
            <!-- Password -->
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
  
            <!-- Remember + Forgot -->
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
              <button type="button" class="text-xs text-[#A32D2D] hover:text-[#C94040] transition-colors">
                Forgot password?
              </button>
            </div>
  
            <!-- Submit -->
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
  
            <!-- Divider -->
            <div class="relative flex items-center gap-3 my-2">
              <div class="flex-1 h-px bg-[#2A2A2A]" />
              <span class="text-xs text-[#606060]">or continue with</span>
              <div class="flex-1 h-px bg-[#2A2A2A]" />
            </div>
  
            <!-- Social login -->
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="flex items-center justify-center gap-2 h-11 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#333] text-sm text-[#A0A0A0] hover:text-white transition-all"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 h-11 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#333] text-sm text-[#A0A0A0] hover:text-white transition-all"
              >
                <!-- M-Pesa icon placeholder -->
                <span class="text-[#4CAF50] font-bold text-xs">M-PESA</span>
              </button>
            </div>
  
          </form>
  
          <p class="text-center text-sm text-[#606060] mt-6">
            Don't have an account?
            <button class="text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors" @click="switchTab('Register')">
              Register free
            </button>
          </p>
  
        </div>
  
        <!-- ===== REGISTER FORM ===== -->
        <div v-else key="register">
  
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white">Create account 🎯</h2>
            <p class="text-sm text-[#606060] mt-1">Join 2M+ bettors on SunBet</p>
          </div>
  
          <form class="space-y-4" @submit.prevent="handleRegister">
  
            <!-- Step indicator -->
            <div class="flex items-center gap-2 mb-6">
              <div
                v-for="step in 2"
                :key="step"
                class="flex items-center gap-2"
              >
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  :class="currentStep >= step
                    ? 'bg-[#A32D2D] text-white'
                    : 'bg-[#1E1E1E] text-[#606060] border border-[#2A2A2A]'"
                >
                  <svg v-if="currentStep > step" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else>{{ step }}</span>
                </div>
                <span class="text-xs" :class="currentStep >= step ? 'text-[#A0A0A0]' : 'text-[#606060]'">
                  {{ step === 1 ? 'Personal Info' : 'Security' }}
                </span>
                <div v-if="step < 2" class="flex-1 h-px w-8 bg-[#2A2A2A] mx-1" />
              </div>
            </div>
  
            <!-- Step 1 -->
            <Transition name="form" mode="out-in">
              <div v-if="currentStep === 1" key="step1" class="space-y-4">
  
                <!-- Full name -->
                <AppInput
                  v-model="registerForm.name"
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  :error="registerErrors.name"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </template>
                </AppInput>
  
                <!-- Phone -->
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
  
                <!-- Date of birth -->
                <AppInput
                  v-model="registerForm.dob"
                  label="Date of Birth"
                  type="date"
                  required
                  hint="Must be 18 years or older"
                  :error="registerErrors.dob"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </template>
                </AppInput>
  
                <AppButton variant="primary" fullWidth size="lg" type="button" @click="goToStep2">
                  Continue →
                </AppButton>
  
              </div>
  
              <!-- Step 2 -->
              <div v-else key="step2" class="space-y-4">
  
                <!-- Password -->
                <AppInput
                  v-model="registerForm.password"
                  label="Password"
                  placeholder="Min 8 characters"
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
  
                <!-- Password strength -->
                <div v-if="registerForm.password" class="space-y-1.5">
                  <div class="flex gap-1">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="flex-1 h-1 rounded-full transition-all duration-300"
                      :class="i <= passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-[#2A2A2A]'"
                    />
                  </div>
                  <p class="text-xs" :class="passwordStrength.textColor">
                    {{ passwordStrength.label }}
                  </p>
                </div>
  
                <!-- Confirm Password -->
                <AppInput
                  v-model="registerForm.confirmPassword"
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  type="password"
                  required
                  :error="registerErrors.confirmPassword"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </template>
                </AppInput>
  
                <!-- Referral code (optional) -->
                <AppInput
                  v-model="registerForm.referral"
                  label="Referral Code (Optional)"
                  placeholder="Enter referral code"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                  </template>
                </AppInput>
  
                <!-- Agree to terms -->
                <label class="flex items-start gap-3 cursor-pointer group">
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
  
                <!-- Buttons -->
                <div class="flex gap-3">
                  <AppButton variant="secondary" size="lg" @click="currentStep = 1">
                    ← Back
                  </AppButton>
                  <AppButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    :loading="loading"
                    loading-text="Creating account..."
                  >
                    Create Account 🎉
                  </AppButton>
                </div>
  
              </div>
            </Transition>
  
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
  import { ref, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import AppInput  from '../components/ui/AppInput.vue'
  import AppButton from '../components/ui/AppButton.vue'
  
  const router = useRouter()
  const route  = useRoute()
  
  // Tab — detect from route
  const activeTab  = ref(route.name === 'register' ? 'Register' : 'Login')
  const currentStep = ref(1)
  const loading     = ref(false)
  
  const switchTab = (tab) => {
    activeTab.value  = tab
    currentStep.value = 1
    clearErrors()
    router.replace({ name: tab.toLowerCase() })
  }
  
  // ---- Login ----
  const loginForm = ref({
    phone:    '',
    password: '',
    remember: false,
  })
  
  const loginErrors = ref({ phone: '', password: '' })
  
  const handleLogin = async () => {
    clearErrors()
    let valid = true
  
    if (!loginForm.value.phone) {
      loginErrors.value.phone = 'Phone number is required'
      valid = false
    }
    if (!loginForm.value.password) {
      loginErrors.value.password = 'Password is required'
      valid = false
    }
    if (!valid) return
  
    loading.value = true
    try {
      // TODO: connect to real API
      await new Promise(r => setTimeout(r, 1500)) // simulate
      localStorage.setItem('sunbet_token', 'fake_token')
      router.push('/')
    } finally {
      loading.value = false
    }
  }
  
  // ---- Register ----
  const registerForm = ref({
    name:            '',
    phone:           '',
    dob:             '',
    password:        '',
    confirmPassword: '',
    referral:        '',
    agreed:          false,
  })
  
  const registerErrors = ref({
    name: '', phone: '', dob: '',
    password: '', confirmPassword: '', agreed: ''
  })
  
  const goToStep2 = () => {
    registerErrors.value = { name: '', phone: '', dob: '', password: '', confirmPassword: '', agreed: '' }
    let valid = true
  
    if (!registerForm.value.name.trim()) {
      registerErrors.value.name = 'Full name is required'; valid = false
    }
    if (!registerForm.value.phone) {
      registerErrors.value.phone = 'Phone number is required'; valid = false
    }
    if (!registerForm.value.dob) {
      registerErrors.value.dob = 'Date of birth is required'; valid = false
    } else {
      const age = Math.floor((Date.now() - new Date(registerForm.value.dob)) / 3.156e10)
      if (age < 18) { registerErrors.value.dob = 'Must be 18 years or older'; valid = false }
    }
  
    if (valid) currentStep.value = 2
  }
  
  const handleRegister = async () => {
    let valid = true
  
    if (!registerForm.value.password || registerForm.value.password.length < 8) {
      registerErrors.value.password = 'Password must be at least 8 characters'; valid = false
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      registerErrors.value.confirmPassword = 'Passwords do not match'; valid = false
    }
    if (!registerForm.value.agreed) {
      registerErrors.value.agreed = 'You must agree to the terms'; valid = false
    }
    if (!valid) return
  
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 1800))
      localStorage.setItem('sunbet_token', 'fake_token')
      router.push('/')
    } finally {
      loading.value = false
    }
  }
  
  // ---- Password strength ----
  const passwordStrength = computed(() => {
    const p = registerForm.value.password
    let score = 0
    if (p.length >= 8)          score++
    if (/[A-Z]/.test(p))        score++
    if (/[0-9]/.test(p))        score++
    if (/[^A-Za-z0-9]/.test(p)) score++
  
    const map = {
      0: { label: 'Too weak',   color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
      1: { label: 'Weak',       color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
      2: { label: 'Fair',       color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
      3: { label: 'Good',       color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
      4: { label: 'Strong 💪',  color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
    }
    return { score, ...map[score] }
  })
  
  const clearErrors = () => {
    loginErrors.value    = { phone: '', password: '' }
    registerErrors.value = { name: '', phone: '', dob: '', password: '', confirmPassword: '', agreed: '' }
  }
  </script>
  
  <style scoped>
  .form-enter-active, .form-leave-active {
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