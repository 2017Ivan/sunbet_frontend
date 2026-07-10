<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-10">
      <!-- ══ HEADER SECTION ══ -->
<div class="relative overflow-hidden">
  <!-- Background layers -->
  <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_50%,rgba(244,63,94,0.08),transparent_60%)]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_80%,rgba(244,63,94,0.04),transparent_50%)]"></div>
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent"></div>
  <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/10 to-transparent"></div>

  <div class="relative max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
    
    <!-- Welcome Section -->
   
  
    <!-- Balance Card -->
    <div class="w-full max-w-3xl">
      <div class="relative bg-gray-800/20 backdrop-blur-sm  p-6  transition-all duration-300 group">
        <!-- Glow effect -->
        <div class="absolute -inset-0.5 bg-gradient-to-r from-rose-400/0 via-rose-400/5 to-rose-400/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Content -->
        <div class="relative">
          <!-- Balance Header -->
          <div class="flex items-center justify-center mb-3">
            <div class="flex items-center gap-2">
              <p class="text-xs font-bold text-gray-300 uppercase tracking-widest">Account Balance</p>
            </div>
           
          </div>

          <!-- Balance Amount -->
          <div class="flex items-center justify-center gap-2 mb-2">
            <p class="font-mono font-black text-sm text-rose-400 [text-shadow:0_0_30px_rgba(244,63,94,0.2)] tracking-tight">
              {{ formattedBalance }}
            </p>
          </div>
            <!-- Phone Number -->
          <div class="my-4 pt-4 border-t border-gray-700/50 flex items-center justify-center gap-2">
            <!-- <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg> -->
            <p class="text-sm font-mono text-gray-400 font-medium tracking-wide">
              +{{ user.phone_number }}
            </p>
            <span class="px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">verified</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <RouterLink to="/deposite"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-rose-400/10 border border-rose-400/30 text-rose-400 hover:bg-rose-400/20 hover:border-rose-400/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] transition-all duration-300 group">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              Deposit
            </RouterLink>
            <RouterLink to="/withdraw"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-gray-700/30 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-300 group">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Withdraw
            </RouterLink>
          </div>

        
        </div>
      </div>
    </div>

  </div>
</div>

    <!-- ══ MAIN BODY ══ -->
    <div class="max-w-4xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">

      <!-- ── LEFT SIDEBAR ── -->
      <div class="space-y-4">

       

        <!-- Quick Links -->
        <div class="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 pt-3 pb-2">Shortcuts</p>

          <RouterLink v-for="link in quickLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-3 px-4 py-3 border-t border-gray-700 text-gray-400 text-xs font-semibold hover:bg-gray-700 hover:text-white transition-all">
            <span class="text-base w-5 text-center">{{ link.icon }}</span>
            <span class="flex-1">{{ link.label }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-30"><path d="M9 18l6-6-6-6"/></svg>
          </RouterLink>

          <button @click="logoutModal = true"
            class="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-700 text-red-400 text-xs font-semibold hover:bg-red-500/5 transition-all">
            <span class="text-base w-5 text-center">🚪</span>
            <span class="flex-1 text-left">Logout</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-30"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- ── RIGHT CONTENT ── -->
      <div class="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">

        <!-- Tabs -->
        <div class="flex border-b border-gray-700">
          <button v-for="tab in tabs" :key="tab.id"
            class="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-bold border-b-2 transition-all"
            :class="activeTab === tab.id
              ? 'text-rose-400 border-rose-400'
              : 'text-gray-500 border-transparent hover:text-gray-300'"
            @click="activeTab = tab.id">
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- ── OVERVIEW TAB ── -->
        <div v-if="activeTab === 'overview'" class="p-5 space-y-5">

          <!-- Stat Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="s in statCards" :key="s.label"
              class="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-400/20 transition-colors">
              <div class="text-xl mb-1">{{ s.icon }}</div>
              <div class="font-mono font-black text-sm mb-0.5" :class="s.color || 'text-white'">{{ s.value }}</div>
              <div class="text-[10px] text-gray-500 uppercase tracking-wide">{{ s.label }}</div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Recent Activity</p>
            <div class="space-y-2">
              <div v-for="act in recentActivity" :key="act.title"
                class="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="act.iconBg">
                  <span class="text-sm">{{ act.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-white truncate">{{ act.title }}</p>
                  <p class="text-[10px] text-gray-500 mt-0.5">{{ act.time }}</p>
                </div>
                <span class="font-mono text-xs font-black flex-shrink-0" :class="act.amountColor">{{ act.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── SETTINGS TAB ── -->
        <div v-if="activeTab === 'settings'" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">📱 Phone Number</label>
            <input
              v-model="profileForm.phone_number"
              type="tel"
              placeholder="+255 7XX XXX XXX"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
              readonly
            />
            <p class="text-[10px] text-gray-500 mt-1">Phone number cannot be changed</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">✉️ Email (Optional)</label>
            <input
              v-model="profileForm.email"
              type="email"
              placeholder="example@email.com"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">👤 Display Name</label>
            <input
              v-model="profileForm.display_name"
              placeholder="Your name"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">🌍 Timezone</label>
            <select v-model="profileForm.timezone"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all">
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition-all"
              @click="resetProfileForm">Cancel</button>
            <button class="flex-1 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-rose-500 to-rose-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              :disabled="updatingProfile" @click="updateProfile">
              {{ updatingProfile ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>

        <!-- ── SECURITY TAB ── -->
        <div v-if="activeTab === 'security'" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">🔑 Current Password</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">🔒 New Password</label>
            <input
              v-model="passwordForm.new_password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
            />
            <p class="text-[10px] text-gray-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-rose-400 mb-1.5 tracking-wide">🔒 Confirm New Password</label>
            <input
              v-model="passwordForm.confirm_password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-gray-900/60 border border-gray-700 text-gray-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
              :class="{ 'border-red-500': passwordError }"
            />
            <p v-if="passwordError" class="text-[10px] text-red-400 mt-1">{{ passwordError }}</p>
          </div>

          <button class="w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-rose-500 to-rose-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            :disabled="updatingPassword" @click="changeUserPassword">
            {{ updatingPassword ? 'Changing...' : 'Change Password' }}
          </button>

          <!-- Active Sessions -->
          <div class="pt-2 border-t border-gray-700">
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Sessions</p>
            <div class="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-xl">
              <span class="text-2xl">💻</span>
              <div class="flex-1">
                <p class="text-xs font-semibold text-white">This Device (Current)</p>
                <p class="text-[10px] text-gray-500 mt-0.5">Chrome · Windows</p>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ LOGOUT MODAL ══ -->
    <div v-if="logoutModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="logoutModal = false"></div>
      <div class="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
            <span class="text-3xl">🚪</span>
          </div>
          <h3 class="text-xl font-bold text-white">Logout</h3>
          <p class="text-sm text-gray-400 mt-1">Are you sure you want to logout?</p>
        </div>
        <div class="flex gap-3">
          <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition-all"
            @click="logoutModal = false">Cancel</button>
          <button class="flex-1 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-red-700 to-red-500 text-white hover:opacity-90 transition-opacity"
            @click="confirmLogout">Logout</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

// ---- State ----
const activeTab = ref('overview')
const logoutModal = ref(false)
const updatingProfile = ref(false)
const updatingPassword = ref(false)
const passwordError = ref('')
const loading = ref(true)

// ---- User Data from Store ----
const user = computed(() => authStore.user)
const isLoggedIn = computed(() => authStore.isLoggedIn)

// 👇 USE formattedBalance GETTER FROM STORE
const formattedBalance = computed(() => authStore.formattedBalance)

// ---- Display Name ----
const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.username) return user.value.username
  if (user.value?.phone_number) {
    const phone = user.value.phone_number
    if (phone.startsWith('255')) {
      return '0' + phone.substring(3)
    }
    return phone
  }
  return 'User'
})

// ---- User Initials ----
const userInitials = computed(() => {
  if (!displayName.value || displayName.value === 'User') return 'U'
  const names = displayName.value.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return displayName.value.substring(0, 2).toUpperCase()
})

// ---- Member Since ----
const memberSince = computed(() => {
  if (!user.value?.created_at) return 'N/A'
  const date = new Date(user.value.created_at)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})


const lastLogin = computed(() => {
  // Kama una last_login kutoka kwa user
  if (user.value?.last_login) {
    const date = new Date(user.value.last_login)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  
  // Kama hakuna last_login, tumia created_at au current date
  if (user.value?.created_at) {
    const date = new Date(user.value.created_at)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  
  // Default - tumia mwezi na mwaka wa sasa
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})


// ---- Stats ----
const stats = ref({
  balance: 0,
  bets: 0,
  wins: 0,
  winRate: 0,
  streak: 0,
  points: 0
})

// ---- Tabs ----
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'security', label: 'Security', icon: '🔒' },
]

// ---- Quick Links ----
const quickLinks = computed(() => {
  const links = [
    { to: '/bets', icon: '📋', label: 'My Bets' },
    { to: '/transactions', icon: '💳', label: 'Transactions' },
    { to: '/promotions', icon: '🎁', label: 'Promotions' },
  ]
  if (user.value?.role === 'ADMIN') {
    links.push({ to: '/admin', icon: '🛠️', label: 'Admin Panel' })
  }
  return links
})

// ---- Stat Cards ----
const statCards = computed(() => [
  { icon: '🎯', value: stats.value.bets, label: 'Total Bets', color: 'text-white' },
  { icon: '✅', value: `${stats.value.winRate}%`, label: 'Win Rate', color: 'text-emerald-400' },
  { icon: '⚽', value: 'EPL', label: 'Top League', color: 'text-white' },
  { icon: '🔥', value: stats.value.streak, label: 'Win Streak', color: 'text-rose-400' },
])

// ---- Recent Activity ----
const recentActivity = [
  { icon: '⬇️', iconBg: 'bg-emerald-500/10', title: 'Deposit', time: '2 hours ago', amount: '+TZS 50,000', amountColor: 'text-emerald-400' },
  { icon: '🎯', iconBg: 'bg-rose-500/10', title: 'Bet placed on Match #1234', time: '4 hours ago', amount: '-TZS 10,000', amountColor: 'text-red-400' },
  { icon: '⭐', iconBg: 'bg-emerald-500/10', title: 'Won bet on Match #5678', time: '6 hours ago', amount: '+TZS 25,000', amountColor: 'text-emerald-400' },
]

// ---- Forms ----
const profileForm = ref({
  phone_number: '',
  email: '',
  display_name: '',
  timezone: 'Africa/Dar_es_Salaam',
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

// ---- Methods ----
function initializeFormData() {
  if (user.value) {
    profileForm.value.phone_number = user.value.phone_number || ''
    profileForm.value.email = user.value.email || ''
    profileForm.value.display_name = user.value.display_name || displayName.value
  }
}

async function updateProfile() {
  updatingProfile.value = true
  try {
    console.log('Updating profile:', profileForm.value)
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Update profile error:', error)
    alert('Failed to update profile')
  } finally {
    updatingProfile.value = false
  }
}

async function changeUserPassword() {
  passwordError.value = ''
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    passwordError.value = 'Passwords do not match'
    return
  }
  if (passwordForm.value.new_password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }
  if (!passwordForm.value.current_password) {
    passwordError.value = 'Current password is required'
    return
  }
  
  updatingPassword.value = true
  try {
    console.log('Changing password...')
    alert('Password changed successfully!')
    passwordForm.value = { current_password: '', new_password: '', confirm_password: '' }
  } catch (error) {
    console.error('Change password error:', error)
    passwordError.value = error.message || 'Failed to change password'
  } finally {
    updatingPassword.value = false
  }
}

function resetProfileForm() {
  initializeFormData()
}

async function confirmLogout() {
  logoutModal.value = false
  await authStore.logout()
  router.push('/login')
}

// ---- Load user data ----
async function loadUserData() {
  loading.value = true
  try {
    await authStore.fetchUserProfile()
    await authStore.fetchUserBalance()
    
    stats.value.balance = authStore.userBalance
    
    initializeFormData()
  } catch (error) {
    console.error('Error loading user data:', error)
  } finally {
    loading.value = false
  }
}

// ---- Check auth on mount ----
onMounted(() => {
  console.log('🔍 Profile page mounted')
  console.log('📊 Auth state:', {
    isLoggedIn: isLoggedIn.value,
    user: user.value,
    formattedBalance: formattedBalance.value
  })
  
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  loadUserData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #f43f5e;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>