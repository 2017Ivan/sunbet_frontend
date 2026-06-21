<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== PAGE HEADER ===== -->
      <div class="bg-gradient-to-br from-[#1a0505] via-[#0D0D0D] to-[#0D0D0D] border-b border-[#1E1E1E]">
        <div class="max-w-screen-xl mx-auto px-4 py-8">
          <div class="flex items-center justify-between gap-4">
  
            <!-- User info -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-2xl font-black text-white border-2 border-[#A32D2D]/40">
                  JD
                </div>
                <div class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#0D0D0D]" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h1 class="text-xl font-bold text-white">John Doe</h1>
                  <span class="px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] text-[10px] font-bold border border-[#F59E0B]/25">
                    🏆 VIP Gold
                  </span>
                </div>
                <p class="text-sm text-[#606060]">+255 712 345 678 • Member since Jan 2024</p>
                <div class="flex items-center gap-3 mt-1.5">
                  <div class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span class="text-xs text-[#22C55E] font-semibold">Verified Account</span>
                  </div>
                  <span class="text-[#333]">•</span>
                  <span class="text-xs text-[#606060]">ID: SB-001234</span>
                </div>
              </div>
            </div>
  
            <!-- Quick actions -->
            <div class="hidden sm:flex gap-2">
              <AppButton variant="secondary" size="sm" @click="$router.push('/wallet')">
                💳 Deposit
              </AppButton>
              <AppButton variant="primary" size="sm" @click="$router.push('/sports')">
                🎯 Bet Now
              </AppButton>
            </div>
          </div>
  
          <!-- VIP Progress -->
          <div class="mt-6 bg-white/[0.04] border border-white/[0.06] rounded-[14px] p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">🏆</span>
                <div>
                  <p class="text-sm font-bold text-white">VIP Gold</p>
                  <p class="text-xs text-[#606060]">TZS 125,000 until Platinum</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-[#606060]">Points</p>
                <p class="text-base font-black text-[#F59E0B]">4,250 XP</p>
              </div>
            </div>
            <div class="h-2 rounded-full bg-[#1E1E1E] overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] transition-all duration-1000" style="width: 65%" />
            </div>
            <div class="flex justify-between text-[10px] text-[#606060] mt-1.5">
              <span>Gold (0)</span>
              <span>65% to Platinum</span>
              <span>Platinum (5,000 XP)</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-6">
        <div class="flex gap-6">
  
          <!-- ===== MAIN CONTENT ===== -->
          <div class="flex-1 min-w-0 space-y-6">
  
            <!-- Stats grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                v-for="stat in dashStats"
                :key="stat.label"
                class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4 hover:border-[#A32D2D]/20 transition-all"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="w-9 h-9 rounded-[9px] flex items-center justify-center" :class="stat.iconBg">
                    <span class="text-lg">{{ stat.icon }}</span>
                  </div>
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="stat.trend > 0
                      ? 'bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-[#EF4444]/15 text-[#EF4444]'"
                  >
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                </div>
                <p class="text-xl font-black text-white">{{ stat.value }}</p>
                <p class="text-xs text-[#606060] mt-0.5">{{ stat.label }}</p>
              </div>
            </div>
  
            <!-- Recent bets + Activity -->
            <div class="grid lg:grid-cols-2 gap-5">
  
              <!-- Recent bets -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <h3 class="text-sm font-bold text-white">Recent Bets</h3>
                  <RouterLink to="/my-bets" class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
                    View all →
                  </RouterLink>
                </div>
                <div class="divide-y divide-[#1E1E1E]">
                  <div
                    v-for="bet in recentBets"
                    :key="bet.id"
                    class="flex items-center gap-3 px-5 py-3 hover:bg-[#1E1E1E] transition-colors"
                  >
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      :class="bet.status === 'won' ? 'bg-[#22C55E]/15' : bet.status === 'lost' ? 'bg-[#EF4444]/15' : 'bg-[#F59E0B]/15'"
                    >
                      {{ bet.status === 'won' ? '🏆' : bet.status === 'lost' ? '❌' : '⏳' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-white truncate">{{ bet.match }}</p>
                      <p class="text-xs text-[#606060]">{{ bet.type }} • {{ bet.date }}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <p
                        class="text-sm font-bold"
                        :class="bet.status === 'won' ? 'text-[#22C55E]' : bet.status === 'lost' ? 'text-[#EF4444]' : 'text-[#F59E0B]'"
                      >
                        {{ bet.status === 'won' ? '+' : '' }}{{ bet.amount }}
                      </p>
                      <p class="text-[10px] capitalize" :class="bet.status === 'won' ? 'text-[#22C55E]' : bet.status === 'lost' ? 'text-[#EF4444]' : 'text-[#F59E0B]'">
                        {{ bet.status }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Favourite teams -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <h3 class="text-sm font-bold text-white">Favourite Teams</h3>
                  <button class="text-xs text-[#A32D2D] font-semibold hover:text-[#C94040] transition-colors">
                    + Add
                  </button>
                </div>
                <div class="divide-y divide-[#1E1E1E]">
                  <div
                    v-for="team in favouriteTeams"
                    :key="team.name"
                    class="flex items-center gap-3 px-5 py-3 hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                    @click="$router.push('/sports')"
                  >
                    <span class="text-2xl">{{ team.flag }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-white">{{ team.name }}</p>
                      <p class="text-xs text-[#606060]">{{ team.league }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-[#606060]">Next match</p>
                      <p class="text-xs font-semibold text-white">{{ team.nextMatch }}</p>
                    </div>
                    <svg class="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Betting performance chart -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="text-sm font-bold text-white">Betting Performance</h3>
                  <p class="text-xs text-[#606060] mt-0.5">Last 7 days</p>
                </div>
                <div class="flex gap-3 text-xs">
                  <div class="flex items-center gap-1.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                    <span class="text-[#606060]">Won</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span class="text-[#606060]">Lost</span>
                  </div>
                </div>
              </div>
  
              <!-- Simple bar chart -->
              <div class="flex items-end gap-2 h-36">
                <div
                  v-for="day in performanceData"
                  :key="day.label"
                  class="flex-1 flex flex-col items-center gap-1"
                >
                  <div class="w-full flex flex-col justify-end gap-0.5" style="height: 100px">
                    <div
                      class="w-full rounded-t-[4px] bg-[#22C55E]/70 transition-all duration-700"
                      :style="{ height: (day.won / maxPerf * 90) + 'px' }"
                    />
                    <div
                      class="w-full rounded-b-[4px] bg-[#EF4444]/70 transition-all duration-700"
                      :style="{ height: (day.lost / maxPerf * 90) + 'px' }"
                    />
                  </div>
                  <span class="text-[10px] text-[#606060]">{{ day.label }}</span>
                </div>
              </div>
            </div>
  
            <!-- Notifications -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                <h3 class="text-sm font-bold text-white">Notifications</h3>
                <button class="text-xs text-[#606060] hover:text-[#A32D2D] transition-colors">Mark all read</button>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  class="flex items-start gap-3 px-5 py-4 hover:bg-[#1E1E1E] transition-colors"
                  :class="!notif.read ? 'bg-[#A32D2D]/3' : ''"
                >
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                    :class="notif.iconBg"
                  >
                    {{ notif.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold text-white">{{ notif.title }}</p>
                      <span v-if="!notif.read" class="w-1.5 h-1.5 rounded-full bg-[#A32D2D] flex-shrink-0" />
                    </div>
                    <p class="text-xs text-[#606060] mt-0.5 leading-relaxed">{{ notif.message }}</p>
                    <p class="text-[10px] text-[#606060] mt-1">{{ notif.time }}</p>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
  
          <!-- ===== RIGHT SIDEBAR ===== -->
          <aside class="hidden lg:block w-72 flex-shrink-0 space-y-4">
  
            <!-- Quick balance -->
            <div class="bg-gradient-to-br from-[#1a0505] to-[#161616] border border-[#A32D2D]/20 rounded-[18px] p-5">
              <p class="text-xs text-[#606060] mb-1">Balance</p>
              <p class="text-2xl font-black text-white mb-3">TZS <span class="text-[#A32D2D]">125,000</span></p>
              <div class="grid grid-cols-2 gap-2">
                <AppButton variant="primary"   size="sm" fullWidth @click="$router.push('/wallet')">Deposit</AppButton>
                <AppButton variant="secondary" size="sm" fullWidth @click="$router.push('/wallet')">Withdraw</AppButton>
              </div>
            </div>
  
            <!-- Profile completion -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-white">Profile Completion</h3>
                <span class="text-sm font-black text-[#A32D2D]">75%</span>
              </div>
              <div class="h-2 rounded-full bg-[#1E1E1E] overflow-hidden mb-4">
                <div class="h-full w-3/4 rounded-full bg-gradient-to-r from-[#A32D2D] to-[#C94040]" />
              </div>
              <div class="space-y-2">
                <div
                  v-for="item in profileItems"
                  :key="item.label"
                  class="flex items-center gap-3"
                >
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="item.done ? 'bg-[#22C55E]/20' : 'bg-[#333]'"
                  >
                    <svg v-if="item.done" class="w-2.5 h-2.5 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div v-else class="w-1.5 h-1.5 rounded-full bg-[#606060]" />
                  </div>
                  <span class="text-xs" :class="item.done ? 'text-[#A0A0A0] line-through' : 'text-white'">
                    {{ item.label }}
                  </span>
                  <span v-if="!item.done" class="ml-auto text-[10px] text-[#A32D2D] font-semibold">+{{ item.xp }} XP</span>
                </div>
              </div>
            </div>
  
            <!-- Active promos -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-white">Active Promos</h3>
                <RouterLink to="/promotions" class="text-xs text-[#A32D2D] font-semibold">View all</RouterLink>
              </div>
              <div class="space-y-2">
                <div
                  v-for="promo in activePromos"
                  :key="promo.id"
                  class="flex items-center gap-3 p-3 rounded-[10px] bg-[#1E1E1E] hover:bg-[#242424] transition-colors cursor-pointer"
                >
                  <span class="text-xl">{{ promo.emoji }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-white truncate">{{ promo.title }}</p>
                    <p class="text-[10px] text-[#A32D2D]">Expires {{ promo.expires }}</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Account settings quick links -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="px-4 py-3 border-b border-[#1E1E1E]">
                <h3 class="text-sm font-bold text-white">Settings</h3>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <button
                  v-for="setting in settingsLinks"
                  :key="setting.label"
                  class="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1E1E1E] transition-colors text-left"
                >
                  <span class="text-base">{{ setting.icon }}</span>
                  <span class="flex-1 text-sm text-[#A0A0A0]">{{ setting.label }}</span>
                  <svg class="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
  
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import AppButton from '../components/ui/AppButton.vue'
  
  const router = useRouter()
  
  // ---- Dash stats ----
  const dashStats = [
    { label: 'Total Bets',    value: '47',        icon: '🎯', iconBg: 'bg-[#A32D2D]/15', trend: +12  },
    { label: 'Win Rate',      value: '62%',       icon: '📈', iconBg: 'bg-[#22C55E]/15', trend: +5   },
    { label: 'Total Profit',  value: 'TZS 132K',  icon: '💰', iconBg: 'bg-[#F59E0B]/15', trend: +18  },
    { label: 'Active Bets',   value: '3',         icon: '⏳', iconBg: 'bg-[#606060]/15', trend: -2   },
  ]
  
  // ---- Recent bets ----
  const recentBets = [
    { id: 1, match: 'Man Utd vs Chelsea',    type: 'Acca x5',  date: 'Today',      status: 'pending', amount: 'TZS 125K potential' },
    { id: 2, match: 'Accumulator x4',        type: 'Acca x4',  date: 'Yesterday',  status: 'won',     amount: 'TZS 306,000'        },
    { id: 3, match: 'Man City vs Tottenham', type: 'Single',   date: '2 days ago', status: 'lost',    amount: 'TZS 30,000'         },
    { id: 4, match: 'Double x2',             type: 'Double',   date: '3 days ago', status: 'won',     amount: 'TZS 43,500'         },
    { id: 5, match: 'Djokovic vs Alcaraz',   type: 'Single',   date: '4 days ago', status: 'lost',    amount: 'TZS 50,000'         },
  ]
  
  // ---- Favourite teams ----
  const favouriteTeams = [
    { name: 'Manchester United', flag: '🔴', league: 'Premier League', nextMatch: 'vs Chelsea • Today' },
    { name: 'Barcelona',         flag: '🔵', league: 'La Liga',        nextMatch: 'vs Atletico • Today' },
    { name: 'Simba SC',          flag: '🦁', league: 'Tanzania PL',    nextMatch: 'vs Young Africans • Sat' },
  ]
  
  // ---- Performance chart ----
  const performanceData = [
    { label: 'Mon', won: 3, lost: 1 },
    { label: 'Tue', won: 1, lost: 2 },
    { label: 'Wed', won: 5, lost: 1 },
    { label: 'Thu', won: 2, lost: 3 },
    { label: 'Fri', won: 4, lost: 1 },
    { label: 'Sat', won: 6, lost: 2 },
    { label: 'Sun', won: 3, lost: 1 },
  ]
  
  const maxPerf = computed(() =>
    Math.max(...performanceData.map(d => d.won + d.lost))
  )
  
  // ---- Notifications ----
  const notifications = ref([
    { id: 1, icon: '🏆', iconBg: 'bg-[#22C55E]/15', title: 'Bet Won!',          message: 'Your accumulator x4 has won TZS 306,000. Funds credited to your wallet.',  time: '2 hours ago',  read: false },
    { id: 2, icon: '🎁', iconBg: 'bg-[#F59E0B]/15', title: 'New Promo',         message: 'Cashback Friday is here! Get 10% back on all losing bets today.',           time: '5 hours ago',  read: false },
    { id: 3, icon: '⚽', iconBg: 'bg-[#A32D2D]/15', title: 'Match Starting',    message: 'Man United vs Chelsea starts in 30 minutes. Place your bets now!',           time: '8 hours ago',  read: true  },
    { id: 4, icon: '💰', iconBg: 'bg-[#22C55E]/15', title: 'Deposit Success',   message: 'TZS 50,000 deposited via M-Pesa. Your balance has been updated.',           time: 'Yesterday',    read: true  },
    { id: 5, icon: '🔒', iconBg: 'bg-[#606060]/15', title: 'Security Alert',    message: 'New login detected from Dar es Salaam. If this was you, ignore this.',      time: '2 days ago',   read: true  },
  ])
  
  // ---- Profile items ----
  const profileItems = [
    { label: 'Phone verified',   done: true,  xp: 0   },
    { label: 'Email verified',   done: false, xp: 100 },
    { label: '2FA enabled',      done: false, xp: 200 },
    { label: 'Profile photo',    done: false, xp: 50  },
    { label: 'KYC completed',    done: true,  xp: 0   },
  ]
  
  // ---- Active promos ----
  const activePromos = [
    { id: 1, emoji: '🎁', title: '100% Welcome Bonus',   expires: 'in 7 days' },
    { id: 2, emoji: '💰', title: 'Cashback Friday',       expires: 'Today'     },
    { id: 3, emoji: '🏆', title: 'TZS 50M Mega Jackpot', expires: 'in 2 days' },
  ]
  
  // ---- Settings links ----
  const settingsLinks = [
    { icon: '👤', label: 'Edit Profile'        },
    { icon: '🔒', label: 'Change Password'     },
    { icon: '📱', label: 'Two-Factor Auth'     },
    { icon: '🔔', label: 'Notifications'       },
    { icon: '🛡️', label: 'Responsible Gambling'},
    { icon: '📞', label: 'Contact Support'     },
  ]
  </script>