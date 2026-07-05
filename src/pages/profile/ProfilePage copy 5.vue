<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- === TOP SECTION: Cover + Profile === -->
      <div class="relative">
        <!-- Cover Image Area -->
        <div class="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden border border-gray-700">
          <div class="absolute inset-0 bg-gradient-to-r from-rose-600/30 to-amber-600/30"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          
          <!-- Cover Stats Overlay -->
          <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-900 shadow-2xl shadow-rose-500/20 overflow-hidden">
                <div class="w-full h-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-3xl font-bold text-white">
                  {{ userInitials }}
                </div>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-white">{{ displayName }}</h1>
                <p class="text-gray-400 text-sm">{{ user?.phone_number || 'No phone' }}</p>
              </div>
            </div>
            <button class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-rose-500/30 transition-all">
              Edit Cover
            </button>
          </div>
        </div>
        
        <!-- Online Status Badge -->
        <div class="absolute top-4 right-4 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-xs text-gray-300">Online</span>
        </div>
      </div>

      <!-- === GAMING DASHBOARD STATS === -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <div class="flex items-center justify-center gap-1">
            <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <p class="text-sm font-bold text-rose-400">{{ stats.balance.toLocaleString() }}</p>
          </div>
          <p class="text-[10px] text-gray-500 font-medium">Balance</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <p class="text-sm font-bold text-blue-400">{{ stats.bets }}</p>
          <p class="text-[10px] text-gray-500 font-medium">Total Bets</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <p class="text-sm font-bold text-green-400">{{ stats.wins }}</p>
          <p class="text-[10px] text-gray-500 font-medium">Wins</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <p class="text-sm font-bold text-amber-400">{{ stats.winRate }}%</p>
          <p class="text-[10px] text-gray-500 font-medium">Win Rate</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <p class="text-sm font-bold text-purple-400">{{ stats.streak }}</p>
          <p class="text-[10px] text-gray-500 font-medium">Streak</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 transition-all">
          <div class="flex items-center justify-center gap-1">
            <span class="text-amber-400 text-sm">⭐</span>
            <p class="text-sm font-bold text-amber-400">{{ stats.points }}</p>
          </div>
          <p class="text-[10px] text-gray-500 font-medium">Points</p>
        </div>
      </div>

      <!-- === LEVEL & XP PROGRESS === -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-xl">🏆</div>
            <div>
              <p class="text-[10px] text-gray-500">Level</p>
              <p class="text-lg font-bold text-white">{{ userLevel }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-500">XP</p>
            <p class="text-sm font-bold text-amber-400">{{ currentXP }} / {{ nextLevelXP }}</p>
          </div>
        </div>
        <div class="sm:col-span-2 bg-gray-800/80 border border-gray-700 rounded-xl p-4">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Progress</span>
            <span>{{ xpProgress }}% to Level {{ userLevel + 1 }}</span>
          </div>
          <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 rounded-full transition-all duration-1000" :style="{ width: xpProgress + '%' }"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>Level {{ userLevel }}</span>
            <span class="text-rose-400">Next Level</span>
          </div>
        </div>
      </div>

      <!-- === MAIN CONTENT: 2 Columns === -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        <!-- LEFT COLUMN -->
        <div class="space-y-6">
          <!-- VIP Card -->
          <div class="bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-500/10 border border-rose-500/20 rounded-xl p-6">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl">👑</span>
                  <h3 class="text-white font-bold">VIP Membership</h3>
                </div>
                <p class="text-gray-400 text-sm">You're {{ vipProgress }}% to VIP Level</p>
                <div class="w-48 h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" :style="{ width: vipProgress + '%' }"></div>
                </div>
                <button class="mt-3 text-xs text-rose-400 hover:text-rose-300 transition-colors">Upgrade Now →</button>
              </div>
              <div class="bg-rose-500/20 border border-rose-500/30 rounded-lg px-3 py-1">
                <p class="text-rose-400 text-xs font-bold">{{ vipBenefits }} Benefits</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Recent Activity
              </h3>
              <button class="text-xs text-gray-500 hover:text-rose-400 transition-colors">View All</button>
            </div>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-3 p-2 bg-gray-900 rounded-lg border border-gray-700/50">
                <div class="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <span>{{ activity.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white truncate">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
                <span class="text-xs" :class="activity.amount > 0 ? 'text-green-400' : 'text-rose-400'">
                  {{ activity.amount > 0 ? '+' : '' }}{{ activity.amount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-6">
          <!-- Quick Actions Grid -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Quick Actions
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <RouterLink to="/deposite" class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group">
                <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-sm text-white group-hover:text-rose-300 transition-colors">Deposit</span>
              </RouterLink>

              <RouterLink to="/withdraw" class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group">
                <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-sm text-white group-hover:text-rose-300 transition-colors">Withdraw</span>
              </RouterLink>

              <RouterLink to="/bets" class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="2"/>
                    <path d="M9 12h6M9 16h4"/>
                  </svg>
                </div>
                <span class="text-sm text-white group-hover:text-blue-300 transition-colors">My Bets</span>
              </RouterLink>

              <RouterLink to="/history" class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group">
                <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span class="text-sm text-white group-hover:text-purple-300 transition-colors">History</span>
              </RouterLink>

              <RouterLink to="/settings" class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group">
                <div class="w-10 h-10 rounded-lg bg-gray-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
                <span class="text-sm text-white group-hover:text-gray-300 transition-colors">Settings</span>
              </RouterLink>

              <div class="flex flex-col items-center gap-1 p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all group cursor-pointer">
                <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-amber-400">🎯</span>
                </div>
                <span class="text-sm text-white group-hover:text-amber-300 transition-colors">Live Games</span>
              </div>
            </div>
          </div>

          <!-- Personal Info Compact -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] text-gray-500">Username</p>
                <p class="text-sm text-white font-medium truncate">{{ displayName }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500">Phone</p>
                <p class="text-sm text-white font-medium truncate">{{ user?.phone_number || 'Not set' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500">Email</p>
                <p class="text-sm text-white font-medium truncate">{{ user?.email || 'Not set' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500">Member Since</p>
                <p class="text-sm text-white font-medium truncate">{{ memberSince }}</p>
              </div>
            </div>
          </div>

          <!-- Logout Button -->
          <button
            class="w-full py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 font-medium hover:bg-gray-750 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm group"
            @click="handleLogout"
          >
            <svg class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-rose-500/5 animate-fadeIn">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors hover:rotate-90 duration-200"
            @click="closeModal"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <h3 class="text-xl font-bold text-white mb-2">{{ modalTitle }}</h3>
          <p class="text-sm text-gray-400 mb-6">{{ modalDescription }}</p>

          <form @submit.prevent="handleUpdate">
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 font-medium">{{ modalLabel }}</label>
                <input
                  v-model="editValue"
                  :type="modalType === 'password' ? 'password' : 'text'"
                  :placeholder="modalPlaceholder"
                  class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>

              <div v-if="modalType === 'password'">
                <label class="block text-xs text-gray-400 mb-1.5 font-medium">Confirm Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>

              <div v-if="errorMessage" class="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl p-3 flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

// ---- State ----
const isModalOpen = ref(false)
const modalType = ref('')
const editValue = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// ---- User Data ----
const user = computed(() => authStore.user)

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.username) return user.value.username
  if (user.value?.phone_number) return user.value.phone_number
  return 'User'
})

const userInitials = computed(() => {
  if (!displayName.value || displayName.value === 'User') return 'U'
  const names = displayName.value.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return displayName.value.substring(0, 2).toUpperCase()
})

const memberSince = computed(() => {
  if (!user.value?.createdAt) return 'N/A'
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// ---- Stats ----
const stats = ref({
  balance: 2450000,
  bets: 156,
  wins: 89,
  winRate: 57,
  streak: 5,
  points: 4850
})

// ---- Level & XP ----
const userLevel = ref(42)
const currentXP = ref(2450)
const nextLevelXP = ref(3500)
const xpProgress = ref(73)
const vipProgress = ref(68)
const vipBenefits = ref(12)

// ---- Recent Activity ----
const recentActivities = ref([
  { id: 1, icon: '🎉', title: 'Won bet on Match #1234', time: '2 min ago', amount: 2500 },
  { id: 2, icon: '💰', title: 'Deposited funds', time: '1 hour ago', amount: 10000 },
  { id: 3, icon: '📊', title: 'Placed bet on Match #5678', time: '3 hours ago', amount: -500 },
  { id: 4, icon: '🏆', title: 'Won tournament', time: '5 hours ago', amount: 15000 }
])

// ---- Modal Handlers ----
const openEditModal = (type) => {
  modalType.value = type
  editValue.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  
  if (type === 'username') {
    modalTitle.value = 'Update Username'
    modalDescription.value = 'Change your display name'
    modalLabel.value = 'New Username'
    modalPlaceholder.value = 'Enter new username'
  } else if (type === 'phone') {
    modalTitle.value = 'Update Phone Number'
    modalDescription.value = 'Change your phone number'
    modalLabel.value = 'New Phone Number'
    modalPlaceholder.value = 'Enter new phone number'
  } else if (type === 'password') {
    modalTitle.value = 'Change Password'
    modalDescription.value = 'Update your account password'
    modalLabel.value = 'New Password'
    modalPlaceholder.value = 'Enter new password'
  }
  
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editValue.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
}

const modalTitle = ref('')
const modalDescription = ref('')
const modalLabel = ref('')
const modalPlaceholder = ref('')

// ---- Update Handler ----
const handleUpdate = async () => {
  if (!editValue.value.trim()) {
    errorMessage.value = 'Please enter a value'
    return
  }

  if (modalType.value === 'password' && editValue.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (modalType.value === 'password' && editValue.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (modalType.value === 'username') {
      if (authStore.user) {
        authStore.user.name = editValue.value
        authStore.user.username = editValue.value
      }
    } else if (modalType.value === 'phone') {
      if (authStore.user) {
        authStore.user.phone_number = editValue.value
      }
    } else if (modalType.value === 'password') {
      console.log('Password updated')
    }
    
    closeModal()
  } catch (error) {
    errorMessage.value = error.message || 'Update failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ---- Other Methods ----
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
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
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #e11d48;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-gray-750 {
  background-color: #1f2937;
}
</style>