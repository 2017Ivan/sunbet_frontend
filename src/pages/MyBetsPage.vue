<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== PAGE HEADER ===== -->
      <div class="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#1E1E1E]">
        <div class="max-w-screen-xl mx-auto px-4">
  
          <!-- Title row -->
          <div class="flex items-center justify-between py-4">
            <div>
              <h1 class="text-xl font-bold text-white">My Bets</h1>
              <p class="text-xs text-[#606060] mt-0.5">Track all your betting activity</p>
            </div>
  
            <!-- Summary chips -->
            <div class="hidden sm:flex items-center gap-2">
              <div class="px-3 py-1.5 rounded-full bg-[#1E1E1E] border border-[#2A2A2A]">
                <span class="text-xs text-[#606060]">Active: </span>
                <span class="text-xs font-bold text-[#F59E0B]">{{ activeBets.length }}</span>
              </div>
              <div class="px-3 py-1.5 rounded-full bg-[#1E1E1E] border border-[#2A2A2A]">
                <span class="text-xs text-[#606060]">Won: </span>
                <span class="text-xs font-bold text-[#22C55E]">{{ wonBets.length }}</span>
              </div>
              <div class="px-3 py-1.5 rounded-full bg-[#1E1E1E] border border-[#2A2A2A]">
                <span class="text-xs text-[#606060]">Lost: </span>
                <span class="text-xs font-bold text-[#EF4444]">{{ lostBets.length }}</span>
              </div>
            </div>
          </div>
  
          <!-- Tabs -->
          <div class="flex gap-1 pb-0">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all"
              :class="activeTab === tab.id
                ? 'border-[#A32D2D] text-[#A32D2D]'
                : 'border-transparent text-[#606060] hover:text-[#A0A0A0]'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                :class="activeTab === tab.id
                  ? 'bg-[#A32D2D]/20 text-[#A32D2D]'
                  : 'bg-[#1E1E1E] text-[#606060]'"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-6">
        <div class="flex gap-6">
  
          <!-- ===== MAIN: Bets list ===== -->
          <div class="flex-1 min-w-0">
  
            <!-- ===== ACTIVE BETS ===== -->
            <div v-if="activeTab === 'active'">
  
              <!-- Empty state -->
              <div v-if="!activeBets.length" class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center text-4xl">🎯</div>
                <div class="text-center">
                  <p class="text-base font-semibold text-[#A0A0A0]">No active bets</p>
                  <p class="text-sm text-[#606060] mt-1">Place a bet to see it here</p>
                </div>
                <AppButton variant="primary" size="md" @click="$router.push('/sports')">
                  Browse Sports
                </AppButton>
              </div>
  
              <!-- Active bets list -->
              <div v-else class="space-y-4">
                <div
                  v-for="bet in activeBets"
                  :key="bet.id"
                  class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden hover:border-[#A32D2D]/20 transition-all"
                >
                  <!-- Bet header -->
                  <div class="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                    <div class="flex items-center gap-3">
                      <!-- Bet type badge -->
                      <div
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        :class="betTypeBadge(bet.type)"
                      >
                        {{ bet.type }}
                      </div>
                      <div>
                        <p class="text-xs text-[#606060]">Bet ID: #{{ bet.id }}</p>
                        <p class="text-[10px] text-[#606060]">{{ bet.placedAt }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-[#606060]">Stake</p>
                      <p class="text-sm font-bold text-white">TZS {{ bet.stake.toLocaleString() }}</p>
                    </div>
                  </div>
  
                  <!-- Selections -->
                  <div class="divide-y divide-[#1E1E1E]">
                    <div
                      v-for="(selection, i) in bet.selections"
                      :key="i"
                      class="px-5 py-3 flex items-center justify-between gap-3"
                    >
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <!-- Status icon -->
                        <div
                          class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          :class="selectionStatusClass(selection.status).bg"
                        >
                          <svg v-if="selection.status === 'won'" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <svg v-else-if="selection.status === 'lost'" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                          <span v-else class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        </div>
  
                        <div class="flex-1 min-w-0">
                          <p class="text-xs text-[#606060] truncate">{{ selection.match }}</p>
                          <p class="text-sm font-semibold text-white truncate">{{ selection.pick }}</p>
                          <p class="text-[10px] text-[#606060]">{{ selection.market }}</p>
                        </div>
                      </div>
  
                      <div class="text-right flex-shrink-0">
                        <!-- Live score if active -->
                        <div v-if="selection.status === 'pending' && selection.liveScore" class="mb-1">
                          <span class="flex items-center gap-1 text-[10px] text-[#FF3B3B] font-bold justify-end">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
                            {{ selection.liveScore }}
                          </span>
                        </div>
                        <p
                          class="text-sm font-bold"
                          :class="selectionStatusClass(selection.status).text"
                        >
                          {{ selection.odds }}
                        </p>
                        <p class="text-[10px]" :class="selectionStatusClass(selection.status).text">
                          {{ selection.status.toUpperCase() }}
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Bet footer -->
                  <div class="px-5 py-4 bg-[#0D0D0D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-4 flex-wrap">
                      <div>
                        <p class="text-[10px] text-[#606060]">Total Odds</p>
                        <p class="text-sm font-bold text-white">{{ bet.totalOdds }}</p>
                      </div>
                      <div>
                        <p class="text-[10px] text-[#606060]">Potential Win</p>
                        <p class="text-sm font-bold text-[#22C55E]">TZS {{ bet.potentialWin.toLocaleString() }}</p>
                      </div>
                      <!-- Cashout value -->
                      <div v-if="bet.cashoutValue">
                        <p class="text-[10px] text-[#606060]">Cashout Now</p>
                        <p class="text-sm font-bold text-[#F59E0B]">TZS {{ bet.cashoutValue.toLocaleString() }}</p>
                      </div>
                    </div>
  
                    <!-- Actions -->
                    <div class="flex gap-2">
                      <!-- Cashout button -->
                      <AppButton
                        v-if="bet.cashoutValue && bet.cashoutEligible"
                        variant="outline"
                        size="sm"
                        :loading="cashingOut === bet.id"
                        loading-text="Processing..."
                        @click="handleCashout(bet)"
                      >
                        💰 Cash Out TZS {{ bet.cashoutValue.toLocaleString() }}
                      </AppButton>
  
                      <!-- Share -->
                      <button
                        class="w-8 h-8 rounded-[8px] bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#606060] hover:text-white transition-colors"
                        @click="shareBet(bet)"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      </button>
                    </div>
                  </div>
  
                  <!-- Progress bar for accumulator -->
                  <div v-if="bet.type === 'Accumulator'" class="px-5 pb-4 bg-[#0D0D0D]">
                    <div class="flex items-center justify-between text-[10px] text-[#606060] mb-1.5">
                      <span>Progress</span>
                      <span>{{ bet.selections.filter(s => s.status === 'won').length }}/{{ bet.selections.length }} won</span>
                    </div>
                    <div class="h-1.5 rounded-full bg-[#1E1E1E] overflow-hidden">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-[#A32D2D] to-[#22C55E] transition-all duration-700"
                        :style="{ width: (bet.selections.filter(s => s.status === 'won').length / bet.selections.length * 100) + '%' }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- ===== BET HISTORY ===== -->
            <div v-else-if="activeTab === 'history'">
  
              <!-- Filters row -->
              <div class="flex flex-wrap items-center gap-3 mb-5">
  
                <!-- Status filter -->
                <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A]">
                  <button
                    v-for="f in historyFilters"
                    :key="f.id"
                    class="px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
                    :class="historyFilter === f.id
                      ? 'bg-[#A32D2D] text-white'
                      : 'text-[#606060] hover:text-white'"
                    @click="historyFilter = f.id"
                  >
                    {{ f.label }}
                  </button>
                </div>
  
                <!-- Date filter -->
                <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A]">
                  <button
                    v-for="d in dateFilters"
                    :key="d.id"
                    class="px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
                    :class="dateFilter === d.id
                      ? 'bg-[#2A2A2A] text-white'
                      : 'text-[#606060] hover:text-white'"
                    @click="dateFilter = d.id"
                  >
                    {{ d.label }}
                  </button>
                </div>
  
                <!-- Sport filter -->
                <select
                  v-model="sportFilter"
                  class="h-9 px-3 rounded-[10px] bg-[#161616] border border-[#2A2A2A] text-xs text-[#A0A0A0] focus:border-[#A32D2D] focus:outline-none"
                >
                  <option value="all">All Sports</option>
                  <option value="football">⚽ Football</option>
                  <option value="basketball">🏀 Basketball</option>
                  <option value="tennis">🎾 Tennis</option>
                </select>
              </div>
  
              <!-- History list -->
              <div class="space-y-3">
                <div
                  v-for="bet in filteredHistory"
                  :key="bet.id"
                  class="bg-[#161616] border rounded-[16px] overflow-hidden transition-all"
                  :class="bet.status === 'won'
                    ? 'border-[#22C55E]/20'
                    : bet.status === 'lost'
                    ? 'border-[#EF4444]/20'
                    : 'border-[#2A2A2A]'"
                >
                  <!-- Header -->
                  <div class="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1E]">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        :class="bet.status === 'won'
                          ? 'bg-[#22C55E]/15'
                          : bet.status === 'lost'
                          ? 'bg-[#EF4444]/15'
                          : 'bg-[#F59E0B]/15'"
                      >
                        {{ bet.status === 'won' ? '🏆' : bet.status === 'lost' ? '❌' : '🔄' }}
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span
                            class="text-xs font-bold uppercase"
                            :class="bet.status === 'won'
                              ? 'text-[#22C55E]'
                              : bet.status === 'lost'
                              ? 'text-[#EF4444]'
                              : 'text-[#F59E0B]'"
                          >
                            {{ bet.status }}
                          </span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#606060]">
                            {{ bet.type }}
                          </span>
                        </div>
                        <p class="text-[10px] text-[#606060] mt-0.5">{{ bet.placedAt }} • #{{ bet.id }}</p>
                      </div>
                    </div>
  
                    <div class="text-right">
                      <p
                        class="text-base font-black"
                        :class="bet.status === 'won' ? 'text-[#22C55E]' : 'text-[#A0A0A0]'"
                      >
                        {{ bet.status === 'won' ? '+' : '' }}TZS {{ (bet.status === 'won' ? bet.returns : bet.stake).toLocaleString() }}
                      </p>
                      <p class="text-[10px] text-[#606060]">
                        {{ bet.status === 'won' ? 'Returns' : 'Stake: TZS ' + bet.stake.toLocaleString() }}
                      </p>
                    </div>
                  </div>
  
                  <!-- Selections (collapsed by default) -->
                  <div class="px-4 py-3">
                    <div
                      v-for="(sel, i) in (expandedBets.includes(bet.id) ? bet.selections : bet.selections.slice(0,2))"
                      :key="i"
                      class="flex items-center gap-3 py-1.5"
                      :class="i > 0 ? 'border-t border-[#1E1E1E]' : ''"
                    >
                      <div
                        class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        :class="sel.status === 'won'
                          ? 'bg-[#22C55E]/20'
                          : sel.status === 'lost'
                          ? 'bg-[#EF4444]/20'
                          : 'bg-[#F59E0B]/20'"
                      >
                        <svg v-if="sel.status === 'won'" class="w-2.5 h-2.5 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <svg v-else-if="sel.status === 'lost'" class="w-2.5 h-2.5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        <span v-else class="w-1 h-1 rounded-full bg-[#F59E0B]" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs text-[#606060] truncate">{{ sel.match }}</p>
                        <p class="text-sm font-semibold text-white truncate">{{ sel.pick }}</p>
                      </div>
                      <span class="text-sm font-bold text-[#A32D2D] flex-shrink-0">{{ sel.odds }}</span>
                    </div>
  
                    <!-- Show more -->
                    <button
                      v-if="bet.selections.length > 2"
                      class="w-full mt-2 py-1.5 text-xs text-[#606060] hover:text-[#A32D2D] transition-colors text-center"
                      @click="toggleExpand(bet.id)"
                    >
                      {{ expandedBets.includes(bet.id)
                        ? '↑ Show less'
                        : `↓ Show ${bet.selections.length - 2} more selections` }}
                    </button>
                  </div>
  
                  <!-- Footer: odds + returns -->
                  <div class="px-4 py-3 bg-[#0D0D0D] flex items-center justify-between gap-4">
                    <div class="flex gap-4">
                      <div>
                        <p class="text-[10px] text-[#606060]">Total Odds</p>
                        <p class="text-xs font-bold text-white">{{ bet.totalOdds }}</p>
                      </div>
                      <div>
                        <p class="text-[10px] text-[#606060]">Stake</p>
                        <p class="text-xs font-bold text-white">TZS {{ bet.stake.toLocaleString() }}</p>
                      </div>
                      <div v-if="bet.status === 'won'">
                        <p class="text-[10px] text-[#606060]">Profit</p>
                        <p class="text-xs font-bold text-[#22C55E]">+TZS {{ (bet.returns - bet.stake).toLocaleString() }}</p>
                      </div>
                    </div>
  
                    <!-- Rebet -->
                    <AppButton variant="ghost" size="sm" @click="rebet(bet)">
                      🔁 Rebet
                    </AppButton>
                  </div>
                </div>
              </div>
  
              <!-- Load more history -->
              <button
                class="w-full mt-4 py-3.5 rounded-[12px] border border-[#2A2A2A] text-sm text-[#606060] hover:text-white hover:border-[#333] transition-all"
                @click="loadMoreHistory"
              >
                Load more history
              </button>
            </div>
  
            <!-- ===== STATISTICS ===== -->
            <div v-else-if="activeTab === 'stats'">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div
                  v-for="stat in bettingStats"
                  :key="stat.label"
                  class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-4"
                >
                  <p class="text-xs text-[#606060] mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-black" :class="stat.color">{{ stat.value }}</p>
                  <p v-if="stat.sub" class="text-[10px] text-[#606060] mt-1">{{ stat.sub }}</p>
                </div>
              </div>
  
              <!-- Win rate bar -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-5 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-white">Win Rate</h3>
                  <span class="text-sm font-bold text-[#22C55E]">{{ winRate }}%</span>
                </div>
                <div class="h-3 rounded-full bg-[#1E1E1E] overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-[#A32D2D] to-[#22C55E] transition-all duration-1000"
                    :style="{ width: winRate + '%' }"
                  />
                </div>
                <div class="flex justify-between text-[10px] text-[#606060] mt-2">
                  <span>{{ wonBets.length }} Won</span>
                  <span>{{ lostBets.length }} Lost</span>
                </div>
              </div>
  
              <!-- Sport breakdown -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-5 mb-4">
                <h3 class="text-sm font-bold text-white mb-4">Bets by Sport</h3>
                <div class="space-y-3">
                  <div
                    v-for="sport in sportBreakdown"
                    :key="sport.name"
                    class="flex items-center gap-3"
                  >
                    <span class="text-lg w-6">{{ sport.emoji }}</span>
                    <div class="flex-1">
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-[#A0A0A0] font-medium">{{ sport.name }}</span>
                        <span class="text-[#606060]">{{ sport.count }} bets</span>
                      </div>
                      <div class="h-2 rounded-full bg-[#1E1E1E] overflow-hidden">
                        <div
                          class="h-full rounded-full bg-[#A32D2D] transition-all duration-700"
                          :style="{ width: (sport.count / totalBetCount * 100) + '%' }"
                        />
                      </div>
                    </div>
                    <span
                      class="text-xs font-bold w-12 text-right"
                      :class="sport.profit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'"
                    >
                      {{ sport.profit >= 0 ? '+' : '' }}{{ sport.profit }}K
                    </span>
                  </div>
                </div>
              </div>
  
              <!-- Monthly P&L -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-5">
                <h3 class="text-sm font-bold text-white mb-4">Monthly P&L</h3>
                <div class="flex items-end gap-2 h-32">
                  <div
                    v-for="month in monthlyPnl"
                    :key="month.label"
                    class="flex-1 flex flex-col items-center gap-1"
                  >
                    <span
                      class="text-[9px] font-bold"
                      :class="month.value >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'"
                    >
                      {{ month.value >= 0 ? '+' : '' }}{{ month.value }}K
                    </span>
                    <div class="w-full flex flex-col justify-end" style="height: 80px;">
                      <div
                        class="w-full rounded-t-[4px] transition-all duration-700"
                        :class="month.value >= 0 ? 'bg-[#22C55E]/60' : 'bg-[#EF4444]/60'"
                        :style="{ height: (Math.abs(month.value) / maxPnl * 70) + 'px' }"
                      />
                    </div>
                    <span class="text-[9px] text-[#606060]">{{ month.label }}</span>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
  
          <!-- ===== RIGHT SIDEBAR: Quick summary (desktop) ===== -->
          <aside class="hidden lg:block w-72 flex-shrink-0 space-y-4">
  
            <!-- Balance card -->
            <div class="bg-gradient-to-br from-[#1a0505] to-[#161616] border border-[#A32D2D]/20 rounded-[18px] p-5">
              <p class="text-xs text-[#606060] mb-1">Available Balance</p>
              <p class="text-3xl font-black text-white mb-3">TZS <span class="text-[#A32D2D]">125,000</span></p>
              <div class="flex gap-2">
                <AppButton variant="primary" size="sm" fullWidth @click="$router.push('/wallet')">
                  Deposit
                </AppButton>
                <AppButton variant="secondary" size="sm" fullWidth @click="$router.push('/wallet')">
                  Withdraw
                </AppButton>
              </div>
            </div>
  
            <!-- Quick stats -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <h3 class="text-sm font-bold text-white mb-4">This Month</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[#606060]">Total Staked</span>
                  <span class="text-sm font-bold text-white">TZS 480,000</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[#606060]">Total Returns</span>
                  <span class="text-sm font-bold text-[#22C55E]">TZS 612,000</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[#606060]">Net Profit</span>
                  <span class="text-sm font-bold text-[#22C55E]">+TZS 132,000</span>
                </div>
                <div class="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                  <span class="text-xs text-[#606060]">Win Rate</span>
                  <span class="text-sm font-bold text-white">{{ winRate }}%</span>
                </div>
              </div>
            </div>
  
            <!-- Responsible gambling -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-lg">🛡️</span>
                <h3 class="text-sm font-bold text-white">Bet Responsibly</h3>
              </div>
              <div class="space-y-2 mb-4">
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-[#606060]">Daily limit</span>
                    <span class="text-[#A0A0A0]">TZS 50,000 / 100,000</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-[#1E1E1E]">
                    <div class="h-full w-1/2 rounded-full bg-[#F59E0B]" />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-[#606060]">Weekly limit</span>
                    <span class="text-[#A0A0A0]">TZS 280,000 / 500,000</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-[#1E1E1E]">
                    <div class="h-full rounded-full bg-[#22C55E]" style="width: 56%" />
                  </div>
                </div>
              </div>
              <AppButton variant="ghost" size="sm" fullWidth>
                Set Limits
              </AppButton>
            </div>
  
          </aside>
        </div>
      </div>
  
      <!-- ===== CASHOUT MODAL ===== -->
      <AppModal
        v-model="showCashoutModal"
        title="Cash Out"
        subtitle="Secure your winnings now"
        size="sm"
      >
        <div v-if="cashoutBet" class="space-y-4">
          <div class="bg-[#0D0D0D] rounded-[12px] p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#606060]">Original stake</span>
              <span class="text-white font-semibold">TZS {{ cashoutBet.stake.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#606060]">Potential win</span>
              <span class="text-white font-semibold">TZS {{ cashoutBet.potentialWin.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm border-t border-[#2A2A2A] pt-2">
              <span class="text-[#606060]">Cashout value</span>
              <span class="text-[#F59E0B] font-black text-base">TZS {{ cashoutBet.cashoutValue.toLocaleString() }}</span>
            </div>
          </div>
  
          <p class="text-xs text-[#606060] text-center">
            Cashing out will settle your bet immediately for TZS {{ cashoutBet.cashoutValue.toLocaleString() }}.
          </p>
        </div>
  
        <template #footer>
          <AppButton variant="secondary" fullWidth @click="showCashoutModal = false">
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            fullWidth
            :loading="cashingOut === cashoutBet?.id"
            loading-text="Processing..."
            @click="confirmCashout"
          >
            💰 Confirm Cashout
          </AppButton>
        </template>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AppButton from '../components/ui/AppButton.vue'
  import AppModal  from '../components/ui/AppModal.vue'
  
  const router = useRouter()
  
  // ---- Tabs ----
  const activeTab = ref('active')
  
  const tabs = computed(() => [
    { id: 'active',  label: '🟡 Active',  count: activeBets.value.length   },
    { id: 'history', label: '📋 History', count: betHistory.value.length    },
    { id: 'stats',   label: '📊 Stats',   count: ''                         },
  ])
  
  // ---- Active bets ----
  const activeBets = ref([
    {
      id: 'SB001',
      type: 'Accumulator',
      placedAt: 'Today, 14:32',
      stake: 10000,
      totalOdds: '12.50',
      potentialWin: 125000,
      cashoutValue: 42000,
      cashoutEligible: true,
      selections: [
        { match: 'Man United vs Chelsea',   pick: 'Man United Win', market: '1X2',         odds: '2.10', status: 'won',     liveScore: null        },
        { match: 'Barcelona vs Atletico',   pick: 'Barcelona Win',  market: '1X2',         odds: '1.50', status: 'won',     liveScore: null        },
        { match: 'PSG vs Dortmund',         pick: 'Over 2.5',       market: 'Over/Under',  odds: '1.80', status: 'pending', liveScore: '2-2 78\''  },
        { match: 'Lakers vs Warriors',      pick: 'Warriors Win',   market: 'Match Winner', odds: '1.55', status: 'pending', liveScore: '88-92 Q3'  },
        { match: 'Djokovic vs Alcaraz',     pick: 'Alcaraz Win',    market: 'Match Winner', odds: '1.80', status: 'pending', liveScore: 'Set 2-1'   },
      ],
    },
    {
      id: 'SB002',
      type: 'Single',
      placedAt: 'Today, 16:10',
      stake: 25000,
      totalOdds: '2.35',
      potentialWin: 58750,
      cashoutValue: 31000,
      cashoutEligible: true,
      selections: [
        { match: 'AC Milan vs Juventus', pick: 'AC Milan Win', market: '1X2', odds: '2.35', status: 'pending', liveScore: null },
      ],
    },
    {
      id: 'SB003',
      type: 'Double',
      placedAt: 'Yesterday, 20:00',
      stake: 15000,
      totalOdds: '5.70',
      potentialWin: 85500,
      cashoutValue: null,
      cashoutEligible: false,
      selections: [
        { match: 'Simba vs Young Africans', pick: 'Simba Win',  market: '1X2', odds: '1.95', status: 'won',     liveScore: null },
        { match: 'Azam vs Coastal Union',   pick: 'Azam Win',   market: '1X2', odds: '2.20', status: 'pending', liveScore: null },
      ],
    },
  ])
  
  // ---- Bet history ----
  const betHistory = ref([
    {
      id: 'SB000',
      type: 'Accumulator',
      status: 'won',
      placedAt: 'Yesterday, 18:00',
      stake: 20000,
      totalOdds: '15.30',
      returns: 306000,
      sport: 'football',
      selections: [
        { match: 'Arsenal vs Liverpool',    pick: 'Arsenal Win',  market: '1X2',          odds: '2.60', status: 'won' },
        { match: 'Real Madrid vs Sevilla',  pick: 'Real Madrid',  market: '1X2',          odds: '1.55', status: 'won' },
        { match: 'Bayern vs Leverkusen',    pick: 'Over 3.5',     market: 'Over/Under',   odds: '2.10', status: 'won' },
        { match: 'Inter vs Napoli',         pick: 'BTTS Yes',     market: 'BTTS',         odds: '1.80', status: 'won' },
      ],
    },
    {
      id: 'SB-1',
      type: 'Single',
      status: 'lost',
      placedAt: '2 days ago, 21:30',
      stake: 30000,
      totalOdds: '3.40',
      returns: 0,
      sport: 'football',
      selections: [
        { match: 'Man City vs Tottenham', pick: 'Draw', market: '1X2', odds: '3.40', status: 'lost' },
      ],
    },
    {
      id: 'SB-2',
      type: 'Double',
      status: 'won',
      placedAt: '3 days ago, 15:00',
      stake: 10000,
      totalOdds: '4.35',
      returns: 43500,
      sport: 'basketball',
      selections: [
        { match: 'Lakers vs Celtics',   pick: 'Lakers Win',  market: 'Match Winner', odds: '2.10', status: 'won' },
        { match: 'Bulls vs Heat',       pick: 'Over 215.5',  market: 'Over/Under',   odds: '1.90', status: 'won' },
      ],
    },
    {
      id: 'SB-3',
      type: 'Single',
      status: 'lost',
      placedAt: '4 days ago, 17:00',
      stake: 50000,
      totalOdds: '1.85',
      returns: 0,
      sport: 'tennis',
      selections: [
        { match: 'Djokovic vs Alcaraz', pick: 'Djokovic Win', market: 'Match Winner', odds: '1.85', status: 'lost' },
      ],
    },
    {
      id: 'SB-4',
      type: 'Accumulator',
      status: 'lost',
      placedAt: '5 days ago, 12:00',
      stake: 5000,
      totalOdds: '28.00',
      returns: 0,
      sport: 'football',
      selections: [
        { match: 'Chelsea vs Arsenal',     pick: 'Chelsea Win', market: '1X2', odds: '2.80', status: 'won'  },
        { match: 'Liverpool vs Man City',  pick: 'Liverpool',   market: '1X2', odds: '2.50', status: 'won'  },
        { match: 'Barca vs Atletico',      pick: 'Draw',        market: '1X2', odds: '3.20', status: 'lost' },
      ],
    },
    {
      id: 'SB-5',
      type: 'Single',
      status: 'won',
      placedAt: '6 days ago, 20:00',
      stake: 40000,
      totalOdds: '2.20',
      returns: 88000,
      sport: 'football',
      selections: [
        { match: 'Simba vs Young Africans', pick: 'Simba Win', market: '1X2', odds: '2.20', status: 'won' },
      ],
    },
  ])
  
  // ---- Filters ----
  const historyFilter = ref('all')
  const dateFilter    = ref('all')
  const sportFilter   = ref('all')
  const expandedBets  = ref([])
  
  const historyFilters = [
    { id: 'all',  label: 'All'  },
    { id: 'won',  label: '✅ Won'  },
    { id: 'lost', label: '❌ Lost' },
  ]
  
  const dateFilters = [
    { id: 'all',   label: 'All time' },
    { id: 'today', label: 'Today'    },
    { id: 'week',  label: 'Week'     },
    { id: 'month', label: 'Month'    },
  ]
  
  const filteredHistory = computed(() => {
    let list = betHistory.value
    if (historyFilter.value !== 'all') list = list.filter(b => b.status === historyFilter.value)
    if (sportFilter.value   !== 'all') list = list.filter(b => b.sport  === sportFilter.value)
    return list
  })
  
  // ---- Computed helpers ----
  const wonBets  = computed(() => betHistory.value.filter(b => b.status === 'won'))
  const lostBets = computed(() => betHistory.value.filter(b => b.status === 'lost'))
  const winRate  = computed(() => {
    const total = wonBets.value.length + lostBets.value.length
    return total ? Math.round(wonBets.value.length / total * 100) : 0
  })
  
  const totalBetCount = computed(() =>
    sportBreakdown.value.reduce((sum, s) => sum + s.count, 0)
  )
  
  // ---- Stats ----
  const bettingStats = computed(() => [
    { label: 'Total Bets',  value: betHistory.value.length + activeBets.value.length, color: 'text-white',       sub: 'All time' },
    { label: 'Win Rate',    value: winRate.value + '%',  color: 'text-[#22C55E]',    sub: 'All time'             },
    { label: 'Best Win',    value: 'TZS 306K',          color: 'text-[#F59E0B]',    sub: 'Accumulator x4'       },
    { label: 'Total Profit',value: '+TZS 132K',         color: 'text-[#22C55E]',    sub: 'This month'           },
  ])
  
  const sportBreakdown = ref([
    { name: 'Football',   emoji: '⚽', count: 28, profit:  285 },
    { name: 'Basketball', emoji: '🏀', count: 8,  profit:  33  },
    { name: 'Tennis',     emoji: '🎾', count: 6,  profit: -50  },
    { name: 'Cricket',    emoji: '🏏', count: 2,  profit: -10  },
  ])
  
  const monthlyPnl = ref([
    { label: 'Dec', value: -80  },
    { label: 'Jan', value:  120 },
    { label: 'Feb', value: -40  },
    { label: 'Mar', value:  200 },
    { label: 'Apr', value:  85  },
    { label: 'May', value:  132 },
  ])
  
  const maxPnl = computed(() =>
    Math.max(...monthlyPnl.value.map(m => Math.abs(m.value)))
  )
  
  // ---- Cashout ----
  const showCashoutModal = ref(false)
  const cashingOut       = ref(null)
  const cashoutBet       = ref(null)
  
  const handleCashout = (bet) => {
    cashoutBet.value     = bet
    showCashoutModal.value = true
  }
  
  const confirmCashout = async () => {
    if (!cashoutBet.value) return
    cashingOut.value = cashoutBet.value.id
  
    await new Promise(r => setTimeout(r, 1800))
  
    // Remove from active, add to history as 'cashout'
    const index = activeBets.value.findIndex(b => b.id === cashoutBet.value.id)
    if (index >= 0) activeBets.value.splice(index, 1)
  
    cashingOut.value     = null
    showCashoutModal.value = false
    cashoutBet.value     = null
  }
  
  // ---- Helpers ----
  const toggleExpand = (id) => {
    const i = expandedBets.value.indexOf(id)
    i >= 0
      ? expandedBets.value.splice(i, 1)
      : expandedBets.value.push(id)
  }
  
  const betTypeBadge = (type) => {
    const map = {
      'Single':      'bg-[#1E1E1E] text-[#A0A0A0]',
      'Double':      'bg-[#A32D2D]/15 text-[#C94040]',
      'Accumulator': 'bg-[#F59E0B]/15 text-[#F59E0B]',
    }
    return map[type] || map['Single']
  }
  
  const selectionStatusClass = (status) => ({
    won:     { bg: 'bg-[#22C55E]',        text: 'text-[#22C55E]'  },
    lost:    { bg: 'bg-[#EF4444]',        text: 'text-[#EF4444]'  },
    pending: { bg: 'bg-[#F59E0B]/20',     text: 'text-[#F59E0B]'  },
  }[status] || { bg: 'bg-[#1E1E1E]', text: 'text-[#606060]' })
  
  const shareBet  = (bet) => console.log('Share bet:', bet.id)
  const rebet     = (bet) => console.log('Rebet:', bet.id)
  const loadMoreHistory = () => console.log('Load more...')
  </script>