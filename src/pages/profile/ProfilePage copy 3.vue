<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#141414]">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- Profile Header Card - Enhanced -->
      <div class="relative overflow-hidden bg-gradient-to-br from-[#1A0A0A] via-[#2A0A0A] to-[#1A0A0A] rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl border border-[#3A1A1A]/50">
        <!-- Decorative Elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-600/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full blur-2xl"></div>
        
        <div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar with Premium Ring -->
          <div class="relative group">
            <div class="relative">
              <div class="w-24 h-24  rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 p-[2px] shadow-2xl shadow-rose-500/20">
                <div class="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white">
                  {{ userInitials }}
                </div>
              </div>
              <!-- Status Indicator -->
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0A0A] shadow-lg shadow-green-500/20"></div>
            </div>
            <button
              class="absolute -bottom-1 -right-1 p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full border-2 border-[#0A0A0A] hover:from-rose-400 hover:to-rose-500 transition-all duration-200 shadow-lg shadow-rose-500/20 hover:scale-110"
              @click="handleEditAvatar"
            >
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>

          <!-- User Info with Better Spacing -->
          <div class="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{{ displayName }}</h1>
              <p class="text-rose-400/70 text-sm mt-1 font-mono">{{ user?.phone_number || 'No phone number' }}</p>
            </div>
            
            <div class="flex flex-row w-full justify-between gap03">
                <RouterLink
              to="/deposite"
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center ">
                
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Deposit</span>
              </div>
              
            </RouterLink>

            <RouterLink
              to="/withdraw"
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center gap-3">
                
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Withdraw</span>
              </div>
            
            </RouterLink>
            </div>

          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <button class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid - With Icons -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-500/30 hover:bg-[#1F1F1F] transition-all duration-300">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <p class="text-2xl font-bold text-white">{{ stats.balance.toLocaleString() }}</p>
          </div>
          <p class="text-xs text-[#606060] font-medium">Balance</p>
        </div>
        
        <div class="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-500/30 hover:bg-[#1F1F1F] transition-all duration-300">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
            </svg>
            <p class="text-2xl font-bold text-white">{{ stats.bets }}</p>
          </div>
          <p class="text-xs text-[#606060] font-medium">Total Bets</p>
        </div>
        
        <div class="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-500/30 hover:bg-[#1F1F1F] transition-all duration-300">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p class="text-2xl font-bold text-green-400">{{ stats.wins }}</p>
          </div>
          <p class="text-xs text-[#606060] font-medium">Wins</p>
        </div>
        
        <div class="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-rose-500/30 hover:bg-[#1F1F1F] transition-all duration-300">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg class="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p class="text-2xl font-bold text-rose-400">{{ stats.winRate }}%</p>
          </div>
          <p class="text-xs text-[#606060] font-medium">Win Rate</p>
        </div>
      </div>

      <!-- Profile Details - Enhanced -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#3A2A2A] transition-all duration-300">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Personal Information
          </h2>
          
          <div class="space-y-1">
            <!-- Username -->
            <div class="flex flex-col sm:flex-row sm:items-center py-3 px-2 hover:bg-[#202020] rounded-lg transition-colors group">
              <span class="text-sm text-[#606060] w-32 font-medium">Username</span>
              <span class="text-white text-sm flex-1">{{ displayName }}</span>
              <button 
                class="text-rose-400 text-xs hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100"
                @click="openEditModal('username')"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
            </div>
            
            <!-- Phone Number -->
            <div class="flex flex-col sm:flex-row sm:items-center py-3 px-2 hover:bg-[#202020] rounded-lg transition-colors group">
              <span class="text-sm text-[#606060] w-32 font-medium">Phone Number</span>
              <span class="text-white text-sm flex-1">{{ user?.phone_number || 'Not set' }}</span>
              <button 
                class="text-rose-400 text-xs hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100"
                @click="openEditModal('phone')"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
            </div>
            
            <!-- Email -->
            <div class="flex flex-col sm:flex-row sm:items-center py-3 px-2 hover:bg-[#202020] rounded-lg transition-colors">
              <span class="text-sm text-[#606060] w-32 font-medium">Email</span>
              <span class="text-white text-sm flex-1">{{ user?.email || 'Not set' }}</span>
            </div>
            
            <!-- Password -->
            <div class="flex flex-col sm:flex-row sm:items-center py-3 px-2 hover:bg-[#202020] rounded-lg transition-colors group">
              <span class="text-sm text-[#606060] w-32 font-medium">Password</span>
              <span class="text-white text-sm flex-1">••••••••</span>
              <button 
                class="text-rose-400 text-xs hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100"
                @click="openEditModal('password')"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
            </div>
            
            <!-- Role -->
            <div class="flex flex-col sm:flex-row sm:items-center py-3 px-2">
              <span class="text-sm text-[#606060] w-32 font-medium">Role</span>
              <span class="text-white text-sm flex-1">{{ user?.role || 'User' }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions - Enhanced -->
        <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#3A2A2A] transition-all duration-300">
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
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Deposit</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/withdraw"
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Withdraw</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/bets"
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="2"/>
                    <path d="M9 12h6M9 16h4"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">My Bets</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>

            <RouterLink
              to="/settings"
              class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl hover:from-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
                <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Settings</span>
              </div>
              <svg class="w-4 h-4 text-[#606060] group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Logout Button - Enhanced -->
      <button
        class="w-full mt-6 py-4 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-800/20 rounded-xl text-red-400 font-semibold hover:from-red-900/40 hover:to-red-800/20 hover:text-red-300 hover:border-red-800/40 transition-all duration-300 flex items-center justify-center gap-3 text-base group"
        @click="handleLogout"
      >
        <svg class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>

      <!-- Edit Modal - Enhanced -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-rose-500/5 animate-fadeIn">
          <!-- Decorative Accent -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          
          <button
            class="absolute top-4 right-4 text-[#606060] hover:text-white transition-colors hover:rotate-90 duration-200"
            @click="closeModal"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <h3 class="text-xl font-bold text-white mb-2">{{ modalTitle }}</h3>
          <p class="text-sm text-[#606060] mb-6">{{ modalDescription }}</p>

          <form @submit.prevent="handleUpdate">
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-[#606060] mb-1.5 font-medium">{{ modalLabel }}</label>
                <input
                  v-model="editValue"
                  :type="modalType === 'password' ? 'password' : 'text'"
                  :placeholder="modalPlaceholder"
                  class="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  required
                />
              </div>

              <!-- Confirm Password (for password change) -->
              <div v-if="modalType === 'password'">
                <label class="block text-xs text-[#606060] mb-1.5 font-medium">Confirm Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
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
const modalType = ref('') // 'username', 'phone', 'password'
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
  winRate: 57
})

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update local user data
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
      // Password updated
      console.log('Password updated')
    }
    
    closeModal()
    // Show success message or refresh
  } catch (error) {
    errorMessage.value = error.message || 'Update failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ---- Other Methods ----
const handleEditAvatar = () => {
  console.log('Edit avatar clicked')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// ---- Load Data ----
const loadUserData = async () => {
  try {
    // Load user stats from API
    // stats.value = await getUserStats()
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

loadUserData()
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

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>