<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      <!-- Profile Header - Modern Gaming Style -->
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl border border-gray-700">
        <!-- Decorative Gaming Elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-2xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-rose-500/5 rounded-full blur-2xl"></div>
        
        <div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar with Gaming Badge -->
          <div class="relative group">
            <div class="relative">
              <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 p-[3px] shadow-2xl shadow-rose-500/30 animate-pulse-glow">
                <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white">
                  {{ userInitials }}
                </div>
              </div>
              <!-- Online Status -->
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg shadow-green-500/30 animate-pulse"></div>
            </div>
            <button
              class="absolute -bottom-1 -right-1 p-2 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full border-2 border-gray-900 hover:scale-110 transition-all duration-200 shadow-lg shadow-rose-500/30"
              @click="handleEditAvatar"
            >
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>

          <!-- User Info with Level & Rank -->
          <div class="flex-1 text-center sm:text-left space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{{ displayName }}</h1>
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Level {{ userLevel }}
              </span>
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-semibold">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                {{ user?.role || 'Player' }}
              </span>
            </div>
            
            <p class="text-gray-400 text-sm font-mono">{{ user?.phone_number || 'No phone number' }}</p>
            
            <!-- XP Progress Bar -->
            <div class="max-w-md">
              <div class="flex justify-between text-xs text-gray-400 mb-1">
                <span>XP Progress</span>
                <span>{{ xpProgress }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-1000" :style="{ width: xpProgress + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Quick Stats in Header -->
          <div class="grid grid-cols-2 gap-2 sm:flex sm:gap-3 mt-4 sm:mt-0">
            <div class="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-center">
              <p class="text-xs text-gray-400">Balance</p>
              <p class="text-sm font-bold text-rose-400">TSh {{ stats.balance.toLocaleString() }}</p>
            </div>
            <div class="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-center">
              <p class="text-xs text-gray-400">Bets</p>
              <p class="text-sm font-bold text-white">{{ stats.bets }}</p>
            </div>
            <div class="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-center">
              <p class="text-xs text-gray-400">Wins</p>
              <p class="text-sm font-bold text-green-400">{{ stats.wins }}</p>
            </div>
            <div class="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-center">
              <p class="text-xs text-gray-400">Win Rate</p>
              <p class="text-sm font-bold text-amber-400">{{ stats.winRate }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gaming Stats Grid - Enhanced -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-rose-400">{{ stats.balance.toLocaleString() }}</p>
          <p class="text-xs text-gray-400 font-medium">Balance</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-blue-400">{{ stats.bets }}</p>
          <p class="text-xs text-gray-400 font-medium">Total Bets</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-green-400">{{ stats.wins }}</p>
          <p class="text-xs text-gray-400 font-medium">Wins</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-amber-400">{{ stats.winRate }}%</p>
          <p class="text-xs text-gray-400 font-medium">Win Rate</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-purple-400">{{ stats.streak }}</p>
          <p class="text-xs text-gray-400 font-medium">Win Streak</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300">
          <p class="text-lg font-bold text-cyan-400">{{ stats.rank }}</p>
          <p class="text-xs text-gray-400 font-medium">Rank</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Personal Info & Quick Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information Card -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Personal Information
              </h2>
              <button class="text-xs text-rose-400 hover:text-rose-300 transition-colors">Edit Profile</button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Username</p>
                <p class="text-white text-sm font-medium">{{ displayName }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Phone Number</p>
                <p class="text-white text-sm font-medium">{{ user?.phone_number || 'Not set' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Email</p>
                <p class="text-white text-sm font-medium">{{ user?.email || 'Not set' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Member Since</p>
                <p class="text-white text-sm font-medium">{{ memberSince }}</p>
              </div>
            </div>
          </div>

          <!-- Gaming Achievements -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Achievements
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="text-center p-3 bg-gray-900 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all">
                <div class="text-2xl mb-1">🏆</div>
                <p class="text-xs text-gray-400">Tournaments</p>
                <p class="text-sm font-bold text-white">{{ stats.tournaments }}</p>
              </div>
              <div class="text-center p-3 bg-gray-900 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all">
                <div class="text-2xl mb-1">🎯</div>
                <p class="text-xs text-gray-400">Accuracy</p>
                <p class="text-sm font-bold text-white">{{ stats.accuracy }}%</p>
              </div>
              <div class="text-center p-3 bg-gray-900 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all">
                <div class="text-2xl mb-1">🔥</div>
                <p class="text-xs text-gray-400">Current Streak</p>
                <p class="text-sm font-bold text-amber-400">{{ stats.streak }}</p>
              </div>
              <div class="text-center p-3 bg-gray-900 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all">
                <div class="text-2xl mb-1">⭐</div>
                <p class="text-xs text-gray-400">Points</p>
                <p class="text-sm font-bold text-rose-400">{{ stats.points.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Menu -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Quick Actions
            </h2>
            
            <div class="space-y-2">
              <RouterLink
                to="/deposite"
                class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Deposit</span>
                </div>
                <svg class="w-4 h-4 text-gray-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </RouterLink>

              <RouterLink
                to="/withdraw"
                class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium group-hover:text-rose-300 transition-colors">Withdraw</span>
                </div>
                <svg class="w-4 h-4 text-gray-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </RouterLink>

              <RouterLink
                to="/bets"
                class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="2"/>
                      <path d="M9 12h6M9 16h4"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium group-hover:text-blue-300 transition-colors">My Bets</span>
                </div>
                <svg class="w-4 h-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </RouterLink>

              <RouterLink
                to="/history"
                class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium group-hover:text-purple-300 transition-colors">History</span>
                </div>
                <svg class="w-4 h-4 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </RouterLink>

              <RouterLink
                to="/settings"
                class="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500/30 hover:bg-gray-750 transition-all duration-300 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium group-hover:text-gray-300 transition-colors">Settings</span>
                </div>
                <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- VIP Status / Promo -->
          <div class="bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">👑</span>
              <h3 class="text-white font-semibold">VIP Status</h3>
            </div>
            <p class="text-gray-400 text-sm">You're {{ vipProgress }}% away from reaching VIP level</p>
            <div class="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-1000" :style="{ width: vipProgress + '%' }"></div>
            </div>
            <button class="mt-3 text-xs text-rose-400 hover:text-rose-300 transition-colors">Learn More →</button>
          </div>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        class="w-full mt-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 font-semibold hover:bg-gray-750 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 flex items-center justify-center gap-3 text-base group"
        @click="handleLogout"
      >
        <svg class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>

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
  rank: '#2,345',
  tournaments: 12,
  accuracy: 73,
  points: 4850
})

// ---- XP & VIP ----
const userLevel = ref(42)
const xpProgress = ref(73)
const vipProgress = ref(68)

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
const handleEditAvatar = () => {
  console.log('Edit avatar clicked')
}

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

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(244, 63, 94, 0.5);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
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