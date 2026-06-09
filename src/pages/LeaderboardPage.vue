<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== HERO ===== -->
      <div class="relative overflow-hidden bg-gradient-to-br from-[#1a0f00] to-[#0D0D0D] border-b border-[#1E1E1E]">
        <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F59E0B]/10 blur-[120px] pointer-events-none" />
        <div class="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
          <div class="text-center mb-8">
            <span class="text-5xl mb-3 block">🏆</span>
            <h1 class="text-3xl font-black text-white mb-2">
              Leaderboard & <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]">VIP Club</span>
            </h1>
            <p class="text-[#606060] text-sm">Top bettors this month. Climb the ranks to unlock exclusive VIP rewards.</p>
          </div>
  
          <!-- Top 3 podium -->
          <div class="flex items-end justify-center gap-4 max-w-lg mx-auto">
            <!-- 2nd -->
            <div class="flex-1 text-center">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#8A8A8A] to-[#C0C0C0] mx-auto flex items-center justify-center text-2xl font-black text-white border-4 border-[#C0C0C0]/30 mb-2">
                {{ top3[1]?.initials }}
              </div>
              <p class="text-xs font-bold text-white truncate">{{ top3[1]?.name }}</p>
              <p class="text-[10px] text-[#C0C0C0] font-semibold">{{ top3[1]?.earnings }}</p>
              <div class="mt-2 bg-[#C0C0C0]/20 border border-[#C0C0C0]/30 rounded-t-[8px] h-16 flex items-center justify-center">
                <span class="text-2xl">🥈</span>
              </div>
            </div>
  
            <!-- 1st -->
            <div class="flex-1 text-center">
              <div class="relative">
                <span class="text-2xl absolute -top-4 left-1/2 -translate-x-1/2">👑</span>
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] mx-auto flex items-center justify-center text-3xl font-black text-white border-4 border-[#F59E0B]/40 shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-2">
                  {{ top3[0]?.initials }}
                </div>
              </div>
              <p class="text-sm font-black text-white truncate">{{ top3[0]?.name }}</p>
              <p class="text-xs text-[#F59E0B] font-bold">{{ top3[0]?.earnings }}</p>
              <div class="mt-2 bg-[#F59E0B]/20 border border-[#F59E0B]/30 rounded-t-[8px] h-24 flex items-center justify-center">
                <span class="text-3xl">🥇</span>
              </div>
            </div>
  
            <!-- 3rd -->
            <div class="flex-1 text-center">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#78350f] to-[#d97706] mx-auto flex items-center justify-center text-2xl font-black text-white border-4 border-[#d97706]/30 mb-2">
                {{ top3[2]?.initials }}
              </div>
              <p class="text-xs font-bold text-white truncate">{{ top3[2]?.name }}</p>
              <p class="text-[10px] text-[#d97706] font-semibold">{{ top3[2]?.earnings }}</p>
              <div class="mt-2 bg-[#d97706]/20 border border-[#d97706]/30 rounded-t-[8px] h-10 flex items-center justify-center">
                <span class="text-xl">🥉</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-8">
        <div class="flex gap-6">
  
          <!-- ===== MAIN: Leaderboard + VIP ===== -->
          <div class="flex-1 min-w-0">
  
            <!-- Tabs -->
            <div class="flex gap-1 p-1 bg-[#161616] rounded-[14px] border border-[#2A2A2A] mb-6 w-fit">
              <button
                v-for="tab in ['Leaderboard', 'VIP Tiers', 'My Rewards']"
                :key="tab"
                class="px-5 py-2 text-sm font-semibold rounded-[10px] transition-all"
                :class="activeTab === tab
                  ? 'bg-[#A32D2D] text-white shadow-[0_4px_12px_rgba(163,45,45,0.35)]'
                  : 'text-[#606060] hover:text-white'"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>
  
            <!-- ===== LEADERBOARD TAB ===== -->
            <div v-if="activeTab === 'Leaderboard'">
  
              <!-- Period filter -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A]">
                  <button
                    v-for="period in ['Weekly', 'Monthly', 'All Time']"
                    :key="period"
                    class="px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
                    :class="activePeriod === period
                      ? 'bg-[#2A2A2A] text-white'
                      : 'text-[#606060] hover:text-white'"
                    @click="activePeriod = period"
                  >
                    {{ period }}
                  </button>
                </div>
                <p class="text-xs text-[#606060]">Updated every 5 minutes</p>
              </div>
  
              <!-- Table -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
                <!-- Header -->
                <div class="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[#1E1E1E] text-[10px] font-bold text-[#606060] uppercase tracking-wider">
                  <div class="col-span-1">#</div>
                  <div class="col-span-5">Player</div>
                  <div class="col-span-2 text-center">Bets</div>
                  <div class="col-span-2 text-center">Win %</div>
                  <div class="col-span-2 text-right">Earnings</div>
                </div>
  
                <!-- Rows -->
                <div class="divide-y divide-[#1E1E1E]">
                  <div
                    v-for="(player, index) in leaderboard"
                    :key="player.id"
                    class="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-[#1E1E1E] transition-colors"
                    :class="player.isMe ? 'bg-[#A32D2D]/5 border-l-2 border-[#A32D2D]' : ''"
                  >
                    <!-- Rank -->
                    <div class="col-span-1">
                      <div
                        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        :class="index === 0 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                 index === 1 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
                                 index === 2 ? 'bg-[#d97706]/20 text-[#d97706]' :
                                 'bg-[#1E1E1E] text-[#606060]'"
                      >
                        {{ index < 3 ? ['🥇','🥈','🥉'][index] : index + 1 }}
                      </div>
                    </div>
  
                    <!-- Player -->
                    <div class="col-span-5 flex items-center gap-3 min-w-0">
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        :style="{ background: player.color }"
                      >
                        {{ player.initials }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                          <p class="text-sm font-semibold text-white truncate">{{ player.name }}</p>
                          <span v-if="player.isMe" class="text-[9px] px-1.5 py-0.5 rounded-full bg-[#A32D2D]/20 text-[#A32D2D] font-bold">YOU</span>
                        </div>
                        <div class="flex items-center gap-1.5 mt-0.5">
                          <span class="text-[10px]">{{ player.vipBadge }}</span>
                          <span class="text-[10px] text-[#606060]">{{ player.location }}</span>
                        </div>
                      </div>
                    </div>
  
                    <!-- Bets -->
                    <div class="col-span-2 text-center">
                      <p class="text-sm font-bold text-white">{{ player.bets }}</p>
                    </div>
  
                    <!-- Win rate -->
                    <div class="col-span-2 text-center">
                      <p class="text-sm font-bold" :class="player.winRate >= 60 ? 'text-[#22C55E]' : 'text-[#A0A0A0]'">
                        {{ player.winRate }}%
                      </p>
                    </div>
  
                    <!-- Earnings -->
                    <div class="col-span-2 text-right">
                      <p class="text-sm font-black text-[#F59E0B]">{{ player.earnings }}</p>
                      <p class="text-[10px] text-[#606060]">{{ player.trend }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- ===== VIP TIERS TAB ===== -->
            <div v-else-if="activeTab === 'VIP Tiers'" class="space-y-4">
              <div
                v-for="tier in vipTiers"
                :key="tier.name"
                class="relative overflow-hidden rounded-[18px] border transition-all"
                :class="tier.current
                  ? 'border-[#A32D2D]/40 shadow-[0_0_24px_rgba(163,45,45,0.15)]'
                  : 'border-[#2A2A2A]'"
                :style="{ background: tier.bg }"
              >
                <div v-if="tier.current" class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A32D2D] to-[#C94040]" />
  
                <div class="p-5">
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-3xl">{{ tier.emoji }}</span>
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-base font-black text-white">{{ tier.name }}</h3>
                          <span v-if="tier.current" class="text-[10px] px-2 py-0.5 rounded-full bg-[#A32D2D]/20 text-[#A32D2D] font-bold border border-[#A32D2D]/30">
                            CURRENT
                          </span>
                        </div>
                        <p class="text-xs text-[#606060] mt-0.5">{{ tier.requirement }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold" :style="{ color: tier.color }">{{ tier.cashback }}</p>
                      <p class="text-xs text-[#606060]">Weekly cashback</p>
                    </div>
                  </div>
  
                  <!-- Benefits -->
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="benefit in tier.benefits"
                      :key="benefit"
                      class="flex items-center gap-2 text-xs text-[#A0A0A0]"
                    >
                      <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :style="{ color: tier.color }">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {{ benefit }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- ===== MY REWARDS TAB ===== -->
            <div v-else class="space-y-4">
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
                <h3 class="text-sm font-bold text-white mb-4">My Rewards</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="reward in myRewards"
                    :key="reward.id"
                    class="bg-[#1E1E1E] rounded-[12px] p-4 text-center"
                    :class="reward.claimed ? 'opacity-50' : ''"
                  >
                    <span class="text-3xl mb-2 block">{{ reward.emoji }}</span>
                    <p class="text-xs font-bold text-white mb-1">{{ reward.title }}</p>
                    <p class="text-[10px] text-[#606060] mb-3">{{ reward.description }}</p>
                    <AppButton
                      :variant="reward.claimed ? 'ghost' : 'primary'"
                      size="sm"
                      fullWidth
                      :disabled="reward.claimed"
                    >
                      {{ reward.claimed ? '✅ Claimed' : 'Claim' }}
                    </AppButton>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
  
          <!-- ===== RIGHT SIDEBAR ===== -->
          <aside class="hidden lg:block w-72 flex-shrink-0 space-y-4">
  
            <!-- My rank card -->
            <div class="bg-gradient-to-br from-[#1a0505] to-[#161616] border border-[#A32D2D]/20 rounded-[18px] p-5">
              <p class="text-xs text-[#606060] mb-3">Your Ranking</p>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#A32D2D] to-[#7A1F1F] flex items-center justify-center text-lg font-black text-white">
                  JD
                </div>
                <div>
                  <p class="text-base font-black text-white">#8 this month</p>
                  <p class="text-xs text-[#606060]">Top 10% of bettors</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-[#606060]">Points to #7</span>
                  <span class="text-white font-semibold">245 XP needed</span>
                </div>
                <div class="h-1.5 rounded-full bg-[#1E1E1E]">
                  <div class="h-full w-4/5 rounded-full bg-[#A32D2D]" />
                </div>
              </div>
            </div>
  
            <!-- VIP current status -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xl">🏆</span>
                <h3 class="text-sm font-bold text-white">VIP Gold Status</h3>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-[#606060]">Cashback rate</span>
                  <span class="text-white font-semibold">15%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#606060]">Withdrawal limit</span>
                  <span class="text-white font-semibold">TZS 5M/day</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#606060]">Dedicated manager</span>
                  <span class="text-[#22C55E] font-semibold">Yes ✓</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#606060]">Free bets/week</span>
                  <span class="text-white font-semibold">TZS 5,000</span>
                </div>
              </div>
            </div>
  
            <!-- Referral -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <h3 class="text-sm font-bold text-white mb-1">Refer & Earn</h3>
              <p class="text-xs text-[#606060] mb-3">Get TZS 5,000 for every friend who signs up</p>
              <div class="flex gap-2">
                <div class="flex-1 px-3 py-2 rounded-[8px] bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#A0A0A0] font-mono truncate">
                  SUNBET-JD1234
                </div>
                <button
                  class="px-3 py-2 rounded-[8px] bg-[#A32D2D] text-white text-xs font-semibold hover:bg-[#7A1F1F] transition-colors"
                  @click="copyCode"
                >
                  {{ copied ? '✓' : 'Copy' }}
                </button>
              </div>
              <p class="text-xs text-[#606060] mt-2">14 friends referred • TZS 70,000 earned</p>
            </div>
  
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import AppButton from '../components/ui/AppButton.vue'
  
  const activeTab    = ref('Leaderboard')
  const activePeriod = ref('Monthly')
  const copied       = ref(false)
  
  const copyCode = () => {
    navigator.clipboard.writeText('SUNBET-JD1234')
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
  
  const top3 = [
    { initials: 'AK', name: 'Amina K.',  earnings: 'TZS 4.2M' },
    { initials: 'JM', name: 'James M.',  earnings: 'TZS 3.8M' },
    { initials: 'SM', name: 'Said M.',   earnings: 'TZS 2.9M' },
  ]
  
  const leaderboard = ref([
    { id: 1,  initials: 'AK', name: 'Amina K.',    color: '#A32D2D', location: 'Dar es Salaam', vipBadge: '👑', bets: 284, winRate: 71, earnings: 'TZS 4.2M', trend: '↑ +12%', isMe: false },
    { id: 2,  initials: 'JM', name: 'James M.',    color: '#7A1F1F', location: 'Mwanza',         vipBadge: '👑', bets: 210, winRate: 68, earnings: 'TZS 3.8M', trend: '↑ +8%',  isMe: false },
    { id: 3,  initials: 'SM', name: 'Said M.',     color: '#C94040', location: 'Arusha',         vipBadge: '🏆', bets: 198, winRate: 65, earnings: 'TZS 2.9M', trend: '↑ +5%',  isMe: false },
    { id: 4,  initials: 'FH', name: 'Fatuma H.',   color: '#6B1A1A', location: 'Dodoma',         vipBadge: '🏆', bets: 175, winRate: 62, earnings: 'TZS 2.1M', trend: '↓ -2%',  isMe: false },
    { id: 5,  initials: 'DM', name: 'David M.',    color: '#8B2020', location: 'Zanzibar',       vipBadge: '🥈', bets: 154, winRate: 60, earnings: 'TZS 1.8M', trend: '↑ +3%',  isMe: false },
    { id: 6,  initials: 'RM', name: 'Rose M.',     color: '#5C1515', location: 'Mbeya',          vipBadge: '🥈', bets: 142, winRate: 58, earnings: 'TZS 1.5M', trend: '↑ +1%',  isMe: false },
    { id: 7,  initials: 'BK', name: 'Baraka K.',   color: '#3D0E0E', location: 'Tanga',          vipBadge: '🥈', bets: 128, winRate: 57, earnings: 'TZS 1.2M', trend: '↓ -4%',  isMe: false },
    { id: 8,  initials: 'JD', name: 'John Doe',    color: '#A32D2D', location: 'Dar es Salaam', vipBadge: '🏆', bets: 114, winRate: 62, earnings: 'TZS 980K', trend: '↑ +7%',  isMe: true  },
    { id: 9,  initials: 'MK', name: 'Maria K.',    color: '#7A1F1F', location: 'Morogoro',       vipBadge: '🥉', bets: 98,  winRate: 54, earnings: 'TZS 820K', trend: '↑ +2%',  isMe: false },
    { id: 10, initials: 'TN', name: 'Tumaini N.',  color: '#C94040', location: 'Iringa',         vipBadge: '🥉', bets: 87,  winRate: 52, earnings: 'TZS 650K', trend: '↓ -1%',  isMe: false },
  ])
  
  const vipTiers = [
    {
      name: 'Bronze', emoji: '🥉', color: '#CD7F32', bg: '#161616',
      requirement: 'New members (0 - 999 XP)',
      cashback: '5% cashback',
      current: false,
      benefits: ['5% weekly cashback', 'Standard withdrawal', 'Email support', 'Basic promotions'],
    },
    {
      name: 'Silver', emoji: '🥈', color: '#C0C0C0', bg: '#1a1a1a',
      requirement: '1,000 - 2,499 XP',
      cashback: '8% cashback',
      current: false,
      benefits: ['8% weekly cashback', 'Priority withdrawal', 'Live chat support', 'Enhanced promotions', 'Free bet monthly'],
    },
    {
      name: 'Gold', emoji: '🏆', color: '#F59E0B', bg: 'linear-gradient(135deg, #1a1005, #161616)',
      requirement: '2,500 - 4,999 XP • Current tier',
      cashback: '15% cashback',
      current: true,
      benefits: ['15% weekly cashback', 'Fast-track withdrawal', 'Dedicated manager', 'VIP promotions', 'Weekly free bet', 'Higher bet limits'],
    },
    {
      name: 'Platinum', emoji: '💎', color: '#818CF8', bg: '#161616',
      requirement: '5,000 - 9,999 XP',
      cashback: '20% cashback',
      current: false,
      benefits: ['20% weekly cashback', 'Instant withdrawal', 'Personal VIP manager', 'Exclusive events', 'Daily free bets', 'Highest bet limits', 'Birthday bonus'],
    },
    {
      name: 'Diamond', emoji: '👑', color: '#EC4899', bg: '#161616',
      requirement: '10,000+ XP',
      cashback: '25% cashback',
      current: false,
      benefits: ['25% weekly cashback', 'Instant unlimited withdrawal', 'Concierge service', 'Private tournaments', 'Custom bonuses', 'Luxury gifts', 'Travel rewards'],
    },
  ]
  
  const myRewards = ref([
    { id: 1, emoji: '🎁', title: 'Welcome Bonus',     description: 'TZS 10,000 free bet', claimed: true  },
    { id: 2, emoji: '💰', title: 'Cashback Friday',   description: 'TZS 3,500 cashback',  claimed: false },
    { id: 3, emoji: '🏆', title: 'VIP Weekly Bonus',  description: 'TZS 5,000 free bet',  claimed: false },
    { id: 4, emoji: '🎂', title: 'Birthday Bonus',    description: 'TZS 20,000 gift',     claimed: false },
  ])
  </script>