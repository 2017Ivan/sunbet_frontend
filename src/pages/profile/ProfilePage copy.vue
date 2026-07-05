<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      
      <!-- Profile Header Card -->
      <div class="bg-gradient-to-r from-rose-900 to-rose-950 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-rose-800/30">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-4xl font-bold text-white shadow-lg ring-4 ring-rose-500/30">
              {{ userInitials }}
            </div>
            <button 
              class="absolute bottom-0 right-0 p-1.5 bg-rose-600 rounded-full border-2 border-[#0D0D0D] hover:bg-rose-500 transition-colors"
              @click="handleEditAvatar"
            >
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ user?.name || 'User' }}</h1>
            <p class="text-rose-300 text-sm mt-1">{{ user?.phone_number || user?.email || 'No phone number' }}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-800/40 rounded-full text-rose-200 text-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {{ user?.role || 'User' }}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-800/40 rounded-full text-rose-200 text-xs">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Member since {{ memberSince }}
              </span>
            </div>
          </div>

          <!-- Edit Profile Button -->
          <button 
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 flex items-center gap-2 text-sm"
            @click="handleEditProfile"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-600/30 transition-all">
          <p class="text-2xl font-bold text-white">{{ stats.balance }}</p>
          <p class="text-xs text-[#606060] mt-1">Balance</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-600/30 transition-all">
          <p class="text-2xl font-bold text-white">{{ stats.bets }}</p>
          <p class="text-xs text-[#606060] mt-1">Total Bets</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-600/30 transition-all">
          <p class="text-2xl font-bold text-green-400">{{ stats.wins }}</p>
          <p class="text-xs text-[#606060] mt-1">Wins</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-600/30 transition-all">
          <p class="text-2xl font-bold text-rose-400">{{ stats.winRate }}%</p>
          <p class="text-xs text-[#606060] mt-1">Win Rate</p>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Personal Information
          </h2>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#2A2A2A]">
              <span class="text-sm text-[#606060] w-32">Full Name</span>
              <span class="text-white text-sm">{{ user?.name || 'Not set' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#2A2A2A]">
              <span class="text-sm text-[#606060] w-32">Phone Number</span>
              <span class="text-white text-sm">{{ user?.phone_number || 'Not set' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#2A2A2A]">
              <span class="text-sm text-[#606060] w-32">Email</span>
              <span class="text-white text-sm">{{ user?.email || 'Not set' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#2A2A2A]">
              <span class="text-sm text-[#606060] w-32">Role</span>
              <span class="text-white text-sm">{{ user?.role || 'User' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center py-2">
              <span class="text-sm text-[#606060] w-32">Member Since</span>
              <span class="text-white text-sm">{{ memberSince }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Quick Actions
          </h2>
          
          <div class="space-y-3">
            <RouterLink
              to="/deposite"
              class="flex items-center justify-between p-3 bg-rose-900/20 border border-rose-800/30 rounded-xl hover:bg-rose-900/40 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Deposit</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/withdraw"
              class="flex items-center justify-between p-3 bg-rose-900/20 border border-rose-800/30 rounded-xl hover:bg-rose-900/40 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Withdraw</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/bets"
              class="flex items-center justify-between p-3 bg-rose-900/20 border border-rose-800/30 rounded-xl hover:bg-rose-900/40 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="2"/>
                    <path d="M9 12h6M9 16h4"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">My Bets</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/settings"
              class="flex items-center justify-between p-3 bg-rose-900/20 border border-rose-800/30 rounded-xl hover:bg-rose-900/40 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Settings</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <button
              class="w-full flex items-center justify-between p-3 bg-red-900/20 border border-red-800/30 rounded-xl hover:bg-red-900/40 transition-colors group"
              @click="handleLogout"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-red-600/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </div>
                <span class="text-red-400 font-medium group-hover:text-red-300 transition-colors">Logout</span>
              </div>
              <svg class="w-4 h-4 text-red-400/50 group-hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Recent Activity
        </h2>
        
        <div v-if="recentActivities.length === 0" class="text-center py-8">
          <p class="text-[#606060] text-sm">No recent activity</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center">
                <component :is="activity.icon" class="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <p class="text-white text-sm">{{ activity.description }}</p>
                <p class="text-[#606060] text-xs">{{ activity.time }}</p>
              </div>
            </div>
            <span class="text-sm" :class="activity.amount > 0 ? 'text-green-400' : 'text-red-400'">
              {{ activity.amount > 0 ? '+' : '' }}{{ activity.amount }}
            </span>
          </div>
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

// User data
const user = computed(() => authStore.user)

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  const names = user.value.name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return user.value.name.substring(0, 2).toUpperCase()
})

// Member since
const memberSince = computed(() => {
  if (!user.value?.createdAt) return 'N/A'
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Stats
const stats = ref({
  balance: 0,
  bets: 0,
  wins: 0,
  winRate: 0
})

// Recent activities
const recentActivities = ref([])

// Methods
const handleEditProfile = () => {
  router.push('/profile/edit')
}

const handleEditAvatar = () => {
  // Open avatar upload dialog
  console.log('Edit avatar clicked')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Load user data
const loadUserData = async () => {
  try {
    // Load user stats from API
    // stats.value = await getUserStats()
    // recentActivities.value = await getRecentActivities()
    
    // Demo data
    stats.value = {
      balance: 2450000,
      bets: 156,
      wins: 89,
      winRate: 57
    }
    
    recentActivities.value = [
      {
        id: 1,
        description: 'Won bet vs Liverpool',
        time: '2 hours ago',
        amount: 5000,
        icon: 'WonIcon'
      },
      {
        id: 2,
        description: 'Deposit via M-PESA',
        time: '5 hours ago',
        amount: 10000,
        icon: 'DepositIcon'
      },
      {
        id: 3,
        description: 'Bet placed on Man United vs Arsenal',
        time: '1 day ago',
        amount: -2500,
        icon: 'BetIcon'
      }
    ]
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

// Load data on mount
loadUserData()
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
}
</style>