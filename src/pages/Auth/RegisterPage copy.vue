<!-- pages/Auth/Register.vue -->
<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-white">Create account 🎯</h2>
      <p class="text-sm text-[#606060] mt-1">Join 2M+ bettors on SunBet</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <AppInput
        v-model="form.phone"
        label="Phone Number"
        placeholder="Enter 9 digit number"
        type="tel"
        required
        :phone="true"
        hint="Enter 9 digits without 0 or 255 (e.g., 798764567)"
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
        placeholder="Min 4 characters"
        type="password"
        required
        :error="errors.password"
      >
        <template #icon-left>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </template>
      </AppInput>

      <div v-if="form.password" class="space-y-1.5">
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
          :class="form.agreed
            ? 'bg-[#A32D2D] border-[#A32D2D]'
            : 'border-[#333] group-hover:border-[#A32D2D]/50'"
          @click="form.agreed = !form.agreed"
        >
          <svg v-if="form.agreed" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-xs text-[#606060] leading-relaxed">
          I confirm I am 18+ years old and agree to the
          <a href="#" class="text-[#A32D2D] hover:underline">Terms</a> &
          <a href="#" class="text-[#A32D2D] hover:underline">Privacy Policy</a>
        </span>
      </label>
      <p v-if="errors.agreed" class="text-xs text-[#EF4444] -mt-2">{{ errors.agreed }}</p>

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
      <router-link to="/login" class="text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
        Login here
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const registerError = ref('')

// ---- Form ----
const form = ref({
  phone: '',
  password: '',
  agreed: false,
})
const errors = ref({ phone: '', password: '', agreed: '' })

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

// ---- HANDLE REGISTER ----
const handleRegister = async () => {
  errors.value = { phone: '', password: '', agreed: '' }
  registerError.value = ''
  let valid = true

  console.log('🔄 Starting register process...')
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

  // Validate agreement
  if (!form.value.agreed) {
    errors.value.agreed = 'You must agree to the terms and conditions'
    valid = false
  }

  if (!valid) return

  loading.value = true

  try {
    const result = await authStore.register(
      form.value.phone,
      form.value.password
    )

    console.log('📨 Register result:', result)

    if (result.success) {
      console.log('✅ Registration successful!')
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      registerError.value = result.message || 'Registration failed. Please try again.'
      
      if (result.message?.toLowerCase().includes('phone') || 
          result.message?.toLowerCase().includes('exists') ||
          result.message?.toLowerCase().includes('number')) {
        errors.value.phone = result.message
      } else if (result.message?.toLowerCase().includes('password')) {
        errors.value.password = result.message
      }
    }
  } catch (error) {
    console.error('❌ Register error:', error)
    registerError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// ---- Password Strength ----
const passwordStrength = computed(() => {
  const p = form.value.password
  let score = 0
  if (p.length >= 4) score++
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
</script>