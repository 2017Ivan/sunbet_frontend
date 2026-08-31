<!-- LeaderboardPage.vue -->
<template>
  <div class="min-h-screen bg-gray-950 text-white pb-24">
    <!-- ══ HERO & HEADER SECTION ══ -->
    <div class="relative bg-gradient-to-b from-rose-950 via-rose-900 to-gray-950 pt-8 pb-16 px-4 text-center overflow-hidden">
      <!-- Background Glow Effect -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/20 blur-[120px] pointer-events-none rounded-full"></div>

      <div class="relative max-w-4xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          🏆 SunBet VIP Champions
        </span>
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Leaderboard <span class="text-rose-500">& Rewards</span>
        </h1>
        <p class="mt-2 text-gray-400 text-sm sm:text-base max-w-md mx-auto">
          Bet, climb the ranks, and earn exclusive weekly & monthly rewards.
        </p>

        <!-- Time Filter Tabs -->
        <div class="mt-6 flex justify-center">
          <div class="inline-flex p-1 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800">
            <button
              v-for="period in filterPeriods"
              :key="period.id"
              @click="activePeriod = period.id"
              class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              :class="activePeriod === period.id
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-gray-400 hover:text-white'"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 -mt-8 relative z-10 space-y-8">

      <!-- ══ TOP 3 PODIUM ══ -->
      <div v-if="topThree.length >= 3" class="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4">
        
        <!-- 🥈 2ND PLACE (Silver) -->
        <div class="flex flex-col items-center">
          <div class="relative mb-2">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 p-1 shadow-lg">
              <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center font-bold text-lg text-slate-300">
                {{ topThree[1].initials }}
              </div>
            </div>
            <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-gray-950 font-black text-xs px-2 py-0.5 rounded-full border border-gray-900">
              #2
            </span>
          </div>
          <div class="w-full bg-slate-900/80 border border-slate-700/50 rounded-t-2xl p-3 sm:p-4 text-center h-32 sm:h-40 flex flex-col justify-between">
            <div>
              <p class="font-bold text-xs sm:text-sm truncate text-slate-200">{{ topThree[1].name }}</p>
              <p class="text-[10px] sm:text-xs text-rose-400 font-semibold">{{ topThree[1].points.toLocaleString() }} pts</p>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-800/80 py-1 rounded-md">
              {{ topThree[1].reward }}
            </span>
          </div>
        </div>

        <!-- 🥇 1ST PLACE (Gold) -->
        <div class="flex flex-col items-center">
          <div class="relative mb-2">
            <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-xl shadow-amber-500/20">
              <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center font-bold text-xl text-amber-400">
                {{ topThree[0].initials }}
              </div>
            </div>
            <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-950 font-black text-xs px-2 py-0.5 rounded-full border border-gray-900">
              #1
            </span>
          </div>
          <div class="w-full bg-gradient-to-b from-amber-950/40 to-gray-900/90 border border-amber-500/30 rounded-t-2xl p-3 sm:p-4 text-center h-40 sm:h-48 flex flex-col justify-between">
            <div>
              <p class="font-bold text-sm sm:text-base truncate text-amber-200">{{ topThree[0].name }}</p>
              <p class="text-xs sm:text-sm text-amber-400 font-bold">{{ topThree[0].points.toLocaleString() }} pts</p>
            </div>
            <span class="text-[10px] sm:text-xs font-extrabold text-amber-300 bg-amber-900/50 border border-amber-500/30 py-1 rounded-md">
              {{ topThree[0].reward }}
            </span>
          </div>
        </div>

        <!-- 🥉 3RD PLACE (Bronze) -->
        <div class="flex flex-col items-center">
          <div class="relative mb-2">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 p-1 shadow-lg">
              <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center font-bold text-lg text-amber-600">
                {{ topThree[2].initials }}
              </div>
            </div>
            <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-xs px-2 py-0.5 rounded-full border border-gray-900">
              #3
            </span>
          </div>
          <div class="w-full bg-amber-950/20 border border-amber-900/30 rounded-t-2xl p-3 sm:p-4 text-center h-28 sm:h-36 flex flex-col justify-between">
            <div>
              <p class="font-bold text-xs sm:text-sm truncate text-amber-100/80">{{ topThree[2].name }}</p>
              <p class="text-[10px] sm:text-xs text-rose-400 font-semibold">{{ topThree[2].points.toLocaleString() }} pts</p>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-950/60 py-1 rounded-md">
              {{ topThree[2].reward }}
            </span>
          </div>
        </div>

      </div>

      <!-- ══ LEADERBOARD TABLE (RANKS 4+) ══ -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="px-4 py-3 bg-gray-900/50 border-b border-gray-800 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span class="w-12">Rank</span>
          <span class="flex-1">Punter</span>
          <span class="w-24 text-right">Points</span>
          <span class="w-28 text-right hidden sm:block">Reward</span>
        </div>

        <div class="divide-y divide-gray-800/50">
          <div
            v-for="user in restRankings"
            :key="user.rank"
            class="flex items-center px-4 py-3.5 hover:bg-gray-800/40 transition-colors duration-150"
            :class="{ 'bg-rose-950/20': user.isCurrentUser }"
          >
            <!-- Rank Number -->
            <span class="w-12 font-bold text-sm" :class="user.isCurrentUser ? 'text-rose-500' : 'text-gray-400'">
              #{{ user.rank }}
            </span>

            <!-- User Info -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-xs text-gray-300 flex-shrink-0">
                {{ user.initials }}
              </div>
              <div class="truncate">
                <p class="font-semibold text-xs sm:text-sm text-gray-200 truncate flex items-center gap-1.5">
                  {{ user.name }}
                  <span v-if="user.isCurrentUser" class="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">YOU</span>
                </p>
                <p class="text-[10px] text-gray-500">{{ user.phone }}</p>
              </div>
            </div>

            <!-- Points -->
            <div class="w-24 text-right">
              <span class="font-extrabold text-xs sm:text-sm text-white">{{ user.points.toLocaleString() }}</span>
              <span class="text-[10px] text-gray-500 block">PTS</span>
            </div>

            <!-- Reward Badge -->
            <div class="w-28 text-right hidden sm:block">
              <span class="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                {{ user.reward || '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ══ CURRENT USER STICKY FOOTER ══ -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-rose-900/50 px-4 py-3 shadow-2xl">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-rose-600/30">
            #{{ currentUser.rank }}
          </div>
          <div>
            <p class="text-xs text-gray-400">Your Current Rank</p>
            <p class="text-sm font-bold text-white">{{ currentUser.name }}</p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-xs text-gray-400">Total Points</p>
          <p class="text-sm sm:text-base font-extrabold text-rose-500">{{ currentUser.points.toLocaleString() }} PTS</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activePeriod = ref('weekly')

const filterPeriods = [
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'alltime', label: 'All Time' }
]

// Mock Leaderboard Data
const leaderboardData = ref([
  { rank: 1, name: 'Balam A.', initials: 'BA', phone: '+255712***89', points: 14250, reward: 'TZS 1,000,000' },
  { rank: 2, name: 'Kelvin M.', initials: 'KM', phone: '+255655***12', points: 11800, reward: 'TZS 500,000' },
  { rank: 3, name: 'Amina S.', initials: 'AS', phone: '+255784***45', points: 9450, reward: 'TZS 250,000' },
  { rank: 4, name: 'John Doe', initials: 'JD', phone: '+255768***90', points: 8100, reward: 'TZS 100,000' },
  { rank: 5, name: 'Hassan K.', initials: 'HK', phone: '+255677***33', points: 7650, reward: 'TZS 50,000' },
  { rank: 6, name: 'Michael B.', initials: 'MB', phone: '+255713***11', points: 6900, reward: 'TZS 50,000' },
  { rank: 7, name: 'Sarah T.', initials: 'ST', phone: '+255754***00', points: 5400, reward: 'TZS 25,000', isCurrentUser: true },
  { rank: 8, name: 'David P.', initials: 'DP', phone: '+255622***88', points: 4900, reward: 'TZS 25,000' },
  { rank: 9, name: 'Frank Z.', initials: 'FZ', phone: '+255719***66', points: 4200, reward: 'TZS 25,000' },
  { rank: 10, name: 'Grace L.', initials: 'GL', phone: '+255782***22', points: 3800, reward: 'TZS 25,000' }
])

const topThree = computed(() => leaderboardData.value.slice(0, 3))
const restRankings = computed(() => leaderboardData.value.slice(3))
const currentUser = computed(() => leaderboardData.value.find(u => u.isCurrentUser) || leaderboardData.value[6])
</script>