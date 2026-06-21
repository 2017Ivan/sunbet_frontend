<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== ADMIN HEADER ===== -->
      <div class="bg-[#0D0D0D] border-b border-[#1E1E1E] sticky top-0 z-40">
        <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-[7px] bg-[#A32D2D] flex items-center justify-center">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="font-bold text-sm text-white">SunBet <span class="text-[#A32D2D]">Admin</span></span>
            <span class="px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-[10px] font-bold border border-[#EF4444]/25">RESTRICTED</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-[#606060]">Admin: <span class="text-white">SuperAdmin</span></span>
            <button
              class="text-xs text-[#EF4444] hover:text-[#DC2626] transition-colors font-semibold"
              @click="$router.push('/')"
            >
              Exit Admin
            </button>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-2xl mx-auto flex">
  
        <!-- ===== ADMIN SIDEBAR ===== -->
        <aside class="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-[#1E1E1E] min-h-screen pt-4 pb-8 px-3">
          <div
            v-for="section in adminNav"
            :key="section.label"
            class="mb-4"
          >
            <p class="text-[10px] font-bold text-[#606060] uppercase tracking-widest px-3 py-1.5">{{ section.label }}</p>
            <button
              v-for="item in section.items"
              :key="item.id"
              class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm transition-all mb-0.5"
              :class="activeSection === item.id
                ? 'bg-[#A32D2D]/15 text-[#C94040] font-semibold'
                : 'text-[#606060] hover:text-white hover:bg-[#1E1E1E]'"
              @click="activeSection = item.id"
            >
              <span class="text-base">{{ item.icon }}</span>
              {{ item.label }}
              <span
                v-if="item.badge"
                class="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                :class="item.badgeClass || 'bg-[#A32D2D] text-white'"
              >
                {{ item.badge }}
              </span>
            </button>
          </div>
        </aside>
  
        <!-- ===== ADMIN MAIN ===== -->
        <main class="flex-1 min-w-0 p-5">
  
          <!-- ===== DASHBOARD ===== -->
          <div v-if="activeSection === 'dashboard'">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-bold text-white">Dashboard Overview</h2>
                <p class="text-xs text-[#606060]">Real-time platform statistics</p>
              </div>
              <div class="text-xs text-[#606060]">
                Last updated: <span class="text-white">Just now</span>
              </div>
            </div>
  
            <!-- KPI cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                v-for="kpi in kpiCards"
                :key="kpi.label"
                class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xl">{{ kpi.icon }}</span>
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="kpi.trend > 0 ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'"
                  >
                    {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
                  </span>
                </div>
                <p class="text-xl font-black text-white">{{ kpi.value }}</p>
                <p class="text-xs text-[#606060] mt-0.5">{{ kpi.label }}</p>
              </div>
            </div>
  
            <!-- Charts row -->
            <div class="grid lg:grid-cols-2 gap-5 mb-5">
  
              <!-- Revenue chart -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-bold text-white">Daily Revenue (TZS)</h3>
                  <span class="text-xs text-[#22C55E] font-semibold">↑ +18% this week</span>
                </div>
                <div class="flex items-end gap-1.5 h-32">
                  <div
                    v-for="day in revenueData"
                    :key="day.label"
                    class="flex-1 flex flex-col items-center gap-1"
                  >
                    <div class="w-full flex flex-col justify-end" style="height: 100px">
                      <div
                        class="w-full rounded-[4px] bg-gradient-to-t from-[#A32D2D] to-[#C94040] transition-all duration-700 hover:opacity-80"
                        :style="{ height: (day.value / maxRevenue * 90) + 'px' }"
                        :title="'TZS ' + day.value.toLocaleString()"
                      />
                    </div>
                    <span class="text-[9px] text-[#606060]">{{ day.label }}</span>
                  </div>
                </div>
              </div>
  
              <!-- Bets donut -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
                <h3 class="text-sm font-bold text-white mb-4">Bet Outcomes Today</h3>
                <div class="flex items-center gap-6">
                  <!-- Simple donut representation -->
                  <div class="relative w-32 h-32 flex-shrink-0">
                    <svg class="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#1E1E1E" stroke-width="18"/>
                      <!-- Won: green 62% -->
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#22C55E" stroke-width="18"
                        stroke-dasharray="175 283" stroke-dashoffset="0" stroke-linecap="round"/>
                      <!-- Lost: red 28% -->
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#EF4444" stroke-width="18"
                        stroke-dasharray="79 283" stroke-dashoffset="-175" stroke-linecap="round"/>
                      <!-- Pending: yellow 10% -->
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#F59E0B" stroke-width="18"
                        stroke-dasharray="28 283" stroke-dashoffset="-254" stroke-linecap="round"/>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <p class="text-xl font-black text-white">1,847</p>
                      <p class="text-[10px] text-[#606060]">total bets</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div v-for="outcome in betOutcomes" :key="outcome.label" class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: outcome.color }" />
                      <div>
                        <p class="text-xs font-semibold text-white">{{ outcome.label }}</p>
                        <p class="text-[10px] text-[#606060]">{{ outcome.count }} bets ({{ outcome.pct }}%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Recent activity -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                <h3 class="text-sm font-bold text-white">Recent Activity</h3>
                <button class="text-xs text-[#A32D2D] font-semibold">View all</button>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="flex items-center gap-4 px-5 py-3 hover:bg-[#1E1E1E] transition-colors"
                >
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" :class="activity.iconBg">
                    {{ activity.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-white truncate">{{ activity.description }}</p>
                    <p class="text-xs text-[#606060]">{{ activity.time }}</p>
                  </div>
                  <span
                    class="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                    :class="activity.amountClass"
                  >
                    {{ activity.amount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ===== USERS ===== -->
          <div v-else-if="activeSection === 'users'">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-white">Users Management</h2>
              <div class="flex gap-2">
                <input
                  v-model="userSearch"
                  placeholder="Search users..."
                  class="h-9 px-3 rounded-[10px] bg-[#161616] border border-[#2A2A2A] text-sm text-white placeholder:text-[#606060] focus:border-[#A32D2D] focus:outline-none"
                />
                <AppButton variant="primary" size="sm">+ Add User</AppButton>
              </div>
            </div>
  
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[#1E1E1E] text-[10px] font-bold text-[#606060] uppercase tracking-wider">
                <div class="col-span-3">User</div>
                <div class="col-span-2">Phone</div>
                <div class="col-span-2">Balance</div>
                <div class="col-span-2">Status</div>
                <div class="col-span-2">Joined</div>
                <div class="col-span-1">Actions</div>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <div
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-[#1E1E1E] transition-colors"
                >
                  <div class="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {{ user.initials }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-white truncate">{{ user.name }}</p>
                      <p class="text-[10px] text-[#606060]">{{ user.vip }}</p>
                    </div>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs text-[#A0A0A0]">{{ user.phone }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs font-semibold text-white">TZS {{ user.balance.toLocaleString() }}</p>
                  </div>
                  <div class="col-span-2">
                    <span
                      class="text-[10px] font-bold px-2 py-1 rounded-full"
                      :class="user.status === 'Active' ? 'bg-[#22C55E]/15 text-[#22C55E]' :
                               user.status === 'Suspended' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                               'bg-[#F59E0B]/15 text-[#F59E0B]'"
                    >
                      {{ user.status }}
                    </span>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs text-[#606060]">{{ user.joined }}</p>
                  </div>
                  <div class="col-span-1 flex gap-1">
                    <button class="w-7 h-7 rounded-[6px] bg-[#1E1E1E] hover:bg-[#2A2A2A] flex items-center justify-center text-[#606060] hover:text-white transition-all" title="View">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="w-7 h-7 rounded-[6px] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-all" title="Suspend">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ===== BETS ===== -->
          <div v-else-if="activeSection === 'bets'">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-white">Bets Management</h2>
              <div class="flex gap-2">
                <select
                  v-model="betStatusFilter"
                  class="h-9 px-3 rounded-[10px] bg-[#161616] border border-[#2A2A2A] text-xs text-[#A0A0A0] focus:border-[#A32D2D] focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
  
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="grid grid-cols-12 gap-2 px-5 py-3 border-b border-[#1E1E1E] text-[10px] font-bold text-[#606060] uppercase tracking-wider">
                <div class="col-span-1">ID</div>
                <div class="col-span-2">User</div>
                <div class="col-span-3">Bet</div>
                <div class="col-span-1 text-center">Odds</div>
                <div class="col-span-2 text-center">Stake</div>
                <div class="col-span-2 text-center">Payout</div>
                <div class="col-span-1 text-center">Status</div>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <div
                  v-for="bet in filteredAdminBets"
                  :key="bet.id"
                  class="grid grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-[#1E1E1E] transition-colors"
                >
                  <div class="col-span-1">
                    <p class="text-[10px] text-[#606060] font-mono">{{ bet.id }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs font-semibold text-white">{{ bet.user }}</p>
                  </div>
                  <div class="col-span-3">
                    <p class="text-xs text-white truncate">{{ bet.description }}</p>
                    <p class="text-[10px] text-[#606060]">{{ bet.type }}</p>
                  </div>
                  <div class="col-span-1 text-center">
                    <p class="text-xs font-bold text-[#A32D2D]">{{ bet.odds }}</p>
                  </div>
                  <div class="col-span-2 text-center">
                    <p class="text-xs font-semibold text-white">TZS {{ bet.stake.toLocaleString() }}</p>
                  </div>
                  <div class="col-span-2 text-center">
                    <p class="text-xs font-semibold" :class="bet.status === 'won' ? 'text-[#22C55E]' : 'text-[#A0A0A0]'">
                      {{ bet.status === 'won' ? '+TZS ' + bet.payout.toLocaleString() : '—' }}
                    </p>
                  </div>
                  <div class="col-span-1 text-center">
                    <span
                      class="text-[10px] font-bold px-2 py-1 rounded-full"
                      :class="bet.status === 'won' ? 'bg-[#22C55E]/15 text-[#22C55E]' :
                               bet.status === 'lost' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                               'bg-[#F59E0B]/15 text-[#F59E0B]'"
                    >
                      {{ bet.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ===== FINANCE ===== -->
          <div v-else-if="activeSection === 'finance'">
            <h2 class="text-lg font-bold text-white mb-5">Finance Overview</h2>
  
            <!-- Finance stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div
                v-for="stat in financeStats"
                :key="stat.label"
                class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4"
              >
                <p class="text-xs text-[#606060] mb-1">{{ stat.label }}</p>
                <p class="text-xl font-black" :class="stat.color">{{ stat.value }}</p>
                <p class="text-[10px] text-[#606060] mt-1">{{ stat.sub }}</p>
              </div>
            </div>
  
            <!-- Pending withdrawals -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                <h3 class="text-sm font-bold text-white">Pending Withdrawals</h3>
                <span class="px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] text-xs font-bold">{{ pendingWithdrawals.length }} pending</span>
              </div>
              <div class="divide-y divide-[#1E1E1E]">
                <div
                  v-for="wd in pendingWithdrawals"
                  :key="wd.id"
                  class="flex items-center gap-4 px-5 py-3"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white">{{ wd.user }}</p>
                    <p class="text-xs text-[#606060]">{{ wd.method }} • {{ wd.phone }} • {{ wd.time }}</p>
                  </div>
                  <p class="text-base font-black text-[#F59E0B]">TZS {{ wd.amount.toLocaleString() }}</p>
                  <div class="flex gap-2">
                    <AppButton variant="primary" size="sm" @click="approveWithdrawal(wd.id)">✓ Approve</AppButton>
                    <AppButton variant="ghost"   size="sm">✕ Reject</AppButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ===== SETTINGS ===== -->
          <div v-else-if="activeSection === 'settings'">
            <h2 class="text-lg font-bold text-white mb-5">Platform Settings</h2>
  
            <div class="grid lg:grid-cols-2 gap-5">
              <div
                v-for="setting in platformSettings"
                :key="setting.label"
                class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-5"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">{{ setting.icon }}</span>
                    <div>
                      <p class="text-sm font-semibold text-white">{{ setting.label }}</p>
                      <p class="text-xs text-[#606060]">{{ setting.description }}</p>
                    </div>
                  </div>
                  <!-- Toggle -->
                  <button
                    class="w-12 h-6 rounded-full transition-all duration-300 relative"
                    :class="setting.enabled ? 'bg-[#22C55E]' : 'bg-[#2A2A2A]'"
                    @click="setting.enabled = !setting.enabled"
                  >
                    <div
                      class="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300"
                      :class="setting.enabled ? 'left-6' : 'left-0.5'"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
  
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const router        = useRouter()
  const activeSection = ref('dashboard')
  const userSearch    = ref('')
  const betStatusFilter = ref('all')
  
  // ---- Admin nav ----
  const adminNav = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'reports',   icon: '📈', label: 'Reports'   },
      ]
    },
    {
      label: 'Management',
      items: [
        { id: 'users',    icon: '👥', label: 'Users',    badge: '2,041', badgeClass: 'bg-[#1E1E1E] text-[#606060]' },
        { id: 'bets',     icon: '🎯', label: 'Bets',     badge: '24 live', badgeClass: 'bg-[#FF3B3B]/15 text-[#FF3B3B]' },
        { id: 'finance',  icon: '💰', label: 'Finance',  badge: '8 pending', badgeClass: 'bg-[#F59E0B]/15 text-[#F59E0B]' },
        { id: 'promos',   icon: '🎁', label: 'Promotions' },
      ]
    },
    {
      label: 'System',
      items: [
        { id: 'settings', icon: '⚙️', label: 'Settings' },
        { id: 'logs',     icon: '📋', label: 'Logs'     },
      ]
    },
  ]
  
  // ---- KPIs ----
  const kpiCards = [
    { icon: '👥', label: 'Active Users Today',  value: '12,450',      trend: +8  },
    { icon: '🎯', label: 'Bets Placed Today',   value: '48,230',      trend: +15 },
    { icon: '💰', label: 'Revenue Today',        value: 'TZS 8.4M',   trend: +18 },
    { icon: '⚡', label: 'Pending Withdrawals', value: '8',           trend: -3  },
  ]
  
  // ---- Revenue chart ----
  const revenueData = [
    { label: 'Mon', value: 5200000 },
    { label: 'Tue', value: 7800000 },
    { label: 'Wed', value: 6500000 },
    { label: 'Thu', value: 9200000 },
    { label: 'Fri', value: 11500000 },
    { label: 'Sat', value: 14800000 },
    { label: 'Sun', value: 8400000 },
  ]
  const maxRevenue = computed(() => Math.max(...revenueData.map(d => d.value)))
  
  // ---- Bet outcomes ----
  const betOutcomes = [
    { label: 'Won',     color: '#22C55E', count: 1145, pct: 62 },
    { label: 'Lost',    color: '#EF4444', count: 517,  pct: 28 },
    { label: 'Pending', color: '#F59E0B', count: 185,  pct: 10 },
  ]
  
  // ---- Recent activity ----
  const recentActivity = [
    { id: 1, icon: '💰', iconBg: 'bg-[#22C55E]/15', description: 'Withdrawal approved — Amina K. M-Pesa',  time: '2 min ago',  amount: '-TZS 250,000',   amountClass: 'text-[#EF4444]' },
    { id: 2, icon: '🎯', iconBg: 'bg-[#A32D2D]/15', description: 'Large bet placed — James M. Accumulator', time: '5 min ago',  amount: 'TZS 100,000',    amountClass: 'text-[#F59E0B]' },
    { id: 3, icon: '👤', iconBg: 'bg-[#606060]/15', description: 'New user registered — +255 712 XXX XXX',   time: '8 min ago',  amount: 'New User',        amountClass: 'text-[#A0A0A0]' },
    { id: 4, icon: '🏆', iconBg: 'bg-[#F59E0B]/15', description: 'Jackpot won — Said M. TZS 50M',           time: '12 min ago', amount: '-TZS 50,000,000', amountClass: 'text-[#EF4444]' },
    { id: 5, icon: '⬇️', iconBg: 'bg-[#22C55E]/15', description: 'Deposit received — M-Pesa TZS 50,000',    time: '15 min ago', amount: '+TZS 50,000',     amountClass: 'text-[#22C55E]' },
  ]
  
  // ---- Users ----
  const adminUsers = ref([
    { id: 1, initials: 'AK', name: 'Amina Kibwana',   phone: '+255 712 111 222', balance: 1250000, vip: '👑 Platinum', status: 'Active',    joined: 'Jan 2024' },
    { id: 2, initials: 'JM', name: 'James Mwangi',    phone: '+255 713 222 333', balance: 890000,  vip: '🏆 Gold',     status: 'Active',    joined: 'Feb 2024' },
    { id: 3, initials: 'SM', name: 'Said Makame',      phone: '+255 714 333 444', balance: 450000,  vip: '🏆 Gold',     status: 'Active',    joined: 'Mar 2024' },
    { id: 4, initials: 'FH', name: 'Fatuma Hassan',   phone: '+255 715 444 555', balance: 125000,  vip: '🥈 Silver',   status: 'Active',    joined: 'Apr 2024' },
    { id: 5, initials: 'DM', name: 'David Mollel',    phone: '+255 716 555 666', balance: 0,       vip: '🥉 Bronze',   status: 'Suspended', joined: 'May 2024' },
    { id: 6, initials: 'RM', name: 'Rose Masha',      phone: '+255 717 666 777', balance: 75000,   vip: '🥉 Bronze',   status: 'Active',    joined: 'Jun 2024' },
    { id: 7, initials: 'BK', name: 'Baraka Kimaro',   phone: '+255 718 777 888', balance: 320000,  vip: '🥈 Silver',   status: 'Pending',   joined: 'Jul 2024' },
  ])
  
  const filteredUsers = computed(() =>
    adminUsers.value.filter(u =>
      !userSearch.value ||
      u.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      u.phone.includes(userSearch.value)
    )
  )
  
  // ---- Admin bets ----
  const adminBets = ref([
    { id: 'SB001', user: 'Amina K.', description: 'Man Utd vs Chelsea — Accumulator x5', type: 'Accumulator', odds: '12.50', stake: 10000,  payout: 125000,  status: 'active' },
    { id: 'SB002', user: 'James M.', description: 'Barcelona Win — Single',               type: 'Single',      odds: '2.35',  stake: 25000,  payout: 58750,   status: 'active' },
    { id: 'SB003', user: 'Said M.',  description: 'Accumulator x4 — Won',                 type: 'Accumulator', odds: '15.30', stake: 20000,  payout: 306000,  status: 'won'    },
    { id: 'SB004', user: 'Fatuma H.',description: 'Man City vs Tottenham — Draw',          type: 'Single',      odds: '3.40',  stake: 30000,  payout: 0,       status: 'lost'   },
    { id: 'SB005', user: 'David M.', description: 'Lakers vs Warriors — Double',           type: 'Double',      odds: '4.35',  stake: 10000,  payout: 43500,   status: 'won'    },
    { id: 'SB006', user: 'Rose M.',  description: 'Simba SC Win — Single',                 type: 'Single',      odds: '1.95',  stake: 15000,  payout: 0,       status: 'lost'   },
  ])
  
  const filteredAdminBets = computed(() =>
    betStatusFilter.value === 'all'
      ? adminBets.value
      : adminBets.value.filter(b => b.status === betStatusFilter.value)
  )
  
  // ---- Finance ----
  const financeStats = [
    { label: 'Total Deposits Today',   value: 'TZS 24.5M', color: 'text-[#22C55E]', sub: '↑ +12% vs yesterday' },
    { label: 'Total Withdrawals Today',value: 'TZS 16.2M', color: 'text-[#EF4444]', sub: '↑ +8% vs yesterday'  },
    { label: 'Net Revenue Today',      value: 'TZS 8.3M',  color: 'text-white',      sub: 'GGR after payouts'   },
    { label: 'Pending Approvals',      value: '8',          color: 'text-[#F59E0B]', sub: 'Requires attention'   },
  ]
  
  const pendingWithdrawals = ref([
    { id: 1, user: 'Amina K.',   method: 'M-Pesa',  phone: '+255 712 111 222', amount: 250000, time: '5 min ago'  },
    { id: 2, user: 'James M.',   method: 'Tigo Pesa',phone: '+255 713 222 333', amount: 500000, time: '12 min ago' },
    { id: 3, user: 'Said M.',    method: 'M-Pesa',  phone: '+255 714 333 444', amount: 100000, time: '18 min ago' },
    { id: 4, user: 'Rose M.',    method: 'Airtel',  phone: '+255 717 666 777', amount: 75000,  time: '25 min ago' },
    { id: 5, user: 'Baraka K.',  method: 'M-Pesa',  phone: '+255 718 777 888', amount: 180000, time: '31 min ago' },
  ])
  
  const approveWithdrawal = (id) => {
    const i = pendingWithdrawals.value.findIndex(w => w.id === id)
    if (i >= 0) pendingWithdrawals.value.splice(i, 1)
  }
  
  // ---- Platform settings ----
  const platformSettings = ref([
    { icon: '⚽', label: 'Sports Betting',       description: 'Enable/disable sports betting',     enabled: true  },
    { icon: '🔴', label: 'Live Betting',          description: 'Enable/disable live in-play bets',  enabled: true  },
    { icon: '🎁', label: 'Promotions Active',     description: 'Show promotions to users',           enabled: true  },
    { icon: '📱', label: 'M-Pesa Deposits',       description: 'Enable M-Pesa deposit gateway',      enabled: true  },
    { icon: '💸', label: 'Auto Withdrawals',      description: 'Auto-approve withdrawals < TZS 50K', enabled: false },
    { icon: '🔒', label: 'Maintenance Mode',      description: 'Take site offline for maintenance',  enabled: false },
    { icon: '📧', label: 'Email Notifications',   description: 'Send email alerts to users',         enabled: true  },
    { icon: '🤖', label: 'Bot Detection',         description: 'Detect and block suspicious activity',enabled: true },
  ])
  </script>